import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../../config/colors';
import { mvs, width } from '../../../config/metrices';
import Medium from '../../../presentation/typography/medium-text';
import Regular from '../../../presentation/typography/regular-text';
import OrderDestination from '../../atoms/OrderDestination';
import OrderDestinationAddress from '../../atoms/OrderDestinationAddress';
import ImagePlaceholder from '../../atoms/Placeholder';
import AeroplaneActive from './../../../../resource/assets/order-car-icons/aeroplane-active.svg';
import CarActive from './../../../../resource/assets/order-car-icons/car-active.svg';
import Location from './../../../../resource/assets/order-car-icons/location-active.svg';
import {OnlineBlue, PhysicalBlue} from './../../../../resource/assets/common-icons'

const DeliveredOrderCard = ({
  order_img,
  time,
  title,
  //order_site,
  shopName,
  price,
  reward,
  store_img,
  order_from,
  order_to,
  order_from_flag,
  order_to_flag,
  urgent_delivery = false,
  user_name,
  user_img,
  user_name_tr,
  user_img_tr,
  offer_by = {},
  local = true,
  headingTitle,
  style,
  detinationWidth = null,
  order_id = null,
  onclick,
  order_data,
  ...props
}) => {
  return (
    <View style={{ ...styles.CONTAINER, ...style }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          props.navigation.navigate('orderdetails', {
            isLocalOrder: local,
            orderType: 'delivered',
            order_id,
            order_data
          });
        }}
        style={{ flex: 1 }}>
        {headingTitle && (
          <Regular label={headingTitle} style={styles.PROCESSING_LABEL} />
        )}
        <View style={styles.CARD_WRAPPER}>
          <ImagePlaceholder
            style={{bottom: -1}}
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
              <Regular numberOfLines = {2} label={title} style={styles.CARD_CONTENT_LABLE} />
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
          <TouchableOpacity onPress={()=>props?.navigation?.navigate('userprofile',{user_id:props?.user_id_tr,is_review:false})} style={styles.AVATAR_WRAPPER}>
            <View style={styles.AVATAR_CONTAINER}>
              <ImagePlaceholder bg_img={user_img_tr} containerStyle={styles.AVATAR} />
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
          <View style={styles.DESTINATION_CONTAINER}>
            <OrderDestination
              width={detinationWidth}
              value={2}
              SVGFirst={local ? CarActive : AeroplaneActive}
              SVGSecond={Location}
            />
            <OrderDestinationAddress
              numberOfLines={3}
              imageFrom={{ uri: order_from_flag }}
              imageTo={{ uri: order_to_flag }}
              label={`${order_from?.slice(0,15)} - ${order_to?.slice(0,15)}`}
            />
          </View>
          <TouchableOpacity onPress={()=>props?.navigation?.navigate('userprofile',{user_id:props?.user_id,is_review:false})} style={styles.AVATAR_WRAPPER}>
            <View style={styles.AVATAR_CONTAINER}>
              <ImagePlaceholder bg_img={user_img} containerStyle={styles.AVATAR} />
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

export default DeliveredOrderCard;

const styles = StyleSheet.create({
  STORE_IMG_CONTAINER: {
    width: "45%",
    borderRadius: mvs(20),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  CONTAINER: {
    // ...colors.shadow,
    // marginTop: 2,
    //height: mvs(240),
    // flexGrow:1,
    marginBottom: mvs(20),
    //  width: width - mvs(22) * 2,
    paddingHorizontal: mvs(10),
    paddingVertical: mvs(15),
    backgroundColor: colors.secondary,
    borderRadius: mvs(20),
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
  },
  REWARD_CONTAINER: {
    marginTop: mvs(10),
    flexDirection: 'row',
    height: mvs(21),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  PROCESSING_LABEL: {
    marginBottom: mvs(10),
    color: colors.green,
    fontSize: 12,
  },
  DESTINATION_WRAPPER: {
    flex: 1,
    marginTop: mvs(10),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  DESTINATION_CONTAINER: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    // width: '90%',
    paddingHorizontal: mvs(10),
    height: '90%'
  },
  CARD_WRAPPER: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: mvs(181),
  },
  CARD_CONTENT_LABLE: {
    fontSize: mvs(12),
    color: colors.headerTitle,
  },
  AVATAR_CONTAINER: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  AVATAR: {
    height: mvs(37),
    width: mvs(37),
    overflow: 'hidden',
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
