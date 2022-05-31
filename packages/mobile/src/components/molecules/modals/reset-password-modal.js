import TAKE_2_API from '@khan_ahmad786/common/api/API';
import UI_API from '@khan_ahmad786/common/store/services';
import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import ReactNativeModal from 'react-native-modal';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Medium from '../../../presentation/typography/medium-text';
import { TAKE_TO_INPUT_FIELD } from '../../atoms';
import Buttons from '../../atoms/Button';

const ResetPasswordModal = ({ visible, onClose,onOkResult }) => {


    const alertRef = React.useRef();
    const [loading, setLoading] = React.useState(false);
    const [forgotPayload, setForgotPayload] = React.useState({
        email:'',
        otp:'',
    });
    React.useEffect(()=>{

        if(visible){
            setForgotPayload({email:'',otp:''});
        }
    },[visible])
    const onReset = async () => {
        try {
            const response = TAKE_TO_CONSTANT.resetValidation({ email: forgotPayload?.email });
            if (response.status) {
                setLoading(true);
                const res = await TAKE_2_API?.forgotPassword(forgotPayload?.email);
                console.log('res in onrest::', res);
                setForgotPayload({ ...forgotPayload, otp: res?.data?.data?.otp });
                onOkResult({ ...forgotPayload, otp: res?.data?.data?.otp });
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
            <View style={{...styles.CONTAINER}}>
                <Medium label={'Forgot Password?'} style={styles.FORGOT_TXT} />
                <View style={{...styles.SUB_CONTAINER, paddingBottom : Platform.OS == 'ios' ? mvs(30) : mvs(17)}}>
                    <TAKE_TO_INPUT_FIELD.CustomInput
                        divider
                        keyboardType={'email-address'}
                        value={forgotPayload.email}
                        onChangeText={(t)=>setForgotPayload({...forgotPayload,email:t?.trim()})}
                        returnKeyType='next'
                        labelStyle={{ color: colors.typeHeader }}
                        label={'Registered Email'}
                        placeholder={'Email address'} />
                    <View style={styles.BUTTON_CONTAINER}>
                        <Buttons.ButtonPrimary
                            loading={loading}
                            loaderColor={colors.white}
                            disabled={loading}
                            onClick={onReset} style={styles.RESET} title={'Reset'} />
                        <Buttons.ButtonSecondaryOutline onClick={() => onClosing()} style={styles.RESET} title={'Cancel'} />
                    </View>
                </View>
            </View>

            <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'}  inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
        </ReactNativeModal>
    );
};

export default ResetPasswordModal;

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