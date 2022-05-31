import React from 'react'
import { StyleSheet, Text, View, ImageBackground, Image } from 'react-native'
import { TAKE_TO_IMAGES } from '../../../../resource/assets/image_resouce'
import colors from '../../../config/colors'
import { mvs } from '../../../config/metrices'
import Regular from '../../../presentation/typography/regular-text'

const CountryPicker = ({flag , style,textStyle, title = "Lebanon", flagSource = TAKE_TO_IMAGES.placeholder,...props}) => {
    return (
        <View style = {{...styles.mainContainer, ...style}}>
        <Regular label = {title} style = {{fontSize : mvs(15), color : colors.primary, ...textStyle}}/>
        {flag && <ImageBackground
            source = {flagSource}
            style = {styles.flag}
            >
            <Image
            source = {TAKE_TO_IMAGES.flag1}
            style = {{height : '100%', width : '100%'}}
            />    
            </ImageBackground> }
        </View>    
    )
}

export default CountryPicker

const styles = StyleSheet.create({
    mainContainer: {
        height : mvs(38),
        width : "49%",
        borderRadius : mvs(10),
        backgroundColor : colors.secondary,
        justifyContent : 'center',
        paddingHorizontal : mvs(10),
        //paddingVertical : mvs(14)
    },
    flag: {
        height : mvs(23),
        width : mvs(23),
        borderRadius : mvs(23/2),
        position : 'absolute',
        right : mvs(10),
        overflow : 'hidden'
    },
})
