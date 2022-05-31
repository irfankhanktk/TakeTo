import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { mvs } from '../../../config/metrices';
import {GrayStar, YellowStar} from '../../../../resource/assets/profile';
import Regular from '../../../presentation/typography/regular-text';
import colors from '../../../config/colors';
const UserRating = ({fill=3,label='Communication',onPress,disabled}) => {
  return (
    <View style={styles.CONTAINER}>
      <Regular label={label} style={styles.LABEL} />
      <View style={{flexDirection:'row'}}>
      {
        [0,1,2,3,4].map((star,index)=>(<TouchableOpacity disabled={disabled} onPress={()=>onPress(index+1)} key={index} style={{marginRight:mvs(3)}}>
        {index<fill?  <YellowStar />:
          <GrayStar />}
        </TouchableOpacity>))
      }
      </View>
    </View>
  );
};
export default UserRating;
const styles = StyleSheet.create({
  CONTAINER: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom:mvs(10),
  },
  LABEL: {
    fontSize: mvs(13),
    color:colors.typeHeader,
  },
});
