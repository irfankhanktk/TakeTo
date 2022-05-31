import React from 'react';
import {
  StyleSheet, TouchableOpacity, View
} from 'react-native';
import AeroplaneActive from '../../../../../resource/assets/order-car-icons/aeroplane-active.svg';
import Aeroplane from '../../../../../resource/assets/order-car-icons/aeroplane.svg';
import CarActive from '../../../../../resource/assets/order-car-icons/car-active.svg';
import Car from '../../../../../resource/assets/order-car-icons/car.svg';
import Location from '../../../../../resource/assets/order-car-icons/location.svg';
import colors from '../../../../config/colors';
import { mvs } from '../../../../config/metrices';
import Medium from '../../../../presentation/typography/medium-text';
import Regular from '../../../../presentation/typography/regular-text';
import OrderDestination from '../../../atoms/OrderDestination';
import OrderDestinationAddress from '../../../atoms/OrderDestinationAddress';
import ImagePlaceholder from '../../../atoms/Placeholder';

export const OfferDetailCard = ({
  isLocalOrder,
  title = 'iPhone 13 Pro 128GB Sierra blue',
  price = 155,
  reward = 25,
  local,
  user_img,
  user_name = 'Salmiya - Shuwaikh',
  order_from,
  order_to,
  order_from_flag,
  order_to_flag,
  orderType,
  store_img,
  onPressImage,
  style,
  ...props
}) => {
  return (
    <>
      <View style={[styles.CONTAINER, style]}>
        <TouchableOpacity onPress={onPressImage}>
          <ImagePlaceholder
            bg_img={store_img}
            containerStyle={styles.IMAGE_CONTAINER}
          />
        </TouchableOpacity>
        <View style={styles.DESCRIPTION_CONTAINER}>
          <Regular style={styles.TITLE} label={`${title}`} numberOfLines={2} />
          <View style={styles.PRICE_CONTAINER}>
            <Regular
              style={{
                ...styles.TITLE,
                fontSize: mvs(15),
                color: colors.typeHeader,
              }}
              label={'Product Price'}
            />
            <Medium
              style={{
                ...styles.TITLE,
                fontSize: mvs(15),
                color: colors.typeHeader,
              }}
              label={`${price}`}
            />
          </View>
          <View style={styles.PENDING_REWARD_CONTAINER}>
            <Regular
              style={{
                ...styles.TITLE,
                fontSize: mvs(15),
                color: colors.primary,
              }}
              label={'Reward'}
            />
            <Regular
              style={{ ...styles.TITLE, color: colors.primary }}
              label={`${reward}`}
            />
          </View>
        </View>
      </View>
      <View style={styles.LOCATION_DESTINATION}>
        <View style={styles.SUB_LOCATION_DESTINATION}>
          <OrderDestination
            value={orderType}
            width={orderType == 2 ? mvs(100) : mvs(50)}
            SVGFirst={
              isLocalOrder
                ? orderType === 0
                  ? Car
                  : CarActive
                : orderType == 0
                  ? Aeroplane
                  : AeroplaneActive
            }
            SVGSecond={Location}
          />
          <View style={{ marginTop: mvs(8) }} />
          <OrderDestinationAddress
            imageFrom={{ uri: order_from_flag }}
            imageTo={{ uri: order_to_flag }}
            label={`${order_from?.slice(0,15)} - ${order_to?.slice(0,15)}`}
            fontSize={12}
          />
        </View>
        <TouchableOpacity onPress={() => props?.navigation?.navigate('userprofile', { user_id: props?.user_id, is_review: false })} style={styles.USER_IMAGE_CONTAINER}>
          <View style={styles.SUB_USER_IMAGE_CONTAINER}>
            <ImagePlaceholder
              bg_img={user_img}
              containerStyle={styles.USER_IMAGE}
            />
            <Regular
              numberOfLines={1}
              label={user_name}
              style={{
                ...styles.CARD_CONTENT_LABLE,
                textAlign: 'center',
                fontSize: mvs(10),
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  CONTAINER: {
    flex: 1,
    flexDirection: 'row',
    marginTop: mvs(30),
  },
  IMAGE_CONTAINER: {
    borderRadius: mvs(10),
    height: mvs(125),
    width: mvs(104),
    padding: mvs(14),
    // backgroundColor: colors.white,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.price_border,
  },
  IMAGE: {
    height: '100%',
    width: '100%',
    borderRadius: 20,
  },
  TITLE: {
    fontSize: mvs(18),
    color: colors.typeHeader,
  },
  DESCRIPTION_CONTAINER: {
    paddingTop: mvs(10),
    marginLeft: mvs(30),
    flex: 1,
    // backgroundColor:'red'
    width: mvs(146),
  },
  CARD_CONTENT_LABLE: {
    width:'100%',
    fontSize: mvs(12),
    color: colors.headerTitle,
  },
  PRICE_CONTAINER: {
    borderColor: colors.price_border,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: mvs(4),
    marginTop: mvs(9),
  },
  PENDING_REWARD_CONTAINER: {
    marginTop: mvs(13),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  BUTTON_CONTAINER: {
    marginTop: mvs(11),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  TODAY: {
    fontSize: mvs(12),
    color: colors.pink,
  },
  MAKE_OFFER: {
    width: mvs(73),
    height: mvs(31),
    backgroundColor: colors.green,
  },
  LOCATION_DESTINATION: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: mvs(17),
  },
  SUB_LOCATION_DESTINATION: {
    // flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: mvs(196),
  },
  USER_IMAGE_CONTAINER: {
    width: mvs(54),
    borderRadius: mvs(10),
  },
  SUB_USER_IMAGE_CONTAINER: {
    height: mvs(55),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  USER_IMAGE: {
    height: mvs(37),
    width: mvs(37),
    borderRadius: mvs(10),
    backgroundColor: colors.secondary,
    overflow: 'hidden',
  },
});
