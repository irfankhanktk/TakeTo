import React from 'react'
import { Image, StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import { mvs } from '../../../config/metrices';
import { TAKE_TO_IMAGES } from '../../../../resource/assets/image_resouce'
import colors from '../../../config/colors'
import Regular from '../../../presentation/typography/regular-text'
import ImagePlaceholder from '../../atoms/Placeholder'
import Medium from '../../../presentation/typography/medium-text';
import DetailsImagesModal from '../modals/details-images-modal/details-images-modal';

const ProductInfo = ({order_img,name,order_gallery=[],disabled=true, total, reward, priceTitle="Total", detailsContainer, rewardTitle = "Reward",...props}) => {
    const [showImgsModal, setShowImgsModal] = React.useState(false);

    return (
        <View style = {styles.mainContainer}>
            <TouchableOpacity disabled={disabled} onPress={()=>setShowImgsModal(true)}  style = {styles.imageContainer}>
                <ImagePlaceholder bg_img={order_img} containerStyle={styles.image}/>
            </TouchableOpacity>
            <View style = {{...styles.detailsContainer, ...detailsContainer}}>
                <View style={{ paddingVertical : mvs(12)}}>
                  <Regular numberOfLines={2} label = {name} style = {styles.name}/>
                </View>
                <View style={{flex:1}}>
                <View style = {styles.totalContainer}>
                   <Regular label = {priceTitle} style = {styles.total}/> 
                   <Medium label = {total} style = {styles.totalValue}/>
                </View>
                <View style = {styles.rewardContainer}>
                   <Regular label = {rewardTitle} style = {styles.reward}/> 
                   <Medium label = {reward} style = {styles.rewardValue}/>
                </View>
                </View>
            </View>
            <DetailsImagesModal list={order_gallery} visible={showImgsModal} onClose={setShowImgsModal}/>

        </View>
    )
}

export default ProductInfo

const styles = StyleSheet.create({
    mainContainer: {
        flex : 1,
        // backgroundColor : colors.white,
        //paddingHorizontal : mvs(22),
       // height : mvs(125),
        width : '100%',
        //borderWidth:1,
        flexDirection : 'row',
        alignItems : 'center',
    },
    imageContainer: {
        height : '100%',
        width : mvs(104),
        borderRadius : mvs(10),
        borderWidth : 0.3,
        borderColor : colors.price_border,
        justifyContent : 'center',
        alignItems : 'center',
        paddingVertical : mvs(14)
    },
    image: {
        height : mvs(98),
        width : mvs(75),
        borderRadius : mvs(10)
    },
    detailsContainer: {
        flex : 1,
        // marginLeft : mvs(9),
        //borderWidth : 1,
        height : '100%',
        justifyContent : 'center',
        //backgroundColor:'lightblue'
    },
    name: {
        fontSize : mvs(18),
        color : colors.typeHeader,
        //marginTop : mvs(10)
    },
    totalContainer: {
        //marginTop : mvs(17),
        borderTopWidth : 0.5,
        borderBottomWidth : 0.5,
        borderColor : '#BBC0C3',
        paddingVertical : mvs(7),
        justifyContent : 'center',
        //backgroundColor:'red'
    },
    total: {
        fontSize : mvs(15),
        color : colors.typeHeader
    },
    totalValue: {
        fontSize : mvs(15),
        color : colors.typeHeader,
        position : 'absolute',
        right : mvs(0)
    },
    rewardContainer: {
        //borderWidth : 1,
        marginTop : mvs(13),
    },
    reward: {
        fontSize : mvs(15),
        color : colors.primary
    },
    rewardValue: {
        fontSize : mvs(18),
        color : colors.primary,
        position : 'absolute',
        right : mvs(0)
    }
})
