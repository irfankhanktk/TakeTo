import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import DropdownAlert from 'react-native-dropdownalert';
import Slider from 'react-native-slider';
import { connect } from 'react-redux';
import { TAKE_TO_INPUT_FIELD } from '../../../components/atoms';
import Buttons from '../../../components/atoms/Button';
import CustomRadio from '../../../components/atoms/RadioButton';
import CustomSwitch from '../../../components/atoms/Switch';
import Header from '../../../components/molecules/header/header-1x';
import DatePickerModal from '../../../components/molecules/modals/date-picker-modal';
import SearchLocationModal from '../../../components/molecules/modals/search-location-modal/searchlocation-modal';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';
import { styles } from './styles';

const InternationalTrip = props => {
  const {
    route,
    navigation,
    internationalFilter,
    setOrResetInternationalFilter,
    countriesList,
    profileData,
    clearFilterOrders,
  } = props;
  const { isFilter, isOnline, isLocalOrder } = route.params;
  const alertRef = React.useRef();
  console.log('isOnline in international trip',isOnline);
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

  const [dateOption, setDateOption] = React.useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [selected, setSelected] = React.useState(0)
  const hideDatePicker = date => {

    setOrResetInternationalFilter({
      ...internationalFilter,
      [dateOption]: `${date?.day} / ${date?.month + 1} / ${date?.year}`,
    });
    setDatePickerVisibility(false);
  };
  const showDatePicker = option => {

    setDateOption(option);
    setDatePickerVisibility(true);
  };

  const [visible, setVisble] = React.useState(false);
  const [countryModal, setCountryModal] = React.useState(false);

  const [locationOption, setLocationOption] = React.useState('country_from'); //country_from or country_to
  const showCountryMessage = () => {
    alertRef.current.alertWithType(
      'error',
      'Error',
      'From and to country should not match',
    );
  }
  const onSetLocation = addressComponent => {


    if (locationOption === 'country_from') {
      console.log('addressComponent?.country?.toLowerCase()', addressComponent?.country?.toLowerCase());
      console.log('internationalFilter?.country_to?.toLowerCase()', internationalFilter?.country_to?.toLowerCase());
      if (addressComponent?.country?.toLowerCase() === internationalFilter?.country_to?.toLowerCase()) {
        showCountryMessage();
        return
      }
      setOrResetInternationalFilter({
        ...internationalFilter,
        full_address_from: addressComponent?.fulladdress,
        country_from: addressComponent?.country,
        city_from: addressComponent?.city,
        from_country_short_name:
          addressComponent?.country_short_name?.toLowerCase(),
        latitude: addressComponent?.geoCode?.lat,
        longitude: addressComponent?.geoCode?.lng,
        from_flag: UI_API._returnFlag(addressComponent?.country_short_name),
      });
    } else {
      console.log('addressComponent?.country?.toLowerCase()', addressComponent?.country?.toLowerCase());
      console.log('internationalFilter?.country_to?.toLowerCase()', internationalFilter?.country_from?.toLowerCase());
      if (addressComponent?.country?.toLowerCase() === internationalFilter?.country_from?.toLowerCase()) {
        showCountryMessage();
        return
      }
      setOrResetInternationalFilter({
        ...internationalFilter,
        full_address_to: addressComponent?.fulladdress,
        country_to: addressComponent?.country,
        city_to: addressComponent?.city,
        to_country_short_name:
          addressComponent?.country_short_name?.toLowerCase(),
        to_flag: UI_API._returnFlag(addressComponent?.country_short_name),
      });
    }
  };
  const onPicLocDestination = option => {
    setLocationOption(option);
    setVisble(true);
  };

  const onSaveTrip = async () => {
    try {

      if (!internationalFilter?.country_from) {
        throw new Error('Oops! you have forgot to enter from address');
      }
      else
        if (!internationalFilter?.country_to) {
          throw new Error('Oops! you have forgot to enter to address');
        }
      setLoading(true);
      clearFilterOrders();

      setLoading(false);
   
      navigation.replace(props?.route?.params?.is_Map_screen ? 'searchmap' : 'internationaldelivery', {
        isOnline,
        isFilter,
        isLocalOrder: false,
      });
    } catch (error) {
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
      setLoading(false);
    }
  };
  const clear = () => {
    setOrResetInternationalFilter(undefined, false);
  };

  const ifRadio = key => {
    switch (key) {
      case radioLabels.label1Way:
        return internationalFilter.trip_type === 1;
      case radioLabels.label2Way:
        return internationalFilter.trip_type === 2;
      case radioLabels.label30Days:
        return internationalFilter?.delivery_date === radioLabels.label30Days;
      case radioLabels.label3Weeks:
        return internationalFilter?.delivery_date === radioLabels.label3Weeks;
      case radioLabels.label2Weeks:
        return internationalFilter?.delivery_date === radioLabels.label2Weeks;
      case radioLabels.label90Days:
        return internationalFilter?.delivery_date === radioLabels.label90Days;
      case radioLabels.labelUrgent:
        return internationalFilter?.delivery_date === radioLabels.labelUrgent;
      case radioLabels.labelDeliveryBefore:
        return internationalFilter?.delivery_date?.includes('/');
      default:
        return false;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <Header
        {...props}
        title={isFilter ? 'filters' : 'Add Trip'}
        allowBackBtn
        bellIcon
      />

      <View style={{ flex: 1 }}>

        <ScrollView
          keyboardShouldPersistTaps='always'
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: mvs(40),
            paddingHorizontal: mvs(22),
            paddingTop: mvs(27)
          }}>
          {isFilter && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Regular label={'Date'} />
              <Buttons.ButtonRTL
                textStyle={{
                  color: ifRadio(radioLabels.labelDeliveryBefore)
                    ? colors.primary
                    : colors.lightgrey2,
                }}
                onClick={() => {
                  showDatePicker('delivery_date');
                }}
                iconName={ifRadio(radioLabels.labelDeliveryBefore) ? 'date' : 'date'}
                title={
                  ifRadio(radioLabels.labelDeliveryBefore)
                    ? internationalFilter.delivery_date
                    : 'Departure'
                }
                style={{ ...styles.FLAG_BUTTON, width: '75%' }}
                iconStyle={styles.RTL_ICON}
              />
            </View>
          )}




          {!isFilter && (
            <>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <CustomRadio
                  style={styles.TRIP_TYPE_RADIO}
                  status={ifRadio(radioLabels.label1Way)}
                  label={radioLabels.label1Way}
                  onChange={value => {
                    setOrResetInternationalFilter({
                      ...internationalFilter,
                      trip_type: 1,
                    });
                  }}
                />
                <CustomRadio
                  style={styles.TRIP_TYPE_RADIO}
                  status={ifRadio(radioLabels.label2Way)}
                  label={radioLabels.label2Way}
                  onChange={value =>
                    setOrResetInternationalFilter({
                      ...internationalFilter,
                      trip_type: 2,
                    })
                  }
                />
              </View>

              <View
                style={{ ...styles.DESTINATION_CONTAINER, marginTop: mvs(10) }}>
                <Buttons.ButtonRTL
                  textStyle={{
                    color:
                      internationalFilter.departure_date &&
                        ifRadio(radioLabels.label1Way)
                        ? colors.primary
                        : colors.lightgrey2,
                  }}
                  disabled={ifRadio(radioLabels.label2Way)}
                  onClick={() => showDatePicker('departure_date')}
                  iconName={ifRadio(radioLabels.label2Way) ? 'dateGray' : 'date'}
                  title={
                    internationalFilter.departure_date &&
                      ifRadio(radioLabels.label1Way)
                      ? internationalFilter.departure_date
                      : 'Departure'
                  }
                  style={{ ...styles.FLAG_BUTTON, width: '49%' }}
                  iconStyle={styles.RTL_ICON}
                />
                <Buttons.ButtonRTL
                  textStyle={{
                    color:
                      internationalFilter.departure_date &&
                        ifRadio(radioLabels.label2Way)
                        ? colors.primary
                        : colors.lightgrey2,
                  }}
                  disabled={ifRadio(radioLabels.label1Way)}
                  onClick={() => showDatePicker('departure_date')}
                  iconName={ifRadio(radioLabels.label1Way) ? 'dateGray' : 'date'}
                  title={
                    internationalFilter.departure_date &&
                      ifRadio(radioLabels.label2Way)
                      ? internationalFilter.departure_date
                      : 'Departure'
                  }
                  style={{ ...styles.FLAG_BUTTON, width: '49%' }}
                  iconStyle={styles.RTL_ICON}
                />
              </View>
              <View
                style={{
                  ...styles.DESTINATION_CONTAINER,
                  justifyContent: 'flex-end',
                  marginTop: mvs(10),
                }}>
                <Buttons.ButtonRTL
                  textStyle={{
                    color:
                      internationalFilter.returning_date &&
                        ifRadio(radioLabels.label2Way)
                        ? colors.primary
                        : colors.lightgrey2,
                  }}
                  disabled={ifRadio(radioLabels.label1Way)}
                  onClick={() => showDatePicker('returning_date')}
                  iconName={ifRadio(radioLabels.label1Way) ? 'dateGray' : 'date'}
                  title={
                    internationalFilter.returning_date &&
                      ifRadio(radioLabels.label2Way)
                      ? internationalFilter.returning_date
                      : 'Returning'
                  }
                  style={{ ...styles.FLAG_BUTTON, width: '49%' }}
                  iconStyle={styles.RTL_ICON}
                />
              </View>
            </>
          )}

          <View style={{
            marginTop: mvs(15),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1001,
          }}>
            <View style={{ flexDirection: 'row', }}>
              <Regular
                label={'From'}
                style={{
                  fontSize: mvs(15),
                  color: colors.typeHeader,
                }}
              />
              <Regular label={'*'} style={{ color: colors.mendatory, marginTop: -mvs(3) }} />
            </View>
           
            {isOnline?
            <Buttons.ButtonLocation
              iconName={internationalFilter.from_flag}
              textStyle={{ color: internationalFilter.full_address_from ? colors.primary : colors.lightgrey2, textAlign: 'left' }}
              onClick={() => {
                  setCountryModal(true);
              }}
              title={internationalFilter.country_from?.trim() || 'From'}
              style={{ ...styles.FLAG_BUTTON, width: '75%', flexDirection: 'row', }}
              iconStyle={{
                height: mvs(23),
                width: mvs(23),
              }}
            /> :
             <TAKE_TO_INPUT_FIELD.SearchInput
             is_full_address={internationalFilter.full_address_from}
             value={internationalFilter.full_address_from||'From'}
              onChangeText={(addressComponent) => {
              if (addressComponent?.country?.toLowerCase() === internationalFilter?.country_to?.toLowerCase()) {
                showCountryMessage();
                return
              }
              setOrResetInternationalFilter({
                ...internationalFilter,
                full_address_from: addressComponent?.fulladdress,
                country_from: addressComponent?.country,
                city_from: addressComponent?.city,
                from_country_short_name:
                  addressComponent?.country_short_name?.toLowerCase(),
                latitude: addressComponent?.geoCode?.lat,
                longitude: addressComponent?.geoCode?.lng,
                from_flag: UI_API._returnFlag(addressComponent?.country_short_name),
              });
            }}
              slug={''}
              falg={internationalFilter.from_flag} />
          }
          </View>
          <View style={{
            marginTop: mvs(15),
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 5,
          }}>
            <View style={{ flexDirection: 'row', }}>
              <Regular
                label={'To'}
                style={{
                  fontSize: mvs(15),
                  color: colors.typeHeader,
                }}
              />
              <Regular label={'*'} style={{ color: colors.mendatory, marginTop: -mvs(3) }} />
            </View>
            <TAKE_TO_INPUT_FIELD.SearchInput
             is_full_address={internationalFilter.full_address_to}
             value={internationalFilter.full_address_to||'To'}
             onChangeText={(addressComponent) => {
              if (addressComponent?.country?.toLowerCase() === internationalFilter?.country_from?.toLowerCase()) {
                showCountryMessage();
                return
              }
              setOrResetInternationalFilter({
                ...internationalFilter,
                full_address_to: addressComponent?.fulladdress,
                country_to: addressComponent?.country,
                city_to: addressComponent?.city,
                to_country_short_name:
                  addressComponent?.country_short_name?.toLowerCase(),
                to_flag: UI_API._returnFlag(addressComponent?.country_short_name),
              });
            }}
              slug={''}
              falg={internationalFilter.to_flag} />
          </View>
          <CustomSwitch
            textStyle={{ color: colors.typeHeader }}
            label={'No delivery offers'}
            value={internationalFilter.no_delivery}
            onChange={value =>
              setOrResetInternationalFilter({
                ...internationalFilter,
                no_delivery: value,
              })
            }
          />
          <View style={styles.DIV} />
          <Regular label={'Delivery time'} style={styles.DEL_TIME} />

          <View style={styles.RADIO_CONTAINER}>
            <View style={styles.RADIO_ROW}>
              <CustomRadio
                labelStyle={{
                  color: ifRadio(radioLabels.label30Days)
                    ? colors.primary
                    : colors.headerTitle,
                }}
                style={styles.BUTTON}
                status={ifRadio(radioLabels.label30Days)}
                label={radioLabels.label30Days}
                onChange={value =>
                  setOrResetInternationalFilter({
                    ...internationalFilter,
                    delivery_date: radioLabels.label30Days,
                  })
                }
              />
              <CustomRadio
                labelStyle={{
                  color: ifRadio(radioLabels.label3Weeks)
                    ? colors.primary
                    : colors.headerTitle,
                }}
                style={styles.BUTTON}
                status={ifRadio(radioLabels.label3Weeks)}
                label={radioLabels.label3Weeks}
                onChange={value =>
                  setOrResetInternationalFilter({
                    ...internationalFilter,
                    delivery_date: radioLabels.label3Weeks,
                    is_urgent: 0,
                  })
                }
              />
            </View>
            <View style={styles.RADIO_ROW}>
              <CustomRadio
                labelStyle={{
                  color: ifRadio(radioLabels.label2Weeks)
                    ? colors.primary
                    : colors.headerTitle,
                }}
                status={ifRadio(radioLabels.label2Weeks)}
                style={styles.BUTTON}
                label={'Up to 2 weeks'}
                onChange={value =>
                  setOrResetInternationalFilter({
                    ...internationalFilter,
                    delivery_date: radioLabels.label2Weeks,
                    is_urgent: 0,
                  })
                }
              />
              <CustomRadio
                labelStyle={{
                  color: ifRadio(radioLabels.label90Days)
                    ? colors.primary
                    : colors.headerTitle,
                }}
                style={styles.BUTTON}
                status={ifRadio(radioLabels.label90Days)}
                label={radioLabels.label90Days}
                onChange={value =>
                  setOrResetInternationalFilter({
                    ...internationalFilter,
                    delivery_date: radioLabels.label90Days,
                    is_urgent: 0,
                  })
                }
              />
            </View>
            <CustomRadio
              subLabel={' (Higher rewards)'}
              labelStyle={{ color: colors.pink }}
              style={{}}
              status={ifRadio(radioLabels.labelUrgent)}
              label={radioLabels.labelUrgent}
              onChange={value =>
                setOrResetInternationalFilter({
                  ...internationalFilter,
                  delivery_date: radioLabels.labelUrgent,
                  is_urgent: 1,
                })
              }
            />
          </View>
          <View style={styles.PRICES_CONTAINER}>
            <View>
              <Regular
                style={{ alignSelf: 'flex-end', color: colors.primary }}
                label={`${Math.floor(internationalFilter.max_price)} USD`}
              />
              <View style={styles.MAX_MIN_PRICE}>
                <Regular
                  style={styles.PRICE_HEADING}
                  label={'Max Product Price'}
                />
                <Slider
                  value={internationalFilter.max_price}
                  style={{ width: '55%', marginRight: mvs(-15) }}
                  minimumValue={0}
                  maximumValue={2000}
                  thumbStyle={{ height: mvs(15), width: mvs(15) }}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={colors.secondary}
                  thumbTintColor={colors.primary}
                  onValueChange={v => {
                    setOrResetInternationalFilter({
                      ...internationalFilter,
                      max_price: v,
                    });
                  }}
                // onSlidingComplete={v => {

                // }}
                />
              </View>
            </View>
            <View>
              <Regular
                style={{ alignSelf: 'flex-end', color: colors.primary }}
                label={`${Math.floor(internationalFilter.reward)} USD`}
              />
              <View style={styles.MAX_MIN_PRICE}>
                <Regular style={styles.PRICE_HEADING} label={'Min Reward'} />
                <Slider
                  value={internationalFilter.reward}
                  style={{ width: '55%', marginRight: mvs(-15) }}
                  minimumValue={0}
                  maximumValue={1000}
                  thumbStyle={{ height: mvs(15), width: mvs(15) }}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={colors.secondary}
                  thumbTintColor={colors.primary}
                  onValueChange={v => {
                    setOrResetInternationalFilter({
                      ...internationalFilter,
                      reward: v,
                    });
                  }}
                />
              </View>
            </View>
          </View>
          <View style={{ ...styles.BUTTON_CONTAINER }}>
            <Buttons.ButtonPrimary
              loading={loading}
              loaderColor={colors.white}
              disabled={loading}
              onClick={onSaveTrip}
              style={{ ...styles.BUTTON, width: '49%' }}
              title={isFilter ? 'Apply Filters' : 'Add Trip'}
            />
            <Buttons.ButtonSecondaryOutline
              onClick={clear}
              style={{ ...styles.BUTTON, width: '49%' }}
              title={'Clear All'}
            />
          </View>
          <DatePickerModal
            visible={isDatePickerVisible}
            onClose={() => {
              setDatePickerVisibility(false);
            }}
            onApply={hideDatePicker}
          />
        </ScrollView>
        <SearchLocationModal
          setLocation={onSetLocation}
          setVisible={setVisble}
          visible={visible}
        />
      </View>
      {countryModal && (
        <CountryPicker
          visible
          withFilter
          onClose={() => {
            setCountryModal(false);
          }}
          onSelect={item => {
            setCountryModal(false);
            console.log('item?.name?.toLowerCase()', item?.name?.toLowerCase());
            console.log('internationalFilter?.country_from?.toLowerCase()', internationalFilter?.country_from?.toLowerCase());
            if (item?.name?.toLowerCase() === internationalFilter?.country_to?.toLowerCase()) {
              showCountryMessage();
              return
            }
            setOrResetInternationalFilter({
              ...internationalFilter,
              country_from: item?.name,
              full_address_from: item?.name,
              from_flag: countriesList?.find(x => x.name == item?.name)?.flag,
              from_country_short_name: item?.cca2,
            });


          }}
        />
      )}
      <DropdownAlert zIndex={5}  elevation={15} translucent activeStatusBarStyle={'light-content'} inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />

    </View>
  );
};
const mapStateToProps = state => {
  return {
    isGuest: state.auth.isGuest,
    internationalFilter: state.common.internationalFilter,
    countriesList: state.common.countriesList,
    profileData: state.auth.userInfo?.profile || {},
  };
};
const mapDispatchToProps = dispatch => ({
  createOrFilterTrip: internationalFilter =>
    dispatch(TAKE_TO_ACTIONS.createOrFilterTrip(internationalFilter, false)),
  setOrResetInternationalFilter: (payload, bool) =>
    dispatch(TAKE_TO_ACTIONS.setOrResetInternationalFilter(payload, bool)),
  clearFilterOrders: () => dispatch(TAKE_TO_ACTIONS.clearFilterOrders()),
});
export default connect(mapStateToProps, mapDispatchToProps)(InternationalTrip);
