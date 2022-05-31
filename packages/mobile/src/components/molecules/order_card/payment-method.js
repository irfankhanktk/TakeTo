import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { mvs } from '../../../config/metrices';
import colors from '../../../config/colors'
import Regular from '../../../presentation/typography/regular-text'

const PaymentMethod = () => {
    const [radio, setRadio] = useState('online')
    return (
        <View style = {styles.mainContainer}>
            <Regular label = "Payment Method" style = {styles.heading}/>
            <View style = {styles.line}></View>
            <View style = {styles.radioContainer}>
               <TouchableOpacity 
               onPress = {() => setRadio('online')}
               style = {styles.radio}>
                   {radio == "online" && <View style = {styles.radioInner}></View>}
               </TouchableOpacity>
               <Regular label = "Online payment" style = {styles.radioTitle}/>
            </View>
            <View style = {{...styles.radioContainer, marginTop : mvs(5)}}>
               <TouchableOpacity 
               onPress = {() => setRadio('taketo')}
               style = {styles.radio}>
                   {radio != "online" && <View style = {styles.radioInner}></View>}
               </TouchableOpacity>
               <Regular label = "Taketo Balance" style = {styles.radioTitle}/>

               <View style = {styles.balanceContainer}>
                   <Regular label = "US$ 320" style = {styles.balance}/>
               </View>
            </View>
        </View>
    )
}

export default PaymentMethod

const styles = StyleSheet.create({
    mainContainer: {
        flex : 1,
        backgroundColor : colors.headerTitle,
        borderRadius : mvs(10),
        paddingHorizontal : mvs(10),
        paddingVertical : mvs(22),
    },
    heading: {
        fontSize : mvs(15),
        color : colors.white,
        alignSelf : 'center'
    },
    line: {
        borderBottomWidth : 0.3,
        borderColor : colors.price_border,
        marginTop : mvs(11)
    },
    radioContainer: {
        height : mvs(31),
        width : '100%',
        //borderWidth : 1,
        marginTop : mvs(13),
        flexDirection : 'row',
        alignItems : 'center'
    },
    radio: {
        height : mvs(15),
        width : mvs(15),
        borderRadius : mvs(15/2),
        backgroundColor : colors.white,
        justifyContent : 'center',
        alignItems : 'center'
    },
    radioInner: {
        height : mvs(9),
        width : mvs(9),
        borderRadius : mvs(9/2),
        backgroundColor : colors.headerTitle,
    },
    radioTitle: {
        fontSize : mvs(15),
        color : colors.white,
        marginLeft : mvs(10)
    },
    balanceContainer: {
        height : '100%',
        width : mvs(91),
        borderRadius : mvs(10),
        backgroundColor : colors.white,
        position : 'absolute',
        right : 0,
        justifyContent : 'center',
        paddingLeft : mvs(10)
    },
    balance: {
        fontSize : mvs(13),
        color : colors.headerTitle
    }
})
