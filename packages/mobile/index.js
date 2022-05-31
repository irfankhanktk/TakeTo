/**
 * @format
 */

import { AppRegistry, PermissionsAndroid } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import 'react-native-get-random-values';
import 'react-native-gesture-handler';
// import RNCallKeep from 'react-native-callkeep';

// RNCallKeep.setup({
//     ios: {
//         appName: 'Take To',
//     },
//     android: {
//         alertTitle: 'Permissions required',
//         alertDescription: 'This application needs to access your phone accounts',
//         cancelButton: 'Cancel',
//         selfManaged: false,
//         okButton: 'ok',
//         imageName: 'ic_launcher',
//        // additionalPermissions: [PermissionsAndroid.PERMISSIONS.READ_CONTACTS],
//         // Required to get audio in background when using Android 11
//         foregroundService: {
//             channelId: 'com.taketo',
//             channelName: 'Foreground service for my app',
//             notificationTitle: 'Calling',
//             notificationIcon: 'Path to the resource icon of the notification',
//         },
//     },
// });
// RNCallKeep.setAvailable(true);

messaging().setBackgroundMessageHandler(async remoteMessage => {
    await console.log(
        'Background Notifiaction caused app to open from background state:',
        remoteMessage,
    );
});


AppRegistry.registerComponent(appName, () => App);
