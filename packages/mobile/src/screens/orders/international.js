import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import DestinationCard from '../../components/molecules/destination-card/destination-card';
import Header from '../../components/molecules/header/header-1x';
import InternationalOrderDateFilterModal from '../../components/molecules/modals/international-order-date-filter-modal';
import MakeOfferOrderCard from '../../components/molecules/order_card/make-offer-card';
import OrderTypeHeader from '../../components/molecules/order_card/order-type-header';
import colors from '../../config/colors';
import { mvs, width } from '../../config/metrices';
import Regular from '../../presentation/typography/regular-text';
import DropdownAlert from 'react-native-dropdownalert';
import { Chase } from 'react-native-animated-spinkit';
import { Online, OnlineActive, Physical, PhysicalActive } from '../../../resource/assets/common-icons';
import SortModal from '../../components/molecules/modals/sort-modal';
import { useState } from 'react';

const International = props => {
  const {
    navigation,
    route,
    fetchPostedInternationalOrdersList,
    international_orders,
    profileData,
    clearBrowseOrders,
  } = props;
  const [openFilter, setOpenFilter] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState(false)
  const [pageLoading, setPageLoading] = React.useState(false);
  const alertRef = React.useRef();
  const [sortModal, setSortModal] = React.useState(false);

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };
  React.useEffect(() => {
    const unsubscribe = props?.navigation.addListener('focus', () => {
      clearBrowseOrders();
    });
    return unsubscribe;
  }, [props.navigation]);

  console.log('international_orders?.international_orders:::',international_orders?.international_orders);
  
  const onPagination = async setLoading => {
    try {
      
     
      let page = UI_API._returnPage(international_orders?.international_orders);
      if (!page) {
        return;
      }
      setLoading(true);

      await fetchPostedInternationalOrdersList(page);

    } catch (error) {
      alertRef.current.alertWithType(
        'error',
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
        <Header {...props} title="international" allowBackBtn bellIcon />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Chase size={mvs(30)} color={colors.primary} />
        </View>
      </View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <Header {...props} title="international" allowBackBtn bellIcon />
      <View style={{flex:1}}>
      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent) && !pageLoading&&!loading) {
            onPagination(setPageLoading)
          }
        }}
        scrollEventThrottle={400}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: mvs(10),paddingTop:mvs(27) }}>
        <View style={{ flex: 1,}}>
          <View style={{ paddingHorizontal: mvs(22) }}>
            <OrderTypeHeader
              title="Highest Paid Destinations"
              onPress={() => navigation.navigate('highestpaiddestinations', { isLocal : false })}
            />
          </View>
            <ScrollView
             contentContainerStyle={{paddingHorizontal:mvs(22)}}
              showsHorizontalScrollIndicator={false}
              horizontal>
              {international_orders &&
                international_orders?.highPay_destinations?.map((ele, index) => (
                  <DestinationCard
                    isLocalOrders={false}
                    {...props}
                    key={index}
                    item={ele}
                    onClick={() => { }}
                  />
                ))}
            </ScrollView>
            <View style={{ paddingHorizontal: mvs(22) }}>
            <OrderTypeHeader
              containerStyle={{ paddingTop: mvs(27) }}
              title="International Orders"
              isIcon
              isLocal={false}
              filter
              onSort = {()=>setSortModal(true)}
              //onPress={() => navigation.navigate('localtrip', { isFilter: true, isOnline: selected ? false : true })}
              onPress={() => navigation.navigate('internationaltrip', { isFilter: true, isOnline: !selected ,is_pre_international:true })}
            />
         </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={() => setSelected(false)}
              style={{
                ...styles.topButton,
                backgroundColor: !selected ? colors.primary : colors.white,
              }}>
              {!selected ? <OnlineActive /> : <Online />}
              <Regular
                label="Online"
                style={{
                  color: !selected ? colors.white : colors.primary,
                  marginLeft: mvs(11),
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelected(true)}
              style={{
                ...styles.topButton,
                backgroundColor: selected ? colors.primary : colors.white,
              }}>
              {selected ? <PhysicalActive /> : <Physical />}
              <Regular
                label="Physical"
                style={{
                  color: selected ? colors.white : colors.primary,
                  marginLeft: mvs(11),
                }}
              />
            </TouchableOpacity>
          </View> 
          <View
            style={{ ...styles.RELEVENT_ORDER, backgroundColor: colors.white, }}>
            {!loading&&!pageLoading&&!selected && (international_orders?.international_orders?.data?.filter(x => x?.order_site).length < 1) && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop : mvs(30)}}>
              <Regular style={{ color: colors.primary }} label={'No Result Found'} />
            </View>}
            {!loading&&!pageLoading&&selected && (international_orders?.international_orders?.data?.filter(x => !x?.order_site).length < 1) && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop : mvs(30) }}>
              <Regular style={{ color: colors.primary }} label={'No Result Found'} />
            </View>}

          { !selected?  <FlatList
              data={international_orders?.international_orders?.data?.filter((x => x?.order_site))}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{}}
              renderItem={({ item, index }) => {
                return (
                  <View
                    style={{
                      paddingHorizontal: mvs(22),
                      paddingBottom: mvs(2),
                      marginBottom: mvs(20),
                    }}>
                    <MakeOfferOrderCard
                      {...props}
                      {...item}
                      order_data={item}
                      {...UI_API._returnOrderProps(item)}
                      style={{
                        width: width - mvs(22) * 2,
                      }}
                    />
                  </View>
                );
              }}
            // onEndReachedThreshold={0.5}
            // onEndReached={() => onPagination(setPageLoading)}
            />:
            <FlatList
              data={
                //international_orders?.international_orders?.data
              international_orders?.international_orders?.data?.filter((x => !x?.order_site),
                  )
              }
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{}}
              renderItem={({ item, index }) => {
                return (
                  <View
                    style={{
                      paddingHorizontal: mvs(22),
                      paddingBottom: mvs(2),
                      marginBottom: mvs(20),
                    }}>
                    <MakeOfferOrderCard
                      {...props}
                      {...item}
                      order_data={item}
                      {...UI_API._returnOrderProps(item)}
                      style={{
                        width: width - mvs(22) * 2,
                      }}
                    />
                  </View>
                );
              }}
            // onEndReachedThreshold={0.5}
            // onEndReached={() => onPagination(setPageLoading)}
            />}
            {/* <Pagination list={international_orders.data ? international_orders.data.international_orders : []} scrollX={scrollX4} style={styles.PAGINATION} /> */}
           
          </View>
        </View>
      </ScrollView>
      </View>
      <InternationalOrderDateFilterModal
        onApply={() => {
          setOpenFilter(false);
          props.navigation.navigate('internationaldelivery', {
            isLocalOrder: false,
          });
        }}
        visible={openFilter}
        onClose={setOpenFilter}
        {...props}
      />
      <SortModal
      visible = {sortModal}
      onClose = {() => {setSortModal(false)}}
      />
       {pageLoading && (
              <View style={styles.pageLoader}>
                <Chase size={mvs(20)} color={colors.primary} />
              </View>
            )}
        <DropdownAlert zIndex={5}  elevation={15}  inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
    </View>
  );
};
const mapStateToProps = state => ({
  international_orders: state.common_orders_list?.international_orders,
  profileData: state.auth.userInfo?.profile || {},
});

const mapDispatchToProps  = dispatch => ( {
  fetchPostedInternationalOrdersList: (page) =>
   dispatch(TAKE_TO_ACTIONS.fetchPostedInternationalOrdersList(page)),
    clearBrowseOrders: () => dispatch(TAKE_TO_ACTIONS.clearBrowseOrders()),
});

export default connect(mapStateToProps, mapDispatchToProps)(International);

const styles = StyleSheet.create({
  SCROLL_CONTAINER: {
    paddingHorizontal: mvs(22),
    flexGrow: 1,
  },
  RELEVENT_ORDER: {
    paddingBottom: mvs(22),
    marginBottom: mvs(25),
    width: width,
    alignSelf: 'center',
  },
  PAGINATION: {
    bottom: mvs(0),
  },
  buttonsContainer: {
    //height: mvs(44),
    paddingHorizontal: mvs(22),
    width: '100%',
    //borderWidth : 1,
    // marginTop: mvs(30),
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
