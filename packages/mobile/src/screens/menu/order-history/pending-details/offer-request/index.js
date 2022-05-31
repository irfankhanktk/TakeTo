import services from '@khan_ahmad786/common/api/services';
import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet, TouchableOpacity,
  View
} from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import * as Images from '../../../../../../resource/assets/order-car-icons';
import Buttons from '../../../../../components/atoms/Button';
import OrderDestination from '../../../../../components/atoms/OrderDestination';
import OrderDestinationAddress from '../../../../../components/atoms/OrderDestinationAddress';
import ImagePlaceholder from '../../../../../components/atoms/Placeholder';
import Header from '../../../../../components/molecules/header/header-1x';
import StatusModal from '../../../../../components/molecules/modals/status-modal';
import ProductInfo from '../../../../../components/molecules/product-info';
import colors from '../../../../../config/colors';
import fonts from '../../../../../config/fonts';
import { mvs } from '../../../../../config/metrices';
import Medium from '../../../../../presentation/typography/medium-text';
import Regular from '../../../../../presentation/typography/regular-text';


const OfferRequest = props => {
  const {
    navigation,
    route,
    fetchOrderHistoryOffersDetails,
    orderHistoryOfferDetails: offer_details,
    fetchOrderHistory,
    fetchSingleOrderHistoryOffers,
    fetchHomeOrders,
    makeEmptyInbox
  } = props;

  const { offer_id } = route?.params;
  const CarActive = Images['car_active'];
  const Location = Images['location'];
  const LocationBlue = Images['location_active'];
  const Chat = Images['chat'];
  //const Location = ImagesCommon['location_pink'];

  const [approveModal, setApproveModal] = useState(false);
  const [declineModal, setDeclineModal] = useState(false);

  const [loading, setLoading] = React.useState(true);
  const [chatLoading, setChatLoading] = useState(false)
  const alertRef = React.useRef();
  const scrollRef = React.useRef();
  const [btnLoader, setBtnLoader] = React.useState(false);
  const [btnLoaderReject, setBtnLoaderReject] = React.useState(false);
  const [btnLoaderThread, setBtnLoaderThread] = React.useState(false);
  // console.log(history_orders)

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await fetchOrderHistoryOffersDetails(offer_id);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        // scrollRef.current.scrollTo({x: 0, y: 0, animated: true});
        alertRef.current.alertWithType(
          'error',
          'Error',
          UI_API._returnError(error),
        );
      }
    })();
  }, []);

  // console.log(offer_details)
  // console.log({
  //   traveller_id: offer_details?.offer_by?.user_id,
  // })

  const approveOfferHandler = async () => {
    try {
      setApproveModal(false);
      setBtnLoader(true);
    
      const thread_id = await client.post(`${services.messanger.create_thread}`, {
       offer_id: offer_id
      });

      const payload = {
        offer_id: offer_id,
        order_request_id: offer_details?.order_id,
        reward: offer_details?.raw_offer_reward_price, // after negotiation final reward price will be sent
        //thread_id: thread_id?.data
      };
      // console.log(payload);
      
      await client.post(`${services.create_order.accept_offer}`, payload);

      await fetchOrderHistory(false);
      await fetchHomeOrders()
      // setApproveModal(false);
      setTimeout(() => {
        props.navigation.navigate('orderhistory');
      }, 2000)
      setBtnLoader(false);
    } catch (error) {
      setBtnLoader(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };

  const createThreadonMessageTraveler = async () => {
    try {
      setBtnLoaderThread(true);
      if (offer_details?.thread_id !== null) {
        //move to chat screen with thread_id
      } else {
        await client.post(`${services.messanger.create_thread}`, {
          offer_id: offer_id,
        });
      }
      // setDeclineModal(true);
      setBtnLoaderThread(false);
    } catch (error) {
      setBtnLoaderThread(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };
  const navigateToThread = async () => {
    setChatLoading(true)
    // console.log("Offer Details: ", offer_details);
    var threadId = offer_details?.thread_id;
    if(offer_details?.thread_id == null){
      var response = await client.post(`${services.messanger.create_thread}`, {
        offer_id: offer_id
    });
    threadId = response?.data;
    //console.log("Response of create thread: ", response?.data);
    }
    setChatLoading(false)
    makeEmptyInbox()
    navigation.replace("chat", {thread_id: threadId, participant_name: offer_details.user_name,previous_screen:'offerrequest'})
  };


  const rejectOfferHandler = async () => {
    try {
      setDeclineModal(false)
      setBtnLoaderReject(true);
      //console.log(payload);
      await client.get(`${services.create_order?.reject_offer}/${offer_id}`);
      await fetchOrderHistory(false);
      await fetchSingleOrderHistoryOffers(offer_details?.order_id);
      setBtnLoaderReject(false);
      props.navigation.pop();
    } catch (error) {
      setBtnLoaderReject(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };
  // console.log(offer_details)

  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <View style={{ backgroundColor: colors.white }}>
          <Header {...props} title="offer details" allowBackBtn bellIcon />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Chase size={mvs(30)} color={colors.primary} />
        </View>
      </View>
    );
  } else if (!loading && Object.keys(offer_details).length <= 0) {
    return (
      <View style={styles.mainContainer}>
        <View style={{ backgroundColor: colors.white }}>
          <Header {...props} title="offer details" allowBackBtn bellIcon />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: mvs(20),
          }}>
          <Regular
            label={`Oops! it seems something went wrong. While fetching your offers details`}
            style={{ textAlign: 'center', color: colors.primary }}
          />
        </View>
      </View>
    );
  } else
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.mainContainer}>

        <View style={{ backgroundColor: colors.white }}>
          <Header {...props} title="offer details" allowBackBtn bellIcon />
        </View>
        {console.log('offer_details::',offer_details?.order_gallery)}
        <ScrollView contentContainerStyle={{ flexGrow: 1,paddingTop:mvs(27) }}>
          <View style={styles.optionsContainer}>
            <ProductInfo
              disabled={false}
              order_img={offer_details?.order_image}
              name={offer_details?.order_title}
              total={`${offer_details?.order_price}`}
              priceTitle="Product Price"
              reward={` ${offer_details?.order_reward_price}`}
              order_gallery={offer_details?.order_gallery}
            />
            <View style={styles.trackMainContainer}>
              <View style={styles.SUB_LOCATION_DESTINATION}>
                <OrderDestination
                  label={
                    ' - - - - - - - - - - - - - - - - - - - - - - - - - - '
                  }
                  value={0}
                  width={2 == 2 ? mvs(100) : mvs(50)}
                  SVGFirst={
                    offer_details?.is_international
                      ? Images.aeroplane
                      : Images.car
                  }
                  SVGSecond={Location}
                />
                <View style={{ marginTop: mvs(8) }} />
                <OrderDestinationAddress
                  imageFrom={{ uri: offer_details?.order_from_flag }}
                  imageTo={{ uri: offer_details?.order_to_flag }}
                  label={`${offer_details?.order_from?.slice(0,15)} - ${offer_details?.order_to?.slice(0,15)}`}
                  fontSize={mvs(12)}
                />
              </View>
            </View>
          </View>

          <View style={{ ...styles.normal }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('userprofile', { user_id: offer_details?.offer_by?.user_id })}
              style={styles.profileMainContainer}>
              <Regular
                label="Deliverer Profile"
                style={{ color: colors.typeHeader, fontSize: mvs(14) }}
              />
              <View style={styles.profileContainer}>
                <ImagePlaceholder
                  bg_img={offer_details?.offer_by?.user_image}
                  containerStyle={{
                    height: '100%',
                    width: mvs(37),
                    borderRadius: mvs(8),
                    //backgroundColor :'red'
                  }}
                />
                <Regular
                  label={offer_details?.offer_by?.user_name}
                  style={{ color: colors.primary, marginLeft: mvs(5) }}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.container}>
            <View style={styles.rewardContainer}>
              <Regular
                label="Requested Reward"
                style={{
                  ...styles.value,
                  fontSize: mvs(15),
                  color: colors.headerTitle,
                }}
              />
              <Medium
                label={`${offer_details?.offer_reward_price}`}
                style={styles.rewardValue}
              />
            </View>

            <View style={styles.buttonsContainer}>
              <View style={styles.button}>
                <Buttons.ButtonPrimary
                  onClick={() => setApproveModal(true)}
                  loading={btnLoader}
                  loaderColor={colors.white}
                  disabled={btnLoader}
                  title="Approve"
                  style={{ backgroundColor: colors.green }}
                />
              </View>
              <View style={styles.button}>
                <Buttons.ButtonPrimary
                  onClick={() => setDeclineModal(true)}
                  loading={btnLoaderReject}
                  loaderColor={colors.white}
                  disabled={btnLoaderReject}
                  title="Reject"
                  style={{ backgroundColor: colors.pink }}
                />
              </View>
            </View>

            <TouchableOpacity
              disabled={chatLoading}
              onPress={navigateToThread}
              style={styles.chatContainer}>
              {chatLoading?
              <Chase
              size={mvs(20)}
              color = {colors.white}
              />
              :  
              <>  
              <Chat />
              <Regular
                label="Message Traveller"
                style={{ ...styles.value1, color: colors.white }}
              />
              </>   
             }
            </TouchableOpacity>
          </View>
        </ScrollView>
        <StatusModal
          title="Approve Reward"
          visible={approveModal}
          endButton
          name={offer_details?.offer_by?.user_name}
          buttonTitle={'Confirm'}
          endButtonTitle={'Cancel'}
          mainButton
          product
          onClose={() => {
            setApproveModal(false);
            // props.navigation.navigate('orderhistory');
          }}
          onConfirm={() => approveOfferHandler()}
        />

        <StatusModal
          title="Reject Offer"
          name={offer_details?.offer_by?.user_name}
          visible={declineModal}
          mainButton
          endButton
          buttonTitle={'Confirm & Prceed to Offers'}
          endButtonTitle={'Cancel'}
          onClose={() => {
            setDeclineModal(false);
          }}
          onConfirm={rejectOfferHandler}
        />
        <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'} inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
      </KeyboardAvoidingView>
    );
};
export const mapStateToProps = state => ({
  orderHistoryOfferDetails: state.menu_orders?.orderHistoryOfferDetails,
});

export const mapDispatchToProps = {
  fetchOrderHistoryOffersDetails: offer_id =>
    TAKE_TO_ACTIONS.fetchOrderHistoryOffersDetails(offer_id),
  fetchOrderHistory: local => TAKE_TO_ACTIONS.fetchOrderHistory(local),
  fetchSingleOrderHistoryOffers: order_id =>
    TAKE_TO_ACTIONS.fetchSingleOrderHistoryOffers(order_id),
  fetchHomeOrders: () => TAKE_TO_ACTIONS.fetchHomeOrders(),
  makeEmptyInbox: () => TAKE_TO_ACTIONS.makeEmptyInbox(),
};
export default connect(mapStateToProps, mapDispatchToProps)(OfferRequest);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  optionsContainer: {
    // height: mvs(270),
    width: '100%',
    borderBottomEndRadius: mvs(20),
    borderBottomStartRadius: mvs(20),
    backgroundColor: colors.white,
    paddingBottom: mvs(20),
    paddingHorizontal: mvs(22),
    //paddingTop: mvs(30),
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
    marginTop: mvs(10),
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
    borderBottomWidth: 0.3,
    borderColor: colors.horizontalLine,
    marginTop: mvs(11),
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
    //flex: 1,
    paddingHorizontal: mvs(22),
    //borderWidth : 1,
    width: '100%',
    paddingBottom: mvs(40),
    marginTop: mvs(200),
    // position : "absolute",
    // bottom : 0
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
  rewardContainer: {
    height: mvs(58),
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: mvs(10),
    marginTop: mvs(27),
    paddingHorizontal: mvs(10),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.lightgrey2,
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
    // borderWidth: 0.5,
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
    width: '60%',
  },
  SUB_LOCATION_DESTINATION: {
    // flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'flex-end',

    // backgroundColor:'red'
    //borderWidth:1,
    // borderColor : 'orange'
  },
  profileMainContainer: {
    height: mvs(37),
    width: '100%',
    //borderWidth : 1,
    //marginTop: mvs(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileContainer: {
    height: '100%',
    //width : mvs(126),
    //borderWidth:1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackMainContainer: {
    //borderWidth : 1,
    width: '100%',
    paddingLeft: mvs(113),
    marginTop: mvs(22),
  },
});
