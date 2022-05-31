import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { connect } from 'react-redux';
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
import {OnlineBlue, PhysicalBlue} from './../../../../resource/assets/common-icons'
import ImagePlaceholder from './../../atoms/Placeholder';
import LinearGradient from 'react-native-linear-gradient';
const MakeOfferOrderCard = ({
  order_img,
  time,
  title,
  // order_site,
  price,
  reward,
  shopName,
  user_name,
  user_name_tr,
  user_img,
  user_img_tr,
  user_id,
  user_id_tr,
  store_img,
  local = false,
  onPress,
  urgent_delivery = false,
  style,
  dottedLine = ' - - - - - - - - - - - - - - ',
  detinationWidth = null,
  order_from,
  order_to,
  order_from_flag,
  order_to_flag,
  order_id = null,
  order_data,
  countriesList,
  ...props
}) => {
  return (
    <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['#FEFEFE', colors.secondary, '#FEFEFE']} >
    <TouchableOpacity
     activeOpacity = {1}
      // onPress={() =>
      //   props.navigation.navigate('orderdetails', {
        //     isLocalOrder: local,
      //     orderType: 'normal',
      //   })
      // }
      style={{...styles.CARD_CONTAINER, ...style}}>
      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            // height: mvs(141)
          }}>
          <View style={{width: '45%'}}>
            <ImagePlaceholder
              style={{bottom: mvs(-1)}}
              bg_img={store_img}
              containerStyle={styles.ORDER_IMAGE_CONTAIER}>
              {/* {urgent_delivery && (
                <Regular
                  label={'Urgent delivery'}
                  style={styles.URGENT_LABEL}
                />
              )} */}
            </ImagePlaceholder>
            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: mvs(10),
                height: mvs(55),
              }}>
              <OrderDestination
                width={detinationWidth}
                value={0}
                label={dottedLine}
                SVGFirst={local ? Car : Aeroplane}
                SVGSecond={Location}
              />
              <OrderDestinationAddress
                imageFrom={{uri: order_from_flag}}
                imageTo={{uri: order_to_flag}}
                label={`${order_from?.slice(0,15)} - ${order_to?.slice(0,15)}`}
              />
            </View>
          </View>
          <View
            style={{
              flex: 1,
              overflow: 'hidden',
              width: '45%',
              paddingLeft: mvs(9),
              justifyContent: 'space-between',
            }}>
              
            <View style={{
              height: mvs(171), 
              //borderWidth : 1
              }}>
              <Regular
                label={time}
                style={{
                  ...styles.CARD_CONTENT_LABLE,
                  //marginLeft: mvs(12),
                  color: colors.label,
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

              <View style={{marginTop: mvs(9)}}>
                <Regular
                  label={title}
                  numberOfLines={2}
                  style={styles.CARD_CONTENT_LABLE}
                />
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
              <View
                style={{
                  marginTop: mvs(11),
                  flexDirection: 'row',
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderColor: colors.horizontalLine,
                  height: mvs(25),
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Regular
                  label={'Price'}
                  style={{...styles.CARD_CONTENT_LABLE}}
                />
                <Medium
                  label={`${price}`}
                  style={{...styles.CARD_CONTENT_LABLE}}
                />
              </View>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  position: 'absolute',
                  bottom: 0,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
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
            <Buttons.ButtonPrimary
              onClick={() => {
                props.navigation.navigate('orderdetails', {
                  isLocalOrder: local,
                  orderType: 'normal',
                  order_id,
                  order_data
                });
              }}
              title={'Make Offer'}
              style={{
                // width: null,

                paddingHorizontal: mvs(15),
                borderRadius: mvs(10),
                backgroundColor: colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            marginTop: mvs(10),
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}></View>
      </View>
    </TouchableOpacity>
    </LinearGradient>
  );
};
const mapStateToProps=state=>{
  return{
    countriesList: state.common.countriesList,
  }
}
export default connect(mapStateToProps,{})(MakeOfferOrderCard);

const styles = StyleSheet.create({
  CARD_CONTAINER: {
    height: mvs(260),
    // marginBottom: mvs(15),
    paddingHorizontal: mvs(10),
    paddingVertical: mvs(15),
    // backgroundColor: colors.secondary,
    borderRadius: mvs(20),
  },
  AVATAR_CONTAINER: {
    flex: 1,
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
  CARD_CONTENT_LABLE: {
    fontSize: mvs(12),
    color: colors.headerTitle,
  },
  URGENT_LABEL: {
    fontSize: mvs(12),
    color: colors.pink,
    paddingHorizontal: mvs(12),
    paddingVertical: mvs(3),
    backgroundColor: colors.white,
    borderTopLeftRadius: mvs(6),
    borderTopRightRadius: mvs(6),
  },
  ORDER_IMAGE_CONTAIER: {
    height: mvs(171),
   // borderWidth : 1,
    width: '100%',
    borderRadius: mvs(20),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
