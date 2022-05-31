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
const DeliveryFilterModal = ({ visible, onClose, onApply, navigation }) => {
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
        <View style={{ alignItems: 'center', paddingHorizontal: mvs(22) }}>
          <Medium label={'Filters'} style={styles.HEADING_TXT} />
        </View>
        <View style={styles.SUB_CONTAINER}>
          <View style={styles.NO_DELIVERY_CONTAINER}>
            <CustomRadio
              style={{ marginTop: mvs(8) }}
              status={payload.isNoDelivery}
              label={'No delivery offers'}
              labelStyle = {{color : "#54585D"}}
              onChange={value => setPayload({ ...payload, isNoDelivery: value })}
            />
          </View>
          <View style={styles.PRICES_CONTAINER}>
            <View style={styles.MAX_MIN_PRICE}>
              <Regular
                style={styles.PRICE_HEADING}
                label={'Max Product Price'}
              />
              <TAKE_TO_INPUT_FIELD.PriceInput
               style={{ color: colors.typeHeader }}
                value={payload.maxPrice}
                onChangeText={t => setPayload({ ...payload, maxPrice: t })}
              />
            </View>
            <View style={styles.MAX_MIN_PRICE}>
              <Regular
                style={{ ...styles.PRICE_HEADING, color: colors.primary }}
                label={'Min Reward'}
              />
              <TAKE_TO_INPUT_FIELD.PriceInput
                style={{ color: colors.typeHeader }}
                value={payload.minPrice}
                onChangeText={t => setPayload({ ...payload, minPrice: t })}
              />
            </View>
          </View>
          <View style={styles.DIV} />
          <Regular label={'Delivery time'} style={styles.DEL_TIME} />
          <View style={styles.RADIO_CONTAINER}>
            <View style={{ flexDirection: 'row' }}>
              <CustomRadio
                labelStyle={{color:payload.isThirtyDays?colors.primary:colors.typeHeader}}
                status={payload.isThirtyDays}

                label={'Up to 30 days'}
                onChange={value =>
                  setPayload({
                    ...payload,
                    isThreeWeeks: !value,
                    isNinetyDays: !value,
                    isThirtyDays: value,
                    isTwoWeeks: !value,
                    isUrgent: !value,
                  })
                }
              />
              <CustomRadio
                labelStyle={{color:payload.isThreeWeeks?colors.primary:colors.typeHeader}}
                style={{ marginLeft: mvs(45) }}
                status={payload.isThreeWeeks}
                label={'Up to 3 weeks'}
                onChange={value =>
                  setPayload({
                    ...payload,
                    isThreeWeeks: value,
                    isNinetyDays: !value,
                    isThirtyDays: !value,
                    isTwoWeeks: !value,
                    isUrgent: !value,
                  })
                }
              />
            </View>
            <View style={{ flexDirection: 'row', marginTop: mvs(8) }}>
              <CustomRadio
                labelStyle={{color:payload.isTwoWeeks?colors.primary:colors.typeHeader}}
                status={payload.isTwoWeeks}
                label={'Up to 2 weeks'}
                onChange={value =>
                  setPayload({
                    ...payload,
                    isTwoWeeks: value,
                    isThreeWeeks: !value,
                    isThirtyDays: !value,
                    isNinetyDays: !value,
                    isUrgent: !value,
                  })
                }
              />
              <CustomRadio
                labelStyle={{color:payload.isNinetyDays?colors.primary:colors.typeHeader}}
                style={{ marginLeft: mvs(45) }}
                status={payload.isNinetyDays}
                label={'Up to 90 days'}
                onChange={value =>
                  setPayload({
                    ...payload,
                    isTwoWeeks: !value,
                    isThreeWeeks: !value,
                    isThirtyDays: !value,
                    isNinetyDays: value,
                    isUrgent: !value,
                  })
                }
              />
            </View>
            <CustomRadio
              subLabel={' (Higher rewards)'}
              labelStyle={{ color: colors.pink }}
              style={{ marginTop: mvs(8) }}
              status={payload.isUrgent}
              label={'Urgent Deliveries'}
              onChange={value => setPayload({
                ...payload,
                isTwoWeeks: !value,
                isThreeWeeks: !value,
                isThirtyDays: !value,
                isNinetyDays: !value,
                isUrgent: value,
              })}
            />
          </View>
          <View style={styles.BUTTON_CONTAINER}>
            <Buttons.ButtonPrimary
              onClick={onApply}
              style={styles.BUTTON}
              title={'Apply'}
            />
            <Buttons.ButtonSecondayLight
              onClick={() => onClose()}
              style={{ ...styles.BUTTON }}
              title={'Cancel'}
            />
          </View>
        </View>
      </View>
    </ReactNativeModal>
  );
};
export default DeliveryFilterModal;
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
    paddingVertical: mvs(18),
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
