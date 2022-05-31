import TAKE_2_API from '@khan_ahmad786/common/api/API';
import React from 'react';
import {
    ActivityIndicator,
    Animated,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import { connect } from 'react-redux';
import { cross_pink as Cross } from '../../../../../resource/assets/bank-info-icons';
import colors from '../../../../config/colors';
import { mvs, width } from '../../../../config/metrices';
import Medium from '../../../../presentation/typography/medium-text';
import Regular from '../../../../presentation/typography/regular-text';
import { Pagination } from '../../../atoms/pagination';
import ImagePlaceholder from '../../../atoms/Placeholder';

const DetailsImagesModal = ({
    disbaled = false,
    visible,
    onClose,
    list = [],
    onSubmit,
    activeCurrency,
}) => {
    const [scrollX, setScrollX] = React.useState(React.useRef(new Animated.Value(0)).current);

    React.useEffect(()=>{
        if(visible){
            setScrollX(new Animated.Value(0));
        }
    },[visible])
    const onScrollEvent = scroll => {
        return Animated.event(
            [
                {
                    nativeEvent: {
                        contentOffset: { x: scroll },
                    },
                },
            ],
            {
                useNativeDriver: true,
            },
        );
    };
    const renderItem = ({ item, index }) => {

        return (
            <View style={styles.SUB_CONTAINER}>

                <View style={{
                    backgroundColor: colors.white, borderRadius: mvs(20),
                    paddingHorizontal: mvs(45),
                    paddingVertical: mvs(48),
                }}>
                    <ImagePlaceholder bg_img={item} containerStyle={{ height: mvs(312), width: mvs(239) }} />
                    <TouchableOpacity style={{
                        position: 'absolute', right: mvs(10), top: mvs(10),
                        justifyContent: 'center', alignItems: 'center',
                        height: mvs(30), width: mvs(30),
                        ...colors.shadow, backgroundColor: colors.white, borderRadius: mvs(15)
                    }}
                        onPress={() => onClose(false)}>
                        <Cross height={mvs(10)} width={mvs(10)} />
                    </TouchableOpacity>
                </View>

            </View>
        );
    };
    return (
        <ReactNativeModal
            onBackdropPress={() => onClose(false)}
            isVisible={visible}
            style={{ margin: 0, padding: 0, width: width }}
            onBackButtonPress={() => onClose(false)}>
            <View style={styles.CONTAINER}>

                <Animated.FlatList
                    contentContainerStyle={{ alignItems: 'center' }}
                    horizontal
                    data={list}
                    maxToRenderPerBatch={5}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    windowSize={8}
                    onScroll={onScrollEvent(scrollX)}
                    horizontal
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                />
                <Pagination
                    list={list}
                    scrollX={scrollX}
                    style={styles.PAGINATION}
                    dotStyle={{ backgroundColor: colors.white }}
                />

            </View>
        </ReactNativeModal>
    );
};



export default DetailsImagesModal;

const styles = StyleSheet.create({
    CONTAINER: {
        width: '100%',

        borderRadius: mvs(20),
        // alignItems:'center',
        // backgroundColor: colors.pink,

        // paddingHorizontal: mvs(22),
    },
    PAGINATION: {
        bottom: mvs(-20),
    },
    HEADING_TXT: {
        fontSize: mvs(15),
        color: colors.white,
        alignSelf: 'center',
        marginTop: mvs(13),
        marginBottom: mvs(16),
    },
    SUB_CONTAINER: {
        // alignSelf:'center',
        width: width,
        backgroundColor: 'transparent',
        alignItems: 'center',

        borderRadius: mvs(20),
        // paddingHorizontal: mvs(45),
        // paddingVertical: mvs(48),
    },
    ITEM: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: colors.gray,
        justifyContent: 'space-between',
        paddingVertical: mvs(10),
        paddingHorizontal: mvs(20),
        borderRadius: mvs(10),
    },
});
