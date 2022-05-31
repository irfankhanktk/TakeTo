import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import { useIsFocused } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Geocoder from 'react-native-geocoding';
import MapView from 'react-native-maps';
import { connect } from 'react-redux';
import * as SVGS from '../../../resource/assets/order-car-icons/index';
import Images from '../../../resource/assets/rtl-button-icons';
import Buttons from '../../components/atoms/Button';
import Header from '../../components/molecules/header/header-1x';
import colors from '../../config/colors';
import { mvs } from '../../config/metrices';
import Regular from '../../presentation/typography/regular-text';

Geocoder.init('AIzaSyCHIlIvmsXf-sllfpXK0Q-1dV7uzgyFvfw');

const DeliverTo = props => {
  let isFocus = useIsFocused();
  const { addressesList, route, selectedDeliveryAddress, fetchDeliveryAddress } =
    props;
  const Location = SVGS['location'];
  const LocationActive = SVGS['location_active'];

  const [region, setRegion] = useState({
    latitude: 37.78825,
    latitudeDelta: 0.015,
    longitude: -122.4324,
    longitudeDelta: 0.0121,
  });
  const [saved, setSaved] = useState(false);
  const [address, setAddress] = useState('home');

  const [selectedAddress, setSelectedAddress] = React.useState('');

  const [addressList, setAddressList] = React.useState(
    addressesList.length > 0
      ? addressesList?.map(ele => ({ ...ele, isSelected: false }))
      : [],
  );

  const confirmAddressHandler = () => {
    const selectAddressId = addressList?.find(ele => ele?.isSelected);
    alert(selectAddressId?.id);
  };

  const getCurrentLocation = async () => {
    try {
      const location = await UI_API._get_current_location();
      if (location) {
        setRegion(location);
      }
    } catch (error) {
      alert(UI_API._returnError(error));
    }
  };

  React.useEffect(() => {
    getCurrentLocation();
    console.log(selectedDeliveryAddress);
  }, []);

  React.useEffect(() => {
    setSaved(false);
    setAddressList(
      addressesList.length > 0
        ? addressesList?.map(ele => ({ ...ele, isSelected: false }))
        : [],
    );
    setSelectedAddress(selectedDeliveryAddress);
  }, [isFocus]);

  const onConfirm = () => {
    fetchDeliveryAddress(selectedAddress);
   // console.log(selectedAddress);
    props.navigation.pop();
  };

  // React.useEffect(() => {
  //   // alert('sdsd')
  //   setRegion(selectedDeliveryAddress?.region)
  // }, [selectedDeliveryAddress])

  console.log("selectedDeliveryAddress :: ", region)

  return (
    <View style={styles.mainContainer}>
      <Header {...props} title="Deliver to" allowBackBtn bellIcon />
      <View
        //contentContainerStyle = {{marginBottom : mvs(20)}}
        style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            setAddressList(
              addressesList.length > 0
                ? addressesList?.map(ele => ({ ...ele, isSelected: false }))
                : [],
            );
            props.navigation.navigate('deliverylocation', { type: 'deliveryto' });
          }}
          style={styles.pinOnMap}>
          <Location height={mvs(24.4)} width={mvs(20)} />
          <Regular
            label="Pin on map"
            style={{ marginLeft: mvs(10), color: colors.typeHeader }}
          />
        </TouchableOpacity>

        <View
          style={{
            borderWidth: selectedDeliveryAddress == '' ? mvs(0) : mvs(0.5),
            borderColor: colors.doted,
            borderRadius: mvs(10),
            overflow: 'hidden',
            marginTop: mvs(10),
          }}>
          <TouchableOpacity onPress={() => {
            setAddressList(
              addressesList.length > 0
                ? addressesList?.map(ele => ({ ...ele, isSelected: false }))
                : [],
            );
            props.navigation.navigate('deliverylocation', { type: 'deliveryto' });
          }} style={styles.mapContainer}>
            {Object?.keys(region).length > 0 && (
              <MapView
                region={Object.keys(selectedDeliveryAddress).length > 0 ? selectedDeliveryAddress?.region : region}
                scrollEnabled={false}
                style={{ flex: 1 }}
                zoomEnabled={false}
                showsMyLocationButton={false}
              />
            )}

            <View style={styles.pointer} />
          </TouchableOpacity>

          {selectedDeliveryAddress !== '' && (
            <View
              style={{
                paddingHorizontal: mvs(10),
                paddingBottom: mvs(20),
                borderRadius: mvs(10),
              }}>
              <TouchableOpacity
                onPress={() => {
                  setSaved(false);
                  setAddressList(
                    addressesList.length > 0
                      ? addressesList?.map(ele => ({ ...ele, isSelected: false }))
                      : [],
                  );
                  setSelectedAddress(selectedDeliveryAddress);
                }}
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  marginTop: mvs(20),
                  alignItems: 'center',
                }}>
                {!saved ? (
                  <LocationActive height={mvs(24.5)} width={mvs(20)} />
                ) : (
                  <Location height={mvs(24.5)} width={mvs(20)} />
                )}
                <View style={{ marginLeft: mvs(10), paddingRight: mvs(40) }}>
                  <Regular
                    label={selectedDeliveryAddress?.fulladdress}
                    style={{
                      fontSize: mvs(15),
                      color: colors.lightgrey2,
                      marginTop: mvs(6),
                    }}
                  />
                </View>
                {!saved && (
                  <Images.tickBlue style={{ position: 'absolute', right: 0 }} />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Regular
          label="Or use your Saved Addresses"
          style={{ color: colors.typeHeader, marginTop: mvs(32) }}
        />
        {addressesList?.length < 1 && <Regular
          label={`You don't have any saved address.`}
          style={{ marginTop: mvs(30) }}
        />}
        {/* {alert(addressesList.length)} */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: mvs(120) }}
          style={{}}>
          {addressList?.map((ele, index) => (
            <TouchableOpacity
              onPress={() => {
                setSaved(true);
                const copyAddressList = addressList?.map(ele => ({
                  ...ele,
                  isSelected: false,
                }));

                copyAddressList[index].isSelected = true;
                setAddressList(copyAddressList);
                console.log(ele);
                setSelectedAddress(ele);
              }}
              style={styles.addressContainer}>
              {ele?.isSelected ? (
                <LocationActive height={mvs(24.5)} width={mvs(20)} />
              ) : (
                <Location height={mvs(24.5)} width={mvs(20)} />
              )}
              <View style={{ marginLeft: mvs(10), marginRight: mvs(40) }}>
                <Regular
                  label={`${ele?.name} (${ele.type})`}
                  style={{
                    color: ele?.isSelected ? colors.primary : colors.typeHeader,
                  }}
                />
                <Regular
                  label={ele?.address}
                  style={{
                    fontSize: mvs(10),
                    color: colors.lightgrey2,
                    marginTop: mvs(6),
                  }}
                />
              </View>
              {ele?.isSelected && (
                <Images.tickBlue style={{ position: 'absolute', right: 0 }} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Buttons.ButtonPrimary
          onClick={onConfirm}
          style={{ position: 'absolute', bottom: mvs(40), alignSelf: 'center' }}
          title={'Confirm'}
        />
      </View>
    </View>
  );
};
const mapStateToProps = state => {
  return {
    addressesList: state.auth.userInfo?.addresses || [],
    selectedDeliveryAddress: state.common.selectedDeliveryAddress,
  };
};

const mapDispatchToProps = dispatch => ({
  fetchDeliveryAddress: data =>
    dispatch(TAKE_TO_ACTIONS.fetchDeliveryAddress(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeliverTo);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: mvs(22),
    paddingTop:mvs(27)
    // borderWidth:1,
    // backgroundColor : 'red'
  },
  pinOnMap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapContainer: {
    height: mvs(145),
    width: '100%',
    //borderWidth : 0.2,
    //marginTop: mvs(20),
    justifyContent: 'center',
  },
  currentAddressContainer: {
    //height : mvs(137),
    width: '100%',
    borderRadius: mvs(10),
    borderWidth: mvs(0.5),
    borderColor: colors.doted,
    marginTop: mvs(10),
    padding: mvs(10),
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
  addressContainer: {
    marginTop: mvs(21),
    flexDirection: 'row',
  },
});
