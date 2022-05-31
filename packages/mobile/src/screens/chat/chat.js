import TAKE_2_API from '@khan_ahmad786/common/api/API';
import services from '@khan_ahmad786/common/api/services';
import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import { useFocusEffect, useIsFocused } from '@react-navigation/core';
import moment from 'moment';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import DocumentPicker from 'react-native-document-picker';
import DropdownAlert from 'react-native-dropdownalert';
import RNFS from 'react-native-fs';
import ImageView from 'react-native-image-viewing';
import { showLocation } from 'react-native-map-link';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Slider from 'react-native-slider';
import TrackPlayer, {
  usePlaybackState,
  useProgress,
} from 'react-native-track-player';
import { connect } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import * as SVGS from '../../../resource/assets/common-icons';
import { Camera } from '../../../resource/assets/common-icons';
import { TAKE_TO_INPUT_FIELD } from '../../components/atoms';
import Buttons from '../../components/atoms/Button';
import ImagePlaceholder from '../../components/atoms/Placeholder';
import InputToolbar from '../../components/molecules/chat_card/input-toolbar';
import OrderStatusCard from '../../components/molecules/chat_card/order-status-card';
import ProductStatusCard from '../../components/molecules/chat_card/product-status-card';
import ShareLocation from '../../components/molecules/chat_card/share-location';
import DualText from '../../components/molecules/dual-text/dual-text';
import Header from '../../components/molecules/header/header-1x';
import CalOptionsModal from '../../components/molecules/modals/call-options-modal';
import DeliveryAddressRequested from '../../components/molecules/modals/delivery-address-requested';
import DeliveryConfirmedModal from '../../components/molecules/modals/dilivery-confirmed-modal';
import DeliveryDisputedModal from '../../components/molecules/modals/dilivery-disputed-modal';
import ImagePicker from '../../components/molecules/modals/image-picker/image-picker';
import PlusOptionsModal from '../../components/molecules/modals/plus-options-modal';
import RatingSubmittedModal from '../../components/molecules/modals/rating-submited-modal';
import RewardAcceptedModal from '../../components/molecules/modals/reward-accepted-modal';
import StatusModal from '../../components/molecules/modals/status-modal';
import VideoPlayer from '../../components/molecules/modals/video-player';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { mvs } from '../../config/metrices';
import Regular from '../../presentation/typography/regular-text';

const KeyboardWrapper = ({ children }) => {
  return Platform.OS === 'ios' ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.CONTAINER}>
      {children}
    </KeyboardAvoidingView>
  ) : (
    <View style={styles.CONTAINER}>{children}</View>
  );
};

const Chat = props => {
  let isFocus = useIsFocused();

  const insets = useSafeAreaInsets();

  const Play1 = SVGS['Play1'];
  const Play2 = SVGS['Play2'];
  const Pause1 = SVGS['Pause1'];
  const Pause2 = SVGS['Pause2'];
  const Doc1 = SVGS['doc1'];
  const Doc2 = SVGS['doc2'];
  const Seen = SVGS['seened'];
  const SeenWhite = SVGS['seened_white'];
  const Deliver = SVGS['delivered'];
  const Sent = SVGS['sent'];

  const { config, fs } = RNFetchBlob;
  const android = RNFetchBlob.android;
  const ios = RNFetchBlob.ios;

  const playbackStack = usePlaybackState();
  const progress = useProgress();
  const scrollRef = useRef();

  const {
    navigation,
    route,
    fetchActiveChat,
    active_chat,
    profileData,
    showDeliveryAddressModal,
    toggleDeliveryAddressModal,
    onSaveDeliveryAddressToRedux,
    newMessageArrived,
    anotherEcho,
    updateInboxList,
    updateMessage,
    countriesList,
  } = props;

  const {
    order_step,
    type: messageOnwerType,
    order_by,
    participant_name,
    thread_id,
  } = route?.params || {};

  const alertRef = useRef();
  const [channel, setChannel] = useState(
    anotherEcho?.anotherEcho?.join('messenger.thread.' + thread_id),
  );
  const [declineModal, setDeclineModal] = useState(false);
  const [openDeliveryReq, setOpenDeliveryReq] = useState(false);
  const [playerId, setPlayerId] = useState('');
  const [playing, setPlaying] = useState(false);
  const [sendProductLoading, setSendProductLoading] = useState(false);
  const [sendImageLoading, setSendImageLoading] = useState(false);
  const [sendDisputeoading, setSendDisputeLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [rewardAccepted, setRewardAccepted] = useState(false);
  const [plusModal, setPlusModal] = useState(false);
  const [calModal, setCalModal] = useState(false);
  const [rejectDealModal, setRejectDealModal] = useState(false);
  const [sendProductModal, setSendProductModal] = useState(false);
  const [sendReceiptModal, setSendReceiptModal] = useState(false);
  const [images, setImages] = useState([]);
  const [imageViewer, setImageViewer] = useState(false);
  const [deliveryConfirmedModal, setDeliveryConfirmedModal] = useState(false);
  const [deliveryDisputedModal, setDeliveryDisputedModal] = useState(false);
  const [loadingChat, setLoadingChat] = useState(true);
  const [imagePicker, setImagePicker] = useState({});
  const [openPicker, setOpenPicker] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(false);
  const [disputSubmitted, setDisputSubmitted] = useState(false);
  const [reOrderLoading, setReOrderLoading] = useState(false);
  const [video, setVideo] = useState('');
  const [downState, setDownState] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  const [min, setMin] = useState(0);
  const [locflag, setlocflag] = useState(false);
  const [lastRead, setLastRead] = useState({});
  const [isRead, setIsRead] = useState({ data: 'data' });
  const [sending, setSending] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [reqApproving, setReqApproving] = useState(false);
  const [offerSending, setOfferSending] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [disputeTitle, setDisputeTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({
    index: true,
    page_id: null,
    next_page_id: null,
    next_page_route: null,
    final_page: true,
    per_page: 50,
    results: 1,
    total: 1,
  });

  {
    /* ================= USE_EFFECTS =================== */
  }


  let is_chat_close = (active_chat?.order?.order_step == 'completed' ||
    active_chat?.order?.order_step == 'Disputed' ||
    active_chat?.order?.order_step == 'rejected' ||
    active_chat?.order?.chat_end);
  useFocusEffect(
    React.useCallback(() => {
      async function connect() {
        if (!channel?.subscription?.subscriptionPending) {
          const temp = await anotherEcho?.anotherEcho?.join(
            'messenger.thread.' + thread_id,
          );
          setChannel(temp);
          temp?.whisper('read', {
            provider_id: '1212',
            provider_alias: 'alskalsa',
            avatar: 'isRead?.body',
            message_id: 'step',
          });
        }
        messangerClient.get(
          `${services.messanger.open_chat}/${thread_id}/mark-read`,
        );
        return () => {
          anotherEcho?.anotherEcho.leave('messenger.thread.' + thread_id);
        };
      }
      connect();
    }, []),
  );

  useEffect(() => {
    if (playing) {
      if (progress.position > 0 && progress.position >= progress.duration) {
        TrackPlayer.reset();
        setPlaying(false);
        setPlayerId(-1);
      }
    }
  }, [progress.position]);

  useEffect(() => {
    setMeta(active_chat?.meta);
    Object.keys(active_chat).length > 0 &&
      updateInboxList(
        {
          thread_id: thread_id,
        },
        profileData?.id,
        true,
      );
  }, [active_chat]);

  useEffect(() => {
    (async () => {
      if (active_chat && Object.keys(lastRead).length > 0) {
        let msgs = [];
        active_chat?.data?.forEach(item => {
          if (
            lastRead?.message_id === item?.id ||
            moment(item?.created_at) < moment(lastRead?.time)
          ) {
            let newItem = { ...item, unread: false };
            msgs = [...msgs, newItem];
          } else {
            let newItem = { ...item, unread: true };
            msgs = [...msgs, newItem];
          }
        });
        setMessages(msgs);
        setLoading(false);
      }
    })();
  }, [active_chat, lastRead]);

  useEffect(() => {
    if (Object.keys(isRead).length > 0) {
      channel?.whisper('read', {
        provider_id: '1212',
        provider_alias: 'alskalsa',
        avatar: 'isRead?.body',
        message_id: 'msg',
      });
      setIsRead({});
    }
  }, [isRead]);

  useEffect(() => {
    anotherEcho?.newChannel?.stopListening('.new.message', null);
    anotherEcho?.newChannel?.listen('.new.message', function (data) {
      console.log('message data:::',data);
      if (data?.thread_id == thread_id && profileData?.id !== data?.owner_id) {
        messangerClient.get(
          `${services.messanger.open_chat}/${thread_id}/mark-read`,
        );
        setIsRead(data);
        if (
          data?.type_verbose !== 'MESSAGE' &&
          data?.type_verbose !== 'IMAGE_MESSAGE' &&
          data?.type_verbose !== 'VIDEO_MESSAGE' &&
          data?.type_verbose !== 'AUDIO_MESSAGE' &&
          data?.type_verbose !== 'DOCUMENT_MESSAGE' ||
          data?.type_verbose !== 'CLOSE_MESSAGE'
        ) {
          fetchActiveChat(thread_id);
        } else {
          newMessageArrived(data);
        }
      }
      updateInboxList(data, profileData?.id, false);
    });
  }, [isFocus]);

  useEffect(() => {
    (async () => {
      const request = await messangerClient.get(
        `${services.messanger.open_chat}/${thread_id}/load`,
      );
      setLastRead(
        request?.data?.resources?.participants?.data?.find(
          x => x.owner_id !== profileData?.id,
        )?.last_read,
      );
    })();
  }, [isFocus]);

  useEffect(() => {
    channel.listenForWhisper('read', function (data) {
      if (data?.message_id == 'step') {
        fetchActiveChat(thread_id);
      }
      setTimeout(() => {
        setLastRead({
          message_id: data?.message_id,
          time: new Date(),
        });
      }, 2000);
    });
  }, []);

  useEffect(() => {
    (async () => {
      await messangerClient.get(
        `${services.messanger.open_chat}/${thread_id}/mark-read`,
      );
    })();
  }, []);

  useEffect(() => {
    fetchChatMessages();
    TrackPlayer.setupPlayer();
  }, []);

  {
    /* ================= OTHER_FUNCTIONS =================== */
  }

  const updatePayload = getData => {
    setImagePicker(getData?.profile_image);
  };

  const onDealDispute = () => { };

  const onDealReject = async () => {
    try {
      setRejecting(true);
      await client.get(
        `${services.create_order?.reject_offer}/${active_chat?.order?.offer_id}`,
      );
      setRejecting(false);
      setDeclineModal(false);
      channel?.whisper('read', {
        provider_id: '1212',
        provider_alias: 'alskalsa',
        avatar: 'isRead?.body',
        message_id: 'step',
      });
      await fetchActiveChat(thread_id);
    } catch (error) {
      setRejecting(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };

  const sendImage = async getData => {
    // setImagePicker(getData?.profile_image);
    const formData = new FormData();
    formData.append('image', getData?.profile_image);
    formData.append('temporary_id', '123-456-789');
    try {
      setSendImageLoading(true);
      setSending(true);
      setMessages([
        {
          type_verbose: 'IMAGE_MESSAGE',
          body: '',
          owner_id: profileData?.id,
          unread: true,
        },
        ...messages,
      ]);
      const newMsg = await messangerClient.post(
        `${services.messanger.open_chat}/${thread_id}/images`,
        formData,
      );
      await updateMessage(newMsg?.data);
      setSending(false);
      setSendImageLoading(false);
    } catch (error) {
      setSending(false);
      setSendImageLoading(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };

  const sendVideo = async getData => {
    const formData = new FormData();
    formData.append('video', getData?.profile_image);
    formData.append('temporary_id', '123-456-789');
    try {
      setSendImageLoading(true);
      setSending(true);
      setMessages([
        {
          type_verbose: 'VIDEO_MESSAGE',
          body: '',
          owner_id: profileData?.id,
          unread: true,
        },
        ...messages,
      ]);
      const newMsg = await messangerClient.post(
        `${services.messanger.open_chat}/${thread_id}/videos`,
        formData,
      );
      await updateMessage(newMsg?.data);
      setSending(false);
      setSendImageLoading(false);
    } catch (error) {
      setSending(false);
      setSendImageLoading(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };

  const sendDoc = async getData => {
    const formData = new FormData();
    formData.append('document', getData?.profile_image);
    formData.append('temporary_id', '123-456-789');
    try {
      setSendImageLoading(true);
      setSending(true);
      setMessages([
        {
          type_verbose: 'DOCUMENT_MESSAGE',
          body: '',
          owner_id: profileData?.id,
          unread: true,
        },
        ...messages,
      ]);
      const newMsg = await messangerClient.post(
        `${services.messanger.open_chat}/${thread_id}/documents`,
        formData,
      );
      await updateMessage(newMsg?.data);
      setSending(false);
      setSendImageLoading(false);
    } catch (error) {
      setSending(false);
      setSendImageLoading(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };

  const sendPickedAudio = async getData => {
    const formData = new FormData();
    formData.append('audio', getData?.profile_image);
    formData.append('temporary_id', '123-456-789');
    try {
      setSendImageLoading(true);
      setSending(true);
      setMessages([
        {
          type_verbose: 'AUDIO_MESSAGE',
          audio: '',
          owner_id: profileData?.id,
          unread: true,
        },
        ...messages,
      ]);
      const newMsg = await messangerClient.post(
        `${services.messanger.open_chat}/${thread_id}/audio`,
        formData,
      );
      await updateMessage(newMsg?.data);
      setSending(false);
      setSendImageLoading(false);
    } catch (error) {
      setSendImageLoading(false);
      setSending(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };

  const sendAudio = async audio => {
    const temp = audio?.split('/');
    const name = temp[temp.length - 1];
    const type = name.split('.')[1];
    const data = {
      name: name,
      type: `application/octet-stream`,
      uri:
        Platform.OS === 'android'
          ? audio //`file://${audio}`
          : audio.replace('file://', ''), //`file://${audio}/${name}`,
    };
    const formData = new FormData();
    formData.append('audio', data);
    formData.append('temporary_id', '123-456-789');
    try {
      setSendImageLoading(true);
      setSending(true);
      setMessages([
        {
          type_verbose: 'AUDIO_MESSAGE',
          audio: '',
          owner_id: profileData?.id,
          unread: true,
        },
        ...messages,
      ]);
      const newMsg = await messangerClient.post(
        `${services.messanger.open_chat}/${thread_id}/audio`,
        formData,
      );
      await updateMessage(newMsg?.data);
      setSendImageLoading(false);
      setSending(false);
    } catch (error) {
      setSendImageLoading(false);
      setSending(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };

  const onSendMessage = async () => {
    const msg = {
      body: message,
      created_at: moment(),
      owner_id: profileData?.id,
      thread_id: thread_id,
      type_verbose: 'MESSAGE',
      unread: true,
    };
    setMessages([msg, ...messages]);
    console.log(`{message: ${message}, temporary_id: '123-456-789'}`);
    try {
      setSending(true);
      setMessage('');
      const newMsg = await messangerClient.post(
        `${services.messanger.open_chat}/${thread_id}/messages`,
        { message: message, temporary_id: '123-456-789' },
      );
      await updateMessage(newMsg?.data);
      scrollRef.current.scrollToOffset({ animated: true, offset: 0 });
      setTimeout(() => {
        setSending(false);
      }, 2000);
    } catch (error) {
      setMessages(state => [...state.filter(e => e.body !== message)]);
      setSending(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };

  const sendDeliveryAddress = async location => {
    toggleDeliveryAddressModal(false);
    const formData = new FormData();
    formData.append('message', `${location?.latitude},${location.longitude}`);
    formData.append('type', locflag ? `location` : `map`);
    formData.append('temporary_id', '123-456-789');
    formData.append('order_id', active_chat?.order?.order_id);
    onSaveDeliveryAddressToRedux({});
    try {
      if (!locflag) {
        setSendProductLoading(true);
      }
      if (locflag) {
        setSending(true);
        setMessages([
          {
            type_verbose: 'MAP',
            body: '',
            owner_id: profileData?.id,
            unread: true,
          },
          ...messages,
        ]);
      }
      const newMsg = await messangerClient.post(
        `${services.messanger.open_chat}/${thread_id}/messages`,
        formData,
      );
      await fetchActiveChat(thread_id);
      setSending(false);
      !locflag &&
        alertRef.current.alertWithType(
          'success',
          'Succesfull',
          'Delivery location succesfully sent. You are almost done',
        );
      setSendProductLoading(false);
      setlocflag(false);
    } catch (error) {
      setSending(false);
      setlocflag(false);
      setSendProductLoading(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };

  const openCamera = send => {
    UI_API._openCamera(send ? sendImage : updatePayload, alertRef);
  };

  const openGallery = send => {
    UI_API._openGallery(send ? sendImage : updatePayload, alertRef);
  };

  const onImageModalSelection = type => {
    setOpenPicker(false);
    setTimeout(() => {
      if (type === 'Camera') {
        openCamera(false);
      } else if (type === 'Gallery') {
        openGallery(false);
      } else {
      }
    }, 1000);
  };

  const fetchChatMessages = async () => {
    try {
      setLoadingChat(true);
      if (meta?.final_page) {
        await fetchActiveChat(`${thread_id}`);
      } else {
        await fetchActiveChat(`${thread_id}`, meta?.next_page_id);
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
 console.log('active_chat:::',active_chat);
  const requestDeliveryAddress = async () => {
    try {
      setSendProductLoading(true);
      const payload = {
        id: active_chat?.order?.order_id,
        status:
          active_chat?.order?.order_step == 'order_step_5'
            ? 'order_step_6'
            : 'order_step_8',
        reason: 'This is dummy text',
        status_approved: 0,
        thread_id: thread_id,
      };
      await client.post(services.create_order.update_order_status, payload);
      await fetchActiveChat(`${thread_id}`);
      setSendProductLoading(false);
      setOpenDeliveryReq(true);
      channel?.whisper('read', {
        provider_id: '1212',
        provider_alias: 'alskalsa',
        avatar: 'isRead?.body',
        message_id: 'step',
      });
    } catch (error) {
      setSendProductLoading(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };

  const confirmDeliveryLocation = async (confirm = true, reason = null) => {
    !confirm && setDeliveryDisputedModal(false);
    const payload = {
      id: active_chat?.order?.order_id,
      status: confirm ? 'completed' : 'Disputed',
      reason: reason ? reason : '',
      status_approved: confirm ? 0 : 2,
      thread_id: thread_id,
    };
    try {
      confirm ? setSendProductLoading(true) : setSendDisputeLoading(true);
      await client.post(`update-order-status`, payload);
      await fetchActiveChat(thread_id);

      // setSendProductModal(true);//SHOW Location send
      confirm && setDeliveryConfirmedModal(true);
      confirm ? setSendProductLoading(false) : setSendDisputeLoading(false);
      channel?.whisper('read', {
        provider_id: '1212',
        provider_alias: 'alskalsa',
        avatar: 'isRead?.body',
        message_id: 'step',
      });
      active_chat?.order?.is_buyer && !confirm && setDisputSubmitted(true);
    } catch (error) {
      confirm ? setSendProductLoading(false) : setSendDisputeLoading(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
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
        if (data?.profile_image?.type?.includes('video')) {
          sendVideo(data);
        } else if (data?.profile_image?.type?.includes('audio')) {
          sendPickedAudio(data);
        } else {
          sendImage(data);
        }
      } else {
        sendDoc(data);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };

  const onPressCalOptions = async title => {
    try {
      const type = title === "voice_call" ? 2 : 1
      // alert(type)
      const response = await messangerClient.post(
        `${services.messanger.open_chat}/${thread_id}/calls`,
        {
          type: type
        },
      );
      setCalModal(false);

      console.log('CALLING API :: ', response.data);
      // props.navigation.navigate('startcalling',{data:response.data,order_obj:active_chat?.order})
      props.navigation.navigate('joincalling', {
        sessionId: response?.data?.id,
        // name: active_chat?.order?.participant_name,
        // avatar:response.data?.meta?.thread_avatar?.sm,
        name: active_chat?.order?.participant_name,
        profile_picture:response.data?.meta?.thread_avatar?.sm,
        thread_id: thread_id,
        call_id: response?.data?.id,
        call: {
          type_verbose: response?.data?.type_verbose
        },
        ... response.data
      });
    } catch (error) {
      setCalModal(false);
      setTimeout(() => {
        // props.navigation.navigate('startcalling',{data:{},order_obj:active_chat?.order})
        alertRef.current.alertWithType(
          'error',
          'Error',
          UI_API._returnError(error),
        );
      }, 500);
    }
  };

  const onPressPlusOptions = title => {
    setPlusModal(false);
    if (title === 'Voice Call') {
    } else if (title === 'Video Call') {
    } else if (title === 'Camera') {
      setTimeout(() => {
        openCamera(true);
      }, 1000);
    } else if (title === 'Photo & Video Library') {
      setTimeout(() => {
        openFilePiker(
          [DocumentPicker.types.images, DocumentPicker.types.video],
          false,
        );
      }, 1000);
    } else if (title === 'Audio') {
      setTimeout(() => {
        openFilePiker([DocumentPicker.types.audio], false);
      }, 1000);
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
    } else {
      setlocflag(true);
      setTimeout(() => {
        toggleDeliveryAddressModal(true);
      }, 1000);
    }
  };

  const onOpenDoc = async (item, index) => {
    const temp = item?.body?.split('/');
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
      const url = encodeURI(
        `https://api.taketo.exodevs.com/storage/threads/${thread_id}/documents/${item?.body}`,
      );
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

  {
    /* ================= RENDER_MESSAGES =================== */
  }

  const renderMessage = itemData => {
    const { item, index } = itemData;
    if (item?.type_verbose === 'MESSAGE') {
      return (
        <View
          key={item.key}
          style={{
            width: '100%',
            paddingLeft: item?.owner_id !== profileData?.id ? mvs(0) : mvs(63),
            paddingRight: item?.owner_id !== profileData?.id ? mvs(63) : mvs(0),
            marginTop: mvs(15),
          }}>
          <View
            style={{
              width: '100%',
              backgroundColor:
                item?.status == 'Disputed'
                  ? colors.disputes
                  : item?.status == 'Rejected'
                    ? colors.pink
                    : item?.owner_id !== profileData?.id
                      ? colors?.secondary
                      : colors.primary,
              borderRadius: mvs(15),
              borderBottomRightRadius:
                item?.owner_id !== profileData?.id ? mvs(15) : mvs(0),
              borderBottomLeftRadius:
                item?.owner_id !== profileData?.id ? mvs(0) : mvs(15),
              padding: mvs(10),
              paddingBottom: mvs(14),
            }}>
            <Regular
              label={item?.body}
              style={{
                fontSize: mvs(12),
                color:
                  item?.status == 'Disputed'
                    ? colors.headerTitle
                    : item?.status == 'Rejected'
                      ? colors.white
                      : item?.owner_id !== profileData?.id
                        ? colors.headerTitle
                        : colors.white,
              }}
            />
          </View>
          <View
            style={{
              position: 'absolute',
              left: item?.owner_id !== profileData?.id ? null : 0,
              right: item?.owner_id !== profileData?.id ? 0 : null,
              bottom: 0,
              alignItems: 'center',
            }}>
            {item?.owner_id === profileData?.id &&
              (item?.unread ? <Deliver /> : <Seen />)}
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
    } else if (item?.type_verbose === 'IMAGE_MESSAGE') {
      return (
        <ProductStatusCard
          image={`${active_chat?.image_base_url}${item?.body}`}
          sending={item?.body !== '' ? false : true}
          onPressImage={() => {
            if (item?.body !== '') {
              setImages([
                {
                  uri: `${active_chat?.image_base_url}${item?.body}`,
                },
              ]);
              setImageViewer(true);
            }
          }}
          profileData={profileData}
          item={item}
          style={{
            flexDirection:
              item?.owner_id === profileData?.id ? 'row' : 'row-reverse',
          }}
          imageStyle={{
            marginLeft: item?.owner_id !== profileData?.id ? mvs(19) : mvs(0),
            marginRight: item?.owner_id !== profileData?.id ? mvs(0) : mvs(19),
          }}
        />
      );
    } else if (item?.type_verbose === 'OFFER_APPROVED_MESSAGE') {
      return (
        <PriceWithStatus
          price={active_chat?.order?.offer_reward}
          style={{
            paddingHorizontal: 0,
            marginTop: mvs(15),
            flexDirection:
              item?.owner_id !== profileData?.id ? 'row' : 'row-reverse',
          }}
        />
      );
    } else if (item?.type_verbose === 'PRODUCT_IMAGE_MESSAGE_REJECTED') {
      return (
        <>
          <ProductStatusCard
            showStatus={true}
            status={'Rejected'}
            style={{
              flexDirection:
                item?.owner_id === profileData?.id ? 'row' : 'row-reverse',
            }}
            profileData={profileData}
            item={item}
            label={
              active_chat?.order?.is_buyer
                ? 'You rejected the product'
                : 'Buyer rejected the product'
            }
            image={`${active_chat?.image_base_url}${item?.body?.image}`}
            onPressImage={() => {
              if (item?.body !== '') {
                setImages([
                  {
                    uri: `${active_chat?.image_base_url}${item?.body?.image}`,
                  },
                ]);
                setImageViewer(true);
              }
            }}
            imageStyle={{
              marginLeft: item?.owner_id !== profileData?.id ? mvs(19) : mvs(0),
              marginRight:
                item?.owner_id !== profileData?.id ? mvs(0) : mvs(19),
              borderColor: colors.pink,
            }}
          />
          <View
            key={item.key}
            style={{
              width: '100%',
              paddingLeft:
                item?.owner_id === profileData?.id ? mvs(0) : mvs(63),
              paddingRight:
                item?.owner_id === profileData?.id ? mvs(63) : mvs(0),
              marginTop: mvs(15),
            }}>
            <View
              style={{
                width: '100%',
                backgroundColor:
                  item?.status == 'Disputed'
                    ? colors.disputes
                    : item?.status == 'Rejected'
                      ? colors.pink
                      : item?.owner_id === profileData?.id
                        ? colors?.secondary
                        : colors.primary,
                borderRadius: mvs(15),
                borderBottomRightRadius:
                  item?.owner_id !== profileData?.id ? mvs(15) : mvs(0),
                borderBottomLeftRadius:
                  item?.owner_id !== profileData?.id ? mvs(0) : mvs(15),
                padding: mvs(10),
                paddingBottom: mvs(14),
              }}>
              <Regular
                label={item?.body?.reason}
                style={{
                  fontSize: mvs(12),
                  color:
                    item?.status == 'Disputed'
                      ? colors.headerTitle
                      : item?.status == 'Rejected'
                        ? colors.white
                        : item?.owner_id === profileData?.id
                          ? colors.headerTitle
                          : colors.white,
                }}
              />
            </View>
            <View
              style={{
                position: 'absolute',
                left: item?.owner_id === profileData?.id ? null : 0,
                right: item?.owner_id === profileData?.id ? 0 : null,
                bottom: 0,
                alignItems: 'center',
              }}>
              {item?.owner_id !== profileData?.id &&
                (item?.unread ? <Deliver /> : <Seen />)}
              <Regular
                label={TAKE_TO_CONSTANT.getConversationTime(item?.created_at)}
                style={{
                  fontSize: mvs(10),
                  marginTop: mvs(10),
                }}
              />
            </View>
          </View>

          {!active_chat?.order?.is_buyer && (
            <DualText
              content={`Kindly resend a product that fits the specifications required. If not, the Buyer has the right to `}
              style={{
                fontSize: mvs(12),
                color: colors.typeHeader,
                marginTop: mvs(15),
                textAlign: 'center',
              }}>
              <Regular
                label="Reject the Deal"
                style={{
                  fontSize: mvs(12),
                  color: colors.pink,
                }}
              />
            </DualText>
          )}
        </>
      );
    } else if (item?.type_verbose === 'VIDEO_MESSAGE') {
      return (
        <ProductStatusCard
          image={`${active_chat?.image_base_url}${item?.body}`}
          sending={item?.body !== '' ? false : true}
          onPressImage={() => {
            setVideo(
              `https://api.taketo.exodevs.com/storage/threads/${thread_id}/videos/${item?.body}`,
            );
            setPlayingVideo(true);
          }}
          style={{
            flexDirection:
              item?.owner_id === profileData?.id ? 'row' : 'row-reverse',
            borderColor: 'red',
          }}
          profileData={profileData}
          item={item}
          video
          imageStyle={{
            height: mvs(150),
            width: mvs(200),
            paddingVertical: 0,
            paddingHorizontal: 0,
            marginLeft: item?.owner_id !== profileData?.id ? mvs(19) : mvs(0),
            marginRight: item?.owner_id !== profileData?.id ? mvs(0) : mvs(19),
            borderColor:
              item?.owner_id !== profileData?.id
                ? colors.lightgrey1
                : colors.primary,
          }}
        />
      );
    } else if (item?.type_verbose === 'DOCUMENT_MESSAGE') {
      return (
        <TouchableOpacity
          onPress={() => onOpenDoc(item, index)}
          disabled={downState !== ''}
          style={{
            ...styles.playerMainContainer,
            alignSelf:
              item?.owner_id === profileData?.id ? 'flex-end' : 'flex-start',
            backgroundColor:
              item?.owner_id === profileData?.id
                ? colors?.primary
                : colors.secondary,
            width: mvs(268),
            height: mvs(52),
            justifyContent: item?.audio === '' ? 'center' : null,
            // borderWidth : RNFS.exists(fs.dirs.DownloadDir + '/' + item?.boby) ? 1 : 0
          }}>
          {item?.owner_id === profileData?.id ? (
            <Doc1 height={mvs(20)} width={mvs(20)} />
          ) : (
            <Doc2 height={mvs(20)} width={mvs(20)} />
          )}
          <Regular
            label={
              selectedFile == index
                ? downState === ''
                  ? item?.body == ''
                    ? 'Sending ...'
                    : item?.body?.length > 20
                      ? `${item?.body?.substring(0, 20)} ...`
                      : item?.body
                  : downState
                : item?.body == ''
                  ? 'Sending ...'
                  : item?.body?.length > 20
                    ? `${item?.body?.substring(0, 20)} ...`
                    : item?.body
            }
            style={{
              color:
                item?.owner_id === profileData?.id
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
                  item?.owner_id === profileData?.id
                    ? colors.white
                    : colors.typeHeader,
                fontSize: mvs(10),
              }}
            />
            {item?.owner_id === profileData?.id &&
              (item?.unread ? (
                <Deliver style={{ marginLeft: mvs(10) }} />
              ) : (
                <SeenWhite style={{ marginLeft: mvs(10) }} />
              ))}
          </View>
        </TouchableOpacity>
      );
    } else if (
      active_chat?.order?.order_step !== 'order_step_1' &&
      active_chat?.order?.order_step !== 'order_step_2' &&
      active_chat?.order?.order_step !== 'order_step_3' &&
      active_chat?.order?.order_step !== 'order_step_4' &&
      item?.type_verbose === 'RECEIPT_IMAGE_MESSAGE'
    ) {
      return (
        <ProductStatusCard
          showStatus={true}
          status={
            active_chat?.order?.order_step === 'Disputed' &&
              messages[messages?.length - 1]?.type_verbose ===
              'RECEIPT_IMAGE_MESSAGE'
              ? 'Disputed'
              : ''
          }
          label={
            active_chat?.order?.order_step === 'Disputed' &&
              messages[messages?.length - 1]?.type_verbose ===
              'RECEIPT_IMAGE_MESSAGE'
              ? 'Reciept Disputed'
              : 'Reciept Approved'
          }
          profileData={profileData}
          item={item}
          image={`${active_chat?.image_base_url}${item?.body}`}
          onPressImage={() => {
            if (item?.body !== '') {
              setImages([
                {
                  uri: `${active_chat?.image_base_url}${item?.body}`,
                },
              ]);
              setImageViewer(true);
            }
          }}
          style={{
            flexDirection:
              item?.owner_id === profileData?.id ? 'row' : 'row-reverse',
          }}
          imageStyle={{
            marginLeft: item?.owner_id !== profileData?.id ? mvs(19) : mvs(0),
            marginRight: item?.owner_id !== profileData?.id ? mvs(0) : mvs(19),
          }}
        />
      );
    } else if (
      active_chat?.order?.order_step !== 'order_step_1' &&
      active_chat?.order?.order_step !== 'order_step_2' &&
      item?.type_verbose === 'PRODUCT_IMAGE_MESSAGE'
    ) {
      return (
        <>
          {/* <PriceWithStatus
          price = {active_chat?.order?.offer_reward}
          style = {{
            paddingHorizontal : 0, 
            marginTop : mvs(15),
            flexDirection : item?.owner_id === profileData?.id ? 'row' : 'row-reverse',
          }}
          /> */}
          <ProductStatusCard
            showStatus={true}
            status={
              active_chat?.order?.order_step === 'Disputed' &&
                messages[messages?.length - 1]?.type_verbose ===
                'PRODUCT_IMAGE_MESSAGE'
                ? 'Disputed'
                : ''
            }
            style={{
              flexDirection:
                item?.owner_id === profileData?.id ? 'row' : 'row-reverse',
            }}
            profileData={profileData}
            item={item}
            label={
              active_chat?.order?.order_step === 'Disputed' &&
                messages[messages?.length - 1]?.type_verbose ===
                'PRODUCT_IMAGE_MESSAGE'
                ? 'Product Disputed'
                : 'Product Approved'
            }
            image={`${active_chat?.image_base_url}${item?.body}`}
            onPressImage={() => {
              if (item?.body !== '') {
                setImages([
                  {
                    uri: `${active_chat?.image_base_url}${item?.body}`,
                  },
                ]);
                setImageViewer(true);
              }
            }}
            imageStyle={{
              marginLeft: item?.owner_id !== profileData?.id ? mvs(19) : mvs(0),
              marginRight:
                item?.owner_id !== profileData?.id ? mvs(0) : mvs(19),
            }}
          />
        </>
      );
    } else if (
      active_chat?.order?.order_step !== 'order_step_2' &&
      active_chat?.order?.order_step !== 'order_step_3' &&
      item?.type_verbose === 'RECEIPT_IMAGE_MESSAGE'
    ) {
      return (
        <ProductStatusCard
          showStatus={true}
          label={
            active_chat?.order?.is_buyer
              ? 'Approve Reciept'
              : 'Pending Approval Reciept'
          }
          profileData={profileData}
          item={item}
          image={`${active_chat?.image_base_url}${item?.body}`}
          onPressImage={() => {
            active_chat?.order?.is_buyer &&
              navigation.navigate('approve', {
                type: 'receipt',
                order_data: {
                  ...active_chat?.order,
                  product_img: '',
                  thread_id,
                  product_image: `${active_chat?.image_base_url}${item?.body}`,
                  participant_name: active_chat?.order?.participant_name,
                },
              });
          }}
          style={{
            flexDirection:
              item?.owner_id === profileData?.id ? 'row' : 'row-reverse',
          }}
          imageStyle={{
            marginLeft: item?.owner_id !== profileData?.id ? mvs(19) : mvs(0),
            marginRight: item?.owner_id !== profileData?.id ? mvs(0) : mvs(19),
          }}
        />
      );
    } else if (
      active_chat?.order?.order_step == 'order_step_2' &&
      item?.type_verbose === 'PRODUCT_IMAGE_MESSAGE'
    ) {
      return (
        <>
          {/* <PriceWithStatus
          price = {active_chat?.order?.offer_reward}
          style = {{
            paddingHorizontal : 0, 
            marginTop : mvs(15),
            flexDirection : item?.owner_id === profileData?.id ? 'row' : 'row-reverse',
          }}
          /> */}
          <ProductStatusCard
            {...props}
            showStatus={true}
            status={item?.status}
            label={
              active_chat?.order?.is_buyer
                ? 'Approve Product Image'
                : 'Pending Approval Product Image'
            }
            profileData={profileData}
            item={item}
            image={`${active_chat?.image_base_url}${item?.body}`}
            onPressImage={() => {
              active_chat?.order?.is_buyer &&
                navigation.navigate('approve', {
                  type: 'product',
                  order_data: {
                    ...active_chat?.order,
                    product_img: '',
                    thread_id,
                    product_image: `${active_chat?.image_base_url}${item?.body}`,
                    participant_name: active_chat?.order?.participant_name,
                  },
                });
            }}
            style={{
              flexDirection:
                item?.owner_id === profileData?.id ? 'row' : 'row-reverse',
            }}
            imageStyle={{
              marginLeft: item?.owner_id !== profileData?.id ? mvs(19) : mvs(0),
              marginRight:
                item?.owner_id !== profileData?.id ? mvs(0) : mvs(19),
            }}
          />
        </>
      );
    } else if (item?.type_verbose === 'MAP') {
      return (
        <ShareLocation
          {...props}
          profileData={profileData}
          item={item}
          onPress={() => {
            showLocation({
              latitude: item?.body?.split(',')[0],
              longitude: item?.body?.split(',')[1],
            });
          }}
          style={{
            flexDirection:
              item?.owner_id === profileData?.id ? 'row' : 'row-reverse',
          }}
          mapStyles={{
            marginLeft: item?.owner_id !== profileData?.id ? mvs(19) : mvs(0),
            marginRight: item?.owner_id !== profileData?.id ? mvs(0) : mvs(19),
          }}
        />
      );
    } else if (item?.type_verbose == 'AUDIO_MESSAGE') {
      return (
        <View
          style={{
            ...styles.playerMainContainer,
            alignSelf:
              item?.owner_id === profileData?.id ? 'flex-end' : 'flex-start',
            backgroundColor:
              item?.owner_id === profileData?.id
                ? colors?.primary
                : colors.secondary,
            width: item?.audio === '' ? mvs(268) : null,
            justifyContent: item?.audio === '' ? 'center' : null,
          }}>
          {item?.audio !== '' ? (
            <>
              <ImagePlaceholder
                bg_img={
                  item?.owner_id !== profileData?.id
                    ? active_chat?.order?.participant_profile_picture
                    : profileData?.profile_picture
                }
                containerStyle={{
                  height: mvs(30),
                  width: mvs(30),
                  borderRadius: mvs(30 / 2),
                }}
              />
              {playerId === index ? (
                progress.position !== 0 ? (
                  !playing ? (
                    item?.owner_id === profileData?.id ? (
                      <Play1
                        onPress={async () => {
                          setPlaying(true);
                          await TrackPlayer.play();
                        }}
                        style={{ marginLeft: mvs(20) }}
                      />
                    ) : (
                      <Play2
                        onPress={async () => {
                          setPlaying(true);
                          await TrackPlayer.play();
                        }}
                        style={{ marginLeft: mvs(20) }}
                      />
                    )
                  ) : item?.owner_id === profileData?.id ? (
                    <Pause1
                      onPress={async () => {
                        setPlaying(false);
                        await TrackPlayer.pause();
                      }}
                      height={mvs(17)}
                      width={mvs(17)}
                      style={{ marginLeft: mvs(20) }}
                    />
                  ) : (
                    <Pause2
                      onPress={async () => {
                        await setPlaying(false);
                        TrackPlayer.pause();
                      }}
                      height={mvs(17)}
                      width={mvs(17)}
                      style={{ marginLeft: mvs(20) }}
                    />
                  )
                ) : (
                  <Chase
                    size={mvs(17)}
                    color={
                      item?.owner_id === profileData?.id
                        ? '#8ab9fd'
                        : colors.primary
                    }
                    style={{ marginLeft: mvs(20) }}
                  />
                )
              ) : item?.owner_id === profileData?.id ? (
                <Play1
                  onPress={async () => {
                    setPlayerId(index);
                    setPlaying(true);
                    const temp = item?.audio?.split(/[\s/]+/);
                    const audio = temp[temp.length - 1];
                    await TrackPlayer.reset();
                    await TrackPlayer.add({
                      url: {
                        uri: `https://api.taketo.exodevs.com/storage/threads/${thread_id}/audio/${audio}`,
                      },
                      artist: audio,
                      id: `index`,
                      title: 'TakeTo Audio Playing',
                      genre: 'Phish',
                    });
                    await TrackPlayer.play();
                  }}
                  style={{ marginLeft: mvs(20) }}
                />
              ) : (
                <Play2
                  onPress={async () => {
                    setPlayerId(index);
                    setPlaying(true);
                    const temp = item?.audio?.split(/[\s/]+/);
                    const audio = temp[temp.length - 1];
                    TrackPlayer.reset();
                    TrackPlayer.add({
                      url: {
                        uri: `https://api.taketo.exodevs.com/storage/threads/${thread_id}/audio/${audio}`,
                      },
                      artist: audio,
                      id: `index`,
                      title: 'TakeTo Audio Playing',
                      genre: 'Phish',
                    });
                    await TrackPlayer.play();
                  }}
                  style={{ marginLeft: mvs(20) }}
                />
              )}
              <Slider
                step={1}
                animateTransitions={true}
                //animationType = {'spring'}
                style={{ flex: 1, marginLeft: mvs(18) }}
                value={playerId == index ? progress.position : 0}
                thumbStyle={{ height: 15, width: 15 }}
                minimumValue={min}
                thumbTintColor={
                  item?.owner_id === profileData?.id
                    ? colors.white
                    : colors.primary
                }
                maximumValue={progress.duration}
                minimumTrackTintColor={
                  item?.owner_id === profileData?.id
                    ? '#8AB9FD'
                    : colors.lightgrey1
                }
                maximumTrackTintColor={
                  item?.owner_id === profileData?.id
                    ? '#8AB9FD'
                    : colors.lightgrey1
                }
                onSlidingComplete={async v => {
                  await TrackPlayer.seekTo(v);
                }}
              />
              <View style={styles.timeContainer}>
                <Regular
                  label={TAKE_TO_CONSTANT.getConversationTime(item?.created_at)}
                  style={{
                    color:
                      item?.owner_id === profileData?.id
                        ? colors.white
                        : colors.typeHeader,
                    fontSize: mvs(10),
                  }}
                />
                {item?.owner_id === profileData?.id &&
                  //   <SeenWhite style={{marginLeft: mvs(10)}} />
                  // ) : (
                  (item?.unread ? (
                    <Deliver style={{ marginLeft: mvs(10) }} />
                  ) : (
                    <SeenWhite style={{ marginLeft: mvs(10) }} />
                  ))}
              </View>
            </>
          ) : (
            <Chase size={mvs(30)} color={colors.white} />
          )}
        </View>
      );
    }
  };

  {
    /* ================= MAIN_RENDER =================== */
  }
console.log('is_close chat :: in chat ',is_chat_close);
  if (loadingChat) {
    return (
      <View style={styles.CONTAINER}>
        <Header
          {...props}
          title={participant_name || 'Inbox'}
          allowBackBtn
          userIcon={false}
          is_chat_close={is_chat_close}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Chase size={mvs(30)} color={colors.primary} />
        </View>
      </View>
    );
  } else
    return (
      <View style={{ ...styles.CONTAINER, paddingBottom: insets.bottom }}>
      <KeyboardWrapper>
        <Header
          {...props}
          
          title={active_chat?.order?.participant_name}
          allowBackBtn
          option
          onReject={() => setDeclineModal(true)}
          onDispute={() => {
            setDisputeTitle('Dispute');
            setDeliveryDisputedModal(true);
          }}
          userIcon={false}
          is_chat_close={is_chat_close}
          onPressOptions={() =>setCalModal(true)}
          isReject={
            active_chat?.order?.order_step == 'negotiate' &&
            active_chat?.order?.is_buyer
          }
          disputedDelivery={active_chat?.order?.order_step.includes('_')}
        />
        
          <View style={{ ...styles.BODY ,marginTop:mvs(3)}}>
            <OrderStatusCard
              {...props}
              reward={
                active_chat?.order?.order_step === 'negotiate'
                  ? active_chat?.order?.order_reward
                  : active_chat?.order?.offer_reward
              }
              message={messages[messages?.length - 1]}
            />

            <View style={{ flex: 1 }}>
              <FlatList
                ref={scrollRef}
                data={messages}
                ListFooterComponent={() =>
                  loading && (
                    <Chase
                      size={mvs(20)}
                      color={colors.primary}
                      style={{ alignSelf: 'center', marginTop: mvs(5) }}
                    />
                  )
                }
                keyExtractor={(item, idex) => item?.id?.toString()}
                renderItem={renderMessage}
                // onContentSizeChange={() =>
                //   scrollRef.current.scrollToOffset({animated: true, offset: 0})
                // }
                inverted
                style={{
                  flex: 1,
                  flexDirection: 'column',
                }}
                contentContainerStyle={{
                  paddingTop: mvs(50),
                  paddingHorizontal: mvs(20),
                }}
                showsVerticalScrollIndicator={false}
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                  if (!loading && !meta?.final_page) {
                    setLoading(true);
                    fetchActiveChat(thread_id, meta?.next_page_id);
                  }
                }}
              />
            </View>
            <View style={{ paddingHorizontal: mvs(20) }}>
              {(active_chat?.order?.order_step !== 'Disputed' ||
                active_chat?.order?.order_step !== 'completed' ||
                active_chat?.order?.order_step !== 'rejected') &&
                active_chat?.order?.chat_end === false && (
                  <Fragment>
                    {active_chat?.order?.order_step == 'order_step_1' &&
                      !active_chat?.order?.is_buyer && (
                        <SendProduct
                          uri={imagePicker?.uri || null}
                          pickImage={() => setOpenPicker(true)}
                          sendProductImage={async () => {
                            const formData = new FormData();
                            formData.append('image', imagePicker);
                            formData.append('temporary_id', '123-456-789');
                            formData.append('type', 'product');
                            formData.append(
                              'order_id',
                              active_chat?.order?.order_id,
                            );
                            try {
                              setSendProductLoading(true);
                              await messangerClient.post(
                                `${services.messanger.open_chat}/${thread_id}/images`,
                                formData,
                              );
                              await fetchActiveChat(`${thread_id}`);
                              setSendProductModal(true);
                              setSendProductLoading(false);
                              setImagePicker({});
                            } catch (error) {
                              setSendProductLoading(false);
                              alertRef.current.alertWithType(
                                'error',
                                'Error',
                                UI_API._returnError(error),
                              );
                            }
                          }}
                          sendProductLoading={sendProductLoading}
                          disabled={
                            imagePicker?.uri === undefined
                              ? true
                              : false || sendProductLoading
                          }
                        />
                      )}
                    {active_chat?.order?.order_step == 'order_step_1' &&
                      active_chat?.order?.is_buyer && (
                        <ProductStatusCard
                          showStatus={true}
                          showTime={false}
                          label="Pending Product Image"
                          image={null}
                          style={{
                            justifyContent: 'space-around',
                            paddingRight: 0,
                          }}
                          imageStyle={{ marginRight: 0 }}
                          onPressImage={() => { }}
                        />
                      )}
                    {/* ================= END SEND PRODUCT IMAGE =================== */}

                    {/* ================= START SEND RECIEPT IMAGE =================== */}
                    {active_chat?.order?.order_step == 'order_step_3' &&
                      active_chat?.order?.is_buyer && (
                        <ProductStatusCard
                          showTime={false}
                          showStatus={true}
                          label="Pending Reciept Image"
                          image={null}
                          style={{
                            justifyContent: 'space-around',
                            paddingRight: 0,
                          }}
                          imageStyle={{ marginRight: 0 }}
                          onPressImage={() => { }}
                        />
                      )}
                    {active_chat?.order?.order_step == 'order_step_3' &&
                      !active_chat?.order?.is_buyer && (
                        <SendReceipt
                          uri={imagePicker?.uri || null}
                          pickImage={() => setOpenPicker(true)}
                          sendProductImage={async () => {
                            const formData = new FormData();
                            formData.append('image', imagePicker);
                            formData.append('temporary_id', '123-456-789');
                            formData.append('type', 'receipt');
                            formData.append(
                              'order_id',
                              active_chat?.order?.order_id,
                            );
                            try {
                              setSendProductLoading(true);
                              await messangerClient.post(
                                `${services.messanger.open_chat}/${thread_id}/images`,
                                formData,
                              );
                              await fetchActiveChat(`${thread_id}`);
                              setSendReceiptModal(true);
                              setSendProductLoading(false);
                            } catch (error) {
                              setSendProductLoading(false);
                              alertRef.current.alertWithType(
                                'error',
                                'Error',
                                UI_API._returnError(error),
                              );
                            }
                          }}
                          sendProductLoading={sendProductLoading}
                          disabled={
                            imagePicker?.uri === undefined
                              ? true
                              : false || sendProductLoading
                          }
                        />
                      )}
                    {/* ================= END SEND RECIEPT IMAGE =================== */}

                    {/* ================= START APPROVE ORDER PRICE =================== */}
                    {/* <ButtonWithPrice
                      price={'90'}
                      title={'Approve'}
                      onPress={() => {
                        setRewardAccepted(true);
                      }}
                    /> */}
                    {/* ================= END APPROVE ORDER PRICE =================== */}

                    {/* ================= START SECTION BUTTON (CONFIRM AND DISPUTE DELIVERY) =================== */}
                    {active_chat?.order?.order_step == 'order_step_8' && (
                      <>
                        {active_chat?.order?.is_buyer ? (
                          <TwoButtons
                            sendProductLoading={sendProductLoading}
                            sendDisputeoading={sendDisputeoading}
                            onPress1={() => {
                              confirmDeliveryLocation(true); //setDeliveryConfirmedModal(true);
                            }}
                            onPress2={() => {
                              setDisputeTitle('Delivery Disputed');
                              setDeliveryDisputedModal(true);
                            }}
                          />
                        ) : (
                          <ProductStatusCard
                            showTime={false}
                            showStatus={true}
                            label="Pending Delivery Confirmation"
                            image={null}
                            show_img={false}
                            onPressImage={() => { }}
                            style={{
                              justifyContent: 'space-around',
                              paddingRight: 0,
                              height: mvs(52),
                            }}
                            imageStyle={{ marginRight: 0 }}
                          />
                        )}
                      </>
                    )}
                    {/* ================= END SECTION BUTTON (CONFIRM AND DISPUTE DELIVERY) =================== */}

                    {/* ================= START SEND CUSTOME OFFER =================== */}
                    {/* <ButtonWithPrice price={'90'} title={'Send'} onPress={() => {}} /> */}
                    {/* ================= END SEND CUSTOME OFFER =================== */}

                    {/* ================= START DELIVERY LOCATION PICKER =================== */}

                    {/* {active_chat?.order?.order_step == 'order_step_5' &&
                     !active_chat?.order?.is_buyer && (
                      <Buttons.ButtonPrimary
                        onClick={requestDeliveryAddress}
                        loading={sendProductLoading}
                        loaderColor={colors.white}
                        disabled={sendProductLoading}
                        title={'Request Delivery Address'}
                        style={{marginBottom: mvs(40), marginTop: mvs(15)}}
                      />
                    )} */}

                    {active_chat?.order?.order_step == 'order_step_5' && (
                      <>
                        {!active_chat?.order?.is_buyer ? (
                          <Buttons.ButtonPrimary
                            onClick={() => requestDeliveryAddress()}
                            loading={sendProductLoading}
                            loaderColor={colors.white}
                            disabled={sendProductLoading}
                            title={'Request Delivery Address'}
                            style={{ marginBottom: mvs(20), marginTop: mvs(15) }}
                          />
                        ) : (
                          <ProductStatusCard
                            showStatus={true}
                            showTime={false}
                            label="Pending Delivery Address"
                            image={null}
                            show_img={false}
                            style={{
                              justifyContent: 'space-around',
                              paddingRight: 0,
                              height: mvs(52),
                            }}
                            imageStyle={{ marginRight: 0 }}
                            onPressImage={() => { }}
                          />
                        )}
                      </>
                    )}
                    {/* ================= END DELIVERY LOCATION PICKER =================== */}

                    {/* ================= START DELIVERY LOCATION PICKER =================== */}
                    {active_chat?.order?.order_step == 'order_step_6' && (
                      <>
                        {active_chat?.order?.is_buyer ? (
                          <Buttons.ButtonPrimary
                            onClick={() => {
                              setlocflag(false);
                              toggleDeliveryAddressModal(true);
                            }}
                            loading={sendProductLoading}
                            loaderColor={colors.white}
                            disabled={sendProductLoading}
                            title={'Send Delivery Address'}
                            style={{ marginBottom: mvs(20), marginTop: mvs(15) }}
                          />
                        ) : (
                          <ProductStatusCard
                            showStatus={true}
                            showTime={false}
                            label="Pending Delivery Address"
                            image={null}
                            show_img={false}
                            onPressImage={() => { }}
                            style={{
                              justifyContent: 'space-around',
                              paddingRight: 0,
                              height: mvs(52),
                            }}
                            imageStyle={{ marginRight: 0 }}
                          />
                        )}
                      </>
                    )}
                    {/* ================= END DELIVERY LOCATION PICKER =================== */}

                    {/* ================= START DELIVERY REQUEST CONFIRM & PENDING =================== */}
                    {active_chat?.order?.order_step == 'order_step_7' && (
                      <>
                        {!active_chat?.order?.is_buyer ? (
                          <Buttons.ButtonPrimary
                            onClick={requestDeliveryAddress}
                            loading={sendProductLoading}
                            loaderColor={colors.white}
                            disabled={sendProductLoading}
                            title={'Request Delivery Confirmation'}
                            style={{ marginBottom: mvs(20), marginTop: mvs(15) }}
                          />
                        ) : (
                          <ProductStatusCard
                            showStatus={true}
                            showTime={false}
                            label="Pending Delivery Confirmation"
                            image={null}
                            show_img={false}
                            onPressImage={() => { }}
                            style={{
                              justifyContent: 'space-around',
                              paddingRight: 0,
                              height: mvs(52),
                            }}
                            imageStyle={{ marginRight: 0 }}
                          />
                        )}
                      </>
                    )}
                    {/* ================= END DELIVERY REQUEST CONFIRM & PENDING =================== */}
                  </Fragment>
                )}
            </View>

            {active_chat?.order?.order_step === 'negotiate' &&
              active_chat?.order?.chat_end === false &&
              (active_chat?.order?.is_buyer ? (
                <View style={{ paddingTop: mvs(10) }}>
                  <ButtonWithPrice
                    loading={reqApproving}
                    onClick={async () => {
                      try {
                        setReqApproving(true);
                        const payload = {
                          offer_id: active_chat?.order?.offer_id,
                          order_request_id:
                            active_chat?.order?.order_request_id,
                          reward: active_chat?.order?.raw_offer_reward, // after negotiation final reward price will be sent
                          // thread_id: thread_id?.data
                        };
                        await client.post(
                          `${services.create_order.accept_offer}`,
                          payload,
                        );
                        fetchActiveChat(thread_id);
                        channel?.whisper('read', {
                          provider_id: '1212',
                          provider_alias: 'alskalsa',
                          avatar: 'isRead?.body',
                          message_id: 'step',
                        });
                        setReqApproving(false);
                      } catch (error) {
                        setReqApproving(false);
                        alertRef.current.alertWithType(
                          'error',
                          'Error',
                          UI_API._returnError(error),
                        );
                      }
                    }}
                    title="Approve"
                    price={active_chat?.order?.offer_reward}
                  />
                </View>
              ) : (
                <View style={{}}>
                  <Regular
                    label="Negotiated Reward"
                    style={{
                      fontSize: mvs(12),
                      color: colors.typeHeader,
                      marginLeft: mvs(22),
                      marginTop: mvs(10),
                    }}
                  />
                  {console.log('profileData:::',profileData)}
                  <ButtonWithPriceInput
                    priceUnit={active_chat?.order?.order_reward?.includes('USD')?'USD': profileData?.currency?.currency_code}
                    loading={offerSending}
                    disabled={offerPrice === ''}
                    onClick={async () => {
                      try {
                        Keyboard.dismiss();
                        setOfferSending(true);
                        await client.post(
                          `${services.create_order.update_offer}/${active_chat?.order?.offer_id}`,
                          { reward: offerPrice },
                        );
                        channel?.whisper('read', {
                          provider_id: '1212',
                          provider_alias: 'alskalsa',
                          avatar: 'isRead?.body',
                          message_id: 'step',
                        });
                        setOfferSending(false);
                        setOfferPrice('');
                        alertRef.current.alertWithType(
                          'success',
                          'Offer Sent Successfully',
                          '',
                        );
                      } catch (error) {
                        setOfferSending(false);
                        alertRef.current.alertWithType(
                          'error',
                          'Error',
                          UI_API._returnError(error),
                        );
                      }
                    }}
                    title="Send"
                    onChangeText={txt => {
                      if (txt === '') {
                        setOfferPrice(txt.trim());
                      } else if (TAKE_TO_CONSTANT.floatValidation(txt)) {
                        setOfferPrice(txt.trim());
                      }
                    }}
                    price={offerPrice}
                  />
                </View>
              ))}

            <InputToolbar
              onChangeText={txt => {
                setMessage(txt);
              }}
              close={is_chat_close}
              sending={sending}
              value={message}
              status={active_chat?.order?.order_step}
              send={message.trim() !== '' ? true : false}
              onPlus={() => setPlusModal(true)}
              onSendMessage={onSendMessage}
              onStop={res => sendAudio(res)}
              onFocus={() => {
                // console.log('onFocus');
                scrollRef.current.scrollToOffset({ animated: true, offset: 0 });
              }}
            />
          </View>

          {/* <DeliveryConfirmedModal
          visible={deliveryConfirmedModal}
          user_name={active_chat?.order?.participant_name}
          onClose={() => setDeliveryConfirmedModal(false)}
          isRateUser
          onPrimary={() => {
            setDeliveryConfirmedModal(false);
            navigation.navigate('userprofile', {
              user_id: active_chat?.order?.participant_id,
              is_review: true,
              order_id: active_chat?.order?.order_id,
            });
          }}
        /> */}

          {/* <ReceiptDisputedModal
          visible={deliveryDisputedModal}
          dispute
          onClose={() => setDeliveryDisputedModal(false)}
          onSubmit={() => setDeliveryDisputedModal(false)}
          onAttach={() => { }}
        /> */}

          <RewardAcceptedModal
            visible={rewardAccepted}
            onSendButton={() => {
              setRewardAccepted(false);
              setRejectDealModal(true);
            }}
            onClose={() => {
              setRewardAccepted(false);
            }}
          />

          <StatusModal
            visible={rejectDealModal}
            title="Deal Rejected"
            onClose={() => {
              setRejectDealModal(false);
            }}
            buttonTitle={'Back to Delivery History'}
          />

          <StatusModal
            visible={sendProductModal}
            title="Product Sent"
            onClose={() => {
              setSendProductModal(false);
            }}
            buttonTitle={'Back to Delivery History'}
            endButton
            endButtonTitle={'Back'}
            btnColor={colors.primary}
          />

          <StatusModal
            visible={sendReceiptModal}
            onConfirm={() => {
              setSendReceiptModal(false);
            }}
            title="Receipt Sent"
            onClose={() => {
              setSendReceiptModal(false);
            }}
            buttonTitle={'Back to Delivery History'}
            endButton
            endButtonTitle={'Back'}
            btnColor={colors.primary}
          />

          <StatusModal
            title="Reject Deal"
            name={active_chat?.order?.participant_name}
            visible={declineModal}
            mainButton
            loading={rejecting}
            endButton
            buttonTitle={'Confirm & Prceed to Offers'}
            endButtonTitle={'Cancel'}
            onClose={() => {
              setDeclineModal(false);
            }}
            onConfirm={onDealReject}
          />

          <DeliveryAddressRequested
            onClose={toggleDeliveryAddressModal}
            onNext={sendDeliveryAddress}
            visible={showDeliveryAddressModal}
            step={1}
          />

          <DeliveryAddressRequested
            onClose={setOpenDeliveryReq}
            onNext={() => setOpenDeliveryReq(false)}
            visible={openDeliveryReq}
            order_step={
              active_chat?.order?.order_step == 'order_step_8' ? true : false
            }
            step={3}
          />

          <DeliveryConfirmedModal
            onPrimary={() => {
              setDeliveryConfirmedModal(false);
              navigation.navigate('userprofile', {
                user_id: active_chat?.order?.participant_id,
                is_review: true,
                order_id: active_chat?.order?.order_id,
              });
            }}
            visible={deliveryConfirmedModal}
            user_name={active_chat?.order?.participant_name}
            onClose={() => setDeliveryConfirmedModal(false)}
          />

          <DeliveryDisputedModal
            title={disputeTitle}
            visible={deliveryDisputedModal}
            onClose={() => setDeliveryDisputedModal(false)}
            isRateUser
            onPrimary={reason => confirmDeliveryLocation(false, reason)}
          />

          <PlusOptionsModal
            onPress={onPressPlusOptions}
            visible={plusModal}
            onClose={() => setPlusModal(false)}
          />

          <CalOptionsModal
            onPress={onPressCalOptions}
            visible={calModal}
            onClose={() => setCalModal(false)}
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

          <VideoPlayer
            visible={playingVideo}
            video={video}
            onClose={() => {
              setPlayingVideo(false);
            }}
          />

          <RatingSubmittedModal
            onPrimary={async () => {
              try {
                setReOrderLoading(true);
                const res = await TAKE_2_API.fetchOrderDetails(
                  active_chat?.order?.order_request_id,
                );
                UI_API._reOrderHandler(
                  res?.data,
                  countriesList,
                  (screen, reorder_obj) => {
                    console.log('reorder_obj:::',);
                    navigation?.navigate(screen, {...reorder_obj,isLocal:reorder_obj?.reward?.inculdes('USD')?false:true});
                  },
                );
              } catch (error) {
                setReOrderLoading(false);
                alertRef.current.alertWithType(
                  'error',
                  'Error',
                  UI_API._returnError(error),
                );
              } finally {
                setReOrderLoading(false);
                setDisputSubmitted(false);
              }
            }}
            onOuline={() => {
              setDisputSubmitted(false);
              props?.navigation?.replace(
                active_chat?.order?.is_buyer
                  ? 'orderhistory'
                  : 'deliveryhistory',
              );
            }}
            onClose={setDisputSubmitted}
            visible={disputSubmitted}
            reOrderLoading={reOrderLoading}
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
    showDeliveryAddressModal: state.common?.showDeliveryAddressModal,
    deliveryAddress: state.common.deliveryAddress || {},
    anotherEcho: state.common?.anotherEcho || {},
    countriesList: state.common.countriesList,
  };
};

const mapDispatchToProps = dispatch => ({
  fetchActiveChat: (thread_id, pageId) =>
    dispatch(TAKE_TO_ACTIONS.fetchActiveChat(thread_id, pageId)),
  newMessageArrived: msg => dispatch(TAKE_TO_ACTIONS.newMessageArrived(msg)),
  updateMessage: msg => dispatch(TAKE_TO_ACTIONS.updateMessage(msg)),
  toggleDeliveryAddressModal: bool =>
    dispatch(TAKE_TO_ACTIONS.toggleDeliveryAddressModal(bool)),
  onSaveDeliveryAddressToRedux: payload =>
    dispatch(TAKE_TO_ACTIONS.onSaveDeliveryAddressToRedux(payload)),
  updateInboxList: (list, id, counterOnly) =>
    dispatch(TAKE_TO_ACTIONS?.updateInboxList(list, id, counterOnly)),
  lastSeen: (id, last_read) =>
    dispatch(TAKE_TO_ACTIONS?.lastSeen(id, last_read)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);

const ButtonWithPriceInput = ({
  onClick,
  title,
  loading,
  priceUnit,
  price,
  disabled,
  onChangeText,
}) => (
  <View style={[styles.BUTTON_CONTAINER, styles.ROW, { marginTop: mvs(13) }]}>
    <TAKE_TO_INPUT_FIELD.PriceInput
      priceUnit={priceUnit}
      placeholder={'0'}
      onChangeText={onChangeText}
      containerStyle={{ ...styles.PRICE_INPUT }}
      style={{
        color: colors.primary,
        fontSize: mvs(23),
        fontFamily: fonts.carosSoftRegular,
      }}
      value={price}
      unitStyle={{
        fontFamily: fonts.carosSoftRegular,
        fontSize: mvs(23),
      }}
    />
    <Buttons.ButtonPrimary
      loaderColor={colors.white}
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      title={title}
      style={{ width: '49%', height: mvs(52), backgroundColor: colors.primary }}
    />
  </View>
);

const ButtonWithPrice = ({ onClick, title, price, loading }) => (
  <View style={[styles.BUTTON_CONTAINER, styles.ROW]}>
    <Buttons.ButtonPrimary
      disabled
      textStyle={{ color: colors.headerTitle }}
      title={`${price}`}
      style={{
        width: '49%',
        height: mvs(52),
        borderColor: colors.price_border,
        backgroundColor: colors.white,
        borderWidth: mvs(0.5),
      }}
    />
    <Buttons.ButtonPrimary
      loaderColor={colors.white}
      loading={loading}
      onClick={onClick}
      title={title}
      style={{ width: '49%', height: mvs(52), backgroundColor: colors.green }}
    />
  </View>
);

const PriceWithStatus = ({ title, price, style }) => (
  <View style={[styles.BUTTON_CONTAINER, styles.ROW, style]}>
    <Regular
      label={'Offer Approved'}
      style={{
        color: colors.green,
        fontSize: mvs(12),
      }}
    />
    <Buttons.ButtonPrimary
      disabled
      textStyle={{ color: colors.headerTitle }}
      title={`${price}`}
      style={{
        width: '49%',
        height: mvs(52),
        borderColor: colors.price_border,
        backgroundColor: colors.white,
        borderWidth: mvs(0.5),
      }}
    />
  </View>
);

const TwoButtons = ({
  onPress1,
  onPress2,
  sendProductLoading,
  sendDisputeoading,
}) => (
  <View style={[styles.BUTTON_CONTAINER, styles.ROW, { marginTop: mvs(15) }]}>
    <Buttons.ButtonPrimaryLight
      onClick={onPress1}
      loaderColor={colors.white}
      loading={sendProductLoading}
      disabled={sendProductLoading}
      title={'Confirm Delivery'}
      style={{ width: '49%', height: mvs(52), backgroundColor: colors.green }}
    />
    <Buttons.ButtonPrimary
      onClick={onPress2}
      title={'Dispute Delivery'}
      loading={sendDisputeoading}
      disabled={sendDisputeoading}
      loaderColor={colors.white}
      style={{ width: '49%', height: mvs(52), backgroundColor: colors.disputes }}
      textStyle={{ color: colors.headerTitle }}
    />
  </View>
);

const SendReceipt = ({
  disabled,
  uri,
  sendProductImage,
  pickImage,
  sendProductLoading,
}) => (
  <View
    style={[
      styles.BUTTON_CONTAINER,
      styles.ROW,
      { alignItems: 'flex-end', marginTop: mvs(15) },
    ]}>
    <TouchableOpacity
      onPress={pickImage}
      style={{
        height: mvs(73),
        width: mvs(73),
        borderWidth: 1,
        marginLeft: mvs(44),
        borderRadius: mvs(13),
        borderColor: colors.primary,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
      {uri ? (
        <Image source={{ uri }} style={{ height: '100%', width: '100%' }} />
      ) : (
        <Camera />
      )}
    </TouchableOpacity>
    <Buttons.ButtonPrimary
      onClick={() => sendProductImage()}
      disabled={disabled}
      loaderColor={colors.white}
      loading={sendProductLoading}
      title={'Send Receipt'}
      style={{ width: '49%', height: mvs(52), backgroundColor: colors.green }}
    />
  </View>
);

const SendProduct = ({
  disabled,
  uri,
  sendProductImage,
  pickImage,
  sendProductLoading,
}) => (
  <View
    style={[
      styles.BUTTON_CONTAINER,
      styles.ROW,
      { alignItems: 'flex-end', marginTop: mvs(15) },
    ]}>
    <TouchableOpacity
      onPress={pickImage}
      style={{
        height: mvs(73),
        width: mvs(73),
        borderWidth: 1,
        marginLeft: mvs(44),
        borderRadius: mvs(13),
        borderColor: colors.primary,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
      {uri ? (
        <Image source={{ uri }} style={{ height: '100%', width: '100%' }} />
      ) : (
        <Camera />
      )}
    </TouchableOpacity>
    <Buttons.ButtonPrimary
      onClick={() => sendProductImage()}
      disabled={disabled}
      loading={sendProductLoading}
      loaderColor={colors.white}
      title={'Send Product'}
      style={{ width: '49%', height: mvs(52), backgroundColor: colors.green }}
    />
  </View>
);

const styles = StyleSheet.create({
  CONTAINER: {
    flex: 1,
    
    backgroundColor: colors.white,
  },
  BODY: {
    backgroundColor: colors.white,
    flex: 1,
    paddingTop: mvs(27),
  },
  BUTTON_CONTAINER: {
    //paddingTop: mvs(30),
    //borderWidth : 1,
    paddingHorizontal: mvs(22),
  },
  ROW: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerMainContainer: {
    maxWidth: mvs(268),
    borderRadius: mvs(10),
    backgroundColor: colors.primary,
    marginTop: mvs(15),
    paddingHorizontal: mvs(10),
    paddingVertical: mvs(11),
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    position: 'absolute',
    bottom: mvs(7),
    right: mvs(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  PRICE_INPUT: {
    height: mvs(52),
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    width: '49%',
  },
});
