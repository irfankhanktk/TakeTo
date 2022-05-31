import services from '@khan_ahmad786/common/api/services';
import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import * as Images from '../../../../../resource/assets/order-car-icons';
import Buttons from '../../../../components/atoms/Button';
import OrderDestination from '../../../../components/atoms/OrderDestination';
import OrderDestinationAddress from '../../../../components/atoms/OrderDestinationAddress';
import ImagePlaceholder from '../../../../components/atoms/Placeholder';
import Header from '../../../../components/molecules/header/header-1x';
import InputWithTitle from '../../../../components/molecules/input-with-title';
import Widthdraw from '../../../../components/molecules/modals/widthdraw';
import ProductInfo from '../../../../components/molecules/product-info';
import colors from '../../../../config/colors';
import fonts from '../../../../config/fonts';
import { mvs } from '../../../../config/metrices';
import DropdownAlert from 'react-native-dropdownalert';
import Light from '../../../../presentation/typography/light-text';
import Regular from '../../../../presentation/typography/regular-text';
import { useEffect } from 'react';

const MyOfferDetails = props => {
  const {
    navigation,
    route,
    widthdrawOffer,
    fetchOrderHistoryOffersDetails,
    profileData,
    clearMyOffers,
    myOffersList,
    fetchMyOffersList,
    //orderHistoryOfferDetails: offer_details,
  } = props;
  const { offer_details } = route.params;
  console.log('offer_details::', offer_details);
  //const {offer_id} = route?.params;
  const CarActive = Images['car'];
  const Aeroplane = Images['aeroplane'];
  const Location = Images['location'];
  const LocationBlue = Images['location_active'];
  const Chat = Images['chat'];
  const alertRef = React.useRef();
  //const Location = ImagesCommon['location_pink'];

  const [widthdrawModal, setWidthdrawModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    console.log('myOffers::::', JSON.stringify(offer_details));
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.mainContainer}>
      {/* <View style={{ backgroundColor: colors.white }}> */}
        <Header {...props} title="My Offers" allowBackBtn />
      {/* </View> */}
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{
          paddingTop: mvs(27)
        }}>
          <View style={styles.optionsContainer}>
            <ProductInfo
              order_img={offer_details?.order_image}
              name={offer_details?.order_title}
              total={`${offer_details?.order_price}`}
              priceTitle="Product Price"
              reward={`${offer_details?.order_reward_price}`}
              detailsContainer={{ marginLeft: mvs(30) }}
            />
            <View style={styles.trackMainContainer}>
              <View style={styles.SUB_LOCATION_DESTINATION}>
                <OrderDestination
                  value={0}
                  width={2 == 1 ? mvs(100) : mvs(50)}
                  SVGFirst={
                    offer_details?.is_international ? Aeroplane : CarActive
                  }
                  SVGSecond={Location}
                />
                <View style={{ marginTop: mvs(8) }} />
                <OrderDestinationAddress
                  imageFrom={{ uri: offer_details?.order_from_flag }}
                  imageTo={{ uri: offer_details?.order_to_flag }}
                  label={`${offer_details?.order_from?.slice(0,15)} - ${offer_details?.order_to?.slice(0,15)}`}
                  fontSize={12}
                />
              </View>
              <TouchableOpacity
                onPress={() =>
                  props?.navigation?.navigate('userprofile', {
                    user_id: offer_details?.order_by?.user_id,
                    is_review: false,
                  })
                }
                style={styles.userContainer}>
                <ImagePlaceholder
                  bg_img={offer_details?.order_by?.user_image}
                  containerStyle={{
                    height: mvs(37),
                    width: mvs(37),
                    borderRadius: mvs(8),
                  }}
                />
                <Regular
                  label={offer_details?.order_by?.user_name?.slice(0, 15)}
                  style={{ fontSize: mvs(10), alignSelf: 'center' }}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ ...styles.normal }}>
            <View style={styles.line} />

            <InputWithTitle
              editable={false}
              title="Product Details"
              //placeholder={'Product details...'}
              value={`${offer_details?.order_detail}`}
              multiline
              style={{ marginTop: mvs(17) }}
              textStyle={{ color: colors.primary }}
              singleInput={false}
              moreOrLess={true}
            />
            <View style={{ ...styles.infoContainer, marginTop: mvs(17) }}>
              <Regular
                label={
                  offer_details?.is_urgent
                    ? 'Urgent Delivery'
                    : 'Delivery before'
                }
                style={{
                  ...styles.label,
                  color: offer_details?.is_urgent
                    ? colors.pink
                    : colors.lightgrey2,
                }}
              />
              <Regular
                label={
                  offer_details?.is_urgent
                    ? UI_API._returnUrgencyTitle(
                      offer_details?.order_deliver_before,
                    )
                    : offer_details?.order_deliver_before
                }
                style={{
                  ...styles.value,
                  color: offer_details?.is_urgent
                    ? colors.pink
                    : colors.lightgrey2,
                }}
              />
            </View>

            <View style={{ ...styles.infoContainer }}>
              <Regular label="Quantity" style={styles.label} />
              <Regular
                label={offer_details?.order_quantity}
                style={styles.value}
              />
            </View>

            <View style={{ ...styles.infoContainer }}>
              <Regular label="Packaging" style={styles.label} />
              <Regular
                label={
                  offer_details?.order_packaging ? 'With box' : 'Without box'
                }
                style={styles.value}
              />
            </View>
            <View style={{ ...styles.infoContainer, marginTop: mvs(14) }}>
              <Regular label="Where to buy" style={styles.label} />

              <Regular
                onPress={() => {
                  offer_details?.order_site &&
                    Linking.openURL(offer_details?.order_store_url);
                }}
                label={
                  offer_details?.order_site ||
                  (offer_details?.order_shop_name?.length > 8
                    ? `${offer_details?.order_shop_name?.substring(0, 8)} ...`
                    : offer_details?.order_shop_name)
                }
                style={{ fontSize: mvs(13), color: colors.primary }}
              />
              {!offer_details?.order_site && (
                <TouchableOpacity
                  onPress={() => {
                    console.log('offer_details:', offer_details?.shop_location);
                    const region = {
                      latitude: offer_details?.shop_location?.latitude,
                      longitude: offer_details?.shop_location?.longitude,
                      latitudeDelta: 0.015,
                      longitudeDelta: 0.0121,
                    };
                    props.navigation.navigate('storelocation', {
                      shopRegion: region,
                      order_data: offer_details,
                    });
                  }}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <LocationBlue
                    height={mvs(18)}
                    width={mvs(14)}
                    style={{ marginRight: mvs(7.3) }}
                  />
                  <Regular
                    label={'Store location'}
                    style={{ fontSize: mvs(13), color: colors.primary }}
                  />
                </TouchableOpacity>
              )}
            </View>

            <View style={{ ...styles.line, marginTop: mvs(14) }} />

            <InputWithTitle
              editable={false}
              singleInput
              title="Buying Instructions"
              //placeholder="Instructions..."
              value={offer_details?.order_instructions}
              multiline
              style={{ marginTop: mvs(17) }}
              textStyle={{ color: colors.primary }}
              titleStyle={{ fontSize: mvs(14) }}
            />
          </View>

          <View style={styles.container}>
            <View style={styles.rewardMainContainer}>
              <View style={styles.rewardContainer}>
                <Regular
                  label={`Requested Reward ${offer_details?.offer_reward_price}`}
                  style={{ color: colors.typeHeader }}
                />
              </View>
            </View>

            <Buttons.ButtonPrimary
              title="Widthdraw Offer"
              style={{ backgroundColor: colors.pink, marginTop: mvs(10) }}
              onClick={() => {
                setWidthdrawModal(true);
              }}
            />
            {offer_details?.thread_id && (
              <TouchableOpacity
                onPress={() => {
                  // alert(offer_details?.thread_id,offer_details?.order_by?.user_name)
                  props.navigation.replace('chat', {
                    thread_id: offer_details?.thread_id,
                    participant_name: offer_details?.order_by?.user_name,
                  });
                }}
                style={styles.chatContainer}>
                <Chat />
                <Light
                  label="Message Buyer"
                  style={{ ...styles.value1, color: colors.white }}
                />
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
      <Widthdraw
        visible={widthdrawModal}
        requested
        loading={deleteLoading}
        title="Widthdraw"
        name={offer_details?.order_title}
        site={
          offer_details?.order_shop_name?.length > 8
            ? `${offer_details?.order_shop_name?.substring(0, 8)} ...`
            : offer_details?.order_shop_name || offer_details?.order_site
        }
        price={offer_details?.order_price}
        image={offer_details?.order_image}
        reward={`${offer_details?.order_reward_price}`}
        offer_reward={offer_details?.offer_reward_price}
        isLocal={!offer_details?.is_international}
        flagFrom={offer_details?.order_from_flag}
        flagTo={offer_details?.order_to_flag}
        from={offer_details?.order_from}
        to={offer_details?.order_to}
        onClose={() => setWidthdrawModal(false)}
        onConfirm={async () => {
          try {
            setDeleteLoading(true);
            await client.delete(
              `${services.create_order.widthdraw_offer}/${offer_details?.offer_id}`,
            );
            // const obj = {
            //   ...myOffersList,
            //   data: myOffersList?.data?.filter(
            //     x => x.offer_id !== offer_details?.offer_id,
            //   ),
            // };
            // await clearMyOffers(obj);
            props.navigation.pop();
            setDeleteLoading(false);
            setWidthdrawModal(false);
            alertRef.current.alertWithType(
              'success',
              'Successfully Widthdraw.',
              'Your offer has been widthdraw successfully',
            );
          } catch (error) {
            setDeleteLoading(false);
            setWidthdrawModal(false);
            alertRef.current.alertWithType(
              'error',
              'Error',
              UI_API._returnError(error),
            );
          }
        }}
      />
      <DropdownAlert zIndex={5}  elevation={15} 
        translucent
        activeStatusBarStyle={'light-content'}
        inactiveStatusBarBackgroundColor={colors.primary}
        ref={alertRef}
      />
    </KeyboardAvoidingView>
  );
};
export const mapStateToProps = state => ({
  orderHistoryOfferDetails: state.menu_orders?.orderHistoryOfferDetails,
  profileData: state.auth.userInfo?.profile || {},
  myOffersList: state.menu_orders?.myOffersList,
});

export const mapDispatchToProps = dispatch => ({
  fetchOrderHistoryOffersDetails: offer_id =>
    TAKE_TO_ACTIONS.fetchOrderHistoryOffersDetails(offer_id),
  fetchMyOffersList: () => TAKE_TO_ACTIONS.fetchMyOffersList(),
  clearMyOffers: obj => dispatch(TAKE_TO_ACTIONS.clearMyOffers(obj)),
});
export default connect(mapStateToProps, mapDispatchToProps)(MyOfferDetails);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  optionsContainer: {
    // height: mvs(270),
    width: '100%',
    borderBottomEndRadius: mvs(20),
    borderBottomStartRadius: mvs(20),
    backgroundColor: colors.white,
    paddingBottom: mvs(15),
    paddingHorizontal: mvs(22),
    // paddingTop: mvs(30),
    //borderWidth:1
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
  //   buttonContainer: {
  //     marginVertical : mvs(18),
  //     paddingHorizontal : mvs(22)
  //   } ,
  trackContainer: {
    //borderWidth : 1,
    width: '68%',
    alignSelf: 'flex-end',
    height: mvs(53.92),
    marginTop: mvs(14.2),
  },
  offersMainContainer: {
    //flex : 1,
    paddingHorizontal: mvs(22),
    //borderWidth : 1
  },
  moreDetailsContainer: {
    marginTop: mvs(11),
  },
  flatlistContainer: {
    height: mvs(233),
    //borderWidth:1,
    marginTop: mvs(11),
    marginBottom: mvs(20),
  },
  normal: {
    //height  : mvs(58),
    width: '100%',
    //borderWidth : 1,
    paddingHorizontal: mvs(22),
    //borderRadius: mvs(10),
    backgroundColor: colors.white,
    paddingBottom: mvs(3),
    //marginTop: mvs(10),
    //justifyContent : 'center'
  },
  titleContainer: {
    flexDirection: 'row',
    width: '100%',
    //borderWidth : 1,
    marginTop: mvs(20.3),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: mvs(15),
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  infoContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: mvs(12),
    //borderWidth : 1,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: mvs(13),
    color: colors.lightgrey2,
  },
  value: {
    fontSize: mvs(13),
    color: colors.typeHeader,
  },
  line: {
    width: '100%',
    borderBottomWidth: mvs(0.5),
    borderColor: colors.doted,
    //marginTop: mvs(11),
  },
  dp: {
    height: mvs(37),
    width: mvs(37),
    borderRadius: mvs(8),
  },
  name: {
    fontSize: mvs(15),
    color: colors.headerTitle,
    marginLeft: mvs(5),
  },
  container: {
    flex: 1,
    paddingHorizontal: mvs(22),
    //borderWidth : 1,
    paddingBottom: mvs(40),
  },
  buyingInstractions: {
    width: '100%',
    borderRadius: mvs(10),
    marginTop: mvs(10),
    backgroundColor: colors.white,
    paddingHorizontal: mvs(13),
    paddingVertical: mvs(13),
  },
  input: {
    //borderWidth : 1,
    fontSize: mvs(15),
    fontFamily: fonts.carosSoftRegular,
    color: colors.headerTitle,
    padding: 0,
    minHeight: mvs(60),
    textAlignVertical: 'top',
    marginTop: mvs(6),
  },
  rewardMainContainer: {
    height: mvs(58),
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: mvs(10),
    marginTop: mvs(15),
    //paddingHorizontal: mvs(10),
    //borderWidth:0.3,
    borderColor: colors.lightgrey2,
  },
  rewardValue: {
    fontSize: mvs(20),
    color: colors.green,
  },
  chatContainer: {
    height: mvs(52),
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: mvs(10),
    marginTop: mvs(12),
    borderWidth: 0.5,
    borderColor: colors.label,
  },
  value1: {
    color: colors.headerTitle,
    marginLeft: mvs(14),
  },
  buttonsContainer: {
    //height : mvs(52),
    width: '100%',
    // borderWidth : 1,
    marginTop: mvs(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: '48.5%',
  },
  routeContainer: {
    width: '60%',
  },
  SUB_LOCATION_DESTINATION: {
    // flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'flex-end',

    // backgroundColor:'red'
    //borderWidth:1,
    // borderColor : 'orange'
  },
  profileMainContainer: {
    height: mvs(37),
    width: '100%',
    //borderWidth : 1,
    marginTop: mvs(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileContainer: {
    height: '100%',
    //width : mvs(126),
    //borderWidth:1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackMainContainer: {
    // borderWidth : 1,
    width: '100%',
    paddingRight: mvs(134),
    marginTop: mvs(22),
  },
  userContainer: {
    height: '100%',
    position: 'absolute',
    right: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardContainer: {
    width: '100%',
    height: '100%',
    borderRadius: mvs(10),
    borderWidth: mvs(0.5),
    borderColor: colors.doted,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
