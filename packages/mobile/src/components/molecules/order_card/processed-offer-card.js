import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Medium from '../../../presentation/typography/medium-text';
import Regular from '../../../presentation/typography/regular-text';
import OrderDestination from '../../atoms/OrderDestination';
import OrderDestinationAddress from '../../atoms/OrderDestinationAddress';
import ImagePlaceholder from '../../atoms/Placeholder';
import AeroplaneActive from './../../../../resource/assets/order-car-icons/aeroplane-active.svg';
import CarActive from './../../../../resource/assets/order-car-icons/car-active.svg';
import Location from './../../../../resource/assets/order-car-icons/location.svg';
import {OnlineBlue, PhysicalBlue} from './../../../../resource/assets/common-icons'

const ProcessingOrderCard = ({
  time,
  title,
  shopName,
  // order_site,
  price,
  reward,
  user_name,
  user_img,
  user_name_tr,
  user_img_tr,
  offer_by = {},
  urgent_delivery = true,
  local = true,
  order_from,
  order_to,
  order_from_flag,
  order_to_flag,
  store_img,
  headingTitle,
  detinationWidth = null,
  style,
  order_data,
  order_id,
  onclick,
  ...props
}) => {
  //console.log("flag::", order_from_flag)
  return (
    <View style={{ ...styles.CONTAINER, ...style }}>
      <TouchableOpacity
        activeOpacity={1}
        style={{ flex: 1 }}
        onPress={() => {
          props.navigation.navigate('orderdetails', {
            isLocalOrder: local,
            orderType: 'processing',
            order_id,
            order_data,
          });
        }}>
        {headingTitle && (
          <Regular label={headingTitle} style={styles.PROCESSING_LABEL} />
        )}
        <View style={styles.CARD_WRAPPER}>

          <ImagePlaceholder
            style={{ bottom: -1 }}
            bg_img={store_img}
            containerStyle={styles.STORE_IMG_CONTAINER}>
            {/* {urgent_delivery && (
              <Regular label={'Urgent delivery'} style={styles.URGENT_LABEL} />
            )} */}
          </ImagePlaceholder>

          <View
            style={{
              flex: 1,
              paddingLeft: mvs(9),
              overflow: 'hidden',
              justifyContent: 'space-between',
              //borderWidth: 1
            }}>
            <Regular
              label={time}
              style={{
                ...styles.CARD_CONTENT_LABLE,
                color: colors.timeAgo,
              }}
            />
             <View style={{
                marginTop: mvs(9), 
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderColor: colors.horizontalLine,
                paddingBottom : mvs(10)
                }}>
                <Regular
                  label={urgent_delivery? 'Urgent Delivery' : 'Normal Delivery'}
                  style={{
                    ...styles.CARD_CONTENT_LABLE,
                    color : urgent_delivery? colors.pink : colors.typeHeader
                  }}
                />
              </View>
            <View style={{ marginTop: mvs(9) }}>
              <Regular numberOfLines={2} label={title} style={styles.CARD_CONTENT_LABLE} />
            </View>
            <View style={{marginTop: mvs(5), flexDirection : 'row'}}>
                {order_data?.order_site?
                  <OnlineBlue width = {mvs(8.75)} height = {mvs(14)}/>
                  :
                  <PhysicalBlue width = {mvs(15.75)} height = {mvs(14)}/>
                }
                <Regular
                  numberOfLines={1}
                  //label={order_data?.order_site || shopName}\
                  label = {order_data?.order_site? 'Online Order' : 'Physical Order'}
                  style={{
                    ...styles.CARD_CONTENT_LABLE,
                    color: colors.primary,
                    marginLeft : mvs(7)
                  }}
                />
              </View>
            <View style={styles.PRICE_CONTAINER}>
              <Regular label={'Price'} style={{ ...styles.CARD_CONTENT_LABLE }} />
              <Medium
                label={`${price}`}
                style={{ ...styles.CARD_CONTENT_LABLE }}
              />
            </View>
            <View style={styles.REWARD_CONTAINER}>
              <Regular
                label={'Reward'}
                style={{
                  ...styles.CARD_CONTENT_LABLE,
                  color: colors.primary,
                }}
              />
              <Medium
                label={`${reward}`}
                style={{
                  ...styles.CARD_CONTENT_LABLE,
                  fontSize: mvs(18),
                  color: colors.primary,
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.DESTINATION_WRAPPER}>
          <TouchableOpacity onPress={() => props?.navigation?.navigate('userprofile', { user_id: props?.user_id_tr, is_review: false })} style={styles.AVATAR_WRAPPER}>
            <View style={styles.AVATAR_CONTAINER}>
              <ImagePlaceholder
                bg_img={user_img_tr}
                containerStyle={styles.AVATAR}
              />
              <Regular
                numberOfLines={1}
                label={user_name_tr}
                style={{
                  ...styles.CARD_CONTENT_LABLE,
                  textAlign: 'center',
                  fontSize: mvs(10),
                }}
              />
            </View>
          </TouchableOpacity>
          <View style={{ ...styles.DESTINATION_CONTAINER }}>
            <OrderDestination
              width={detinationWidth}
              value={1}
              SVGFirst={local ? CarActive : AeroplaneActive}
              SVGSecond={Location}
            />
            <OrderDestinationAddress
              imageFrom={{ uri: order_from_flag }}
              imageTo={{ uri: order_to_flag }}
              label={`${order_from?.slice(0,15)} - ${order_to?.slice(0,15)}`}
            />
          </View>
          <TouchableOpacity onPress={() => props?.navigation?.navigate('userprofile', { user_id: props?.user_id, is_review: false })} style={styles.AVATAR_WRAPPER}>
            <View style={styles.AVATAR_CONTAINER}>
              <ImagePlaceholder
                bg_img={user_img}
                containerStyle={styles.AVATAR}
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
      </TouchableOpacity>
    </View>
  );
};

export default ProcessingOrderCard;

const styles = StyleSheet.create({
  STORE_IMG_CONTAINER: {
    width: '45%',
    borderRadius: mvs(20),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderWidth:0
  },
  CONTAINER: {
    // ...colors.shadow,
    // height: mvs(220),
    marginTop: 2,
    marginBottom: mvs(20),
    paddingHorizontal: mvs(10),
    paddingVertical: mvs(15),
    backgroundColor: colors.secondary,
    borderRadius: mvs(20),
    borderWidth:0
  },
  PRICE_CONTAINER: {
    marginTop: mvs(10),
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.horizontalLine,
    height: mvs(25),
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth:0
  },
  REWARD_CONTAINER: {
    marginTop: mvs(10),
    flexDirection: 'row',
    height: mvs(21),
    justifyContent: 'space-between',
    alignItems: 'center',
    //borderWidth : 1
  },
  PROCESSING_LABEL: {
    marginBottom: mvs(10),
    color: colors.primary,
    fontSize: 12,
  },
  DESTINATION_WRAPPER: {
    flex: 1,
    marginTop: mvs(10),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    //borderWidth: 1
  },
  DESTINATION_CONTAINER: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    // width: '100%',
    paddingHorizontal: mvs(10),
    //borderWidth : 1,
    height: '90%',
  },
  CARD_WRAPPER: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: mvs(181),
    borderWidth:0
  },
  CARD_CONTENT_LABLE: {
    fontSize: mvs(12),
    color: colors.headerTitle,
  },
  AVATAR_CONTAINER: {
    // flex: 1,
    height: mvs(60),
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  AVATAR: {
    height: mvs(37),
    overflow: 'hidden',
    width: mvs(37),
    borderRadius: mvs(10),
    backgroundColor: colors.secondary,
  },
  AVATAR_WRAPPER: {
    height: '100%',
    width: mvs(54),
    borderRadius: mvs(10),
  },
  URGENT_LABEL: {
    fontSize: mvs(12),
    color: colors.pink,
    paddingHorizontal: mvs(15),
    paddingVertical: mvs(3),
    // marginTop:mvs(10),
    backgroundColor: colors.white,
    borderTopLeftRadius: mvs(6),
    borderTopRightRadius: mvs(6),
  },
});
