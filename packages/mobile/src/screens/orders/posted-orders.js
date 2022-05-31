import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import { useIsFocused } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import DeviceInfo from 'react-native-device-info';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import { Pagination } from '../../components/atoms/pagination';
import Header from '../../components/molecules/header/header-1x';
import MakeOfferOrderCard from '../../components/molecules/order_card/make-offer-card';
import OrderTypeHeader from '../../components/molecules/order_card/order-type-header';
import colors from '../../config/colors';
import { mvs, width } from '../../config/metrices';
import { connectEcho } from '../../config/sockets';
import Regular from '../../presentation/typography/regular-text';

const PostedOrders = props => {
  const {
    navigation,
    route,
    local_international_orders_list,
    fetchPostedOrdersLocalAndInternational,
    profileData,
    clearLocalAndInternationalOrders,
    isGuest,
    fetchEcho
  } = props;
  const [local_order, setLocal_Order] = React.useState([]);
  const [international_order, setInternational_Order] = React.useState([]);
  const [scrollX, setScrollX] = React.useState(React.useRef(new Animated.Value(0)).current);
  const [scrollX2, setScrollX2] = React.useState(React.useRef(new Animated.Value(0)).current);
  const [loading, setLoading] = React.useState(true);
  const alertRef = React.useRef();
  const isFocus=useIsFocused();

  React.useEffect(() => {
    const unsubscribe = props?.navigation.addListener('focus', () => {
      clearLocalAndInternationalOrders();
    });
    return unsubscribe;
  }, [props.navigation]);

  const fetchPostedOrders = async (stateLoader) => {
    try {
      stateLoader(true);
      // let location = await AsyncStorage.getItem('@location');
      const providers = await DeviceInfo.getAvailableLocationProviders();
      console.log(providers);
      if (Object.keys(providers).length > 0) {
        let location = await UI_API._get_current_location(true);
        console.log("LOC :: ", location)
        if (location) {
          await fetchPostedOrdersLocalAndInternational(
            location?.latitude,
            location?.longitude,
          );
        } else {
          await fetchPostedOrdersLocalAndInternational();
        }
      }
      else {
        await fetchPostedOrdersLocalAndInternational();
      }

    } catch (error) {
      console.log('error:', error);
      alertRef.current.alertWithType(
        'error',
        UI_API._returnError(error),
      );
    } finally {
      stateLoader(false);
    }
  }
  useEffect(() => {
    if (!isGuest) {
      connectEcho(profileData?.id)
        .then((res) => {
          fetchEcho(res)
        })
    }
  }, [])
  
  React.useEffect(() => {
    if(!isFocus) return;
    setScrollX(new Animated.Value(0));
    setScrollX2(new Animated.Value(0));
    fetchPostedOrders(setLoading)
  }, [profileData?.country,isFocus]);

  React.useEffect(() => {
    Object.keys(local_international_orders_list).length > 1 &&
      setLocal_Order(
        local_international_orders_list
          ? local_international_orders_list?.local_orders
          : [],
      );
    Object.keys(local_international_orders_list).length > 1 &&
      setInternational_Order(
        local_international_orders_list
          ? local_international_orders_list?.international_orders
          : [],
      );
  }, [local_international_orders_list]);

  // console.log(local_order)
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        {/* <Header {...props} title="posted orders" allowBackBtn bellIcon /> */}
        <Header {...props} headerLog bellIcon />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Chase size={mvs(30)} color={colors.primary} />
        </View>
        <DropdownAlert zIndex={5}  elevation={15}   translucent activeStatusBarStyle={'light-content'} inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
      </View>
    );
  } else if (
    !loading &&
    local_order.length <= 0 &&
    international_order.length <= 0
  ) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        {/* <Header {...props} title="posted orders" allowBackBtn bellIcon /> */}
        <Header {...props} headerLog bellIcon />
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
        <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'} inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
      </View>
    );
  } else
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        {/* <Header {...props} title="posted orders" allowBackBtn bellIcon /> */}
        <Header {...props} headerLog bellIcon />
        <View style={{ flex: 1, }}>
          <ScrollView
            contentContainerStyle={styles.SCROLL_CONTAINER}
            showsVerticalScrollIndicator={false}>
            {local_order?.length !== 0 && (
              <>
                <OrderTypeHeader
                  isIcon
                  containerStyle={{ paddingTop: mvs(10) }}
                  title="Local Orders"
                  onPress={() =>
                    navigation.navigate('localorders', { isLocalOrders: true })
                  }
                />
                <View style={{ ...styles.RELEVENT_ORDER }}>
                  <Animated.FlatList
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    horizontal
                    contentContainerStyle={{}}
                    onScroll={Animated.event(
                      [
                        {
                          nativeEvent: {
                            contentOffset: { x: scrollX },
                          },
                        },
                      ],
                      {
                        useNativeDriver: true,
                      },
                    )}
                    data={local_order}
                    renderItem={({ item }) => (
                      <View
                        style={{
                          paddingHorizontal: mvs(22),
                          paddingBottom: mvs(2),
                        }}>
                        <MakeOfferOrderCard
                          {...props}
                          order_data={item}
                          {...local_order}
                          {...UI_API._returnOrderProps(item)}
                          style={{
                            width: width - mvs(22) * 2,
                          }}
                        />
                      </View>
                    )}
                    keyExtractor={(item, index) => index + ''}
                  />
                  <Pagination
                    list={local_order}
                    scrollX={scrollX}
                    style={styles.PAGINATION}
                    dotStyle={{ backgroundColor: colors.price_border }}
                  />
                </View>
              </>
            )}
            {international_order?.length !== 0 && (
              <>
                <OrderTypeHeader
                  isLocal={false}
                  isIcon
                  containerStyle={{ paddingTop: mvs(27) }}
                  title="International Orders"
                  onPress={() => navigation.navigate('international')}
                />
                <View style={{ ...styles.RELEVENT_ORDER }}>
                  <Animated.FlatList
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    horizontal
                    contentContainerStyle={{}}
                    onScroll={Animated.event(
                      [
                        {
                          nativeEvent: {
                            contentOffset: { x: scrollX2 },
                          },
                        },
                      ],
                      {
                        useNativeDriver: true,
                      },
                    )}
                    data={international_order}
                    renderItem={({ item }) => (
                      <View
                        style={{
                          paddingHorizontal: mvs(22),
                          paddingBottom: mvs(2),
                        }}>
                        <MakeOfferOrderCard
                          {...props}
                          order_data={item}
                          {...international_order}
                          {...UI_API._returnOrderProps(item)}
                          style={{
                            width: width - mvs(22) * 2,
                          }}
                        />
                      </View>
                    )}
                    keyExtractor={(item, index) => index + ''}
                  />
                  <Pagination
                    list={international_order}
                    scrollX={scrollX2}
                    style={styles.PAGINATION}
                    dotStyle={{ backgroundColor: colors.price_border }}
                  />
                </View>
              </>
            )}
          </ScrollView>
        </View>
        <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'} inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
      </View>
    );
};
export const mapStateToProps = state => ({
  isGuest: state.auth.isGuest,
  local_international_orders_list:
    state.common_orders_list?.local_international_orders_list,
  profileData: state.auth.userInfo?.profile || {},
});

export const mapDispatchToProps = {
  fetchPostedOrdersLocalAndInternational: (latitude, longitude) =>
    TAKE_TO_ACTIONS.fetchPostedOrdersLocalAndInternational(latitude, longitude),
  clearLocalAndInternationalOrders: () => TAKE_TO_ACTIONS.clearLocalAndInternationalOrders(),
  fetchEcho: echo => TAKE_TO_ACTIONS?.fetchEcho(echo),

};
export default connect(mapStateToProps, mapDispatchToProps)(PostedOrders);

const styles = StyleSheet.create({
  SCROLL_CONTAINER: {
    paddingHorizontal: mvs(22),
    paddingBottom: mvs(30),
  },
  RELEVENT_ORDER: {
    // height: mvs(260),
    paddingBottom: mvs(22),
    // backgroundColor: colors.black,
    // marginBottom: mvs(25),
    width: width,
    alignSelf: 'center',
  },
  PAGINATION: {
    bottom: mvs(0),
  },
});
