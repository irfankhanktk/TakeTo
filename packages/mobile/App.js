
// import Echo from 'laravel-echo/dist/echo';
// import React from 'react';
// import { AsyncStorage, Text } from 'react-native';
// import Socketio from 'socket.io-client';


// const App = () => {
//   React.useEffect(async () => {

//     const token = await AsyncStorage.getItem('@token');
//     alert("Yahan aa");
//     let echo = new Echo({
//       broadcaster: 'pusher',
//       host: '88.198.152.58:6001', 
//       key: '11c01f9e26f24ccd6063',
//       authEndpoint: 'https://api.taketo.exodevs.com/api/broadcasting/auth', 

//     });

//   }, [])
//   return (
//     <Text>Hello Fuck you</Text>
//   )
// }

// export default App;









///////////////////////////////////////////////////////////////////////////////////////////////

import store from '@khan_ahmad786/common/store';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import React from 'react';
import {
  Platform,
  StatusBar, StyleSheet, View
} from 'react-native';
import { connect, Provider } from 'react-redux';
import LocalizationContext from './LocalizationContext';
import './src/config/axios-interceptor';
import colors from './src/config/colors';
import * as i18n from './src/i18n';
import  MainNavigator  from './src/navigation/main-navigator/main-navigator';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context';



import AudioRecord from 'react-native-audio-record';




const options = {
  sampleRate: 16000,  // default 44100
  channels: 1,        // 1 or 2, default 1
  bitsPerSample: 16,  // 8 or 16, default 16
  audioSource: 6,     // android only (see below)
  wavFile: 'test.wav' // default 'audio.wav'
};

AudioRecord.init(options);

GoogleSignin.configure({
  // webClientId: '562362298246-7d3tac8o731nu20p28pg0dnmcqcrv5dr.apps.googleusercontent.com',
  webClientId: '562362298246-7d3tac8o731nu20p28pg0dnmcqcrv5dr.apps.googleusercontent.com',
  // iosClientId: '562362298246-vi2qt4s8sqc0g024fbmif3j6nlt4sqcb.apps.googleusercontent.com'
  iosClientId: '562362298246-9bat6olatj0mminug1s62d6p2b1msr9h.apps.googleusercontent.com'
});
const App = props => {



const [notify,setNotify]=React.useState(false)



  //firebase cloud messaging configuration
  //this function is required for ios messaging configuration
  const handleMessaging = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);

    }

  }


  React.useState(() => {
    (async () => {
      const fcmToken = await messaging().getToken()
      console.log(fcmToken)
    })()
  }, [])

  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      setNotify(true)
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });
      console.log("channelId :: ", channelId)
      notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        android: {
          channelId,
          // pressAction: {
          //   id: 'default',
          // },
        },
        ios: {
          categoryId: 'post',

        },
      });

      console.log('Notification Received')
    });

    return unsubscribe;
  }, []);



  React.useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'onNotificationOpenedApp to open from background state:',
        remoteMessage.notification,
      );
      // navigation.navigate(remoteMessage.data.type);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
        // setLoading(false);
      });
  }, []);




  React.useEffect(() => {
    handleMessaging();
  }, []);


  return (
    <SafeAreaProvider style = {{flex : 1,backgroundColor:colors.white}}>
      <Provider store={store||{}}>
        {Platform.OS === 'ios' ? (
          <StatusBar
            barStyle="default" />
        ) : (
          <StatusBar
            translucent
            backgroundColor={colors.primary}
            barStyle="light-content"
          />
        )}
          <MainNavigator newNotificationArrived={notify} isProfileUpdated={()=>{
            //apni state to reset kr 2 k notification aaya hai tu profile get kr li hai
            setNotify(false)
          }}/>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App

const styles = StyleSheet.create({});
