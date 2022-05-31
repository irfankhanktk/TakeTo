import React from 'react';
import { View, StyleSheet } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Medium from '../../../presentation/typography/medium-text';
import Regular from '../../../presentation/typography/regular-text';
const AddressTypeModal = ({ visible, onClose,onChangeValue }) => {
    return (
        <ReactNativeModal
            propagateSwipe
            isVisible={visible}
            avoidKeyboard
            onBackdropPress={() => onClose(f => !f)}
            onBackButtonPress={() => onClose(f => !f)}
            style={{ margin: 0, padding: 0 }}>
            <View style={styles.CONTAINER}>
                <Medium label={'Address Type'} style={styles.HEADING_TXT} />
                <View style={styles.SUB_CONTAINER}>
                    <Regular onPress={()=>{onChangeValue('House');onClose(false)}} label={'House'} style={styles.TYPE_TXT}/>
                    <Regular onPress={()=>{onChangeValue('Apartment');onClose(false)}} label={'Apartment'} style={styles.TYPE_TXT}/>
                    <Regular onPress={()=>{onChangeValue('Office');onClose(false)}} label={'Office'} style={{...styles.TYPE_TXT,borderBottomWidth:0,}}/>
                </View>
            </View>
        </ReactNativeModal>
    );
};
export default AddressTypeModal;
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
        paddingTop: mvs(28),
        paddingBottom: mvs(20),
        paddingHorizontal: mvs(22),
        borderTopLeftRadius: mvs(20),
        borderTopRightRadius: mvs(20),
    },
    TYPE_TXT:{
        fontSize: mvs(15),
        color: colors.headerTitle,
        alignSelf: 'center',
        marginBottom:mvs(15),
        borderBottomWidth:StyleSheet.hairlineWidth,
        borderColor:colors.border,
        paddingBottom:mvs(20),
        paddingTop:mvs(5),
        width:'100%',
        textAlign:'center',
    },
});