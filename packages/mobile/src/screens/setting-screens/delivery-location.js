import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import React, { useEffect, useRef, useState } from 'react';
import { AppState, Linking, Platform, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Geocoder from 'react-native-geocoding';
import GetLocation from 'react-native-get-location';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { connect } from 'react-redux';
import SVGS from '../../../resource/assets/rtl-button-icons';
import Buttons from '../../components/atoms/Button';
import GoogleSearchBar from '../../components/molecules/google-search-bar';
import Header from '../../components/molecules/header/header-1x';
import colors from '../../config/colors';
import { mvs } from '../../config/metrices';
import DeviceInfo from 'react-native-device-info';
import DropdownAlert from 'react-native-dropdownalert';
import { back as Back } from '../../../resource/assets/headers-icons';
import Regular from '../../presentation/typography/regular-text';
import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import { useSafeAreaInsets, withSafeAreaInsets } from 'react-native-safe-area-context';

const DeliveryLocation = props => {
  const { fetchSelectedAddress, route, profileData } = props;
  const { heading, locationObj, isLocal } = route.params || {}
  let ref = useRef();
  const alertRef = React.useRef();
  const insets = useSafeAreaInsets();

  const Location = SVGS['location'];

  const [region, setRegion] = useState({
    latitude: 29.295593801244358,
    latitudeDelta: 0.015,
    longitude: 48.060459344536305,
    longitudeDelta: 0.0121,
  });

  const [locationService, setLocationService] = React.useState(false);

  const appState = React.useRef(AppState.currentState);
  // const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", async nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");
        const providers = await DeviceInfo.getAvailableLocationProviders();
        console.log(providers);
        if (locationService || Object.keys(providers).length > 0) {
          const permissionStatus = await UI_API._checkPermissions(alertRef, Linking)
          setLocationService(permissionStatus === 'disabled' ? false : permissionStatus);
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  React.useEffect(() => {
    DeviceInfo.getAvailableLocationProviders().then((providers) => {
      setLocationService(Object.keys(providers).length > 0);
    });

  }, []);



  const changeLocationService = async (is_app_state_changed = false) => {
    console.log('is_app_state_changed::', is_app_state_changed);
    let flag = false

    try {
      if (is_app_state_changed) {
        flag = await UI_API._getLocPermissionStatus(Linking, alertRef);
        if (flag == true) {
          setLocationService(flag);
        }

        if (flag === 'disabled') {
          UI_API.locationSettingAlert();
        } else {
          setLocationService(flag);
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



  useEffect(() => {
    if (locationObj !== undefined) {
      setRegion({
        latitude: locationObj?.latitude,
        latitudeDelta: 0.015,
        longitude: locationObj?.longitude,
        longitudeDelta: 0.0121,
      });
      ref?.current?.animateToRegion(
        {
          latitude: locationObj?.latitude,
          latitudeDelta: 0.015,
          longitude: locationObj?.longitude,
          longitudeDelta: 0.0121,
        },
        1000,
      );
    } else
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
        .then(location => {
          console.log('location', location);
          setRegion({
            latitude: location?.latitude,
            latitudeDelta: 0.015,
            longitude: location?.longitude,
            longitudeDelta: 0.0121,
          });
          ref?.current?.animateToRegion(
            {
              latitude: location?.latitude,
              latitudeDelta: 0.015,
              longitude: location?.longitude,
              longitudeDelta: 0.0121,
            },
            1000,
          );
        })
        .catch(error => {
          const { code, message } = error;
          console.warn(code, message);
        });
  }, [locationService]);

  const getAddress = () => {
    Geocoder.from(region.latitude, region.longitude)
      .then(async json => {
        var addressComponent = UI_API._returnAddress(json);
        const address = {
          ...addressComponent,
          latitude: region.latitude,
          longitude: region.longitude,
        };
        if (props.route.params.type == 'deliveryaddress') {
          props.navigation.navigate('deliveryaddress', { region: region, address: address, type: props.route.params.type })
        } else {
          props.navigation.navigate(
            props.route.params.type == 'pstore' ? 'selectaddress' : 'newaddress',
            { region: region, address: address, type: props.route.params.type },
          );
        }
      })
      .catch(error => console.warn(error));
  };

  return (
    <View style={{ ...styles.CONTAINER, }}>

      <View style={styles.BODY}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={{ flex: 1, justifyContent: 'center', marginTop: mvs(-10) }}
          initialRegion={region}
          ref={ref}
          showsUserLocation={true}
          showsMyLocationButton={false}
          onRegionChangeComplete={ll => {
            setRegion(ll);
          }}
        />
        <View style={styles.pointer}>{/* <Location/>   */}
        </View>

        <View
          style={{
            position: 'absolute',
            bottom: mvs(40),
            paddingHorizontal: mvs(22),
            width: '100%',
          }}>
          <Buttons.ButtonPrimary
            onClick={() => {
              getAddress();
            }}
            title={'Confirm'}
          />
        </View>
        <TouchableOpacity onPress={() => changeLocationService(!locationService)} activeOpacity={0.5} style={{
          position: 'absolute',
          top: mvs(200), height: mvs(40),
          width: mvs(40),
          ...colors.shadow,
          borderRadius: mvs(20), backgroundColor: colors.white, right: mvs(22), alignItems: 'center', justifyContent: 'center'
        }}>
          <View style={{ height: mvs(20), width: mvs(20), borderRadius: mvs(10), backgroundColor: locationService ? colors.primary : colors.label }} />
        </TouchableOpacity>
        <DropdownAlert zIndex={5} elevation={15} inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />

      </View>
      <View style={{ ...styles.barContainer, paddingTop: insets.top }}>
        <View style={{
          width: '100%',
        }}>
          <View style={{ paddingTop: mvs(25), flexDirection: 'row' }}>
            <TouchableOpacity
              style={{ width: '10%', }}
              onPress={() => {
                props?.navigation.goBack();
              }}>
              <Back height={mvs(16)} width={mvs(16)} />
            </TouchableOpacity>
            <View style={{ paddingLeft: mvs(21.5) }}>
              <Regular
                numberOfLines={1}
                label={TAKE_TO_CONSTANT._returnHeaderTitle(heading ? heading : "Delivery Location")}
                style={styles.TITLE}
              />
            </View>
          </View>

          <View style={{
            marginTop: mvs(30),
            paddingBottom: mvs(30),
            width: '100%',
          }}>
            <View style={{ width: '100%',position:'absolute' }}>
              <GoogleSearchBar
                countrySlug={!isLocal ? null : profileData?.country?.slug || 'kw'}
                style={{ width: '100%', flex: 0, paddingHorizontal: mvs(10) }}
                textInputContainer={{ backgroundColor: colors.secondary, borderRadius: 10, }}
                {...props}
                placeholder="Enter an address"
                inputStyle={{ color: colors.typeHeader }}
                onClick={() => {
                }}
                onPress={(data, details = null) => {
                  setRegion({
                    latitude: details?.geometry?.location?.lat,
                    latitudeDelta: 0.015,
                    longitude: details?.geometry?.location?.lng,
                    longitudeDelta: 0.0121,
                  });
                  ref?.current?.animateToRegion(
                    {
                      latitude: details?.geometry?.location?.lat,
                      latitudeDelta: 0.015,
                      longitude: details?.geometry?.location?.lng,
                      longitudeDelta: 0.0121,
                    },
                    1000,
                  );
                }}
              />
            </View>
          </View>
          <View />
        </View>
      </View>
    </View>
  );
};

const mapStateToProps = state => {
  return {
    selectedMapAddress: state.common.selectedMapAddress,
    profileData: state.auth.userInfo?.profile || {},
  };
};
const mapDispatchToProps = dispatch => ({
  fetchSelectedAddress: data =>
    dispatch(TAKE_TO_ACTIONS.fetchSelectedAddress(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeliveryLocation);

const styles = StyleSheet.create({
  CONTAINER: {
    flex: 1,
    backgroundColor: colors.white,
  },
  TITLE: {
    fontSize: mvs(15),
    color: colors.primary,
  },
  BODY: {
    flex: 1,
    justifyContent: 'center',
  },
  LABEL: {},
  LIST_CONTAINER: {
    paddingBottom: mvs(9),
    marginBottom: mvs(15),
    borderColor: colors.price_border,
  },
  pointer: {
    height: mvs(10),
    width: mvs(10),
    position: 'absolute',
    backgroundColor: colors.primary,
    alignSelf: 'center',
    borderRadius: mvs(10 / 2),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  barContainer: {
    width: '100%',
    position: 'absolute',
    paddingHorizontal: mvs(22),
    paddingBottom: mvs(23),
    borderBottomRightRadius: mvs(20),
    borderBottomLeftRadius: mvs(20),
    ...colors.shadow,
    elevation:1,
    // overflow: 'hidden',
    backgroundColor: colors.white,
  },
});
