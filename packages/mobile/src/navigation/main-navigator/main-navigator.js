// In App.js in a new project

import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Platform } from 'react-native';
import InCallManager from 'react-native-incall-manager';
// import RNCallKeep from 'react-native-callkeep';
import uuid from 'react-native-uuid';
import { connect } from 'react-redux';
import SignInPage from '../../components/pages/auth/singIn-page';
import VoipCalling from '../../components/pages/voip-calling-ui/VoipCalling';
import VoipIncommingCall from '../../components/pages/voip-calling-ui/VoipIncommingCall';
import VoipStartCall from '../../components/pages/voip-calling-ui/VoipStartCall';
import AddTrip from '../../screens/add-trip-screen/add-trip';
import SignupScreen from '../../screens/auth/sign-up-screen';
import Chat from '../../screens/chat/chat';
import ChatDispute from '../../screens/chat/chat-dispute';
import DeliveryAddress from '../../screens/chat/delivery-address';
import BrowseOrders from '../../screens/international-delivery/browse-orders';
import InternationalDelivery from '../../screens/international-delivery/international-delivery';
import OrderDetails from '../../screens/make-offer/order-details';
import AccountInfo from '../../screens/menu/account-info';
import Approve from '../../screens/menu/approve';
import Approved from '../../screens/menu/approved';
import DeliveryHistory from '../../screens/menu/delivery-history';
import DeliveryPendingDetails from '../../screens/menu/delivery-history/delivery-pending-details';
import Disputes from '../../screens/menu/disputes';
import InviteFriends from '../../screens/menu/invite-friends';
import Menu from '../../screens/menu/menu';
import MyOffers from '../../screens/menu/my-offers';
import myOffersDetails from '../../screens/menu/my-offers/my-offers-details';
import myOrders from '../../screens/menu/my-orders';
import OrderHistory from '../../screens/menu/order-history';
import PendingDetails from '../../screens/menu/order-history/pending-details';
import OfferRequest from '../../screens/menu/order-history/pending-details/offer-request';
import PrivacyPolicy from '../../screens/menu/privacy-policy';
import SubmitRequest from '../../screens/menu/submit-request';
import TermsOfUse from '../../screens/menu/terms';
import AddBankInfo from '../../screens/menu/wallet/add-bank-info';
import Wallet from '../../screens/menu/wallet/wallet';
import WalletDeliveryDetails from '../../screens/menu/wallet/wallet-delivery-details';
import WalletHistory from '../../screens/menu/wallet/wallet-history';
import WalletPayoutDetail from '../../screens/menu/wallet/wallet-payout-detail';
import WalletRefundDetails from '../../screens/menu/wallet/wallet-refund-details';
import Notifications from '../../screens/notifications-screen/notifications';
import Onboarding2 from '../../screens/onboarding/onboarding';
import CreateOrderEStore from '../../screens/orders/create-order-estore';
import CreateOrder from '../../screens/orders';
import CreateOrderPhysicalStore from '../../screens/orders/create-order-pstore';
import DeliverTo from '../../screens/orders/deliver-to';
import DetailsConfirmation from '../../screens/orders/details-confirmation';
import HighestPaidDestinations from '../../screens/orders/highest-paid-destinition';
import International from '../../screens/orders/international';
import LocalOrders from '../../screens/orders/local-orders';
import OrderDeliveryDetail from '../../screens/orders/order-delivery-detail';
import PaymentConfirmation from '../../screens/orders/payment-confirmation';
import SearchMap from '../../screens/orders/search-map';
import StoreLocation from '../../screens/orders/store-location';
import Stores from '../../screens/popular-stores/stores';
import PrivacyAndTerms from '../../screens/privacy-files/privacyAndTerms';
import UserProfile from '../../screens/profile/user-profile';
import ChangeEmail from '../../screens/setting-screens/change-email';
import ChangePassword from '../../screens/setting-screens/change-password';
import ChangePhoneNumber from '../../screens/setting-screens/change-phone-number';
import DeliveryLocation from '../../screens/setting-screens/delivery-location';
import NewAddress from '../../screens/setting-screens/new-address';
import SavedAddress from '../../screens/setting-screens/saved-address';
import SelectAddress from '../../screens/setting-screens/select-address';
import Settings from '../../screens/setting-screens/settings';
import InternationalTrip from '../../screens/trip/international-trip/international-trip';
import LocalTrip from '../../screens/trip/local-trip/local-trip';
import TabNavigator from './tab-navigation';
const Stack = createNativeStackNavigator();


const MainNavigator = (props) => {
  const { newNotificationArrived, isProfileUpdated, fetchUserInfo, anotherEcho,profileData } = props
  const [callState, setCallState] = React.useState({
    incomming: false,
    outgoing: false,
    callstart: false

  })


  React.useEffect(() => {
    if (newNotificationArrived) {
      isProfileUpdated();
      fetchUserInfo()
    }
  }, [newNotificationArrived])
  console.log('profileData::::::out',profileData);

  // console.log(global??.navLinking)
  // console.log(props?.navigation)
  React.useEffect(() => {
    if (Object.keys(anotherEcho).length > 0&&Object.keys(profileData).length>0) {
      // alert('sdsd')
      anotherEcho.newChannel.listen('.incoming.call', (data) => {
        console.log('profileData::::::in',profileData);
        console.log("Incomming Calll", data)
        InCallManager.startRingtone('_BUNDLE_');
        global?.navLinking?.navigate("incommingcall", { data: data })
      })
      anotherEcho?.newChannel?.listen('.joined.call', (data) => {
        console.log("Joined Calll", data)
        InCallManager.stopRingtone();
        InCallManager.stop();
        global?.navLinking?.replace("joincalling", {
          sessionId: data?.id,
          //  name: "asdas",
          name: data?.owner?.name,
          profile_picture: data?.owner?.profile_picture,
          thread_id: data?.thread_id,
          call_id: data?.id,
          call: {
            type_verbose: data?.type_verbose
          },
          // data:data
        })
      })
      anotherEcho?.newChannel?.listen('.left.call', (data) => {
        console.log("left Calll", data)
        InCallManager.stopRingtone();
        InCallManager.stop();
        global?.navLinking?.goBack()
      })
      anotherEcho?.newChannel?.listen('.call.ended', (data) => {
        console.log("Calll End", data)
        InCallManager.stopRingtone();
        InCallManager.stop();
        global?.navLinking?.goBack()
      })
    }

  }, [anotherEcho])


  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="onboarding"
          screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding" component={Onboarding2} />
          <Stack.Screen name="login" component={SignInPage} />
          <Stack.Screen
            name="walletpayoutdetails"
            component={WalletPayoutDetail}
          />
          <Stack.Screen name="register" component={SignupScreen} />
          <Stack.Screen name="main" component={TabNavigator} />
          <Stack.Screen name="localorders" component={LocalOrders} />
          <Stack.Screen name="international" component={International} />
          <Stack.Screen name="stores" component={Stores} />
          <Stack.Screen
            name="internationaldelivery"
            component={InternationalDelivery}
          />
          <Stack.Screen name="orderdetails" component={OrderDetails} />
          <Stack.Screen name="settings" component={Settings} />
          <Stack.Screen name="savedaddress" component={SavedAddress} />
          <Stack.Screen name="newaddress" component={NewAddress} />
          <Stack.Screen name="deliveryaddress" component={DeliveryAddress} />
          <Stack.Screen name="selectaddress" component={SelectAddress} />
          <Stack.Screen name="changeemail" component={ChangeEmail} />
          <Stack.Screen name="changepassword" component={ChangePassword} />
          <Stack.Screen name="changephonenumber" component={ChangePhoneNumber} />
          <Stack.Screen name="createorder" component={CreateOrder} />
          <Stack.Screen
            name="orderdeliverydetail"
            component={OrderDeliveryDetail}
          />
          <Stack.Screen name="deliverylocation" component={DeliveryLocation} />
          <Stack.Screen name="menu" component={Menu} />
          <Stack.Screen name="accountinfo" component={AccountInfo} />
          <Stack.Screen name="wallet" component={Wallet} />
          <Stack.Screen name="addbankinfo" component={AddBankInfo} />
          <Stack.Screen name="wallethistory" component={WalletHistory} />
          <Stack.Screen name="invitefriends" component={InviteFriends} />
          <Stack.Screen name="orderhistory" component={OrderHistory} />
          <Stack.Screen name="deliveryhistory" component={DeliveryHistory} />
          <Stack.Screen name="disputes" component={Disputes} />
          <Stack.Screen name="pendingdetails" component={PendingDetails} />
          <Stack.Screen name="offerrequest" component={OfferRequest} />
          <Stack.Screen
            name="deliverypendingdetails"
            component={DeliveryPendingDetails}
          />
          <Stack.Screen name="approved" component={Approved} />
          <Stack.Screen name="approve" component={Approve} />
          <Stack.Screen
            name="walletdeliverydetails"
            component={WalletDeliveryDetails}
          />
          <Stack.Screen
            name="walletrefunddetails"
            component={WalletRefundDetails}
          />
          <Stack.Screen name="createorderestore" component={CreateOrderEStore} />
          <Stack.Screen
            name="createorderpstore"
            component={CreateOrderPhysicalStore}
          />
          <Stack.Screen
            name="detailsconfirmation"
            component={DetailsConfirmation}
          />
          <Stack.Screen
            name="paymentconfirmation"
            component={PaymentConfirmation}
          />
          <Stack.Screen name="userprofile" component={UserProfile} />
          <Stack.Screen name="storelocation" component={StoreLocation} />
          <Stack.Screen name="searchmap" component={SearchMap} />
          <Stack.Screen name="chat" component={Chat} />
          <Stack.Screen name="chat_dispute" component={ChatDispute} />
          <Stack.Screen name="addTrip" component={AddTrip} />
          <Stack.Screen name="submitrequest" component={SubmitRequest} />
          <Stack.Screen
            name="highestpaiddestinations"
            component={HighestPaidDestinations}
          />
          <Stack.Screen name="myoffers" component={MyOffers} />
          <Stack.Screen name="myorders" component={myOrders} />
          <Stack.Screen name="myofferdetails" component={myOffersDetails} />
          <Stack.Screen name="termsofuse" component={TermsOfUse} />
          <Stack.Screen name="privacypolicy" component={PrivacyPolicy} />
          <Stack.Screen name="notifications" component={Notifications} />
          <Stack.Screen name="deliverto" component={DeliverTo} />
          <Stack.Screen name="browseOrders" component={BrowseOrders} />
          <Stack.Screen name="webview" component={PrivacyAndTerms} />
          <Stack.Screen name="internationaltrip" component={InternationalTrip} />
          <Stack.Screen name="localtrip" component={LocalTrip} />
          <Stack.Screen name="joincalling" component={VoipCalling} />
          <Stack.Screen name="incommingcall" component={VoipIncommingCall} />
          <Stack.Screen name="startcalling" component={VoipStartCall} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};
const mapStateToProps = state => {
  return {
    inboxList: state.inbox.inboxList || {},
    profileData: state.auth.userInfo?.profile || {},
    anotherEcho: state.common?.anotherEcho || {},
  };
};
const mapDispatchToProps = dispatch => ({
  fetchUserInfo: () => dispatch(TAKE_TO_ACTIONS.fetchUserInfo()),
})
export default connect(mapStateToProps, mapDispatchToProps)(MainNavigator)