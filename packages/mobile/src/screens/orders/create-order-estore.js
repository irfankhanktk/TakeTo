import UI_API from '@khan_ahmad786/common/store/services';
import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  // KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView as KeyboardAvoidingView } from 'react-native-keyboard-aware-scroll-view';
import DropdownAlert from 'react-native-dropdownalert';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import * as Images from '../../../resource/assets/order-car-icons';
import { TAKE_TO_INPUT_FIELD } from '../../components/atoms';
import Buttons from '../../components/atoms/Button';
import ImagePlaceholder from '../../components/atoms/Placeholder';
import CustomSwitch from '../../components/atoms/Switch';
import DualText from '../../components/molecules/dual-text/dual-text';
import Header from '../../components/molecules/header/header-1x';
import InputWithTitle from '../../components/molecules/input-with-title';
import CountryPicker from 'react-native-country-picker-modal'
import ImagePicker from '../../components/molecules/modals/image-picker/image-picker';
import PlusButton from '../../components/molecules/order_card/plus-button';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { mvs } from '../../config/metrices';
import Regular from '../../presentation/typography/regular-text';
import { Chase } from 'react-native-animated-spinkit';

const CreateOrderEStore = props => {
  const Search = Images['search'];
  const Clear = Images['clear'];
  const Minus = Images['minus'];
  const Plus = Images['plus'];
  const scrollRef = React.useRef(null);
  const alertRef = React.useRef(null);

  const [openPicker, setOpenPicker] = React.useState(false);
  const [toggle, setToggle] = useState(false);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [toggle1, setToggle1] = useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const {
    selectedShopAddress,
    route,
    fetchShopAddress,
    fetchDeliveryAddress,
    defaultCountry,
    profileData,
    countriesList
  } = props;
  const { re_order_object, isLocal } = route?.params;
  console.log('route?.params',route?.params);
  const [payload, setPayload] = React.useState({
    images: [{ uri: '' }],
    url: '',
    productName: '',
    productPrice: '',
    product_image_url: '',
    productDetails: '',
    instractions: '',
    quantity: 1,
    withBox: false,
    private: false,
    country: profileData?.country?.name || '',
    flag: profileData?.country?.flag || '',
    isPhysical: false,
    e_commerce_site: '',
    country_short_name: profileData?.country?.slug,
  });

  React.useEffect(() => {
    if (re_order_object) {
      // Geocoder.from(
      //   re_order_object?.shop_latitude,
      //   re_order_object?.shop_longitude,
      // )
      //   .then(json => {
      //     const formattedAddress = UI_API._returnAddress(json);
      setPayload({
        ...payload,
        url: re_order_object?.product_link,
        product_image_url: re_order_object?.product_image_url,
        e_commerce_site: re_order_object?.order_site,
        images: [...re_order_object?.order_gallery, ...payload?.images],
        productName: re_order_object?.name,
        productPrice: re_order_object?.price,
        productDetails: re_order_object?.detail?.slice(0, 299),
        shopName: re_order_object?.shop_name,
        country: re_order_object?.shop_country,
        country_short_name: re_order_object?.country_short_name,
        flag: re_order_object?.country_flag,
        isReOrder: re_order_object?.isReOrder,
        // shopAddress: formattedAddress?.fulladdress,
        instractions: re_order_object?.instructions,
        //quantity: re_order_object?.quantity,
        //withBox: re_order_object?.with_box,
        //private: re_order_object?.is_private,
      });
      // })
      // .catch(error => {
      //   // scrollRef.current.scrollTo({x: 0, y: 0, animated: true});
      //   alertRef.current.alertWithType(
      //     'error',
      //     'Error',
      //     UI_API._returnError(error),
      //   );
      // });
    }
  }, [route?.params]);

  const renderImages = ({ item, index }) => {
    return (
      <View style={styles.imageContainer}>
        <ImagePlaceholder bg_img={item?.uri} containerStyle={styles.image} />
        {item?.uri != '' && (
          <TouchableOpacity
            onPress={() => {
              let temp = payload.images;
              temp.splice(index, 1);
              setPayload({
                ...payload,
                images: temp,
              });
            }}
            style={{
              height: mvs(20),
              width: mvs(20),
              borderRadius: mvs(20 / 2),
              backgroundColor: `${colors.primary}`,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              top: mvs(5),
              right: mvs(5),
              ...colors.shadow,
            }}>
            <Icon name="close" size={mvs(15)} color={colors.white} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const updatePayload = getData => {
    setPayload({
      ...payload,
      images: [getData?.profile_image, ...payload.images],
    });
  };

  const openCamera = async () => {
    // launchCamera({mediaType: 'photo', includeBase64: false}, response =>
    await UI_API._openCamera(updatePayload, alertRef);
    // );
  };
  const openGallery = async () => {
    // launchImageLibrary({mediaType: 'photo', includeBase64: false}, response =>
    await UI_API._openGallery(updatePayload, alertRef);
    // );
  };

  const onImageModalSelection = type => {
    //type ::  Camera,Gallery,Delete
    setOpenPicker(false);
    setTimeout(() => {
      if (type === 'Camera') {
        openCamera();
      } else if (type === 'Gallery') {
        openGallery();
      } else {
      }
    }, 2000);
  };

  const onSearch = async () => {
    const data = { url: payload?.url.replace('://m.', '://') };
    console.log('data:::',data);
    try {
      setSearchLoading(true);
      const request = await client.post('online-stores-product-detail', data);
      setSearchLoading(false);
      // if (!request?.data?.name&&payload?.url?.toLowerCase()?.includes('amazon')) {
      //   throw new Error('Oops! It seems product link is invalid.');
      //   //setSearchLoading(false)
      // }

      setPayload({
        ...payload,
        productName: request?.data?.name || '',
        url: request?.data?.product_link || '',
        product_image_url: request?.data?.product_image_url || '',
        productDetails: request?.data?.detail?.slice(0, 299) || '',
        images: [
          ...payload?.images.filter(el => el.type !== undefined),
          ...request?.data?.order_gallery,
          { uri: '' },
        ],
        e_commerce_site: request?.data?.e_commerce_site || '',
      });
    } catch (error) {
      setSearchLoading(false);
      setPayload({ ...payload, url: '' });
      // scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };
console.log('payload :',payload);
  return (
    <View
      style={{ flex: 1, backgroundColor: colors.white }}

    // keyboardVerticalOffset={Platform.OS==='ios'? 0:33}
    >
      <View style={styles.mainContainer}>
        <Header {...props} title="create order" allowBackBtn bellIcon />

        {openModal && <CountryPicker
          visible
          withFilter
          onClose={() => { setOpenModal(false); }}
          onSelect={(item) => {
            console.log(item)
            setPayload({
              ...payload,
              country: item?.name,
              flag: countriesList?.find(x => x.short_name == item?.flag?.split('-')[1])?.flag,
              country_short_name: item?.cca2,
            })
            setOpenModal(false);
          }
          }
        />}

        <KeyboardAvoidingView showsVerticalScrollIndicator={false} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: mvs(22) }} ref={scrollRef}>
          <View style={styles.titleAndSearchContainer}>
            <DualText
              style={{
                fontSize: mvs(15),
                color: colors.headerTitle,
              }}
              content={'I have a'}
              highlightText={' URL '}
              highlightTextStyle={{ fontSize: mvs(15) }}>
              <Regular label="of the product I want" />
            </DualText>

            <Regular
              style={{
                fontSize: mvs(12),
                color: colors.lightgrey1,
                marginTop: mvs(2),
              }}
              label="Let’s go. I have a URL of the product I want to order."
            />

            <View style={styles.searchBar}>
              <TextInput
                style={styles.searchInput}
                onBlur={() => {
                  payload?.url.trim() == '' ?
                    alertRef.current.alertWithType(
                      'error',
                      'Error',
                      'Oops! you have forgot to enter product url.',
                    )
                    :
                    onSearch()
                }}
                blurOnSubmit={() => {
                  payload?.url.trim() == '' ?
                    alertRef.current.alertWithType(
                      'error',
                      'Error',
                      'Oops! you have forgot to enter product url.',
                    )
                    :
                    onSearch()
                }}
                placeholder={'Paste a product link'}
                placeholderTextColor={colors.primary}
                value={payload.url}
                onChangeText={txt => {
                  setPayload({
                    ...payload,
                    url: txt,
                  });
                }}
              />
              <Search onPress={() => {
                payload?.url.trim() == '' ?
                  alertRef.current.alertWithType(
                    'error',
                    'Error',
                    'Oops! you have forgot to enter product url.',
                  )
                  :
                  onSearch()
              }} style={styles.searchIcon} />
            </View>

            <View style={{ height: mvs(125), marginTop: mvs(30) }}>
              <FlatList
                nestedScrollEnabled
                data={payload.images.slice(0, 5)}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  height: '100%',
                  paddingVertical: mvs(1),
                }}
                horizontal
                style={styles.imagesContainer}
                renderItem={renderImages}
              />
              {payload?.images.length < 6 && (
                <View style={styles.plusButton}>
                  <PlusButton onPress={() => setOpenPicker(true)} />
                </View>
              )}
            </View>

            <InputWithTitle
              isRequired
              title="Product Name"
              style={{ marginTop: mvs(22) }}
              textStyle={{ color: colors.primary }}
              placeholderTextColor={colors.input_placehoder}
              placeholder="Enter product name"
              value={payload.productName}
              onChangeText={txt => {
                setPayload({
                  ...payload,
                  productName: txt,
                });
              }}
            //editable = {false}
            />
            <View style={styles.productPriceContainer}>
              <Regular
                label="Product Price"
                style={{ ...styles.title, marginTop: 0 }}
              >
                <Regular label={'*'} style={{ color: colors.mendatory }} />
              </Regular>

              <TAKE_TO_INPUT_FIELD.PriceInput
                onChangeText={txt => {
                  if (txt === '') {
                    setPayload({
                      ...payload,
                      productPrice: txt.trim(),
                    });
                  } else if (TAKE_TO_CONSTANT.floatValidation(txt)) {
                    setPayload({
                      ...payload,
                      productPrice: txt.trim(),
                    });
                  }
                }}
                style={{ color: colors.primary }}
                value={payload.productPrice}
                label="Product Price"
                priceUnit={isLocal? `${profileData?.currency?.currency_code}` : 'USD'}
                placeholder="Price"
              />
            </View>

            <InputWithTitle
              isRequired
              maxLength={300}
              title={`Product Details (${payload?.productDetails?.length}/300)`}
              style={{ marginTop: mvs(22) }}
              textStyle={{ minHeight: mvs(71), textAlignVertical: 'top' }}
              placeholder="Enter details"
              multiline
              placeholderTextColor={colors.input_placehoder}
              value={payload.productDetails}
              onChangeText={txt => {
                setPayload({
                  ...payload,
                  productDetails: txt,
                });
              }}
            />

            <TouchableOpacity
              activeOpacity={1}
              disabled = {(isLocal || re_order_object !== null)}
              onPress={() => setOpenModal(true)}>
              <InputWithTitle
                title="Buy from"
                // isRequired
                onPress={() => !(isLocal || re_order_object !== null)&&setOpenModal(true)}
                style={{ marginTop: mvs(23), height: mvs(38) }}
                textStyle={{ color: colors.primary }}
                value={payload.country?.slice(0, 15)}
                placeholder="Country"
                placeholderTextColor={colors.input_placehoder}
                flag={true}
                row={true}
                flagUri={payload?.flag}
                editable={false}
              />
            </TouchableOpacity>

            <InputWithTitle
              maxLength={300}
              title={`Buying Instructions (${payload?.instractions?.length}/300)`}
              textStyle={{
                minHeight: mvs(71),
                textAlignVertical: 'top',
                color: colors.primary,
              }}
              style={{ marginTop: mvs(22) }}
              placeholder="Enter your note here"
              multiline
              value={payload.instractions}
              placeholderTextColor={colors.input_placehoder}
              onChangeText={txt => {
                setPayload({
                  ...payload,
                  instractions: txt,
                });
              }}
            />
            <View style={styles.quantityContainer}>
              <Regular label="Quantity" style={styles.quantityTitle} />
              <View style={styles.quantityButtonsContainer}>
                <TouchableOpacity
                  onPress={() => {
                    if (payload.quantity > 1) {
                      setPayload({
                        ...payload,
                        quantity: payload.quantity - 1,
                      });
                    }
                  }}
                  style={styles.quantityButton}>
                  <Minus width={mvs(10)} height={mvs(10)} />
                </TouchableOpacity>
                <Regular label={payload.quantity} style={styles.quantity} />
                <TouchableOpacity
                  onPress={() => {
                    if (payload.quantity < 10) {
                      setPayload({
                        ...payload,
                        quantity: payload.quantity + 1,
                      });
                    }
                  }}
                  style={styles.quantityButton}>
                  <Plus width={mvs(10)} height={mvs(10)} />
                </TouchableOpacity>
              </View>
            </View>

            {/* <View style = {styles.toggleMainContainer}>
                 <CustomSwitch/>
              </View> */}

            <CustomSwitch
              //size = "medium"
              style={{ paddingVertical: mvs(1), paddingRight: mvs(1) }}
              value={payload.withBox}
              label="With Box"
              textStyle={{ fontSize: mvs(15) }}
              onChange={val => {
                setPayload({
                  ...payload,
                  withBox: !payload.withBox,
                });
              }}
            />

            <View style={styles.detailContainer}>
              <Regular
                style={styles.detail}
                label="Requiring the box may reduce the number of offers you receive. Travelers generally prefer to deliver orders without the box, to save space."
              />
            </View>

            <View style={styles.privateContainer}>
              <CustomSwitch
                // style={{ paddingVertical: mvs(1), paddingRight: mvs(1) }}
                //size = "medium"
                value={payload.private}
                label="PRIVATE LISTING"
                textStyle={{ fontSize: mvs(15), color: colors.pink }}
                style={{ marginTop: mvs(10) }}
                onChange={val => {
                  setPayload({
                    ...payload,
                    private: !payload.private,
                  });
                }}
              />

              <View style={{ marginTop: mvs(6) }}>
                <Regular
                  style={{
                    fontSize: mvs(11),
                    color: colors.lightgrey2,
                  }}
                  label="Your Product will not not be featured on our home page"
                />
              </View>
            </View>

            <Buttons.ButtonPrimary
              onClick={async () => {
                try {
                  const response = TAKE_TO_CONSTANT.eShopValidation(payload);
                  if (response.status) {
                    props.navigation.navigate('orderdeliverydetail', {
                      payload: payload,
                      type: 'estore',
                      isLocal : isLocal,
                    });
                  } else {
                    throw new Error(response.message);
                  }
                } catch (error) {
                  alertRef.current.alertWithType(
                    'error',
                    'Error',
                    UI_API._returnError(error),
                  );
                }
              }}
              title="Next"
              style={{ marginTop: mvs(40) }}
            />
          </View>
        </KeyboardAvoidingView>
        <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'} inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
        {searchLoading && (
          <View
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#00000010',
            }}>
            <Chase size={mvs(40)} color={colors.primary} />
          </View>
        )}
      </View>

      <ImagePicker
        visible={openPicker}
        showDelete={false}
        onClose={setOpenPicker}
        onSubmit={onImageModalSelection}
      />
    </View>
  );
};

const mapStateToProps = state => {
  return {
    defaultCountry: state.common.defaultCountry,
    profileData: state.auth.userInfo?.profile || {},
    countriesList: state.common.countriesList,
  };
};
const mapDispatchToProps = dispatch => ({
  // fetchCountriesList: () => dispatch(TAKE_TO_ACTIONS.fetchCountriesList()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrderEStore);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: mvs(22),
  },
  titleAndSearchContainer: {
    //height  : mvs(87),
    width: '100%',
    //borderWidth : 1,
    marginTop : mvs(32),
    paddingBottom: mvs(40),
  },
  searchBar: {
    height: mvs(38),
    width: '100%',
    //borderWidth : 1,
    marginTop: mvs(18),
    borderRadius: mvs(10),
    paddingHorizontal: mvs(10),
    justifyContent: 'center',
    backgroundColor: colors.secondary,
  },
  searchInput: {
    // borderWidth : 1,
    padding: 0,
    fontSize: mvs(15),
    fontFamily: fonts.carosSoftRegular,
    color: colors.primary,
    width: '93%',
  },
  searchIcon: {
    position: 'absolute',
    right: mvs(10),
  },
  imagesContainer: {
    height: '100%',
    width: '100%',
  },
  imageContainer: {
    height: '100%',
    width: mvs(104),
    borderWidth: 0.3,
    borderRadius: 10,
    borderColor: colors.label,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: mvs(10),
  },
  image: {
    height: mvs(98),
    width: mvs(75),
    borderRadius: mvs(10),
  },
  plusButton: {
    position: 'absolute',
    right: mvs(5),
    top: '30%',
  },
  title: {
    fontSize: mvs(12),
    color: colors.headerTitle,
    marginTop: mvs(23),
  },
  value: {
    fontSize: mvs(18),
    color: colors.headerTitle,
    marginTop: mvs(10),
  },
  line: {
    borderBottomWidth: 0.3,
    width: '100%',
    borderColor: colors.horizontalLine,
    marginTop: mvs(13),
  },
  inputBox: {
    backgroundColor: colors.secondary,
    marginTop: mvs(15),
  },
  productPriceContainer: {
    height: mvs(38),
    width: '100%',
    //borderWidth : 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: mvs(20),
  },
  priceInputContainer: {
    height: '100%',
    width: mvs(161),
    borderRadius: mvs(10),
    backgroundColor: colors.secondary,
    paddingHorizontal: mvs(11),
    //justifyContent : 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  priceInput: {
    height: '100%',
    width: '100%',
    padding: 0,
    //borderWidth : 1,
    fontSize: mvs(18),
    fontFamily: fonts.carosSoftRegular,
    color: colors.primary,
    paddingLeft: mvs(5),
  },
  clear: {
    position: 'absolute',
    right: mvs(11),
  },
  quantityContainer: {
    width: '100%',
    borderColor: colors.horizontalLine,
    marginTop: mvs(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityTitle: {
    fontSize: mvs(18),
    color: colors.headerTitle,
  },
  quantityButtonsContainer: {
    height: '100%',
    width: mvs(104),
    //borderWidth : 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityButton: {
    height: mvs(23),
    width: mvs(23),
    borderRadius: mvs(23 / 2),
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonLabel: {
    fontSize: mvs(18),
    color: colors.headerTitle,
  },
  quantity: {
    fontSize: mvs(18),
    color: colors.primary,
  },
  toggleMainContainer: {
    height: mvs(25),
    width: '100%',
    borderWidth: 1,
    marginTop: mvs(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailContainer: {
    width: '100%',
    //borderWidth : 1,
    marginTop: mvs(10),
  },
  detail: {
    fontSize: mvs(12),
    color: colors.lightgrey2,
  },
  privateContainer: {
    height: mvs(83),
    width: '100%',
    //borderWidth  : 1,
    marginTop: mvs(30),
    paddingHorizontal: mvs(10),
    borderRadius: mvs(10),
    backgroundColor: colors.secondary,
  },
  privateTitleContainer: {
    //borderWidth : 1,
    marginTop: mvs(16),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    height: mvs(7),
    width: mvs(7),
    borderRadius: mvs(7 / 2),
    backgroundColor: colors.pink,
    marginLeft: mvs(5),
  },
});
