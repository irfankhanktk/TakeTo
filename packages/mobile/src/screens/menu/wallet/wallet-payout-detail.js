import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import React from 'react';
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native';
import { mvs } from '../../../config/metrices'
import {connect} from 'react-redux';
import {Tick} from '../../../../resource/assets/common-icons';
import {TAKE_TO_IMAGES} from '../../../../resource/assets/image_resouce';
import {InfoField} from '../../../components/atoms/order-info-field';
import ImagePlaceholder from '../../../components/atoms/Placeholder';
import DualText from '../../../components/molecules/dual-text/dual-text';
import Header from '../../../components/molecules/header/header-1x';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import Medium from '../../../presentation/typography/medium-text';
import Regular from '../../../presentation/typography/regular-text';
import InputWithTitle from '../../../components/molecules/input-with-title';
import ProductInfo from '../../../components/molecules/product-info';
import OrderDestination from '../../../components/atoms/OrderDestination';
import OrderDestinationAddress from '../../../components/atoms/OrderDestinationAddress';
import * as Images from '../../../../resource/assets/order-car-icons';
import * as SVGS from '../../../../resource/assets/order-policy-icons'
import * as ImagesCommon from '../../../../resource/assets/common-icons';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Buttons from '../../../components/atoms/Button';

const WalletPayoutDetail = props => {
  const {wallet_payout, fetchWalletPayoutDetails, navigation, route, wallet_delivery, wallet_refund,profileData} = props;
  const {order_id} = route?.params;
  const CarActive = Images['car_active'];
  const LocationActive = Images['location_active']
  const LocationPink = ImagesCommon['location_green'];
  const Check = SVGS['check']

  React.useEffect(() => {
    // alert(order_id)
   // fetchWalletPayoutDetails(order_id);
  }, []);
  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Header
          {...props}
          title="Wallet - Payout Details"
          allowBackBtn
          userIcon = {false}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.productMainContainer}>
          <View style={styles.productContainer}>
            <ProductInfo
              order_img={wallet_refund?.order_image}
              priceTitle={'Product Price'}
              //name={wallet_refund?.order_title}
              name="iPhone 13 Pro 128GB Sierra blue"
              total={`US$ ${wallet_refund?.order_price}`}
              reward={`US$ ${wallet_refund?.order_reward_price}`}
              detailsContainer={{marginLeft : mvs(30)}}
            />
          </View>

          <View style={{paddingHorizontal: mvs(22)}}>
            <View style={styles.LOCATION_DESTINATION}>
              <View style={styles.SUB_LOCATION_DESTINATION}>
                <OrderDestination
                  value={2}
                  width={2 == 2 ? mvs(100) : mvs(50)}
                  SVGFirst={CarActive}
                  SVGSecond={LocationActive}
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
                  <ImagePlaceholder bg_img={wallet_refund?.order_by?.user_image} containerStyle={styles.USER_IMAGE}/>
                  {/* <Image
                    source={{uri: wallet_refund?.order_by?.user_image}}
                    style={styles.USER_IMAGE}
                  /> */}
                  <Regular
                    label={wallet_refund?.order_by?.user_name}
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
            <View style={{...styles.infoContainer, marginTop: mvs(17)}}>
              <Regular label="Urgent Delivery" style={{...styles.label, color : colors.pink}} />
              <Regular
                label={"Within 24 hours"}
                style={{...styles.value, color : colors.pink}}
              />
            </View>

            {/* <View style={styles.line}></View> */}

            <View style={{...styles.infoContainer, marginTop: mvs(12)}}>
              <Regular label="Quantity" style={styles.label} />
              <Regular
                label={wallet_delivery?.order_quantity}
                style={styles.value}
              />
            </View>

            <View style={{...styles.infoContainer, marginTop: mvs(12)}}>
              <Regular label="Packaging" style={styles.label} />
              <Regular
                label={
                  wallet_delivery?.order_packaging ? 'With box' : 'Without box'
                }
                style={styles.value}
              />
            </View>

            <View style={{...styles.infoContainer, marginTop: mvs(12)}}>
              <Regular label="Where to buy" style={styles.label} />
              <Regular
                label={wallet_delivery?.order_store_url}
                style={{...styles.value, color: colors.primary}}
              />
            </View>
            <View style = {{...styles.line, marginTop : mvs(16)}}/>
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


          <View style = {styles.summaryContainer}>
          <Regular label = "Price Summary" style = {{fontSize : mvs(20), color : colors.headerTitle, marginTop : mvs(24)}}/>
          <View style = {styles.moreInfoContainer}>
              <View style = {{...styles.infoContainer, marginTop : mvs(22)}}>
                  <Regular label = "Product price" style = {styles.label}/>
                  <Regular label = {"US$ 903"} style = {styles.value}/>
              </View>

              <View style = {{...styles.infoContainer, marginTop : mvs(12)}}>
                  <Regular label = "USA Tax" style = {styles.label}/>
                  <Regular label = {"US$ 15"} style = {styles.value}/>
              </View>

              <View style = {{...styles.infoContainer, marginTop : mvs(12)}}>
                  <Regular label = "Urgent delivery fees" style = {styles.label}/>
                  <Regular label = {"US$ 100"} style = {styles.value}/>
              </View>

              <View style = {{...styles.infoContainer, marginTop : mvs(12)}}>
                  <Regular label = "Travel reward" style = {styles.label}/>
                  <Regular label = {"US$ 73"} style = {styles.value}/>
              </View>

              <View style = {{...styles.infoContainer, marginTop : mvs(12)}}>
                  <Regular label = "Taketo fee" style = {styles.label}/>
                  <Regular label = {"US$ 10"} style = {styles.value}/>
              </View>

              <View style = {{...styles.infoContainer, marginTop : mvs(12)}}>
                  <Regular label = "Payment Processing" style = {styles.label}/>
                  <Regular label = {"US$ 0.5"} style = {styles.value}/>
              </View>

              <View style = {{...styles.line, marginTop : mvs(10)}}></View>

              <View style = {{...styles.infoContainer, marginTop : mvs(12)}}>
                  <Regular label = "Total" style = {{...styles.label, color : colors.primary, fontSize : mvs(15)}}/>
                  <Regular label = {"US$ 976"} style = {{...styles.value, color : colors.primary, fontSize : mvs(15)}}/>
                  
              </View> 
          </View>
          </View>

          <View style = {styles.methodContainer}>
            <Regular label = "Payment Method" style = {{color : colors.typeHeader, fontSize : mvs(20)}}/>
            <View style = {styles.methodInnerContainer}>
              <DualText
              content = "Taketo "
              style = {{color : colors.primary, fontSize : mvs(15)}}
              highlightText = "balance"
              highlightTextStyle = {{color : colors.typeHeader, fontSize : mvs(15)}}
              
              ></DualText>
              <View style = {{position : 'absolute', right : mvs(10)}}>
              <Check width = {mvs(18.62)} height = {mvs(14.93)}/>
            </View>
            </View>
          </View>

          <Buttons.ButtonPrimary
          title = {`Payout 976 ${profileData?.currency?.currency_code}`}
          titleStyle = {{color : colors.white}}
          style = {{marginTop : mvs(30), marginBottom : mvs(40), backgroundColor : colors.pink}}
          />
        </View> 
      </ScrollView>
    </View>
  );
};
const mapStateToProps = state => ({
  profileData: state.auth.userInfo?.profile || {},
  wallet_refund: state.wallet.wallet_refund,
});

const mapDispatchToProps = {
  fetchWalletRefundDetails: order_id =>
    TAKE_TO_ACTIONS.fetchWalletRefundDetails(order_id),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WalletPayoutDetail);

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
    // paddingTop:mvs(27)
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
    //marginTop: mvs(30),
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
    marginTop: mvs(14.9),
    //borderWidth : 1,
    alignItems : 'flex-end',
    paddingLeft : mvs(134)
    //height: mvs(55),
    //borderWidth : 1,
    // borderColor : 'green'
  },
  SUB_LOCATION_DESTINATION: {
    // flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "100%",
    // backgroundColor:'red'
    //borderWidth:1,
    // borderColor : 'orange'
  },
  USER_IMAGE_CONTAINER: {
    //width: mvs(54),
    borderRadius: mvs(10),
    //borderWidth :1,
    position : 'absolute',
    left : 0
  },
  SUB_USER_IMAGE_CONTAINER: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
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
    backgroundColor: colors.pink,
    marginTop: mvs(10),
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
  },
  moreInfoContainer: {
    //paddingHorizontal: mvs(20),
    backgroundColor: colors.white,
    //marginTop: mvs(22),
    //paddingBottom: mvs(22),
    //borderRadius: mvs(10),
    //borderWidth:1
  },
  statusContainer: {
    width : '100%',
    //borderWidth : 1,
    //height : mvs(30),
    marginTop : mvs(46)
  },
  headingContaner: {
    width : '100%',
    flexDirection : 'row',
    justifyContent : 'space-between',
  },
  reasonContainer: {
    height : mvs(35),
    width : '100%',
    paddingHorizontal : mvs(10),
    marginTop : mvs(11),
    borderRadius : mvs(10),
    borderColor : colors.border,
    borderWidth : 0.3,
    justifyContent : "center"
    //alignItems : 'center'
  },
  methodContainer: {
    //ßheight : mvs(78),
    width : '100%',
    backgroundColor : colors.white,
    marginTop : mvs(24),
    //paddingHorizontal: mvs(10),
    //paddingBottom : mvs(11),
    //borderWidth:1
  },
  methodInnerContainer: {
    height : mvs(38),
    width : '100%',
    marginTop : mvs(11),
    backgroundColor : colors.secondary,
    borderRadius : mvs(10),
    justifyContent : 'center',
    paddingHorizontal : mvs(10)
  },
  summaryContainer: {
    borderWidth : mvs(0.5), 
    marginTop : mvs(30), 
    paddingBottom : mvs(21), 
    paddingHorizontal : mvs(10),
    borderRadius : mvs(10),
    borderColor : colors.doted
  }
  // reasonContainer: {
  //   height: mvs(40),
  //   borderRadius: mvs(10),
  //   width: '100%',
  //   borderWidth: 1,
  //   borderColor: colors.border,
  //   marginTop: mvs(115),
  //   marginBottom : mvs(40),
  //   paddingHorizontal: mvs(10),
  //   justifyContent: 'center',
  // },
});
