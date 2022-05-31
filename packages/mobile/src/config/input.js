/**
 * @providesModule ButtonStyles
 */
import { StyleSheet } from 'react-native';
import colors from './colors';
import fonts from './fonts';
import {
  mvs
} from './metrices';

export const INPUT_STYLES = StyleSheet.create({
  LABLE_STYLE: {
    marginBottom:mvs(8),
    fontSize: mvs(15),
    color: colors.typeHeader,
  },
  INPUT_TXT: {
    color: colors.primary,
    width:'100%',
    paddingHorizontal: mvs(10),
    backgroundColor:colors.secondary,
    fontSize: mvs(15),
    fontFamily: fonts.carosSoftRegular,
    height: mvs(40),
    marginBottom: mvs(15),
    borderColor: colors.border,
    borderRadius:mvs(10)
    // borderBottomWidth: StyleSheet.hairlineWidth,
  },
  PRICE_CONTAINER: {
    width: mvs(161),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: mvs(20),
    backgroundColor: colors.secondary,
    borderRadius: mvs(10),
    // height:mvs(38),
  },
  PRICE_INPUT_TXT: {
    color: colors.headerTitle,
    paddingLeft: 0,
    height: mvs(40),
    fontSize: mvs(15),
    width:'70%',
    fontFamily: fonts.carosSoftRegular,
    borderColor: colors.headerTitle,
    // width: mvs(80),
    // borderBottomWidth: StyleSheet.hairlineWidth,
  },
  OTP: {
    backgroundColor: colors.secondary,
    height: mvs(38),
    borderRadius: mvs(10),
    paddingHorizontal: mvs(10),
    color: colors.headerTitle
  },
  SECONDARY_INPUT: {
    backgroundColor: colors.secondary,
    height: mvs(38),
    width: mvs(243),
    padding:0,
    borderRadius: mvs(10),
    paddingHorizontal: mvs(10),
    color: colors.primary
  },
  SEND_CODE: { position: 'absolute', right: mvs(0), top: mvs(10), color: colors.primary, textDecorationLine: 'underline', fontSize: mvs(13) },
  REVIEW_CONTAINER: {
    padding: mvs(15),
    backgroundColor: colors.secondary,
    borderRadius: mvs(15),
    maxHeight: mvs(100),
  },
  REVIEW_LABEL_CONTAINER: {
    backgroundColor: colors.white,
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: mvs(12),
    paddingHorizontal: mvs(35),
    paddingVertical: mvs(6),
  }
  // INPUT_CONTAINER: {
  //     // padding:0,
  //     height:mvs(55),
  //     backgroundColor:'gray',
  //     // marginBottom: scale(15),
  //     borderBottomWidth: StyleSheet.hairlineWidth,
  //     borderColor:colors.border,
  //     borderWidth:1
  // },
});
