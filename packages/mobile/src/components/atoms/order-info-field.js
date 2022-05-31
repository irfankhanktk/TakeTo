import React from 'react';
import {StyleSheet, View} from 'react-native';
import colors from '../../config/colors';
import { mvs } from '../../config/metrices';
import Regular from '../../presentation/typography/regular-text';
export const InfoField = ({
    label = 'label',
    value = 'value',
    labelStyle,
    valueStyle,
    containerStyle,
  }) => (
    <View style={{...styles.FIELD_CONTAINER, ...containerStyle}}>
      <Regular label={label} style={{color: colors.label, ...labelStyle}} />
      <Regular
        label={value}
        style={{color: colors.headerTitle, ...valueStyle}}
      />
    </View>
  );
  const styles = StyleSheet.create({
    FIELD_CONTAINER: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: mvs(4),
      },
  });