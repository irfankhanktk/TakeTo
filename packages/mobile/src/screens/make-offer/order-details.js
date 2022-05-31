import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Linking,
  TouchableOpacity,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import UI_API from '../../../../common/store/services';
import { Map } from '../../../resource/assets/common-icons';
import { TAKE_TO_INPUT_FIELD } from '../../components/atoms';
import Buttons from '../../components/atoms/Button';
import { InfoField } from '../../components/atoms/order-info-field';
import Header from '../../components/molecules/header/header-1x';
import InputWithTitle from '../../components/molecules/input-with-title';
import { OfferDetailCard } from '../../components/molecules/order_card/order-detail-card/offer-detail-card';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { mvs } from '../../config/metrices';
import Regular from '../../presentation/typography/regular-text';
import OfferMade from './offer-made';
import DropdownAlert from 'react-native-dropdownalert';
import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import { useEffect } from 'react';
import { showLocation } from 'react-native-map-link'
import DetailsImagesModal from '../../components/molecules/modals/details-images-modal/details-images-modal';


const OrderDatails = props => {
  const { isGuest, navigation, makeOfferActions, countriesList, profileData } = props;
  const { isLocalOrder, orderType, order_data = {} } = props.route.params;
  console.log('order_data:::::', order_data);
  const [loading, setLoading] = React.useState(false);
  const [showImgsModal, setShowImgsModal] = React.useState(false);
  const scrollRef = React.useRef();
  const alertRef = React.useRef();
  const [offerSend, setOfferSent] = React.useState(false);
  const [payload, setPayload] = React.useState({
    offerPrice: '',
    specialNotes: '',
  });

  const [makeOfferModal, setMakeOfferModal] = React.useState(false);
  const showGuestAlert = () => {
    Alert.alert(
      'Guest',
      'You are a guest, please register yourself',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        { text: 'OK', onPress: () => props?.navigation?.navigate('login') }
      ]
    );
  }
  const createOfferHandler = async () => {
    try {
      setLoading(true)
      const response = TAKE_TO_CONSTANT.offerPriceValidation(
        payload,
      );
      if (response.status) {
        const data = {
          buyer_id: order_data?.order_by?.user_id,
          order_request_id: order_data?.order_id,
          reward: payload?.offerPrice,
          special_note: '',
          delivery_date: order_data?.order_deliver_before,
        };
        await makeOfferActions(data);
        setMakeOfferModal(true);
        setOfferSent(true);
        setLoading(false);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setLoading(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };

  const reOrderHandler = () => {
    let re_order_object = {
      isReOrder: true,
      name: order_data?.order_title,
      order_gallery: order_data?.order_gallery?.map(el => ({
        uri: el,
        old_gallery: true,
      })),
      quantity: order_data?.order_quantity,
      price: order_data?.raw_order_price?.toString(),
      reward: order_data?.order_reward_price?.toString(),
      detail: order_data?.order_detail,
      instructions: order_data?.order_instructions || '',
      shop_latitude: order_data?.shop_location?.latitude || '',
      shop_longitude: order_data?.shop_location?.longitude || '',
      delivery_before_date: order_data?.delivery_before_date,
      with_box: order_data?.order_packaging || false,
      is_private: order_data?.is_private || false,
      is_urgent: order_data?.is_urgent || false,
      order_site: order_data?.order_site || '',
      shop_name: order_data?.order_shop_name || '',
      shop_block: order_data?.shop_block || '',
      shop_street: order_data?.shop_street || '',
      shop_country: order_data?.shop_country || '',
      shop_city: order_data?.shop_city || '',
      product_link: order_data?.order_store_url || '',
      product_image_url: order_data?.order_image || '',
      country_short_name: order_data?.order_from_country_shortcode || '',
      country_flag:
        (countriesList?.some(el => el.name === order_data?.shop_country) &&
          countriesList?.find(el => el.name === order_data?.shop_country)
            ?.flag) ||
        '',
    };
    console.log('re_order_object::', re_order_object);
    navigation.navigate(
      order_data?.order_site
        ? 'createorderestore'
        : 'createorderpstore',
      { 
        re_order_object: re_order_object,
        isLocal: !order_data?.is_international
       },
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <Header {...props} title={'Order Details'} userIcon={false} allowBackBtn bellIcon />
      <KeyboardAvoidingView
        style={{ flex: 1,}}
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        // keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 33}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.SCROLL_CONTAINER}>
          <OfferDetailCard
            onPressImage={() => setShowImgsModal(true)}
            style={{ marginTop: 0 }}
            {...props}
            {...UI_API._returnOrderProps(order_data)}
            orderType={
              orderType === 'normal' ? 0 : orderType === 'processing' ? 1 : 2
            }
            isLocalOrder={isLocalOrder}
          />

          <View style={{ ...styles.DIV }} />
          <InputWithTitle
            editable={false}
            singleInput={false}
            moreOrLess={true}
            title="Product Details"
            value={order_data?.order_detail}
            textStyle={{ color: colors.primary }}
            style={{ marginTop: mvs(0) }}
            titleStyle={{ fontSize: mvs(13) }}
          />
          {order_data?.is_urgent ? (
            <InfoField
              label={'Urgent Delivery'}
              value={UI_API._returnUrgencyTitle(
                order_data?.order_deliver_before,
              )}
              labelStyle={{ color: colors.pink, fontSize: mvs(13) }}
              valueStyle={{ color: colors.pink, fontSize: mvs(13) }}
              containerStyle={{ marginTop: mvs(18) }}
            />
          ) : (
            <InfoField
              label={'Deliver before'}
              containerStyle={{ marginTop: mvs(18) }}
              value={order_data?.order_deliver_before}
            />
          )}
          <InfoField
            labelStyle={{ fontSize: mvs(13) }}
            valueStyle={{ fontSize: mvs(13) }}
            label={'Quantity'}
            value={order_data?.order_quantity}
          />
          <InfoField
            labelStyle={{ fontSize: mvs(13) }}
            valueStyle={{ fontSize: mvs(13) }}
            label={'Packaging'}
            value={order_data?.order_packaging ? 'With box' : 'Without box'}
          />
          {/* {console.log('order_data:: ',order_data)} */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: mvs(10),
            }}>
            <Regular
              label={'Where to buy'}
              style={{ fontSize: mvs(13), color: colors.label }}
            />
            <Regular
              onPress={() => {
                order_data?.order_site &&
                  Linking.openURL(order_data?.order_store_url)
              }}
              label={
                order_data?.order_site ||
                (order_data?.order_shop_name?.length > 8
                  ? `${order_data?.order_shop_name?.substring(0, 8)} ...`
                  : order_data?.order_shop_name)
              }
              style={{ fontSize: mvs(13), color: colors.primary }}
            />
            {!order_data?.order_site && (
              <TouchableOpacity
                onPress={() => {
                  console.log("order_data:", order_data?.shop_location)
                  const region = {
                    latitude: order_data?.shop_location?.latitude,
                    longitude: order_data?.shop_location?.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                  }
                  props.navigation.navigate("storelocation", { shopRegion: region, order_data: order_data })
                }}
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
              </TouchableOpacity>
            )}
          </View>

          <View style={{ ...styles.DIV }} />
          <InputWithTitle
            editable={false}
            singleInput={false}
            title="Buying Instructions"
            value={order_data?.order_instructions}
            textStyle={{ color: colors.primary }}
            multiline={false}
            moreOrLess={true}
            style={{ marginTop: mvs(0) }}
            titleStyle={{ fontSize: mvs(13) }}
          />
          {orderType === 'normal' && (
            <>
              <View style={styles.MAKE_OFFER_CONTAINER}>
                <TAKE_TO_INPUT_FIELD.PriceInput
                  priceUnit={isLocalOrder? profileData?.currency?.currency_code:'USD'}
                  placeholder={'0'}
                  onChangeText={txt => {
                    if (txt === "") {
                      setPayload({
                        ...payload,
                        offerPrice: txt.trim(),
                      });
                    }
                    else if (TAKE_TO_CONSTANT.floatValidation(txt)) {
                      setPayload({
                        ...payload,
                        offerPrice: txt.trim(),
                      });
                    }
                  }
                  }
                  containerStyle={{ ...styles.PRICE_INPUT }}
                  style={{
                    color: colors.primary,
                    fontSize: mvs(23),
                    fontFamily: fonts.carosSoftRegular,
                  }}
                  value={payload.offerPrice}
                  unitStyle={{
                    fontFamily: fonts.carosSoftRegular,
                    fontSize: mvs(23),
                  }}
                />
                <Buttons.ButtonPrimary
                  loading={loading}
                  loaderColor={colors.white}
                  disabled={loading}
                  onClick={() => {
                    isGuest
                      ? showGuestAlert()
                      : createOfferHandler();
                  }}
                  style={{ width: '49%', backgroundColor: colors.primary }}
                  title={'Make Offer'}
                />
              </View>
            </>
          )}

          <Buttons.ButtonRTL
            onClick={() => {
              isGuest ? showGuestAlert() : reOrderHandler();
            }}
            iconName={'reorder'}
            title={'Reorder'}
            style={{
              justifyContent: 'center',
              marginTop: orderType === 'normal' ? mvs(15) : mvs(129),
            }}
            textStyle={{ color: colors.white, marginLeft: mvs(13) }}
            iconStyle={{ height: mvs(20), width: mvs(20) }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <DropdownAlert zIndex={5}  elevation={15} translucent activeStatusBarStyle={'light-content'} inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
      <OfferMade
        navigation={navigation}
        visible={makeOfferModal}
        onClose={() => {
          setMakeOfferModal(false);
          offerSend &&
            props.navigation?.pop();
        }}
        user_name={order_data?.order_by?.user_name}
        isLocalOrder={!order_data?.is_international}
        orderType={orderType}
        offerData={order_data}
        offeredPrice={payload?.offerPrice}
        {...props}
      />
      <DetailsImagesModal list={order_data?.order_gallery} visible={showImgsModal} onClose={setShowImgsModal} />
    </View>
  );
};

// export default OrderDatails;
const mapStateToProps = state => {
  return {
    isGuest: state.auth.isGuest,
    profileData: state.auth.userInfo?.profile || {},
    countriesList: state.common.countriesList,
  };
};

const mapDispatchToProps = dispatch => ({
  postSigninData: data => dispatch(TAKE_TO_ACTIONS.postSigninData(data)),
  makeOfferActions: data => dispatch(TAKE_TO_ACTIONS.makeOffer(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(OrderDatails);

const styles = StyleSheet.create({
  SCROLL_CONTAINER: {
    paddingHorizontal: mvs(21),
    paddingTop: mvs(27),
    paddingBottom: mvs(41),
  },
  DIV: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: mvs(15),
    marginBottom: mvs(13),
    borderColor: colors.border,
  },
  NOTES_CONTAINER: {
    backgroundColor: colors.secondary,
    paddingVertical: mvs(8),
    paddingHorizontal: mvs(13),
    borderRadius: mvs(10),
  },
  INPUT: {
    paddingVertical: mvs(5),
    fontFamily: fonts.carosSoftRegular,
    fontSize: mvs(15),
  },
  TOT_REWARD: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  MAKE_OFFER_CONTAINER: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: mvs(62),
  },
  PRICE_INPUT: {
    height: mvs(52),
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    width: '49%',
  },
});
