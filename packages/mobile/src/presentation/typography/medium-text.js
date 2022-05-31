import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import fonts from '../../config/fonts'

const Medium = ({label,style,...props}) => {
    //const {label,style}=props
    return <Text {...props} style={{...styles.label,...style}}>{label}</Text>;
}
 
export default Medium

const styles = StyleSheet.create({
    label:{
        fontFamily:fonts.carosSoftMedium,
    }
});
