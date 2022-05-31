import services from '@khan_ahmad786/common/api/services';
import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import PagingLoader from '../../../components/atoms/paging-loader';
import Header from '../../../components/molecules/header/header-1x';
import Widthdraw from '../../../components/molecules/modals/widthdraw';
import HistoryOrderCard from '../../../components/molecules/order_card/history-offer-card';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';

const MyOrders = props => {
  const { my_orders, fetchCreatedOrders,profileData } = props;
  const alertRef = React.useRef();
  const [selected, setSelected] = useState('');
  const [model, setModal] = useState(false);
  const [loading, setLoading] = React.useState(true);
  const [pageLoading, setPageLoading] = React.useState(false);

  const [deleteLoading, setDeleteLoading] = React.useState(false);
  
  const onPagination = async setLoading => {
    try {
    
      let page = UI_API._returnPage(my_orders);
      console.log('page:::',page);
      if (!page) {
        return;
      }
      setLoading(true);
      await fetchCreatedOrders(page);

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
      <View style={styles.mainContainer}>
        <Header {...props} title="My orders" allowBackBtn bellIcon />
        <View
          style={{
            ...styles.container,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Chase size={mvs(30)} color={colors.primary} />
        </View>
        <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'}  inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />

      </View>
    );
  } else if (!loading && my_orders?.data?.length <= 0 || my_orders?.data === undefined) {
    return (
      <View style={styles.mainContainer}>
        <Header {...props} title="My orders" allowBackBtn bellIcon />
        <View
          style={{
            ...styles.container,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Regular
            label={`Oops! it seems you haven't created an order.`}
            style={{ textAlign: 'center', color: colors.primary }}
          />
        </View>
        <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'}  inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />

      </View>
    );
  } else
    return (
      <View style={styles.mainContainer}>
        <Header {...props} title="My orders" allowBackBtn bellIcon />
        <View style={styles.container}>
          <FlatList
            data={my_orders?.data}
            keyExtractor={(item,index) => index?.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              ...styles.SCROLL_CONTAINER,
              paddingTop: mvs(27),
              paddingBottom: mvs(22),
            }}
            renderItem={({ item }) => {
              return (
                <>
                  <HistoryOrderCard
                    {...props}
                    // style={{ backgroundColor: colors.secondary }}
                    {...UI_API._returnOrderProps(item)}
                    type={'Reward'}
                    status=''
                    //buttonLabel={item?.order_next_step?.split(' ')[0]}
                    buttonLabel={`Cancel Order`}
                    styleButton={{
                      height: mvs(57),
                      backgroundColor: colors.pink,
                    }}
                    // buttonLabel1={'US$ 45'}
                    textStyle1={{ fontSize: mvs(18) }}
                    color={colors.pink}
                    onClick={() => {
                      //.log(item)
                      setSelected(item);
                      setModal(true);
                    }}
                    order_site={item?.order_site}
                    order_from={item.order_from}
                    order_to={item.order_to}
                    order_from_img={item.order_from_flag}
                    order_to_img={item.order_to_flag}
                    trackLine={0}
                  />
                  <View style={{ marginTop: mvs(20) }} />
                </>
              );
            }}
            onEndReachedThreshold={0.5}
            onEndReached={() =>{
              if(!pageLoading&&!loading)
              onPagination(setPageLoading);
             }}
          />
        </View>
        {pageLoading && (
         <PagingLoader/>
        )}
        <Widthdraw
          {...props}
          loading={deleteLoading}
          onConfirm={async () => {
            try {
              setDeleteLoading(true);
              await client.delete(
                `${services.create_order.cancel_order}/${selected?.order_id}`,
              );
              await fetchCreatedOrders();
              setDeleteLoading(false);
              setModal(false);
              alertRef.current.alertWithType(
                'success',
                'Successfully Deleted.',
                'Your order has been deleted successfully',
              );
            } catch (error) {
              setDeleteLoading(false);
              setModal(false);
              alertRef.current.alertWithType(
                'error',
                'Error',
                UI_API._returnError(error),
              );
            }
          }}
          onClose={() => {
            setModal(false);
          }}
          requestedReward={false}
          requested
          subtitle="Are you sure you want to cancel your order?"
          title="Cancel Order"
          name={selected?.order_title}
          image={selected?.order_image}
          visible={model}
          name={selected?.order_title}
          site={selected?.order_shop_name?.length > 8 ? `${selected?.order_shop_name?.substring(0, 8)} ...` : selected?.order_shop_name || selected?.order_site}
          price={selected?.order_price}
          image={selected?.order_image}
          reward={`${selected?.order_reward_price}`}
          offer_reward={selected?.offer_reward_price}
          isLocal={!selected?.is_international}
          flagFrom={selected?.order_from_flag}
          flagTo={selected?.order_to_flag}
          from={selected?.order_from}
          to={selected?.order_to}

        />
        <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'}  inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
      </View>
    );
};

export const mapStateToProps = state => ({
  my_orders: state.order.my_orders,
  profileData: state.auth.userInfo?.profile || {},
});

export const mapDispatchToProps = {
  fetchCreatedOrders: (page) => TAKE_TO_ACTIONS.fetchCreatedOrders(page),
};
export default connect(mapStateToProps, mapDispatchToProps)(MyOrders);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
  },
  SCROLL_CONTAINER: {
    paddingHorizontal: mvs(22),
  },
  buttonsContainer: {
    height: mvs(44),
    width: '100%',
    //borderWidth : 1,
    marginTop: mvs(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topButton: {
    height: '100%',
    width: '48%',
    borderWidth: 1,
    borderRadius: mvs(10),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: colors.primary,
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
