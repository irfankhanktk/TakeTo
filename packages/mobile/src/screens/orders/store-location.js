import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import GetLocation from 'react-native-get-location';
import MapView, {
  Callout,
  Circle,
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import GoogleSearchBar from '../../components/molecules/google-search-bar';
import header1x from '../../components/molecules/header/header-1x';
import PinStoreLocationModal from '../../components/molecules/modals/pin-store-location';
import colors from '../../config/colors';
import * as SVGS from '../../../resource/assets/social-icons/index';
import {mvs} from '../../config/metrices';
import Header from '../../components/molecules/header/header-1x';
import { TAKE_TO_IMAGES } from '../../../resource/assets/image_resouce';
import Medium from '../../presentation/typography/medium-text';
import { showLocation } from 'react-native-map-link'

const StoreLocation = props => {
  let ref = useRef();
  const { shopRegion , order_data} = props.route.params
  const Maps = SVGS['google_maps']
  const [region, setRegion] = useState(shopRegion||{
    latitude: 37.78825,
    latitudeDelta: 0.015,
    longitude: -122.4324,
    longitudeDelta: 0.0121,
  });


  console.log('shopRegion',shopRegion)

  // useEffect(() => {
  //   GetLocation.getCurrentPosition({
  //     enableHighAccuracy: true,
  //     timeout: 15000,
  //   })
  //     .then(location => {
  //       setRegion({
  //         latitude: location?.latitude,
  //         latitudeDelta: 0.015,
  //         longitude: location?.longitude,
  //         longitudeDelta: 0.0121,
  //       });
  //     })
  //     .catch(error => {
  //       const {code, message} = error;
  //       console.warn(code, message);
  //     });
  // }, []);

  return (
    <View style={styles.mainContainer}>
      <Header 
      {...props} 
      title="Store location"
      allowBackBtn 
      userIcon = {false}
      />
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={{flex: 1,marginTop:mvs(-10)}}
        ref={ref}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
      <Marker coordinate={shopRegion}>
            <Callout tooltip={true}>
              <View style={styles.callout}>
                
                <View style={styles.calloutInner}>
                <Medium
                label = {order_data?.order_shop_name}
                style = {{color : colors.primary}}
                />
                  {/* <Text style={{height: mvs(48)}}>
                    <Image
                      source={TAKE_TO_IMAGES.chat_dp}
                      style={styles.image}
                    />
                  </Text> */}
                  {/* <View style={styles.calloutMiddleContainer}>
                    <View style={{flexDirection: 'row'}}>
                      <Medium label="REWARD" style={styles.label} />
                      <Medium label="US$ 25" style={styles.value} />
                    </View>
                    <Medium label="URGENT" style={{...styles.status}} />
                  </View> */}
                </View>
                {/* <View style={{alignSelf: 'center', marginTop: -mvs(3)}}>
                  <Bottom />
                </View> */}
              </View>
            </Callout>
          </Marker>
      </MapView>

      {/* <View style={styles.barContainer}>
        <GoogleSearchBar
          style={{backgroundColor: colors.white}}
          onPress={(data, details = null) => {
            setRegion({
              latitude: details?.geometry?.location?.lat,
              latitudeDelta: 0.015,
              longitude: details?.geometry?.location?.lng,
              longitudeDelta: 0.0121,
            });
            ref?.current?.animateToRegion(
              {
                latitude: details?.geometry?.location?.lat,
                latitudeDelta: 0.015,
                longitude: details?.geometry?.location?.lng,
                longitudeDelta: 0.0121,
              },
              1000,
            );
          }}
        />
      </View> */}

      <PinStoreLocationModal
        visible={true}
        title = {order_data?.order_shop_name}
        address = {
          `${ `${order_data?.shop_street?order_data?.shop_street+',':''}`}${order_data?.shop_block?order_data?.shop_block+',':''}${order_data?.shop_city}, ${order_data?.shop_country}`
        }
        onClose={() => props.navigation.pop()}
        onPress={() => {
          showLocation({
            latitude : order_data?.shop_location?.latitude,
            longitude : order_data?.shop_location?.longitude
          })
        }}
      />
    </View>
  );
};

export default StoreLocation;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  barContainer: {
    width: '100%',
    paddingHorizontal: mvs(22),
    position: 'absolute',
    //top: mvs(45),
  },
  image: {
    height: mvs(28),
    width: mvs(28),
    borderRadius: mvs(8),
    overflow: 'hidden',
  },
  callout: {
    height: mvs(49.39),
    alignSelf: 'center',
    //backgroundColor : colors.white
  },
  calloutInner: {
    height: mvs(44.26),
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: mvs(8),
    flexDirection: 'row',
    paddingHorizontal: mvs(5),
    alignItems: 'center',
    paddingHorizontal : mvs(20)
  },
  calloutMiddleContainer: {
    marginLeft: mvs(5),
  },
  label: {
    fontSize: mvs(9),
    color: colors.title,
  },
  status: {
    fontSize: mvs(9),
    color: colors.pink,
    marginTop: mvs(8),
  },
  calloutEndContainer: {
    marginLeft: mvs(14),
    borderWidth: 1,
  },
  value: {
    fontSize: mvs(9),
    color: colors.green,
    marginLeft: mvs(14),
  },
  marker: {
    height: mvs(28),
    width: mvs(22),
  },
});
