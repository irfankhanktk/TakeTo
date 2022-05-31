import UI_API from '@khan_ahmad786/common/store/services';
import React from 'react';
import { View, Text } from 'react-native';
import Geocoder from 'react-native-geocoding';
import ReactNativeModal from 'react-native-modal';
import colors from '../../../../config/colors';
import { mvs } from '../../../../config/metrices';
import GoogleSearchBar from '../../google-search-bar';
const SearchLocationModal = ({ visible, setVisible, setLocation, country_short_name }) => {


    const selectAddressHandler = (data, details = null) => {
        console.log('data::', data);

        Geocoder.from(details?.geometry?.location?.lat, details?.geometry?.location?.lng)
            .then(json => {
                var addressComponent = UI_API._returnAddress(json);
                setLocation(addressComponent);
                setVisible(false);
            }).catch(error => {
                alert(UI_API._returnError(error))
            })
    }
    return (
        <ReactNativeModal
            onBackdropPress={() => setVisible(false)}
            isVisible={visible}
            onBackButtonPress={() => setVisible(false)}
        >
            <View style={{ minHeight: mvs(370) }}>
                {/* <View style={styles.barContainer}> */}
                <GoogleSearchBar
                    textInputContainer={{ paddingRight: 0 }}
                    countrySlug={(country_short_name !== undefined && country_short_name) ? country_short_name?.toLowerCase() : null}
                    cross
                    containerStyle={{ marginTop: mvs(30), }}
                    inputStyle={{ backgroundColor: colors.secondary, paddingLeft: mvs(10), color : colors.typeHeader }}
                    leftArrow={false}
                    placeholder="Enter an address"
                    style={{ backgroundColor: colors.white, paddingHorizontal: mvs(10) }}
                    onClick={() => { }}
                    onPress={selectAddressHandler}
                //   setRegion({
                //     latitude: details?.geometry?.location?.lat,
                //     latitudeDelta: 0.015,
                //     longitude: details?.geometry?.location?.lng,
                //     longitudeDelta: 0.0121,
                //   });
                //   ref?.current?.animateToRegion(
                //     {
                //       latitude: details?.geometry?.location?.lat,
                //       latitudeDelta: 0.015,
                //       longitude: details?.geometry?.location?.lng,
                //       longitudeDelta: 0.0121,
                //     },
                //     1000,
                //   );

                />
            </View>
        </ReactNativeModal>
    );
};
export default SearchLocationModal;