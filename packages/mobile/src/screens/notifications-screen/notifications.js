import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions'
import UI_API from '@khan_ahmad786/common/store/services'
import moment from 'moment'
import React, { useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native'
import { Chase } from 'react-native-animated-spinkit'
import DropdownAlert from 'react-native-dropdownalert'
import { connect } from 'react-redux'
import PagingLoader from '../../components/atoms/paging-loader'
import NotificationCard from '../../components/molecules/chat_card/notification-card'
import Header from '../../components/molecules/header/header-1x'
import DeliveryAddressRequest from '../../components/molecules/modals/delivery-address-request'
import ProductAcceptedModal from '../../components/molecules/modals/product-accepted-modal'
import ProductRejectedModal from '../../components/molecules/modals/product-rejected-modal'
import ReceiptDisputedModal from '../../components/molecules/modals/receipt-disputed-modal'
import RewardAcceptedModal from '../../components/molecules/modals/reward-accepted-modal'
import RewardAmountModal from '../../components/molecules/modals/reward-amount-modal'
import StatusModal from '../../components/molecules/modals/status-modal'
import colors from '../../config/colors'
import { mvs } from '../../config/metrices'
import Regular from '../../presentation/typography/regular-text'
const Notifications = (props) => {
  const { navigation, route, fetchNotifications, notifications_list, fetchUserInfo ,profileData} = props
  const { newNotificationArrived } = route?.params || {}
  const [rewardAcceptedModal, setRewardAcceptedModal] = useState(false)
  const [productAcceptedModal, setProductAcceptedModal] = useState(false)
  const [receiptAcceptedModal, setReceiptAcceptedModal] = useState(false)
  const [requestDeliveryAddress, setRequestDeliveryAddress] = useState(false)
  const [dealRejectedModal, setDealRejectedModal] = useState(false)
  const [productRejectedModal, setProductRejectedModal] = useState(false)
  const [disputeRejectedModal, setDisputeRejectedModal] = useState(false)
  const [deliveryDisputeModal, setDeliveryDisputeModal] = useState(false)
  const [deliveryConfirmedModal, setDeliveryConfirmedModal] = useState(false)
  const [wonDisputeModal, setWonDisputeModal] = useState(false)
  const [lostDisputeModal, setLostDisputeModal] = useState(false)
  const [buyerInfo, setBuyerInfo] = React.useState({})
  const [loading, setLoading] = React.useState(true);
  const alertRef = React.useRef();
  const [pageLoading, setPageLoading] = React.useState(false);

  const onPagination = async (setLoading, page) => {
    try {
      if (!page) {
        page = UI_API._returnPage(notifications_list);
        console.log('page:::::', page);
        if (!page) {
          return;
        }
      }

      setLoading(true);
      await fetchNotifications(page);
      await fetchUserInfo()
    } catch (error) {
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    // if(isFocus){

    onPagination(setLoading, 1);
    // }
  }, [profileData?.unread_notifications]);


  // React.useEffect(() => {
  //   newNotificationArrived && onPagination(setLoading, 1);
  // }, [newNotificationArrived])


  // React.useEffect(() => {
  //   (async () => {
  //     try {
  //       setLoading(true);
  //       await fetchNotifications(1);
  //       setLoading(false);
  //     } catch (error) {
  //       setLoading(false);
  //       // scrollRef.current.scrollTo({x: 0, y: 0, animated: true});
  //       alertRef.current.alertWithType(
  //         'error',
  //         'Error',
  //         UI_API._returnError(error),
  //       );
  //     }
  //   })();
  // }, []);

  React.useEffect(() => {
    Object.keys(buyerInfo).length > 0 && setDeliveryConfirmedModal(true)
  }, [buyerInfo])





  { console.log('notifications_list?.data::', notifications_list?.data) }

  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <Header {...props} title='Notifications' allowBackBtn />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Chase size={mvs(30)} color={colors.primary} />
        </View>
      </View>
    );
  } else if (!loading && Object.keys(notifications_list).length <= 0 || notifications_list?.data?.length <= 0) {
    return (
      <View style={styles.mainContainer}>
        <Header {...props} title='Notifications' allowBackBtn />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: mvs(20),
          }}>
          <Regular
            label={`No record found`}
            style={{ textAlign: 'center', color: colors.primary }}
          />
        </View>
      </View>
    );
  } else

    return (
      <View style={styles.mainContainer}>
        <Header {...props} title='Notifications' allowBackBtn />
        {console.log('notifications_list::', notifications_list)}
        <View style={{ flex: 1 }}>
          {/* <View style={{paddingHorizontal:mvs(22),flexDirection:'row',justifyContent:'space-between',marginBottom:mvs(30)}}>
               <Buttons.ButtonPrimary onClick={()=>setSelectedBtn(true)} title={'Messages'} style={{width:'49%',height:mvs(44),borderWidth:selectedBtn?0:1,borderColor:colors.primary,backgroundColor:selectedBtn?colors.primary:colors.white}} textStyle={{color:selectedBtn?colors.white :colors.primary}}/>
               <Buttons.ButtonSecondaryOutline onClick={()=>setSelectedBtn(false)} title={'Notifications'} style={{width:'49%',height:mvs(44),borderWidth:selectedBtn?1:0,borderColor:colors.primary,backgroundColor:selectedBtn?colors.white:colors.primary}} textStyle={{color:selectedBtn?colors.primary :colors.white}}/>
          </View> */}
          <FlatList
            data={notifications_list?.data}
            onEndReachedThreshold={0.5}
            onEndReached={() =>{
              if(!pageLoading&&!loading)
              onPagination(setPageLoading);
             }}
            renderItem={({ item, index }) =>
              <NotificationCard
                {...props}
                user_name={item?.sender_user_name || ""}
                time={item?.time}
                user_img={item?.sender_user_image}
                counter={item?.counter || 0}
                message={item?.title || ""}
                onPress={() => {
                  //  if (!item?.data?.thread_id && !item?.data?.is_buyer) {//item?.data?.is_buyer (notification creator i.e. buyer or traveler)
                  //     props.navigation.navigate('pendingdetails', {
                  //       order_id: item?.data?.order_id,
                  //     })
                  //   }
                  if (item?.data?.message_type === 'product_image_rejected' || item?.data?.message_type === 'order_step_1' || item?.data?.message_type === 'order_step_2' || item?.data?.message_type === 'order_step_3' ||
                    item?.data?.message_type === 'order_step_4' || item?.data?.message_type === 'order_step_5' ||
                    item?.data?.message_type === 'order_step_6' || item?.data?.message_type === 'order_step_7' ||
                    item?.data?.message_type === 'order_step_8' ||
                    item?.data?.message_type === 'offer_made') {
                    props.navigation.navigate('chat', {
                      thread_id: item?.data?.thread_id
                    })
                  } else if (item?.data?.message_type === 'order_delivery_confirmed') {
                    setBuyerInfo({
                      user_id: item?.data?.buyer_id,
                      is_review: true,
                      order_id: item?.data?.order_id,
                      order_reward: item?.data?.order_reward
                    })
                    //rate to buyer
                  }
                  // else if (item?.data?.message_type === 'order_step_7' || item?.data?.message_type === 'order_step_5' || item?.data?.message_type === 'order_step_3' || item?.data?.message_type === 'order_step_1' && item?.data?.is_buyer) {
                  //   props.navigation.navigate('chat', {
                  //     thread_id: item?.data?.thread_id
                  //   })
                  // }
                  else if (item?.data?.message_type === 'order_step_2_rejected' ||
                    item?.data?.message_type === 'order_step_4_rejected' ||
                    item?.data?.message_type === 'order_delivery_disputed') {
                    props.navigation.navigate('disputes')
                    //dispute
                  } else if (item?.data?.message_type === 'rejected offer' || item?.data?.message_type === 'rejected_offer') {
                    //idhr hi rhny 2
                  } else if (item?.data?.message_type === 'save_offer' ||
                    item?.data?.message_type === 'offer made') {
                    props.navigation.navigate('pendingdetails', {
                      order_id: item?.data?.order_id,
                    })
                  }

                  // if (item?.message == "Reward accepted") {
                  //   setRewardAcceptedModal(true)
                  // } else if (item?.message == "Product accepted") {
                  //   setProductAcceptedModal(true)
                  // } else if (item?.message == "Receipt accepted") {
                  //   setReceiptAcceptedModal(true)
                  // } else if (item?.message == "Delivery address sent") {
                  //   props.navigation.navigate('chat')
                  // } else if (item?.message == "Delivery confirmed") {
                  //   setDeliveryConfirmedModal(true)
                  // } else if (item?.message == "Deal rejected") {
                  //   setDealRejectedModal(true)
                  // } else if (item?.message == "Product rejected") {
                  //   setProductRejectedModal(true)
                  // } else if (item?.message == "Receipt disputed") {
                  //   setDisputeRejectedModal(true)
                  // } else if (item?.message == "Delivery disputed") {
                  //   setDeliveryDisputeModal(true)
                  // } else if (item?.message == "You won the delivery dispute.") {
                  //   setWonDisputeModal(true)
                  // } else if (item?.message == "You lost the delivery dispute.") {
                  //   setLostDisputeModal(true)
                  // }
                }}
              />
            }
            keyExtractor={(item, index) => index?.toString()}
            style={styles.conversationsContainer}
            contentContainerStyle={{ paddingBottom: mvs(46),paddingTop:mvs(27) }}
          />
          {pageLoading && <PagingLoader />}
        </View>

        <RewardAcceptedModal
          visible={rewardAcceptedModal}
          onClose={() => { setRewardAcceptedModal(false) }}
          onSendButton={() => { props.navigation.navigate('chat') }}
        />
        <ProductAcceptedModal
          visible={productAcceptedModal}
          onClose={() => { setProductAcceptedModal(false) }}
          onSendButton={() => { props.navigation.navigate('chat') }}
        />
        <StatusModal
          visible={receiptAcceptedModal}
          buttonTitle="Request Delivery Address"
          endButton
          endButtonTitle="Back"
          title="Receipt Accepted"
          onConfirm={() => {
            setReceiptAcceptedModal(false)
            setRequestDeliveryAddress(true)
          }}
          onClose={() => { setReceiptAcceptedModal(false) }}
        />
        <StatusModal
          visible={dealRejectedModal}
          mainButton={false}
          endButtonTitle="Back"
          endButton
          endButtonStyle={{ marginTop: mvs(30) }}
          title="Deal Rejected"
          onClose={() => { setDealRejectedModal(false) }}
        />
        <DeliveryAddressRequest
          visible={requestDeliveryAddress}
          onClose={() => { setRequestDeliveryAddress(false) }}
        />
        <ProductRejectedModal
          visible={productRejectedModal}
          onBackButton={() => { setProductRejectedModal(false) }}
          onSendButton={() => { props.navigation.navigate('chat') }}
          endButtonTitle="Back"
        />
        <ReceiptDisputedModal
          visible={disputeRejectedModal}
          onClose={() => { setDisputeRejectedModal(false) }}
          title="Receipt Disputed"
          userInfo
          attach={false}
          dispute
        />
        <ReceiptDisputedModal
          visible={deliveryDisputeModal}
          onClose={() => { setDeliveryDisputeModal(false) }}
          title="Delivery Disputed"
          userInfo
          attach={false}
          type="Delivery"
          dispute
          endButton
        />
        <RewardAmountModal
          visible={deliveryConfirmedModal}
          mainButton
          amount={buyerInfo?.order_reward || 0}
          onClose={setDeliveryConfirmedModal}
          onConfirm={() => {
            setDeliveryConfirmedModal(false)
            props.navigation.navigate("userprofile", { ...buyerInfo, is_review: true, is_traveler: true })
          }}
          buttonTitle={"Rate the Buyer"}
          title="Congratulations"
          deliveryConfirmed
          amountTitle="Reward"
        />
        <RewardAmountModal
          visible={wonDisputeModal}
          mainButton
          onConfirm={() => {
            setWonDisputeModal(false)
            props.navigation.navigate("userprofile")
          }}
          buttonTitle={"Rate Buyer"}
          title="Delivery Dispute Result"
          amountTitle="Refunded amount"
          onClose={() => { }}
        />
        <RewardAmountModal
          visible={lostDisputeModal}
          endButton
          onConfirm={() => {
            setLostDisputeModal(false)
            props.navigation.navigate("userprofile")
          }}
          endButtonTitle="Back"
          title="Delivery Dispute Result"
          amountTitle="Amount"
          lost
          amount="US$ -1,049"
          onClose={() => { setLostDisputeModal(false) }}
        />
        <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'} inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
      </View>
    )
}
export const mapStateToProps = state => ({
  notifications_list: state.common_orders_list?.notifications_list,
  profileData: state.auth.userInfo || {},
});

export const mapDispatchToProps = dispatch => ({
  fetchNotifications: (page) => dispatch(TAKE_TO_ACTIONS.fetchNotifications(page)),
  fetchUserInfo: () => dispatch(TAKE_TO_ACTIONS.fetchUserInfo()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white
  },
  conversationsContainer: {
    flex: 1,
    paddingHorizontal: mvs(22),
  }
})
