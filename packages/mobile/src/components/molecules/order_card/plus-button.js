import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { mvs } from '../../../config/metrices';
import * as Images from '../../../../resource/assets/bank-info-icons'
import colors from '../../../config/colors'

const PlusButton = ({ onPress, style, ...props }) => {
    const Plus = Images['plus']
    return (
        <View style={{ ...style }}>
            <TouchableOpacity
                onPress={onPress}
                style={styles.plusButton}
            >
                <Plus />
            </TouchableOpacity>
        </View>
    )
}

export default PlusButton

const styles = StyleSheet.create({
    plusButton: {
        height: mvs(50),
        width: mvs(50),
        borderRadius: mvs(50 / 2),
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        // elevation : 3,
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 1,
        // },
        // shadowOpacity: 0.22,
        // shadowRadius: 2.22,
    }
})
