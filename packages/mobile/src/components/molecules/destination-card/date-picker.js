import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
const DateTimePicker = ({
  isVisible = false,
  ...props
}) => {

  return (
    <View>
      <DateTimePickerModal
        {...props}
        isVisible={isVisible}
        
      />
    </View>
  );
};

export default DateTimePicker;

const styles = StyleSheet.create({});
