import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import {mvs} from '../../config/metrices';

const Regular = ({label, numberOfLines = 100, style, ...props}) => {
  // const {label,style}=props
  return (
    <Text
      numberOfLines={numberOfLines}
      {...props}
      style={{...styles.label, ...style}}>
      {label}
      {props.children}
    </Text>
  );
};

export default Regular;

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.carosSoftRegular,
    fontSize: mvs(15),
    color: colors.headerTitle, //default color
  },
});
