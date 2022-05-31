import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { mvs } from '../../config/metrices';
import Regular from '../../presentation/typography/regular-text';
const CustomRadio = ({status=true,onChange,selectedColor=colors.primary,label,subLabel='',labelStyle,style,children}) => {
    return (
        <TouchableOpacity onPress={()=>onChange(!status)} style={[styles.CONTAINER,style]}>
            <View  style={[styles.DOT_CONTAINER,]}>
                <View style={[styles.DOT,{ backgroundColor:status?selectedColor:colors.price_border,}]}/>
            </View>
            {children}
            <Text style={[styles.RADIO_LABLE,labelStyle]}>{label}<Text style={{...styles.RADIO_LABLE,fontSize:mvs(12),color:colors.headerTitle}}>{subLabel}</Text></Text>
        </TouchableOpacity>
    );
};
export default CustomRadio;
const styles = StyleSheet.create({
    CONTAINER: {
        flexDirection: 'row',
    },
    RADIO_LABLE: {
        marginLeft: mvs(15),
        fontFamily:fonts.carosSoftRegular,
    },
    DOT_CONTAINER:{
        borderRadius:mvs(10),
        height:mvs(20),
        width:mvs(20),
        backgroundColor:colors.secondary,
        justifyContent:'center',
        alignItems:'center',
    },
    DOT:{
        borderRadius:mvs(5),
        height:mvs(10),
        width:mvs(10),
        backgroundColor:colors.price_border,
    }
});