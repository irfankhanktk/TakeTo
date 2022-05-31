import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { AppState, Keyboard, Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import DropdownAlert from 'react-native-dropdownalert';
import Geocoder from 'react-native-geocoding';
import MapView, {
  Marker,
  PROVIDER_GOOGLE
} from 'react-native-maps';
import { useSafeAreaInsets, withSafeAreaInsets } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import { filter_icons as Filter } from '../../../resource/assets/common-icons';
import { back as Back } from '../../../resource/assets/headers-icons';
import * as SVGS from '../../../resource/assets/order-car-icons/index';
import GoogleSearchBar from '../../components/molecules/google-search-bar';
import MapSearchOrderRadiusModal from '../../components/molecules/modals/map-search-order-radius';
import colors from '../../config/colors';
import { mvs } from '../../config/metrices';
import Bold from '../../presentation/typography/bold-text';
import { CommonActions } from '@react-navigation/native';

const SearchMap = props => {
  let ref = useRef();
  const { filter_Orders, filterPostedLocalOrdersList, profileData, internationalFilter, localFilter, setOrResetInternationalFilter, setOrResetLocalFilter } = props;
  const { isLocalOrder = false, filterPayload, isOnline, isFilter, } = props.route.params;
  const Bottom = SVGS['calout_bottom']
  const [loading, setLoading] = useState(false)
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [radius, setRadius] = useState(0)
  const alertRef = React.useRef();
  const flatListRef = React.useRef();
  const [locationService, setLocationService] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState('');
  const [region, setRegion] = useState({
    latitude: 29.295593801244358,
    latitudeDelta: 0.015,
    longitude: 48.060459344536305,
    longitudeDelta: 0.0121,
  });

  const radioLabels = {
    label1Way: 'One Way',
    label2Way: 'Round Trip',
    label30Days: 'Up to 30 days',
    label3Weeks: 'Up to 3 weeks',
    label2Weeks: 'Up to 2 weeks',
    label90Days: 'Up to 90 days',
    labelUrgent: 'Urgent Deliveries',
    labelDeliveryBefore: 'Delivery Before',
  };

  console.log('international filter:::::::::',internationalFilter);
  const returnSelectedDays = internationalFilter => {
    switch (internationalFilter?.delivery_date) {
      case radioLabels.label30Days:
        return 30;
      case radioLabels.label3Weeks:
        return 21;
      case radioLabels.label2Weeks:
        return 14;
      case radioLabels.label90Days:
        return 90;
      case radioLabels.labelUrgent:
        return 0;
      default:
        return 30;
    }
  };

  const appState = React.useRef(AppState.currentState);
  // const isFromLocation = () => {
  //   if (filterPayload?.latitude && filterPayload?.longitude) {
  //     return true;
  //   }
  //   return false;
  // }


  const readyPayload = async () => {
    let obj = {};

    if (isLocalOrder) {
      obj = {
        ...localFilter,
        delivery_date: localFilter?.delivery_date
          ? UI_API._replaceAllSlash(localFilter?.delivery_date)
          : localFilter?.is_urgent
            ? '' //moment().add(1, 'days').format('YYYY-MM-DD')
            : localFilter?.isTwoDays
              ? moment().add(2, 'days').format('YYYY-MM-DD')
              : moment().add(3, 'days').format('YYYY-MM-DD'),
        is_urgent: localFilter.is_urgent ? 1 : 0,
        no_delivery: localFilter?.no_delivery ? 1 : 0,
        is_save: isFilter ? 0 : 1,
      };

      const providers = await DeviceInfo.getAvailableLocationProviders();

      //get-location of user if allowed
      if (Object.keys(providers).length > 0) {
        let location = await UI_API._get_current_location(false);
        if (location) {
          let location_obj = {};
          if (!localFilter?.country_from) {
            location_obj = {
              latitude: location?.latitude,
              longitude: location?.longitude,
            };
          }
          obj = {
            ...obj,
            ...location_obj,
            to_latitude: location?.latitude,
            to_longitude: location?.longitude,
          };
        }
      }

      delete obj?.full_address_from;
      delete obj?.full_address_to;
      delete obj?.isTwoDays;
      delete obj?.isThreeDays;
      delete obj?.from_flag;
      delete obj?.to_flag;

    } else {
      let dateObj = {};
      if (internationalFilter.trip_type === 2 && dateObj.returning_date) {
        dateObj.returning_date = UI_API._replaceAllSlash(
          internationalFilter.returning_date,
        );
      } else {
        delete internationalFilter.returning_date;
      }
      obj = {
        ...internationalFilter,
        ...dateObj,
        delivery_date: internationalFilter?.is_urgent
          ? ''
          : internationalFilter?.delivery_date?.includes('/')
            ? UI_API._replaceAllSlash(internationalFilter.delivery_date)
            : moment()
              .add(returnSelectedDays(internationalFilter), 'days')
              .format('YYYY-MM-DD'),
        departure_date: UI_API._replaceAllSlash(
          internationalFilter.departure_date,
        ),
        no_delivery: internationalFilter.no_delivery ? 1 : 0,

        is_save: isFilter ? 0 : 1,
        trip_type:(!isFilter&&internationalFilter.trip_type === 2)?2:1,
      };
      delete obj?.full_address_from;
      delete obj?.full_address_to;
      delete obj?.city_from;
      delete obj?.city_to;

      delete obj?.from_flag;
      delete obj?.to_flag;

      const providers = await DeviceInfo.getAvailableLocationProviders();

      //get-location of user if allowed
      if (Object.keys(providers).length > 0) {
        let location = await UI_API._get_current_location(false);
        console.log('LOC :: ', location);
        if (location) {
          obj = {
            ...obj,
            to_latitude: location?.latitude,
            to_longitude: location?.longitude,
          };
        }
      }
    }

    return obj;
  };


  const selectAddressHandler = async (location) => {
    try {
      if (!location) {
        return {};
      }
      const json = await Geocoder.from(location?.latitude, location?.longitude);
      var addressComponent = UI_API._returnAddress(json);

      let address = {
        country_to: addressComponent?.country,
        full_address_to: addressComponent?.fulladdress,
        // city_to: addressComponent?.city,
        to_country_short_name: addressComponent?.country_short_name,

      }

      if (isLocalOrder) {
        setOrResetLocalFilter({ ...localFilter, ...address, to_flag: UI_API._returnFlag(addressComponent?.country_short_name), });
      } else {

        if (!isLocalOrder && address?.country_to?.toLowerCase() === internationalFilter?.country_from?.toLowerCase()) {
          throw new Error('In international trip you are not allowed to search orders within a country');
        } else {
          setOrResetInternationalFilter({ ...internationalFilter, ...address, to_flag: UI_API._returnFlag(addressComponent?.country_short_name) })
        }
      }
      return {
        country_to: addressComponent?.country,
        // city_to: addressComponent?.city,
        to_country_short_name: addressComponent?.country_short_name,
      };
    } catch (error) {
      throw new Error(error);
    }

  }

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
      console.log(providers)
      setLocationService(Object.keys(providers).length > 0);
    });

  }, [profileData]);

  console.log('profileData:::', profileData);

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

  const onSearchChange = async (location) => {
    try {
     setLoading(true);
      setRegion(location);
      ref?.current?.animateToRegion(
        location,
        1000,
      );
      let latlng = {
        latitude: location?.latitude,
        longitude: location?.longitude,
      }
      const address = await selectAddressHandler(latlng);

      await getMapOrders(address);
    } catch (error) {
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  }
  // on radius change with current location
  const getMapOrders = async (searchAddress = {}) => {
    try {
      setLoading(true);
      const res = await readyPayload();
      console.log('res:::',res);
      let obj = UI_API._removeEmptyKeys(res);
      const response = await filterPostedLocalOrdersList({ ...obj, ...searchAddress, is_save: 0 }, isLocalOrder);
      if (response && response?.length > 0) {
        const location = { latitude: response[0]?.shop_location?.latitude, longitude: response[0]?.shop_location?.longitude, latitudeDelta: 0.015, longitudeDelta: 0.0121, }
        if (location) {
          setRegion(location);
          ref?.current?.animateToRegion(location, 1000);
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  }

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    // const unsubscribe = props?.navigation.addListener('focus', () => {
    //   alert(isLocalOrder);
      getMapOrders();
    // });
    // return unsubscribe;
  }, [localFilter,internationalFilter])


  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <View contentContainerStyle={{ flexGrow: 1 }}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={{ height: '100%', width: '100%' }}
          ref={ref}
          initialRegion={region}
          showsUserLocation={true}
          showsMyLocationButton={false}>
          {filter_Orders?.data?.map((item, index) => {
            let bool = activeItem?.order_id === item?.order_id;
            console.log('item?.order_id::',item?.order_id);
            console.log('activeItem?.order_id::',activeItem?.order_id);
            return item?.shop_location ? <Marker style={{zIndex:bool?1001:0, padding: mvs(2) }} onPress={() => {
              flatListRef?.current?.scrollToIndex({ animated: true, index, viewOffset: 0, viewPosition: 0.5 })
            }} coordinate={item?.shop_location}>
              <View style={{ backgroundColor: item?.is_urgent && bool ? colors.pink : bool ? colors.primary : colors.white, borderRadius: mvs(15), justifyContent: 'center', paddingHorizontal: mvs(10), height: mvs(30), borderWidth: bool ? 0 : 1, borderColor: colors.border }}>
                <Bold style={{ fontSize: mvs(13), color: bool ? colors.white : colors.typeHeader }} label={`${item?.order_reward_price}`} />
              </View>
            </Marker> : null
          })}

        </MapView>
        <TouchableOpacity onPress={() => changeLocationService(!locationService)} activeOpacity={0.5} style={{
          position: 'absolute',
          top: mvs(200), height: mvs(40),
          width: mvs(40),
          ...colors.shadow,
          borderRadius: mvs(20), backgroundColor: colors.white, right: mvs(22), alignItems: 'center', justifyContent: 'center'
        }}>
          <View style={{ height: mvs(20), width: mvs(20), borderRadius: mvs(10), backgroundColor: locationService ? colors.primary : colors.label }} />
        </TouchableOpacity>
        <View style={styles.barContainer}>
          <View style={{ width: '100%', }}>
            <View style={{ alignItems: 'center', }}>
              <View style={{position:'absolute'}}>
              <GoogleSearchBar
                countrySlug={isLocalOrder ? profileData?.country?.slug : null}
                style={{ width: mvs(258), flex: 0, paddingHorizontal: mvs(10) }}
                cross
                textInputContainer={{ backgroundColor: colors.secondary, borderRadius: 10, }}
                {...props}
                placeholder="Enter an address"

                inputStyle={{ color: colors.typeHeader, paddingRight: 0 }}
                onClick={() =>{
                  }}
                onPress={(data, details = null) => {
                  const obj =
                  {
                    latitude: details?.geometry?.location?.lat,
                    latitudeDelta: 0.015,
                    longitude: details?.geometry?.location?.lng,
                    longitudeDelta: 0.0121,
                  };
                  onSearchChange(obj);
                }}
              />
              </View>
            </View>
            <TouchableOpacity
              style={{ width: '10%', top: mvs(10), position: 'absolute' }}
              onPress={() => {
                props?.navigation.goBack();
              }}>
              <Back height={mvs(16)} width={mvs(16)} />
            </TouchableOpacity>
            <TouchableOpacity
              hitSlop={colors.hitSlop}
              onPress={() =>{
                props.navigation.pop(2)
                props?.navigation?.navigate(isLocalOrder ? 'localtrip' : 'internationaltrip', { isFilter: true, isOnline, is_Map_screen: true,isLocalOrder })
              }}
              style={{ width: '10%', alignItems: 'flex-end', right: 0, top: mvs(12), position: 'absolute' }}
            >
              <Filter />
            </TouchableOpacity>
            <View />
          </View>
        </View>
      </View>
      {!isKeyboardVisible && <MapSearchOrderRadiusModal
        setActiveItem={(item) => {
          if (item?.shop_location) {
            // if(loading){
            //   return;
            // }
            setActiveItem(item);
              ref?.current?.animateToRegion({ ...item?.shop_location, latitudeDelta: 0.045, longitudeDelta: 0.0451, })
          }
        }}
        flatListRef={flatListRef}
        loading={loading}
        orders={filter_Orders?.data}
        visible={true}
        value={radius}
        onSlider={(val) => { }}
        onValueChange={val => setRadius(parseInt(val))}

        onClose={() => props.navigation.goBack()}
        {...props}
        isLocalOrder={isLocalOrder}
      />}

      <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'} inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
    </View>
  );
};

export const mapStateToProps = state => ({
  filter_Orders: state.common_orders_list?.filter_Orders,
  internationalFilter: state.common.internationalFilter,
  localFilter: state.common.localFilter,
  profileData: state.auth.userInfo?.profile,
});

export const mapDispatchToProps = dispatch => ({
  filterPostedLocalOrdersList: (payload, isLocalOrder, limit = 2000) => dispatch(TAKE_TO_ACTIONS.filterPostedLocalOrdersList(payload, isLocalOrder, limit)),
  setOrResetLocalFilter: (payload, bool) => dispatch(TAKE_TO_ACTIONS.setOrResetLocalFilter(payload, bool)),
  setOrResetInternationalFilter: (payload, bool) =>
    dispatch(TAKE_TO_ACTIONS.setOrResetInternationalFilter(payload, bool)),
  // createOrFilterTrip: (filterPayload, isLocalOrder, page) => TAKE_TO_ACTIONS.createOrFilterTrip(filterPayload, isLocalOrder, page),
});
export default connect(mapStateToProps, mapDispatchToProps)(SearchMap);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  BUTTON: {
    // height:mvs(38)
    // position: 'absolute',
    // bottom:mvs(10),
  },
  BUTTON_CONTAINER: {
    // marginTop: mvs(30),
    position: 'absolute',
    bottom: mvs(0),
    paddingBottom: mvs(10),
    width: '100%',
    paddingHorizontal: mvs(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barContainer: {
    width: '100%',
    paddingHorizontal: mvs(22),
    position: 'absolute',
    paddingTop: mvs(13),
    paddingBottom: mvs(23),
    height:mvs(74),
    borderBottomRightRadius: mvs(20),
    borderBottomLeftRadius: mvs(20),
    // top:45,
    backgroundColor: colors.white,
    // height:mvs(70),
    // top: mvs(45),
  },
  image: {
    height: mvs(28),
    width: mvs(28),
    borderRadius: mvs(8),
    overflow: 'hidden',
  },
  callout: {
    height: mvs(49.39),
    alignSelf: 'center',
  },
  calloutInner: {
    height: mvs(44.26),
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: mvs(8),
    flexDirection: 'row',
    paddingHorizontal: mvs(5),
    alignItems: 'center',
  },
  calloutMiddleContainer: {
    marginLeft: mvs(5),
  },
  label: {
    fontSize: mvs(9),
    color: colors.title,
  },
  status: {
    fontSize: mvs(9),
    color: colors.pink,
    marginTop: mvs(8),
  },
  calloutEndContainer: {
    marginLeft: mvs(14),
    borderWidth: 1,
  },
  value: {
    fontSize: mvs(9),
    color: colors.green,
    marginLeft: mvs(14),
  },
  marker: {
    height: mvs(28),
    width: mvs(22),
  },
});
