import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import React, {useEffect} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import Geocoder from 'react-native-geocoding';
import MapView from 'react-native-maps';
import {connect} from 'react-redux';
import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import * as Icons from '../../../resource/assets/new-address-icons';
import {TAKE_TO_INPUT_FIELD} from '../../components/atoms';
import Buttons from '../../components/atoms/Button';
import CustomRadio from '../../components/atoms/RadioButton';
import Header from '../../components/molecules/header/header-1x';
import AddressTypeModal from '../../components/molecules/modals/address-type-modal';
import colors from '../../config/colors';
import DropdownAlert from 'react-native-dropdownalert';
import {mvs} from '../../config/metrices';
import * as SVGS from '../../../resource/assets/order-car-icons';

Geocoder.init('AIzaSyCHIlIvmsXf-sllfpXK0Q-1dV7uzgyFvfw');

const DeliveryAddress = props => {
  const alertRef = React.useRef(null);
  const {route, navigation,onSaveDeliveryAddressToRedux,toggleDeliveryAddressModal} = props;
  const Pointer = SVGS['pointer'];
  const [loading, setLoading] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const phoneInput = React.useRef(null);
  const [payload, setPayload] = React.useState({
    addressNickName: '',
    area: '',
    block: '',
    street: '',
    building: '',
    floor: '',
    otpCode: '',
    addressType: 'House',
    houseNumber: '',
    officeNumber: '',
    appartmentNumber: '',
    verifiedPhone: '',
    city: '',
    country: '',
    fulladdress: '',
    place_id: '',
    region: {
      latitude: 37.78825,
      latitudeDelta: 0.015,
      longitude: -122.4324,
      longitudeDelta: 0.0121,
    },
  });
  const getCurrentLocation = async () => {
    try {
      let location = route?.params?.region
        ? {}
        : await UI_API._get_current_location();
      location =
        Object?.keys(location).length > 0
          ? location
          : {...route?.params?.region};
      Geocoder.from(location.latitude, location.longitude)
        .then(json => {
          var addressComponent = UI_API._returnAddress(json);
          setPayload({
            ...payload,
            country: addressComponent?.country,
            city: addressComponent?.city,
            region: location,
            area: addressComponent?.area || '',
            block: '',
            street: addressComponent?.street_number || '',
            building: '',
            floor: '',
            otpCode: '',
            addressType: 'House',
            houseNumber: addressComponent?.street_address || '',
            officeNumber: '',
            appartmentNumber: '',
            verifiedPhone: '',
            fulladdress: addressComponent?.fulladdress,
            place_id: addressComponent?.place_id,
          });
        })
        .catch(error => console.warn(error));
    } catch (error) {
      //alert(UI_API._returnError(error));
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, [route]);

  // console.log('payload in deilvery address:::',payload);

  const onSaveAddressToRedux = async () => {
    try {
      // setLoading(true);
      try {
        onSaveDeliveryAddressToRedux(payload);
        props.navigation.goBack();
        toggleDeliveryAddressModal(true);
      } catch (error) {
        //alert(UI_API._returnError(error));
        alertRef.current.alertWithType(
          'error',
          'Error',
          UI_API._returnError(error),
        );
      }
    } catch (error) {
      setLoading(false);
      //alert(UI_API._returnError(error));
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };

  const onContinue = async () => {
    // fetchDeliveryAddress({
    //   ...payload,
    //   latitude: payload?.region?.latitude,
    //   longitude: payload?.region?.longitude,
    // });
    // props.navigation.pop(2);
  };

  const AddressType = ({item, index, iconName = 'Home'}) => {
    const Icon =
      Icons[item == payload.addressType ? `${item}active` : item] ||
      Icons['Home'];
    const style =
      item == payload.addressType
        ? {
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }
        : {borderWidth: StyleSheet.hairlineWidth, borderColor: colors.doted};

    return (
      <TouchableOpacity
        onPress={() =>
          setPayload({...payload, addressType: item, addressNickName: item})
        }
        style={{}}>
        <CustomRadio
          status={item == payload.addressType}
          onChange={v =>
            setPayload({
              ...payload,
              addressType: item,
              addressType: item,
              addressNickName: item,
            })
          }
          labelStyle={{
            marginLeft: 0,
            fontSize: mvs(14),
            color:
              item == payload.addressType ? colors.primary : colors.typeHeader,
          }}
          label={item}
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: colors.white,
            width: mvs(106),
            height: mvs(97),
            alignItems: 'center',
            borderRadius: mvs(10),
            padding: mvs(8),
            zIndex: 1001,
            ...style,
          }}>
          <Icon />
        </CustomRadio>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.CONTAINER}>
      <Header {...props} title="Delivery Address" allowBackBtn userIcon={false} />
      <View style={styles.BODY}>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.SCROLL}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() =>
              props.navigation.navigate('deliverylocation', {
                type: 'deliveryaddress',
              })
            }
            style={{
              backgroundColor: colors.secondary,
              height: mvs(95),
              borderRadius: mvs(20),
              marginBottom: mvs(20),
              overflow: 'hidden',
              justifyContent: 'center',
            }}>
            {payload?.region && (
              <MapView
                initialRegion={payload.region}
                //provider='google'
                region={payload?.region}
                scrollEnabled={false}
                style={{flex: 1}}
                zoomEnabled={false}
                showsMyLocationButton={false}
              />
            )}

            <View style={styles.pointer} />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
              paddingHorizontal: mvs(1),
              marginBottom: mvs(18),
            }}>
            {['House', 'Appartment', 'Office'].map((ele, index) => (
              <AddressType item={ele} key={index} index={index} />
            ))}
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TAKE_TO_INPUT_FIELD.InputSecondary
              placeholderColor={colors.doted}
              containerStyle={{marginBottom: mvs(13), width: '49%'}}
              style={{width: '100%'}}
              value={payload.addressNickName}
              onChangeText={text =>
                setPayload({...payload, addressNickName: text})
              }
              label={'Address Nickname'}
              placeholder={'Address title'}
              value={payload.addressNickName}
            />
            <TAKE_TO_INPUT_FIELD.InputSecondary
              placeholderColor={colors.doted}
              containerStyle={{marginBottom: mvs(13), width: '49%'}}
              style={{width: '100%'}}
              value={payload.area}
              onChangeText={text => setPayload({...payload, area: text})}
              label={'Area'}
              placeholder={'Area'}
              value={payload.area}
            />
          </View>
          <TAKE_TO_INPUT_FIELD.InputSecondary
            placeholderColor={colors.doted}
            containerStyle={{marginBottom: mvs(13)}}
            style={{width: '100%'}}
            value={payload.street}
            onChangeText={text => setPayload({...payload, street: text})}
            label={'Street'}
            placeholder={'Street'}
            value={payload.street}
          />
          {payload.addressType !== 'House' ? (
            <>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TAKE_TO_INPUT_FIELD.InputSecondary
                  containerStyle={{marginBottom: mvs(13), width: '49%'}}
                  style={{width: '100%'}}
                  value={payload.building}
                  onChangeText={text =>
                    setPayload({...payload, building: text})
                  }
                  label={'Building'}
                  placeholder={'Building name'}
                  value={payload.building}
                />
                {payload.addressType === 'Appartment' ? (
                  <TAKE_TO_INPUT_FIELD.InputSecondary
                    containerStyle={{marginBottom: mvs(13), width: '49%'}}
                    style={{width: '100%'}}
                    value={payload.floor}
                    onChangeText={text => setPayload({...payload, floor: text})}
                    label={'Floor'}
                    placeholder={'Floor number'}
                    value={payload.floor}
                  />
                ) : (
                  <TAKE_TO_INPUT_FIELD.InputSecondary
                    containerStyle={{marginBottom: mvs(0), width: '49%'}}
                    style={{width: '100%'}}
                    value={payload.officeNumber}
                    onChangeText={text =>
                      setPayload({...payload, officeNumber: text})
                    }
                    label={'Office number'}
                    placeholder={'Office number'}
                    value={payload.officeNumber}
                  />
                )}
              </View>
              {payload.addressType === 'Appartment' && (
                <TAKE_TO_INPUT_FIELD.InputSecondary
                  containerStyle={{marginBottom: mvs(0)}}
                  style={{width: mvs(161)}}
                  value={payload.appartmentNumber}
                  onChangeText={text =>
                    setPayload({...payload, appartmentNumber: text})
                  }
                  label={'Apartment number'}
                  placeholder={'Apartment number'}
                  value={payload.appartmentNumber}
                />
              )}
            </>
          ) : (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TAKE_TO_INPUT_FIELD.InputSecondary
                containerStyle={{marginBottom: mvs(13), width: '49%'}}
                style={{width: '100%'}}
                value={payload.houseNumber}
                onChangeText={text =>
                  setPayload({...payload, houseNumber: text})
                }
                label={'House'}
                placeholder={'House Number'}
                value={payload.houseNumber}
              />
            </View>
          )}
          <View style={{marginTop: mvs(13)}}>
          </View>
          {
            <Buttons.ButtonPrimary
              onClick={onSaveAddressToRedux}
              title={'Mark as Delivered'}
              style={{
                marginTop: mvs(85),
                marginBottom: mvs(40),
                backgroundColor: colors.primary,
              }}
            />
          }

          {/* {route.params.type == 'deliveryto' && (
            <Buttons.ButtonPrimary
              onClick={onContinue}
              title={'Continue without save'}
              style={{marginTop: mvs(10), marginBottom: mvs(40)}}
            />
          )} */}
        </ScrollView>
      </View>
      {visible && (
        <AddressTypeModal
          visible={visible}
          onClose={setVisible}
          onChangeValue={type => setPayload({...payload, addressType: type})}
        />
      )}

      <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'}  inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
    </View>
  );
};

const mapDispatchToProps = dispatch => ({
  onSaveDeliveryAddressToRedux: payload =>
    dispatch(TAKE_TO_ACTIONS.onSaveDeliveryAddressToRedux(payload)),

    toggleDeliveryAddressModal: bool =>
    dispatch(TAKE_TO_ACTIONS.toggleDeliveryAddressModal(bool)),
});
export default connect(null, mapDispatchToProps)(DeliveryAddress);

const styles = StyleSheet.create({
  CONTAINER: {
    flex: 1,
    backgroundColor: colors.white,
  },
  BODY: {
    flex: 1,
  },
  SCROLL: {
    paddingHorizontal: mvs(22),
    paddingBottom: mvs(60),
  },
  LABEL: {},
  LIST_CONTAINER: {
    paddingBottom: mvs(9),
    marginBottom: mvs(15),
    borderColor: colors.price_border,
  },
  pointer: {
    height: mvs(21),
    width: mvs(21),
    backgroundColor: colors.primary,
    borderRadius: mvs(21 / 2),
    position: 'absolute',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
});
