import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import { TAKE_TO_IMAGES } from '../../../../resource/assets/image_resouce';
import * as Images from '../../../../resource/assets/order-car-icons';
import Header from '../../../components/molecules/header/header-1x';
import DeliveryAddressRequest from '../../../components/molecules/modals/delivery-address-request';
import ProductAcceptedModal from '../../../components/molecules/modals/product-accepted-modal';
import RewardAcceptedModal from '../../../components/molecules/modals/reward-accepted-modal';
import StatusModal from '../../../components/molecules/modals/status-modal';
import HistoryOrderCard from '../../../components/molecules/order_card/history-offer-card';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';

const DeliveryHistory = props => {
  const { fetchDeliveryHistoryOrders, delivered_History_Order, langauge } = props;
  const Aeroplane = Images['aeroplane_white'];
  const AeroplaneActive = Images['aeroplane_active'];
  const Car = Images['car_white'];
  const CarActive = Images['car_active'];

  const [selected, setSelected] = useState(0);
  const [rewardAcceptModal, setRewardAcceptModal] = useState(false);
  const [productAcceptModal, setProductAcceptModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [addressRequestModal, setAddressRequestModal] = useState(false);
  const [loading, setLoading] = React.useState(true);
  const alertRef = React.useRef();
  const scrollRef = React.useRef(null);

  const fetchOrdersList = async (selected = 0) => {
    try {
      setLoading(true);
      await fetchDeliveryHistoryOrders(selected ? true : false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // scrollRef?.current?.scrollTo({x: 0, y: 0, animated: true});
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };
  // console.log(delivered_History_Order)
  React.useEffect(() => {
    const unsubscribe = props?.navigation.addListener('focus', () => {
      fetchOrdersList(selected);
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;

  }, [selected]);

  const ButtonDom = () => {

    return <View style={styles.buttonsContainer}>
      <TouchableOpacity
        onPress={() => { setSelected(0); fetchOrdersList(0) }}
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
        onPress={() => { setSelected(1); fetchOrdersList(1) }}
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
  }

  const renderItem = ({ item, index }) => {
    return (
      <>
        <HistoryOrderCard
          {...props}
          local={selected}
          {...UI_API._returnOrderProps(item)}


          color={colors.primary}
          style={{ backgroundColor: colors.secondary }}

          type={''}
          status={
            langauge?.translations?.delivery_history_steps[
              'reward'
            ].split(' ')[0]
          }
          buttonLabel={
            langauge?.translations?.delivery_history_steps[
            item?.order_status
            ]
          }
          styleButton={{ paddingHorizontal: mvs(20) }}
          textStyle1={{ fontSize: mvs(12) }}
          onClick={() => {
            props.navigation.navigate('chat', {
              thread_id: item?.thread_id,
              participant_name: item?.order_by?.user_name
            });
          }}
          // trackLine={item.order_next_step == 'view_offers' ? 0 : (item.order_next_step == 'completed' || item?.order_next_step === 'Disputed') ? 2 : 1}
          // dotColor={item?.order_next_step === 'Disputed' ? colors.disputes : colors.primary}
          trackLine={item.order_next_step == 'view_offers'?0:(item.order_next_step == 'completed'||item?.order_next_step==='Disputed'||item.order_status == 'completed'||item?.order_status==='Disputed')?2:1}
                    dotColor={item?.order_status==='Disputed'?colors.disputes:colors.primary}
          isActive={item.order_next_step == 'view_offers' ? false : true}
          productImage={TAKE_TO_IMAGES.bag}
        />
        <View style={{ marginTop: mvs(20) }} />
      </>
    );
  }

  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <Header {...props} title="delivery History" allowBackBtn bellIcon />
        {ButtonDom()}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Chase size={mvs(30)} color={colors.primary} />
        </View>
      </View>
    );
  } else if (!loading && delivered_History_Order?.data?.length <= 0) {
    return (
      <View style={styles.mainContainer}>
        <Header {...props} title="delivery History" allowBackBtn bellIcon />
        {ButtonDom()}
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: mvs(20),
          }}>
          <Regular
            label={`No Record Found.`}
            style={{ textAlign: 'center', color: colors.primary }}
          />
        </View>
      </View>
    );
  } else
    return (
      <View style={styles.mainContainer}>
        <Header {...props} title="delivery History" allowBackBtn bellIcon />
        <View style={styles.container}>
          {ButtonDom()}

          <FlatList
            ref={scrollRef}
            data={delivered_History_Order.data}
            keyExtractor={item => item.order_created_at.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              ...styles.SCROLL_CONTAINER,
              paddingTop: mvs(20),
              paddingBottom: mvs(22),
            }}
            renderItem={renderItem}
          />
        </View>
        <RewardAcceptedModal
          visible={rewardAcceptModal}
          onClose={() => {
            setRewardAcceptModal(false);
          }}
          onSendButton={() => {
            props.navigation.navigate('chat');
          }}
        />
        <ProductAcceptedModal
          visible={productAcceptModal}
          onClose={() => {
            setProductAcceptModal(false);
          }}
          onSendButton={() => {
            props.navigation.navigate('chat');
          }}
        />
        <StatusModal
          visible={statusModal}
          title="Receipt Accepted"
          buttonTitle="Request Delivery Address"
          onConfirm={() => {
            setStatusModal(false);
            setAddressRequestModal(true);
          }}
          onClose={() => {
            setStatusModal(false);
          }}
          endButtonTitle="Back"
          endButton
        />
        <DeliveryAddressRequest
          visible={addressRequestModal}
          onClose={() => {
            setAddressRequestModal(false);
          }}
        />
        <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'} inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />

      </View>
    );
};

export const mapStateToProps = state => ({
  delivered_History_Order: state.menu_orders?.deliveredHistoryOrder,
  langauge: state.common?.langauge,
});

export const mapDispatchToProps = {
  fetchDeliveryHistoryOrders: local =>
    TAKE_TO_ACTIONS.fetchDeliveryHistoryOrders(local),
};
export default connect(mapStateToProps, mapDispatchToProps)(DeliveryHistory);

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
    width: '100%',
    //borderWidth : 1,
    paddingHorizontal: mvs(22),
    // marginTop: mvs(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: mvs(20),
    marginTop: mvs(27),

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
