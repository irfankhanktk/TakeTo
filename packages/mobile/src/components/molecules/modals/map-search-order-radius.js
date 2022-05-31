import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Buttons from '../../atoms/Button';
import { MapSearchMakeOfferCard } from '../order_card/map-search/map-search-make-offer-card';

const MapSearchOrderRadiusModal = ({
    orders,
    setActiveItem,
    visible,
    loading,
    setVisible,
    onClose,
    onSlider,
    onValueChange,
    value,
    isLocalOrder,
    flatListRef,
    ...props }) => {

    let len = orders?.length || 0;
    let msg = len > 5 ? '5+' : len;
    const onViewRef = React.useRef((viewableItems) => {
        // console.log('item', viewableItems?.viewableItems[0].item)
     
            setActiveItem(viewableItems?.viewableItems[0].item);
    })
    const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 })
    const ref = React.useRef();
    console.log('ordersordersorders::::', orders);
    return (
        <View style={styles.CONTAINER}>
           
            <View style={{ ...styles.BOTTOM_CONTAINER, }}>
                {loading ?
                    <View style={{ height: mvs(147), justifyContent: 'center', alignItems: 'center' }}>
                        <Chase size={mvs(20)} color={colors.primary} />
                    </View> :
                    <FlatList
                        viewabilityConfig={viewConfigRef.current}
                        onViewableItemsChanged={onViewRef.current}
                        ref={flatListRef}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        pagingEnabled
                        data={orders}
                        renderItem={
                            ({ item, index }) =>
                                <MapSearchMakeOfferCard item={item} {...props} />
                        }
                        keyExtractor={(item, index) => index + ''}
                    />
                }
                <View style={styles.BUTTON_CONTAINER}>
                    <Buttons.ButtonPrimary disabled={loading || !len} onClick={onClose} style={styles.BUTTON_TXT} title={!loading&&!len?'No record found' :'Show all Orders'} />
                </View>
            </View>
        </View>
    );
};

export default MapSearchOrderRadiusModal
const styles = StyleSheet.create({
    CONTAINER: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    TXT: {
        fontSize: mvs(15),
        color: colors.white,
        alignSelf: 'center',
        marginTop: mvs(13),
        marginBottom: mvs(16),
    },
    TOP_CONTAINER: {
       
    },
    BOTTOM_CONTAINER: {
        paddingBottom: mvs(20),
        borderTopLeftRadius: mvs(20),
        borderTopRightRadius: mvs(20),
    },
    BUTTON_TXT: {
    },
    BUTTON_CONTAINER: {
        marginTop: mvs(30),
        marginHorizontal: mvs(20),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    SLIDER_CONTAINER: {
        marginTop: mvs(5),
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    DISTANCE_TXT: {
        fontSize: mvs(15),
        color: colors.headerTitle,
    },
    SLIDER: {
        width: mvs(202),
        height: mvs(18),
    },
    RADIUS_CONTROLLER: {
        flexDirection: 'row', width: '100%', justifyContent: 'space-between'
    }


});