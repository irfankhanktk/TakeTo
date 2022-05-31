import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import React, {useState} from 'react';
import {useFocusEffect} from '@react-navigation/core';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import Buttons from '../../components/atoms/Button';
import OrderPolicy from '../../components/molecules/create_order_policy/order-policy';
import Header from '../../components/molecules/header/header-1x';
import InstractionCard from '../../components/molecules/instraction-card-doted';
import colors from '../../config/colors';
import {mvs} from '../../config/metrices';
import Regular from '../../presentation/typography/regular-text';
import userProfile from '../profile/user-profile';

const OrderTab = props => {
  const {
    fetchShopAddress,
    fetchDeliveryAddress,
    navigation,
    isGuest,
    profileData,
    fetchUserInfo,
  } = props;

  const [country, setCountry] = useState({is_enable: true});

  const [makeMoney] = React.useState([
    {
      title: 'Create your order',
      description:
        'Search for a product you want, from abroad or in your country, whether from an online store or physical shop.',
    },
    {
      title: 'Receive offers from verified travelers going to your city',
      description:
        'Taketo travelers going to your city will make offers to deliver your item. Select & accept the offer you like.',
    },
    {
      title: 'Pay securely for your order',
      description:
        'Choose any offer you like and pay for the delivery using Taketo secure payment. Your payment is protected and guaranteed until you confirm receiving your order.',
    },
    {
      title: 'Receive your order',
      description: 'Meet with your traveler & receive your order.',
    },
  ]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchShopAddress('');
      fetchDeliveryAddress('');
      console.log('USER:', profileData);
    });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.mainContainer}>
      <Header {...props} title="How to order" spacebetween bellIcon />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: mvs(22)}}
        style={{flex: 1}}>
        <View style={styles.container}>
          <View
            style={{
              paddingLeft: mvs(5.5),
            }}>
            {makeMoney.map((abroad, index) => (
              <View style={{}} key={index}>
                <InstractionCard
                  title={abroad.title}
                  detail={abroad.description}
                  border={makeMoney.length - 1 !== index}
                />
              </View>
            ))}
          </View>
        </View>

        {/* <View style={{paddingHorizontal: mvs(22)}}>
        <Buttons.ButtonPrimary
          onClick={() => {
            isGuest ? props.navigation.navigate('login') : setInst(false);
          }}
          title="Create Your Order"
        />
      </View> */}
        <View style={{paddingHorizontal: mvs(22), marginTop: mvs(10)}}>
          <Buttons.ButtonRTL
            iconName="aeroplanewhite"
            onClick={() => {
              isGuest
                ? props.navigation.navigate('login')
                : props.navigation.navigate('createorder', {isLocal: false});
            }}
            title="Create International Order"
            style={{justifyContent: 'center'}}
            textStyle={{marginLeft: mvs(18), color: colors.white}}
          />
          <Buttons.ButtonRTL
            disabled={!profileData?.country?.is_enable}
            iconName="carwhite"
            onClick={() => {
              isGuest
                ? props.navigation.navigate('login')
                : props.navigation.navigate('createorder', {isLocal: true});
            }}
            title="Create Local Order"
            style={{
              justifyContent: 'center',
              marginTop: mvs(10),
              backgroundColor: profileData?.country?.is_enable
                ? colors.primary
                : colors.primary50,
            }}
            textStyle={{marginLeft: mvs(18), color: colors.white}}
          />

          <Buttons.ButtonSecondaryOutline
            onClick={() => {
              isGuest
                ? props.navigation.navigate('login')
                : props.navigation.navigate('orderhistory');
            }}
            style={{marginTop: mvs(10)}}
            title="My Orders History"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const mapStateToProps = state => {
  return {
    isGuest: state.auth.isGuest,
    countryList: state.common.countriesList || [],
    profileData: state.auth.userInfo?.profile || {},
  };
};
const mapDispatchToProps = dispatch => ({
  fetchShopAddress: data => dispatch(TAKE_TO_ACTIONS.fetchShopAddress(data)),
  fetchDeliveryAddress: data =>
    dispatch(TAKE_TO_ACTIONS.fetchDeliveryAddress(data)),
  activeCountryList: countryList =>
    dispatch(TAKE_TO_ACTIONS.activeCountryList(countryList)),
  fetchUserInfo: () => dispatch(TAKE_TO_ACTIONS.fetchUserInfo()),
});
export default connect(mapStateToProps, mapDispatchToProps)(OrderTab);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
    //borderWidth:1
  },
  container: {
    //flex : 1,
    paddingHorizontal: mvs(22),
    //paddingLeft : mvs(26+5.5),
    paddingTop: mvs(27),
    //borderWidth : 1,
    //backgroundColor : colors.white
  },
  optionsContainer: {
    // height: mvs(270),
    width: '100%',
    borderBottomEndRadius: mvs(20),
    borderBottomStartRadius: mvs(20),
    backgroundColor: colors.white,
    paddingBottom: mvs(12),
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
    marginTop: mvs(1),
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
    marginTop: mvs(7),
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
  buttonContainer: {
    marginTop: mvs(18),
    paddingHorizontal: mvs(22),
  },
});
