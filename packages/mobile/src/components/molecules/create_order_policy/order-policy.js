import { flatMapDeep } from 'lodash'
import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { TAKE_TO_IMAGES } from '../../../../resource/assets/image_resouce'
import colors from '../../../config/colors'
import { mvs } from '../../../config/metrices';
import Light from '../../../presentation/typography/light-text'
import Medium from '../../../presentation/typography/medium-text'
import Regular from '../../../presentation/typography/regular-text'
import * as Images from './../../../../resource/assets/order-policy-icons'
const OrderPolicy = ({style, ...props }) => {
    const Guard = Images['guard']
    const Lock = Images['lock']
    const Check = Images['check']
    const Care = Images['care']
    const Visa = Images['visa']
    const Master = Images['master']
    const American = Images['amercian']
    const Knet = Images['knet']
    return (
        <View style = {{...styles.mainContainer , ...style}}>
          <View style = {styles.partnersContainer}>
             <Regular label = "Proud Partners" style = {styles.partnersContainerTitle}/> 
             <View style = {styles.partnersTagContainer}>
                 <Visa/>
                 <Master/>
                 <American/>
                 <Knet/>
             </View>
          </View>

          <View style = {styles.point1}>
            <View style = {{position:'absolute'}}>
              <Guard/>
            </View>
                 
            <View style = {styles.point1Inner}>
              <Regular label = '100% money back guarantee' style = {styles.point1Title}/> 
              <Regular label = 'Taketo protects your payment until you confirm the receipt of your order.' style = {styles.point1Detail}/>  
            </View>  
          </View>

          <View style = {styles.point2}>
            <View style = {{position:'absolute'}}>
              <Lock/>
            </View>

            <View style = {styles.point2Inner}>
              <Medium label = 'Secure payments' style = {styles.point2Title}/> 
              <Light label = 'Your payment is protected and never released to the traveler until you confirm delivery.' style = {styles.point2Detail}/>  
            </View>  
          </View>

          <View style = {[styles.point2, { marginTop : mvs(10)}]}>
            <View style = {{position:'absolute'}}>
              <Check/>
            </View>

            <View style = {{...styles.point2Inner,}}>
              <Medium label = 'Guaranteed delivery' style = {styles.point2Title}/> 
              <Light label = 'You are protected from start to finish. If there is an issue with your order, you will get 100% money back.' style = {styles.point2Detail}/>  
            </View>  
          </View>


          <View style = {[styles.point2, { marginTop : mvs(22),}]}>
            <View style = {{position:'absolute'}}>
              <Care/>
            </View>
            <View style = {styles.point2Inner}>
              <Medium label = '24/7 Customer care' style = {styles.point2Title}/> 
              <Light label = 'Customer support in your native language, within 24 hours.' style = {styles.point2Detail}/>  
            </View>  
          </View>


        </View>
    )
}

export default OrderPolicy

const styles = StyleSheet.create({
    mainContainer : {
        width : '100%',
        backgroundColor : colors.white,
        //borderWidth : 1,
        paddingHorizontal : mvs(22),
        paddingVertical : mvs(20)
    },
    partnersContainer: {
        //height : mvs(76),
        width : '100%',
        //borderWidth : 1,
       // marginTop : mvs(20),
        borderRadius : mvs(10),
        backgroundColor : colors.lightgrey,
        paddingLeft : mvs(10),
        paddingBottom : mvs(14)
    },
    partnersContainerTitle: {
        fontSize : mvs(12),
        color : colors.lightgrey1,
        marginTop : mvs(18)
    },
    partnersTagContainer: {
        marginTop : mvs(15),
        //height : mvs(16),
        width : '60%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        //borderWidth : 1
    },
    point1: {
        //height : mvs(39.4),
        width : '100%',
        //borderWidth:0.5,
        marginTop : mvs(10),
        flexDirection : 'row'
    },
    point1Inner: {
        //borderWidth:1,
        height : '100%',
        marginLeft:mvs(34),
    },
    point1Title: {
        fontSize : mvs(12),
        color : colors.green
    },
    point1Detail: {
        fontSize : mvs(12),
        color : colors.lightgrey1,
        marginTop : mvs(7),
    },
    point2: {
        //height : mvs(43),
        width : '100%',
        //borderWidth:0.5,
        marginTop : mvs(10),
        flexDirection : 'row'
    },
    point2Inner: {
        //borderWidth:1,
        height : '100%',
        marginLeft:mvs(34),
        //width : mvs(261)
    },
    point2Title: {
        fontSize : mvs(12),
        color : colors.headerTitle
    },
    point2Detail: {
        fontSize : mvs(12),
        color : colors.lightgrey1,
        marginTop : mvs(5)
    },
})
