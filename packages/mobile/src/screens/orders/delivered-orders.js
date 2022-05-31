import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import React from 'react';
import { FlatList, StyleSheet, View, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import Header from '../../components/molecules/header/header-1x';
import DeliveredOrderCard from '../../components/molecules/order_card/delivery-history-card';
import colors from '../../config/colors';
import DropdownAlert from 'react-native-dropdownalert';
import { mvs, width } from '../../config/metrices';
import UI_API from '@khan_ahmad786/common/store/services';
import Regular from '../../presentation/typography/regular-text';
import { Chase } from 'react-native-animated-spinkit';

const DeliveredOrders = props => {
  const { navigation, route, delivery_orders, fetchDeliveryOrders, profileData } = props;

  const [loading, setLoading] = React.useState(true);
  const alertRef = React.useRef();
  const scrollRef = React.useRef();
  const [pageLoading, setPageLoading] = React.useState(false);
  const onPagination = async setLoading => {
    try {
      let page = UI_API._returnPage(delivery_orders);
      console.log('page:',page);
      if (!page) {
        return;
      }
      setLoading(true);
      await fetchDeliveryOrders(page);

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
    onPagination(setLoading);
  }, [profileData?.country]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Header {...props} title="Delivered orders" allowBackBtn bellIcon />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Chase size={mvs(30)} color={colors.primary} />
        </View>
        <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'} inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
      </View>
    );
  } else if (!loading && Object.keys(delivery_orders).length <= 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Header {...props} title="Delivered orders" allowBackBtn bellIcon />
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
        <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'} inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
      </View>
    );
  } else
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Header {...props} title="Delivered orders" allowBackBtn bellIcon />
        <View style={{ flex: 1 }}>
          <FlatList
            data={delivery_orders?.data}
            keyExtractor={(item,index) => index.toString()}
            contentContainerStyle={styles.SCROLL_CONTAINER}
            renderItem={({ item }) => (
              <DeliveredOrderCard
                // order_data={item}
                {...props}
                onclick={() =>
                  navigation.navigate('orderdetails', {
                    isLocalOrder: item?.is_international,
                    orderType: 'delivered',
                    order_id: item?.order_id,
                  })
                }
                order_data={item}
                //headingTitle={'Delivered Order'}
                // local={!item.is_international}
                // time={TAKE_TO_CONSTANT.getFromNow(
                //   new Date(item.order_created_at).toISOString(),
                // )}
                // title={`${item.order_title}`}
                // website={`${item.order_store_url}`}
                // price={item.order_price}
                // store_img={item.order_image}
                // reward={item.order_reward_price}
                // user_name={item.order_by.user_name}
                // user_img={item.order_by.user_image}
                // order_from={item.order_from}
                // order_to={item.order_to}
                // order_from_flag={item.order_from_flag}
                // order_to_flag={item.order_to_flag}
                {...UI_API._returnOrderProps(item)}
                style={{
                  width: width - mvs(22) * 2,
                }}
              />
            )}
            onEndReachedThreshold={0.5}
            onEndReached={() =>{
              if(!pageLoading&&!loading)
              onPagination(setPageLoading);
             }}
          />
        </View>
        {pageLoading && (
          <View style={styles.pageLoader}>
            <Chase size={mvs(20)} color={colors.primary} />
          </View>
        )}
        <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'} inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
      </View>
    );
};

const mapStateToProps = state => {
  return {
    delivery_orders: state.order?.delivery_orders,
    profileData: state.auth.userInfo?.profile || {},
  }
};

const mapDispatchToProps = dispatch => ({
  fetchDeliveryOrders: (page) => dispatch(TAKE_TO_ACTIONS.fetchDeliveryOrders(page)),
});
export default connect(mapStateToProps, mapDispatchToProps)(DeliveredOrders);

const styles = StyleSheet.create({
  SCROLL_CONTAINER: {
    paddingHorizontal: mvs(22),
    paddingBottom: mvs(22),
    paddingTop: mvs(30),
  },
  pageLoader: {
    height: mvs(50),
    width: mvs(50),
    borderRadius: mvs(25),
    position: 'absolute',
    bottom: mvs(20),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
