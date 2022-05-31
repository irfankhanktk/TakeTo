import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import React, { useRef, useState } from 'react';
import {
  FlatList, KeyboardAvoidingView,
  LogBox,
  PermissionsAndroid,
  Platform, StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import DocumentPicker from 'react-native-document-picker';
import DropdownAlert from 'react-native-dropdownalert';
import ImageView from 'react-native-image-viewing';
import { useProgress } from 'react-native-track-player';
import { connect } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import * as SVGS from '../../../resource/assets/common-icons';
import InputToolbar from '../../components/molecules/chat_card/input-toolbar';
import ProductStatusCard from '../../components/molecules/chat_card/product-status-card';
import Header from '../../components/molecules/header/header-1x';
import ImagePicker from '../../components/molecules/modals/image-picker/image-picker';
import PlusOptionsModal from '../../components/molecules/modals/plus-options-modal';
import colors from '../../config/colors';
import { mvs } from '../../config/metrices';
import Bold from '../../presentation/typography/bold-text';
import Regular from '../../presentation/typography/regular-text';
import RNFS from 'react-native-fs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

LogBox.ignoreAllLogs();
const KeyboardWrapper = ({ children }) => {
  return (
    Platform.OS === 'ios' ?
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.CONTAINER}>
        {children}
      </KeyboardAvoidingView> :
      <View
        style={styles.CONTAINER}>
        {children}
      </View>
  )

}
const ChatDispute = props => {
  const Play1 = SVGS['Play1'];
  const Play2 = SVGS['Play2'];
  const Pause1 = SVGS['Pause1'];
  const Pause2 = SVGS['Pause2'];
  const Doc1 = SVGS['doc1'];
  const Doc2 = SVGS['doc2'];
  const Seen = SVGS['seened'];
  const SeenWhite = SVGS['seened_white'];
  const Deliver = SVGS['delivered'];

  const { config, fs } = RNFetchBlob;

  const progress = useProgress();
  const scrollRef = useRef();

  const android = RNFetchBlob.android;
  const ios = RNFetchBlob.ios;

  const {
    navigation,
    route,
    fetchActiveChat,
    active_chat,
    profileData,
    showDeliveryAddressModal,
    toggleDeliveryAddressModal,
  } = props;
  const {
    participant_name = profileData?.user_name,
    dispute_id,
    chat_title,
  } = route?.params || {};
  const alertRef = React.useRef();
  //console.log(thread_id);

  const [sendImageLoading, setSendImageLoading] = React.useState(false);

  const [messages, setMessages] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const [plusModal, setPlusModal] = useState(false);
  const [images, setImages] = React.useState([]);
  const [imageViewer, setImageViewer] = React.useState(false);
  const [loading, setLoading] = React.useState(false)
  const [end, setEnd] = React.useState(false)

  const [loadingChat, setLoadingChat] = React.useState(true);
  const [imagePicker, setImagePicker] = React.useState({});
  const [openPicker, setOpenPicker] = React.useState(false);

  const [downState, setDownState] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState('');
  const [page, setPage] = useState(1)
  const insets = useSafeAreaInsets();

  const updatePayload = getData => {
    setImagePicker(getData?.profile_image);
  };



  const openCamera = send => {
    // launchCamera({mediaType: 'photo', includeBase64: false}, response =>
    UI_API._openCamera(send ? sendDoc : updatePayload, alertRef);
    // );
  };
  const openGallery = send => {
    // launchImageLibrary({mediaType: 'photo', includeBase64: false}, response =>
    UI_API._openGallery(send ? sendDoc : updatePayload, alertRef);
    // );
  };
  const onImageModalSelection = type => {
    //type ::  Camera,Gallery,Delete
    setOpenPicker(false);
    setTimeout(() => {
      if (type === 'Camera') {
        openCamera(false);
      } else if (type === 'Gallery') {
        openGallery(false);
      } else {
        //   setPayload({
        //     ...payload,
        //     profile_image:''
        // })
      }
    }, 1000);
  };

  const fetchChatMessages = async (pageNo) => {
    try {
      //setLoadingChat(true);
      const messageList = await client.get(`dispute-replies/${dispute_id}?page=${pageNo}&&limit=15`);
      if (
        messageList?.data?.length > 0 ||
        Object.keys(messageList?.data).length > 0
      ) {
        setMessages([...messages, ...messageList?.data?.replies?.data])
        setLoading(false)
        setPage(page + 1)
      }
      else {
        setLoading(false)
        setEnd(true)
      }

      setLoadingChat(false);
    } catch (error) {
      setLoadingChat(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };


  React.useEffect(() => {
    fetchChatMessages(page);
  }, []);


  const onOpenDoc = async (item, index) => {
    const temp = item?.attachment?.split('/');
    const name = temp[temp.length - 1];
    const type = '.' + name.split('.')[1];

    const path = fs.dirs.DownloadDir + '/' + name;

    setSelectedFile(index);

    let exists = await RNFS.exists(path);

    if (!exists) {
      setDownState('Downloading...');
      let optionsA = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: false,
          path: path,
          description: 'Downloading document.',
        },
      };
      let optionI = {
        fileCache: true,
        path: path,
      };
      const url = encodeURI(item?.attachment);
      config(Platform.OS == 'ios' ? optionI : optionsA)
        .fetch('GET', url)
        .progress({ interval: 250 }, (received, total) => {
          // console.log('progress', received / total);
          // this.setState({
          //     downloadProgress:(received/total)*100
          // })
        })
        .then(res => {
          alertRef.current.alertWithType(
            'success',
            'Download Successfully',
            '',
          );
          setDownState('');
        })
        .catch(err => {
          // console.log('err', err);
          setDownState('');
        });
    } else {
      Platform.OS == 'android'
        ? android.actionViewIntent(path)
        : ios.openDocument(path);
    }
  };

  const sendDoc = async (getData, doc) => {
    const formData = new FormData();
    formData.append('reply', message);
    formData.append('dispute_id', dispute_id);
    formData.append('attachment', getData?.profile_image);
    try {
      setMessages([
        {
          attachment: doc ? 'null.pdf' : 'null.jpg',
          reply: message,
          reply_user_name: profileData?.user_name
        },
        ...messages
      ]);
      const sendMessage = await client.post('dispute-reply', formData);
      setMessages([...sendMessage?.data?.replies?.data])
      setMessage('');
    } catch (error) {
      setSendImageLoading(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };

  const onSendMessage = async () => {
    try {
      setMessage('');
      const formData = new FormData();
      formData.append('reply', message);
      formData.append('dispute_id', dispute_id);
      setMessages([
        {
          attachment: null,
          reply: message,
          reply_user_name: profileData?.user_name
        },
        ...messages
      ]);
      const sendMessage = await client.post('dispute-reply', formData);
      setMessages([...sendMessage?.data?.replies?.data])

      scrollRef.current.scrollToOffset({ animated: true, offset: 0 });
    } catch (error) {
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };

  const downloadFileHandler = async (item, index) => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);

        const readGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        const writeGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (!readGranted || !writeGranted) {
          throw new Error('Read and write permissions have not been granted');
        }
      }
      const temp = item?.attachment?.split('/');
      const name = temp[temp.length - 1];
      const type = '.' + name.split('.')[1];
      setSelectedFile(index);
      setDownState('Downloading...');

      let PictureDir = fs.dirs.DownloadDir;
      let optionsA = {
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
          notification: false,
          path:
            PictureDir +
            '/file_' +
            Math.floor(new Date().getTime() + new Date().getSeconds() / 2) +
            type,
          description: 'Downloading document.',
        },
      };

      const url = encodeURI(item?.attachment);
      config(optionsA)
        .fetch('GET', url)
        .then(() => {
          setDownState('');
          alertRef.current.alertWithType(
            'success',
            'File Download',
            'File Download succesfully',
          );
        })
        .catch(err => {
          setDownState('');
          alertRef.current.alertWithType(
            'error',
            'Error',
            UI_API._returnError(error),
          );
        });
    } catch (err) {
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };

  const renderMessage = ({ item, index }) => {
    { console.log("item:", item) }

    if (item?.attachment === null) {
      //this sections only used for chatting purpose
      return (
        <View
          key={item.key}
          style={{
            width: '100%',
            paddingLeft:
              item?.reply_user_name !== profileData?.user_name
                ? mvs(0)
                : mvs(63),
            paddingRight:
              item?.reply_user_name !== profileData?.user_name
                ? mvs(63)
                : mvs(0),
            marginTop: mvs(15),
          }}>
          <View
            style={{
              width: '100%',
              backgroundColor: item?.reply_user_name !== profileData?.user_name?colors.secondary: colors.primary,
              borderRadius: mvs(15),
              borderBottomRightRadius:
                item?.reply_user_name === profileData?.user_name
                  ? mvs(15)
                  : mvs(0),
              borderBottomLeftRadius:
                item?.reply_user_name === profileData?.user_name
                  ? mvs(0)
                  : mvs(15),
              padding: mvs(10),
            }}>
            <Bold
              label={`${TAKE_TO_CONSTANT.convertUpperCase(
                item?.reply_user_name,
              )}`}
              style={{
                fontSize: mvs(12),
                color: item?.reply_user_name !== profileData?.user_name?colors.headerTitle: colors.white,
              }}
            />
            <Regular
              label={item?.reply}
              style={{
                fontSize: mvs(12),
                color: item?.reply_user_name !== profileData?.user_name?colors.headerTitle: colors.white,
              }}
            />
          </View>
          <View
            style={{
              position: 'absolute',
              left: item?.reply_user_name !== profileData?.user_name ? null : 0,
              right:
                item?.reply_user_name !== profileData?.user_name ? 0 : null,
              bottom: 0,
              //borderWidth : 1,
              alignItems: 'center',
            }}>
            {/* <Seen /> */}
            <Regular
              label={TAKE_TO_CONSTANT.getConversationTime(item?.created_at)}
              style={{
                fontSize: mvs(10),
                marginTop: mvs(10),
              }}
            />
          </View>
        </View>
      );
    } else {
      const file = item?.attachment?.split('.')
      const extension = file[file.length - 1]
      if (extension === 'jpg' ||
        extension === 'png' ||
        extension === 'jpeg' ||
        extension === 'jfif' ||
        extension === 'pjpeg' ||
        extension === 'pjp' ||
        extension === 'svg' ||
        extension === 'webp' ||
        extension === 'gif' ||
        extension === 'avif' ||
        extension === 'apng' ||
        extension === 'bmp' ||
        extension === 'ico' ||
        extension === 'cur' ||
        extension === 'tif' ||
        extension === 'tiff'
      ) {
        return (
          <View style={{ marginVertical: mvs(10) }}>
            <ProductStatusCard
              showStatus={true}
              sending={item?.attachment !== 'null.jpg' ? false : true}
              // label="Pending Delivery Confirmation"
              image={item?.attachment}
              show_img={true}
              removeSeen={true}
              item={item}
              onPressImage={() => {
                setImages([
                  {
                    uri: item?.attachment,
                  },
                ]);
                setImageViewer(true);
              }}
              style={{

                height: mvs(52),
              }}
            />
          </View>
        );
      } else {
        return (
          <TouchableOpacity
            onPress={() => onOpenDoc(item, index)}
            disabled={downState !== ''}
            style={{
              ...styles.playerMainContainer,
              alignSelf:
                item?.reply_user_name === profileData?.user_name ? 'flex-end' : 'flex-start',
              backgroundColor:
                item?.reply_user_name === profileData?.user_name
                  ? colors?.primary
                  : colors.secondary,
              width: mvs(268),
              height: mvs(52),
              justifyContent: item?.audio === '' ? 'center' : null,
              // borderWidth : RNFS.exists(fs.dirs.DownloadDir + '/' + item?.boby) ? 1 : 0
            }}>
            {item?.reply_user_name === profileData?.user_name ? (
              <Doc1 height={mvs(20)} width={mvs(20)} />
            ) : (
              <Doc2 height={mvs(20)} width={mvs(20)} />
            )}
            <Regular
              label={
                selectedFile == index
                  ? downState === ''
                    ? item?.attachment == 'null.pdf'
                      ? 'Sending ...'
                      : item?.attachment?.length > 20
                        ? `${item?.attachment?.substring(item?.attachment?.length - 20)}`
                        : item?.attachment
                    : downState
                  : item?.attachment == 'null.pdf'
                    ? 'Sending ...'
                    : item?.attachment?.length > 20
                      ? `${item?.attachment?.substring(item?.attachment?.length - 20)}`
                      : item?.attachment
              }
              style={{
                color:
                  item?.reply_user_name === profileData?.user_name
                    ? colors.white
                    : colors.typeHeader,
                fontSize: mvs(12),
                marginLeft: mvs(5),
              }}
            />
            <View style={styles.timeContainer}>
              <Regular
                label={TAKE_TO_CONSTANT.getConversationTime(item?.created_at)}
                style={{
                  color:
                    item?.reply_user_name === profileData?.user_name
                      ? colors.white
                      : colors.typeHeader,
                  fontSize: mvs(10),
                }}
              />
            </View>
          </TouchableOpacity>
        );
      }
    }
  };

  const openFilePiker = async (types, doc) => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: types,
      });
      const data = {
        profile_image: {
          name: res.name,
          type: res.type,
          uri: res.uri,
        },
      };
      if (!doc) {
        sendDoc(data, false);
      } else {
        sendDoc(data, true);
      }
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        // console.log('Canceled from single doc picker');
      } else {
        //For Unknown Error
        //console.log('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const onPressPlusOptions = title => {
    setPlusModal(false);
    if (title === 'Camera') {
      setTimeout(() => {
        openCamera(true);
      }, 1000);
    } else if (title === 'Gallery') {
      setTimeout(() => {
        openGallery(true);
      }, 1000);
      // setTimeout(() => {
      //   openFilePiker(
      //     [DocumentPicker.types.images, DocumentPicker.types.video],
      //     false,
      //   );
      // }, 1000);
    } else if (title === 'Document') {
      setTimeout(() => {
        openFilePiker(
          [
            DocumentPicker.types.pdf,
            DocumentPicker.types.zip,
            DocumentPicker.types.csv,
            DocumentPicker.types.doc,
            DocumentPicker.types.docx,
            DocumentPicker.types.ppt,
            DocumentPicker.types.pptx,
            DocumentPicker.types.xls,
            DocumentPicker.types.xlsx,
          ],
          true,
        );
      }, 1000);
    }
  };

  if (loadingChat) {
    return (
      <View style={styles.CONTAINER}>
        <Header {...props} title={chat_title} allowBackBtn userIcon={false} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Chase size={mvs(30)} color={colors.primary} />
        </View>
      </View>
    );
  } else
    return (
      <View style={{ ...styles.CONTAINER, paddingBottom: insets.bottom }}>
        <Header
          {...props}
          title={chat_title}
          allowBackBtn
          userIcon={false}
        // callIcons
        />
        <KeyboardWrapper>

          <View style={styles.BODY}>


            <FlatList
              ListFooterComponent={() =>
                loading &&
                <View style={{ alignSelf: 'center' }}>
                  <Chase size={mvs(20)} color={colors.primary} />
                </View>

              }
              ref={scrollRef}
              data={messages}
              renderItem={renderMessage}
              inverted
              keyExtractor={item => item?.order_created_at?.toString()}
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingHorizontal: mvs(20), paddingTop: mvs(20) }}
              showsVerticalScrollIndicator={false}
              onEndReachedThreshold={0.5}
              onEndReached={() => {
                if (!loading && !end) {
                  setLoading(true)
                  fetchChatMessages(page)
                }
              }}
            />

            <InputToolbar
              onChangeText={txt => {
                setMessage(txt);
              }}
              value={message}
              send={true}
              onPlus={() => setPlusModal(true)}
              onSendMessage={() => message?.trim() && onSendMessage()}
              onStop={res => sendAudio(res)}
              onFocus={() => {
                // console.log('onFocus');
                //scrollRef.current.scrollToEnd({ animated: true });
              }}
            />
          </View>

          <PlusOptionsModal
            list={[
              { icon: 'Camera', title: 'Camera' },
              { icon: 'Gallery', title: 'Gallery' },
              { icon: 'doc', title: 'Document' },
            ]}
            onPress={onPressPlusOptions}
            visible={plusModal}
            onClose={() => setPlusModal(false)}
          />


          <ImagePicker
            visible={openPicker}
            showDelete={false}
            onClose={setOpenPicker}
            onSubmit={onImageModalSelection}
          />

          <ImageView
            images={images}
            imageIndex={0}
            visible={imageViewer}
            onRequestClose={() => setImageViewer(false)}
          />
        </KeyboardWrapper>
        <DropdownAlert zIndex={5} 
          elevation={15}
          translucent
          activeStatusBarStyle={'light-content'}
          inactiveStatusBarBackgroundColor={colors.primary}
          ref={alertRef}
        />
      </View>
    );
};
const mapStateToProps = state => {
  return {
    active_chat: state.inbox.active_chat,
    profileData: state.auth.userInfo?.profile || {},
  };
};
const mapDispatchToProps = dispatch => ({
  fetchActiveChat: thread_id =>
    dispatch(TAKE_TO_ACTIONS.fetchActiveChat(thread_id)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ChatDispute);
const styles = StyleSheet.create({
  CONTAINER: {
    flex: 1,
    backgroundColor: colors.white,
  },
  BODY: {
    backgroundColor: colors.white,
    flex: 1,
    // justifyContent:'flex-end',
    // backgroundColor : 'red'
    //justifyContent:'space-between'
  },
  BUTTON_CONTAINER: {
    paddingTop: mvs(30),
  },
  ROW: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerMainContainer: {
    // height : mvs(52),
    maxWidth: mvs(268),
    //width : mvs(270),
    borderRadius: mvs(10),
    backgroundColor: colors.primary,
    marginTop: mvs(15),
    paddingHorizontal: mvs(10),
    paddingVertical: mvs(11),
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    //height: mvs(20),
    //width: mvs(50),
    //borderWidth:1,
    position: 'absolute',
    bottom: mvs(6),
    right: mvs(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
});
