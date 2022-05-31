import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';

const DualText = ({content, highlightText,onPress,style,highlightTextStyle, ...props}) => {
  return (
    <>
      <Regular style={{...styles.CARD_LABEL,...style}} label={content}>
        <Regular 
        onPress={onPress}  
        style={{...styles.TAKE_TO_LABEL,...highlightTextStyle}} 
        label={highlightText} />
        {props.children}
      </Regular>
    </>
  );
};

export default DualText;

const styles = StyleSheet.create({
  CARD_LABEL: {
    color: colors.label,
    fontSize: mvs(12),
  },

  TAKE_TO_LABEL: {color: colors.primary, fontSize: mvs(12)},
});
