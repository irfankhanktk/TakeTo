
import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, TouchableOpacity, View
} from 'react-native';
import { connect } from 'react-redux';
import * as ImagesCommon from '../../../../resource/assets/common-icons';
import * as Images from '../../../../resource/assets/order-car-icons';
import Buttons from '../../../components/atoms/Button';
import OrderDestination from '../../../components/atoms/OrderDestination';
import OrderDestinationAddress from '../../../components/atoms/OrderDestinationAddress';
import ImagePlaceholder from '../../../components/atoms/Placeholder';
import Header from '../../../components/molecules/header/header-1x';
import InputWithTitle from '../../../components/molecules/input-with-title';
import ProductInfo from '../../../components/molecules/product-info';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';


const WalletRefundDetails = props => {
  const {wallet_refund, fetchWalletDeliveryDetails, navigation, route,profileData} =
    props;
  const {order_id} = route?.params;

  const Car = Images['car'];
  const Aeroplane = Images['aeroplane'];
  const Location = Images['location'];
  const CarActive = Images['car_active'];
  const AeroplaneActive = Images['aeroplane_active'];
  const LocationGreen = ImagesCommon['location_green'];
  const LocationPink = ImagesCommon['location_pink'];
  const LocationActive = Images['location_active'];


  const [user, setUser] = useState('Buyer')

  React.useEffect(() => {
    fetchWalletDeliveryDetails();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Header
        {...props}
        title="Wallet - Refund Details"
        allowBackBtn
        userIcon = {false}
      />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        
        <View style={styles.productMainContainer}>
          <View style={styles.productContainer}>
            <ProductInfo
              order_img={wallet_refund.order_image}
              priceTitle={'Product Price'}
              name={wallet_refund?.order_title}
              //name = "iPhone 13 Pro 128GB Sierra blue"
              total={`US$ ${"567"}`}
              reward={`US$ ${'30'}`}
              rewardTitle = {"Rewarded"}
              detailsContainer={{marginLeft : mvs(30)}}
            />
          </View>

          <View style={{paddingHorizontal: mvs(22)}}>
            <View style={{...styles.LOCATION_DESTINATION, flexDirection : user == "Buyer" ? 'row-reverse' : 'row'}}>
              <View style={styles.SUB_LOCATION_DESTINATION}>
                <OrderDestination
                  value={2}
                  width={2 == 2 ? mvs(100) : mvs(50)}
                  SVGFirst={AeroplaneActive}
                  SVGSecond={LocationPink}
                />
                <View style={{marginTop: mvs(8)}} />
                <OrderDestinationAddress
                  imageFrom={{uri: wallet_refund?.order_from_flag}}
                  imageTo={{uri: wallet_refund?.order_to_flag}}
                  label={`${wallet_refund?.order_from?.slice(0,15)} - ${wallet_refund?.order_to?.slice(0,15)}`}
                  fontSize={12}
                />
              </View>
              <TouchableOpacity style={styles.USER_IMAGE_CONTAINER}>
                <View style={styles.SUB_USER_IMAGE_CONTAINER}>
                  <ImagePlaceholder
                    bg_img={wallet_refund?.order_by?.user_image}
                    containerStyle={styles.USER_IMAGE}
                  />
                  <Regular
                    numberOfLines={1}
                    label={wallet_refund?.order_by?.user_name?.substring(
                      0,
                      10,
                    )}
                    style={{
                      ...styles.CARD_CONTENT_LABLE,
                      fontSize: mvs(12),
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>


        <View style={styles.container1}>
          <View style = {styles.line}/>
          <InputWithTitle
          // singleInput = {true}
          title = "Product Details"
          value = "Lorem ipsum"
          multiline = {true}
          textStyle = {{color : colors.primary}}
          editable = {false}
          titleStyle = {{fontSize : mvs(14)}}
          style = {{marginTop : mvs(17)}}
          singleInput={false}
              moreOrLess={true}
          />
          <View style={styles.moreInfoContainer}>
            <View style={{...styles.infoContainer, marginTop: mvs(0)}}>
              <Regular label="Failed Delivery" style={{...styles.label, color : colors.pink}} />
              <Regular
                label={"25 November 2021"}
                style={{...styles.value, color : colors.pink}}
              />
            </View>

            {/* <View style={styles.line}></View> */}

            <View style={{...styles.infoContainer, marginTop: mvs(12)}}>
              <Regular label="Quantity" style={styles.label} />
              <Regular
                label={wallet_refund?.order_quantity}
                style={styles.value}
              />
            </View>

            <View style={{...styles.infoContainer, marginTop: mvs(12)}}>
              <Regular label="Packaging" style={styles.label} />
              <Regular
                label={
                  wallet_refund?.order_packaging ? 'With box' : 'Without box'
                }
                style={styles.value}
              />
            </View>

            <View style={{...styles.infoContainer, marginTop: mvs(12)}}>
              <Regular label="Where to buy" style={styles.label} />
              <Regular
                label={wallet_refund?.order_store_url}
                style={{...styles.value, color: colors.primary}}
              />
            </View>
            
            <View style = {{...styles.line, marginTop : mvs(15)}}/>
          </View>

          <InputWithTitle
          singleInput = {true}
          title = "Buying Instructions"
          value = "Lorem ipsum"
          multiline = {true}
          textStyle = {{color : colors.primary}}
          editable = {false}
          style = {{marginTop : mvs(17)}}
          titleStyle = {{fontSize : mvs(14)}}
          />

          <View style = {styles.statusContainer}>
            <Regular
            label = "Reason: "
            style = {{fontSize : mvs(12), color : colors.typeHeader}}
            />
            <Regular
            label = {`${user == "Buyer"? 'Buyer' : 'Deliverer'} No Show`}
            style = {{fontSize : mvs(12), color : colors.pink}}
            />
          </View>

          <Buttons.ButtonPrimary
          title = {`Refunded 976 ${profileData?.currency?.currency_code}`}
          titleStyle = {{color : colors.white}}
          style = {{marginTop : mvs(16), marginBottom : mvs(40)}}
          onClick = {()=>{}}
          />
        </View>

        {/* <OrderPolicy style={{marginTop: mvs(20)}} /> */}
      </ScrollView>
    </View>
  );
};
const mapStateToProps = state => ({
  wallet_refund: state.wallet.wallet_refund,
  profileData: state.auth.userInfo?.profile || {},
});

const mapDispatchToProps = {
  fetchWalletDeliveryDetails: order_id =>
    TAKE_TO_ACTIONS.fetchWalletDeliveryDetails(order_id),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WalletRefundDetails);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor : colors.white
  },
  header: {
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    //paddingBottom : mvs(40)
    //borderWidth : 1
  },
  productMainContainer: {
    paddingBottom: mvs(15),
    backgroundColor: colors.white,
    borderBottomLeftRadius: mvs(20),
    borderBottomRightRadius: mvs(20),
    //borderWidth : 1
    //height : mvs(200)
  },
  productContainer: {
    paddingHorizontal: mvs(22),
    minHeight: mvs(125),
    //marginTop: mvs(30),
    // borderWidth : 1,
    // borderColor : 'red'
  },
  CONTAINER: {
    flex: 1,
    flexDirection: 'row',
    marginTop: mvs(30),
  },
  IMAGE_CONTAINER: {
    borderRadius: mvs(10),
    height: mvs(125),
    width: mvs(104),
    backgroundColor: colors.white,
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
    color: colors.headerTitle,
  },
  DESCRIPTION_CONTAINER: {
    marginLeft: mvs(9),
    flex: 1,
    // backgroundColor:'red'
    width: mvs(146),
  },
  CARD_CONTENT_LABLE: {
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
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: mvs(15),
    //borderWidth : 1,
    paddingRight : mvs(134),
    height: mvs(55),
    // borderWidth : 1,
    // borderColor : 'green'
  },
  SUB_LOCATION_DESTINATION: {
    // flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "100%",
    //borderWidth:1,
    // borderColor : 'orange'
  },
  USER_IMAGE_CONTAINER: {
    //width: mvs(54),
    borderRadius: mvs(10),
    //borderWidth :1,
    position : 'absolute',
    right : 0,
    height : "100%"
  },
  SUB_USER_IMAGE_CONTAINER: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    //borderWidth:1
  },
  USER_IMAGE: {
    height: mvs(37),
    width: mvs(37),
    borderRadius: mvs(10),
    backgroundColor: colors.secondary,
  },
  rewardContainer: {
    height: mvs(58),
    width: '100%',
    //borderWidth : 1,
    borderRadius: mvs(10),
    backgroundColor: colors.green,
    marginTop: mvs(115),
    marginBottom : mvs(40),
    paddingHorizontal: mvs(11),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container1: {
    //flex :1,
    paddingHorizontal: mvs(22),
    //borderWidth : 1
  },
  infoContainer: {
    width: '100%',
    flexDirection: 'row',
    //borderWidth : 1,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: mvs(13),
    color: colors.label,
  },
  value: {
    fontSize: mvs(13),
    color: colors.headerTitle,
  },
  line: {
    width: '100%',
    borderBottomWidth: mvs(0.5),
    borderColor: colors.doted,
    //marginTop: mvs(11),
  },
  moreInfoContainer: {
    //paddingHorizontal: mvs(20),
    backgroundColor: colors.white,
    marginTop: mvs(22),
    //paddingBottom: mvs(22),
    //borderRadius: mvs(10),
    //borderWidth:1
  },
  statusContainer: {
    height : mvs(40),
    width : '100%',
    borderRadius : mvs(10),
    borderWidth : mvs(0.5),
    borderColor : colors.doted,
    marginTop : mvs(85),
    alignItems : 'center',
    paddingLeft : mvs(10),
    flexDirection : 'row'
  }
});
