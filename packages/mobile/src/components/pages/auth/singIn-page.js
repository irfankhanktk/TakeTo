import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { LargeLogo } from '../../../../resource/assets/common-icons';
import colors from '../../../config/colors';
import TAKE_SOCIAL from '../../../config/constants';
import { mvs, xdHeight } from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';
import { TAKE_TO_INPUT_FIELD } from '../../atoms';
import Buttons from '../../atoms/Button';
import DualText from '../../molecules/dual-text/dual-text';
import ResetPasswordModal from '../../molecules/modals/reset-password-modal';
import Apple from './../../../../resource/assets/social-icons/apple.svg';
import Facebook from './../../../../resource/assets/social-icons/facebook.svg';
import Google from './../../../../resource/assets/social-icons/google.svg';
import Twitter from './../../../../resource/assets/social-icons/twitter.svg';
import DropdownAlert from 'react-native-dropdownalert';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChangePasswordModal from '../../molecules/modals/change-password-modal';
import EmailVerificationModal from '../../molecules/modals/setting-modals/email-verification-modal';
import TAKE_2_API from '@khan_ahmad786/common/api/API';
import { Chase } from 'react-native-animated-spinkit';
const SignInPage = props => {
  const {
    navigation,
    postSigninData,
    onChangeGuest,
    activeCountryList,
    langauge,
    postSocialData,
    fetchEcho
  } = props;
  const btnTranslation = langauge?.translations?.button;
  const inputTranslation = langauge?.translations?.input;
  const authLables = langauge?.translations?.auth_screen;
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [socialloading, setSocialLoading] = useState(false);
  const scrollRef = React.useRef();
  const [eye, setEye] = React.useState(true)
  const [token, setToken] = React.useState('')
  const alertRef = React.useRef();


  //forgot password state
  const [forgotPayload, setForgotPayload] = React.useState({
    email: '',
    otp: '',
  });
  const [isOtpModal, setIsOtpModal] = React.useState(false);
  const [isPasswordModal, setIsPasswordModal] = React.useState(false);
  //
  const [payload, setPayload] = React.useState({
    email: '',
    password: '',
  });






  const sendToken = async (type) => {
    try {
      const res = await TAKE_2_API.postDeviceToken({
        device_token: token,
      });
      console.log('res:', res?.data?.data);
    } catch (error) {

    }
  }

  React.useEffect(() => {
    (async () => {
      try {
        const fcmToken = await messaging().getToken()
        console.log("fcmToken :: ",fcmToken)
        setToken(fcmToken);
      } catch (error) {
        alert(error?.message)
      }
    })()
  }, [])



  const getCountriesList = async () => {
    try {
      const value = await AsyncStorage.getItem('@Countries');
      // console.log(JSON.parse(value))
      if (value !== null) {
        // value previously stored
        activeCountryList(JSON.parse(value));
      }
    } catch (error) {
      // error reading value
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getCountriesList();
      // alert('asda');
    });
    return unsubscribe;
  }, [navigation]);

  const onChangeField = async (fieldName, value) => {
    setPayload({ ...payload, [fieldName]: value });
  };




  const onLoginPress = async () => {
    try {
      setLoading(true);
      const response = TAKE_TO_CONSTANT.signinValidation(payload);
      if (response.status) {
        await postSigninData({
          username: payload.email,
          password: payload?.password?.trim(),
        });
        await sendToken();
        navigation.replace('main');
      } else {
        throw new Error(response.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // scrollRef.current.scrollTo({x: 0, y: 0, animated: true});
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };

  const socialHandler = async provider => {
    try {

      let response = null;
      let requset = null;
      let payload = null;
      setSocialLoading(true);
      if (provider === 'google') {
        response = await TAKE_SOCIAL.onGoogleButtonPress();
        payload = {
          email: response?.user?.email,
          social_id: response?.user?.id,
          name: response?.user?.name,
        };

      } else if (provider === 'apple') {
        response = await TAKE_SOCIAL.onAppleButtonPress();
        payload = {
          email: `${response?.additionalUserInfo.profile.email}`,
          social_id: response?.user.uid,
          name: response?.user.displayName,
        };
      } else if (provider === 'facebook') {
        response = await TAKE_SOCIAL.onFacebookButtonPress();
        payload = {
          email: response?.user?.email,
          social_id: response?.additionalUserInfo?.profile?.id,
          name: response?.user?.displayName,
        };

      } else {
        response = await TAKE_SOCIAL.onTwitterButtonPress();
        payload = {
          email: response?.additionalUserInfo?.profile?.email,
          social_id: response?.additionalUserInfo?.username,
          name: response?.user.displayName,
        };

      }
      console.log('response of social in sigin::', response);
      await postSocialData(payload, provider);
      await sendToken();
      navigation.replace('main');

    } catch (error) {
      // console.log('error:::',error);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    } finally {
      setSocialLoading(false)
    }
  };

  const openSite = (screen, URL) => {
    navigation.navigate(screen, { URL });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.white }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.CONTAINER}>
        {/* <Header {...props} /> */}

        <ScrollView
          contentContainerStyle={styles.SCROLL_CONTAINER}
          ref={scrollRef}>
          <LargeLogo
            width={mvs(147)}
            height={mvs(126)}
            style={{ marginTop: mvs(45), alignSelf: 'center' }}
          />
          <View style={styles.INPUT_CONTAINER}>
            <TAKE_TO_INPUT_FIELD.CustomInput
              value={payload.email}
              label={inputTranslation['login_email']}
              keyboardType={'email-address'}
              onChangeText={value => onChangeField('email', value?.trim())}
              placeholder={inputTranslation['login_email_placeholder']}
            />
            <TAKE_TO_INPUT_FIELD.CustomInput
              secureTextEntry={eye}
              secure
              value={payload.password}
              label={inputTranslation['new_password']?.split(' ')[1]}
              onChangeText={value => onChangeField('password', value)}
              placeholder={inputTranslation['password_placeholder']}
              divider
              onPressIcon={() => setEye(!eye)}
            />
          </View>
          <View style={styles.BTN_CONTAINER}>
            <Buttons.ButtonSecondaryOutline
              onClick={onLoginPress}
              title={btnTranslation['login']}
              loading={loading}
              disabled={loading}
              style={styles.BTN_LOGIN}
              textStyle={{ color: colors.typeHeader }}
            />
            <Buttons.ButtonSeconday
              onClick={() => setVisible(true)}
              title={authLables['forgot_password']}
              textStyle={{ color: colors.typeHeader, alignSelf: 'flex-end' }}
              style={{ ...styles.BTN_LOGIN, paddingRight: mvs(5) }}
            />
          </View>
          <View
            style={{
              ...styles.BTN_CONTAINER,
              justifyContent: 'center',
              marginTop: mvs(50),
            }}>
            <Buttons.ButtonPrimary
              onClick={() => navigation.navigate('register', { socialData: undefined,token })}
              title={btnTranslation['signup']}
              style={styles.BTN_LOGIN}
            />
          </View>
          <View
            style={{
              ...styles.BTN_CONTAINER,
              justifyContent: 'center',
              marginTop: mvs(13),
              marginBottom: mvs(11),
            }}>
            <Regular
              label={authLables['or']}
              style={{ color: colors.typeHeader }}
            />
          </View>
          <View
            style={{
              ...styles.BTN_CONTAINER,
              alignSelf: 'center',
              width: mvs(Platform.OS == 'ios' ? 227 : 160),
            }}>
            <Twitter
              onPress={() => socialHandler('twitter')}
              height={mvs(41)}
              width={mvs(41)}
            />
            <Facebook
              onPress={() => socialHandler('facebook')}
              height={mvs(41)}
              width={mvs(41)}
            />
            <Google
              onPress={() => socialHandler('google')}
              height={mvs(41)}
              width={mvs(41)}
            />
            {Platform.OS == 'ios' && (
              <Apple
                onPress={() => socialHandler('apple')}
                fill={colors.black}
                height={mvs(41)}
                width={mvs(41)}
              />
            )}
          </View>

          <View
            style={{
              ...styles.BTN_CONTAINER,
              justifyContent: 'center',
              marginTop: mvs(xdHeight(52)),
            }}>
            <Buttons.ButtonSeconday
              onClick={() => {
                onChangeGuest(true);
                navigation.navigate('main');
              }}
              title={authLables['skip_to_services']}
              style={styles.BTN_LOGIN}
              textStyle={{
                textDecorationLine: 'underline',
                textAlign: 'center',
                color: colors.typeHeader,
              }}
            />
          </View>
          <DualText
            style={styles.PRIVACY_LABEL}
            content={`${authLables['by_signup_agree']} `}
            highlightText={authLables['terms_of_use']}
            onPress={() => openSite('termsofuse', 'terms-of-use')}>
            <DualText
              style={styles.PRIVACY_LABEL}
              content={` ${authLables['and']} `}
              highlightText={authLables['privacy_policy']}
              onPress={() => openSite('privacypolicy', 'privacy-policy')}
            />
          </DualText>
        </ScrollView>

        <ResetPasswordModal
          onOkResult={({ email, otp }) => {
            setForgotPayload({ ...forgotPayload, email, otp });
            setVisible(false);
            setTimeout(()=>{
              setIsOtpModal(true);
            },700)
          }}
          visible={visible}
          onClose={() => setVisible(false)}
        />


        <EmailVerificationModal
          isChangePassword={true}
          onOkResult={() => {
            // console.log('on ok forgotPayload::',forgotPayload);
            setTimeout(()=>{
              setIsPasswordModal(true);
            },700)
            setIsOtpModal(false);
           
          }}
          forgotPayload={forgotPayload}
          onClose={() => setIsOtpModal(false)}
          setForgotPayload={setForgotPayload}
          visible={isOtpModal}
        />


        <ChangePasswordModal
          forgotPayload={forgotPayload} onClose={() => setIsPasswordModal(false)} visible={isPasswordModal} />

        {socialloading && <View style={{ position: 'absolute', height: '100%', width: '100%', backgroundColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center' }}>
          <Chase size={mvs(30)} color={colors.typeHeader} />
        </View>}
        <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'} inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
      </View>
    </KeyboardAvoidingView>
  );
};

const mapStateToProps = state => {
  return {
    authData: state.auth,
    langauge: state.common?.langauge,
    state,
  };
};

const mapDispatchToProps = dispatch => ({
  postSigninData: data => dispatch(TAKE_TO_ACTIONS.postSigninData(data)),
  postSocialData: (data, provider) => dispatch(TAKE_TO_ACTIONS.postSocialData(data, provider)),
  onChangeGuest: bool => dispatch(TAKE_TO_ACTIONS.onChangeGuest(bool)),
  activeCountryList: countryList =>
    dispatch(TAKE_TO_ACTIONS.activeCountryList(countryList)),
  fetchEcho: echo => dispatch(TAKE_TO_ACTIONS?.fetchEcho(echo)),
});
// export default SignInScreen;
export default connect(mapStateToProps, mapDispatchToProps)(SignInPage);
const styles = StyleSheet.create({
  CONTAINER: {
    flex: 1,
    backgroundColor: colors.white,
  },
  BTN_CONTAINER: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  BTN_LOGIN: {
    width: '47%',
  },

  SCROLL_CONTAINER: {
    paddingHorizontal: mvs(xdHeight(22)),
    paddingBottom: mvs(10),
    backgroundColor:colors.white
  },
  INPUT_CONTAINER: {
    paddingTop: mvs(57),
  },
  PRIVACY_LABEL: {
    marginTop: mvs(xdHeight(25)),
    textAlign: 'center',
    color: colors.typeHeader,
    fontSize: mvs(11),
  },
});
