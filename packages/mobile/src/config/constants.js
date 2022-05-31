import auth from '@react-native-firebase/auth';
import { NativeModules } from 'react-native';

//Google Sign in
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';


//Facebook Sign in
import {LoginManager, AccessToken} from 'react-native-fbsdk';
import {CommonActions} from '@react-navigation/routers';


// //Apple Sign in
import { appleAuth } from '@invertase/react-native-apple-authentication';


//Twitter Sign in
const { RNTwitterSignIn } = NativeModules;
const TwitterKeys = {
  TWITTER_CONSUMER_KEY: 'lCI290eXskSLcY6D5JiLQpEZO',
  TWITTER_CONSUMER_SECRET: 'ZR0RNDxGJX8fGPsYiiZSywmEUSWlfQ6XuDRYeEwvX1TzqirrpN',
  // TWITTER_CONSUMER_KEY: 'W4mLvUCsuqXf94VAp1JL9z6Ki',
  // TWITTER_CONSUMER_SECRET: '18iXpf7CLz1b0oaaHpMFb4nLMmuYy8hXXxirRJ03LP9bTxdm1v',
};
RNTwitterSignIn.init(
  TwitterKeys.TWITTER_CONSUMER_KEY,
  TwitterKeys.TWITTER_CONSUMER_SECRET,
);




const onTwitterButtonPress = async () => {
  try {
    // (async () => {
    //     await RNTwitterSignIn.init(
    //         TwitterKeys.TWITTER_CONSUMER_KEY,
    //         TwitterKeys.TWITTER_CONSUMER_SECRET,
    //     );
    // })();
    // Perform the login request
    const {authToken, authTokenSecret} = await RNTwitterSignIn.logIn();

    // Create a Twitter credential with the tokens
    const twitterCredential = auth.TwitterAuthProvider.credential(
      authToken,
      authTokenSecret,
    );

    // Sign-in the user with the credential
    return auth().signInWithCredential(twitterCredential);
  } catch (e) {
    throw new Error(e);
  }
};




const onAppleButtonPress = async () => {
  // Start the sign-in request
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });

  // Ensure Apple returned a user identityToken
  if (!appleAuthRequestResponse.identityToken) {
    throw 'Apple Sign-In failed - no identify token returned';
  }

  // Create a Firebase credential from the response
  const {identityToken, nonce} = appleAuthRequestResponse;
  const appleCredential = auth.AppleAuthProvider.credential(
    identityToken,
    nonce,
  );

  // Sign the user in with the credential
  return await auth().signInWithCredential(appleCredential);
};




const onFacebookButtonPress = async () => {

  console.log("here...")  
  // Attempt login with permissions
  LoginManager.logOut();
  const result = await LoginManager.logInWithPermissions([
    'public_profile',
    'email',
  ]);

  console.log("result:", result)

  if (result.isCancelled) {
    throw 'User cancelled the login process';
  }

  // Once signed in, get the users AccesToken
  const data = await AccessToken.getCurrentAccessToken();
  console.log(data);
  if (!data) {
    throw 'Something went wrong obtaining access token';
  }

  // Create a Firebase credential with the AccessToken
  const facebookCredential = auth.FacebookAuthProvider.credential(
    data.accessToken,
  );
  console.log("facebookCredential:", facebookCredential)

  // Sign-in the user with the credential
  return await auth().signInWithCredential(facebookCredential);
};




const onGoogleButtonPress = async () => {
  try {
    //await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    await GoogleSignin.hasPlayServices();
    // Get the users ID token
    const {idToken, user, serverAuthCode, scopes} = await GoogleSignin.signIn();

    // console.log({ idToken, user, serverAuthCode, scopes })
    //console.log({ idToken })
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    const googleResponse = await auth().signInWithCredential(googleCredential);

    //console.log('Google Response: ', googleResponse);
    return {...googleResponse, idToken, user, serverAuthCode, scopes};
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
      throw 'User cancelled the login process';
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (e.g. sign in) is in progress already
      throw 'operation is in progress already';
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
      throw 'play services not available or outdated';
    } else {
      // some other error happened
      console.log(error);
      throw 'some unknown error occurred';
    }
  }
};


const TAKE_SOCIAL = {
  onGoogleButtonPress,
  onTwitterButtonPress,
  onAppleButtonPress,
  onFacebookButtonPress,
};

export default TAKE_SOCIAL