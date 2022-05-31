import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../../../config/colors';
import {mvs} from '../../../config/metrices';
import {TAKE_TO_INPUT_FIELD} from '../../atoms';
const CustomPhoneInput = ({
  phone,
  defaultCode,
  setPhone,
  label = 'New Phone Number',
  phoneRef,
}) => {

  return (
    <View style={styles.PHONE_CONTAINER}>
      <View style={{width: '100%'}}>
        <TAKE_TO_INPUT_FIELD.PhoneInputComponent
          phoneInput={phoneRef}
          value={phone}
          defaultValue={phone}
          placeholder={label}
          defaultCode={defaultCode}
          layout={'first'}
          textInputStyle={styles.PHONE_INPUT}
          codeTextStyle={{...styles.PHONE_INPUT, paddingTop: mvs(9.2)}}
          withDarkTheme={false}
          wrapperStyle={{borderColor: colors.white}}
          //containerStyle={{borderWidth:1}}
          //textInputStyle={{}}
          //  onChangeFormattedText={setPhone}
          onChangeText={setPhone}
        />
      </View>
    </View>
  );
};
export default CustomPhoneInput;

const styles = StyleSheet.create({
  PHONE_CONTAINER: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  PHONE_INPUT: {
    color: colors.primary,
    backgroundColor: colors.secondary,
    height: mvs(38),
    paddingHorizontal: mvs(10),
    borderRadius: mvs(10),
  },
});
