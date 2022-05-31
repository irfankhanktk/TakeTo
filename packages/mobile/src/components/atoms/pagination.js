import React from 'react';
import {View, Text, StyleSheet, Animated, Dimensions} from 'react-native';
import colors from '../../config/colors';
import { mvs } from '../../config/metrices';
const {width, height} = Dimensions.get('window');
const DOT_SIZE =10;
const data=[0,1,2,3,4];
export const Pagination = ({scrollX,dotStyle,list=[0,1,2,3,4],style}) => {
    const inputRange = [-width, 0, width];
    const translateX = scrollX.interpolate({
      inputRange,
      outputRange: [-(DOT_SIZE + 10), 0, DOT_SIZE + 10],
    });
    return (
      <View style={[styles.pagination,style]}>
        <Animated.View
          style={[
            styles.paginationDot,
            {
              position: 'absolute',
              transform: [{translateX}],
              zIndex: 1001,
              backgroundColor: colors.primary,
              // right:10,
            },
          ]}
        />
        {list?.map((item, index) => {
          return (
            <View key={index} style={styles.paginationDotContainer}>
              <View style={[styles.paginationDot,dotStyle]} />
            </View>
          );
        })}
      </View>
    );
  };

  const styles = StyleSheet.create({
      
  pagination: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: mvs(13),
    flexDirection: 'row',
    height: DOT_SIZE,
  },
  paginationDot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.secondary,
  },
  paginationDotContainer: {
    marginRight: 10,
    width: DOT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationIndicator: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: 2,
    // borderColor: ,
    backgroundColor: colors.headerTitle,
  },
  });