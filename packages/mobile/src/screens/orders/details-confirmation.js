import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import moment from 'moment';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import * as Images from '../../../resource/assets/order-car-icons';
import Buttons from '../../components/atoms/Button';
import OrderDestination from '../../components/atoms/OrderDestination';
import OrderDestinationAddress from '../../components/atoms/OrderDestinationAddress';
import ImagePlaceholder from '../../components/atoms/Placeholder';
import Header from '../../components/molecules/header/header-1x';
import InputWithTitle from '../../components/molecules/input-with-title';
import CongratsModal from '../../components/molecules/modals/congrats-modal';
import ProductInfo from '../../components/molecules/product-info';
import colors from '../../config/colors';
import { mvs } from '../../config/metrices';
import Regular from '../../presentation/typography/regular-text';
import { Map } from '../../../resource/assets/common-icons';
import TAKE_2_API from '@khan_ahmad786/common/api/API';
const DetailsConfirmation = props => {
  const { createOrder, profileData, activeCountryList, countryList } = props;
  const { isLocal } = props.route.params;
  const Car = Images['car'];
  const Aeroplane = Images['aeroplane'];
  const Location = Images['location'];
  const CarActive = Images['car_active'];
  const AeroplaneActive = Images['aeroplane_active'];
  const LocationAtive = Images['location_active'];

  const [congratsModal, setCongratsModal] = useState(false);
  const [orderTaxes, setOrderTaxes] = useState({});
  const scrollRef = React.useRef(null);
  const alertRef = React.useRef();
  const [loading, setLoading] = React.useState(false);
  const [calculateLoading, setCalculateLoading] = React.useState(false);

  const [payload, setPayload] = React.useState({
    ...props.route.params.payload,
    tax: 0.1,
    urgentFee: 0.34,
    takeToFee: 0.5,
    processingFee: 0.02,
  });
  console.log('props.route.params.payload::', props.route.params.payload);

  const onCreate = (bool = true,setLoading) => {
    payload?.isPhysical
      ? createPhysicalStoreOrder(bool,setLoading)
      : createEcommerceStoreOrder(bool,setLoading);
  };

  

  const delivery_date = payload?.isUrgent
    ? payload?.is24Days
      ? moment().add(1, 'days').format('YYYY-MM-DD')
      : payload?.is2Days
        ? moment().add(2, 'days').format('YYYY-MM-DD')
        : moment().add(3, 'days').format('YYYY-MM-DD')
    : payload?.date;



  const createPhysicalStoreOrder = async (bool,setLoading) => {
    // console.log('payload:', payload);
    let physical_payload = {
      'old_gallery[]': payload?.images
        ?.filter(el => el.old_gallery)
        .map(el => el.uri),
      'order_gallery[]': payload?.images
        ?.filter(el => el.uri !== '')
        .filter(el => el.type !== undefined)
        .filter(el => el.old_gallery !== true),
      name: payload?.productName || '',
      price: payload?.productPrice || '',
      detail: payload?.productDetails || '',
      shop_name: payload?.shopName || '',
      shop_country: payload?.shopAddress?.country || '',
      shop_city: payload?.shopAddress?.city || '',
      shop_block: payload?.shopAddress?.area || '',
      shop_street: payload?.shopAddress?.street || '',
      shop_latitude: payload?.shopAddress?.latitude || '',
      shop_longitude: payload?.shopAddress?.longitude || '',
      from_country_short_name: payload?.shopAddress?.country_short_name || '',
      instructions: payload?.instractions || '',
      quantity: payload?.quantity || 0,
      with_box: payload?.withBox || false,
      is_private: payload?.private || false,
      is_urgent: payload?.isUrgent,
      delivery_before_date: payload?.isUrgent ? delivery_date : UI_API._replaceAllSlash(delivery_date),
      reward: payload?.reward || '',
      is_physical: 1,
    };

    physical_payload = payload?.deliveryLocation?.id
      ? { ...physical_payload, to_address_id: payload?.deliveryLocation?.id }
      : {
        ...physical_payload,
        to_country: payload?.deliveryLocation?.country || '',
        to_city: payload?.deliveryLocation?.city || '',
        to_area: payload?.deliveryLocation?.city || '',
        to_block: payload?.deliveryLocation?.city || '',
        to_street: payload?.deliveryLocation?.street_number || '',
        to_building: payload?.deliveryLocation?.building || '',
        to_floor: payload?.deliveryLocation?.floor || '',
        to_address: payload?.deliveryLocation?.fulladdress || '',
        to_latitude: payload?.deliveryLocation?.latitude || '',
        to_longitude: payload?.deliveryLocation?.longitude || '',
        to_country_short_name: payload?.deliveryLocation?.country_short_name || '',
      };

    // console.log('pShop', physical_payload)

    try {
      setLoading(true);
      const response = bool ? await createOrder(physical_payload, payload?.isReOrder, bool ? null : 'order-request-summery') : await TAKE_2_API.createOrder(physical_payload, payload?.isReOrder, bool ? null : 'order-request-summery')
      setOrderTaxes(bool ? {} : response)
      // const newList = countryList?.map(el => ({ ...el, isActive: false }));
      // activeCountryList(newList);
      setLoading(false);
      setCongratsModal(bool);
    } catch (error) {
      setLoading(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
      // scrollRef.current.scrollTo({x: 0, y: 0, animated: true});
    }
  };

  const createEcommerceStoreOrder = async (bool,setLoading) => {
    //  return console.log(payload)
    //  return
    let ecommerce_payload = {
      'old_gallery[]': payload?.images
        ?.filter(el => el.old_gallery)
        .map(el => el.uri),
      'order_gallery[]': payload?.images
        ?.filter(el => el.uri !== '')
        .filter(el => el.type !== undefined)
        .filter(el => el.old_gallery !== true),
      product_link: payload?.url || '',
      product_image_url: payload?.images
        ?.some(el => el.uri && el.type == undefined && el.name == undefined) ? payload?.product_image_url : '',
      name: payload?.productName || '',
      price: payload?.productPrice || '',
      detail: payload?.productDetails || '',
      is_online: 1,
      shop_country: payload?.country || '',
      from_country_short_name: payload?.country_short_name || '',
      // shop_country: payload?.storeAddress?.country || '',
      // shop_city: payload?.storeAddress?.city || '',
      // shop_longitude: payload?.storeAddress?.geoCode?.lng || '',
      // shop_latitude: payload?.storeAddress?.geoCode?.lat || '',
      instructions: payload?.instractions || '',
      quantity: payload?.quantity || 1,
      with_box: payload?.withBox,
      is_private: payload?.private,
      is_urgent: payload?.isUrgent,
      delivery_before_date: delivery_date,
      reward: payload?.reward || '',
    };
    ecommerce_payload = payload?.deliveryLocation?.id
      ? { ...ecommerce_payload, to_address_id: payload?.deliveryLocation?.id }
      : {
        ...ecommerce_payload,
        to_country: payload?.deliveryLocation?.country || '',
        to_city: payload?.deliveryLocation?.city || '',
        to_area: payload?.deliveryLocation?.city || '',
        to_block: payload?.deliveryLocation?.city || '',
        to_street: payload?.deliveryLocation?.street_number || '',
        to_building: payload?.deliveryLocation?.building || '',
        to_floor: payload?.deliveryLocation?.floor || '',
        to_address: payload?.deliveryLocation?.fulladdress || '',
        to_latitude: payload?.deliveryLocation?.latitude || '',
        to_longitude: payload?.deliveryLocation?.longitude || '',
        to_country_short_name: payload?.deliveryLocation?.country_short_name || '',
      };

    console.log("eShop:::::", ecommerce_payload)

    try {
      setLoading(true);
      const response = bool ? await createOrder(ecommerce_payload, payload?.isReOrder, bool ? null : 'order-request-summery') : await TAKE_2_API.createOrder(ecommerce_payload, payload?.isReOrder, bool ? null : 'order-request-summery');

      setOrderTaxes(bool ? {} : response)
      // const newList=countryList?.map(el=>({...el,isActive:false}))
      // activeCountryList(newList)
      setLoading(false);
      setCongratsModal(bool);
    } catch (error) {
      setLoading(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
      // scrollRef.current.scrollTo({x: 0, y: 0, animated: true});
    }
  };

  console.log('payload payloadpayload',payload)

  React.useEffect(() => {
    onCreate(false,setCalculateLoading)
  }, [])
  // console.log(orderTaxes)
  return (
    <View style={styles.mainContainer}>
      {/* <View style={styles.header}> */}
        <Header {...props} title="details confirmation" allowBackBtn bellIcon />
      {/* </View> */}
     <View style={{flex:1}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        ref={scrollRef}
        >
        <View style={styles.productMainContainer}>
          <View style={styles.productContainer}>
            <ProductInfo
              order_img={payload?.images[0]?.uri}
              name={payload?.productName}
              total={`${isLocal?profileData?.currency?.currency_code:'USD'} ${payload?.productPrice}`}
              reward={`${isLocal?profileData?.currency?.currency_code:'USD'} ${payload?.reward}`}
              detailsContainer={{ marginLeft: mvs(30) }}
              priceTitle="Product Price"
            />
          </View>

          <View style={{ paddingHorizontal: mvs(22) }}>
            <View style={styles.LOCATION_DESTINATION}>
              <View style={styles.SUB_LOCATION_DESTINATION}>
                <OrderDestination
                  value={0}
                  width={2 == 2 ? mvs(100) : mvs(50)}
                  SVGFirst={
                    `${payload?.isPhysical
                      ? payload?.shopAddress?.country
                      : payload?.country
                      }` === `${payload?.deliveryLocation?.country}`
                      ? Car
                      : Aeroplane
                  }
                  SVGSecond={Location}
                />
                <View style={{ marginTop: mvs(8) }} />
                <OrderDestinationAddress
                  imageFrom={{
                    uri: countryList?.find(
                      el =>
                        el.short_name ===
                        (payload?.isPhysical
                          ? payload?.shopAddress?.country_short_name?.toLowerCase()
                          : payload?.country_short_name?.toLowerCase()),
                    )?.flag,
                  }}
                  imageTo={{
                    uri: countryList?.find(
                      el => el.short_name === payload?.deliveryLocation?.country_short_name?.toLowerCase(),
                    )?.flag,
                  }}
                  label={`${payload?.isPhysical
                    ? payload?.shopAddress?.country?.slice(0, 15)
                    : payload?.country?.slice(0, 15)
                    } - ${payload?.deliveryLocation?.country?.slice(0, 15)}`}
                  fontSize={12}
                />
              </View>
              <View style={styles.userContainer}>
                <ImagePlaceholder
                  bg_img={profileData?.profile_picture}
                  containerStyle={{
                    height: mvs(37),
                    width: mvs(37),
                    borderRadius: mvs(8),
                  }}
                />
                <Regular
                  label={profileData?.user_name?.split(' ')[0]}
                  style={{ fontSize: mvs(10), alignSelf: 'center' }}
                />
              </View>
            </View>
            <View style={{ ...styles.line, marginTop: mvs(15) }} />
          </View>
        </View>

        <View style={styles.container1}>
          <View style={styles.moreInfoContainer}>
            <InputWithTitle
              title="Product Details"
              value={payload?.productDetails}
              textStyle={{ color: colors.primary }}
              editable={false}
              multiline
              singleInput={false}
              moreOrLess={true}
            />
            <View style={{ ...styles.infoContainer, marginTop: mvs(17) }}>
              <Regular
                label={payload.isUrgent ? 'Urgent Delivery' : 'Delivery Before'}
                style={{
                  ...styles.label,
                  color: payload.isUrgent ? colors.pink : colors.lightgrey2
                }}
              />
              <Regular
                label={
                  payload.isUrgent ?
                    UI_API._returnUrgencyTitle(delivery_date)
                    :
                    delivery_date}
                style={{
                  ...styles.value,
                  color: payload.isUrgent ? colors.pink : colors.lightgrey2
                }}
              />
            </View>
            {/* <View style = {styles.line}></View> */}

            <View style={{ ...styles.infoContainer, marginTop: mvs(10) }}>
              <Regular label="Quantity" style={styles.label} />
              <Regular label={payload.quantity} style={{ ...styles.value }} />
            </View>

            <View style={{ ...styles.infoContainer, marginTop: mvs(10) }}>
              <Regular label="Packaging" style={styles.label} />
              <Regular
                label={payload?.withBox ? 'With box' : 'Without box'}
                style={styles.value}
              />
            </View>

            <View style={{ ...styles.infoContainer, marginTop: mvs(10) }}>
              <Regular label="Where to buy" style={styles.label} />
              <Regular
                label={
                  payload.isPhysical
                    ? payload?.shopName?.length > 8 ? `${payload?.shopName?.substring(0, 8)} ...` : payload?.shopName
                    : payload?.e_commerce_site
                }
                style={{ ...styles.value, color: colors.primary }}
              />
              {(payload?.isPhysical) && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Map
                    height={mvs(18)}
                    width={mvs(14)}
                    style={{ marginRight: mvs(7.3) }}
                  />
                  <Regular
                    label={'Store location'}
                    style={{ fontSize: mvs(13), color: colors.primary }}
                  />
                </View>
              )}
            </View>
          </View>

          <InputWithTitle
            title="Buying Instructions"
            value={payload.instractions}
            textStyle={{ color: colors.primary }}
            style={{ marginTop: mvs(17) }}
            editable={false}
            multiline
            singleInput={false}
            moreOrLess={true}
          />

          <View style={styles.summaryContainer}>
            <Regular
              label="Est Price Summary"
              style={{
                fontSize: mvs(20),
                color: colors.headerTitle,
                marginTop: mvs(17),
              }}
            />

            <View style={styles.moreInfoContainer}>
              <View style={{ ...styles.infoContainer, marginTop: mvs(22) }}>
                <Regular label="Product price" style={styles.label} />
                <Regular
                  label={`${isLocal?profileData?.currency?.currency_code:'USD'} ${payload.productPrice}`}
                  style={styles.value}
                />
              </View>

              {/* <View style={{ ...styles.infoContainer, marginTop: mvs(12) }}>
                <Regular label="USA Tax" style={styles.label} />
                <Regular label={`${isLocal?profileData?.currency?.currency_code:'USD'} ${payload?.tax}`} style={styles.value} />
              </View>

              {payload.isUrgent && (
                <View style={{ ...styles.infoContainer, marginTop: mvs(12) }}>
                  <Regular label="Urgent delivery fees" style={styles.label} />
                  <Regular
                    label={`${isLocal?profileData?.currency?.currency_code:'USD'} ${payload?.urgentFee}`}
                    style={styles.value}
                  />
                </View>
              )} */}

              <View style={{ ...styles.infoContainer, marginTop: mvs(12) }}>
                <Regular label="Travel reward" style={styles.label} />
                <Regular label={`${isLocal?profileData?.currency?.currency_code:'USD'} ${payload.reward}`} style={styles.value} />
              </View>

              {calculateLoading ?null :
                <>
                  <View style={{ ...styles.infoContainer, marginTop: mvs(12) }}>
                    <Regular label="Taketo fee" style={styles.label} />
                    <Regular
                      label={`${isLocal?profileData?.currency?.currency_code:'USD'} ${orderTaxes?.taketo_fee}`}
                      style={styles.value}
                    />
                  </View>

                  <View style={{ ...styles.infoContainer, marginTop: mvs(12) }}>
                    <Regular label="Payment Processing" style={styles.label} />
                    <Regular
                      label={`${isLocal?profileData?.currency?.currency_code:'USD'} ${orderTaxes?.processing_fee}`}
                      style={styles.value}
                    />
                  </View>

                  <View style={styles.line}></View>

                  <View style={{ ...styles.infoContainer, marginTop: mvs(11) }}>
                    <Regular
                      label="Total"
                      style={{
                        ...styles.label,
                        color: colors.primary,
                        fontSize: mvs(15),
                      }}
                    />
                    <Regular
                      label={`${isLocal?profileData?.currency?.currency_code:'USD'} ${(parseFloat(payload?.productPrice) +
                        parseFloat(payload?.reward) +
                        parseFloat(orderTaxes?.taketo_fee) +
                        parseFloat(orderTaxes?.processing_fee)).toFixed(2)
                        }`}
                      style={{
                        ...styles.value,
                        color: colors.primary,
                        fontSize: mvs(15),
                      }}
                    />
                  </View>
                </>}
            </View>
          </View>
        </View>

        <View style={styles.button}>
          <Buttons.ButtonPrimary
            onClick={()=>onCreate(true,setLoading)}
            loading={loading}
            disabled={loading}
            loaderColor={colors.white}
            title="Submit Order"
          />
        </View>
      </ScrollView>
      </View>
      <CongratsModal
        {...props}
        productName={payload.productName}
        image={payload.images[0]?.uri}
        onTerm = {() => {
          setCongratsModal(false)
          props.navigation.pop(3)
          props.navigation.navigate('termsofuse', {
           URL: 'terms-of-use',
          })
        }}
        visible={congratsModal}
        onClose={() => {
          props.navigation.navigate('main');
        }}
        onPress={() => {
          props.navigation.navigate('main');
        }}
      />
      <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'} inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
    </View>
  );
};

const mapStateToProps = state => {
  return {
    profileData: state.auth.userInfo?.profile || {},
    countryList: state.common.countriesList || [],
  };
};

const mapDispatchToProps = dispatch => ({
  createOrder: (data, isReOrder, endpoint) => dispatch(TAKE_TO_ACTIONS.createOrder(data, isReOrder, endpoint)),
  activeCountryList: countryList =>
    dispatch(TAKE_TO_ACTIONS.activeCountryList(countryList)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DetailsConfirmation);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.white,
  },
  container: {
    flexGrow: 1,
    paddingTop:mvs(27)
  },
  productMainContainer: {
    paddingBottom: mvs(17),
    backgroundColor: colors.white,
    borderBottomLeftRadius: mvs(20),
    borderBottomRightRadius: mvs(20),
  },
  productContainer: {
    paddingHorizontal: mvs(22),
  },
  CONTAINER: {
    flex: 1,
    flexDirection: 'row',
    marginTop: mvs(30),
  },
  IMAGE_CONTAINER: {
    borderRadius: mvs(10),
    height: mvs(125),
    width: mvs(104),
    backgroundColor: colors.white,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.price_border,
  },
  IMAGE: {
    height: '100%',
    width: '100%',
    borderRadius: 20,
  },
  TITLE: {
    fontSize: mvs(18),
    color: colors.headerTitle,
  },
  DESCRIPTION_CONTAINER: {
    marginLeft: mvs(9),
    flex: 1,
    width: mvs(146),
  },
  CARD_CONTENT_LABLE: {
    fontSize: mvs(12),
    color: colors.headerTitle,
  },
  PRICE_CONTAINER: {
    borderColor: colors.price_border,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: mvs(4),
    marginTop: mvs(9),
  },
  PENDING_REWARD_CONTAINER: {
    marginTop: mvs(13),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  BUTTON_CONTAINER: {
    marginTop: mvs(11),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  TODAY: {
    fontSize: mvs(12),
    color: colors.pink,
  },
  MAKE_OFFER: {
    width: mvs(73),
    height: mvs(31),
    backgroundColor: colors.green,
  },
  LOCATION_DESTINATION: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: mvs(14),
    height: mvs(55),
    paddingRight: mvs(134),
  },
  SUB_LOCATION_DESTINATION: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  USER_IMAGE_CONTAINER: {
    borderRadius: mvs(10),
  },
  SUB_USER_IMAGE_CONTAINER: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  USER_IMAGE: {
    height: mvs(37),
    width: mvs(37),
    borderRadius: mvs(10),
    backgroundColor: colors.secondary,
  },
  rewardContainer: {
    height: mvs(58),
    width: '100%',
    borderRadius: mvs(10),
    backgroundColor: colors.green,
    marginTop: mvs(20),
    paddingHorizontal: mvs(11),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container1: {
    paddingHorizontal: mvs(22),
  },
  infoContainer: {
    width: '100%',
    flexDirection: 'row',
    //borderWidth : 1,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: mvs(13),
    color: colors.label,
  },
  value: {
    fontSize: mvs(13),
    color: colors.headerTitle,
  },
  line: {
    width: '100%',
    borderBottomWidth: mvs(0.5),
    borderColor: colors.horizontalLine,
    marginTop: mvs(11),
  },
  moreInfoContainer: {
    backgroundColor: colors.white,
    paddingBottom: mvs(22),
    borderBottomWidth: mvs(0.5),
    borderColor: colors.horizontalLine,
  },
  button: {
    width: '100%',
    paddingHorizontal: mvs(22),
    marginTop: mvs(30),
    marginBottom: mvs(40),
  },
  paymentMethod: {
    marginTop: mvs(15),
    paddingHorizontal: mvs(22),
  },
  radioContainer: {
    height: mvs(38),
    marginTop: mvs(10),
    width: '100%',
    borderRadius: mvs(10),
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    paddingHorizontal: mvs(10),
    alignItems: 'center',
  },
  radioOuter: {
    height: mvs(15),
    width: mvs(15),
    borderRadius: mvs(15 / 2),
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    height: mvs(7),
    width: mvs(7),
    borderRadius: mvs(7 / 2),
    backgroundColor: colors.doted,
  },
  priceContainer: {
    height: mvs(38),
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: mvs(10),
    backgroundColor: colors.primary,
  },
  userContainer: {
    height: '100%',
    position: 'absolute',
    right: 0,
    justifyContent: 'space-between',
  },
  summaryContainer: {
    borderWidth: 1,
    marginTop: mvs(30),
    paddingHorizontal: mvs(10),
    borderWidth: mvs(0.5),
    borderColor: colors.doted,
    borderRadius: mvs(10),
  },
});
