import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import React from 'react';
import {
  ActivityIndicator,
  FlatList, Linking, StyleSheet, View
} from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import Header from '../../components/molecules/header/header-1x';
import InternationalOrderDateFilterModal from '../../components/molecules/modals/international-order-date-filter-modal';
import MakeOfferOrderCard from '../../components/molecules/order_card/make-offer-card';
import OrderTypeHeader from '../../components/molecules/order_card/order-type-header';
import colors from '../../config/colors';
import { mvs, width } from '../../config/metrices';
import Regular from '../../presentation/typography/regular-text';


const BrowseOrders = (props) => {
  const { navigation, route, heigh_paid_orders_by_city, fetchHeighPaidOrdersListByCity,profileData } = props
  const { order,isLocalOrders } = route.params
  const [loading, setLoading] = React.useState(false);
  const alertRef = React.useRef();

  const [pageLoading, setPageLoading] = React.useState(false);
  // const onPagination = async setLoading => {
  //   try {
  //     let page = UI_API._returnPage(delivery_orders);
  //     console.log('page:',page);
  //     if (!page) {
  //       return;
  //     }
  //     setLoading(true);
  //     await fetchDeliveryOrders(page);

  //   } catch (error) {
  //     alertRef.current.alertWithType(
  //       'error',
  //       'Error',
  //       UI_API._returnError(error),
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  React.useEffect(() => {
    onPagination(setLoading,true);
  }, [profileData?.country,order,isLocalOrders]);




  const onPagination = async( setLoading,bool )=> {
    try {
      let page=1;
      if(!bool){
       page= UI_API._returnPage(heigh_paid_orders_by_city);
      console.log('page:',page);
      if (!page) {
        return;
      }
    }
      setLoading(true);

      await fetchHeighPaidOrdersListByCity(order?.city_to, order?.country_to, order?.to_country_short_name,page,isLocalOrders);//city_to,country_to,to_country_short_name
      setLoading(false);

    } catch (error) {
      
      setLoading(false);

        alertRef.current.alertWithType(
          'error',
          'Error',
          UI_API._returnError(error),
        );    
    }
  }
  // React.useEffect(() => {
  //   getHighPaidByCity();
 
  // }, [order,profileData?.currency])

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Header
          bellIcon
          {...props}
          title={`${order?.destination}`}
          allowBackBtn
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Chase size={mvs(30)} color={colors.primary} />
        </View>
      </View>
    );
  }else if (!loading && Object.keys(heigh_paid_orders_by_city).length <= 0&&heigh_paid_orders_by_city?.data?.length<=0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white}}>
        <Header
          bellIcon
          {...props}
          title={`${order?.destination}`}
          allowBackBtn
        />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: mvs(20),
          }}>
          <Regular
            label={`Oops! it seems no order found`}
            style={{textAlign: 'center', color: colors.primary}}
          />
        </View>
      </View>
    );
  } else
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <Header
        bellIcon
        {...props}
        title={`${order?.destination}`}
        allowBackBtn
      />
      <View style={{ flex: 1, backgroundColor: colors.white ,}}>
        {/* <View style={{ flex: 1, backgroundColor: colors.white ,}}> */}
          <FlatList
          keyExtractor={(item,index)=>index.toString()}
            data={heigh_paid_orders_by_city?.data}
            contentContainerStyle={styles.SCROLL_CONTAINER}
            onEndReachedThreshold={0.5}
            onEndReached={() =>{
               if(!pageLoading&&!loading)
               onPagination(setPageLoading);
              }}
            renderItem={({ item, index }) =>
            
            <View
            style={{
              paddingBottom: mvs(2),
              marginBottom: mvs(20),
            }}>
              <MakeOfferOrderCard
                {...props}
                {...item}
                {...UI_API._returnOrderProps(item)}
                order_data={item}
                style={{
                  width: width - mvs(22) * 2,
                }}
              />
              </View>
            }
          />
             {pageLoading && (
          <View style={styles.pageLoader}>
            <Chase size={mvs(20)} color={colors.primary} />
          </View>
        )}
        {/* </View> */}
       
      </View>
      <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'}  inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
    </View>
  );
};
const mapStateToProps = state => ({
  heigh_paid_orders_by_city: state.common_orders_list?.heigh_paid_orders_by_city,
  profileData: state.auth.userInfo?.profile || {},
});

const mapDispatchToProps = {
  fetchHeighPaidOrdersListByCity: (city_to,country_to,to_country_short_name,page,isLocalOrders) =>{
   return TAKE_TO_ACTIONS.fetchHeighPaidOrdersListByCity(city_to,country_to,to_country_short_name,page,isLocalOrders)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(BrowseOrders);

const styles = StyleSheet.create({
  SCROLL_CONTAINER: {
    paddingBottom: mvs(22),
    paddingHorizontal: mvs(22),
    paddingTop:mvs(27),
    flexGrow: 1,
  },
  LOC_DES: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: mvs(13),
    paddingVertical: mvs(12),
    borderRadius: mvs(13),
    backgroundColor: colors.primary,
  },
  REVERSE_LOC_DES: {
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.primary,
  },
  LOC_DES_CONTAINER: {
    backgroundColor: colors.white,
    paddingHorizontal: mvs(22),
    paddingBottom: mvs(20),
    borderBottomStartRadius: mvs(20),
    borderBottomEndRadius: mvs(20),
  },
  SEARCH_MAP: {
    marginTop: mvs(15),
    alignSelf: 'flex-end',
    width: '49%',
    height: mvs(38),
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingHorizontal: mvs(23),
  },
  MAP_ICON: {
    height: mvs(18),
    width: mvs(14),
  },
});
