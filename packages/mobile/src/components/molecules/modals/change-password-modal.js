import TAKE_2_API from '@khan_ahmad786/common/api/API';
import UI_API from '@khan_ahmad786/common/store/services';
import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import ReactNativeModal from 'react-native-modal';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Medium from '../../../presentation/typography/medium-text';
import Regular from '../../../presentation/typography/regular-text';
import { INPUT, TAKE_TO_INPUT_FIELD } from '../../atoms';
import Buttons from '../../atoms/Button';

const ChangePasswordModal = ({ visible, onClose,forgotPayload,onOkResult}) => {
    const alertRef = React.useRef();
    const [isSaved,setIsSaved]=React.useState();
    const [loading,setLoading]=React.useState(false);
    const [payload, setPayload] = React.useState({
        password: '',
        confirm_password: '',
    });
    const [eye, setEye] = React.useState({
        bool1: true,
        bool2: true,
    });



//onChange password
const onSavePassword = async () => {
   
    try {
      let obj={ password:payload.password, confirm_password:payload.confirm_password };
      const response = TAKE_TO_CONSTANT.resetPasswordValidation(obj);
      if (response.status&&payload.password===payload.confirm_password) {
        setLoading(true);
        const res = await TAKE_2_API?.resetPassword({...forgotPayload,...obj});
        console.log('res:',res?.data?.data);
        alertRef.current.alertWithType(
          'success',
          'Alert',
          res?.data?.data,
        );
        setPayload({password:'',confirm_password:''});
        onClose();
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

  const onClosing=()=>{
    if (!loading) {
      onClose();
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
            <View style={styles.SUB_CONTAINER}>
                <Regular label={'Change Password'} style={{ color: colors.primary, fontSize: mvs(18), alignSelf: 'center',}} />
              
               <View style={{marginTop:mvs(40),}}>
                    <TAKE_TO_INPUT_FIELD.CustomInput
                        style={{ }}
                        isVerify={payload.password.length >= 8}
                        value={payload.password}
                        label={'New Password'}
                        secureTextEntry={eye.bool1}
                        secure
                        onPressIcon={() => setEye({ ...eye, bool1: !eye.bool1 })}
                        onChangeText={value => {
                            setPayload({ ...payload, password: value })
                        }}
                        placeholder={'Enter password'}
                    />
                    <TAKE_TO_INPUT_FIELD.CustomInput
                        isVerify={payload.confirm_password===payload.password&&payload.password?.length>=8}
                        isReject={payload.confirm_password.length >= 8}
                        value={payload.confirm_password}
                        label={'Confirm Password'}
                        secureTextEntry={eye.bool2}
                        secure
                        onPressIcon={() => setEye({ ...eye, bool2: !eye.bool2 })}
                        onChangeText={value => {
                            setPayload({ ...payload, confirm_password: value })
                        }}
                        placeholder={'Confirm Password'}
                    />
                </View>
                <Buttons.ButtonPrimary 
                loading={loading}
                onClick={() => {
                    onSavePassword();
                 }} title={'Save Password'} style={{ marginTop: mvs(30) }} />
            </View>
            <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'}  inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
        </ReactNativeModal>
    );
};

export default ChangePasswordModal;

const styles = StyleSheet.create({
    CONTAINER: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        borderTopLeftRadius: mvs(20),
        borderTopRightRadius: mvs(20),
        backgroundColor: colors.primary,
        
    },
    FORGOT_TXT: {
        fontSize: mvs(15),
        color: colors.white,
        alignSelf: 'center',
        marginTop: mvs(13),
        marginBottom: mvs(16),
    },
    SUB_CONTAINER: {
        // flex: 1,
        backgroundColor: colors.white,
     
        paddingVertical: mvs(17),
        borderRadius: mvs(20),
        // borderTopRightRadius: mvs(20),
        paddingHorizontal: mvs(22),
        marginHorizontal: mvs(22),
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