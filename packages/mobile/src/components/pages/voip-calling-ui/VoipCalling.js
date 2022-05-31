import React, { Component } from 'react';
import {
  Platform,
  TextInput,
  TouchableOpacity,
  Button,
  Alert,
  Linking,
  StyleSheet,
  Text,
  View,
  Image,
  PermissionsAndroid,
  BackHandler,
} from 'react-native';
import InCallManager from 'react-native-incall-manager';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';

import {
  OpenViduReactNativeAdapter,
  OpenVidu,
  RTCView,
} from 'openvidu-react-native-adapter';
import SplashScreen from 'react-native-splash-screen';
import { mvs, width } from '../../../config/metrices';
import colors from '../../../config/colors';
import { TAKE_TO_IMAGES } from '../../../../resource/assets/call/videocall';
import Bold from '../../../presentation/typography/bold-text';
import Regular from '../../../presentation/typography/regular-text';
import services from '@khan_ahmad786/common/api/services';
import moment from 'moment';
import ImagePlaceholder from '../../atoms/Placeholder';
import { Timer } from 'react-native-element-timer';
const OPENVIDU_SERVER_URL = 'https://taketoov.exodevs.com';
const OPENVIDU_SERVER_SECRET = 'Dev321';

type Props = {};
export default class VoipCalling extends Component<Props> {
  constructor(props) {
    super(props);

    const ovReact = new OpenViduReactNativeAdapter();
    ovReact.initialize();
    this.state = {
      hour: 0,
      sec: 0,
      min: 0,
      mySessionId: props.route?.params?.sessionId || '',
      myUserName: props.route?.params?.name || '',
      session: undefined,
      mainStreamManager: undefined,
      subscribers: [],
      role: 'PUBLISHER',
      mirror: true,
      videoSource: undefined,
      video: true,
      audio: true,
      speaker: false,
      joinBtnEnabled: true,
      isReconnecting: false,
      isConnected: true,
      shouldStart: true,
    };
    this.timerRef = React.createRef(null);

  }

  backAction = () => {
    Alert.alert('Cancel Call?', 'Are you sure you want cancel the call?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: () => {
          this.leaveSession();
        },
      },
    ]);
    return true;
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backAction);
  }

  componentDidMount() {
    // Subscribe
    const unsubscribe = NetInfo.addEventListener(async state => {
      if (state.isConnected) {
        this.setState({ isConnected: true })
        console.log('conected');
        const response = await messangerClient.get(
          `${services.messanger.open_chat}/${this.props?.route?.params?.thread_id}/calls/${this.props?.route?.params?.call_id}`,
        );
      } else {
        // this.setState({ isConnected: false })
        this.setState({isConnected:false});
        // this.props.navigation.pop();
      }
    });

    // Unsubscribe
    //unsubscribe();
    BackHandler.addEventListener('hardwareBackPress', this.backAction);
    //SplashScreen.hide()
    this.joinSession();
  }

  // componentWillUnmount() {
  // this.leaveSession();
  // }

  async checkAndroidPermissions() {
    try {
      const camera = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'OpenVidu needs access to your camera',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      const audio = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Audio Permission',
          message: 'OpenVidu needs access to your microphone',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      const storage = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'STORAGE',
          message: 'OpenVidu  needs access to your storage ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (camera === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
      if (audio === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the audio');
      } else {
        console.log('audio permission denied');
      }
      if (storage === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the storage');
      } else {
        console.log('storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  joinSession() {
    // --- 1) Get an OpenVidu object ---

    this.OV = new OpenVidu();
    this.OV.enableProdMode();

    // --- 2) Init a session ---

    this.setState(
      {
        joinBtnEnabled: false,
        session: this.OV.initSession(),
      },
      async () => {
        const mySession = this.state.session;
        // --- 3) Specify the actions when events take place in the session ---

        // On every new Stream received...
        mySession.on('streamCreated', async event => {
          console.log('EVENTS :: ', event);
          // Subscribe to the Stream to receive it. Second parameter is undefined
          // so OpenVidu doesn't create an HTML video by its own
          const subscriber = await mySession.subscribeAsync(
            event.stream,
            undefined,
          );
          var subscribers = Array.from(this.state.subscribers);
          subscribers.push(subscriber);
          // Update the state with the new subscribers
          this.setState({
            subscribers: subscribers,
          });
        });

        // On every Stream destroyed...
        mySession.on('streamDestroyed', event => {
          event.preventDefault();
          // Remove the stream from 'subscribers' array
          this.deleteSubscriber(event.stream);
        });

        // On every asynchronous exception...
        mySession.on('exception', exception => {
          console.warn(exception);
        });

        // On reconnection events
        mySession.on('reconnecting', () => {
          console.warn('Oops! Trying to reconnect to the session');
          this.setState({ isReconnecting: true });
          setTimeout(() => {
            if (!this.state.isConnected) {
              this.props?.navigation?.pop();
            }
          }, 20000);
        
        });

        mySession.on('reconnected', () => {
          console.log('Hurray! You successfully reconnected to the session');
          setTimeout(() => {
            // Force re-render view updating state avoiding frozen streams
            this.setState({ isReconnecting: false,isConnected:true });
          }, 2000);
        });
        mySession.on('sessionDisconnected', event => {
          if (event.reason === 'networkDisconnect') {
            console.warn('Dang-it... You lost your connection to the session');
            this.leaveSession();
          } else {
            // Disconnected from the session for other reason than a network drop
          }
        });

        try {
          // --- 4) Connect to the session with a valid user token ---
          // 'getToken' method is simulating what your server-side should do.
          // 'token' parameter should be retrieved and returned by your own backend
          const token = await this.getToken();
          // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
          // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
          await mySession.connect(token, { clientData: this.state.myUserName });

          if (Platform.OS === 'android') {
            await this.checkAndroidPermissions();
          }

          // --- 5) Get your own camera stream ---
          if (this.state.role !== 'SUBSCRIBER') {
            const properties = {
              audioSource: undefined, // The source of audio. If undefined default microphone
              videoSource: undefined, // The source of video. If undefined default webcam
              publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
              publishVideo: true, // Whether you want to start publishing with your video enabled or not
              resolution: '640x480', // The resolution of your video
              frameRate: 30, // The frame rate of your video
              insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
            };

            // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
            // element: we will manage it on our own) and with the desired propertiesç

            const publisher = await this.OV.initPublisherAsync(
              undefined,
              properties,
            );
            // --- 6) Publish your stream ---

            // Set the main video in the page to display our webcam and store our Publisher
            this.setState(
              {
                mainStreamManager: publisher,
                videoSource: !properties.videoSource
                  ? '1'
                  : properties.videoSource, // 0: back camera | 1: user camera |
              },
              () => {
                mySession.publish(publisher);
              },
            );
          }
        } catch (error) {
          console.log(
            'There was an error connecting to the session:',
            error.code,
            error.message,
          );
          this.setState({
            joinBtnEnabled: true,
          });
        }
      },
    );
  }

  getNicknameTag(stream) {
    // Gets the nickName of the user
    try {
      if (
        stream.connection &&
        JSON.parse(stream.connection.data) &&
        JSON.parse(stream.connection.data).clientData
      ) {
        return JSON.parse(stream.connection.data).clientData;
      }
    } catch (error) { }
    return '';
  }

  deleteSubscriber(stream) {
    var subscribers = Array.from(this.state.subscribers);
    const index = subscribers.indexOf(stream.streamManager, 0);
    if (index > -1) {
      subscribers.splice(index, 1);
      this.setState({
        subscribers: subscribers,
      });
    }
  }

  async leaveSession() {
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---

    const mySession = this.state.session;

    if (mySession) {
      try {
        const response = await messangerClient.post(
          `${services.messanger.open_chat}/${this.props?.route?.params?.thread_id}/calls/${this.props?.route?.params?.call_id}/end`,
          {},
        );
        mySession.disconnect();
        // this.props?.navigation?.pop();
      } catch (error) {

        // this.props?.navigation?.pop();
      }
    }

    // Empty all properties...
    setTimeout(() => {
      this.OV = null;
      this.setState({
        session: undefined,
        subscribers: [],
        mySessionId: 'testReact',
        myUserName: 'Participant' + Math.floor(Math.random() * 100),
        mainStreamManager: undefined,
        publisher: undefined,
        joinBtnEnabled: true,
      });
    });
  }

  toggleCamera() {
    /**
     * _switchCamera() Method provided by react-native-webrtc:
     * This function allows to switch the front / back cameras in a video track on the fly, without the need for adding / removing tracks or renegotiating
     */

    const camera = this.state.mainStreamManager.stream
      .getMediaStream()
      .getVideoTracks()[0];
    if (camera) {
      camera._switchCamera();
      this.setState({ mirror: !this.state.mirror });
    }

    /**
     * Traditional way:
     * Renegotiating stream and init new publisher to change the camera
     */
    /*
    this.OV.getDevices().then(devices => {
      console.log("DEVICES => ", devices);
      let device = devices.filter(device => device.kind === 'videoinput' && device.deviceId !== this.state.videoSource)[0]
      const properties = {
        audioSource: undefined,
        videoSource: device.deviceId,
        publishAudio: true,
        publishVideo: true,
        resolution: '640x480',
        frameRate: 30,
        insertMode: 'APPEND',
      }

      let publisher = this.OV.initPublisher(undefined, properties);

      this.state.session.unpublish(this.state.mainStreamManager);

      this.setState({
        videoSource : device.deviceId,
        mainStreamManager: publisher,
        mirror: !this.state.mirror
      });
      this.state.session.publish(publisher);
    });
    */
  }

  muteUnmuteMic() {
    this.state.mainStreamManager.publishAudio(!this.state.audio);
    this.setState({ audio: !this.state.audio });
  }

  muteUnmuteCamera() {
    this.state.mainStreamManager.publishVideo(!this.state.video);
    this.setState({ video: !this.state.video });
  }

  muteUnmuteSpeaker() {
    InCallManager.setSpeakerphoneOn(!this.state.speaker);
    this.setState({ speaker: !this.state.speaker });
  }


  startTime() {
    var date = new Date(); /* creating object of Date class */

    var hour = this.state.hour; // if(){
    var min = this.state.min; // if(){
    var sec = this.state.sec; // if(){

    if (this.state.min >= 59) {
      hour = hour + 1;
    }
    if (this.state.sec >= 59) {
      min = min + 1;
    }
    if (this.state.sec >= 59) {
      sec = 0;
    } else {
      sec = sec + 1;
    }
    hour = this.updateTime(hour);
    min = this.updateTime(min);
    sec = this.updateTime(sec);

    this.setState({
      hour,
      min,
      sec,
    }) /* adding time to the div */
  }

  updateTime(k) {
    if (k < 10) {
      return k;
    } else {
      return k;
    }
  }




  render() {
    const time = moment().add(20, 'seconds');
    setTimeout(() => {
      if (
        new Date().getTime() > new Date(time).getTime() &&
        this.state.subscribers.length <= 0
      ) { 
        this.leaveSession();
      }
    }, 20000);

    if (this.state.subscribers.length > 0 && this.state.isConnected && this.timerRef) {

      setTimeout(() => {
        // this.startTime();
        // if(this.state.isConnected&& this.timerRef)
        if (this.state.shouldStart)
          this.timerRef?.current?.start();
          this.setState({ shouldStart: false });
      }, 1000);
    }



    return (
      <>
        {this.props.route?.params?.call?.type_verbose === 'VIDEO' ? (
          <View
            style={{
              flex: 1,
              backgroundColor: colors.black,
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            {this.state.mainStreamManager &&
              this.state.mainStreamManager.stream ? (
              <>
                <View style={{ flex: 1 }}>
                  {this.state.subscribers?.length <= 0 && (
                    <View
                      style={{
                        top: mvs(40),
                        alignSelf: 'center',
                        position: 'absolute',
                        width: width,
                        zIndex: 1001,
                      }}>
                      <Bold
                        label={'Connecting...'}
                        style={{
                          fontSize: mvs(20),
                          color: colors.black,
                          textAlign: 'center',
                        }}
                      />
                      <View style={{ flex: 1, alignItems: 'center' }}>
                        <ImagePlaceholder
                          bg_img={this.props.route?.params?.profile_picture}

                          // bg_img={`${services?.base_url.replace(
                          //   'v1/',
                          //   '',
                          // )}${(this.props.route?.params?.sender?.base?.profile_picture).replace(
                          //   'size',
                          //   '512x512',
                          // )}`}
                          containerStyle={{
                            height: mvs(150),
                            width: mvs(150),
                            borderRadius: mvs(150),
                            marginVertical: mvs(20),
                          }}
                        />
                        <Bold style={{ textAlign: 'center', color: colors.white, fontSize: mvs(24), marginBottom: mvs(10) }} label={this.props.route?.params?.meta?.thread_name} />
                      </View>
                    </View>
                  )}
                  <RTCView
                    zOrder={0}
                    objectFit="cover"
                    mirror={this.state.mirror}
                    // streamURL={"9ce78008-269d-48ba-b506-122fed2e0a68"}
                    streamURL={this.state.mainStreamManager.stream
                      .getMediaStream()
                      .toURL()}
                    style={styles.selfView}
                  />
                  {/* <View style={{marginLeft:mvs(10)}}>
									<Bold  label={"Zohaib Ahmad"} style={{fontSize:mvs(20),color:colors.white}}/>
									<Regular  label={"Timmer"} style={{fontSize:mvs(20),color:colors.white}}/>
								</View> */}
                </View>
                <View
                  style={{ zIndex: 1001, position: 'absolute', bottom: mvs(40) }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      width: width - mvs(20),
                    }}>
                    <TouchableOpacity
                      onLongPress={() => this.toggleCamera()}
                      onPress={() => this.toggleCamera()}
                      style={{
                        height: mvs(40),
                        width: mvs(40),
                        borderRadius: mvs(20),
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: colors.white,
                        ...colors.shadow,
                      }}>
                      <Image
                        style={{ height: mvs(25), width: mvs(25) }}
                        source={require('./../../../../resource/assets/call/videocall/flip.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onLongPress={() => this.muteUnmuteMic()}
                      onPress={() => this.muteUnmuteMic()}
                      style={{
                        height: mvs(40),
                        width: mvs(40),
                        borderRadius: mvs(20),
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: colors.white,
                        ...colors.shadow,
                      }}>
                      <Image
                        style={{ height: mvs(25), width: mvs(25) }}
                        source={
                          this.state.audio
                            ? require('./../../../../resource/assets/call/videocall/microphone.png')
                            : require('./../../../../resource/assets/call/videocall/microphone_mute.png')
                        }
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onLongPress={() => this.muteUnmuteSpeaker()}
                      onPress={() => this.muteUnmuteSpeaker()}
                      style={{
                        height: mvs(40),
                        width: mvs(40),
                        borderRadius: mvs(20),
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: colors.white,
                        ...colors.shadow,
                      }}>
                      <Image
                        style={{ height: mvs(25), width: mvs(25) }}
                        source={
                          !this.state.speaker
                            ? require('./../../../../resource/assets/call/videocall/loud_speaker.png')
                            : require('./../../../../resource/assets/call/videocall/loud_speaker_mute.png')
                        }
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onLongPress={() => this.muteUnmuteCamera()}
                      onPress={() => this.muteUnmuteCamera()}
                      style={{
                        height: mvs(40),
                        width: mvs(40),
                        borderRadius: mvs(20),
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: colors.white,
                        ...colors.shadow,
                      }}>
                      <Image
                        style={{ height: mvs(25), width: mvs(25) }}
                        source={
                          !this.state.video
                            ? require('./../../../../resource/assets/call/videocall/video_camera.png')
                            : require('./../../../../resource/assets/call/videocall/no-video.png')
                        }
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onLongPress={() => this.leaveSession()}
                      onPress={() => this.leaveSession()}
                      style={{
                        height: mvs(40),
                        width: mvs(40),
                        borderRadius: mvs(20),
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'red',
                        ...colors.shadow,
                      }}>
                      <Image
                        style={{ tintColor: colors.white, height: mvs(25), width: mvs(25) }}
                        source={require('./../../../../resource/assets/call/videocall/phone.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            ) : (
              <View style={{ width: width }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                  }}>
                  <Bold
                    label={'Connecting...'}
                    style={{ fontSize: mvs(20), color: colors.white }}
                  />
                </View>
                {/* <View style={{ justifyContent: 'center', alignItems: 'center' }}>
							<TextInput
								style={{ width: '90%', height: 40, borderColor: 'gray', borderWidth: 1 }}
								onChangeText={(mySessionId) => this.setState({ mySessionId })}
								value={this.state.mySessionId}
							/>
						</View> */}

                {/* <View style={styles.button}>
							<Button
								disabled={!this.state.joinBtnEnabled}
								onLongPress={() => this.joinSession()}
								onPress={() => this.joinSession()}
								title="Join"
								color="#841584"
							/>
						</View> */}
              </View>
            )}
            {/* {console.log(this.state)} */}
            {this.state.subscribers?.length > 0 && (
              <View style={{ flex: 1, width: width, alignSelf: 'center' }}>
                <View>
                  <RTCView
                    zOrder={0}
                    objectFit="cover"
                    style={styles.remoteView}
                    streamURL={this.state.subscribers[0].stream
                      .getMediaStream()
                      .toURL()}
                  />
                </View>
              </View>
            )}
          </View>
        ) : (
          <>
            <View
              style={{
                flex: 1,
                paddingVertical: mvs(40),
                backgroundColor: colors.primary,
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              {this.state.mainStreamManager &&
                this.state.mainStreamManager.stream ? (
                <>
                  <View style={{ flex: 1 }}>

                    <View style={{ flex: 1, alignItems: 'center', marginTop: mvs(100) }}>
                      <ImagePlaceholder
                        bg_img={this.props.route?.params?.profile_picture}
                        containerStyle={{
                          height: mvs(150),
                          width: mvs(150),
                          borderRadius: mvs(150),
                          marginVertical: mvs(20),
                        }}
                      />
                      <Bold style={{ textAlign: 'center', color: colors.white, fontSize: mvs(24), marginBottom: mvs(10) }} label={this.props.route?.params?.name} />
                      {(this.state.subscribers.length<=0)?
                        <Regular
                        label={'Connecting...'}
                      style={{ textAlign: 'center', color: colors.white }}
                      />:
                      
                      <Timer
                        ref={this.timerRef}
                        style={styles.timer}
                        textStyle={styles.timerText}
                        onTimes={e => { }}
                        onPause={e => { }}
                        onEnd={e => { }}
                      />}
                      {/* <Bold label={order_obj?.participant_name} style={{ textAlign: 'center', fontSize: mvs(30), color: colors.white, marginTop: mvs(20), }} /> */}
                    </View>
                  </View>
                  <View
                    style={{
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        width: width - mvs(20),
                      }}>
                      <TouchableOpacity
                        onLongPress={() => this.muteUnmuteMic()}
                        onPress={() => this.muteUnmuteMic()}
                        style={{
                          height: mvs(40),
                          width: mvs(40),
                          borderRadius: mvs(20),
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: colors.white,
                          ...colors.shadow,
                        }}>
                        <Image
                          style={{ height: mvs(25), width: mvs(25) }}
                          source={
                            this.state.audio
                              ? require('./../../../../resource/assets/call/videocall/microphone.png')
                              : require('./../../../../resource/assets/call/videocall/microphone_mute.png')
                          }
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onLongPress={() => this.muteUnmuteSpeaker()}
                        onPress={() => this.muteUnmuteSpeaker()}
                        style={{
                          height: mvs(40),
                          width: mvs(40),
                          borderRadius: mvs(20),
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: colors.white,
                          ...colors.shadow,
                        }}>
                        <Image
                          style={{ height: mvs(25), width: mvs(25) }}
                          source={
                            !this.state.speaker
                              ? require('./../../../../resource/assets/call/videocall/loud_speaker.png')
                              : require('./../../../../resource/assets/call/videocall/loud_speaker_mute.png')
                          }
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onLongPress={() => this.leaveSession()}
                        onPress={() => this.leaveSession()}
                        style={{
                          height: mvs(40),
                          width: mvs(40),
                          borderRadius: mvs(20),
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: 'red',
                          ...colors.shadow,
                        }}>
                        <Image
                          style={{ tintColor: colors.white, height: mvs(25), width: mvs(25) }}
                          source={require('./../../../../resource/assets/call/videocall/phone.png')}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              ) : (
                <View style={{ width: width }}>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <Bold
                      label={'Connecting...'}
                      style={{ fontSize: mvs(20), color: colors.white }}
                    />
                  </View>
                </View>
              )}
            </View>
          </>
        )}
      </>
    );
  }

  /**
   * --------------------------
   * SERVER-SIDE RESPONSIBILITY
   * --------------------------
   * These methods retrieve the mandatory user token from OpenVidu Server.
   * This behavior MUST BE IN YOUR SERVER-SIDE IN PRODUCTION (by using
   * the API REST, openvidu-java-client or openvidu-node-client):
   *   1) Initialize a Session in OpenVidu Server	(POST /openvidu/api/sessions)
   *   2) Create a Connection in OpenVidu Server (POST /openvidu/api/sessions/<SESSION_ID>/connection)
   *   3) The Connection.token must be consumed in Session.connect() method
   */

  getToken() {
    return this.createSession(this.state.mySessionId)
      .then(sessionId => this.createToken(sessionId))
      .catch(error => console.log(error));
  }

  createSession(sessionId) {
    return new Promise(resolve => {
      var data = JSON.stringify({ customSessionId: sessionId });
      axios
        .post(OPENVIDU_SERVER_URL + '/openvidu/api/sessions', data, {
          headers: {
            Authorization:
              'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })
        .then(response => {
          console.log('SESSION ' + response.data.id + ' CREATED');
          resolve(response.data.id);
        })
        .catch(response => {
          console.log(response);
          var error = Object.assign({}, response);
          if (!error.response) {
            console.error('Network error: ', error);
            if (error.request && error.request._response) {
              console.error(
                'Response of the request: ',
                error.request._response,
              );
            }
          } else if (
            error.response &&
            error.response.status &&
            error.response.status === 409
          ) {
            console.log('RESOLVING WITH SESSIONID, 409');
            resolve(sessionId);
          } else {
            console.warn(
              'No connection to OpenVidu Server. This may be a certificate error at ' +
              OPENVIDU_SERVER_URL,
            );

            Alert.alert(
              'No connection to OpenVidu Server.',
              'This may be a certificate error at "' +
              OPENVIDU_SERVER_URL +
              '"\n\nClick OK to navigate and accept it. ' +
              'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
              OPENVIDU_SERVER_URL +
              '"',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () =>
                    Linking.openURL(
                      OPENVIDU_SERVER_URL + '/accept-certificate',
                    ).catch(err => console.error('An error occurred', err)),
                },
              ],
              { cancelable: false },
            );
          }
        });
    });
  }

  createToken(sessionId) {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({});
      axios
        .post(
          OPENVIDU_SERVER_URL +
          '/openvidu/api/sessions/' +
          sessionId +
          '/connection',
          data,
          {
            headers: {
              Authorization:
                'Basic ' + btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET),
              'Content-Type': 'application/json',
            },
          },
        )
        .then(response => {
          console.log('TOKEN CREATED: ', response.data.token);
          resolve(response.data.token);
        })
        .catch(error => {
          console.error(error);
          reject(error);
        });
    });
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingTop: Platform.OS == 'ios' ? 20 : 0,
  },
  selfView: {
    flex: 1,
    width: width,
  },
  timer: {
    marginVertical: 10,
  },
  timerText: {
    fontSize: mvs(15),
    color: colors.white
  },
  remoteView: {
    height: '100%',
    width: '100%',
  },
  button: {
    padding: 10,
  },
  img: {
    flex: 1,
    width: 400,
    height: 200,
  },
});
