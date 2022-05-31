import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { mvs, width } from '../../config/metrices';
import colors from '../../config/colors';
import { Chase } from 'react-native-animated-spinkit';

const PagingLoader = ({ style, }) => {
  return (
      <View style={styles.pageLoader}>
        <Chase size={mvs(30)} color={colors.primary} />
      </View>
    )
};
export default PagingLoader;
const styles = StyleSheet.create({
  pageLoader: {
    height: mvs(50),
    width: mvs(50),
    borderRadius: mvs(25),
    position: 'absolute',
    bottom: mvs(20),
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
