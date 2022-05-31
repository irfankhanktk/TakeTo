import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TAKE_TO_IMAGES } from '../../../../resource/assets/image_resouce';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Medium from '../../../presentation/typography/medium-text';
import Regular from '../../../presentation/typography/regular-text';
import Buttons from '../../atoms/Button';
import OrderDestination from '../../atoms/OrderDestination';
import OrderDestinationAddress from '../../atoms/OrderDestinationAddress';
import Aeroplane from './../../../../resource/assets/order-car-icons/aeroplane.svg';
import Car from './../../../../resource/assets/order-car-icons/car.svg';
import Location from './../../../../resource/assets/order-car-icons/location.svg';
import ImagePlaceholder from '../../atoms/Placeholder';
import { aeroplane_active, car_active } from '../../../../resource/assets/order-car-icons';
import {OnlineBlue, PhysicalBlue} from './../../../../resource/assets/common-icons'
import LinearGradient from 'react-native-linear-gradient';

const HistoryOrderCard = ({
  store_img,
  time = '',
  item,
  showTime = false,
  title,
  order_site,
  price,
  reward,
  user_name,
  user_img,
  local = true,
  headingTitle,
  buttonLabel,
  buttonLabel1,
  status,
  type,
  color,
  onClick,
  order_from,
  order_to,
  order_from_flag,
  order_to_flag,
  style,
  textStyle1,
  styleButton,
  shopName,
  urgent_delivery,

  isActive=false,
dotColor=colors.primary,
  trackLine,
  ...props
}) => {
  // console.log(item?.readable_created_at)
  
  return (
    // <Shadow distance={mvs(5)} viewStyle={styles.CONTAINER}>
    <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#FEFEFE', colors.secondary, '#FEFEFE']} >
    <View style={{ ...styles.CONTAINER, ...style }}>
      <View style={{ flex: 1 }}>
        {headingTitle && (
          <Regular label={headingTitle} style={styles.PROCESSING_LABEL} />
        )}
        <View style={styles.CARD_WRAPPER}>
          <ImagePlaceholder
            bg_img={store_img}
            containerStyle={{
              width: "45%",
              height: mvs(171),
              borderRadius: mvs(20),
            }}
          >
            {/* {urgent_delivery && (
              <Regular
                label={'Urgent delivery'}
                style={styles.URGENT_LABEL}
              />
            )} */}
          </ImagePlaceholder>

          <View
            style={{
              //flex: 1,
              //paddingLeft: mvs(9),
              justifyContent: 'space-between',
              width: '53%',
            }}>
            <Regular
              label={time}
              style={{
                ...styles.CARD_CONTENT_LABLE,
                color: colors.timeAgo,
                // marginLeft: mvs(9)
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
                {order_site?
                  <OnlineBlue width = {mvs(8.75)} height = {mvs(14)}/>
                  :
                  <PhysicalBlue width = {mvs(15.75)} height = {mvs(14)}/>
                }
                <Regular
                  numberOfLines={1}
                  //label={order_data?.order_site || shopName}\
                  label = {order_site? 'Online Order' : 'Physical Order'}
                  style={{
                    ...styles.CARD_CONTENT_LABLE,
                    color: colors.primary,
                    marginLeft : mvs(7)
                  }}
                />
              </View>
            <View style={styles.PRICE_CONTAINER}>
              <Regular
                label={'Price'}
                style={{ ...styles.CARD_CONTENT_LABLE }}
              />
              <Medium
                label={`${price}`}
                style={{ ...styles.CARD_CONTENT_LABLE }}
              />
            </View>
            <View style={styles.REWARD_CONTAINER}>
              <View style={{ height: mvs(30), justifyContent: 'flex-end', }} >
                {console.log(`${status} \n ${type}`.trim())}
                <Regular
                  label={(status && type) ? `${status}\n${type}` : status ? `${status}` : `${type}`}
                  style={{
                    ...styles.CARD_CONTENT_LABLE,
                    color: colors.primary,
                  }}
                />
                {/* <Regular
                  label={type}
                  style={{
                    ...styles.CARD_CONTENT_LABLE,
                    color: colors.primary,
                  }}
                /> */}
              </View>
              <Medium
                label={`${reward}`}
                style={{
                  ...styles.CARD_CONTENT_LABLE,
                  fontSize: mvs(17),
                  color: colors.primary,
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.DESTINATION_WRAPPER}>
          <View style={{ width: '45%' }}>
            <View style={styles.DESTINATION_CONTAINER}>
              <OrderDestination
                value={trackLine}
                dotColor={dotColor}
                label={' - - - - - - - - - - - - - - - - - '}
                SVGFirst={local ? isActive ? car_active : Car : isActive ? aeroplane_active : Aeroplane}
                SVGSecond={Location}
              />
              <OrderDestinationAddress
                imageFrom={{ uri: order_from_flag }}
                imageTo={{ uri: order_to_flag }}
                fontSize={9}
                style={{ marginTop: mvs(11.1) }}
                label={`${order_from?.slice(0,15)} - ${order_to?.slice(0,15)}`}
              />
            </View>
          </View>
          <View style={styles.button}>
            <Buttons.ButtonPrimaryCard
              title={buttonLabel}
              //title1={buttonLabel1}
              textStyle={{ fontSize: mvs(15), textAlign: "center" }}
              //textStyle1={textStyle1}
              style={{ backgroundColor: color, ...styleButton }}
              onClick={onClick}
            />
            {/* <Buttons.ButtonPrimaryCard onClick={()=>{}} title = {buttonLabel} title1 = {buttonLabel1} textStyle = {{fontSize : mvs(12)}}/> */}
          </View>
        </View>
      </View>
    </View>
   </LinearGradient>
  );
};

export default HistoryOrderCard;

const styles = StyleSheet.create({
  CONTAINER: {
    // ...colors.shadow,
    //marginBottom: mvs(20),
    paddingHorizontal: mvs(10),
    paddingVertical: mvs(15),
    // backgroundColor: colors.secondary,
    borderRadius: mvs(20),
    // height:420,
    width: '100%',
    //borderWidth : 1
    // borderWidth : 0.2
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
    marginTop: mvs(8),
    flexDirection: 'row',
    height: mvs(27),
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    //borderWidth : 1
  },
  PROCESSING_LABEL: {
    marginBottom: mvs(10),
    color: colors.primary,
    fontSize: 12,
  },
  DESTINATION_WRAPPER: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginTop: mvs(15),
    //height : mvs(57)
    //borderWidth : 1
  },
  DESTINATION_CONTAINER: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    //borderWidth:1
    //paddingHorizontal: mvs(20),
  },
  CARD_WRAPPER: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    //height: mvs(141),
    //borderWidth : 1
  },
  CARD_CONTENT_LABLE: {
    fontSize: mvs(12),
    color: colors.typeHeader,
  },
  AVATAR_CONTAINER: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  AVATAR: {
    height: mvs(37),
    width: mvs(37),
    borderRadius: mvs(10),
    backgroundColor: colors.secondary,
  },
  AVATAR_WRAPPER: {
    height: '100%',
    width: mvs(54),
    borderRadius: mvs(10),
  },
  button: {
    flex: 1,
    marginLeft: mvs(8.5),
  },
  URGENT_LABEL: {
    fontSize: mvs(12),
    color: colors.pink,
    paddingHorizontal: mvs(12),
    paddingVertical: mvs(3),
    backgroundColor: colors.white,
    borderTopLeftRadius: mvs(6),
    borderTopRightRadius: mvs(6),
    overflow: 'hidden',
    bottom: mvs(-7)
  },
});
