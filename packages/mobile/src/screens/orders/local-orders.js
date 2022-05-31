import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import DropdownAlert from 'react-native-dropdownalert';

import Header from '../../components/molecules/header/header-1x';
import LocalOrderFilterModal from '../../components/molecules/modals/local-order-filter-modal';
import MakeOfferOrderCard from '../../components/molecules/order_card/make-offer-card';
import OrderTypeHeader from '../../components/molecules/order_card/order-type-header';
import colors from '../../config/colors';
import { mvs, width } from '../../config/metrices';
import Regular from '../../presentation/typography/regular-text';
import DeviceInfo from 'react-native-device-info';
import { Chase } from 'react-native-animated-spinkit';
import { Online, OnlineActive, Physical, PhysicalActive } from '../../../resource/assets/common-icons';
import SortModal from '../../components/molecules/modals/sort-modal';
import DestinationCard from '../../components/molecules/destination-card/destination-card';

const LocalOrders = props => {
  const { navigation, fetchPostedLocalOrdersList, local_orders, countriesList, profileData } = props;
  const [pageLoading, setPageLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState(false);
  const [sortModal, setSortModal] = React.useState(false)
  const isLocalOrders = true;
  const alertRef = React.useRef();
  console.log('local_orders', local_orders);

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };


  console.log('local:', JSON.stringify(local_orders?.local_orders?.data))


  const onPagination = async setLoading => {
    try {
      let page = UI_API._returnPage(local_orders?.local_orders);
      if (!page) {
        return;
      }
      setLoading(true);
      const providers = await DeviceInfo.getAvailableLocationProviders();
      console.log(providers);
      if (Object.keys(providers).length > 0) {

        let location = await UI_API._get_current_location(true);
        console.log("LOC :: ", location)
        if (location) {
          await fetchPostedLocalOrdersList(
            location?.latitude,
            location?.longitude,
            page,
          );
        }
        else {
          await fetchPostedLocalOrdersList(
            undefined,
            undefined,
            page,
          );
        }
      }
      else {
        await fetchPostedLocalOrdersList(
          undefined,
          undefined,
          page,
        );
      }

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
        <Header {...props} title={'local orders'} allowBackBtn bellIcon />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Chase size={mvs(30)} color={colors.primary} />
        </View>
      </View>
    );
  } else if (!loading && Object.keys(local_orders?.local_orders)?.length <= 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Header {...props} title={'local orders'} allowBackBtn bellIcon />
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
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Header {...props} title={'local orders'} allowBackBtn bellIcon />
        <ScrollView
          onScroll={({ nativeEvent }) => {
            if (isCloseToBottom(nativeEvent) && !pageLoading&&!loading) {
              onPagination(setPageLoading)
            }
          }}
          scrollEventThrottle={400}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: mvs(30), paddingTop: mvs(27) }}>
          <View style={{ flex: 1 }}>

            {local_orders?.highPay_destinations?.length > 0 && <>
            <View style={{paddingHorizontal:mvs(22)}}>
              <OrderTypeHeader
                title="Highest Paid Destinations"
                onPress={() => navigation.navigate('highestpaiddestinations', { isLocal: true })}
              />
              </View>
              <ScrollView
                contentContainerStyle={{paddingHorizontal:mvs(22)}}
                showsHorizontalScrollIndicator={false}
                horizontal>
                {local_orders &&
                  local_orders?.highPay_destinations?.map((ele, index) => (
                    <DestinationCard
                      isLocalOrders
                      {...props}
                      key={index}
                      item={ele}
                      onClick={() => { }}
                    />
                  ))}
              </ScrollView>
            </>}
            <View style={{ paddingHorizontal: mvs(22) }}>
              <OrderTypeHeader
                containerStyle={{ marginTop: mvs(20) }}
                title="Local Orders"
                isIcon
                isLocal={true}
                filter
                onSort={() => setSortModal(true)}
                //onPress={() => navigation.navigate('localtrip', { isFilter: true, isOnline: selected ? false : true })}
                onPress={() => navigation.navigate('localtrip', { isFilter: true, isOnline: selected ? false : true,is_local:true })}
              />
            </View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  onPress={() => setSelected(false)}
                  style={{
                    ...styles.topButton,
                    backgroundColor: !selected? colors.primary : colors.white,
                  }}>
                  {!selected? <OnlineActive /> : <Online />}
                  <Regular
                    label="Online"
                    style={{
                      color: !selected? colors.white : colors.primary,
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
              {!loading && !pageLoading && !selected && (local_orders?.local_orders?.data?.filter(x => x?.order_site).length < 1) && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: mvs(30) }}>
                <Regular style={{ color: colors.primary }} label={'No Result Found'} />
              </View>}
              {!loading && !pageLoading && selected && (local_orders?.local_orders?.data?.filter(x => !x?.order_site).length < 1) && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: mvs(30) }}>
                <Regular style={{ color: colors.primary }} label={'No Result Found'} />
              </View>}

              <FlatList
                data={
                  //    local_orders?.data
                  !selected
                    ? local_orders?.local_orders?.data?.filter((x => x?.order_site),
                    )
                    : local_orders?.local_orders?.data?.filter((x => !x?.order_site),
                    )
                }
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{
                  ...styles.SCROLL_CONTAINER,
                  paddingTop: mvs(5),
                  paddingBottom: mvs(22),
                }}
                renderItem={({ item }) => {
                  return (
                    <>
                      <MakeOfferOrderCard
                        {...props}
                        {...item}
                        order_data={item}
                        {...UI_API._returnOrderProps(item)}
                        style={{
                          width: width - mvs(22) * 2,
                        }}
                      />
                      <View style={{ marginBottom: mvs(20) }} />
                    </>
                  );
                }}
              // onEndReachedThreshold={0.5}
              // onEndReached={() => onPagination(setPageLoading)}
              />
            </View>
          </View>
        </ScrollView>
        {pageLoading && (
          <View style={styles.pageLoader}>
            <Chase size={mvs(20)} color={colors.primary} />
          </View>
        )}
        <DropdownAlert zIndex={5}  elevation={15} inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
        <SortModal
          visible={sortModal}
          onClose={() => setSortModal(false)}
        />

      </View>
    );
};

export const mapStateToProps = state => ({
  countriesList: state.common?.countriesList,
  local_orders: state.common_orders_list?.local_orders,
  profileData: state.auth.userInfo?.profile || {},
});

export const mapDispatchToProps = {
  // fetchRelaventOrders: () => TAKE_TO_ACTIONS.fetchRelaventOrders(),
  fetchPostedLocalOrdersList: (latitude, longitude, page) =>
    TAKE_TO_ACTIONS.fetchPostedLocalOrdersList(latitude, longitude, page),
  // fetchAllPostedInternationalOrdersList: () =>
  //   TAKE_TO_ACTIONS.fetchAllPostedInternationalOrdersList(),
};
export default connect(mapStateToProps, mapDispatchToProps)(LocalOrders);

const styles = StyleSheet.create({
  SCROLL_CONTAINER: {
    paddingHorizontal: mvs(22),
    paddingTop: mvs(27)
  },
  RELEVENT_ORDER: {
    paddingBottom: mvs(22),
    marginBottom: mvs(25),
    width: width,
    alignSelf: 'center',
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
