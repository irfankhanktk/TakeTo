import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  // KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView as KeyboardAvoidingView} from 'react-native-keyboard-aware-scroll-view';
import Geocoder from 'react-native-geocoding';
import {connect} from 'react-redux';
import * as Images from '../../../resource/assets/order-car-icons';
import Buttons from '../../components/atoms/Button';
import ImagePlaceholder from '../../components/atoms/Placeholder';
import CustomSwitch from '../../components/atoms/Switch';
import Header from '../../components/molecules/header/header-1x';
import InputWithTitle from '../../components/molecules/input-with-title';
import PlusButton from '../../components/molecules/order_card/plus-button';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import {mvs} from '../../config/metrices';
import Regular from '../../presentation/typography/regular-text';
import DropdownAlert from 'react-native-dropdownalert';
import {TAKE_TO_INPUT_FIELD} from '../../components/atoms';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from '../../components/molecules/modals/image-picker/image-picker';
import DualText from '../../components/molecules/dual-text/dual-text';
import { placeholder } from 'i18n-js';
const CreateOrderPhysicalStore = props => {
  let isFocus = useIsFocused();
  const {
    selectedShopAddress,
    route,
    fetchShopAddress,
    fetchDeliveryAddress,
    profileData,
  } = props;

  const {re_order_object, isLocal} = route?.params;
  const Search = Images['search'];
  const Location = Images['location_white'];
  const Clear = Images['clear'];
  const Minus = Images['minus'];
  const Plus = Images['plus'];
  const scrollRef = React.useRef(null);
  const alertRef = React.useRef(null);
  const [openPicker, setOpenPicker] = React.useState(false);

  const [detailsConter, setDetailsCounter] = useState(0);

  const [payload, setPayload] = React.useState({
    images: [{uri: ''}],
    productName: '',
    productPrice: '',
    productDetails: '',
    shopName: '',
    shopAddress: '',
    instractions: '',
    quantity: 1,
    withBox: false,
    private: false,
    isPhysical: true,
  });

  React.useEffect(() => {
    if (re_order_object) {
      Geocoder.from(
        re_order_object?.shop_latitude,
        re_order_object?.shop_longitude,
      )
        .then(json => {
          const formattedAddress = UI_API._returnAddress(json);
          // console.log('formattedAddress :: ', formattedAddress);
          setPayload({
            ...payload,
            images: [...re_order_object?.order_gallery, ...payload?.images],
            productName: re_order_object?.name,
            productPrice: re_order_object?.price,
            productDetails: re_order_object?.detail?.slice(0, 299),
            shopName: re_order_object?.shop_name,
            isReOrder: re_order_object?.isReOrder,
            // shopAddress: formattedAddress?.fulladdress,
            instractions: re_order_object?.instructions,
            //quantity: re_order_object?.quantity,
            //withBox: re_order_object?.with_box,
            //private: re_order_object?.is_private,
            shopAddress: {
              street: re_order_object?.shop_block,
              block: re_order_object?.shop_street,
              city: formattedAddress?.city, //
              country: formattedAddress?.country, //
              latitude: re_order_object?.shop_latitude, //
              longitude: re_order_object?.shop_longitude, //
              fulladdress: formattedAddress?.fulladdress, //
              country_short_name: formattedAddress?.country_short_name, //
            },
          });
        })
        .catch(error => {
          // scrollRef.current.scrollTo({x: 0, y: 0, animated: true});
          alertRef.current.alertWithType(
            'error',
            'Error',
            UI_API._returnError(error),
          );
        });
    }
  }, [route?.params]);

  // console.log(payload)

  useEffect(() => {
    //console.log('address:', selectedShopAddress);
    // if (re_order_object) {
    //   fetchShopAddress('');
    //   fetchDeliveryAddress('');
    // } else {
    setPayload({
      ...payload,
      shopAddress: selectedShopAddress,
    });
    // }
  }, [selectedShopAddress]);

  console.log('CREATE POST :: ', selectedShopAddress);
  console.log('CREATE POST PAYLOAD :: ', payload);
  console.log('re_order_object :: ', re_order_object);

  const renderImages = ({item, index}) => {
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
  console.log('reorder:',re_order_object);
console.log('selectedShopAddress:::',selectedShopAddress);
  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <View style={styles.mainContainer}>
        <Header {...props} title="create order" allowBackBtn bellIcon />
        {/* <ScrollView nestedScrollEnabled style={styles.container} ref={scrollRef}> */}
        <KeyboardAvoidingView
          showsVerticalScrollIndicator={false}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          contentContainerStyle={{flexGrow: 1, paddingHorizontal: mvs(22)}}
          ref={scrollRef}>
          {/* <View style = {styles.titleAndSearchContainer}> */}
          <View style={{height: mvs(125), marginTop: mvs(32)}}>
            <FlatList
              nestedScrollEnabled
              data={payload.images.slice(0, 5)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{height: '100%', paddingVertical: mvs(1)}}
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
            title="Product Name"
            isRequired
            placeholder={'Name'}
            style={{marginTop: mvs(22)}}
            placeholderTextColor={colors.input_placehoder}
            textStyle={{color: colors.primary}}
            value={payload.productName}
            onChangeText={txt => {
              setPayload({
                ...payload,
                productName: txt,
              });
            }}
          />

          <View style={styles.productPriceContainer}>
            <Regular
              label="Product Price"
              style={{...styles.title, marginTop: 0}}>
              <Regular label={'*'} style={{color: colors.mendatory}} />
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
              style={{color: colors.primary}}
              value={payload.productPrice}
              placeholderTextColor={colors.input_placehoder}
              label="Product Price"
              priceUnit={isLocal? `${profileData?.currency?.currency_code}` : 'USD'}
              placeholder="Price"
            />
            {/* <View style={styles.priceInputContainer}>
            <Regular
              label="US$"
              style={{
                fontSize: mvs(18),
                color: colors.primary,
              }}
            />
            <TextInput
              style={styles.priceInput}
              keyboardType="number-pad"
              value={payload.productPrice}
              placeholder="Price"
              onChangeText={txt => {
                setPayload({
                  ...payload,
                  productPrice: txt,
                });
              }}
            />
          </View> */}
          </View>

          <InputWithTitle
            isRequired
            maxLength={300}
            title={`Product Details (${payload?.productDetails?.length}/300)`}
            style={{marginTop: mvs(22)}}
            textStyle={{
              minHeight: mvs(71),
              textAlignVertical: 'top',
              color: colors.primary,
            }}
            placeholder="Enter details"
            placeholderTextColor={colors.input_placehoder}
            value={payload.productDetails}
            multiline
            // onChange={() => }
            onChangeText={txt => {
              setPayload({
                ...payload,
                productDetails: txt,
              });
            }}
          />

          <InputWithTitle
            editable={re_order_object === null}
            title="Shop Name"
            isRequired
            placeholder="Shop name*"
            style={{marginTop: mvs(25)}}
            textStyle={{color: colors.primary}}
            placeholderTextColor={colors.input_placehoder}
            value={payload.shopName}
            onChangeText={txt => {
              setPayload({
                ...payload,
                shopName: txt,
              });
            }}
          />

          <Regular
            label="Select store address"
            style={{
              fontSize: mvs(13),
              color: colors.headerTitle,
              marginTop: mvs(22),
            }}>
            {' '}
            <Regular label={'*'} style={{color: colors.mendatory}} />
          </Regular>

          <TouchableOpacity
            disabled={re_order_object !== null}
            onPress={
              () =>
                props.navigation.navigate('deliverylocation', {
                  type: 'pstore',
                  heading: 'Search shop address',
                  isLocal:isLocal
                }) //locationObj:payload?.shopAddress
            }
            style={{
              //height : mvs(48),
              paddingVertical: mvs(10),
              width: '100%',
              borderRadius: mvs(8),
              backgroundColor: colors.secondary,
              marginTop: mvs(10),
              justifyContent: 'center',
              paddingHorizontal: mvs(10),
            }}>
            <Regular
              label={
                !payload?.shopAddress
                  ? 'Select Address'
                  : payload?.shopAddress?.fulladdress
                //`${selectedShopAddress?.street_address}, ${selectedShopAddress?.street}, ${selectedShopAddress?.block}, ${selectedShopAddress?.city}, ${selectedShopAddress?.country}`
              }
              style={{color: colors.primary}}
            />
          </TouchableOpacity>

          <InputWithTitle
            // isRequired
            //title={`Buying Instructions (${payload?.instractions?.length}/300)`}
            maxLength={300}
            title={`Buying Instructions (${payload?.instractions?.length}/300)`}
            titleStyle={{fontSize: mvs(14)}}
            style={{marginTop: mvs(22)}}
            textStyle={{
              minHeight: mvs(71),
              textAlignVertical: 'top',
              color: colors.primary,
            }}
            placeholderTextColor={colors.input_placehoder}
            placeholder="Enter your note here"
            multiline
            value={payload.instractions}
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
                  if (payload.quantity < 100) {
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

          <CustomSwitch
            //size = "medium"
            value={payload.withBox}
            label="With Box"
            textStyle={{fontSize: mvs(15)}}
            style={{}}
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
              //size = "medium"
              value={payload.private}
              label="PRIVATE LISTING"
              textStyle={{fontSize: mvs(15), color: colors.pink}}
              style={{marginTop: mvs(10)}}
              onChange={val => {
                setPayload({
                  ...payload,
                  private: !payload.private,
                });
              }}
            />

            <View style={{marginTop: mvs(6)}}>
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
              console.log(selectedShopAddress?.country);
              try {
                const response =
                  TAKE_TO_CONSTANT.physicalShopValidation(payload);
                if (response.status) {
                 

                  if (isLocal) {

                    if (selectedShopAddress?.country === profileData?.country?.name ||re_order_object) {
                        props.navigation.navigate('orderdeliverydetail', {
                        payload: {...payload, country : selectedShopAddress?.country || payload?.shopAddress?.country},
                        type: 'pstore',
                        isLocal: isLocal,
                      });
                    } 
                    else {
                      alertRef.current.alertWithType(
                        'error',
                        'Error',
                        'Oops! It seems you forgot to select within the same country delivery location',
                      );
                    }
                  } else {
                    props.navigation.navigate('orderdeliverydetail', {
                      payload: {...payload, country : selectedShopAddress?.country || payload?.shopAddress?.country},
                      type: 'pstore',
                      isLocal: isLocal,
                    });
                  }
                } else {
                  throw new Error(response.message);
                }
              } catch (error) {
                // scrollRef.current.scrollTo({x: 0, y: 0, animated: true});
                alertRef.current.alertWithType(
                  'error',
                  'Error',
                  UI_API._returnError(error),
                );
              }
            }}
            title="Next"
            style={{marginVertical: mvs(40)}}
          />
          {/* </View> */}
        </KeyboardAvoidingView>
        <DropdownAlert zIndex={5} 
          elevation={15}
          translucent
          activeStatusBarStyle={'light-content'}
          inactiveStatusBarBackgroundColor={colors.primary}
          ref={alertRef}
        />
        <ImagePicker
          visible={openPicker}
          showDelete={false}
          onClose={setOpenPicker}
          onSubmit={onImageModalSelection}
        />
      </View>
    </View>
  );
};

// export default CreateOrderPhysicalStore

const mapStateToProps = state => {
  return {
    selectedShopAddress: state.common.selectedShopAddress,
    profileData: state.auth.userInfo?.profile || {},
  };
};
const mapDispatchToProps = dispatch => ({
  fetchShopAddress: data => dispatch(TAKE_TO_ACTIONS.fetchShopAddress(data)),
  fetchDeliveryAddress: data =>
    dispatch(TAKE_TO_ACTIONS.fetchDeliveryAddress(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateOrderPhysicalStore);

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
    marginTop: mvs(32),
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
    fontFamily: fonts.carosSoftLight,
    color: colors.headerTitle,
  },
  searchIcon: {
    position: 'absolute',
    right: mvs(10),
  },
  imagesContainer: {
    height: '100%',
    width: '100%',
    //borderWidth : 1,
    //marginTop : mvs(30),
    //justifyContent : 'center'
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
    top: '35%',
  },
  title: {
    fontSize: mvs(13),
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
    //borderWidth :1
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
  shopNameContainer: {
    width: '100%',
    //borderWidth : 1,
    marginTop: mvs(18),
    flexDirection: 'row',
  },
  locationButton: {
    marginTop: mvs(15),
    //borderWidth : 1,
    height: mvs(38),
    alignItems: 'center',
  },
  button: {
    height: '100%',
    paddingHorizontal: mvs(30),
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: mvs(10),
    backgroundColor: colors.primary,
  },
  buttonTitle: {
    fontSize: mvs(12),
    color: colors.white,
    marginLeft: mvs(24),
  },
});
