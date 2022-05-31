import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import moment from 'moment';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Buttons from '../../components/atoms/Button';
import CustomRadio from '../../components/atoms/RadioButton';
import Calendar from '../../components/molecules/calendar/calendar';
import DateTimePicker from '../../components/molecules/destination-card/date-picker';
import Header from '../../components/molecules/header/header-1x';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { mvs } from '../../config/metrices';
import Medium from '../../presentation/typography/medium-text';
import Regular from '../../presentation/typography/regular-text';
import InternationalDelivery from '../international-delivery/international-delivery';
import SVGS from '../../../resource/assets/rtl-button-icons';
import OrderDestination from '../../components/atoms/OrderDestination';
import Aeroplane from './../../../resource/assets/order-car-icons/aeroplane.svg';
import AeroplaneWhite from './../../../resource/assets/order-car-icons/aeroplane-white.svg';
import Car from './../../../resource/assets/order-car-icons/car.svg';
import CarWhite from './../../../resource/assets/order-car-icons/car-white.svg';
// import Location from './../../../resource/assets/order-car-icons/location.svg';
import Location from './../../../resource/assets/order-car-icons/location-active.svg';
import LocationWhite from './../../../resource/assets/order-car-icons/location-white.svg';
import DatePickerModal from '../../components/molecules/modals/date-picker-modal';
const CountryFlag = ({ iconName = 'flag', country = 'Kuwait', labelStyle }) => {
  const Icon = SVGS[iconName];

  return (
    <View style={{ flexDirection: 'row' }}>
      <Icon height={mvs(18)} width={mvs(18)} />
      <Regular
        label={`  ${country}`}
        style={{ color: colors.white, ...labelStyle }}
      />
    </View>
  );
};
const LocDestination = ({
  local = false,
  style,
  labelStyle,
  isActive = true,
  isReverse = false,
  fromCountry='Lebanon',
  toCountry='Kuwait',
  onPress,
}) => (
  <TouchableOpacity 
  onPress = {onPress}
  style={{ ...styles.LOC_DES, ...style }}>
    <CountryFlag labelStyle={labelStyle} country={fromCountry}/>
    <View style={{ width: '40%', alignContent: 'center' }}>
      <OrderDestination
        liveActive={isActive}
        isReverse={isReverse}
        value={0}
        label=" - - - - - - - - - - - - - "
        SVGFirst={Aeroplane}
        SVGSecond={!isActive ? LocationWhite : Location}
        isDeliver={true}
      />
    </View>
    <CountryFlag labelStyle={labelStyle} country={toCountry}/>
  </TouchableOpacity>
);

const CountryFlagWIthPlane = ({fromCountry,toCountry,navigation}) => (
  <View style={{ marginTop: mvs(10), backgroundColor: colors.white,paddingHorizontal:mvs(22), paddingVertical: mvs(15), borderRadius: mvs(20) }}>
    <View activeOpacity={0.5}>
      <LocDestination
        fromCountry={fromCountry}
        toCountry={toCountry}
        local={false}
        labelStyle={{
          color: colors.primary
        }}
        style={{
          ...styles.REVERSE_LOC_DES,
          backgroundColor: colors.white,
        }}
      />
    </View>
    <Buttons.ButtonRTL
      onClick={() => {
        navigation.navigate('searchmap');
      }}
      iconName={'maptransparent'}
      title={'Search on map'}
      style={styles.SEARCH_MAP}
      textStyle={{ color: colors.white, fontSize: mvs(12) }}
      iconStyle={styles.MAP_ICON}
    />
  </View>
);
const AddTrip = props => {
  const [dateOption, setDateOption] = React.useState('');
  const [deliveryDestination, setDeliveryDestination] = React.useState({
    from: true,
    to: false,
  });
  const [payload, setPayload] = React.useState({
    isOneWay: false,
    isRound: true,
    isNinetyDays: false,
    isTwoWeeks: false,
    isUrgent: true,
    isNoDelivery: true,
    maxPrice: '100',
    minPrice: '1000',
    date: '',
    departure: '',
    returning: '',
  });
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [dayMonthYear, setDayMonthYear] = React.useState({
    day: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  })
  const [deliveryButton, setDeliveryButton] = React.useState({
    internationalDelivery: true,
    localDelivery: false,
  });
  const InternationButton = deliveryButton.internationalDelivery
    ? Buttons.ButtonPrimary
    : Buttons.ButtonSecondaryOutline;
  const LocalButtonButton = deliveryButton.localDelivery
    ? Buttons.ButtonPrimary
    : Buttons.ButtonSecondaryOutline;

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const showDatePicker = (option) => {
    setDateOption(option);
    setDatePickerVisibility(true);
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <Header {...props} title="Deliver" allowBackBtn />
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ backgroundColor: colors.secondary, paddingBottom: mvs(20), flexGrow: 1 }}>
          <View style={styles.SUB_CONTAINER}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: mvs(2),
                marginBottom: mvs(18),
              }}>
              <InternationButton
                onClick={() =>
                  setDeliveryButton({
                    internationalDelivery: true,
                    localDelivery: false,
                  })
                }
                title={'International'}
                style={{
                  width: '49%',
                  height: mvs(44),
                  borderColor: colors.primary,
                }}
                textStyle={{
                  color: deliveryButton.internationalDelivery
                    ? colors.white
                    : colors.primary,
                }}
              />
              <LocalButtonButton
                onClick={() =>
                  setDeliveryButton({
                    internationalDelivery: false,
                    localDelivery: true,
                  })
                }
                title={'Local'}
                style={{
                  width: '49%',
                  height: mvs(44),
                  borderColor: colors.primary,
                }}
                textStyle={{
                  color: deliveryButton.internationalDelivery
                    ? colors.primary
                    : colors.white,
                }}
              />
            </View>
            {deliveryButton.internationalDelivery ?
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <CustomRadio
                    style={styles.TRIP_TYPE_RADIO}
                    status={payload.isRound}
                    label={'Round Trip'}
                    labelStyle={{ color: payload.isRound ? colors.primary : colors.typeHeader }}
                    onChange={value => setPayload({ ...payload, isOneWay: !value, isRound: value })}
                  />
                  <CustomRadio
                    style={styles.TRIP_TYPE_RADIO}
                    status={payload.isOneWay}
                    label={'One Way'}
                    labelStyle={{ color: payload.isOneWay ? colors.primary : colors.typeHeader }}
                    onChange={value => setPayload({ ...payload, isOneWay: value, isRound: !value })}
                  />
                </View>
                <View style={{ ...styles.DESTINATION_CONTAINER, }}>
                  <Buttons.ButtonRTL
                    disabled = {payload.isOneWay}
                    onClick={() => showDatePicker('date')}
                    iconName={'date'}
                    title={payload.date || 'Departure'}
                    style={styles.FLAG_BUTTON}
                    iconStyle={styles.RTL_ICON}
                    textStyle={{ color: colors.lightgrey2 }}
                  />
                  <Buttons.ButtonRTL
                    disabled = {payload.isRound}
                    onClick={() => showDatePicker('departure')}
                    iconName={'date'}
                    title={payload.departure || 'Departure'}
                    style={styles.FLAG_BUTTON}
                    iconStyle={styles.RTL_ICON}
                    textStyle={{ color: colors.lightgrey2 }}
                  />
                </View>
                <View
                  style={{
                    ...styles.DESTINATION_CONTAINER,
                    justifyContent: 'flex-start',
                  }}>
                  <Buttons.ButtonRTL
                    disabled = {payload.isOneWay}
                    onClick={() => showDatePicker('returning')}
                    iconName={'date'}
                    title={payload.returning || 'Returning'}
                    style={styles.FLAG_BUTTON}
                    iconStyle={styles.RTL_ICON}
                    textStyle={{ color: colors.lightgrey2 }}
                  />

                </View>
                <>
                  <View style={{ ...styles.DIV, }} />
                  <View style={{
                    flexDirection: 'row', justifyContent: 'space-between',
                  }}>
                    <View style={{ ...styles.DESTINATION_CONTAINER, marginTop: 0,width:'49%', flexDirection: 'column', }}>
                      <Regular
                        label={'Location'}
                        style={{ fontSize: mvs(15), marginBottom: mvs(9), color: colors.typeHeader, alignSelf: 'flex-start' }}
                      />
                      <Buttons.ButtonRTL
                        onClick={() => { }}
                        iconName={'flag'}
                        title={'Kuwait'}
                        textStyle={{ color: colors.primary }}
                        style={{ ...styles.FLAG_BUTTON,width:'100%', alignSelf: 'flex-start' }}
                        iconStyle={{
                          height: mvs(23),
                          width: mvs(23),
                        }}
                      />
                    </View>
                    <View style={{ ...styles.DESTINATION_CONTAINER,width:'49%', marginTop: 0, flexDirection: 'column', }}>
                      <Regular
                        label={'Destination'}
                        style={{ fontSize: mvs(15), marginBottom: mvs(9), color: colors.typeHeader, alignSelf: deliveryButton.internationalDelivery ? 'flex-start' : 'flex-start' }}
                      />
                      <Buttons.ButtonRTL
                        onClick={() => { }}
                        iconName={'flag'}
                        title={'Lebanon'}
                        textStyle={{ color: colors.primary }}
                        style={{ ...styles.FLAG_BUTTON,width:'100%', alignSelf: 'flex-start' }}
                        iconStyle={{
                          height: mvs(23),
                          width: mvs(23),
                        }}
                      />
                    </View>
                  </View>

                </>

              </> :
              <>
                <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                  <View style={{ ...styles.DESTINATION_CONTAINER, marginTop: 0,marginBottom:mvs(9), flexDirection: 'row', }}>
                    <Regular
                      label={'Location'}
                      style={{ fontSize: mvs(15), color: colors.typeHeader, alignSelf: 'center' }}
                    />
                    <Buttons.ButtonRTL
                      onClick={() => { }}
                      iconName={'flag'}
                      title={'Kuwait'}
                      textStyle={{ color: colors.primary }}
                      style={{ ...styles.FLAG_BUTTON, alignSelf: 'flex-start' }}
                      iconStyle={{
                        height: mvs(23),
                        width: mvs(23),
                      }}
                    />
                  </View>
                  <View style={{ ...styles.DESTINATION_CONTAINER, marginTop: 0,marginBottom:mvs(0), flexDirection: 'row', }}>
                    <Regular
                      label={'Destination'}
                      style={{ fontSize: mvs(15), color: colors.typeHeader, alignSelf: 'center' }}
                    />
                    <Buttons.ButtonRTL
                      onClick={() => { }}
                      iconName={'flag'}
                      title={'Shuwaikh'}
                      textStyle={{ color: colors.primary }}
                      style={{ ...styles.FLAG_BUTTON, alignSelf: 'flex-start' }}
                      iconStyle={{
                        height: mvs(23),
                        width: mvs(23),
                      }}
                    />
                  </View>
                </View>
                <Buttons.ButtonRTL
                  onClick={() => {
                    props.navigation.navigate('searchmap');
                  }}
                  iconName={'maptransparent'}
                  title={'Search on map'}
                  style={styles.SEARCH_MAP}
                  textStyle={{ color: colors.white, fontSize: mvs(12) }}
                  iconStyle={styles.MAP_ICON}
                />
              </>
            }

          </View>
          { deliveryButton.internationalDelivery &&<>
            <CountryFlagWIthPlane fromCountry={'Lebanon'} toCountry={'Kuwait'} navigation={props?.navigation}/>
            <CountryFlagWIthPlane fromCountry={'Kuwait'} toCountry={'Lebanon'} navigation={props?.navigation}/>
          </>}
          {/* {deliveryButton.internationalDelivery &&
           <Calendar style={{ paddingHorizontal: mvs(22) }} dayMonthYear={dayMonthYear} setDayMonthYear={setDayMonthYear} />} */}
          <Buttons.ButtonPrimary
            onClick={() =>
              props.navigation.navigate('internationaldelivery', {
                isLocalOrder: deliveryButton.localDelivery,
              })
            }
            title={'Search'}
            style={{ marginTop: deliveryButton.internationalDelivery ? mvs(47) : mvs(403.5), width: '90%', alignSelf: 'center' }}
          />
        </ScrollView>
      </View >

      {/* <DateTimePicker
        isVisible={isDatePickerVisible}
        onCancel={hideDatePicker}
        mode="date"
        maximumDate={new Date()}
        isDarkModeEnabled={false}
        // backdropStyleIOS={colors.black}
        onConfirm={date => {
          setPayload({ ...payload, [dateOption]: moment(date).format('MM / DD / YYYY') });
          setDatePickerVisibility(false);
        }}
      /> */}
      <DatePickerModal onChangeDMY={date => {
          setPayload({ ...payload, [dateOption]:`${(date?.month*1+1)} / ${date?.day} / ${date.year}`});
          setDatePickerVisibility(false);
        }}  onClose={hideDatePicker} visible={isDatePickerVisible}/>
    </View >
  );
};

export default AddTrip;
const styles = StyleSheet.create({
  SUB_CONTAINER: {
    paddingHorizontal: mvs(22),
    borderBottomStartRadius: mvs(20),
    borderBottomEndRadius: mvs(20),
    paddingBottom: mvs(15),
    backgroundColor: colors.white,
  },
  LOC_DES_CONTAINER: {
    borderBottomStartRadius: mvs(20),
    borderBottomEndRadius: mvs(20),
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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.primary,
  },
  DESTINATION_CONTAINER: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: mvs(10),
  },
  FLAG_BUTTON: {
    width: '49%',
    height: mvs(38),
    flexDirection: 'row-reverse',
    backgroundColor: colors.secondary,
  },
  DIV: {
    marginTop: mvs(15),
    marginBottom: mvs(15),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.price_border,
  },
  RADIO_CONTAINER: {
    marginBottom: mvs(30),
  },
  RADIO_LABEL: {
    color: colors.headerTitle,
    fontSize: mvs(15),
  },
  BUTTON_CONTAINER: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  BUTTON: {
    width: mvs(161),
  },
  TRIP_TYPE_RADIO: {
    width: '49%',
  },
  RTL_ICON: {
    height: mvs(23),
    width: mvs(23),
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
});
