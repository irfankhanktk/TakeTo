import React from 'react';
import { StyleSheet, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Medium from '../../../presentation/typography/medium-text';
import Regular from '../../../presentation/typography/regular-text';
import Buttons from '../../atoms/Button';
const AddBalanceModal = ({ visible, onClose,proceedLoading ,addBalance}) => {
    const [paymentMethod, setPaymentMethod] = React.useState('visa')


    return (
        <ReactNativeModal
            propagateSwipe
            isVisible={visible}
            avoidKeyboard
            onBackdropPress={() => onClose(f => !f)}
            onBackButtonPress={() => onClose(f => !f)}
            style={{ margin: 0, padding: 0 }}>
            <View style={styles.CONTAINER}>
                <Medium label={'Add Balance'} style={styles.HEADING_TXT} />
                <View style={styles.SUB_CONTAINER}>
                    <Regular label={'Our partners'} style={styles.PARTNER_TXT} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Buttons.ButtonBlanceCard style={{ borderColor: paymentMethod === 'visa' ? colors.primary : colors.border }} iconName={'visa'} onClick={() => { setPaymentMethod('visa'); }} />
                        <Buttons.ButtonBlanceCard style={{ borderColor: paymentMethod === 'master' ? colors.primary : colors.border }} iconName={'master'} onClick={() => { setPaymentMethod('master'); }} />
                        <Buttons.ButtonBlanceCard style={{ borderColor: paymentMethod === 'american' ? colors.primary : colors.border }} iconName={'american'} onClick={() => { setPaymentMethod('american'); }} />
                        <Buttons.ButtonBlanceCard style={{ borderColor: paymentMethod === 'net' ? colors.primary : colors.border }} iconName={'net'} onClick={() => { setPaymentMethod('net'); }} />
                    </View>
                    <View style={styles.BUTTON_CONTAINER}>
                        <Buttons.ButtonPrimary loaderColor={colors.white}
                            loading={proceedLoading}
                            disabled={proceedLoading}
                            
                            onClick={addBalance} style={styles.BUTTON} title={'Proceed'} />
                        <Buttons.ButtonSecondaryOutline onClick={() => onClose()} style={{ ...styles.BUTTON, }} title={'Cancel'} />
                    </View>
                </View>
            </View>
        </ReactNativeModal>
    );
};
export default AddBalanceModal;
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
    PARTNER_TXT: {
        fontSize: mvs(15),
        color: colors.headerTitle,
        alignSelf: 'center',
        marginBottom: mvs(15),
    },
    BUTTON_CONTAINER: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: mvs(30),
    },
    BUTTON: {
        width: '49%',
    },
});