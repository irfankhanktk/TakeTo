import UI_API from '@khan_ahmad786/common/store/services';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { OnlineBlue, PhysicalBlue } from '../../../../../resource/assets/common-icons';
import colors from '../../../../config/colors';
import { mvs, width } from '../../../../config/metrices';
import Medium from '../../../../presentation/typography/medium-text';
import Regular from '../../../../presentation/typography/regular-text';
import ImagePlaceholder from '../../../atoms/Placeholder';
export const MapSearchMakeOfferCard = ({ item, ...props }) => {
    let dateColor = colors.pink;
    let days = UI_API._returnUrgencyTitle(
        item?.order_deliver_before,
    );
    if (!item?.is_urgent) {
        dateColor = colors.primary;
    }
    console.log('item:::::::::::',item);
    return (
        <TouchableOpacity onPress={() =>
            props.navigation.navigate('orderdetails', {
                isLocalOrder: !item?.is_international,
                orderType: 'normal',
                order_id: item?.order_id,
                order_data: item
            })
        } style={styles.CONTAINER}>
            <ImagePlaceholder containerStyle={styles.IMAGE_CONTAINER} bg_img={item?.order_image} />
            <View style={styles.DESCRIPTION_CONTAINER}>
                <Regular numberOfLines={1} style={styles.TIME} label={item?.order_created_at || item?.readable_created_at} />
                <Regular numberOfLines={1} style={{ ...styles.TODAY, color: dateColor }} label={days} />
                <View style={styles.PRICE_CONTAINER}>
                    <Regular numberOfLines={1} style={{ ...styles.TITLE, color: colors.typeHeader, }} label={item?.order_title} />
                    <View style={{ marginTop: mvs(5), flexDirection: 'row' }}>
                        {item?.order_site ?
                            <OnlineBlue width={mvs(8.75)} height={mvs(14)} />
                            :
                            <PhysicalBlue width={mvs(15.75)} height={mvs(14)} />
                        }
                        <Regular
                            numberOfLines={1}
                            //label={item?.order_site || shopName}\
                            label={item?.order_site ? 'Online Order' : 'Physical Order'}
                            style={{
                                ...styles.CARD_CONTENT_LABLE,
                                color: colors.primary,
                                marginLeft: mvs(7)
                            }}
                        />
                    </View>
                   
                </View>
                <View style={{...styles.PRICE_CONTAINER,justifyContent:'space-between',flexDirection:'row', borderTopWidth: 0}}>
                     <Regular style={{ ...styles.TITLE, }} label={'Price'} />
                 <Medium style={{ ...styles.TITLE, }} label={`${item?.order_price}`} />
                </View>
                <View style={styles.PENDING_REWARD_CONTAINER}>
                    <Regular style={{ ...styles.TITLE, color: colors.primary }} label={'Reward'} />
                    <Medium style={{ ...styles.TITLE,fontSize:mvs(18),color: colors.primary }} label={`${item?.order_reward_price}`} />
                </View>
            </View>
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    CONTAINER: {
        // flex: 1,
        width: width - mvs(40),
        marginHorizontal: mvs(20),
        flexDirection: 'row',
        backgroundColor: colors.white,
        padding: mvs(10),
        borderRadius: mvs(13),

    },
    CARD_CONTENT_LABLE: {
        fontSize: mvs(12),
        color: colors.headerTitle,
    },
    IMAGE_CONTAINER: {
        borderRadius: mvs(10),
        height: mvs(148),
        width: mvs(118),
        backgroundColor: colors.typeHeader,
        overflow: 'hidden',
    },
    TITLE: {
        fontSize: mvs(12),
        color: colors.typeHeader,
    },
    TIME: {
        fontSize: mvs(12),
        color: colors.timeAgo,
    },
    DESCRIPTION_CONTAINER: {
        marginLeft: mvs(18),
        flex: 1,
        // width:mvs(146),
    },
    PRICE_CONTAINER: {
        borderColor: colors.price_border,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        // flexDirection: 'row',
        // height:21,
        // justifyContent: 'space-between',
        paddingVertical: mvs(6),
    },
    PENDING_REWARD_CONTAINER: {
        marginTop: mvs(6),
        flexDirection: 'row',
        alignItems:'flex-end',
        justifyContent: 'space-between',
    },
    BUTTON_CONTAINER: {
        // marginTop: mvs(11),
        width: '100%',
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        // justifyContent:'cen'
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    TODAY: {
        fontSize: mvs(12),
        marginTop: mvs(4),
        color: colors.pink,
        marginBottom: mvs(7),
    },
    MAKE_OFFER: {
        width: mvs(93),
        height: mvs(31),
        backgroundColor: colors.primary
        // paddingHorizontal:mvs(12.5),
        // paddingVertical:mvs(8.5),
    }
});