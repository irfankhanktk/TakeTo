import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import Header from '../../components/molecules/header/header-1x';
import ProcessingOrderCard from '../../components/molecules/order_card/processed-offer-card';
import colors from '../../config/colors';
import { mvs, width } from '../../config/metrices';
import Regular from '../../presentation/typography/regular-text';

const ProcessingOrders = props => {
  const { navigation, route, processing_orders, fetchProcessingOrders, profileData } = props;

  const [loading, setLoading] = React.useState(true);
  const alertRef = React.useRef();
  const scrollRef = React.useRef();
  const [pageLoading, setPageLoading] = React.useState(false);



  const onPagination = async setLoading => {
    try {
      let page = UI_API._returnPage(processing_orders);
      if (!page) {
        return;
      }
      setLoading(true);
      await fetchProcessingOrders(page);

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
        <Header {...props} title="Processing orders" allowBackBtn bellIcon />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Chase size={mvs(30)} color={colors.primary} />
        </View>
        <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'}  inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
      </View>
    );
  } else if (!loading && Object.keys(processing_orders)?.length <= 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Header {...props} title="Processing orders" allowBackBtn bellIcon />
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
        <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'}  inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
      </View>
    );
  } else
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Header {...props} title="Processing orders" allowBackBtn bellIcon />
        <View style={{ flex: 1 }}>
          <FlatList
            data={processing_orders?.data}
            keyExtractor={(item,number) => number.toString()}
            contentContainerStyle={styles.SCROLL_CONTAINER}
            renderItem={({ item }) => (
              <ProcessingOrderCard
                order_data={item}
                {...props}
                {...item}
                onclick={() =>
                  navigation.navigate('orderdetails', {
                    isLocalOrder: item?.is_international,
                    orderType: 'processing',
                    order_id: item?.order_id,
                  })
                }
                detinationWidth={mvs(50)}
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
        <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'}  inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
      </View>
    );
};
export const mapStateToProps = state => ({
  processing_orders: state.order?.processing_orders,
  profileData: state.auth.userInfo?.profile || {},
});

export const mapDispatchToProps = {
  fetchProcessingOrders: (page) => TAKE_TO_ACTIONS.fetchProcessingOrders(page),
};
export default connect(mapStateToProps, mapDispatchToProps)(ProcessingOrders);

const styles = StyleSheet.create({
  SCROLL_CONTAINER: {
    paddingHorizontal: mvs(22),
    paddingBottom: mvs(22),
    paddingTop: mvs(5),
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
