import React from 'react';
import { View, Text, StyleSheet, } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';
import Buttons from '../../atoms/Button';
const AlerBox = ({ title = 'I am Title', message='I am message', setVisible, visible = false, children }) => {
    return (
        <ReactNativeModal
            propagateSwipe
            isVisible={visible}
            onBackdropPress={setVisible}
            onSwipeComplete={setVisible}
            swipeDirection='down'
            style={{ margin: 0 }}>
            <View style={{ ...styles.container, border: 1, }}>
                <Regular style={styles.title} label={title} />
                <Regular style={styles.message} label={message} />
                {children}
                <View style={{flexDirection:'row',justifyContent:'space-between',position:'absolute',bottom:mvs(20),alignSelf:'center'}}>
                    <Buttons.ButtonPrimary onClick={setVisible} title={'OK'} />
                    {/* <Buttons.ButtonSecondaryOutline style={{width:'49%'}}  title={'Cancel'} /> */}
                </View>
            </View>
        </ReactNativeModal>
    );
};
export default AlerBox;
const styles = StyleSheet.create({
    container:
    {
        alignSelf: 'center', height: '40%', width: mvs(280), padding: 10,
        borderRadius: mvs(30),
        backgroundColor: colors.white
    },
    title: {
        color: colors.typeHeader,
        fontSize: mvs(18),
        alignSelf: 'center',
    },
    message:{
        marginTop:mvs(30),
        alignSelf:'center',
        textAlign:'center',
    }

});
