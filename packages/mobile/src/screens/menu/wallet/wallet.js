import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import React, { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/core';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Buttons from '../../../components/atoms/Button';
import BankInfoCard from '../../../components/molecules/bank_info/bank-info-card';
import Header from '../../../components/molecules/header/header-1x';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import { mvs } from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';
import * as Images from '../../../../resource/assets/bank-info-icons';
import AddBalanceModal from '../../../components/molecules/modals/add-balance-modal';
import PlusButton from '../../../components/molecules/order_card/plus-button';
import { TAKE_TO_INPUT_FIELD } from '../../../components/atoms';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import UI_API from '@khan_ahmad786/common/store/services';
import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';

const Wallet = props => {
  const { profileData,fetchUserInfo } = props
  const Plus = Images['plus'];
  const isFocus = useIsFocused();

  const [state, setstate] = useState(false);
  const [modal, setModal] = useState(false);
  const [proceedLoading, setProceedLoading] = React.useState(false)
  const alertRef = React.useRef()


  useEffect(() => {
    setstate(props.route.params.state);
  }, [isFocus]);


  const addBalance = async () => {
    try {
      setProceedLoading(true)
      await client.post('topup', {
        amount: 50000
      })
      await fetchUserInfo()

        alertRef.current.alertWithType(
          'success',
          'Add balance',
          'Balance added successfully',
        );

      setModal(false)
      setProceedLoading(false)
    } catch (error) {
      setProceedLoading(false)
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  }

  return (
    <View style={styles.mainConatiner}>
      <Header
        {...props}
        title={'Wallet'}
        allowBackBtn
        userIcon={false}
      />
      <View style={styles.container}>
        <Regular label="Your balance" style={styles.mainTitle} />
        <View style={styles.priceMainContainer}>
          <TAKE_TO_INPUT_FIELD.PriceInput editable={false}
            value={profileData?.wallet_balance?.split(' ')[1]}
            priceUnit={profileData?.wallet_balance?.split(' ')[0]}
            unitStyle={{ fontSize: mvs(21) }}
            style={{ color: colors.primary, fontSize: mvs(21) }} />
          {/* 
          <View style={styles.priceContainer}>
            <Regular  label="US$ 0" style={styles.balance} />
          </View> */}
          {/* 
          <Buttons.ButtonPrimary
           title = {"Widthdraw"}
           onClick = {() => {}}
           style = {{backgroundColor : colors.green, height : mvs(49), width: mvs(151)}}
           /> */}

          {state && <PlusButton onPress={() => {
            setModal(!modal)
          }} />}
        </View>



        <Regular
          label={'Bank account'}
          style={{ ...styles.mainTitle, marginTop: mvs(40) }}
        />
        {!state && (
          <View style={styles.setUpPaymentContainer}>
            <Regular
              label="You don’t have a payment method yet"
              style={styles.setUpPaymentTitle}
            />
            <View style={{ flexDirection: 'row', marginTop: mvs(13) }}>
              <Text style={styles.setUpPaymentDetail}>
                Please set up your payout method to start receiving money from{' '}
                <Text onPress={() => { }} style={{ color: colors.primary }}>
                  Taketo
                </Text>
                .
              </Text>
            </View>
            <View style={styles.button}>
              <Buttons.ButtonPrimary
                onClick={() => props.navigation.navigate('addbankinfo')}
                title="Set up Payout"
              />
            </View>
          </View>
        )}
        {state && (
          <View style={styles.bankInfoContainer}>
            <BankInfoCard />
          </View>
        )}

        {/* <TouchableOpacity
        style = {{...styles.historyButton, backgroundColor : state ? colors.primary : colors.secondary}}
        onPress={() => props.navigation.navigate('wallethistory')}
        >
        <Regular
          label={'Wallet History'}
          style={{
            color: state ? colors.white : colors.typeHeader,
          }}
        />  
        </TouchableOpacity> */}

        <Buttons.ButtonPrimary
          title="Wallet History"
          style={{
            position: "absolute",
            alignSelf: "center",
            bottom: mvs(40)
          }}
          onClick={() => props.navigation.navigate('wallethistory')}
        />
      </View>
      <AddBalanceModal proceedLoading={proceedLoading} addBalance={addBalance} visible={modal} onClose={() => setModal(false)} />
      <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'}  inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
    </View>
  );
};
const mapStateToProps = state => {
  return {
    profileData: state.auth.userInfo?.profile || {},
  }
}
const mapDispatchToProps=dispatch=>({
  fetchUserInfo: () => dispatch(TAKE_TO_ACTIONS.fetchUserInfo()),
})
export default connect(mapStateToProps, mapDispatchToProps)(Wallet);

const styles = StyleSheet.create({
  mainConatiner: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: mvs(22),
    paddingTop:mvs(27)
  },
  mainTitle: {
    fontSize: mvs(15),
    color: colors.typeHeader,
    // marginTop: mvs(32),
  },
  priceMainContainer: {
    marginTop: mvs(11),
    width: '100%',
    //borderWidth : 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceContainer: {
    height: mvs(49),
    width: mvs(160),
    backgroundColor: colors.lightgrey,
    borderRadius: mvs(10),
    paddingLeft: mvs(20),
    justifyContent: 'center',
  },
  balance: {
    fontSize: mvs(21),
    color: colors.primary,
  },
  setUpPaymentContainer: {
    //height :mvs(170),
    width: '100%',
    //borderWidth : 1,
    marginTop: mvs(31),
    borderRadius: mvs(10),
    backgroundColor: colors.lightgrey,
    padding: mvs(20),
  },
  setUpPaymentTitle: {
    fontSize: mvs(15),
    color: colors.typeHeader,
  },
  setUpPaymentDetail: {
    fontSize: mvs(12),
    color: colors.price_unit,
    fontFamily: fonts.carosSoftRegular,
  },
  button: {
    marginTop: mvs(24),
  },
  walletHistory: {
    fontSize: mvs(15),
    color: colors.horizontalLine,
    textDecorationLine: 'underline',
    marginTop: mvs(32),
  },
  bankInfoContainer: {
    marginTop: mvs(31),
  },
  plusButton: {
    height: mvs(50),
    width: mvs(50),
    borderRadius: mvs(50 / 2),
    //position : 'absolute',
    right: 0,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyButton: {
    height: mvs(38),
    width: mvs(161),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: mvs(10),
    marginTop: mvs(30)
  }
});
