import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { mvs } from '../../config/metrices';
import fonts from '../../config/fonts'

const Light = (props) => {
    const {label,style}=props
    return <Text {...props} style={{...styles.label,...style}}>{label}</Text>;
}

export default Light

const styles = StyleSheet.create({
    label:{
        fontFamily:fonts.carosSoftLight,
        fontSize:mvs(15),
    }
});
