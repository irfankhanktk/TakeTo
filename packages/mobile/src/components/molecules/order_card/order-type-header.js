import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import TAKE_TO_CONSTANT from '../../../../../common/utils/utils';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';
import Filter from './.././../../../resource/assets/common-icons/filter-icons.svg';
import Aeroplane from './.././../../../resource/assets/order-car-icons/aeroplane.svg';
import Car from './.././../../../resource/assets/order-car-icons/car.svg';
import Sort from './.././../../../resource/assets/common-icons/sort.svg';

const OrderTypeHeader = ({ title = '', seeMore = true, filter = false,isIcon=false,isLocal = true, containerStyle, style, onSort, sortIcon = false, ...props }) => {

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // paddingTop: mvs(30),
        paddingBottom: mvs(20),
        ...containerStyle,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
       {isIcon&&<>
        {isLocal ? <Car style={{ marginRight: mvs(10) }} />
          : <Aeroplane style={{ marginRight: mvs(10) }} />
        }
        </>}
        <Regular
          label={TAKE_TO_CONSTANT.convertCapitalizeFirst(title)}
          style={{ fontSize: mvs(20), color: colors.typeHeader, ...style }}
        />
      </View>
      {filter ? (
        <View style = {{flexDirection : 'row', alignItems:'center'}}>
        {sortIcon && <TouchableOpacity
        hitSlop={colors.hitSlop}
        onPress={onSort}
          style={{
            //backgroundColor:'red',
            height : mvs(15),
            justifyContent:'center',
            paddingHorizontal:mvs(5)
          }}>
            <Sort width = {mvs(28)} height = {mvs(7.77)}/>
        </TouchableOpacity>}
        <TouchableOpacity
          hitSlop={colors.hitSlop}
        {...props}
          style={{
            marginLeft : mvs(15)
          }}>
            <Filter/>
        </TouchableOpacity>
        </View>
      ) : (
      seeMore &&<TouchableOpacity
      hitSlop={colors.hitSlop}
        activeOpacity={0.5} {...props}>
        <Regular
         label={'See more'}
         style={{ fontSize: mvs(13), color: colors.primary, }}
       />
      </TouchableOpacity>
      )} 
    </View>
  );
};

export default OrderTypeHeader;

const styles = StyleSheet.create({});
