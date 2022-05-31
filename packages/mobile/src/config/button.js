/**
* @providesModule ButtonStyles
*/
import { StyleSheet } from 'react-native';
import { px2dp } from 'react-native-style-adaptive';
import colors from './colors';

import { ms, mvs, scale, xdHeight } from './metrices';

export const buttonStyles = StyleSheet.create({
  buttonPrimary: {
    height: mvs(52),
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:colors.primary,
    borderRadius: mvs(10),
    width:'100%'
  },
  buttonOutline: {
    height: mvs(52),
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:colors.white,
    borderRadius: mvs(10),
    width:'100%',
    borderWidth:StyleSheet.hairlineWidth,
    borderColor:colors.doted
  },
  buttonOutlineDark: {
   
    borderColor: colors.white
  },
  buttonOutlineWhite: {
    height: mvs(52),
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:colors.white,
    borderRadius: mvs(10),
    width:'100%'
  },
  buttonFull: {
    width: '100%',
    marginLeft: 0,
    marginRight: 0
  },
  buttonRTL: {
    flexDirection:'row',
    paddingHorizontal:mvs(10),
    justifyContent:'space-between',
    height: mvs(52),
    alignItems:'center',
    backgroundColor:colors.primary,
    borderRadius: mvs(10),
    // width:'100%'
  },
  buttonLoc: {
    flexDirection:'row',
    paddingHorizontal:mvs(10),
    justifyContent:'space-between',
    height: mvs(38),
    alignItems:'center',
    backgroundColor:colors.secondary,
    borderRadius: mvs(10),
  },
  buttonCard:{
    backgroundColor:colors.white,
    height:mvs(52),
    width:mvs(69),
    justifyContent:'center',
    alignItems:'center',
    borderWidth:StyleSheet.hairlineWidth,
    borderRadius:mvs(10)
  },
  buttonDelvieryLoc:{
   flexDirection:'row',
   alignItems:'center',
   justifyContent:'space-between',
  },
  buttonDelvieryLocSub:{
    flexDirection:'row',
    alignItems:'center',
   }
  // buttonPrimary: {
  //   height: 42,
  //   borderRadius: 3
  // },
  // OUTLINE: {
  //   appearance:'outline',
  // },
  // buttonOutlineDark: {
  //   ...buttonOutline,
  //   borderColor: colors.white
  // },
  // buttonOutlineWhite: {
  //   ...buttonOutline,
  //   borderColor: colors.white
  // },
  // buttonFull: {
  //   width: '100%',
  //   marginLeft: 0,
  //   marginRight: 0
  // }
});

export default buttonStyles