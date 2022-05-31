import services from '@khan_ahmad786/common/api/services';
import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import { useIsFocused } from '@react-navigation/core';
import moment from 'moment';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import DeviceInfo from 'react-native-device-info';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import {
  Online,
  OnlineActive,
  Physical,
  PhysicalActive
} from '../../../resource/assets/common-icons';
import Buttons from '../../components/atoms/Button';
import OrderDestination from '../../components/atoms/OrderDestination';
import ImagePlaceholder from '../../components/atoms/Placeholder';
import Header from '../../components/molecules/header/header-1x';
import SortModal from '../../components/molecules/modals/sort-modal';
import MakeOfferOrderCard from '../../components/molecules/order_card/make-offer-card';
import OrderTypeHeader from '../../components/molecules/order_card/order-type-header';
import colors from '../../config/colors';
import { mvs, width } from '../../config/metrices';
import Regular from '../../presentation/typography/regular-text';
import aeroplane_deactive from './../../../resource/assets/order-car-icons/aeroplane-deactive.svg';
import Aeroplane from './../../../resource/assets/order-car-icons/aeroplane.svg';
import Car from './../../../resource/assets/order-car-icons/car.svg';
import Location from './../../../resource/assets/order-car-icons/location-active.svg';
import location_deactive from './../../../resource/assets/order-car-icons/location-deactive.svg';

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

const CountryFlag = ({ iconName = '', country = 'Kuwait', labelStyle }) => {
  return (
    <View style={{ flexDirection: 'row', width: '28%' }}>
      <ImagePlaceholder
        bg_img={iconName || services.land_mark}
        containerStyle={{ width: mvs(18), height: mvs(18), borderRadius: mvs(9) }}
      />
      <Regular
        numberOfLines={1}
        label={` ${country}`}
        style={{ color: colors.white, ...labelStyle, width: '85%' }}
      />
    </View>
  );
};

const LocDestination = ({
  flags,
  local = false,
  style,
  labelStyle,
  isActive = false,
  isReverse = false,
  country_to = '',
  country_from = '',
}) => (
  <View style={{ ...styles.LOC_DES, ...style }}>
    {country_from ? (
      <CountryFlag
        labelStyle={labelStyle}
        country={country_from}
        iconName={flags?.from}
      />
    ) : (
      <View style={{ width: '28%' }} />
    )}
    <View style={{ width: '40%' }}>
      <OrderDestination
        liveActive={isActive}
        isReverse={isReverse}
        value={0}
        label=" - - - - - - - - - - - - - "
        SVGFirst={
          isActive
            ? local
              ? Car
              : Aeroplane
            : local
              ? Car
              : aeroplane_deactive
        }
        SVGSecond={isActive ? Location : location_deactive}
      />
    </View>
    {country_to ? (
      <CountryFlag
        labelStyle={labelStyle}
        country={country_to}
        iconName={flags?.to}
      />
    ) : (
      <View style={{ width: '28%' }} />
    )}
  </View>
);


const InternationalDelivery = props => {
  let isFocus = useIsFocused();
  const {
    navigation,
    route,
    createOrFilterTrip,
    profileData,
    filter_Orders,
    localFilter,
    internationalFilter,
    setOrResetLocalFilter,
    setOrResetInternationalFilter,
    resetFilterDataState
  } = props;

  const { isLocalOrder, isFilter, radius } = route.params || {};
  const [loading, setLoading] = React.useState(false);
  const [selected, setSelected] = React.useState(false);
  const [sortModal, setSortModal] = React.useState(false);
  const [sortLoading, setSortLoading] = React.useState(false)
  const [deliveryDestination, setDeliveryDestination] = React.useState({
    from: true,
    to: false,
  });
  const [openFilter, setOpenFilter] = React.useState(false);
  const [pageLoading, setPageLoading] = React.useState(false);

  const alertRef = React.useRef();

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
     // setOrResetInternationalFilter({ ...internationalFilter,trip_type:(!isFilter&&internationalFilter.trip_type === 2)?2:1});
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


  const onPagination = async (setLoading, bool) => {
    try {
      !sortLoading && setLoading(true);
      let page = 1;
      if (bool) {

        page = UI_API._returnPage(filter_Orders);

        if (!page) {
          return;
        }
      }

      const res = await readyPayload();
      let obj = UI_API._removeEmptyKeys(res);
      await createOrFilterTrip(obj, isLocalOrder, page);
    } catch (error) {
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    } finally {
      setLoading(false);
      setSortLoading(false);
    }
  };

  React.useEffect(() => {
    // setLoading(true);
    if (sortLoading) {
      onPagination(setSortLoading, true);
    }
  }, [internationalFilter, localFilter]);
  React.useEffect(() => {
    const unsubscribe = props?.navigation.addListener('focus', () => {
      setSelected(props?.route?.params?.isOnline ? false : true);
      setLoading(true);
      onPagination(setLoading, true);
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [profileData?.country]);


  const onSortData = (selected) => {
    setSortModal(false)
    setSortLoading(true)
    resetFilterDataState()
    setTimeout(() => {
      if (isLocalOrder) {
        setOrResetLocalFilter({
          ...localFilter,
          sort_by: selected
        })
      }
      else {
        setOrResetInternationalFilter({
          ...internationalFilter,
          sort_by: selected
        })
      }
    }, 1000)
  }

  // console.log(filter_Orders)


  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Header
          userIcon={false}
          {...props}
          title={`${isLocalOrder ? 'local' : 'International'} Orders`}
          allowBackBtn
          bellIcon
        />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Chase size={mvs(30)} color={colors.primary} />
        </View>
        <DropdownAlert zIndex={5}
          elevation={15}
          translucent
          activeStatusBarStyle={'light-content'}
          inactiveStatusBarBackgroundColor={colors.primary}
          ref={alertRef}
        />
      </View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>

      <View style={{ ...styles.LOC_DES_CONTAINER, ...colors.shadow, marginBottom: mvs(2) }}>
        <Header
          userIcon={false}
          isShadow={false}
          {...props}
          title={`${isLocalOrder ? 'local' : 'International'} Orders`}
          allowBackBtn
          bellIcon
        />
        <View style={{paddingHorizontal:mvs(22)}}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              if (isFilter) {
                navigation.replace(
                  isLocalOrder ? 'localtrip' : 'internationaltrip',
                  { isFilter: true, isOnline: !selected, isLocalOrder: isLocalOrder },
                );
              }
            }}>
            <LocDestination
              flags={
                isLocalOrder
                  ? {
                    from: localFilter?.from_flag,
                    to: localFilter?.to_flag,
                  }
                  : {
                    from: internationalFilter?.from_flag,
                    to: internationalFilter?.to_flag,
                  }
              }
              country_from={
                isLocalOrder
                  ? localFilter?.country_from
                  : internationalFilter?.country_from
              }
              country_to={
                isLocalOrder
                  ? localFilter?.country_to
                  : internationalFilter?.country_to
              }
              local={isLocalOrder}
              isActive={deliveryDestination.from}
              labelStyle={{
                color: deliveryDestination.from ? colors.primary : colors.doted,
              }}
              style={{
                ...styles.REVERSE_LOC_DES,
                borderColor: deliveryDestination.from
                  ? colors.primary
                  : colors.doted,
                // marginTop: mvs(30),
                backgroundColor: colors.white,
              }}
            />
          </TouchableOpacity>
          {(!isLocalOrder &&!isFilter && internationalFilter?.trip_type === 2 )&& (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                if (isFilter) {
                  navigation.replace(
                    isLocalOrder ? 'localtrip' : 'internationaltrip',
                    { isFilter: true, isOnline: !selected, isLocalOrder: isLocalOrder },
                  );
                }
                //setDeliveryDestination({ from: false, to: true })
              }}>
              <LocDestination
                flags={
                  isLocalOrder
                    ? {
                      from: localFilter?.to_flag,
                      to: localFilter?.from_flag,
                    }
                    : {
                      from: internationalFilter?.to_flag,
                      to: internationalFilter?.from_flag,
                    }
                }
                // country_from={filterPayload?.country_from}
                country_to={
                  isLocalOrder
                    ? localFilter?.country_from
                    : internationalFilter?.country_from
                }
                country_from={
                  isLocalOrder
                    ? localFilter?.country_to
                    : internationalFilter?.country_to
                }
                local={isLocalOrder}
                isReverse={false}
                isActive={deliveryDestination.to}
                labelStyle={{
                  color: deliveryDestination.to ? colors.primary : colors.doted,
                }}
                style={{
                  ...styles.REVERSE_LOC_DES,
                  borderColor: deliveryDestination.to
                    ? colors.primary
                    : colors.doted,
                  marginTop: mvs(15),
                  backgroundColor: colors.white,
                }}
              />
            </TouchableOpacity>
          )}
          <Buttons.ButtonRTL
            onClick={async () => {
              const res = await readyPayload();
              navigation.navigate('searchmap', {
                isLocalOrder,
                filterPayload: res,
                isFilter,
                isOnline: !selected,
              });
            }}
            iconName={'maptransparent'}
            title={'Search on map'}
            style={styles.SEARCH_MAP}
            textStyle={{ color: colors.white, fontSize: mvs(12) }}
            iconStyle={styles.MAP_ICON}
          />
        </View>
      </View>
      {/* </Header> */}
      <View style={{ flex: 1, backgroundColor: colors.white, paddingTop: mvs(27), }}>


        <View style={{ paddingHorizontal: mvs(22) }}>
          <OrderTypeHeader
            title={'Search Results'}
            filter
            isIcon
            sortIcon
            onSort={() => setSortModal(true)}
            isLocal={isLocalOrder}
            onPress={() => {

              navigation.replace(
                isLocalOrder ? 'localtrip' : 'internationaltrip',
                { isFilter: true, isOnline: !selected, isLocalOrder: isLocalOrder },
              )
            }
            }
          />
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={() => setSelected(false)}
            style={{
              ...styles.topButton,
              backgroundColor: selected == 0 ? colors.primary : colors.white,
            }}>
            {selected == 0 ? <OnlineActive /> : <Online />}
            <Regular
              label="Online"
              style={{
                color: selected == 0 ? colors.white : colors.primary,
                marginLeft: mvs(11),
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelected(true)}
            style={{
              ...styles.topButton,
              backgroundColor: selected == 1 ? colors.primary : colors.white,
            }}>
            {selected == 1 ? <PhysicalActive /> : <Physical />}
            <Regular
              label="Physical"
              style={{
                color: selected == 1 ? colors.white : colors.primary,
                marginLeft: mvs(11),
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          {!selected &&
            filter_Orders?.data?.filter(x => x?.order_site).length < 1 && (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Regular
                  style={{ color: colors.primary }}
                  label={'No Result Found'}
                />
              </View>
            )}
          {selected &&
            filter_Orders?.data?.filter(x => !x.order_site).length < 1 && (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Regular
                  style={{ color: colors.primary }}
                  label={'No Result Found'}
                />
              </View>
            )}
          <View style={{ flex: 1 }}>
            {sortLoading ?
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Chase size={mvs(30)} color={colors.primary} />
              </View>
              :
              <FlatList
                contentContainerStyle={styles.SCROLL_CONTAINER}
                data={
                  // filter_Orders?.data
                  filter_Orders?.data?.filter(x => {
                    if (selected == 1) {
                      return !x.order_site;
                    } else {
                      return x.order_site;
                    }
                  })
                }
                renderItem={({ item, index }) => (
                  <MakeOfferOrderCard
                    {...item}
                    // local={isLocalOrder}
                    {...props}
                    order_data={item}
                    local={!item?.is_international}
                    urgent_delivery={item?.is_urgent}
                    time={item.order_created_at}
                    title={`${item.order_title}`}
                    website={`${item.order_site}`}
                    shopName={item?.order_shop_name} //?.length > 8 ? `${item?.order_shop_name?.substring(0, 8)} ...` : item?.order_shop_name}
                    price={item.order_price}
                    store_img={item.order_image}
                    reward={item.order_reward_price}
                    user_name={item.order_by ? item.order_by.user_name : ''}
                    user_img={item.order_by ? item.order_by.user_image : ''}
                    order_from={item.order_from}
                    order_to={item.order_to}
                    order_from_flag={item.order_from_flag}
                    order_to_flag={item.order_to_flag}
                    style={{
                      width: width - mvs(22) * 2,
                      marginBottom: mvs(20),
                    }}
                    onPress={() => props.navigation.navigate('orderdetails')}
                  />
                )}
                keyExtractor={(item, index) => index + ''}
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                  if (!pageLoading && !loading)
                    onPagination(setPageLoading);
                }}
              />}
          </View>

          {pageLoading && (
            <View style={styles.pageLoader}>
              <Chase size={mvs(20)} color={colors.primary} />
            </View>
          )}
        </View>
      </View>
      <DropdownAlert zIndex={5}
        elevation={15}
        translucent
        activeStatusBarStyle={'light-content'}
        inactiveStatusBarBackgroundColor={colors.primary}
        ref={alertRef}
      />
      <SortModal
        visible={sortModal}
        onApply={onSortData}
        onClose={() => setSortModal(false)}
      />
    </View>
  );
};
export const mapStateToProps = state => ({
  filter_Orders: state.common_orders_list?.filter_Orders,
  profileData: state.auth.userInfo?.profile || {},
  internationalFilter: state.common.internationalFilter,
  localFilter: state.common.localFilter,
});

export const mapDispatchToProps = dispatch => ({
  resetFilterDataState: () => dispatch({
    type: "FILTER_ORDERS",
    payload: {},
  }),
  createOrFilterTrip: (filterPayload, isLocalOrder, page) =>
    dispatch(TAKE_TO_ACTIONS.createOrFilterTrip(filterPayload, isLocalOrder, page)),
  setOrResetLocalFilter: (payload, bool) => dispatch(TAKE_TO_ACTIONS.setOrResetLocalFilter(payload, bool)),
  setOrResetInternationalFilter: (payload, bool) => dispatch(TAKE_TO_ACTIONS.setOrResetInternationalFilter(payload, bool)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InternationalDelivery);

const styles = StyleSheet.create({
  SCROLL_CONTAINER: {
    paddingBottom: mvs(22),
    paddingHorizontal: mvs(22),
    flexGrow: 1,
  },
  LOC_DES: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: mvs(13),
    paddingVertical: mvs(12),
    borderRadius: mvs(13),
    backgroundColor: colors.primary,
  },
  REVERSE_LOC_DES: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  LOC_DES_CONTAINER: {
    backgroundColor: colors.white,

    paddingBottom: mvs(20),
    borderBottomStartRadius: mvs(20),
    borderBottomEndRadius: mvs(20),
  },
  SEARCH_MAP: {
    marginTop: mvs(15),
    alignSelf: 'flex-end',
    width: '49%',
    height: mvs(38),
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingHorizontal: mvs(23),
  },
  MAP_ICON: {
    height: mvs(18),
    width: mvs(14),
  },
  buttonsContainer: {
    //height: mvs(44),
    paddingHorizontal: mvs(22),
    width: '100%',
    //borderWidth : 1,
    // marginTop: mvs(30),
    marginBottom: mvs(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: mvs(20),
  },
  topButton: {
    height: mvs(44),
    width: '48%',
    borderWidth: 1,
    borderRadius: mvs(10),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: colors.primary,
  },
  pageLoader: {
    height: mvs(50),
    width: mvs(50),
    borderRadius: mvs(25),
    position: 'absolute',
    bottom: mvs(20),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
