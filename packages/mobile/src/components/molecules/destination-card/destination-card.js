import React from "react"
import colors from "../../../config/colors"
import { mvs } from '../../../config/metrices';
import { xdHeight } from "../../../config/metrices"
import { Image, ImageBackground, StyleSheet, View, } from "react-native"
import Regular from "../../../presentation/typography/regular-text"
import Buttons from "../../atoms/Button"
const DestinationCard = ({isLocalOrders=true,item,onClick,...props}) => {
 
    return (
            <View
                style={styles.CONTAINER}
            >
                <View style = {{
                    flexDirection : 'row',
                    alignItems : 'center',
                    justifyContent:'space-between'
                }}>
                    <Regular numberOfLines={1} label={item.destination} style={{ color: colors.headerTitle }} />
                    <Regular label={`${item.total_orders} Orders`} style={styles.COUNTER} />
                </View>
                <ImageBackground style={styles.IMAGE_CONATINER}>
                    <Image  style={{ height: '100%', width: '100%' }} source={{uri:item.land_mark}}/>
                </ImageBackground>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                    <Regular label={'Rewards'} style={{ ...styles.REWARD, fontSize : mvs(12)}} />
                    <Regular label={`${item.total_reward}`} style={styles.REWARD} />
                </View>
                <Buttons.ButtonPrimary onClick={()=>props.navigation.navigate('browseOrders', {order:item,isLocalOrders})} title={'Browse Orders'} style={styles.BROWSE   }/>
            </View>
    )
}

export default DestinationCard;
const styles = StyleSheet.create({
    CONTAINER:{
        marginRight:mvs(15),
        width: mvs(260),
        paddingHorizontal: mvs(10),
        paddingVertical: mvs(15),
        // borderWidth: StyleSheet.hairlineWidth,
        backgroundColor: colors.secondary,
        borderRadius: mvs(20),
        borderColor: colors.border,
    },
    REWARD:{ color: colors.primary, marginTop: mvs(xdHeight(15)) },
    BROWSE :{marginTop:mvs(xdHeight(15)),height:mvs(xdHeight(38))},
    COUNTER:{ color: colors.primary, fontSize: mvs(12), marginTop: mvs(xdHeight(2)) },
    IMAGE_CONATINER:{ width: '100%', height: mvs(xdHeight(167)), backgroundColor: colors.black, borderRadius: mvs(10), overflow: 'hidden', marginTop: mvs(xdHeight(15)) }
});