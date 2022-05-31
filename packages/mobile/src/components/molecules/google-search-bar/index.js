import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import * as SVGS from './../../../../resource/assets/order-car-icons';

const GoogleSearchBar = ({clear=false ,textInputContainer,placeholderStyle, containerStyle, cross = false, inputStyle, leftArrow = true, style, onPress, onClick, placeholder = 'Enter an address', back, filter = false, countrySlug = null, ...props }) => {

    const Left = SVGS['left']
    const Search = SVGS['search']
    const Filter = SVGS['filter']
    const autoCompleteRef=React.useRef();
    React.useEffect(()=>{
        if(!clear) return;
         autoCompleteRef?.current?.setAddressText("");
    },[clear]);
    return (
        <View style={{ ...styles.mainContainer, ...style, }}>
            {back && <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 50, right: 50 }} onPress={() => props?.navigation?.goBack()} style={styles.left}>
                <Left />
            </TouchableOpacity>}
           
            <GooglePlacesAutocomplete
                ref={autoCompleteRef}
                placeholder={placeholder}
                fetchDetails={true}
                onPress={onPress}
                keyboardShouldPersistTaps='always'
                query={countrySlug ? {
                    key: 'AIzaSyCHIlIvmsXf-sllfpXK0Q-1dV7uzgyFvfw',
                    language: 'en',
                    components: `country:${countrySlug}`
                } :
                    {
                        key: 'AIzaSyCHIlIvmsXf-sllfpXK0Q-1dV7uzgyFvfw',
                        language: 'en',
                    }}

                styles={{
                    container: { marginHorizontal: mvs(0), ...containerStyle,},
                    textInputContainer: { backgroundColor: null, height: mvs(38), ...textInputContainer, },
                    textInput: { backgroundColor: null, height: '100%', paddingLeft: 0,paddingRight: mvs(30),color: colors.typeHeader, ...inputStyle ,},
                    listView: {},
                    row: { zIndex: 1001 },
                    poweredContainer: { backgroundColor: null },

                }}
                textInputProps={{
                    clearButtonMode: false,
                    placeholderTextColor: colors.input_placehoder,
                    ...placeholderStyle
                }}

                currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                currentLocationLabel="Current location"
                nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                GoogleReverseGeocodingQuery={{
                    // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                }}
                // predefinedPlaces={['work']}
                GooglePlacesSearchQuery={{
                    // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                    rankby: 'distance',
                    types: 'food',
                }}
                filterReverseGeocodingByTypes={[
                    'locality',
                    'administrative_area_level_3',
                ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities


                renderRightButton={() => {
                    return (
                        <>
                            {cross ? null :
                                <TouchableOpacity
                                    onPress={onClick}
                                    style={{ ...styles.search,  }}>
                                    {filter ? <Filter /> : <Search />}
                                </TouchableOpacity>}

                        </>
                    )
                }} />



        </View>
    )
}

export default GoogleSearchBar

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.secondary,
        borderRadius: mvs(10),
        paddingHorizontal: mvs(20),
        flexDirection: 'row',
        minHeight: mvs(38),
        //paddingTop : mvs(13.2)
        //alignItems : 'center'
    },
    left: {
        // position: 'absolute',
        // top:mvs(13.2),
        marginTop: mvs(13.2),
        marginRight: mvs(10),
    },
    search: {
        alignSelf:'center'
        // position: 'absolute',
        // right: mvs(20),
        // marginTop: mvs(15)
    }
})
