import UI_API from '@khan_ahmad786/common/store/services';
import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import React from 'react';
import { useEffect } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import colors from '../../../config/colors';
import { mvs, xdHeight } from '../../../config/metrices';
import { TAKE_TO_INPUT_FIELD } from '../../atoms';
import Buttons from '../../atoms/Button';
import ImagePlaceholder from '../../atoms/Placeholder';
import DualText from '../../molecules/dual-text/dual-text';
import ImagePicker from '../../molecules/modals/image-picker/image-picker';
import Back from './../../../../resource/assets/headers-icons/back.svg';
import CountryPicker from 'react-native-country-picker-modal';
import Regular from '../../../presentation/typography/regular-text';
import TAKE_2_API from '@khan_ahmad786/common/api/API';

export const SignUpPage = props => {
  const { navigation, langauge, countriesList, defaultCountry } = props;
  const { socialData,token } = props.route.params;
  const btnTranslation = langauge?.translations?.button;
  const inputTranslation = langauge?.translations?.input;
  const authLables = langauge?.translations?.auth_screen;
  const scrollRef = React.useRef();
  const alertRef = React.useRef();
  console.log('token:::::::',token);
  const [payload, setPayload] = React.useState({
    profile_image: '',
    name: socialData && socialData?.name || '',
    user_name: socialData && socialData?.nickname || '',
    email: socialData && socialData?.email || '',
    password: '',
    confirm_password: '',
    country: '',
    country_short_name: '',
  });
  const [openPicker, setOpenPicker] = React.useState(false);
  const [eye, setEye] = React.useState(true)
  const [eye1, setEye1] = React.useState(true)
  const [isConfirmVerify, setIsConfirmVerify] = React.useState(false);
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);

  const onChangeField = async (fieldName, value) => {
    setPayload({ ...payload, [fieldName]: value });
  };


  // useEffect(() => {
  //   console.log("socialData:", socialData)
  //   setPayload({
  //     ...payload,
  //     profile_image: socialData?.avatar || '',
  //     name: socialData?.name || '',
  //     user_name: socialData?.nickname || '',
  //     email: socialData?.email || '',
  //   })
  // },[])
  const sendToken = async (type) => {
    try {
      const res = await TAKE_2_API.postDeviceToken({
        device_token: token,
      });
      console.log('res:', res?.data?.data);
    } catch (error) {

    }
  }
  console.log('payload of sign up :', payload);
  const onSignUp = async () => {
    Keyboard.dismiss();
    try {
      let obj = { ...payload };
      delete obj.flag;
      console.log('payload:::::::::', obj);
      const response = TAKE_TO_CONSTANT.signupValidation(obj);
      if (response.status) {
        setLoading(true);
        await props?.postRegisterData(payload);
        alertRef.current.alertWithType(
          'success',
          'Account Created Successfully',
          'Welcome to TakeTo',
        )
        await sendToken()
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

  const updatePayload = getData => {
    setPayload({ ...payload, ...getData });
  };


  const openCamera = () => {
    // launchCamera({mediaType: 'photo', includeBase64: false}, response =>
    UI_API._openCamera(updatePayload, alertRef);
    // );
  };
  const openGallery = () => {
    // launchImageLibrary({mediaType: 'photo', includeBase64: false}, response =>
    UI_API._openGallery(updatePayload, alertRef);
    // );
  };

  const onImageModalSelection = type => {
    //type ::  Camera,Gallery,Delete
    setOpenPicker(false);
    setTimeout(() => {
      if (type === 'Camera') {
        openCamera();
      } else if (type === 'Gallery') {
        openGallery();
      } else {
        setPayload({
          ...payload,
          profile_image: ''
        })
      }
    }, 1000);
  };
  const openSite = (screen, URL) => {
    navigation.navigate(screen, { URL });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.white }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    // keyboardVerticalOffset={Platform.OS==='ios'? 0:33}
    >
      <View style={styles.CONTAINER}>
        <ScrollView
          contentContainerStyle={styles.SCROLL_CONTAINER}
          ref={scrollRef}>
          <View style={styles.AVATAR}>
            <ImagePlaceholder
              bg_img={payload.profile_image?.uri || payload?.profile_image}
              iconStyle={{ alignSelf: 'center' }}
              containerStyle={{ ...styles.AVATAR, marginBottom: mvs(0) }}
            />
            <Buttons.ButtonCamera iconStyle={{ top: mvs(95), right: mvs(10) }} onClick={() => setOpenPicker(true)} />
          </View>

          <View style={styles.INPUT_CONTAINER}>
            <TAKE_TO_INPUT_FIELD.CustomInput
              onPressVerify={() => { }}
              value={payload.name}
              label={inputTranslation['first_last_name']}
              onChangeText={value => onChangeField('name', value)}
              placeholder={`${inputTranslation['first_last_name_placeholder']}`}
            />
            <View style={{ flexDirection: 'row', }}>
              <TAKE_TO_INPUT_FIELD.CustomInput
                containerStyle={{ width: '49%' }}
                style={{ width: '100%', }}

                // isVerify={payload.user_name.length >= 2}
                value={payload.user_name}
                // isRequired
                label={inputTranslation['user_name']}
                onChangeText={value => onChangeField('user_name', value)}
                placeholder={`${inputTranslation['user_name_placeholder']}`}
              />
              <View style={{ marginLeft: mvs(10), width: '49%' }}>
                {console.log('defaultCountry', defaultCountry?.flag)}
                <Regular label={'Country'} />
                <Buttons.ButtonLocation 
                flagStyle={{ width: '12%', position: 'absolute', right: mvs(10) }} onClick={() => setOpenModal(true)}
                 iconName={payload.flag} 
                 title={payload.country?.length>12?`${payload.country?.slice(0,12)}...`:payload.country ||'Select'} 
                 textStyle={{color:payload.country?colors.primary:colors.input_placehoder}}
                 style={{ backgroundColor: colors.secondary, height: mvs(38), marginTop: mvs(10), paddingHorizontal: mvs(10) }} />
              </View>
            </View>

            <TAKE_TO_INPUT_FIELD.CustomInput
              onPressVerify={() => { }}
              value={payload.email}
              label={inputTranslation['email_address']}
              keyboardType={'email-address'}
              onChangeText={value => onChangeField('email', value?.trim())}
              placeholder={`${inputTranslation['login_email_placeholder']}`}
              editable={socialData?.email ? false : true}
            />
            <TAKE_TO_INPUT_FIELD.CustomInput
              isVerify={payload.password.length >= 8}
              value={payload.password}
              label={inputTranslation['new_password']?.split(' ')[1]}
              secureTextEntry={eye}
              secure
              onPressIcon={() => setEye(!eye)}
              onChangeText={value => {
                setPayload({ ...payload, password: value });
                setIsConfirmVerify(
                  value?.length >= 8 && payload.confirm_password == value,
                );
              }}
              placeholder={`${inputTranslation['password']}`}
            />
            <TAKE_TO_INPUT_FIELD.CustomInput
              isVerify={isConfirmVerify}
              isReject={payload.confirm_password.length >= 8}
              value={payload.confirm_password}
              secure
              onPressIcon={() => setEye1(!eye1)}
              label={`${inputTranslation['confirm_password']}`}
              secureTextEntry={eye1}
              onChangeText={value => {
                setPayload({ ...payload, confirm_password: value });
                setIsConfirmVerify(
                  value?.length >= 8 && payload.password == value,
                );
              }}
              placeholder={`${inputTranslation['confirm_password']}`}
              divider
            />
          </View>
          <View
            style={{
              ...styles.BTN_CONTAINER,
              justifyContent: 'center',
              marginTop: mvs(30),
            }}>
            <Buttons.ButtonPrimary
              onClick={onSignUp}
              loading={loading}
              loaderColor={colors.white}
              disabled={loading}
              title={btnTranslation['signup']}
              style={styles.BTN_LOGIN}
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
        <TouchableOpacity
          onPress={() => navigation.pop()}
          style={{
            position: 'absolute',
            top: mvs(55),
            left: mvs(23),
            backgroundColor: colors.white,
          }}>
          <Back />
        </TouchableOpacity>

        <DropdownAlert zIndex={5}  elevation={15} translucent activeStatusBarStyle={'light-content'} inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
      </View>
      {console.log("payload?.profile_image :: ", payload?.profile_image ? true : false)}
      <ImagePicker
        visible={openPicker}
        showDelete={payload?.profile_image ? true : false}
        onClose={setOpenPicker}
        onSubmit={onImageModalSelection}
      />
      {openModal && <CountryPicker
        visible
        withFilter
        onClose={() => { setOpenModal(false); }}
        onSelect={(item) => {
          console.log(item)
          setPayload({
            ...payload,
            country: item?.name,
            flag: countriesList?.find(x => x.short_name == item?.flag?.split('-')[1])?.flag,
            country_short_name: item?.cca2,
          })
          setOpenModal(false);
        }
        }
      />}
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  AVATAR: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: mvs(130),
    width: mvs(130),
    borderRadius: mvs(65),
    backgroundColor: colors.secondary,
    marginBottom: mvs(34),
    // backgroundColor:'red',
  },
  CONTAINER: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: mvs(45),
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
    paddingHorizontal: mvs(22),
    paddingBottom: mvs(0),
    paddingTop:mvs(10),
  },
  INPUT_CONTAINER: {},
  PRIVACY_LABEL: {
    marginTop: mvs(xdHeight(30)),
    textAlign: 'center',
    color: colors.typeHeader,
    fontSize: mvs(11),
  },
});
