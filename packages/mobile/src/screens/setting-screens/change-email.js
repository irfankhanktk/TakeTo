import React from 'react';
import { View, StyleSheet, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { mvs, width } from '../../config/metrices';
import { TAKE_TO_INPUT_FIELD } from '../../components/atoms';
import Buttons from '../../components/atoms/Button';
import Header from '../../components/molecules/header/header-1x';
import colors from '../../config/colors';
import Regular from '../../presentation/typography/regular-text';
import { Tick } from '../../../resource/assets/common-icons';
import TAKE_2_API from '@khan_ahmad786/common/api/API';
import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import DropdownAlert from 'react-native-dropdownalert';
import UI_API from '@khan_ahmad786/common/store/services';
import { connect } from 'react-redux';
import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';


const ChangeEmail = props => {
  const { profileData, fetchUserInfo, updateUserProfile } = props;
  const [payload, setPayload] = React.useState({
    email: profileData?.email,
    isemailVerify: false,
    newEmail: '',
    otp: '',
    receivedOtp: '',
  });
  const alertRef = React.useRef();
  const [isSent, setIsSent] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [verifing, setVerifing] = React.useState(false);
  const [resending, setResending] = React.useState(false)
  const list = [0, 1, 2];


  const onSentOtp = async (reSend) => {
    try {
      if (reSend) setResending(true); setLoading(true)
      const response = TAKE_TO_CONSTANT.resetValidation({ email: payload?.newEmail });
      console.log('response::', response);
      if (response.status) {
        const res = await TAKE_2_API?.postEmailOtp(payload?.newEmail);
        // console.log('res:::',res);
        setPayload({ ...payload, receivedOtp: res?.data?.data?.otp });
        alertRef.current.alertWithType(
          'success',
          'Email OTP',
          'OTP sent on your provided email successfully',
        );
        setIsSent(false);
      } else {
        throw new Error(response?.message)
      }
      if (reSend) setResending(false); setLoading(false);
    } catch (error) {
      if (reSend) setResending(false); setLoading(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  }



  const verifyOTP = async () => {
    //console.log("otp",payload?.otp)
    try {
      setVerifing(true)
      await TAKE_2_API.verifyOTP(payload?.otp, 'email');
      await updateUserProfile({
        email: payload?.newEmail
      })
      setVerifing(false)
      alertRef.current.alertWithType(
        'success',
        'OTP Verified',
        'OTP verified successfully',
        );
        await fetchUserInfo();
      props.navigation.pop();
    } catch (error) {
      setVerifing(false)
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };



  return (
    <KeyboardAvoidingView
    style={{ flex: 1, backgroundColor: colors.white }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <View style={styles.CONTAINER}>
      <Header
        {...props}
        title="Change email address"
        allowBackBtn
        userIcon={false}

      />
      <ScrollView contentContainerStyle={styles.SCROLL}>
        <View style={styles.BODY}>
          <View style={{ width: '100%', }}>
            <TAKE_TO_INPUT_FIELD.CustomInput
              editable={false}
              isVerify
              // style={{color:colors.label}}
              keyboardType={'email-address'}
              value={payload.email}
              onChangeText={text => setPayload({ ...payload, email: text?.trim() })}
              label={'Registered Email address'}
              // isVerify={payload.email}
              placeholder={'Registered email address'}
            />
          </View>
          <View style={{ width: '100%', }}>
            <TAKE_TO_INPUT_FIELD.CustomInput
              keyboardType={'email-address'}
              value={payload.newEmail}
              onChangeText={text => {
                setPayload({ ...payload, newEmail: text?.trim() });
                setIsSent(true);
              }}
              label={'New Email address'}
              placeholder={'New email address'}
            />
          </View>

          {TAKE_TO_CONSTANT.validateEmail(payload?.newEmail) && isSent ? <Buttons.ButtonPrimary
            loading={loading}
            loaderColor={colors?.white}
            onClick={() => onSentOtp(false)}
            textStyle={{ color: colors.white }}
            title={'Send Code'}
            style={{ backgroundColor: colors.primary }}
          /> :
            <Buttons.ButtonPrimary
              disabled
              onClick={() => props.navigation.pop()}
              textStyle={{ color: colors.doted }}
              title={'Send Code'}
              style={{ backgroundColor: colors.secondary }}
            />}


            <TAKE_TO_INPUT_FIELD.CustomOtpInput
              value={payload.otp}
              setValue={(v) => setPayload({ ...payload, otp: v })} />
          {isSent ? (
            <View style={{ marginTop: mvs(270), paddingBottom: mvs(40), width: '100%' }}>
              <Buttons.ButtonSeconday
                disabled
                onClick={() => { }}
                title={'Verify'}
                textStyle={{ color: colors.doted }}
                style={{ backgroundColor: colors.secondary }}
              />
            </View>
          ) : (
            <>
              <View style={{ marginTop: mvs(208), paddingBottom: mvs(40), width: '100%' }}>
                <Buttons.ButtonSecondaryOutline
                  onClick={() => onSentOtp(true)}
                  loading={resending}
                  title={'Resend code by email'}
                  style={{ marginBottom: mvs(15) }}
                  textStyle={{ color: isSent ? colors.lightgrey2 : colors.typeHeader }}
                />
                <Buttons.ButtonPrimary
                  loading={verifing}
                  loaderColor={colors?.white}
                  disabled={verifing}
                  onClick={verifyOTP}
                  title={'Verify'}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>
      <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'}  inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
    </View>
    </KeyboardAvoidingView>
  );
};
// export default ChangeEmail;
const mapStateToProps = state => {
  return {
    profileData: state.auth.userInfo?.profile,
  };
};

const mapDispatchToProps = dispatch => ({
  updateUserProfile: data => dispatch(TAKE_TO_ACTIONS.updateUserProfile(data)),
  fetchUserInfo: () => dispatch(TAKE_TO_ACTIONS.fetchUserInfo()),
});
// export default SignInScreen;
export default connect(mapStateToProps, mapDispatchToProps)(ChangeEmail);
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
    // paddingBottom: mvs(200),
    flexGrow: 1,
  },
  LABEL: {},
  LIST_CONTAINER: {
    paddingBottom: mvs(9),
    marginBottom: mvs(15),
    borderColor: colors.price_border,
  },
});
