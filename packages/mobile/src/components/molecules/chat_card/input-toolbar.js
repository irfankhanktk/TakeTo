import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
  PermissionsAndroid,
  Platform,
  Text,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { MicroPhone_White, MicroPhone, Plus } from '../../../../resource/assets/common-icons';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import Medium from '../../../presentation/typography/medium-text';
import { Chase } from 'react-native-animated-spinkit';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';

const audioRecorderPlayer = new AudioRecorderPlayer();

const InputToolbar = ({
  _ref,
  onStop,
  sending = false,
  onCamera,
  onPlus,
  close,
  onChangeText,
  send,
  onSendMessage,
  value,
  onFocus,
  status,
}) => {

  const [stopWatch, setStopWatch] = React.useState(false)

  ///////////////////////////////////////////Timer/////////////////////////////////////////////////

  const [timer, setTimer] = React.useState({
    hour: 0,
    sec: -1,
    min: 0,
  });


  const startTime = () => {
    var date = new Date(); /* creating object of Date class */

    var hour = timer.hour; // if(){
    var min = timer.min; // if(){
    var sec = timer.sec; // if(){

    if (timer.min >= 59) {
      hour = hour + 1;
    }
    if (timer.sec >= 59) {
      min = min + 1;
    }
    if (timer.sec >= 59) {
      sec = 0;
    } else {
      sec = sec + 1;
    }
    hour = updateTime(hour);
    min = updateTime(min);
    sec = updateTime(sec);

    setTimer({
      hour,
      min,
      sec,
    }); /* adding time to the div */
  }

  function updateTime(k) {
    if (k < 10) {
      return k;
    } else {
      return k;
    }
  }

  React.useEffect(() => {
    if (recording) {
      setTimeout(function () {
        startTime();
      }, 1000);
    }
  }, [timer]);

  ////////////////////////////////////////////////////////////////////////////////////////////////



  const [isRecording, setIsRecording] = React.useState(false);
  const [recording, setRecording] = React.useState(false);


  const onStartRecord = async () => {
    // await onSetStartIcon();
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        console.log('write external stroage', grants);

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED
        ) {
          setIsRecording(true)
          console.log('You can use the storage');
          const path = Platform.select({
            ios: 'hello.m4a',
            android: `${RNFS.DocumentDirectoryPath}/audio_${Math.random()}.mp3`, // should give extra dir name in android. Won't grant permission to the first level of dir.
          });
          const audioSet = {
            AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
            AudioSourceAndroid: AudioSourceAndroidType.MIC,
            AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
            AVNumberOfChannelsKeyIOS: 2,
            AVFormatIDKeyIOS: AVEncodingOption.aac,
          };
          // const result = await audioRecorderPlayer.startRecord(path);
          const result = await audioRecorderPlayer.startRecorder(path, audioSet, false);

          audioRecorderPlayer.addRecordBackListener((e) => {
            return;
          });
        } else {
          setIsRecording(false)
          console.log('All required permissions not granted');
          //return;
        }
      } catch (err) {
        setIsRecording(false)
        console.warn(err);
        //return;
      }
    } else {
      setIsRecording(true)
      console.log('You can use the storage');
      const path = Platform.select({
        ios: 'hello.m4a',
        android: `${RNFS.DocumentDirectoryPath}/audio_${Math.random()}.mp3`, // should give extra dir name in android. Won't grant permission to the first level of dir.
      });
      const audioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
      };
      // const result = await audioRecorderPlayer.startRecord(path);
      const result = await audioRecorderPlayer.startRecorder(path, audioSet, false);

      audioRecorderPlayer.addRecordBackListener((e) => {
        return;
      });
    }

  }

  const onStopRecord = async (send) => {
    setIsRecording(false)
    const result = await audioRecorderPlayer.stopRecorder();
    //console.log("result:", result)
    audioRecorderPlayer.removeRecordBackListener();

    if (send) {
      onStop(result?.replace('////', '///'))
    }
  };


  if (close) {
    return (
      <View style={{ ...styles.CONTAINER, flexDirection: 'column' }}>
        <Regular
           label = "Chat Closed"
          //label="Chat is closed while the dispute is being investigated."
          style={styles.footer}
        />
        {/* <Regular
          label="When the investigation is over, both parties will be"
          style={styles.footer}
        />
        <Regular label="notified. Thank you" style={styles.footer} /> */}
      </View>
    );
  }
  return (
    <View style={styles.CONTAINER}>
      {/* {status !== 'Disputed'? */}
      <>
      {recording ?
        <View
          style={{
            height: mvs(52),
            width: '100%',
            backgroundColor: colors.primary,
            borderRadius: mvs(10),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: mvs(10)
          }}
        >
          <MicroPhone_White
            height={mvs(30)}
            width={mvs(30)}
          />
          <Regular
            label={`${timer.hour < 10 ? `0${timer.hour}` : `${timer.hour}`}:${timer.min < 10 ? `0${timer.min}` : `${timer.min}`}:${timer.sec < 10 ? `0${timer.sec}` : `${timer.sec}`}`}
            style={{
              fontSize: mvs(20),
              color: colors.white,
            }}
          />
          <View style={{ flexDirection: 'row' }}>
            <MaterialIcons onPress={async () => {
              setRecording(false)
              onStopRecord(false)
              //const path = await stopRecording();
            }} name='close' size={mvs(30)} color={colors.white} />
            <MaterialIcons onPress={async () => {
              setRecording(false)
              onStopRecord(true)
              //  const path = await stopRecording();
              //  onStop(path);
            }} name='check' size={mvs(30)} color={colors.white} style={{ marginLeft: mvs(20) }} />
          </View>


        </View>
        :
        <>
          <TouchableOpacity onPress={onPlus}>
            <Plus />
          </TouchableOpacity>
          
          <View
            style={{
              //marginHorizontal: mvs(10),
              backgroundColor: colors.secondary,
              width: '90%',
              borderRadius: mvs(10),
              height: mvs(52),
              paddingHorizontal: mvs(9),
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <TextInput
            ref={_ref}
              onChangeText={onChangeText}
              placeholderTextColor = {colors.input_placehoder}
              style={{ width: '90%', color: colors.typeHeader }}
              placeholder={'Type a Message …'}
              value={value}
              multiline
              onFocus={onFocus}
            />
            {
              send ? (
                <TouchableOpacity
                  onPress={() => {
                    onSendMessage();
                  }}>
                  {sending?  
                  <Chase size = {mvs(20)} color = {colors.primary}/>
                  :
                  <MaterialIcons
                    color={colors.primary}
                    name={'send'}
                    size={mvs(20)}
                  />}
                </TouchableOpacity>
              ) : (
                 <Pressable
                  onPress={() => {
                    setRecording(true);
                    setTimer({
                      ...timer,
                      sec: 0
                    })
                    onStartRecord()
                  }}>
                  <MicroPhone />
                </Pressable>
              )
            }
          </View>
        </>}
      </> 
      {/* :
      <View style = {{
       height : mvs(52),
       width : '100%',
       justifyContent:'center',
       alignItems:'center',
      }}>
        <Medium
        label = "Chat Ended."
        style = {{
          color : colors.pink
        }}
        />
      </View> 
      } */}
    </View>
  );
};
export default InputToolbar;
const styles = StyleSheet.create({
  CONTAINER: {
    //position: 'absolute',
    backgroundColor : colors.white,
    //bottom: mvs(10),
    marginVertical : mvs(10),
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: mvs(22),
    //backgroundColor:'red'
    //borderWidth : 1
  },
  ROW: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {
    color: colors.headerTitle,
    fontSize: mvs(13),
    alignSelf: 'center',
  },
});
