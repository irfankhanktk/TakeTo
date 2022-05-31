# How to install Take-to
# How to install open vidu library

STEP 1: run npm install file:filename.tdz
STEP 2: go to nodemodules/openvidu-react-native-adapter/
STEP 3: run npm install or yarn install
STEP 4: go to packages\mobile\node_modules\react-native-gps-state\android\src\main\java\br\com\dopaminamob\gpsstate\GPSStateModule.java
STEP 5: replace  android.support.v4.app.ActivityCompat with androidx.core.app.ActivityCompat
STEP:6: packages\mobile\node_modules\react-native-element-timer\src\Timer\index.tsx
STEP:6:replace renderTimer with below lines of code 

   const renderTimer = () => {
    if (hours > 0) {
      return <Text style={[styles.text, textStyle, font()]}>{`${hours<=9?'0'+hours:hours}:${minute<=9?'0'+minute:minute}:${seconds<=9?'0'+seconds:seconds}`}</Text>
    } else {
      if (minute > 0) {
        return <Text style={[styles.text, textStyle, font()]}>{`00:${minute<=9?'0'+minute:minute}:${seconds<=9?'0'+seconds:seconds}`}</Text>
      } else {
        return <Text style={[styles.text, textStyle, font()]}>{`00:00:${seconds<=9?'0'+seconds:seconds}`}</Text>
      }
    }

  };

# React Universal App Tutorial Demo App

Files for React Native Universal App tutorial.

Tutorial URL: https://www.youtube.com/watch?v=um90kBJ_hG0

Blog Post: https://saadibrah.im/how-to-share-code-between-react-and-react-native-app-using-react-native-web-and-yarn-workspaces/

#### Libraries or tools used

 * React Native
 * React JS
 * React Native Web
 * Redux

#### Useful links

 * [React Native Web](https://github.com/necolas/react-native-web)
 * [Yarn Workspaces Documentation](https://classic.yarnpkg.com/en/docs/workspaces/)
 * [Dummy API](https://reqres.in/)
 * [Create React App](https://create-react-app.dev/)
 * [Blog post talking about invalid hooks call warning](https://reactjs.org/warnings/invalid-hook-call-warning.html)
 * [How to import files from outside of root directory with React Native Metro bundler](https://medium.com/@dushyant_db/how-to-import-files-from-outside-of-root-directory-with-react-native-metro-bundler-18207a348427)

#### Running the app in simulator

To run the app you need yarn package manager. Once you have yarn installed, clone the repo and navigate to it's directory in terminal and run the following commands:

 ```sh
 ## to install the dependencies
 yarn
 ## to run the app on iOS
 cd packages/mobile/ios/ && pod install && cd ..
 react-native run-ios
 ## to run the app on Android
 react-native run-android
 ## to run the app on Web
 cd packages/web
 yarn start
 ```

#### Screenshots:

![Universal React and React Native app](/screenshots/universal.jpg)
# Grabr
