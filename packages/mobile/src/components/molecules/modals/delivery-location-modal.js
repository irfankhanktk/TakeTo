import React from 'react';
import {View, StyleSheet} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import colors from '../../../config/colors';
import {mvs} from '../../../config/metrices';
import Medium from '../../../presentation/typography/medium-text';
import Buttons from '../../atoms/Button';

const DeliveryLocationModal = ({
  visible,
  onClose,
  onCancel,
  selectedLocation = 'Home Salmiya',
  onChangeSelection,
  list=[],
}) => {
    
  return (
    <ReactNativeModal
      propagateSwipe
      avoidKeyboard
      isVisible={visible}
    //   onBackdropPress={() => onClose(f => !f)}
    //   onBackButtonPress={() => onClose(f => !f)}
      style={{margin: 0, padding: 0}}>
      <View style={styles.CONTAINER}>
        <View style={{alignItems: 'center', paddingHorizontal: mvs(22)}}>
          <Medium
            label={'Choose delivery location'}
            style={styles.HEADING_TXT}
          />
        </View>
        <View style={styles.SUB_CONTAINER}>
          {list.map((ele, key) => (
            <View key={key}>
              <Buttons.ButtonDeliveryLocation
                onClick={() => {
                    onChangeSelection(ele,key);
                }}
                iconName={ele?.iconName?ele?.iconName:'any'}
                title={ele.title}
                subTitle={ele.subTitle}
                isTick={ele.isSelected}
              />
              {key !== list?.length - 1 && <View style={styles.DIV} />}
            </View>
          ))}
          <View style={styles.BUTTON_CONTAINER}>
            <Buttons.ButtonPrimary
              onClick={onClose}
              style={styles.BUTTON}
              title={'Apply'}
            />
            <Buttons.ButtonSecondayLight
              onClick={onCancel}
              style={{...styles.BUTTON}}
              title={'Cancel'}
            />
          </View>
        </View>
      </View>
    </ReactNativeModal>
  );
};
export default DeliveryLocationModal;
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
    paddingTop: mvs(20),
    paddingBottom: mvs(38),
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
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: mvs(14),
    marginTop: mvs(15),
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
    marginTop: mvs(14),
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
    marginTop: mvs(29),
  },
  BUTTON: {
    width: mvs(161),
  },
  BACK: {position: 'absolute', left: mvs(23), top: mvs(17)},
});
