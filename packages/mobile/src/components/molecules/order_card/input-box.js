import React from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'
import { mvs } from '../../../config/metrices';
import colors from '../../../config/colors'
import fonts from '../../../config/fonts'
import Regular from '../../../presentation/typography/regular-text'

const InputBox = ({title, style, inputStyle, placeholder = "Enter your note here",...props}) => {
    return (
        <View style = {{...styles.inputbox,...style }}>
            <Regular label = {title} style = {styles.value}/> 
            <TextInput
            style = {{...styles.input, ...inputStyle}}
            multiline = {true}
            placeholder = {placeholder}
            />
        </View>
    )
}

export default InputBox

const styles = StyleSheet.create({
    inputbox: {
        width : '100%',
        borderRadius : mvs(10),
        backgroundColor : colors.white,
        paddingHorizontal : mvs(13),
        paddingVertical : mvs(13) 
    },
    input: {
        fontSize : mvs(15),
        fontFamily : fonts.carosSoftRegular,
        color : colors.headerTitle,
        padding : 0,
        minHeight : mvs(60),
        textAlignVertical : 'top',
        marginTop : mvs(6)
    },
    value: {
        fontSize : mvs(15),
        color : colors.headerTitle  
      },
})
