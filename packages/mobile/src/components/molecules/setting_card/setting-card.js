import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import { mvs } from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';
import DualText from '../dual-text/dual-text';

const CardHeading = ({heading = '', value = '', promotion, headingStyle, ...props}) => {
  return (
    <View>
      <Regular label={heading} style={{...styles.CARD_HEADING, ...headingStyle}} />
      {props.children}
    </View>
  );
};

const SettingCard = ({heading, content, highlightText, headingStyle,style, ...props}) => {
  return (
    <View style={{...styles.CARD, marginTop: mvs(0), ...style}}>
     {heading? <CardHeading  {...props} heading = {heading} headingStyle = {headingStyle}>
        {props.children}
      </CardHeading>
      :
      <>
      {props.children}
      </>
  }
    </View>
  );
};

export default SettingCard;

const styles = StyleSheet.create({
  CARD: {
    marginTop: mvs(20),
    paddingTop: mvs(20),
    paddingBottom: mvs(17),
    backgroundColor: colors.secondary,
    paddingHorizontal: mvs(20),
    borderRadius: mvs(10),
    width : '100%'
  },
  CARD_HEADING: {marginBottom: mvs(8), color: colors.typeHeader,},
  CARD_LABEL: {
    color: colors.label,
    fontSize: mvs(12),
    fontFamily: fonts.carosSoftRegular,
  },

  TAKE_TO_LABEL: {color: colors.primary, fontSize: mvs(12)},
});
