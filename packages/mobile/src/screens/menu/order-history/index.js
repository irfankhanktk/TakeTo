import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { connect } from 'react-redux';
import { TAKE_TO_IMAGES } from '../../../../resource/assets/image_resouce';
import * as Images from '../../../../resource/assets/order-car-icons';
import Header from '../../../components/molecules/header/header-1x';
import DeliveryAddressRequested from '../../../components/molecules/modals/delivery-address-requested';
import HistoryOrderCard from '../../../components/molecules/order_card/history-offer-card';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';
import DropdownAlert from 'react-native-dropdownalert';
import UI_API from '@khan_ahmad786/common/store/services';
import { Chase } from 'react-native-animated-spinkit';

const OrderHistory = props => {
  const { fetchOrderHistory, history_orders, langauge } = props;
  const Aeroplane = Images['aeroplane_white'];
  const AeroplaneActive = Images['aeroplane_active'];
  const Car = Images['car_white'];
  const CarActive = Images['car_active'];
  //  console.log(langauge);
  const [selected, setSelected] = useState(0);
  const [modal, setModal] = useState(false);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = React.useState(true);
  const alertRef = React.useRef();
  const scrollRef = React.useRef();
  // console.log(history_orders)
  const getData=async(selected=0) => {
    try {
      setLoading(true);
      await fetchOrderHistory(selected ? true : false);
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
  }
  React.useEffect(() => {
    const unsubscribe = props?.navigation.addListener('focus', () => {
      // (async )();
      getData(selected);
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
   
  }, [selected]);

  const ButtonsDom = () => {
    return (
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() => {setSelected(0);getData(0)}}
          style={{
            ...styles.topButton,
            backgroundColor: selected == 0 ? colors.primary : colors.white,
          }}>
          {selected == 0 ? <Aeroplane /> : <AeroplaneActive />}
          <Regular
            label="International"
            style={{
              color: selected == 0 ? colors.white : colors.primary,
              marginLeft: mvs(11),
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
         onPress={() => {setSelected(1);getData(1)}}
          style={{
            ...styles.topButton,
            backgroundColor: selected == 1 ? colors.primary : colors.white,
          }}>
          {selected == 1 ? <Car /> : <CarActive />}
          <Regular
            label="Local"
            style={{
              color: selected == 1 ? colors.white : colors.primary,
              marginLeft: mvs(11),
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <Header {...props} title="Order History" allowBackBtn bellIcon />
        {ButtonsDom()}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Chase size={mvs(30)} color={colors.primary} />
        </View>
      </View>
    );
  } else if (!loading && history_orders?.data?.length <= 0) {
    return (
      <View style={styles.mainContainer}>
        <Header {...props} title="Order History" allowBackBtn bellIcon />
        {ButtonsDom()}
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: mvs(20),
          }}>
          <Regular
            label={`No Record Found`}
            style={{ textAlign: 'center', color: colors.primary }}
          />
        </View>
      </View>
    );
  } else
    return (
      <View style={styles.mainContainer}>

        <Header {...props} title="Order History" allowBackBtn bellIcon />
        <View style={styles.container}>
          {ButtonsDom()}
          <FlatList
            ref={scrollRef}
            data={history_orders?.data}
            keyExtractor={item => item.order_created_at.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              ...styles.SCROLL_CONTAINER,
              paddingTop: mvs(20),
              paddingBottom: mvs(22),
            }}
            renderItem={({ item, index }) => {
              console.log('item',item);
              return (
                <>
                  <HistoryOrderCard
                    {...props}
                    // local={selecte}
                    // style={{ backgroundColor: colors.secondary }}
                    {...UI_API._returnOrderProps(item)}
                    type={item.order_next_step == 'view_offers' ? langauge?.translations?.order_history_steps[
                        'pending_reward'
                      ].split(' ')[1] : ''}
                    status={
                      item.order_next_step == 'view_offers' ? langauge?.translations?.order_history_steps[
                        'pending_reward'
                      ].split(' ')[0] : langauge?.translations?.delivery_history_steps[
                        'reward'
                      ].split(' ')[0]
                    }
                    buttonLabel={
                      langauge?.translations?.order_history_steps[
                      item?.order_status
                      ]
                    }
                    textStyle1={{ fontSize: mvs(12) }}
                    color={colors.primary}
                    onClick={() => {
                      if (item.order_next_step == 'view_offers') {
                        props.navigation.navigate('pendingdetails', {
                          isLocalOrders: !item?.is_international,
                          order_id: item?.order_id,
                        });
                      } else {
                        // props.navigation.navigate('pendingdetails', {
                        //   isLocalOrders: !item?.is_international,
                        //   order_id: item?.order_id,
                        // });
                        props.navigation.navigate('chat', {
                          thread_id: item?.thread_id,
                          participant_name:'',//item?.order_by?.user_name
                        });
                      }
                      
                    }}
                    trackLine={item.order_next_step == 'view_offers'?0:(item.order_next_step == 'completed'||item?.order_next_step==='Disputed'||item.order_status == 'completed'||item?.order_status==='Disputed')?2:1}
                    dotColor={item?.order_status==='Disputed'?colors.disputes:colors.primary}
                    isActive={item.order_next_step == 'view_offers'?false:true}
                  />
                  <View style={{ marginTop: mvs(20) }} />
                </>
              );
            }}
          />
        </View>
        <DeliveryAddressRequested
          visible={modal}
          onClose={() => setModal(false)}
          step={step}
          onNext={() => {
            if (step < 2) {
              setStep(step + 1);
            } else {
              setModal(false);
              setStep(0);
            }
          }}
          backButton={step == 0 ? true : false}
        />
        <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'}  inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
      </View>
    );
};

export const mapStateToProps = state => ({
  history_orders: state.menu_orders?.history_orders,
  langauge: state.common?.langauge,
});

export const mapDispatchToProps = {
  fetchOrderHistory: local => TAKE_TO_ACTIONS.fetchOrderHistory(local),
};
export default connect(mapStateToProps, mapDispatchToProps)(OrderHistory);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  SCROLL_CONTAINER: {
    paddingHorizontal: mvs(22),
  },
  container: {
    flex: 1,
  },
  buttonsContainer: {
    //height: mvs(44),
    paddingHorizontal: mvs(22),
    width: '100%',
    //borderWidth : 1,
    marginTop: mvs(27),
    marginBottom: mvs(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: mvs(20),
  },
  topButton: {
    height: mvs(44),
    width: '48%',
    borderWidth: 1,
    borderRadius: mvs(10),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: colors.primary,
  },
});
