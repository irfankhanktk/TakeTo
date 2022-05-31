import React from 'react';
import {View, StyleSheet, ImageBackground, TouchableOpacity} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import { TAKE_TO_IMAGES } from '../../../../resource/assets/image_resouce';
import colors from '../../../config/colors';
import {mvs} from '../../../config/metrices';
import Medium from '../../../presentation/typography/medium-text';
import Regular from '../../../presentation/typography/regular-text';
import * as SVGS from '../../../../resource/assets/social-icons/index';
import Buttons from '../../atoms/Button';
const list = [true, false, false, true];
const PinStoreLocationModal = ({visible, onClose, onPress, address, title}) => {
  const Maps = SVGS['google_maps']
  const [payload, setPayload] = React.useState({
    isThirtyDays: true,
    isNinetyDays: false,
    isThreeWeeks: false,
    isTwoWeeks: false,
    isUrgent: true,
    isNoDelivery: true,
    maxPrice: '100',
    minPrice: '1000',
  });

  return (
    <View
      propagateSwipe
      isVisible={visible}
      avoidKeyboard
      onBackdropPress={() => onClose(f => !f)}
      onBackButtonPress={() => onClose(f => !f)}
      style={{margin: 0, padding: 0}}>
      <View style={styles.CONTAINER}>
        <View style={{alignItems: 'center', paddingHorizontal: mvs(22)}}>
          <Medium label={'Store Location'} style={styles.HEADING_TXT} />
        </View>
        <View style={styles.SUB_CONTAINER}>
          <TouchableOpacity
            activeOpacity = {1}
            onPress = {onPress}
            style={{
              padding: mvs(10),
              backgroundColor: colors.secondary,
              flexDirection: 'row',
              borderRadius : mvs(13)
            }}>
            {/* <ImageBackground
              source = {TAKE_TO_IMAGES.placeholder}
              style={{
                height: mvs(127),
                width: mvs(112),
                backgroundColor: colors.black,
                overflow: 'hidden',
                borderRadius: mvs(10),
              }}>
              <View style={{height: '100%', width: '100%'}} />
            </ImageBackground> */}
            <View style={{marginLeft: mvs(18), flex: 1}}>
              <Maps 
              style = {{
                position : 'absolute',
                right : mvs(5),
                top : mvs(5)
              }}
              height = {mvs(40)} width = {mvs(40)}/>
              {/* <ImageBackground
                source = {TAKE_TO_IMAGES.placeholder}
                style={{
                  height: mvs(32),
                  width: mvs(70),
                  backgroundColor: colors.black,
                }}>
                <View style={{height: '100%', width: '100%'}} />
              </ImageBackground> */}
              <Regular
                style={{
                  color: colors.primary,
                  fontSize: mvs(15),
                  marginTop: mvs(6),
                }}
                label={title}
              />
              <Regular
                style={{
                  color: colors.headerTitle,
                  fontSize: mvs(12),
                  marginTop: mvs(6),
                }}
                label={
                  address
                  // '360 Mall, Lower Ground Level Kuwait City, 13003, Kuwait'
                }
              />
              {/* <Regular
                style={{
                  color: colors.primary,
                  fontSize: mvs(10),
                  marginTop: mvs(6),
                }}
                label={'+965 1803 535'}
              /> */}
            </View>
          </TouchableOpacity>
          {/* <View style={styles.BUTTON_CONTAINER}>
            <Buttons.ButtonPrimary
              onClick={onPress}
              style={styles.BUTTON}
              title={'Save Pin'}
            />
            <Buttons.ButtonSecondayLight
              onClick={() => onClose()}
              style={{...styles.BUTTON}}
              title={'Cancel'}
            />
          </View> */}
        </View>
      </View>
    </View>
  );
};
export default PinStoreLocationModal;
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
