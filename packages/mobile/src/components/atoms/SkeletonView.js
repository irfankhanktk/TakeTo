import React from 'react';
import { StyleSheet, View } from 'react-native';
import { mvs, width } from '../../config/metrices';
import colors from '../../config/colors';
const SkeletonView = ({ style, }) => {
  return (
    <View style={{
      height: mvs(240),
      width: width,
      paddingHorizontal: mvs(22),
      ...style
    }}>
      <View style={{
        height: '100%',
        width: '100%',
        backgroundColor: colors.secondary,
        borderRadius: mvs(20),
      }} />
    </View>
  );
};
export default SkeletonView;
const styles = StyleSheet.create({
  
});
