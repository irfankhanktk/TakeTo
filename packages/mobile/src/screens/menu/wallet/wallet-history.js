import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import colors from '../../../config/colors';
import Header from '../../../components/molecules/header/header-1x';
import { mvs } from '../../../config/metrices'
import Regular from '../../../presentation/typography/regular-text';
import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import {connect} from 'react-redux';
import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import Medium from '../../../presentation/typography/medium-text';

const WalletHistory = props => {
  const {fetchWalletHistory, wallet_history} = props;
  const history = [
    {type: 'Invitation', trip: 'NA', date: '24 / 10 / 2021', total: 'US$ 30'},
    {
      type: 'Delivery',
      trip: 'Kw - Kw',
      date: '24 / 10 / 2021',
      total: 'US$ 30',
    },
    {type: 'Refund', trip: 'Kw - USA', date: '24 / 10 / 2021', total: 'US$ 30'},
    {type: 'Top-Up', trip: 'NA', date: '24 / 10 / 2021', total: 'US$ 30'},
    {type: 'Cashout', trip: 'NA', date: '24 / 10 / 2021', total: 'US$ 30'},
    {type: 'Payout', trip: 'Kw - USA', date: '24 / 10 / 2021', total: 'US$ 30'},
  ];

  React.useEffect(() => {
    fetchWalletHistory();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <Header
        {...props}
        title="Wallet History"
        allowBackBtn
        userIcon = {false}
      />
      <View style={styles.container}>
        {/* <Regular
          label={TAKE_TO_CONSTANT.convertUpperCase('Wallet History')}
          style={styles.mainTitle}
        /> */}

        <View style={styles.table}>
          <View style={styles.header}>
            <View style={{...styles.type, backgroundColor : colors.white}}>
              <Regular label="Type" style={styles.Txt} />
            </View>
            <View style={{...styles.trip, backgroundColor : colors.white}}>
              <Regular label="Trip" style={styles.Txt} />
            </View>
            <View style={{...styles.date, backgroundColor : colors.white}}>
              <Regular label="Date" style={styles.Txt} />
            </View>
            <View style={{...styles.total, borderWidth :0}}>
              <Regular
                label="Total"
                style={{...styles.Txt}}
              />
            </View>
          </View>

          <FlatList
            data={wallet_history.data}
            contentContainerStyle = {{paddingBottom : mvs(10), paddingHorizontal : mvs(1)}}
            renderItem={({item, index}) => (
              <View style={styles.header}>
                {console.log(mvs(12))}
                <View style={{...styles.type}}>
                  <Regular label={item?.type} style={styles.Txt} />
                </View>
                <View style={styles.trip}>
                  <Regular
                    onPress={() => {
                      item.type == 'Delivery'
                        ? props.navigation.navigate('walletdeliverydetails',{order_id:item?.order_id})
                        : item.type == 'Refund'
                        ? props.navigation.navigate('walletrefunddetails',{order_id:item?.order_id})
                        : item.type == 'Payout'
                        ? props.navigation.navigate('walletpayoutdetails',{order_id:item?.order_id})
                        : null;
                    }}
                    label={item?.trip}
                    style={item?.trip == 'N-A' ? styles.Txt : styles.Txttrip}
                  />
                </View>
                <View style={styles.date}>
                  <Regular label={TAKE_TO_CONSTANT.getDate(item?.trn_date,'DD / MM / YYYY')} style={styles.Txt} />
                </View>
                <View style={styles.total}>
                  <Medium
                    label={` US$ ${parseInt(item.total)}`}
                    style={{
                      ...styles.Txt,
                      color:!item?.is_credit
                        // item?.type == 'Cashout' || item?.type == 'Payout'
                          ? "#EB1111"
                          : colors.primary,
                    }}
                  />
                </View>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  wallet_history: state.wallet.wallet_history,
});

const mapDispatchToProps = {
  fetchWalletHistory: () => TAKE_TO_ACTIONS.fetchWalletHistory(),
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletHistory);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: mvs(22),
  },
  mainTitle: {
    fontSize: mvs(15),
    color: colors.headerTitle,
    marginTop: mvs(32),
    textDecorationLine: 'underline',
  },
  table: {
    //height : mvs(222),
    width: '100%',
    //marginTop: mvs(21),
    //borderWidth:1
  },
  header: {
    height: mvs(38),
    width: '100%',
    paddingVertical:mvs(2),
    paddingHorizontal:mvs(2),
    //borderWidth : 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop : mvs(10)
  },
  type: {
    height: '100%',
    width: '25%',
    justifyContent: 'center',
    alignItems : 'center',
    backgroundColor : colors.secondary,
    borderRadius : mvs(10)
  },
  trip: {
    height: '100%',
    width: '20%',
    justifyContent: 'center',
    alignItems : 'center',
    backgroundColor : colors.secondary,
    borderRadius : mvs(10)
  },
  date: {
    height: '100%',
    width: '28%',
    justifyContent: 'center',
    alignItems : 'center',
    backgroundColor : colors.secondary,
    borderRadius : mvs(10)
  },
  total: {
    height: '100%',
    width: '17%',
    justifyContent: 'center',
    alignItems : 'center',
  
    borderRadius : mvs(10),
    borderWidth : StyleSheet.hairlineWidth,
    borderColor : colors.typeHeader
  },
  Txt: {
    fontSize: mvs(12),
    color: colors.headerTitle,
  },
  Txttrip: {
    fontSize: mvs(12),
    textDecorationLine: 'underline',
    color: colors.primary,
  },
  Txttotal: {
    fontSize: mvs(12),
    color: colors.pick,
  },
});
