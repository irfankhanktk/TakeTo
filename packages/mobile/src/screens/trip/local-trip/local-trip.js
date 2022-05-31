import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import { INITIAL_STATE } from '@khan_ahmad786/common/store/reducers/common';
import UI_API from '@khan_ahmad786/common/store/services';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import DropdownAlert from 'react-native-dropdownalert';
import Slider from 'react-native-slider';
import { connect } from 'react-redux';
import { TAKE_TO_INPUT_FIELD } from '../../../components/atoms';
import Buttons from '../../../components/atoms/Button';
import CustomRadio from '../../../components/atoms/RadioButton';
import CustomSwitch from '../../../components/atoms/Switch';
import Header from '../../../components/molecules/header/header-1x';
import DatePickerModal from '../../../components/molecules/modals/date-picker-modal';
import SearchLocationModal from '../../../components/molecules/modals/search-location-modal/searchlocation-modal';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';
import { styles } from './styles';
import { useIsFocused } from '@react-navigation/native';


const LocalTrip = props => {

    const { navigation, route, localFilter, setOrResetLocalFilter, countriesList, profileData, clearFilterOrders } = props;
    const { isFilter, isOnline, isLocalOrder } = route.params;
    const [visible, setVisble] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [countryModal, setCountryModal] = React.useState(false);
    const [locationOption, setLocationOption] = React.useState('country_from'); //country_from or country_to
    const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
    const alertRef = React.useRef();
    const isFocus = useIsFocused();
    console.log('profileData', profileData?.country);

    const hideDatePicker = date => {
        setOrResetLocalFilter({
            ...localFilter,
            delivery_date: `${date?.day} / ${date?.month + 1} / ${date?.year}`,
            isThreeDays: false,
            isTwoDays: false,
            is_urgent: false,
        });
        setDatePickerVisibility(false);
    };
    const showDatePicker = () => {
        // if (!localFilter['delivery_date']) {
        //     setOrResetLocalFilter({
        //     ...localFilter,
        //     delivery_date: `${new Date().getDate()} / ${new Date().getMonth()} / ${new Date().getFullYear()}`,
        //   });
        // }
        setDatePickerVisibility(true);
    };


    const onChangeValue = (key, value) => {
        setOrResetLocalFilter({
            ...localFilter, [key]: value
        })
    }

    const onChangeType = (key, value) => {
        // setOrResetLocalFilter({
        //     ...localFilter, [key]: value
        // })
    }

    const onSetLocation = addressComponent => {
        if (locationOption === 'country_from') {
            setOrResetLocalFilter({
                ...localFilter,
                full_address_from: addressComponent?.fulladdress,
                country_from: addressComponent?.country,
                city_from: addressComponent?.city,
                from_country_short_name: addressComponent?.country_short_name,
                latitude: addressComponent?.geoCode?.lat,
                longitude: addressComponent?.geoCode?.lng,
                //to
                full_address_to: '',
                country_to: '',
                city_to: '',
                //from country flag
                from_flag: UI_API._returnFlag(addressComponent?.country_short_name),
            })
        }
        else {
            setOrResetLocalFilter({
                ...localFilter,
                full_address_to: addressComponent?.fulladdress,
                country_to: addressComponent?.country,
                city_to: addressComponent?.city,
                to_country_short_name: addressComponent?.country_short_name,
                to_flag: UI_API._returnFlag(addressComponent?.country_short_name),
            })
        }

    };
    const onPicLocDestination = (option, isEmpty) => {
        setLocationOption(option);
        setVisble(true);
        // if (isEmpty) {
        //     onChangeValue('country_short_name', '');
        // }
    };
    const clear = () => {

        // if (isOnline)
            setOrResetLocalFilter({ ...INITIAL_STATE.localFilter, country_from:isOnline? profileData?.country?.name:'', full_address_from:isOnline? profileData?.country?.name:'', from_flag: profileData?.country?.flag,to_flag: profileData?.country?.flag  })
        // else {
        //     // setOrResetLocalFilter(undefined, false);
        //     setOrResetLocalFilter({ ...INITIAL_STATE.localFilter, country_from: profileData?.country?.name, full_address_from: profileData?.country?.name, from_flag: profileData?.country?.flag })
        // }
    }
    const onSaveTrip = async () => {
        try {
          
                if (!localFilter?.country_from) {
                    throw new Error('Oops! you have forgot to enter from  address');
                } else if (!localFilter?.country_to) {
                    throw new Error('Oops! you have forgot to enter to  address');
                }
                clearFilterOrders();
                setLoading(true);
                setLoading(false);

                // if(props?.route?.params?.is_local ||props?.route?.params?.is_Map_screen){
                navigation.replace(props?.route?.params?.is_Map_screen ? 'searchmap' : 'internationaldelivery', {
                    isOnline,
                    isFilter,
                    isLocalOrder: true,
                });
                //  }else{
                //     navigation.replace(isLocalOrder ? 'searchmap' : '', {
                //         isOnline,
                //         isFilter,
                //         isLocalOrder,
                //     });
                //  }
     
        } catch (error) {
            alertRef.current.alertWithType(
                'error',
                'Error',
                UI_API._returnError(error),
            );
            setLoading(false);
        }
    };
    React.useEffect(() => {
        // Return the function to unsubscribe from the event so it gets removed on unmount
        if (!isFocus) return;
        if (isOnline) {
            setOrResetLocalFilter({ ...localFilter, country_from: profileData?.country?.name, full_address_from: profileData?.country?.name, from_flag: profileData?.country?.flag })
        } else {
            setOrResetLocalFilter({ ...localFilter, from_flag: profileData?.country?.flag,to_flag: profileData?.country?.flag })
        }

    }, [isFocus])
    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            <Header
                {...props}
                title={isFilter ? 'filters' : 'Add Trip'}
                allowBackBtn
                bellIcon
            />
            <View style={{ flex: 1 }}>
                <ScrollView
                    keyboardShouldPersistTaps='always'
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingBottom: mvs(40),
                        paddingHorizontal: mvs(22),
                        paddingTop: mvs(27)
                    }}>
                    {!isFilter && <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Regular label={'Deliver Before'} />
                        <Buttons.ButtonRTL
                            textStyle={{
                                color: localFilter?.delivery_date ? colors.primary : colors.lightgrey2,
                            }}
                            // disabled={ifRadio(radioLabels.label2Way)}
                            onClick={() => {
                                // showDatePicker('delivery_date');
                                showDatePicker();
                            }}
                            iconName={localFilter.delivery_date ? 'date' : 'dateGray'}
                            title={localFilter.delivery_date || 'Date'}
                            style={{ ...styles.FLAG_BUTTON, width: '49%' }}
                            iconStyle={styles.RTL_ICON}
                        />
                    </View>}

                    <View style={{
                        marginTop: mvs(15),
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        zIndex: 1001,
                    }}>
                        <View style={{ flexDirection: 'row', }}>
                            <Regular
                                label={'From'}
                                style={{
                                    fontSize: mvs(15),
                                    color: colors.typeHeader,
                                    marginBottom: mvs(10),
                                }}
                            />
                            <Regular label={'*'} style={{ color: colors.mendatory, marginTop: -mvs(3) }} />
                        </View>
                        {isOnline ?
                            <Buttons.ButtonLocation
                                disabled={true}
                                textStyle={{ color: localFilter?.full_address_from ? colors.primary : colors.lightgrey2, textAlign: 'left' }}
                                onClick={() => {
                                }}
                                iconName={localFilter?.from_flag}
                                title={localFilter?.full_address_from || 'From'}
                                style={{ ...styles.FLAG_BUTTON, width: '75%', flexDirection: 'row' }}
                                iconStyle={{
                                    height: mvs(23),
                                    width: mvs(23),
                                }}
                            /> :
                            <TAKE_TO_INPUT_FIELD.SearchInput
                                is_full_address={localFilter?.full_address_from}
                                value={localFilter?.full_address_from || 'From'}
                                onChangeText={(addressComponent) => {
                                    setOrResetLocalFilter({
                                        ...localFilter,
                                        full_address_from: addressComponent?.fulladdress,
                                        country_from: addressComponent?.country,
                                        city_from: addressComponent?.city,
                                        from_country_short_name: addressComponent?.country_short_name,
                                        latitude: addressComponent?.geoCode?.lat,
                                        longitude: addressComponent?.geoCode?.lng,
                                        //to
                                        // full_address_to: '',
                                        // country_to: '',
                                        // city_to: '',
                                        //from country flag
                                        from_flag: UI_API._returnFlag(addressComponent?.country_short_name),
                                    })

                                }}
                                slug={profileData?.country?.slug || 'kw'}
                                falg={localFilter?.from_flag} />
                        }
                    </View>
                    <View style={{
                        marginTop: mvs(15),
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        zIndex: 5,
                        //borderWidth : 1
                    }}>
                        <View style={{ flexDirection: 'row', }}>
                            <Regular
                                label={'To'}
                                style={{
                                    fontSize: mvs(15),
                                    color: colors.typeHeader,
                                    // marginBottom: mvs(10),
                                }}
                            />
                            <Regular label={'*'} style={{ color: colors.mendatory, marginTop: -mvs(3) }} />
                        </View>
                        <TAKE_TO_INPUT_FIELD.SearchInput
                            is_full_address={localFilter?.full_address_to}
                            value={localFilter?.full_address_to || 'To'}
                            onChangeText={(addressComponent) => {
                                setOrResetLocalFilter({
                                    ...localFilter,
                                    full_address_to: addressComponent?.fulladdress,
                                    country_to: addressComponent?.country,
                                    city_to: addressComponent?.city,
                                    to_country_short_name: addressComponent?.country_short_name,
                                    to_flag: UI_API._returnFlag(addressComponent?.country_short_name),
                                })
                            }}
                            slug={profileData?.country?.slug || 'kw'}
                            falg={localFilter?.from_flag} />
                    </View>

                    <CustomSwitch
                        textStyle={{ color: colors.typeHeader }}
                        label={'No delivery offers'}
                        value={localFilter?.no_delivery}
                        onChange={value => onChangeValue('no_delivery', value)}
                    />
                    <View style={styles.DIV} />
                    <Regular label={'Delivery time'} style={styles.DEL_TIME} />
                    <View style={styles.RADIO_CONTAINER}>
                        <View style={{ flexDirection: 'row', marginBottom: mvs(8), justifyContent: 'space-between' }}>
                            <CustomRadio
                                labelStyle={{
                                    color: localFilter?.isThreeDays
                                        ? colors.primary
                                        : colors.headerTitle,
                                }}
                                style={{ width: '49%', }}
                                status={localFilter?.isThreeDays}
                                label={'Within 3 days'}
                                onChange={value => {
                                    setOrResetLocalFilter({
                                        ...localFilter,
                                        isThreeDays: true,
                                        isTwoDays: false,
                                        is_urgent: false,
                                        delivery_date: '',
                                    });
                                }}
                            />
                            <CustomRadio
                                labelStyle={{
                                    color: localFilter?.isTwoDays
                                        ? colors.primary
                                        : colors.headerTitle,
                                }}
                                style={{ width: '49%', }}
                                // style={{ marginLeft: mvs(45) }}
                                status={localFilter?.isTwoDays}
                                label={'Within 2 days'}
                                onChange={value => {
                                    setOrResetLocalFilter({
                                        ...localFilter,
                                        isThreeDays: false,
                                        isTwoDays: true,
                                        is_urgent: false,
                                        delivery_date: ''
                                    });
                                }}
                            />
                        </View>
                        <CustomRadio
                            subLabel={' (Higher rewards)'}
                            labelStyle={{ color: colors.pink }}
                            style={{ marginTop: mvs(8) }}
                            status={localFilter?.is_urgent}
                            label={'Urgent Deliveries'}
                            onChange={value => {
                                setOrResetLocalFilter({
                                    ...localFilter,
                                    isThreeDays: false,
                                    isTwoDays: false,
                                    is_urgent: true,
                                    delivery_date: ''
                                });
                            }}
                        />
                    </View>
                    <View style={styles.PRICES_CONTAINER}>
                        <View>
                            <Regular
                                style={{ alignSelf: 'flex-end', color: colors.primary }}
                                label={`${Math.floor(localFilter?.max_price)} ${profileData?.currency?.currency_code}`}
                            />
                            <View style={styles.MAX_MIN_PRICE}>
                                <Regular
                                    style={styles.PRICE_HEADING}
                                    label={'Max Product Price'}
                                />
                                <Slider
                                    style={{ width: '55%', marginRight: mvs(-15) }}
                                    minimumValue={0}
                                    maximumValue={2000}
                                    thumbStyle={{ height: mvs(15), width: mvs(15) }}
                                    minimumTrackTintColor={colors.primary}
                                    maximumTrackTintColor={colors.secondary}
                                    thumbTintColor={colors.primary}
                                    value={localFilter?.max_price}
                                    onValueChange={v => {
                                        onChangeValue('max_price', v);
                                    }}
                                />
                            </View>
                        </View>
                        <View>
                            <Regular
                                style={{ alignSelf: 'flex-end', color: colors.primary }}
                                label={`${Math.floor(localFilter?.reward)} ${profileData?.currency?.currency_code}`}
                            />
                            <View style={styles.MAX_MIN_PRICE}>
                                <Regular style={styles.PRICE_HEADING} label={'Min Reward'} />
                                <Slider
                                    style={{ width: '55%', marginRight: mvs(-15) }}
                                    minimumValue={0}
                                    maximumValue={150}
                                    thumbStyle={{ height: mvs(15), width: mvs(15) }}
                                    minimumTrackTintColor={colors.primary}
                                    maximumTrackTintColor={colors.secondary}
                                    thumbTintColor={colors.primary}
                                    value={localFilter?.reward}
                                    onValueChange={v => {
                                        onChangeValue('reward', v);
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.BUTTON_CONTAINER}>
                        <Buttons.ButtonPrimary
                            loading={loading}
                            loaderColor={colors.white}
                            disabled={loading}
                            onClick={onSaveTrip}
                            style={styles.BUTTON}
                            title={isFilter ? 'Apply Filters' : 'Add Trip'}
                        />
                        <Buttons.ButtonSecondaryOutline
                            onClick={clear}
                            style={{ ...styles.BUTTON }}
                            title={'Clear All'}
                        />
                    </View>
                </ScrollView>
            </View>
            <SearchLocationModal
                setLocation={onSetLocation}
                setVisible={setVisble}
                visible={visible}
                country_short_name={profileData?.country?.slug || 'kw'}
            />
            {countryModal && <CountryPicker
                visible
                withFilter
                onClose={() => { setCountryModal(false); }}
                onSelect={(item) => {
                    setOrResetLocalFilter({
                        ...localFilter,
                        country_from: item?.name,
                        full_address_from: item?.name,
                        from_flag: countriesList?.find(x => x.name == item?.name)?.flag,
                        from_country_short_name: item?.cca2,
                        to_country_short_name: item?.cca2,
                        full_address_to: '',
                        country_to: '',
                        city_to: '',
                        to_flag: '',
                    })
                    setCountryModal(false);
                }
                }
            />}
            <DatePickerModal
                visible={isDatePickerVisible}
                onClose={() => {
                    setDatePickerVisibility(false);
                }}
                onApply={hideDatePicker}
            />
            <DropdownAlert zIndex={5}  elevation={15} translucent activeStatusBarStyle={'light-content'} inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />

        </View>
    );
};
const mapStateToProps = state => {
    return {
        isGuest: state.auth.isGuest,
        localFilter: state.common.localFilter,
        profileData: state.auth.userInfo?.profile || {},
        countriesList: state.common.countriesList,
    };
};
const mapDispatchToProps = dispatch => ({
    createOrFilterTrip: (payload, bool = true) => dispatch(TAKE_TO_ACTIONS.createOrFilterTrip(payload, bool)),
    setOrResetLocalFilter: (payload, bool) => dispatch(TAKE_TO_ACTIONS.setOrResetLocalFilter(payload, bool)),
    clearFilterOrders: () => dispatch(TAKE_TO_ACTIONS.clearFilterOrders()),
});
export default connect(mapStateToProps, mapDispatchToProps)(LocalTrip);


