import { StyleSheet } from "react-native";
import { mvs } from "../../../config/metrices";
import colors from './../../../config/colors';
import fonts from './../../../config/fonts';

export const OPTINPUT_STYLES = StyleSheet.create({
  // root: {},
  // title: { textAlign: 'center', fontSize: 30 },
  // // codeFieldRoot: {marginTop: 20},
  // cell: {
  //   width: WP(6),
  //   height: HP(4),
  //   //   lineHeight: 3,
  //   fontSize: fontSize.font20,
  //   fontFamily: 'Poppins-SemiBold',
  //   borderBottomWidth: 2,
  //   borderColor: palette.baseLine,
  //   textAlign: 'center',
  // },
  // focusCell: {
  //   borderColor: palette.blue,
  // },
  root: {},
  title: {
    textAlign: 'center', fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  codeFieldRoot: {
    // marginTop: 20,
    // width: 280,
    // marginLeft: 'auto',
    // marginRight: 'auto',
    alignItems:'center',
  },
  cellRoot: {
    width: mvs(40),
    height: mvs(54),
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.doted,
    borderWidth: 1,
    borderRadius:mvs(10)
  },
  cellText: {
    color: colors.primary,
    fontSize: mvs(20),
    textAlign: 'center',
  },
  focusCell: {
    borderColor: colors.primary,
    borderBottomWidth: 2,
  },
});