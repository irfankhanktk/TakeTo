import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View} from 'react-native';
import { mvs } from '../../config/metrices';
import { TAKE_TO_INPUT_FIELD } from '../../components/atoms';
import Buttons from '../../components/atoms/Button';
import Header from '../../components/molecules/header/header-1x';
import colors from '../../config/colors';
import Regular from '../../presentation/typography/regular-text';
import { OtpInput } from '../../components/molecules/otp-input/otp-input';
import CustomPhoneInput from '../../components/molecules/phone-input/phone-input';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import PhoneVerificationModal from '../../components/molecules/modals/setting-modals/phone-verification-modal';
import TAKE_2_API from '@khan_ahmad786/common/api/API';
import UI_API from '@khan_ahmad786/common/store/services';
import EmailVerificationModal from '../../components/molecules/modals/setting-modals/email-verification-modal';
const ChangePhoneNumber = props => {

  const {profileData, updateUserProfile, navigation} = props
  const phoneRef = React.useRef(null);
  const alertRef = React.useRef();

  const [phone, setPhone] = React.useState({
    iso:
      (profileData?.mobile && profileData?.mobile?.split('-')[0]) ||
      // defaultCountry?.short_name ||
      'kw',
    cc: (profileData?.mobile && profileData?.mobile?.split('-')[1]) || '',
    number: (profileData?.mobile && profileData?.mobile?.split('-')[2]) || '',
  });
  const [newPhone, setNewPhone] = React.useState({});

  const [verify, setVerify] = React.useState(false)



  const [payload, setPayload] = React.useState({
    //verifiedPhone: '',
    // newPhone: '',
    otpCode: '',
  });

  // const phoneInput = React.useRef(null);
  const [isSend, setIsSend] = React.useState(false);
  // console.log(payload)


  // React.useEffect(() => {
  //   setPayload({
  //     ...payload,
  //     newPhone : {
  //     iso:
  //       (profileData?.mobile && profileData?.mobile?.split('-')[0]) ||
  //       defaultCountry?.short_name ||
  //       'kw',
  //     cc: (profileData?.mobile && profileData?.mobile?.split('-')[1]) || '',
  //     number: (profileData?.mobile && profileData?.mobile?.split('-')[2]) || '',
  //     }
  // });
  // }, [])


  const sendOTPHandler = async () => {
    try {
      await TAKE_2_API.postMobileOtp(`+${newPhone.cc}${newPhone.number}`);
      alertRef.current.alertWithType(
        'success',
        'Mobile OTP',
        'OTP sent on your provided Mobile Number successfully',
      );
      setTimeout(() => {
        setVerify(true)
      }, 1000);
    } catch (error) {
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };

  const verifyOTP = async () => {
    try {
      await TAKE_2_API.verifyOTP(payload?.otpCode, 'mobile');
      await fetchUserInfo()
      alertRef.current.alertWithType(
        'success',
        'OTP Verified',
        'OTP verified successfully',
      );
      navigation.pop()
    } catch (error) {
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };


  const validatePhoneNumber = text => {
    setNewPhone({
      iso: phoneRef?.current?.getCountryCode(),
      cc: phoneRef?.current?.getCallingCode(),
      number: text,
    });
  };



  return (
    <KeyboardAvoidingView
    style={{ flex: 1, backgroundColor: colors.white }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <View style={styles.CONTAINER}>
      <Header
        {...props}
        title="Change phone number"
        allowBackBtn
        userIcon={false}
        
      />
      <ScrollView contentContainerStyle={styles.SCROLL}>
        <View style={styles.BODY}>
          <CustomPhoneInput 
          label={'Verified Phone Number'} 
          phone={phone?.number} 
          setPhone={text => setPayload({ ...payload, 
          verifiedPhone: text 
          })} 
          defaultCode={
            (profileData && profileData?.mobile && phone.iso) || 'KW'
          }
          />
          <CustomPhoneInput 
          phoneRef={phoneRef}
          phone={newPhone}
          setPhone = {validatePhoneNumber} 
          />
          {newPhone.number ?
            <Buttons.ButtonPrimary
              onClick={sendOTPHandler}
              textStyle={{ color: colors.white }}
              title={'Send Code'}
              style={{ marginTop: mvs(0), }}
            /> :
            <Buttons.ButtonSeconday
              disabled
              onClick={() => { }}
              textStyle={{ color: colors.doted }}
              title={'Send Code'}
              style={{ marginTop: mvs(0), backgroundColor: colors.secondary }}
            />}
            {/* {console.log(payload?.newPhone)} */}
          <TAKE_TO_INPUT_FIELD.CustomOtpInput value={payload.otpCode} setValue={(v) => setPayload({ ...payload, otpCode: v })} />
          {(!newPhone || payload.otpCode.length !== 6) ? (
            <View style={{ marginTop: mvs(270), paddingBottom: mvs(40), width: '100%' }}>
              <Buttons.ButtonSeconday
                disabled 
                //onClick={verifyOTP}
                title={'Verify'}
                style={{ backgroundColor: colors.secondary }}
              />
            </View>
          ) : (
            <View style={{ marginTop: mvs(208), width: '100%', paddingBottom: mvs(40) }}>
              <Buttons.ButtonSecondaryOutline
                onClick={() => { }}
                title={'Resend code'}
              
              />
              <Buttons.ButtonSecondaryOutline
                onClick={() => { }}
                title={'Verify via Voice Call'}
                style={{ marginTop: mvs(15), }}
              />
              <Buttons.ButtonPrimary
                onClick={verifyOTP}
                title={'Verify'}
                style={{ marginTop: mvs(15) }}
              />
            </View>
          )}

        </View>
      </ScrollView>
      <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'}  inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />

      {/* <EmailVerificationModal
        //resendLoader={emailVerifyLoader}
        //verifyLoader={verifyLoader}
        visible={verifyModal}
        type={'mobile'}
        //onResendCode={type => sendOTPHandler(type)}
        verify={otp => {
          verifyOTP(otp, 'mobile');
        }}
        onCLose={() =>
          setVerifyModal(false)
        }
      /> */}
    </View>
    </KeyboardAvoidingView>
  );
};
//export default ChangePhoneNumber;

const mapStateToProps = state => {
  return {
    isGuest: state.auth.isGuest,
    profileData: state.auth.userInfo?.profile || {},
  };
};

const mapDispatchToProps = dispatch => ({
  updateUserProfile: data => dispatch(TAKE_TO_ACTIONS.updateUserProfile(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePhoneNumber);

const styles = StyleSheet.create({
  CONTAINER: {
    flex: 1,
    backgroundColor: colors.white,
  },
  BODY: {
    flex: 1,
  },
  SCROLL: {
    paddingTop: mvs(27),
    paddingHorizontal: mvs(22),
    paddingBottom: mvs(0),
    flexGrow: 1,
  },
  PHONE_INPUT: { color: colors.primary, backgroundColor: colors.secondary, height: mvs(38), paddingHorizontal: mvs(10), borderRadius: mvs(10) },
  LABEL: {},
  LIST_CONTAINER: {
    paddingBottom: mvs(9),
    marginBottom: mvs(15),
    borderColor: colors.price_border,
  },
  SEND_CODE: { color: colors.primary, textDecorationLine: 'underline', fontSize: mvs(13) },
  PHONE_CONTAINER: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
