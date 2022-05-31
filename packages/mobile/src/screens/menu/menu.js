import services from '@khan_ahmad786/common/api/services';
import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import * as Images from '../../../resource/assets/customer-care';
import * as SVGS from '../../../resource/assets/order-car-icons';
import DualText from '../../components/molecules/dual-text/dual-text';
import Header from '../../components/molecules/header/header-1x';
import TAKE_TO_COMMON_MODAL from '../../components/molecules/modals/common-modal';
import PhoneVerificationModal from '../../components/molecules/modals/setting-modals/phone-verification-modal';
import colors from '../../config/colors';
import { mvs } from '../../config/metrices';
import { disconnectEcho } from '../../config/sockets';
import Medium from '../../presentation/typography/medium-text';
import Regular from '../../presentation/typography/regular-text';

const Menu = props => {

  const { isGuest, profileData, updateUserProfile, counter, fetchUserInfo, clearMenuPagination } = props;
  const Whatsapp = Images['whatsapp'];
  const Submit = Images['submit_request'];
  const Down = SVGS['down'];

  const [openCurrModal, setOpenCurrModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [verifyNumberModal, setVerifyNumberModal] = React.useState(false)
  const alertRef = React.useRef();


  const showGuestAlert = () => {
    Alert.alert(
      'Alert',
      'You are a guest, please register yourself',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        { text: 'OK', onPress: () => props?.navigation?.navigate('login') }
      ]
    );
  }

  console.log(' props?.anotherEcho:::', props?.anotherEcho);
  const onSignOut = async () => {
    props.resetReducer();
    props?.anotherEcho?.anotherEcho?.disconnect();
    await client.delete(services.auth.logout)
    await AsyncStorage.multiRemove(['@token']);
    props.navigation.reset({ index: 0, routes: [{ name: 'login' }] });

  };

  const updateCurrency = async (item) => {
    try {
      setLoading(true);
      const newPayload = {
        currency_id: item?.id
      };
      await updateUserProfile(newPayload);
      alertRef.current.alertWithType(
        'success',
        'Currency updated',
        'Your account currency updated succesfully.',
      );
      setOpenCurrModal(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setOpenCurrModal(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };


  React.useEffect(() => {
    const unsubscribe = props?.navigation.addListener('focus', () => {
      (async () => {
        try {
          if(!isGuest){
            await fetchUserInfo();
          }
          clearMenuPagination();
        } catch (error) {
          alertRef.current.alertWithType(
            'error',
            'Error',
            UI_API._returnError(error),
          );
        }
      })()
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [props.navigation]);


  console.log(profileData?.country)



  return (
    <View style={styles.mainContainer}>
      <Header {...props} title="Menu" allowBackBtn avatar userIcon={false} />

      <View style={{ flex: 1, }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.menuContainer}>
          <TouchableOpacity

            activeOpacity={0.5}
            style={styles.option}
            onPress={() => {
              isGuest
                ? showGuestAlert()
                : props.navigation.navigate('accountinfo');
            }}>
            <Regular label="Account Info" style={styles.optionTitle} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              isGuest
                ? showGuestAlert()
                : props.navigation.navigate('settings');
            }}
            style={styles.option}>
            <Regular label="Settings" style={styles.optionTitle} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              isGuest
                ? showGuestAlert()
                : props.navigation.navigate('wallet', { state: false });
            }}
            style={styles.option}>
            <Regular label="Wallet" style={styles.optionTitle} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              isGuest
                ? showGuestAlert()
                : props.navigation.navigate('orderhistory');
            }}
            style={styles.option}>
            <Regular label="Order History" style={styles.optionTitle} />
            {counter?.order_history > 0 && <View style={styles.counterContainer}>
              <Medium label={counter?.order_history} style={{ color: colors.white }} />
            </View>}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              isGuest
                ? showGuestAlert()
                : props.navigation.navigate('deliveryhistory');
            }}
            style={styles.option}>
            <Regular label="Delivery History" style={styles.optionTitle} />
            {counter?.delivery_history > 0 && <View style={styles.counterContainer}>
              <Medium label={counter?.delivery_history} style={{ color: colors.white }} />
            </View>}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              isGuest
                ? showGuestAlert()
                : props.navigation.navigate('myoffers');
            }}
            style={styles.option}>
            <Regular label="My Offers" style={styles.optionTitle} />
            {counter?.my_offers > 0 && <View style={styles.counterContainer}>
              <Medium label={counter?.my_offers} style={{ color: colors.white }} />
            </View>}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              isGuest
                ? showGuestAlert()
                : props.navigation.navigate('myorders');
            }}
            style={styles.option}>
            <Regular label="My Orders" style={styles.optionTitle} />
            {counter?.my_orders > 0 && <View style={styles.counterContainer}>
              <Medium label={counter?.my_orders} style={{ color: colors.white }} />
            </View>}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              isGuest
                ? showGuestAlert()
                : props.navigation.navigate('disputes');
            }}
            style={styles.option}>
            <Regular label="Disputes" style={styles.optionTitle} />
            {counter?.disputes > 0 && <View style={styles.counterContainer}>
              <Medium label={counter?.disputes} style={{ color: colors.white }} />
            </View>}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              props.navigation.navigate('invitefriends');
            }}
            style={{ ...styles.option, borderBottomWidth: 0 }}>
            <Regular label="Invite Friends" style={styles.optionTitle} />
          </TouchableOpacity>

          <View style={styles.socialContainer}>
            <View style={styles.social}>
              <Whatsapp />
              <Regular
                label="Ask in WhatsApp"
                style={{ color: colors.typeHeader, marginTop: mvs(12) }}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                props.navigation.navigate('submitrequest');
              }}
              style={styles.social}>
              <Submit />
              <Regular
                label="Submit a request"
                style={{ color: colors.typeHeader, marginTop: mvs(12) }}
              />
            </TouchableOpacity>
          </View>
          {/* <View style={styles.optionCare}>
            <Regular label="Customer Care" style={styles.optionTitle} />
            <View style={styles.subOption}>
              <Whatsapp />
              <Regular label="Ask in WhatsApp" style={styles.subOptionTitle} />
            </View>
            <TouchableOpacity
            activeOpacity={0.5} 
            onPress = {() => props.navigation.navigate('submitrequest')}
            style={styles.subOption}>
              <Submit />
              <Regular label="Submit a request" style={styles.subOptionTitle} />
            </TouchableOpacity>
            <TouchableOpacity
            activeOpacity={0.5}
              onPress={() => props.navigation.navigate('disputes')}
              style={styles.subOption}>
              <Submit />
              <Regular label="Disputes" style={styles.subOptionTitle} />
            </TouchableOpacity>
          </View> */}
          <View style={styles.moreOptionsContainer}>
            <View style={{ flexDirection: 'row' }}>
              <DualText
                content={'How does'}
                style={styles.moreOptionsTitle}
                highlightText={' Taketo '}
                onPress={() => { }}
                highlightTextStyle={{ color: colors.primary, fontSize: mvs(15) }}>
                <DualText content={'work?'} style={styles.moreOptionsTitle} />
              </DualText>
            </View>
            <View style={{ flexDirection: 'row', marginTop: mvs(20) }}>
              <Regular
                label="Privacy Policy"
                style={{
                  ...styles.moreOptionsTitle,
                  textDecorationLine: 'underline',
                  marginTop: 0,
                  color: colors.primary,
                }}
                onPress={() => {
                  props.navigation.navigate('privacypolicy', {
                    URL: 'privacy-policy',
                  });
                }}
              />
              <Regular
                label="Terms of Use"
                onPress={() => {
                  props.navigation.navigate('termsofuse', {
                    URL: 'terms-of-use',
                  });
                }}
                style={{
                  ...styles.moreOptionsTitle,
                  textDecorationLine: 'underline',
                  marginLeft: mvs(67),
                  marginTop: 0,
                  color: colors.primary,
                }}
              />
            </View>
          </View>

          {!isGuest && (
            <>
              {/* <Regular
                label="Currency"
                style={{ color: colors.typeHeader, marginTop: mvs(22) }}
              /> */}
              <View style={styles.buttonsContainer}>
                {/* <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => setOpenCurrModal(true)}
                  style={{
                    ...styles.button,
                    borderWidth: mvs(0.5),
                    borderColor: colors.primary,
                  }}>
                  <Regular label={profileData?.currency?.currency_code} style={{ color: colors.primary }} />
                  <Down style={{ position: 'absolute', right: mvs(10) }} />
                </TouchableOpacity> */}
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={onSignOut}
                  style={{ ...styles.button, backgroundColor: colors.primary }}>
                  <Regular label="Sign out" style={{ color: colors.white }} />
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
        {TAKE_TO_COMMON_MODAL.CurrencyList(
          loading,
          openCurrModal,
          () => setOpenCurrModal(false),
          updateCurrency,
          profileData?.currency,
        )}
      </View>
      <DropdownAlert zIndex={5}  elevation={15} translucent activeStatusBarStyle={'light-content'} inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
      <PhoneVerificationModal
        visible={verifyNumberModal}
        onCLose={() => setVerifyNumberModal(false)}
      />
    </View>
  );
};

// export default Menu;
const mapStateToProps = state => {
  return {
    isGuest: state.auth.isGuest,
    profileData: state.auth.userInfo?.profile || {},
    counter: state.auth.userInfo?.counts || {},
    anotherEcho: state.common?.anotherEcho || {},
  };
};

const mapDispatchToProps = dispatch => ({
  postSigninData: data => dispatch(TAKE_TO_ACTIONS.postSigninData(data)),
  resetReducer: data => dispatch(TAKE_TO_ACTIONS.resetReducer()),
  updateUserProfile: data => dispatch(TAKE_TO_ACTIONS.updateUserProfile(data)),
  fetchUserInfo: () => dispatch(TAKE_TO_ACTIONS.fetchUserInfo()),
  clearMenuPagination: () => dispatch(TAKE_TO_ACTIONS.clearMenuPagination()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Menu);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  menuContainer: {
    //flex : 1,
    paddingHorizontal: mvs(22),
    paddingTop: mvs(27),
    //borderWidth : 1,
    // alignItems : 'center',
    paddingBottom: mvs(76),
  },
  option: {
    height: mvs(38),
    width: '100%',
    borderBottomWidth: 0.8,
    borderColor: colors.price_border,
  },
  optionTitle: {
    fontSize: mvs(15),
    color: colors.primary,
    marginTop: mvs(10),
  },
  optionCare: {
    //height: mvs(38),
    width: '100%',
    //borderBottomWidth : 0.8,
    borderColor: colors.price_border,
  },
  subOption: {
    //borderWidth:1,
    marginLeft: mvs(30),
    marginTop: mvs(15),
    flexDirection: 'row',
    alignItems: 'center',
  },
  subOptionTitle: {
    fontSize: mvs(15),
    color: colors.headerTitle,
    marginLeft: mvs(20),
  },
  moreOptionsContainer: {
    //height: mvs(124),
    width: '100%',
    //borderWidth : 1,
    backgroundColor: colors.secondary,
    marginTop: mvs(15),
    borderRadius: mvs(10),
    padding: mvs(20),
    paddingBottom: mvs(23),
    //justifyContent: 'space-between',
  },
  moreOptionsTitle: {
    fontSize: mvs(15),
    color: colors.typeHeader,
    //marginTop : mvs(10)
  },
  signOut: {
    fontSize: mvs(15),
    color: colors.primary,
    textDecorationLine: 'underline',
    marginTop: mvs(33),
  },
  counterContainer: {
    height: mvs(20),
    width: mvs(30),
    borderRadius: mvs(6),
    backgroundColor: colors.primary,
    position: 'absolute',
    top: mvs(9),
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialContainer: {
    //borderWidth : 1,
    marginTop: mvs(31),
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: mvs(73),
  },
  social: {
    height: '100%',
    width: '49%',
    borderWidth: mvs(0.5),
    borderColor: colors.doted,
    borderRadius: mvs(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsContainer: {
    height: mvs(38),
    width: '100%',
    //borderWidth : 1,
    marginTop: mvs(11),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    height: '100%',
    width: '49%',
    borderRadius: mvs(10),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: mvs(10),
  },
});
