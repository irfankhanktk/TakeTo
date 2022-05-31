import TAKE_2_API from '@khan_ahmad786/common/api/API';
import UI_API from '@khan_ahmad786/common/store/services';
import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import ReactNativeModal from 'react-native-modal';
import colors from '../../../../config/colors';
import { mvs } from '../../../../config/metrices';
import Medium from '../../../../presentation/typography/medium-text';
import Regular from '../../../../presentation/typography/regular-text';
import Buttons from '../../../atoms/Button';
import ModalWrapper from '../../modal-wrapper/modal-wrapper';
import { TAKE_TO_INPUT_FIELD } from './../../../atoms/Input';
const EmailVerificationModal = ({
  type = 'email',
  isChangePassword = false,
  visible,
  onOkResult,
  forgotPayload,
  setForgotPayload,
  onClose,
  //for email otp verify and onResend
  verify,
  onResendCode,
  resendLoader
}) => {

  const [enteredOtp, setEnteredOtp] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [verifyloading, setVerifyloading] = React.useState(false);
  const alertRef = React.useRef();

  const onClosing = () => {
    if (!loading) {
      setTimeout(() => {
        onClose();
        setEnteredOtp('')
      }, 1500);
    }
  }
  const onReset = async () => {
    try {
      const response = TAKE_TO_CONSTANT.resetValidation({ email: forgotPayload?.email });
      if (response.status) {
        setLoading(true);
        const res = await TAKE_2_API?.forgotPassword(forgotPayload?.email);
        console.log('res in onrest::', res);
        let obj = { ...forgotPayload, otp: res?.data?.data?.otp };
        setForgotPayload(obj);
        alertRef.current.alertWithType(
          'success',
          'Email OTP',
          'OTP sent on your provided email successfully',
        );
      } else {
        alertRef.current.alertWithType(
          'error',
          'Error',
          response.message,
        );
      }

    } catch (error) {
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );

    } finally {
      setLoading(false);
    }
  }




  return (
    <ReactNativeModal
      propagateSwipe
      isVisible={visible}
      avoidKeyboard
      onBackButtonPress={() => onClosing()}
      onBackdropPress={() => onClosing()}
      onSwipeComplete={() => onClosing()}
      swipeDirection='down'
      style={{ margin: 0, }}>
      <View style={styles.CONTAINER}>
        <Medium label={isChangePassword ? 'Verify OTP' : type === 'email' ? `Verify Email Address` : 'Verify Phone Number'} style={styles.FORGOT_TXT} />
        <View style={{...styles.SUB_CONTAINER, paddingBottom : Platform.OS == 'ios' ? mvs(30) : mvs(17)}}>
          <TAKE_TO_INPUT_FIELD.CustomOtpInput
            value={enteredOtp}
            setValue={setEnteredOtp}
          />
          <Buttons.ButtonSecondaryOutline
            onClick={isChangePassword ? onReset : async() => {
              setLoading(true);
              await onResendCode('email', (error, success, message) => {
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
              });
              setLoading(false);
            }}
            loading={loading}
            disabled={loading}
            style={{ marginTop: mvs(40) }}
            title={`Resend code by ${type}`}
          />
          {console.log('forgotPayload::',forgotPayload)}
          <Buttons.ButtonPrimary
            loaderColor={colors.white}
            disabled={verifyloading||loading}
            loading={verifyloading}
            onClick={async () => {
              console.log('enteredOtp:::', enteredOtp);
              if (!isChangePassword) {
                
                setVerifyloading(true);
                await verify(enteredOtp, setEnteredOtp,(error)=>{
                  alertRef.current.alertWithType(
                    'error',
                    'Error',
                    error,
                  );
                });
                setVerifyloading(false);
                // setEnteredOtp('')
                return;
              }
              setVerifyloading(true);
              if (forgotPayload.otp != enteredOtp) {
                alertRef.current.alertWithType(
                  'error',
                  'Otp',
                  'Oops! It seems that you entered invalid otp',
                );
              } else {
                onOkResult();
                setEnteredOtp('');
              }
              setTimeout(() => {
                
                setVerifyloading(false);
              }, 1000);
            }}
            style={{ marginTop: mvs(10) }}
            title={'Verify'}
          />
        </View>
      </View>
      <DropdownAlert zIndex={5}   elevation={15}  translucent activeStatusBarStyle={'light-content'}  inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
    </ReactNativeModal>
  );
};
export default EmailVerificationModal;

const styles = StyleSheet.create({
  CONTAINER: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    borderTopLeftRadius: mvs(20),
    borderTopRightRadius: mvs(20),
    backgroundColor: colors.primary
  },
  FORGOT_TXT: {
    fontSize: mvs(15),
    color: colors.white,
    alignSelf: 'center',
    marginTop: mvs(13),
    marginBottom: mvs(16),
  },
  SUB_CONTAINER: {
    flexGrow: 1,
    backgroundColor: colors.white,
    paddingHorizontal: mvs(22),
    paddingVertical: mvs(17),
    borderTopLeftRadius: mvs(20),
    borderTopRightRadius: mvs(20),
  },
  RESET: {
    width: '49%',
  },
  BUTTON_CONTAINER: {
    marginTop: mvs(13),
    flexDirection: 'row',
    justifyContent: 'space-between',
  }


});