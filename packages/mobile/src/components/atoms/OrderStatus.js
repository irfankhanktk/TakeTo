import React from 'react';
import {StyleSheet, View} from 'react-native';
import colors from '../../config/colors';
import {mvs} from '../../config/metrices';
import Regular from '../../presentation/typography/regular-text';
const Dot = ({level = 0,color=colors.typeHeader}) => {
  // const color =
  //   level === 0
  //     ? colors.white
  //     : level === 1
  //     ? colors.disputes
  //     : level === 2
  //     ? colors.pink
  //     : colors.primary;
  const borderWidth = level === 0 ? 1 : 0;
  return (
    <View
      style={{backgroundColor: color, borderWidth: borderWidth, ...styles.DOT}}
    />
  );
};

const OrderStatus = ({label = 'Offer', level = 0}) => {
  const textColor =
    level === 0
      ? colors.typeHeader
      : level === 'disputed'
      ? colors.disputes
      : level === 'rejected'
      ? colors.pink
      : colors.primary;//this color is for completed

  const textDecorationLine = level === 'completed' ? 'line-through' : 'none';
  return (
    <View style={{width: '100%', alignItems: 'center'}}>
      <Dot level={level} color={textColor} />
      <Regular
        label={label?.split(' ')[0]}
        style={{
          fontSize: mvs(12),
          color: textColor,
          textDecorationLine: textDecorationLine,
          marginTop: mvs(7),
        }}
      />
      <Regular
        label={label?.split(' ')[1]}
        style={{
          fontSize: mvs(12),
          color: textColor,
          textDecorationLine: textDecorationLine,
        }}
      />
    </View>
  );
};
export default OrderStatus;
const styles = StyleSheet.create({
  ROW: {
    // flexDirection:'row',
    // justifyContent:'space-between',
    // alignItems:'center',
  },
  DOT: {
    marginTop: -mvs(5),
    height: mvs(12),
    width: mvs(12),
    borderColor: colors.price_border,
    borderRadius: mvs(6),
  },
});
