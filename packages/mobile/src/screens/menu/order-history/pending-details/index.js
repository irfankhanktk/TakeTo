import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import React from 'react';
import {
  FlatList, ScrollView, StyleSheet, View
} from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import * as Images from '../../../../../resource/assets/order-car-icons';
import OrderDestination from '../../../../components/atoms/OrderDestination';
import OrderDestinationAddress from '../../../../components/atoms/OrderDestinationAddress';
import Header from '../../../../components/molecules/header/header-1x';
import OfferCard from '../../../../components/molecules/order_card/offer-card';
import OrderDetailsAnimated from '../../../../components/molecules/order_card/order-details-animated';
import ProductInfo from '../../../../components/molecules/product-info';
import colors from '../../../../config/colors';
import { mvs } from '../../../../config/metrices';
import Regular from '../../../../presentation/typography/regular-text';


const PendingDetails = props => {
  const {
    navigation,
    route,
    fetchSingleOrderHistoryOffers,
    orderyHistoryOffers,
  } = props;
  const { isLocalOrders, order_id } = route?.params;
  const CarActive = Images['car_active'];
  const Location = Images['location'];

  const [loading, setLoading] = React.useState(true);
  const alertRef = React.useRef();
  const scrollRef = React.useRef();
  //  console.log(orderyHistoryOffers)

  React.useEffect(() => {
    const unsubscribe = props?.navigation.addListener('focus', async () => {
      // (async )();
      try {
        setLoading(true);
        await fetchSingleOrderHistoryOffers(order_id);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        alertRef.current.alertWithType(
          'error',
          'Error',
          UI_API._returnError(error),
        );
        // scrollRef.current.scrollTo({x: 0, y: 0, animated: true});
      }
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <View style={{ backgroundColor: colors.white }}>
          <Header
            {...props}
            title={'Offers'}
            allowBackBtn
            bellIcon
          />
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Chase size={mvs(30)} color={colors.primary} />
        </View>
      </View>
    );
  } else if (!loading && Object.keys(orderyHistoryOffers).length <= 0) {
    return (
      <View style={styles.mainContainer}>
        <View style={{ backgroundColor: colors.white }}>
          <Header
            {...props}
            title={'Offers'}
            allowBackBtn
            bellIcon
          />
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: mvs(20),
          }}>
          <Regular
            label={`Oops! it seems something went wrong. While fetching International orders details`}
            style={{ textAlign: 'center', color: colors.primary }}
          />
        </View>
      </View>
    );
  } else
    return (
      <View style={styles.mainContainer}>
        <Header
          {...props}
          title={'Offers'}
          allowBackBtn
          bellIcon
        />
        <View style={{ flex: 1 ,marginTop: mvs(2)}}>
          <ScrollView contentContainerStyle={{ paddingTop: mvs(27)}} nestedScrollEnabled>
            <View style={styles.optionsContainer}>
              <ProductInfo
              detailsContainer={{paddingLeft:mvs(30)}}
                disabled={false}
                order_img={orderyHistoryOffers?.order_image}
                priceTitle="Product Price"
                name={orderyHistoryOffers?.order_title}
                total={`${orderyHistoryOffers?.order_price}`}
                reward={`${orderyHistoryOffers?.order_reward_price}`}
                order_gallery={orderyHistoryOffers?.order_gallery}
              />
              <View style={styles.trackMainContainer}>
                <View style={styles.trackContainer}>
                  <OrderDestination
                    label={
                      ' - - - - - - - - - - - - - - - - - - - - - - - - - - '
                    }
                    containerStyle={{}}
                    width={mvs(62)}
                    value={0}
                    SVGFirst={(!orderyHistoryOffers?.is_international) ? Images.car : Images.aeroplane}
                    SVGSecond={Location}
                  />
                  <OrderDestinationAddress
                    imageFrom={{ uri: orderyHistoryOffers?.order_from_flag }}
                    imageTo={{ uri: orderyHistoryOffers?.order_to_flag }}
                    fontSize={12}
                    style={{ marginTop: mvs(11.3) }}
                    label={`${orderyHistoryOffers?.order_from?.slice(0,15)} - ${orderyHistoryOffers?.order_to?.slice(0,15)}`}
                  />
                </View>
              </View>
            </View>
            <View style={styles.moreDetailsContainer}>
              <OrderDetailsAnimated
                {...props}
                instruction={orderyHistoryOffers?.order_instructions}
                product_details={orderyHistoryOffers?.order_detail}
                deliveryBefore={TAKE_TO_CONSTANT.getDate(
                  orderyHistoryOffers?.order_deliver_before,
                )}
                quantity={orderyHistoryOffers.order_quantity}
                packaging={
                  orderyHistoryOffers?.order_packaging
                    ? 'With box'
                    : 'Without box'
                }
                location={orderyHistoryOffers?.shop_location || {}}
                //site_url={orderyHistoryOffers?.order_store_url||''}
                //site = {orderyHistoryOffers?.order_site || orderyHistoryOffers?.order_shop_name}
                order_data={orderyHistoryOffers}
              />
            </View>

            <View style={styles.offersMainContainer}>
              <Regular
                label="Offers"
                style={{
                  color: colors.headerTitle,
                  marginTop: mvs(22),
                  alignSelf: 'center',
                }}
              />
            
             { 
               orderyHistoryOffers?.offers_list?.length === 0 ? <View>
                <View
                  style={{
                    // flex: 1,
                    height:mvs(300),
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: mvs(20),
                  }}>
                  <Regular
                    label={`Oops! it seems that you have no offer yet`}
                    style={{ textAlign: 'center', color: colors.primary }}
                  />
                </View>
              </View> :
             <View style={styles.flatlistContainer}>
                  <FlatList
                    nestedScrollEnabled
                    data={orderyHistoryOffers?.offers_list}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                      <OfferCard
                        name={item?.offer_by}
                        image={item?.user_image}
                        price={`${item?.offer_reward}`}
                        deliveryOn={TAKE_TO_CONSTANT.getDate(
                          item?.offer_delivery_on,
                        )}
                        deliveryBefore={TAKE_TO_CONSTANT.getDate(
                          orderyHistoryOffers?.offer_delivery_on,
                        )}
                        type={item?.offer_status}
                        style={{ marginTop: mvs(10) }}
                        onClick={() => {
                          // alert(item?.offer_status)
                          item?.offer_status === 'Disputed' ?
                            props.navigation.replace('disputes')
                            :
                            item?.offer_status === 'accepted' ?
                              {}
                              :
                              item?.offer_status === 'rejected' ?
                                {}
                                :
                                props.navigation.replace('offerrequest', {
                                  offer_id: item?.offer_id,
                                })
                        }
                        }
                      />
                    )}
                    keyExtractor={(item, index) => index?.toString()}
                  />
              </View>}
            </View>
          </ScrollView>
        </View>
        <DropdownAlert zIndex={5}  elevation={15} translucent activeStatusBarStyle={'light-content'} inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />

      </View>
    );
};
export const mapStateToProps = state => ({
  orderyHistoryOffers: state.menu_orders?.orderyHistoryOffers,
});

export const mapDispatchToProps = {
  fetchSingleOrderHistoryOffers: order_id =>
    TAKE_TO_ACTIONS.fetchSingleOrderHistoryOffers(order_id),
};
export default connect(mapStateToProps, mapDispatchToProps)(PendingDetails);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  optionsContainer: {
    width: '100%',
    borderBottomEndRadius: mvs(20),
    borderBottomStartRadius: mvs(20),
    backgroundColor: colors.white,
    paddingBottom: mvs(20),
    paddingHorizontal: mvs(22),
    //paddingTop: mvs(30),
  },
  optionsMainContainer: {
    flex: 1,
    paddingHorizontal: mvs(22),
  },
  option1: {
    //height : mvs(56),
    width: '100%',
    alignSelf: 'center',
    marginTop: mvs(30),
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: mvs(10),
    paddingHorizontal: mvs(10),
    paddingTop: mvs(12),
    paddingBottom: mvs(13),
  },
  option2: {
    //height : mvs(71),
    width: '100%',
    alignSelf: 'center',
    marginTop: mvs(12),
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: mvs(10),
    paddingHorizontal: mvs(10),
    paddingTop: mvs(12),
    paddingBottom: mvs(13),
  },
  optionTitle: {
    fontSize: mvs(15),
    color: colors.primary,
  },
  optionDetail: {
    fontSize: mvs(12),
    color: colors.headerTitle,
    marginTop: mvs(4),
  },
  buttonContainer: {
    marginVertical: mvs(18),
    paddingHorizontal: mvs(22),
  },
  trackMainContainer: {
    //borderWidth : 1,
    width: '100%',
    paddingLeft: mvs(113),
    marginTop: mvs(14.2),
  },
  trackContainer: {
    //borderWidth : 1,
    width: '100%',
    alignSelf: 'flex-end',
    //height: mvs(53.92),

    alignItems: 'center',
  },
  offersMainContainer: {
    paddingHorizontal: mvs(22),
    flex:1,
    //borderWidth : 1
  },
  moreDetailsContainer: {
    marginTop: mvs(11),
  },
  flatlistContainer: {
    // height : mvs(233),
    //borderWidth:1,
    // flex:1,
    marginTop: mvs(11),
    marginBottom: mvs(20),
  },
});
