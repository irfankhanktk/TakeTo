import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import React, {useState} from 'react';
import { useFocusEffect } from '@react-navigation/core';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import Buttons from '../../components/atoms/Button';
import OrderPolicy from '../../components/molecules/create_order_policy/order-policy';
import Header from '../../components/molecules/header/header-1x';
import InstractionCard from '../../components/molecules/instraction-card-doted';
import colors from '../../config/colors';
import {mvs} from '../../config/metrices';
import Regular from '../../presentation/typography/regular-text';

const CreateOrder = props => {
  const {
    fetchShopAddress,
    fetchDeliveryAddress,
    countryList,
    activeCountryList,
    navigation,
  } = props;

  const { isLocal } = props.route.params;
 
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchShopAddress('');
      fetchDeliveryAddress('');
    });
    return unsubscribe;
  }, []);



  return (
    <View style={styles.mainContainer}>
      {/* <View style={{backgroundColor: colors.white}}> */}
        <Header 
        {...props} 
        allowBackBtn
        title="create order" 
        spacebetween bellIcon />
      {/* </View> */}
        <ScrollView
          style = {{flex : 1}}
          contentContainerStyle={{backgroundColor: colors.white, paddingTop:mvs(27), paddingBottom:mvs(22)}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.optionsContainer}>
            <View style={styles.optionsMainContainer}>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('stores');
                }}
                style={styles.option1}>
                <Regular
                  label="Show me popular stores"
                  style={styles.optionTitle}
                />
                <Regular
                  label="I want to choose a product from popular stores."
                  style={styles.optionDetail}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate('createorderestore', {
                    re_order_object: null,
                    isLocal: isLocal
                  })
                }
                style={styles.option2}>
                <Regular
                  label="From E-commerce website"
                  style={styles.optionTitle}
                />
                <Regular
                  label="The product I want is online. I would like to enter the product link."
                  style={styles.optionDetail}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('createorderpstore', {
                    re_order_object: null,
                    isLocal: isLocal
                  });
                }}
                style={styles.option2}>
                <Regular
                  label="From a physical shop"
                  style={styles.optionTitle}
                />
                <Regular
                  label="The product I want is not online. I would like to enter the details manually."
                  style={styles.optionDetail}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* <View style = {styles.buttonContainer}>
              <Buttons.ButtonPrimaryLight onClick = {() => props.navigation.navigate('orderhistory')} title={'My orders history'}/>
            </View> */}

          <OrderPolicy />
        </ScrollView>
    </View>
  )
};

const mapStateToProps = state => {
  return {
    isGuest: state.auth.isGuest,
    countryList: state.common.countriesList || [],
  };
};
const mapDispatchToProps = dispatch => ({
  fetchShopAddress: data => dispatch(TAKE_TO_ACTIONS.fetchShopAddress(data)),
  fetchDeliveryAddress: data =>
    dispatch(TAKE_TO_ACTIONS.fetchDeliveryAddress(data)),
  activeCountryList: countryList =>
    dispatch(TAKE_TO_ACTIONS.activeCountryList(countryList)),
});
export default connect(mapStateToProps, mapDispatchToProps)(CreateOrder);

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
