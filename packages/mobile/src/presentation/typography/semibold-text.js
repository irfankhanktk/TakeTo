import React from 'react';
import {StyleSheet, Text} from 'react-native';
import fonts from '../../config/fonts';

const SemiBold = (props) => {
  const {label,style}=props
  return <Text {...props} style={{...styles.label,...style}}>{label}</Text>;
};

export default SemiBold;

const styles = StyleSheet.create({
    label:{
        fontFamily:fonts.carosSoftMedium,
    }
});
