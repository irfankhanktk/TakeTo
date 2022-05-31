import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import colors from '../../../config/colors'
import { mvs } from '../../../config/metrices'
import Regular from '../../../presentation/typography/regular-text'
import ImagePlaceholder from '../../atoms/Placeholder'

const PopularStores = ({ store_img, store_url, fav_icon, onPress,...props }) => {

    return (
        <TouchableOpacity
            onPress = {onPress}
            style={styles.store}
        >
            <ImagePlaceholder resizeMode='contain' bg_img={store_img} containerStyle={styles.storeImage} />

            <View style={styles.logo}>
                {/* <Apple fill = {colors.black}/> */}
                <Image resizeMode='cover' source={{ uri: fav_icon }} style={{ height: '100%', width: '100%' }} />
            </View>
            <Regular label={store_url} style={styles.storeName} />
        </TouchableOpacity>
    )
}

export default PopularStores

const styles = StyleSheet.create({
    store: {
        height: mvs(185),
        width: mvs(187),
        padding: mvs(10),
        borderWidth: 0.3,
        borderColor: '#707070',
        borderRadius: mvs(10)
    },
    storeImage: {
        height: mvs(140),
        width: '100%',
        borderRadius: mvs(10)
    },
    logo: {
        top: mvs(7),
        height: mvs(20),
        width: mvs(20),
        //borderWidth:1
    },
    storeName: {
        fontSize: mvs(10),
        color: colors.primary,
        position: 'absolute',
        bottom: mvs(10),
        right: mvs(10),
        //borderWidth:1
    }
})
