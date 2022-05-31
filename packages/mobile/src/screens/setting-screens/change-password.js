import React from 'react';
import {View, StyleSheet, ScrollView, Platform, KeyboardAvoidingView} from 'react-native';
import {mvs} from '../../config/metrices';
import {TAKE_TO_INPUT_FIELD} from '../../components/atoms';
import Buttons from '../../components/atoms/Button';
import Header from '../../components/molecules/header/header-1x';
import colors from '../../config/colors';
import DropdownAlert from 'react-native-dropdownalert';
import {connect} from 'react-redux';
import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UI_API from '@khan_ahmad786/common/store/services';
import services from '@khan_ahmad786/common/api/services';

const ChangePassword = props => {
  const {navigation, updateUserProfile} = props;
  const [payload, setPayload] = React.useState({
    old_password: '',
    isOldVerify: false,
    password: '',
    isNewVerify: false,
    confirm_password: '',
    isConfirmVerify: false,
    isOldPasswordSecure: true,
    isNewPasswordSecure: true,
    isConfirmPasswordSecure: true,
  });
  const alertRef = React.useRef();
  const [loading, setLoading] = React.useState(false);


  const onSignOut = async () => {
    props.resetReducer();
    props.navigation.reset({ index: 0, routes: [{ name: 'login' }] });
    // await client.delete(services.auth.logout)
    await AsyncStorage.multiRemove(['@token']);
  };

  // console.log(payload);
  const updatePassword = async () => {
    try {
      setLoading(true);
      const newPayload = {
        old_password: payload?.old_password,
        password: payload?.password,
        confirm_password: payload?.confirm_password,
      };
      await updateUserProfile(newPayload);
      alertRef.current.alertWithType(
        'success',
        'Password Updated',
        'Your password changed succesfully',
      );
      setPayload({})
      setTimeout(()=>{
        onSignOut()
      },1000)
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };

  const onChangeHandle = (key, value, flag, flagValue) => {
    console.log({key, value, flag, flagValue});
 
    setPayload({...payload, [key]: value, [flag]: flagValue,});
  };

  return (
    <KeyboardAvoidingView
    style={{ flex: 1, backgroundColor: colors.white }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
    <View style={styles.CONTAINER}>
      <Header
        {...props}
        title="Change password"
        allowBackBtn
        userIcon={false}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: mvs(6),
          paddingHorizontal: mvs(22),
          paddingTop:mvs(27)
        }}>
        {/* <View style={styles.BODY}> */}
        <TAKE_TO_INPUT_FIELD.CustomInput
          //isVerify={payload.isOldVerify}
          onPress={() => {}}
          onPressIcon={() =>
            setPayload({
              ...payload,
              isOldPasswordSecure: !payload.isOldPasswordSecure,
            })
          }
          secure
          secureTextEntry={payload.isOldPasswordSecure}
          value={payload.old_password}
          onChangeText={text =>
            onChangeHandle(
              'old_password',
              text,
              'isOldVerify',
              text?.length >= 8,
            )
          }
          label={'Old Password'}
          placeholder={'Enter old password'}
        />
        <TAKE_TO_INPUT_FIELD.CustomInput
          isVerify={payload.isNewVerify}
          onPress={() => {}}
          onPressIcon={() =>
            setPayload({
              ...payload,
              isNewPasswordSecure: !payload.isNewPasswordSecure,
            })
          }
          secure
          secureTextEntry={payload.isNewPasswordSecure}
          value={payload.password}
          onChangeText={text =>
            onChangeHandle('password', text, 'isNewVerify', text?.length >= 8)
          }
          label={'New Password'}
          placeholder={'New Password'}
        />
        {console.log('payload::',payload.confirm_password?.length>=8&&payload.password?.length>=8&&payload.confirm_password!==payload.password)}
        <TAKE_TO_INPUT_FIELD.CustomInput
          isVerify={payload.password === payload.confirm_password && payload.confirm_password?.length >= 8}
          isReject={payload.confirm_password?.length>=8&&payload.password?.length>=8&&payload.confirm_password!==payload.password}
          onPress={() => {}}
          onPressIcon={() =>
            setPayload({
              ...payload,
              isConfirmPasswordSecure: !payload.isConfirmPasswordSecure,
            })
          }
          secure
          secureTextEntry={payload.isConfirmPasswordSecure}
          value={payload.confirm_password}
          onChangeText={text =>
            onChangeHandle(
              'confirm_password',
              text,
              'isConfirmVerify',
              payload.password == text && text?.length >= 8,
            )
          }
          divider
          label={'Confirm New Password'}
          placeholder={'New Password'}
        />
        {payload.isOldVerify && payload.password === payload.confirm_password && payload.confirm_password?.length >= 8 && (
          <Buttons.ButtonPrimary
            onClick={updatePassword}
            loaderColor={colors.white}
            loading={loading}
            disabled={loading}
            title={'Save Password'}
            style={{
              position: 'absolute',
              bottom: mvs(40),
              alignSelf: 'center',
            }}
          />
        )}
        {/* </View> */}
      </ScrollView>
      <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'}  inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
    </View>
    </KeyboardAvoidingView>
  );
};
const mapDispatchToProps = dispatch => ({
  updateUserProfile: data => dispatch(TAKE_TO_ACTIONS.updateUserProfile(data)),
  resetReducer: data => dispatch(TAKE_TO_ACTIONS.resetReducer()),
});
export default connect(null, mapDispatchToProps)(ChangePassword);
const styles = StyleSheet.create({
  CONTAINER: {
    flex: 1,
    backgroundColor: colors.white,
  },
  BODY: {
    flex: 1,
    paddingTop: mvs(6),
    paddingHorizontal: mvs(22),
  },
  LABEL: {},
  LIST_CONTAINER: {
    paddingBottom: mvs(9),
    marginBottom: mvs(15),
    borderColor: colors.price_border,
  },
});
