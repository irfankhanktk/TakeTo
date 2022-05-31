import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import { back_white as Back} from '../../../../resource/assets/common-icons';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Medium from '../../../presentation/typography/medium-text';
import Regular from '../../../presentation/typography/regular-text';
import Buttons from '../../atoms/Button';
const ModalWrapper = ({ visible, onClose,isBack,title='I am a Modal', children }) => {
    const [paymentMethod, setPaymentMethod] = React.useState('visa')
    return (
        <ReactNativeModal
            propagateSwipe
            isVisible={visible}
            avoidKeyboard
            onBackdropPress={() => onClose(f => !f)}
            onBackButtonPress={() => onClose(f => !f)}
            style={{ margin: 0, padding: 0,justifyContent:'flex-end' }}>
            <View style={styles.CONTAINER}>
                <View style={{
                    marginTop: mvs(13),
                    marginBottom: mvs(16),
                }}>
                    {isBack&&<TouchableOpacity onPress={onClose}>
                        <Back style={{position:'absolute',left:mvs(15)}}/>
                    </TouchableOpacity>}
                    <Medium label={title} style={styles.HEADING_TXT} />
                </View>
                <View style={styles.SUB_CONTAINER}>
                    {children}
                </View>
            </View>
        </ReactNativeModal>
    );
};
export default ModalWrapper;
const styles = StyleSheet.create({
    CONTAINER: {
        // position: 'absolute',
        // bottom: 0,
        width: '100%',
        borderTopLeftRadius: mvs(20),
        borderTopRightRadius: mvs(20),
        backgroundColor: colors.primary,
    },
    HEADING_TXT: {
        fontSize: mvs(15),
        color: colors.white,
        alignSelf: 'center',
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
        width: mvs(161),
    },
});