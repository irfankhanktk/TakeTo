import TAKE_2_API from '@khan_ahmad786/common/api/API';
import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import moment from 'moment';
import React from 'react';
import { Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import { TAKE_TO_INPUT_FIELD } from '../../../components/atoms';
import Buttons from '../../../components/atoms/Button';
import ImagePlaceholder from '../../../components/atoms/Placeholder';
import DateTimePicker from '../../../components/molecules/destination-card/date-picker';
import Header from '../../../components/molecules/header/header-1x';
import DatePickerModal from '../../../components/molecules/modals/date-picker-modal';
import ImagePicker from '../../../components/molecules/modals/image-picker/image-picker';
import EmailVerificationModal from '../../../components/molecules/modals/setting-modals/email-verification-modal';
import IdVerificationModal from '../../../components/molecules/modals/setting-modals/identity-verification-modal';
import PhoneVerificationModal from '../../../components/molecules/modals/setting-modals/phone-verification-modal';
import CustomPhoneInput from '../../../components/molecules/phone-input/phone-input';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';
import CountryPicker from 'react-native-country-picker-modal';

const AccountInfo = props => {
  const {
    navigation,
    route,
    profileData,
    updateUserProfile,
    defaultCountry,
    fetchUserInfo,
    langauge,
    countriesList
  } = props;

  const inputTranslation = langauge?.translations?.input;
  const phoneRef = React.useRef(null);
  const [openPicker, setOpenPicker] = React.useState(false);
  const [value, setValue] = React.useState('');
  const scrollRef = React.useRef();
  const alertRef = React.useRef();
  const [loading, setLoading] = React.useState(false);
  const [verifyType, setVerifyType] = React.useState('email');
  const [stateLoader, setStateLoader] = React.useState(true);
  //const [verifyNumberModal, setVerifyNumberModal] = React.useState(false)
  const [valid, setValid] = React.useState(false);
  const [showMessage, setShowMessage] = React.useState(false);
  const phoneInput = React.useRef(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [phone, setPhone] = React.useState({
    iso:
      (profileData?.mobile && profileData?.mobile?.split('-')[0]) ||
      defaultCountry?.short_name ||
      'kw',
    cc: (profileData?.mobile && profileData?.mobile?.split('-')[1]) || '',
    number: (profileData?.mobile && profileData?.mobile?.split('-')[2]) || '',
  });
  const [payload, setPayload] = React.useState({
    profile_image: profileData?.profile_picture,
    name: profileData?.name,
    user_name: profileData?.user_name,
    mobile: '', //profileData?.mobile&&profileData?.mobile?.split('-')[2] || '',
    email: profileData?.email,
    birth: profileData?.birth || null,
    country: profileData?.country?.name || 'Kuwait',
    country_short_name: profileData?.country?.slug || 'kw',
  });


  React.useEffect(() => {
    setPhone({
      iso:
        (profileData?.mobile && profileData?.mobile?.split('-')[0]) ||
        defaultCountry?.short_name ||
        'kw',
      cc: (profileData?.mobile && profileData?.mobile?.split('-')[1]) || '',
      number: (profileData?.mobile && profileData?.mobile?.split('-')[2]) || '',
    });
    setTimeout(() => {
      setStateLoader(false);
    }, 100);
  }, []);



  const [modals, setModals] = React.useState({
    email: false,
    is_email_verified: profileData?.is_email_verified,
    name: false,
    is_mob_verified: profileData?.is_mob_verified,
  });

  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
  const [emailVerifyLoader, setEmailVerifyLoader] = React.useState(false);
  const [verifyLoader, setVerifyLoader] = React.useState(false);

  const hideDatePicker = (d) => {
    // setPayload({
    //   ...payload,
    //   birth: moment(d).format('YYYY-MM-DD'),
    // });
    setDatePickerVisibility(false);
  };

  const onChangeHandle = (key, value) => {
    setPayload({ ...payload, [key]: value });
  };

  const onSave = async () => {
    try {
      Keyboard.dismiss();
      setLoading(true);
      // return console.log(payload);
      const response = TAKE_TO_CONSTANT.accountInfoValidation(payload);
      if (response.status) {
        let newPayload = { ...payload };
        if (
          phone?.number?.length > 0 &&
          !phoneRef?.current?.isValidNumber(phone?.number)
        ) {
          throw new Error('Oops! It seems your phone number is invalid.');
        } else {
          newPayload = {
            ...newPayload,
            mobile: `${phone?.iso}-${phone?.cc}-${phone?.number}`,
          };
        }
        newPayload?.birth
          ? {
            ...newPayload,
          }
          : delete newPayload?.birth;
        delete newPayload.email;
        if (!phoneRef?.current?.isValidNumber(phone?.number)) {
          delete newPayload.mobile;
        }
        if (payload?.profile_image?.uri === undefined) {
          delete newPayload.profile_image;
        }

        //console.log(newPayload);
        // return;
        console.log('PAYLOAD_:', newPayload)
        await updateUserProfile(newPayload);
        await fetchUserInfo();
        alertRef.current.alertWithType(
          'success',
          'Profile Updated',
          'Your profile updated succesfully',
        );
        props?.navigation?.goBack();
      } else {
        throw new Error(response?.message);
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

  const validatePhoneNumber = text => {
    setPhone({
      ...phone,
      iso: phoneRef?.current?.getCountryCode(),
      cc: phoneRef?.current?.getCallingCode(),
      number: text,
    });
  };

  const updatePayload = getData => {
    setPayload({
      ...payload,
      ...getData,
    });
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

  const sendOTPHandler = async (type, callBack) => {
    try {
      setEmailVerifyLoader(type === 'email' ? true : false);
      type === 'email'
        ? await TAKE_2_API.postEmailOtp(payload?.email)
        : await TAKE_2_API.postMobileOtp(`+${phone.cc}${phone.number}`);
      setEmailVerifyLoader(false);

      callBack(undefined, true, 'OTP sent on your provided email successfully');
      setVerifyType(type);
      setTimeout(() => {
        setModals({ ...modals, email: true });
      }, 1000);
    } catch (error) {
      setEmailVerifyLoader(false);
      callBack(true, false, UI_API._returnError(error));
    }
  };

  const verifyOTP = async (otp, type,bool,showError) => {
    try {
      setVerifyLoader(type === 'email' ? true : false);
      await TAKE_2_API.verifyOTP(otp, type);
      await fetchUserInfo();
      setVerifyLoader(false);
      setModals({ ...modals, email: false });
      //onSave();
      alertRef.current.alertWithType(
        'success',
        'OTP Verified',
        'OTP verified successfully',
      );
    } catch (error) {
      setVerifyLoader(false);
      console.log('error on otp:', error);
      if(bool){
        showError( UI_API._returnError(error));
        return;
      }
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };

  if (stateLoader) {
    return (
      <View style={styles.mainContainer}>
        <Header {...props} title="Account Info" allowBackBtn userIcon={false} />
      </View>
    );
  } else
    return (
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.white }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.mainContainer}>
          <Header
            {...props}
            title="Account Info"
            allowBackBtn
            userIcon={false}
          />
          <DateTimePicker
            isVisible={isDatePickerVisible}
            onCancel={hideDatePicker}
            mode="date"
            maximumDate={new Date()}
            isDarkModeEnabled={false}
            // backdropStyleIOS={colors.black}
            onConfirm={date => {
              setPayload({
                ...payload,
                birth: moment(date).format('YYYY-MM-DD'),
              });
              setDatePickerVisibility(false);
            }}
          />

          <View style={{ flex: 1 }}>
            <ScrollView
              ref={scrollRef}
              keyboardShouldPersistTaps="always"
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.SCROLL_CONTAINER}>
              <View style={styles.AVATAR_PROFILE}>
                <ImagePlaceholder
                  resizeMode='cover'
                  bg_img={payload.profile_image?.uri || payload?.profile_image}
                  containerStyle={styles.AVATAR_PROFILE}

                />
                <Buttons.ButtonCamera iconStyle={{ top: mvs(88), right: mvs(10) }} onClick={() => setOpenPicker(true)} />
              </View>
              <View style={styles.INPUT_CONTAINER}>
                <TAKE_TO_INPUT_FIELD.CustomInput
                  isVerify={modals.is_mob_verified}
                  onPressVerify={() => setModals({ ...modals, name: true })}
                  label={'First & Last name'}
                  value={payload.name}
                  onChangeText={text => onChangeHandle('name', text)}
                  placeholder={'Enter your full name'}
                />
                <View style={{ flexDirection: 'row', }}>
                  <TAKE_TO_INPUT_FIELD.CustomInput
                    containerStyle={{ width: '49%' }}
                    style={{ width: '100%', }}
                    // isVerify={payload.user_name.length >= 2}
                    value={payload.user_name}
                    onChangeText={text => onChangeHandle('user_name', text)}
                    placeholder={'Choose a username'}
                    // isRequired
                    label={'Username'}
                    // onChangeText={value => onChangeField('user_name', value)}
                    // placeholder={`${inputTranslation['user_name_placeholder']}`}
                  />
                  <View style={{ marginLeft: mvs(10), width: '49%' }}>
                    {console.log('defaultCountry', defaultCountry?.flag)}
                    <Regular label={'Country'} style = {{color : colors.typeHeader}}/>
                    <Buttons.ButtonLocation
                    flagStyle = 
                    {{ width: '12%', position: 'absolute', right: mvs(10) }} 
                    onClick={() => setOpenModal(true)} 
                    iconName = { 
                      payload.country_short_name === 'kw' ? defaultCountry?.flag : countriesList?.find(x => x.short_name == payload?.country_short_name?.toLowerCase())?.flag} 
                    title={payload.country?.length>12?`${payload.country?.slice(0,12)}...`:payload.country} 
                    style={{ backgroundColor: colors.secondary, height: mvs(38), marginTop: mvs(10), paddingHorizontal: mvs(10) }} 
                    textStyle={{color : colors.primary}}
                    />
                  </View>
                </View>
                {/* {profileData?.is_mob_verified ? (
                  <TAKE_TO_INPUT_FIELD.CustomInputWithButton
                    isVerify={true}
                    editable={false}
                    label={'Phone Number'}
                    value={profileData?.mobile}
                    //setPhone={text => onChangeHandle('email', text)}
                    //placeholder={'Enter your email'}
                  />
                ) : ( */}
                {console.log('profileDataprofileData:::',profileData)}
                <CustomPhoneInput
                  phoneRef={phoneRef}
                  label={'Phone Number'}
                  phone={phone?.number}
                  defaultCode={
                    (profileData && profileData?.mobile && phone.iso) ||profileData?.country?.slug?.toUpperCase()||'KW'
                  }
                  setPhone={validatePhoneNumber}
                />
                {/* )} */}

                <TAKE_TO_INPUT_FIELD.CustomInputWithButton
                 keyboardType={'email-address'}
                  isVerify={profileData?.is_email_verified}
                  emailVerifyLoader={emailVerifyLoader}
                  onPressVerify={() => sendOTPHandler('email', (error, success, message) => {
                    if (error) {
                      alertRef.current.alertWithType(
                        'error',
                        'Error',
                       message,
                      )
                    } else if (success) {
                      alertRef.current.alertWithType(
                        'success',
                        'Email OTP',
                       message,
                      );
                    }
                  })}
                  editable={false}
                  label={'Email address'}
                  value={payload.email}
                  setPhone={text => onChangeHandle('email', text)}
                  placeholder={'Enter your email'}
                />

                <TAKE_TO_INPUT_FIELD.CustomInput
                  editable={false}
                  label={'Date of Birth (optional)'}
                  placeholder={`Month / Day / Year`}
                  value={
                    (payload?.birth &&
                      moment(payload?.birth).format('MM / DD / YYYY')) ||
                    ''
                  }
                  disabled={false}
                  onPress={() => setDatePickerVisibility(true)}
                />
              </View>
              <View style={{ ...styles.BTN_CONTAINER, justifyContent: 'center' }}>
                <Buttons.ButtonPrimary
                  onClick={() => {
                    const checkValid = phoneInput.current?.isValidNumber(value);
                    //console.log("checkValid:", checkValid)
                    setShowMessage(true);
                    setValid(checkValid ? checkValid : false);
                    onSave()
                    // (phone?.number?.length > 0 &&
                    // !phoneRef?.current?.isValidNumber(phone?.number) || profileData?.is_mob_verified)
                    //   ? onSave()
                    //   : sendOTPHandler('mobile');
                  }}
                  title={'Save'}
                  loading={loading}
                  loaderColor={colors.white}
                  disabled={loading}
                  style={styles.BTN_LOGIN}
                />
              </View>
            </ScrollView>
          </View>
          <IdVerificationModal
            visible={modals.name}
            onCLose={() => {
              setModals({ ...modals, name: false, is_mob_verified: false });
            }}
          />
          <EmailVerificationModal
            resendLoader={emailVerifyLoader}
            verifyLoader={verifyLoader}
            visible={modals.email}
            type={verifyType}
            onResendCode={sendOTPHandler}
            verify={async (otp, setLoader,showError) => {
              await verifyOTP(otp, verifyType,true,showError);
              setLoader('');
            }}
            onClose={() =>
              setModals({ ...modals, email: false, is_email_verified: false })
            }
          />
          <ImagePicker
            visible={openPicker}
            onClose={setOpenPicker}
            onSubmit={onImageModalSelection}
            showDelete={false}
          />
          <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'}  inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
          
          {openModal && 
          <CountryPicker
            visible
            withFilter
            onClose={() => { setOpenModal(false); }}
            onSelect={(item) => {
            //  console.log(item)
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

          {/* <DatePickerModal
          visible={isDatePickerVisible}
          onClose={() => {
            setDatePickerVisibility(false);
          }}
          onApply={d => hideDatePicker(d)}
          /> */}

          {/* <PhoneVerificationModal
            onVerify = {(otp,type) => {
              verifyOTP(otp, type)
            }}
            onSend = {() => sendOTPHandler('mobile')}
            visible = {verifyNumberModal}
            onCLose = {() => setVerifyNumberModal(false)}
          /> */}
        </View>
      </KeyboardAvoidingView>
    );
};

const mapStateToProps = state => {
  return {
    profileData: state.auth.userInfo?.profile || {},
    defaultCountry: state.common.defaultCountry,
    langauge: state.common?.langauge,
    countriesList: state.common.countriesList,
  };
};
const mapDispatchToProps = dispatch => ({
  updateUserProfile: data => dispatch(TAKE_TO_ACTIONS.updateUserProfile(data)),
  fetchUserInfo: () => dispatch(TAKE_TO_ACTIONS.fetchUserInfo()),
});
export default connect(mapStateToProps, mapDispatchToProps)(AccountInfo);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  CONTAINER: {
    flex: 1,
    backgroundColor: colors.white,
  },
  BTN_CONTAINER: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    //
  },
  BTN_LOGIN: {
    width: '100%',
    marginTop: mvs(63),
  },
  SCROLL_CONTAINER: {
    paddingHorizontal: mvs(22),
    paddingTop: mvs(27),
    paddingBottom: mvs(40),
  },
  INPUT_CONTAINER: {
    paddingTop: mvs(28),
  },
  PRIVACY_LABEL: {
    textAlign: 'center',
    color: colors.headerTitle,
    fontSize: mvs(11),
  },
  AVATAR_PROFILE: {
    justifyContent: 'center',
    alignItems: 'center',
    height: mvs(124),
    width: mvs(124),
    borderRadius: mvs(65),
    backgroundColor: colors.white,
    marginBottom: mvs(5),

    borderColor: 'rgba(255,255,255,0.9)',

    zIndex: 1001,

    // overflow: 'hidden',
  },
});
