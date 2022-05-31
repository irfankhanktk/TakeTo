import React from "react"
import colors from "../../../config/colors"
import { mvs } from '../../../config/metrices';
import { xdHeight } from "../../../config/metrices"
import { Image, ImageBackground, StyleSheet, View, } from "react-native"
import Regular from "../../../presentation/typography/regular-text"
import Buttons from "../../atoms/Button"
import ImagePlaceholder from "../../atoms/Placeholder";
const HighestDestinationCard = ({onClick,isLocalOrders, item,...props}) => {
 
    return (
            <View
                style={styles.CONTAINER}
            >
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <Regular numberOfLines={1} label={`${item?.destination}`} style={{ color: colors.typeHeader }} />
                <Regular label={`${item?.total_orders} Orders`} style={styles.COUNTER} />
                </View>
                 <ImagePlaceholder 
                 bg_img = {item?.land_mark}
                 containerStyle={{...styles.IMAGE_CONATINER,}}/>
                 <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:'49%'}}>
                    <Regular label={'Rewards'} style={{ ...styles.REWARD, fontSize : mvs(12)}} />
                    <Regular label={`${item?.total_reward}`} style={styles.REWARD} />
                </View>
                <Buttons.ButtonPrimary 
                onClick={() => props.navigation.navigate('browseOrders', {order:item,isLocalOrders})} 
                title={'Browse Orders'} style={styles.BROWSE   }/>
                </View>
            </View>
    )
}

export default HighestDestinationCard;
const styles = StyleSheet.create({
    CONTAINER:{
        marginRight:mvs(15),
        width: '100%',
        paddingHorizontal: mvs(10),
        paddingVertical: mvs(15),
        // borderWidth: StyleSheet.hairlineWidth,
        backgroundColor: colors.secondary,
        borderRadius: mvs(20),
        borderColor: colors.border,
        marginBottom:mvs(20),
    },
    REWARD:{ color: colors.primary, marginTop: mvs(xdHeight(15)) },
    BROWSE :{marginTop:mvs(xdHeight(15)),width:'49%',height:mvs(38)},
    COUNTER:{ color: colors.primary, fontSize: mvs(15), },
    IMAGE_CONATINER:{width:'99.5%',height:mvs(167),marginTop:mvs(10),borderRadius:mvs(10)}
});