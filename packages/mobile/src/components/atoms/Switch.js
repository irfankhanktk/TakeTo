import React from 'react';
import {StyleSheet, View} from 'react-native';
import { mvs } from '../../config/metrices';
import colors from '../../config/colors';
import Regular from '../../presentation/typography/regular-text';
import ToggleSwitch from 'toggle-switch-react-native';
const CustomSwitch = ({style, size = "small", label, value = true, onChange, textStyle,disabled}) => {
  return (
    <View style={[styles.SWITCH_CONTAINER, style,{paddingVertical:mvs(2)}]}>
      <Regular label={label} style={{...styles.SWITCH_LABEL, ...textStyle}} />
      <ToggleSwitch
        disabled={disabled}
        isOn={value}
        thumbOnStyle={{backgroundColor: colors.primary}}
        thumbOffStyle={{backgroundColor: colors.toggleOff}}
        offColor={colors.white}
        size = {size}
        trackOnStyle={{backgroundColor:colors.white,borderWidth:StyleSheet.hairlineWidth,borderColor:colors.headerTitle}}
        trackOffStyle={{backgroundColor:colors.white,borderWidth:StyleSheet.hairlineWidth,borderColor:colors.headerTitle}}
        onToggle={onChange}
      />
    </View>
  );
};
export default CustomSwitch;
const styles = StyleSheet.create({
  SWITCH_CONTAINER: {
    marginTop: mvs(21),
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding : mvs(1)
  },
  SWITCH_LABEL: {color: colors.typeHeader},
});
