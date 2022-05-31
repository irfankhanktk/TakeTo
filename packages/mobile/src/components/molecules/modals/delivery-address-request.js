import { placeholder } from '@babel/types'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import ReactNativeModal from 'react-native-modal'
import colors from '../../../config/colors'
import { mvs } from '../../../config/metrices'
import Medium from '../../../presentation/typography/medium-text'
import Regular from '../../../presentation/typography/regular-text'
import OrderDestination from '../../atoms/OrderDestination'
import OrderDestinationAddress from '../../atoms/OrderDestinationAddress'
import ImagePlaceholder from '../../atoms/Placeholder'
import * as SVGS from '../../../../resource/assets/order-car-icons'
import { TAKE_TO_IMAGES } from '../../../../resource/assets/image_resouce'
import Buttons from '../../atoms/Button'
import SettingCard from '../setting_card/setting-card'
import CustomSwitch from '../../atoms/Switch'

const DeliveryAddressRequest = ({ visible, onClose, title, image, name, settingCard = false, backButton = false, step = 1, backButtonTitle = "Back", onNext,...props }) => {
    const Aeroplane = SVGS['aeroplane']
    const Location = SVGS['location']

    const [payload, setPayload] = React.useState({
        isPromotionEmail: true,
        isLocationServices: true,
        isOrderEmail: true,
        isSms: true,
        home: true,
        work: false,
        current: false,
        different: false,
        //step: step
    });
    return (
        <ReactNativeModal
            propagateSwipe
            isVisible={visible}
            avoidKeyboard
            onBackdropPress={() => onClose(f => !f)}
            onBackButtonPress={() => onClose(f => !f)}
            style={{ margin: 0, paddingHorizontal: mvs(11) }}>
            <View style={styles.mainContainer}>
                <Regular label={"Delivery Address Requested"} style={styles.header} />
                <Regular label={`Delivery Address was requested.\nYou are almost done.`} style={styles.heading}/>

                {/* <SettingCard
                    heading="Make sure your notifications are on"
                    headingStyle={{ alignSelf: 'center' }}
                    style={{ marginTop: mvs(43), paddingTop: mvs(13), paddingBottom: mvs(7) }}
                >
                    <CustomSwitch
                        value={payload.isOrderEmail}
                        label={'Email'}
                        textStyle={{ color: colors.primary }}
                        onChange={v => setPayload({ ...payload, isOrderEmail: v })}
                        style={{ marginTop: mvs(13) }}
                    />
                    <CustomSwitch
                        style={{ marginTop: mvs(28) }}
                        value={payload.isSms}
                        label={'SMS'}
                        textStyle={{ color: colors.primary }}
                        onChange={v => setPayload({ ...payload, isSms: v })}
                        style={{ marginTop: mvs(10) }}
                    />
                </SettingCard> */}


                {<Buttons.ButtonPrimary
                    onClick={onClose}
                    title={"Back"}
                    style={{ marginTop: mvs(30) }}
                />}
            </View>
        </ReactNativeModal>
    )
}

export default DeliveryAddressRequest

const styles = StyleSheet.create({
    mainContainer: {
        //height : mvs(400),
        width: '100%',
        backgroundColor: colors.white,
        borderRadius: mvs(20),
        alignSelf: 'center',
        paddingTop: mvs(24),
        paddingBottom: mvs(20),
        paddingHorizontal: mvs(10)
    },
    header: {
        fontSize: mvs(20),
        color: colors.primary,
        alignSelf: 'center'
    },
    heading: {
        fontSize: mvs(15),
        color: colors.typeHeader,
        alignSelf: 'center',
        marginTop: mvs(10),
        textAlign: 'center'
    },
    productMainContainer: {
        width: '100%',
        flexDirection: 'row',
        //borderWidth : 1,
        //height : mvs(210),
        marginTop: mvs(23),
        justifyContent: 'space-between'
    },
    productInfoContainer: {
        width: '49%',
        //borderWidth : 1,
        //paddingLeft : mvs(9)
    },
    name: {
        fontSize: mvs(12),
        color: colors.typeHeader,
        marginTop: mvs(28)
    },
    site: {
        fontSize: mvs(12),
        color: colors.primary,
        marginTop: mvs(9),
    },
    priceContainer: {
        height: mvs(25),
        width: '100%',
        borderTopWidth: mvs(0.5),
        borderBottomWidth: mvs(0.5),
        borderColor: colors.horizontalLine,
        marginTop: mvs(10),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    price: {
        fontSize: mvs(12),
        color: colors.typeHeader
    },
    rewardContainer: {
        //height : mvs(25),
        width: '100%',
        marginTop: mvs(13),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    rewardTitle: {
        fontSize: mvs(12),
        color: colors.primary
    },
    reward: {
        fontSize: mvs(18),
        color: colors.primary
    },
    routeMainContainer: {
        //borderWidth : 1,
        width: "100%",
        marginTop: mvs(15),
        minHeight: mvs(54)
    },
    buttonsContainer: {
        width: '100%',
        marginTop: mvs(25),
        //borderWidth : 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        height: mvs(52),
        width: "49%",
        //borderWidth : 1
    },
    deliveryOption: {
        borderWidth: mvs(0.5),
        paddingHorizontal: mvs(10),
        paddingVertical: mvs(11),
        borderRadius: mvs(10),
        borderColor: colors.lightgrey2,
        marginTop: mvs(33),
    }
})
