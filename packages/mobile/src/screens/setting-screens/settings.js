import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GPSState from 'react-native-gps-state'
import React, { useState, useEffect } from 'react';
import { Alert, AppState, Linking, PermissionsAndroid, ScrollView, StyleSheet, View } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import CustomSwitch from '../../components/atoms/Switch';
import DualText from '../../components/molecules/dual-text/dual-text';
import Header from '../../components/molecules/header/header-1x';
import SettingCard from '../../components/molecules/setting_card/setting-card';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { mvs } from '../../config/metrices';
import Regular from '../../presentation/typography/regular-text';
import DeviceInfo from 'react-native-device-info';
const Settings = props => {
  const { notifications, navigation, updateUserProfile, profileData } = props;
  
  const [payload, setPayload] = React.useState({
    // sale_notify_email: false,
    location_service: false,
    // email_notify: false,
    // mobile_notify: false,
  });
  const [loading, setLoading] = React.useState(false);
  const alertRef = React.useRef();
  const [locationService,setLocationService]=React.useState(false);
  const toggleHandler = (key, value) => {
    updateNotificationPayload(key, value);
    // setPayload({ ...payload, [key]: value ? 1 : 0 });
  };

  const updateNotificationPayload = async (key, value) => {
    try {
      setLoading(true);
      await updateUserProfile({ [key]: value ? 1 : 0 });
      setLoading(false)
    } catch (error) {
      setLoading(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };



  const changeLocationService = async (is_app_state_changed = false) => {
    
    let flag = false

    try {
      if (is_app_state_changed) {
        flag = await UI_API._getLocPermissionStatus(Linking, alertRef);
        if (flag == true) {
          // await getCurrentLocation();
          //setLocationService(flag);
           setPayload({ ...payload, location_service: flag });
        }

        if (flag === 'disabled') {
          UI_API.locationSettingAlert();
        } else {
         // setLocationService(flag);
         setPayload({ ...payload, location_service: flag });
        }
      } else {
        UI_API.locationSettingAlert();
      }
    } catch (error) {
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }


  }

  const appState = React.useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", async nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        const providers=await  DeviceInfo.getAvailableLocationProviders();
        
        
        if (locationService||Object.keys(providers).length > 0) {
          const permissionStatus = await UI_API._checkPermissions(alertRef, Linking)
         setPayload({ ...payload, location_service: permissionStatus === 'disabled' ? false : permissionStatus });
        //  setLocationService(permissionStatus === 'disabled' ? false : permissionStatus);
        }
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // React.useEffect(() => {

  //     setPayload({
  //       ...payload,
  //       sale_notify_email: notifications?.sale_notify_email * 1,
  //       email_notify: notifications?.email_notify * 1,
  //       mobile_notify: notifications?.mobile_notify * 1,
  //     });


  // }, [profileData]);

  React.useEffect(() => {
    // 
    DeviceInfo.getAvailableLocationProviders().then((providers) => {
      
      setPayload({
        ...payload,
      
        location_service: Object.keys(providers).length > 0,// permissionStatus === 'disabled' ? false : permissionStatus,
       
      });
      // 
    });

  }, [profileData]);



  return (
    <View style={styles.CONTAINER}>
      <Header {...props} title="Settings" allowBackBtn userIcon={false} />
      <View style={styles.BODY}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.SCROLL}>
          <Regular
            onPress={() => props.navigation.navigate('savedaddress')}
            label={'Saved Addresses'}
            style={styles.LIST_LABEL}
          />
          {/* {profileData?.is_email_verified === 0 && */}
          <Regular
            onPress={() => props.navigation.navigate('changeemail')}
            label={'Change Email'}
            style={styles.LIST_LABEL}
          />
          {/* } */}
          <Regular
            onPress={() => props.navigation.navigate('changepassword')}
            label={'Change Password'}
            style={styles.LIST_LABEL}
          />
          <Regular
            onPress={() => props.navigation.navigate('changephonenumber')}
            label={'Change Phone Number'}
            style={styles.LIST_LABEL}
          />
          <Regular
            label={'Notifications'}
            style={{ marginBottom: mvs(8), marginTop: mvs(45) }}
          />
          <SettingCard heading={'Status Updates on Orders'}>
            <DualText
              // onPress={()=>alert('sdsd')}
              content={
                'Different types of notifications regarding your activity.'
              }
            // highlightText={' Taketo.'}
            />
            <CustomSwitch
              disabled={loading}
              value={notifications?.email_notify * 1}
              label={'Email'}
              textStyle={{ color: colors.primary }}
              onChange={v => toggleHandler('email_notify', v)}
            />
            <CustomSwitch
              disabled={loading}
              style={{ marginTop: mvs(28) }}
              value={ notifications?.mobile_notify * 1}
              label={'SMS'}
              textStyle={{ color: colors.primary }}
              onChange={v => toggleHandler('mobile_notify', v)}
            />
          </SettingCard>
          <View style={{ ...styles.CARD }}>
            <CustomSwitch
              disabled={loading}
              style={{ marginTop: mvs(0) }}
              value={payload?.location_service}
              label={'Location Services'}
              onChange={(val) => changeLocationService(val)}
            />
          </View>
          <SettingCard
            style={{ marginTop: mvs(20) }}
            heading={'Sales & Promotions'}>
            <DualText
              // onPress={()=>alert('sdsd')}
              content={
                'Receive coupons, promotions, surveys, product updates from'
              }
              highlightText={' Taketo '}>
              <Regular style={styles.CARD_LABEL} label={'and partners.'} />
            </DualText>

            <CustomSwitch
              disabled={loading}
              value={notifications?.sale_notify_email * 1}
              label={'Email'}
              textStyle={{ color: colors.primary }}
              onChange={v => toggleHandler('sale_notify_email', v)}
            />
          </SettingCard>
        </ScrollView>
      </View>
       <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'}  inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
    </View>
  );
};
const mapStateToProps = state => {
  return {
    notifications: state.auth.userInfo?.notifications || {},
    profileData: state.auth.userInfo?.profile,
  };
};
const mapDispatchToProps = dispatch => ({
  updateUserProfile: data => dispatch(TAKE_TO_ACTIONS.updateUserProfile(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
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
    paddingBottom: mvs(10),
  },
  LIST_LABEL: {
    // borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: colors.secondary,
    borderColor: colors.price_border,
    marginBottom: mvs(10),
    paddingHorizontal: mvs(10),
    paddingVertical: mvs(8),
    borderRadius: mvs(10),
    color: colors.primary,
  },
  CARD: {
    marginTop: mvs(20),
    paddingTop: mvs(20),
    paddingBottom: mvs(17),
    backgroundColor: colors.secondary,
    paddingHorizontal: mvs(20),
    borderRadius: mvs(10),
  },
  CARD_HEADING: { marginBottom: mvs(8), color: colors.input_label },
  CARD_LABEL: {
    color: colors.label,
    fontSize: mvs(12),
    fontFamily: fonts.carosSoftRegular,
  },

  TAKE_TO_LABEL: { color: colors.primary, fontSize: mvs(12) },
});
