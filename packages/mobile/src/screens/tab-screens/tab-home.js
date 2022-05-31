import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Animated,
  Linking,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import UI_API from '../../../../common/store/services';
import { Pagination } from '../../components/atoms/pagination';
import SkeletonView from '../../components/atoms/SkeletonView';
import Header from '../../components/molecules/header/header-1x';
import DeliveredOrderCard from '../../components/molecules/order_card/delivery-history-card';
import MakeOfferOrderCard from '../../components/molecules/order_card/make-offer-card';
import OrderTypeHeader from '../../components/molecules/order_card/order-type-header';
import ProcessingOrderCard from '../../components/molecules/order_card/processed-offer-card';
import colors from '../../config/colors';
import { mvs, width } from '../../config/metrices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext } from 'react';
import LocalizationContext from '../../../LocalizationContext';
import DropdownAlert from 'react-native-dropdownalert';
import { connectEcho } from '../../config/sockets';
import { Chase } from 'react-native-animated-spinkit';


const HomeTab = props => {
  const { navigation, route, fetchHomeOrders, home_orders, profileData, history_orders, isGuest, fetchEcho } = props;
  const alertRef = React.useRef();
  const [scrollX, setScrollX] = React.useState(React.useRef(new Animated.Value(0)).current);
  const [scrollX2, setScrollX2] = React.useState(React.useRef(new Animated.Value(0)).current);
  const [scrollX3, setScrollX3] = React.useState(React.useRef(new Animated.Value(0)).current);
  const [scrollX4, setScrollX4] = React.useState(React.useRef(new Animated.Value(0)).current);

  console.log('new Animated.Value(0)::', new Animated.Value(0));
  // const {onLayout, width} = useLayout();
  // let lastWidth = NaN;
  // React.useEffect(() => {
  //   if (width != null && width !== lastWidth) {
  //     lastWidth = width;
  //     // alert(width - mvs(22) * 2);
  //   }
  // }, [width]);

  // const isLarge = width >= 500;
  // console.log(width);
  // lastWidth = width - mvs(22) * 2;
  const itemHeight = mvs(240);
  const { width } = useWindowDimensions();
  const [loading, setLoading] = React.useState(true);



  useEffect(() => {
    if (!isGuest) {
      connectEcho(profileData?.id)
        .then((res) => {
          fetchEcho(res)
        })
    }
  }, [])


  const getHomeOrdersHanlder = async () => {
    try {
      setLoading(true);
      await fetchHomeOrders();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };


  React.useEffect(() => {
    let isActive = true;
    setScrollX(new Animated.Value(0));
    setScrollX2(new Animated.Value(0));
    setScrollX3(new Animated.Value(0));
    setScrollX4(new Animated.Value(0));
    getHomeOrdersHanlder();
    return () => { isActive = false };
  }, [ history_orders]);

  const onScrollEvent = scroll => {
    return Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: { x: scroll },
          },
        },
      ],
      {
        useNativeDriver: true,
      },
    );
  };
  const pagination = (list, scrollType) => {
    return (
      <Pagination
        list={list}
        scrollX={scrollType}
        style={styles.PAGINATION}
        dotStyle={{ backgroundColor: colors.price_border }}
      />
    );
  };
  const getItemLayout = (data, index) => ({
    length: itemHeight,
    offset: itemHeight * index,
    index,
  });
  const renderPostedCard = ({ item }) => (
    <View style={{ paddingHorizontal: mvs(22) }}>
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
  );
  const renderRelevantCard = ({ item }) => (
    <View style={{ paddingHorizontal: mvs(22) }}>
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
  );
  const renderDeliveredCard = ({ item }) => (
    <View style={{ paddingHorizontal: mvs(22), paddingBottom: mvs(2) }}>
      <DeliveredOrderCard
        detinationWidth={mvs(90)}
        {...props}
        {...item}
        {...UI_API._returnOrderProps(item)}
        order_id={item?.order_id}
        order_data={item}
        offer_by={item.offer_by}
        // local = {item?.is_international}
        style={{
          width: width - mvs(22) * 2,
        }}
      />
    </View>
  );
  const renderProcessingCard = ({ item }) => (
    <View style={{ paddingHorizontal: mvs(22), width: width }}>
      <ProcessingOrderCard
        detinationWidth={mvs(45)}
        {...props}
        {...item}
        {...UI_API._returnOrderProps(item)}
        order_id={item?.order_id}
        order_data={item}
        offer_by={item?.offer_by}
        style={{
          width: width - mvs(22) * 2,
        }}
      />
    </View>
  );
  const keyExtractor = (item, index) => index.toString();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Header {...props}  headerLog bellIcon />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Chase size={mvs(30)} color={colors.primary} />
        </View>
      </View>
    );
  } else
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Header {...props}  headerLog bellIcon />
        <View style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled
            contentContainerStyle={styles.SCROLL_CONTAINER}>
            <OrderTypeHeader
              style={{ color: colors.primary }}
              seeMore={false}
              title="Relevant for you"
              onPress={() =>
                navigation.navigate('localorders', {
                  isLocalOrders: true,
                  isRelavent: true,
                })
              }
            />
            <View style={{ ...styles.RELEVENT_ORDER }}>
              <Animated.FlatList
                ListEmptyComponent={<SkeletonView />}
                getItemLayout={getItemLayout}
                maxToRenderPerBatch={5}
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                windowSize={8}
                onScroll={onScrollEvent(scrollX)}
                horizontal
                keyExtractor={keyExtractor}
                contentContainerStyle={{}}
                data={home_orders?.relevant_orders}
                renderItem={renderRelevantCard}
              />
              {pagination(home_orders?.relevant_orders, scrollX)}
            </View>

            <OrderTypeHeader
              title="Posted Orders"
              onPress={() => navigation.navigate('postedorders')}
            />
            <View
              style={{ ...styles.RELEVENT_ORDER, backgroundColor: colors.white }}>
              <Animated.FlatList
                ListEmptyComponent={<SkeletonView />}
                getItemLayout={getItemLayout}
                maxToRenderPerBatch={5}
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                horizontal
                contentContainerStyle={{}}
                onScroll={onScrollEvent(scrollX2)}
                data={home_orders?.posted_orders}
                renderItem={renderPostedCard}
                keyExtractor={keyExtractor}
              />
              {pagination(home_orders?.posted_orders, scrollX2)}
            </View>
            {home_orders?.processing_orders?.length > 0 && (
              <>
                <OrderTypeHeader
                  title="Processing Orders"
                  onPress={() => navigation.navigate('processingorders')}
                />
                <View style={{ ...styles.RELEVENT_ORDER, paddingBottom: mvs(2) }}>
                  <Animated.FlatList
                    ListEmptyComponent={
                      <SkeletonView style={{ paddingBottom: mvs(20) }} />
                    }
                    getItemLayout={getItemLayout}
                    maxToRenderPerBatch={5}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    horizontal
                    contentContainerStyle={{}}
                    onScroll={onScrollEvent(scrollX3)}
                    data={home_orders?.processing_orders}
                    renderItem={renderProcessingCard}
                    keyExtractor={keyExtractor}
                  />
                  {pagination(home_orders?.processing_orders, scrollX3)}
                </View>
              </>
            )}

            {home_orders?.delivered_orders?.length > 0 && (
              <>
                <OrderTypeHeader
                  title="Delivered Orders"
                  onPress={() => navigation.navigate('deliveredOrders')}
                />
                <View style={{ ...styles.RELEVENT_ORDER, paddingBottom: mvs(0) }}>
                  <Animated.FlatList
                    ListEmptyComponent={
                      <SkeletonView style={{ paddingBottom: mvs(20) }} />
                    }
                    getItemLayout={getItemLayout}
                    maxToRenderPerBatch={5}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    horizontal
                    contentContainerStyle={{}}
                    onScroll={onScrollEvent(scrollX4)}
                    data={home_orders?.delivered_orders}
                    renderItem={renderDeliveredCard}
                    keyExtractor={keyExtractor}
                  />
                  {pagination(home_orders?.delivered_orders, scrollX4)}
                </View>
              </>
            )}
          </ScrollView>
        </View>
        <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'} inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
      </View>
    );
};

const mapStateToProps = state => ({
  home_orders: state.home?.home_orders,
  profileData: state.auth.userInfo?.profile || {},
  history_orders: state.menu_orders?.history_orders,
  isGuest: state.auth.isGuest,
});

const mapDispatchToProps = {
  fetchHomeOrders: () => TAKE_TO_ACTIONS.fetchHomeOrders(),
  fetchEcho: echo => TAKE_TO_ACTIONS?.fetchEcho(echo),
};
export default connect(mapStateToProps, mapDispatchToProps)(HomeTab);

const styles = StyleSheet.create({
  SCROLL_CONTAINER: {
    paddingHorizontal: mvs(22),
    paddingTop: mvs(27),
  },
  PAGINATION: {
    bottom: mvs(0),
  },
  RELEVENT_ORDER: {
    // height: mvs(260),
    paddingBottom: mvs(22),
    // backgroundColor: colors.black,
    marginBottom: mvs(25),
    width: width,
    alignSelf: 'center',
  },
});
