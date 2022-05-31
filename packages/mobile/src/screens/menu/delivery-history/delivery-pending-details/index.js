import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { TAKE_TO_IMAGES } from '../../../../../resource/assets/image_resouce';
import * as Images from '../../../../../resource/assets/order-car-icons';
import * as SVG from '../../../../../resource/assets/tabbar-icons';
import Buttons from '../../../../components/atoms/Button';
import OrderDestination from '../../../../components/atoms/OrderDestination';
import OrderDestinationAddress from '../../../../components/atoms/OrderDestinationAddress';
import ImagePlaceholder from '../../../../components/atoms/Placeholder';
import Header from '../../../../components/molecules/header/header-1x';
import ProductInfo from '../../../../components/molecules/product-info';
import colors from '../../../../config/colors';
import fonts from '../../../../config/fonts';
import { mvs } from '../../../../config/metrices';
import Light from '../../../../presentation/typography/light-text';
import Medium from '../../../../presentation/typography/medium-text';
import Regular from '../../../../presentation/typography/regular-text';
import * as ImagesCommon from '../../../../../resource/assets/common-icons';
import InputWithTitle from '../../../../components/molecules/input-with-title';
import Widthdraw from '../../../../components/molecules/modals/widthdraw';

const DeliveryPendingDetails = props => {
  const {
    navigation,
    route,
    fetchOrderHistoryOffersDetails,
    orderHistoryOfferDetails: offer_details,
    profileData
  } = props;

  const {offer_id} = route?.params;
  const CarActive = Images['car_active'];
  const Location = Images['location'];
  const LocationBlue = Images['location_active'];
  const Chat = Images['chat'];
  //const Location = ImagesCommon['location_pink'];

  const [widthdrawModal, setWidthdrawModal] = useState(false)

  React.useEffect(() => {
    fetchOrderHistoryOffersDetails();
    // alert("Offer_id : "+offer_id)
  }, []);


  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.mainContainer}>
      <View style={{backgroundColor: colors.white}}>
        <Header {...props} title="offer details" allowBackBtn bellIcon/>
      </View>
      <View style={{flex: 1}}>
        <ScrollView>
          <View style={styles.optionsContainer}>
            <ProductInfo
              order_img={offer_details?.order_image}
              //name={offer_details?.order_title}
              name="iPhone 13 Pro 128GB Sierra blue"
              total={`US$ ${offer_details?.order_price}`}
              priceTitle="Product Price"
              reward={`US$ ${offer_details?.order_reward_price}`}
              detailsContainer={{marginLeft : mvs(30)}}
            />
            <View style = {styles.trackMainContainer}>
            <View style={styles.SUB_LOCATION_DESTINATION}>
                <OrderDestination
                  value={2}
                  width={2 == 2 ? mvs(100) : mvs(50)}
                  SVGFirst={CarActive}
                  SVGSecond={Location}
                />
                <View style={{marginTop: mvs(8)}} />
                <OrderDestinationAddress
                  imageFrom={TAKE_TO_IMAGES.flag1}
                  imageTo={TAKE_TO_IMAGES.flag2}
                  label={`${"PAK"} - ${'USA'}`}
                  fontSize={12}
                />
              </View>
              <View style = {styles.userContainer}>
                <ImagePlaceholder
                containerStyle = {{height : mvs(37), width : mvs(37), borderRadius : mvs(8)}}
                />
                <Regular label = "Emily" style = {{fontSize : mvs(10), alignSelf : "center"}}/>
              </View>
          </View>
          </View>

          

          <View style={{...styles.normal}}>
          <View style = {styles.line}/>

          <InputWithTitle
          singleInput
          title = "Product Details"
          placeholder = "Lorem ipsum"
          value = "Lorem ipsum"
          multiline
          style = {{marginTop : mvs(17)}}
          textStyle = {{color : colors.primary}}
          />
            {/* <View style={styles.titleContainer}>
              <View style={styles.userContainer}>
                <ImagePlaceholder
                  bg_img={offer_details?.offer_by_image}
                  containerStyle={styles.dp}
                />
                <Regular label={offer_details?.offer_by} style={styles.name} />
              </View>
              <Regular
                onPress={() => props.navigation.navigate('userprofile')}
                label="Profile"
                style={styles.title}
              />
            </View> */}

            <View style={{...styles.infoContainer, marginTop: mvs(17)}}>
              <Regular label="Urgent Delivery" style={{...styles.label, color : colors.pink}} />
              <Regular
                label={"Within 24 hours"}
                style={{...styles.value, color : colors.pink}}
              />
            </View>

            {/* <View style={styles.line}></View> */}

            <View style={{...styles.infoContainer}}>
              <Regular label="Quantity" style={styles.label} />
              <Regular
                label={offer_details?.order_quantity}
                style={styles.value}
              />
            </View>

            <View style={{...styles.infoContainer}}>
              <Regular label="Packaging" style={styles.label} />
              <Regular
                label={
                  offer_details?.order_packaging ? 'With box' : 'Without box'
                }
                style={styles.value}
              />
            </View>

            <View style={{...styles.infoContainer, marginTop: mvs(14)}}>
              <Regular label="Where to buy" style={styles.label} />
              <Regular
                label={offer_details?.order_store_url}
                style={{
                  ...styles.value,
                  color: colors.primary,
                  fontSize: mvs(12),
                }}
              />
              <View style={{flexDirection: 'row', alignItems: 'center', marginRight : mvs(6)}}>
                <LocationBlue />
                <Regular
                  label="Store location"
                  style={{
                    ...styles.value,
                    marginLeft: mvs(7.3),
                    color: colors.primary,
                    fontSize: mvs(12),
                  }}
                />
              </View>
            </View>

            <View style = {{...styles.line, marginTop : mvs(14)}}/>

            <InputWithTitle
              singleInput
              title = "Buying Instructions"
              placeholder = "Lorem ipsum"
              value = "Lorem ipsum"
              multiline
              style = {{marginTop : mvs(17)}}
              textStyle = {{color : colors.primary}}
              titleStyle = {{fontSize : mvs(14)}}
              />

              {/* <View style = {styles.profileMainContainer}>
                <Regular label = "Buyer Profile" style = {{color : colors.typeHeader, fontSize : mvs(14)}}/>
                <View style = {styles.profileContainer}>
                  <ImagePlaceholder
                  containerStyle = {{
                    height : "100%",
                    width : mvs(37),
                    borderRadius : mvs(8),
                    //backgroundColor :'red'
                  }}
                  />
                  <Regular label = "Zenab Thaqi" style = {{color : colors.primary, marginLeft : mvs(5)}}/>
                </View>
              </View> */}
          </View>

          <View style={styles.container}>
            {/* <View style={styles.buyingInstractions}>
              <Regular label="Buying instructions" style={styles.value} />
              <TextInput
                style={styles.input}
                multiline={true}
                placeholder={'Enter your note here'}
              />
            </View> */}

            <View style={styles.rewardMainContainer}>
              <View style = {styles.rewardContainer}>
                <Regular label = "Requested Reward" style = {{color : colors.typeHeader}}/>
              </View>
              <View style = {{...styles.rewardContainer,alignItems : 'flex-start', paddingLeft : mvs(11)}}>
                <Medium label = "35" style = {{color : colors.primary, fontSize : mvs(23)}}/>
                <Regular label = {`${profileData?.currency?.currency_code}`} style = {{color : colors.typeHeader, fontSize : mvs(23), position : "absolute", right : mvs(11)}}/>
              </View>
            </View>

            <Buttons.ButtonPrimary
            title = "Widthdraw Offer"
            style = {{backgroundColor : colors.pink, marginTop : mvs(10)}}
            onClick = {() => {setWidthdrawModal(true)}}
            />
            {/* {
              offer_details?.thread_id !== null && */}
            <TouchableOpacity 
            onPress = {() => props.navigation.navigate('chat')}
            style={styles.chatContainer}>
              <Chat />
              <Regular label="Message Buyer" style={{...styles.value1, color : colors.white}} />
            </TouchableOpacity>
            {/* } */}
            {/* <View style={styles.buttonsContainer}>
              <View style={styles.button}>
                <Buttons.ButtonPrimaryLight
                  onClick={() => {
                    props.navigation.navigate('approve');
                  }}
                  title="Accept"
                  style={{backgroundColor: colors.green}}
                />
              </View>
              <View style={styles.button}>
                <Buttons.ButtonPrimaryLight
                  onClick={() => {}}
                  title="Decline"
                  style={{backgroundColor: colors.pink}}
                />
              </View>
            </View> */}
          </View>
        </ScrollView>
      </View>
      <Widthdraw
      visible = {widthdrawModal}
      title = "Widthdraw"
      name = "Black Hat | Mens Wear Sico brand"
      onClose = {() => setWidthdrawModal(false)}
      onConfirm = {() => {props.navigation.pop()}}
      />
    </KeyboardAvoidingView>
  );
};
export const mapStateToProps = state => ({
  orderHistoryOfferDetails: state.menu_orders?.orderHistoryOfferDetails,
  profileData: state.auth.userInfo?.profile || {},
});

export const mapDispatchToProps = {
  fetchOrderHistoryOffersDetails: offer_id =>
    TAKE_TO_ACTIONS.fetchOrderHistoryOffersDetails(offer_id),
};
export default connect(mapStateToProps, mapDispatchToProps)(DeliveryPendingDetails);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor : colors.white
  },
  optionsContainer: {
    // height: mvs(270),
    width: '100%',
    borderBottomEndRadius: mvs(20),
    borderBottomStartRadius: mvs(20),
    backgroundColor: colors.white,
    paddingBottom: mvs(15),
    paddingHorizontal: mvs(22),
   // paddingTop: mvs(30),
    //borderWidth:1
  },
  optionsMainContainer: {
    flex: 1,
    paddingHorizontal: mvs(22),
  },
  option1: {
    //height : mvs(56),
    width: '100%',
    alignSelf: 'center',
    marginTop: mvs(30),
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: mvs(10),
    paddingHorizontal: mvs(10),
    paddingTop: mvs(12),
    paddingBottom: mvs(13),
  },
  option2: {
    //height : mvs(71),
    width: '100%',
    alignSelf: 'center',
    marginTop: mvs(12),
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: mvs(10),
    paddingHorizontal: mvs(10),
    paddingTop: mvs(12),
    paddingBottom: mvs(13),
  },
  optionTitle: {
    fontSize: mvs(15),
    color: colors.primary,
  },
  optionDetail: {
    fontSize: mvs(12),
    color: colors.headerTitle,
    marginTop: mvs(4),
  },
  //   buttonContainer: {
  //     marginVertical : mvs(18),
  //     paddingHorizontal : mvs(22)
  //   } ,
  trackContainer: {
    //borderWidth : 1,
    width: '68%',
    alignSelf: 'flex-end',
    height: mvs(53.92),
    marginTop: mvs(14.2),
  },
  offersMainContainer: {
    //flex : 1,
    paddingHorizontal: mvs(22),
    //borderWidth : 1
  },
  moreDetailsContainer: {
    marginTop: mvs(11),
  },
  flatlistContainer: {
    height: mvs(233),
    //borderWidth:1,
    marginTop: mvs(11),
    marginBottom: mvs(20),
  },
  normal: {
    //height  : mvs(58),
    width: '100%',
    //borderWidth : 1,
    paddingHorizontal: mvs(22),
    //borderRadius: mvs(10),
    backgroundColor: colors.white,
    paddingBottom: mvs(3),
    //marginTop: mvs(10),
    //justifyContent : 'center'
  },
  titleContainer: {
    flexDirection: 'row',
    width: '100%',
    //borderWidth : 1,
    marginTop: mvs(20.3),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: mvs(15),
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  infoContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: mvs(12),
    //borderWidth : 1,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: mvs(13),
    color: colors.lightgrey2,
  },
  value: {
    fontSize: mvs(13),
    color: colors.typeHeader,
  },
  line: {
    width: '100%',
    borderBottomWidth: mvs(0.5),
    borderColor: colors.doted,
    //marginTop: mvs(11),
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dp: {
    height: mvs(37),
    width: mvs(37),
    borderRadius: mvs(8),
  },
  name: {
    fontSize: mvs(15),
    color: colors.headerTitle,
    marginLeft: mvs(5),
  },
  container: {
    flex: 1,
    paddingHorizontal: mvs(22),
    //borderWidth : 1,
    paddingBottom: mvs(40),
  },
  buyingInstractions: {
    width: '100%',
    borderRadius: mvs(10),
    marginTop: mvs(10),
    backgroundColor: colors.white,
    paddingHorizontal: mvs(13),
    paddingVertical: mvs(13),
  },
  input: {
    //borderWidth : 1,
    fontSize: mvs(15),
    fontFamily: fonts.carosSoftRegular,
    color: colors.headerTitle,
    padding: 0,
    minHeight: mvs(60),
    textAlignVertical: 'top',
    marginTop: mvs(6),
  },
  rewardMainContainer: {
    height: mvs(58),
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: mvs(10),
    marginTop: mvs(15),
    //paddingHorizontal: mvs(10),
    //borderWidth:0.3,
    borderColor : colors.lightgrey2,
  },
  rewardValue: {
    fontSize: mvs(20),
    color: colors.green,
  },
  chatContainer: {
    height: mvs(52),
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: mvs(10),
    marginTop: mvs(12),
    borderWidth: 0.5,
    borderColor: colors.label,
  },
  value1: {
    color: colors.headerTitle,
    marginLeft: mvs(14),
  },
  buttonsContainer: {
    //height : mvs(52),
    width: '100%',
    // borderWidth : 1,
    marginTop: mvs(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: '48.5%',
  },
  routeContainer: {
    width : "60%"
  },
  SUB_LOCATION_DESTINATION: {
    // flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "100%",
    alignSelf:'flex-end',
    
    // backgroundColor:'red'
    //borderWidth:1,
    // borderColor : 'orange'
  },
  profileMainContainer: {
    height : mvs(37),
    width : '100%',
    //borderWidth : 1,
    marginTop : mvs(30),
    flexDirection : 'row',
    justifyContent : 'space-between',
    alignItems : 'center'
  },
  profileContainer: {
    height : '100%',
    //width : mvs(126),
    //borderWidth:1,
    flexDirection : 'row',
    alignItems : 'center',
  },
  trackMainContainer: {
   // borderWidth : 1,
    width : '100%',
    paddingRight : mvs(134),
    marginTop:mvs(22)
  },
  userContainer: {
    height : "100%",
    position : "absolute",
    right : 0,
    justifyContent : 'space-between'
  },
  rewardContainer: {
    width : "49%", 
    height : "100%", 
    borderRadius : mvs(10), 
    borderWidth : mvs(0.5), 
    borderColor : colors.doted,
    justifyContent : 'center', 
    alignItems:'center'
  },
});
