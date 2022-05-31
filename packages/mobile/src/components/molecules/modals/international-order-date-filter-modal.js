import Slider from 'react-native-slider';
import moment from 'moment';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Medium from '../../../presentation/typography/medium-text';
import Regular from '../../../presentation/typography/regular-text';
import Buttons from '../../atoms/Button';
import CustomRadio from '../../atoms/RadioButton';
import CustomSwitch from '../../atoms/Switch';
import Calendar from '../calendar/calendar';
import DateTimePicker from '../destination-card/date-picker';
import InternationalOrderFilterModal from './international-order-filter-modal';
import ModalWrapper from './../modal-wrapper/modal-wrapper';
import DatePickerModal from './date-picker-modal';
import { connect } from 'react-redux';
const InternationalOrderDateFilterModal = ({ visible, onClose, navigation, onApply,profileData }) => {
    const [sliderValue, setSliderValue] = React.useState(10);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [nextModal, setNextModal] = React.useState(false);

    const [payload, setPayload] = React.useState({
        isOneWay: true,
        isRound: false,
        isThirtyDays: true,
        isThreeWeeks: false,
        isNinetyDays: false,
        isTwoWeeks: false,
        is_urgent: false,
        no_delivery: true,
        maxPrice: '100',
        minPrice: '1000',
        date: '',
        departure: '',
        returning: '',
        //
        // is_urgent: false,
        country_from: 'Pakistan',
        country_to: 'Pakistan',
        // no_delivery: true,
        delivery_date: moment().add(3, 'days').format('YYYY-MM-DD'),
        max_price: 20000,
        reward: 10,
    });
    const [dateOption, setDateOption] = React.useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);
    const hideDatePicker = (date) => {
        console.log(date);
        console.log(`${date?.day} / ${date?.month + 1} / ${date?.year}`);
        setPayload({
            ...payload,
            [dateOption]: `${date?.day} / ${date?.month + 1} / ${date?.year}`,
        });
        setDatePickerVisibility(false);
    };
    const showDatePicker = (option) => {
        if (!payload[option]) {
            setPayload({
                ...payload,
                [option]: `${new Date().getDate()} / ${new Date().getMonth()} / ${new Date().getFullYear()}`,
            });
        }
        setDateOption(option);
        setDatePickerVisibility(true);
    };
    return (
        <ModalWrapper isBack title='Filters' visible={visible} onClose={onClose}>
            <>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <CustomRadio style={styles.TRIP_TYPE_RADIO} status={payload.isOneWay} label={'One Way'} onChange={(value) => setPayload({ ...payload, isOneWay: value, isRound: false })} />
                    <CustomRadio style={styles.TRIP_TYPE_RADIO} status={payload.isRound} label={'Round Trip'} onChange={(value) => setPayload({ ...payload, isOneWay: false, isRound: value })} />
                </View>
                <View style={{ ...styles.DESTINATION_CONTAINER, marginTop: mvs(10) }}>
                    <Buttons.ButtonRTL textStyle={{ color: payload.date ? colors.primary : colors.lightgrey2 }} disabled={payload.isRound} onClick={() => showDatePicker('date')} iconName={'date'} title={payload.date || 'Departure'} style={{ ...styles.FLAG_BUTTON, width: '49%' }} iconStyle={styles.RTL_ICON} />
                    <Buttons.ButtonRTL textStyle={{ color: payload.departure ? colors.primary : colors.lightgrey2 }} disabled={payload.isOneWay} onClick={() => showDatePicker('departure')} iconName={'date'} title={payload.departure || 'Departure'} style={{ ...styles.FLAG_BUTTON, width: '49%' }} iconStyle={styles.RTL_ICON} />
                </View>
                <View style={{ ...styles.DESTINATION_CONTAINER, justifyContent: 'flex-end', marginTop: mvs(10) }}>
                    <Buttons.ButtonRTL textStyle={{ color: payload.returning ? colors.primary : colors.lightgrey2 }} disabled={payload.isOneWay} onClick={() => showDatePicker('returning')} iconName={'date'} title={payload.returning || 'Returning'} style={{ ...styles.FLAG_BUTTON, width: '49%' }} iconStyle={styles.RTL_ICON} />
                </View>
                <View>
                    <Regular label={'Location'} style={{ fontSize: mvs(15), color: colors.typeHeader, marginBottom: mvs(10) }} />
                    <Buttons.ButtonRTL textStyle={{ color: colors.primary }} onClick={() => { }} iconName={'flag'} title={'Kuwait'} style={styles.FLAG_BUTTON} iconStyle={{
                        height: mvs(23),
                        width: mvs(23),
                    }} />
                </View>
                <View style={{ marginTop: mvs(8) }}>
                    <Regular label={'Destination'} style={{ fontSize: mvs(15), color: colors.typeHeader, marginBottom: mvs(10) }} />
                    <Buttons.ButtonRTL textStyle={{ color: colors.lightgrey2 }} showIcon={false} onClick={() => { }} iconName={'flag'} title={'Select'} style={{ ...styles.FLAG_BUTTON, flexDirection: 'row' }} iconStyle={{
                        height: mvs(23),
                        width: mvs(23),
                    }} />
                </View>
                <CustomSwitch textStyle={{ color: colors.typeHeader }} label={'No delivery offers'}
                    value={payload.no_delivery}
                    onChange={(value) => setPayload({ ...payload, no_delivery: value })}
                />
                <View style={styles.DIV} />
                <Regular label={'Delivery time'} style={styles.DEL_TIME} />
                <View style={styles.RADIO_CONTAINER}>
                    <View style={{ flexDirection: 'row', marginBottom: mvs(8) }}>
                        <CustomRadio labelStyle={{ color: payload?.isThirtyDays ? colors.primary : colors.headerTitle }} status={payload.isThirtyDays} label={'Up to 30 days'} onChange={(value) => setPayload({ ...payload, isThirtyDays: true, isThreeWeeks: false, isTwoWeeks: false, isNinetyDays: false, is_urgent: false, })} />
                        <CustomRadio labelStyle={{ color: payload?.isThreeWeeks ? colors.primary : colors.headerTitle }} style={{ marginLeft: mvs(45) }} status={payload.isThreeWeeks} label={'Up to 3 weeks'} onChange={(value) => setPayload({ ...payload, isThirtyDays: false, isThreeWeeks: true, isTwoWeeks: false, isNinetyDays: false, is_urgent: false, })} />
                    </View>
                    <View style={{ flexDirection: 'row', marginBottom: mvs(8) }}>
                        <CustomRadio labelStyle={{ color: payload?.isTwoWeeks ? colors.primary : colors.headerTitle }} status={payload.isTwoWeeks} label={'Up to 2 weeks'} onChange={(value) => setPayload({ ...payload, isThirtyDays: false, isThreeWeeks: false, isTwoWeeks: true, isNinetyDays: false, is_urgent: false, })} />
                        <CustomRadio labelStyle={{ color: payload?.isNinetyDays ? colors.primary : colors.headerTitle }} style={{ marginLeft: mvs(45) }} status={payload.isNinetyDays} label={'Up to 90 days'} onChange={(value) => setPayload({ ...payload, isThirtyDays: false, isThreeWeeks: false, isTwoWeeks: false, isNinetyDays: true, is_urgent: false, })} />
                    </View>
                    <CustomRadio subLabel={' (Higher rewards)'} labelStyle={{ color: colors.pink }} style={{}} status={payload.is_urgent} label={'Urgent Deliveries'} onChange={(value) => setPayload({ ...payload, isThirtyDays: false, isThreeWeeks: false, isTwoWeeks: false, isNinetyDays: false, is_urgent: true, })} />
                </View>
                <View style={styles.PRICES_CONTAINER}>
                    <View>
                        <Regular style={{ alignSelf: 'flex-end', color: colors.primary }} label={`${Math.floor(payload.minPrice)} ${profileData?.currency?.currency_code}`} />
                        <View style={styles.MAX_MIN_PRICE}>
                            <Regular style={styles.PRICE_HEADING} label={'Max Product Price'} />
                            <Slider style={{ width: '55%', marginRight: mvs(-15) }}
                                minimumValue={0}
                                maximumValue={1000}
                                thumbStyle={{height: mvs(15), width: mvs(15)}}
                                minimumTrackTintColor={colors.primary}
                                maximumTrackTintColor={colors.secondary}
                                thumbTintColor={colors.primary}
                                onValueChange={(v) => { setPayload({ ...payload, minPrice: v }) }}
                            />
                        </View>
                    </View>
                    <View>
                        <Regular style={{ alignSelf: 'flex-end', color: colors.primary }} label={`${Math.floor(payload.maxPrice)} ${profileData?.currency?.currency_code}`} />
                        <View style={styles.MAX_MIN_PRICE}>
                            <Regular style={styles.PRICE_HEADING} label={'Max Reward'} />
                            <Slider style={{ width: '55%', marginRight: mvs(-15) }}
                                minimumValue={0}
                                maximumValue={1000}
                                thumbStyle={{height: mvs(15), width: mvs(15)}}
                                minimumTrackTintColor={colors.primary}
                                maximumTrackTintColor={colors.secondary}
                                thumbTintColor={colors.primary}
                                onValueChange={(v) => { setPayload({ ...payload, maxPrice: v }) }}
                            />
                        </View>
                    </View>
                </View>
                <View style={{ ...styles.BUTTON_CONTAINER, }}>
                    <Buttons.ButtonPrimary onClick={() => onApply(
                        {
                            no_delivery:payload.no_delivery?1:0,
                            country_from:payload.country_from,
                            country_to:payload.country_to,
                            delivery_date:payload.delivery_date,
                        }
                    )} style={{ ...styles.BUTTON, width: '49%' }} title={'Apply Filters'} />
                    <Buttons.ButtonSecondaryOutline onClick={() => onClose()} style={{ ...styles.BUTTON, width: '49%' }} title={'Clear All'} />
                </View>
                {/* <DateTimePicker
                    isVisible={isDatePickerVisible}
                    onCancel={hideDatePicker}
                    mode="date"
                    maximumDate={new Date()}
                    isDarkModeEnabled={false}
                    // backdropStyleIOS={colors.black}
                    onConfirm={date => {
                        setPayload({ ...payload, [dateOption]: moment(date).format('MM / DD / YYYY') });
                        setDatePickerVisibility(false);
                    }}
                /> */}
                <DatePickerModal
                    visible={isDatePickerVisible}
                    onClose={() => { setDatePickerVisibility(false) }}
                    onApply={hideDatePicker}
                />
                <InternationalOrderFilterModal
                    onApply={() => {
                        setNextModal(false);
                        onClose(false);
                    }}
                    visible={nextModal}
                    onClose={() => {
                        setNextModal(false);
                    }}
                    onBackButton={() => {
                        setNextModal(false);
                    }}
                    navigation={navigation}
                />
            </>
        </ModalWrapper>
    );
};
const mapStateToProps=state=>({
    profileData: state.auth.userInfo?.profile || {},
})
export default connect(mapStateToProps,{})(InternationalOrderDateFilterModal);
const styles = StyleSheet.create({
    CONTAINER: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderTopLeftRadius: mvs(20),
        borderTopRightRadius: mvs(20),
        backgroundColor: colors.primary,
    },
    HEADING_TXT: {
        fontSize: mvs(15),
        color: colors.white,
        alignSelf: 'center',
        marginTop: mvs(13),
        marginBottom: mvs(16),
    },
    SUB_CONTAINER: {
        backgroundColor: colors.white,
        paddingTop: mvs(20),
        paddingBottom: mvs(38),
        paddingHorizontal: mvs(22),
        borderTopLeftRadius: mvs(20),
        borderTopRightRadius: mvs(20),
    },
    DESTINATION_CONTAINER: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: mvs(10)
    },
    BUTTON_CONTAINER: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    BUTTON: {
        width: '49%',
    },
    TRIP_TYPE_RADIO: {
        width: mvs(161),
    },
    RTL_ICON: {

        height: mvs(23),
        width: mvs(23),
    },

    DESTINATION_CONTAINER: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    FLAG_BUTTON: {
        width: '100%',
        height: mvs(38),
        flexDirection: 'row-reverse',
        backgroundColor: colors.secondary,
    },
    SEARCH_MAP: {
        marginTop: mvs(15),
        alignSelf: 'flex-end',
        width: mvs(161),
        height: mvs(38),
        flexDirection: 'row',
        backgroundColor: colors.primary,
        paddingHorizontal: mvs(23),
    },
    MAP_ICON: {
        height: mvs(18),
        width: mvs(14),
    },
    NO_DELIVERY_CONTAINER: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: mvs(14),
        marginTop: mvs(15),
        borderColor: colors.filter_divider,
    },
    NoDelivery: {
        fontSize: mvs(15), color: colors.headerTitle,
    },
    PRICES_CONTAINER: {
        justifyContent: 'space-between',
    },
    PRICE_HEADING: {
        fontSize: mvs(15),
        color: colors.typeHeader,
        marginBottom: mvs(10)

    },
    MAX_MIN_PRICE: {
        // width: mvs(161),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'

    },
    DIV: {
        marginTop: mvs(15),
        marginBottom: mvs(13),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: colors.filter_divider,
    },
    DEL_TIME: {
        color: colors.typeHeader,
        fontSize: mvs(15),
        marginBottom: mvs(8),
    },
    RADIO_CONTAINER: {
        marginBottom: mvs(18),
    },
    RADIO_LABEL: {
        color: colors.headerTitle,
        fontSize: mvs(15),
    },
    BUTTON_CONTAINER: {
        marginTop: mvs(30),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    BUTTON: {
        width: mvs(161),
    },
});