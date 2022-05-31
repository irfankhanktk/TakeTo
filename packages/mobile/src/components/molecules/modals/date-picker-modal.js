import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Medium from '../../../presentation/typography/medium-text';
import Regular from '../../../presentation/typography/regular-text';
import Buttons from '../../atoms/Button';
import { TAKE_TO_INPUT_FIELD } from '../../atoms';
import CustomRadio from '../../atoms/RadioButton';
import Back from '../../../../resource/assets/common-icons/back-white.svg';
import Calendar from '../calendar/calendar';
const DatePickerModal = ({ visible, onClose, onApply, navigation }) => {
  const [dayMonthYear, setDayMonthYear] = React.useState({
    day: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
});
  const [payload, setPayload] = React.useState({
    isThirtyDays: true,
    isNinetyDays: false,
    isThreeWeeks: false,
    isTwoWeeks: false,
    isUrgent: false,
    isNoDelivery: true,
    maxPrice: '100',
    minPrice: '1000',
  });
  return (
    <ReactNativeModal
      propagateSwipe
      isVisible={visible}
      avoidKeyboard
      onBackdropPress={() => onClose()}
      onBackButtonPress={() => onClose()}
      style={{ margin: 0, padding: 0 }}>
      <View style={styles.CONTAINER}>
        {/* <View style={{ alignItems: 'center', paddingHorizontal: mvs(22) }}>
          <Medium label={'Departure Date'} style={styles.HEADING_TXT} />
        </View> */}
        <View style={{...styles.SUB_CONTAINER, paddingBottom : Platform.OS == 'ios' ? mvs(30) : mvs(17)}}>
          <Calendar 
          unselectedYearColor={colors.white} 
          unselectedMonthColor={colors.white}  
          dayMonthYear={dayMonthYear} 
          setDayMonthYear={(dmy)=>{setDayMonthYear(dmy)}} 
          />
          <View style={styles.BUTTON_CONTAINER}>
            <Buttons.ButtonPrimary
              onClick={()=>onApply(dayMonthYear)}
              style={{...styles.BUTTON,width:'49%'}}
              title={'Apply'}
            />
            <Buttons.ButtonSecondaryOutline
              onClick={() => onClose()}
              style={{ ...styles.BUTTON,width:'49%' }}
              title={'Cancel'}
            />
          </View>
        </View>
      </View>
    </ReactNativeModal>
  );
};
export default DatePickerModal;
const styles = StyleSheet.create({
  CONTAINER: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: mvs(20),
    borderTopRightRadius: mvs(20),
    backgroundColor: colors.primary,
  },
  HEADING_TXT: {
    fontSize: mvs(15),
    color: colors.white,
    alignSelf: 'center',
    marginTop: mvs(13),
    marginBottom: mvs(16),
  },
  SUB_CONTAINER: {
    backgroundColor: colors.white,
    paddingVertical: mvs(15),
    paddingHorizontal: mvs(22),
    borderTopLeftRadius: mvs(20),
    borderTopRightRadius: mvs(20),
  },
  DESTINATION_CONTAINER: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  FLAG_BUTTON: {
    width: mvs(161),
    height: mvs(38),
    flexDirection: 'row-reverse',
    backgroundColor: colors.secondary,
  },
  SEARCH_MAP: {
    marginTop: mvs(15),
    alignSelf: 'flex-end',
    width: mvs(161),
    height: mvs(38),
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingHorizontal: mvs(23),
  },
  MAP_ICON: {
    height: mvs(18),
    width: mvs(14),
  },
  NO_DELIVERY_CONTAINER: {
    // borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: mvs(14),
    borderColor: colors.filter_divider,
  },
  NoDelivery: {
    fontSize: mvs(15),
    color: colors.headerTitle,
  },
  PRICES_CONTAINER: {
    marginTop: mvs(13),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  PRICE_HEADING: {
    fontSize: mvs(15),
    color: colors.primary,
    marginBottom: mvs(10),
  },
  MAX_MIN_PRICE: {
    width: mvs(161),
  },
  DIV: {
    marginTop: mvs(15),
    marginBottom: mvs(13),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.filter_divider,
  },
  DEL_TIME: {
    color: colors.primary,
    fontSize: mvs(15),
    marginBottom: mvs(8),
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
  BACK: { position: 'absolute', left: mvs(23), top: mvs(17) },
});
