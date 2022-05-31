import { StyleSheet } from "react-native";
import colors from "../../../config/colors";
import { mvs } from "../../../config/metrices";

export const styles = StyleSheet.create({
    CONTAINER: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      borderTopLeftRadius: mvs(20),
      borderTopRightRadius: mvs(20),
      backgroundColor: colors.primary,
    },
    HEADING_TXT: {
      fontSize: mvs(15),
      color: colors.white,
      alignSelf: 'center',
      marginTop: mvs(13),
      marginBottom: mvs(16),
    },
    RADIO_ROW: {
      flexDirection: 'row', marginBottom: mvs(8), justifyContent: 'space-between'
    },
    SUB_CONTAINER: {
      backgroundColor: colors.white,
      paddingTop: mvs(20),
      paddingBottom: mvs(38),
      paddingHorizontal: mvs(22),
      borderTopLeftRadius: mvs(20),
      borderTopRightRadius: mvs(20),
    },
    DESTINATION_CONTAINER: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: mvs(10),
    },
    BUTTON_CONTAINER: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    BUTTON: {
      width: '49%',
    },
    TRIP_TYPE_RADIO: {
      width: mvs(161),
    },
    RTL_ICON: {
      height: mvs(23),
      width: mvs(23),
    },
  
    DESTINATION_CONTAINER: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    FLAG_BUTTON: {
      width: '100%',
      height: mvs(38),
      flexDirection: 'row-reverse',
      backgroundColor: colors.secondary,
    },
    SEARCH_MAP: {
      marginTop: mvs(15),
      alignSelf: 'flex-end',
      width: mvs(161),
      height: mvs(38),
      flexDirection: 'row',
      backgroundColor: colors.primary,
      paddingHorizontal: mvs(23),
    },
    MAP_ICON: {
      height: mvs(18),
      width: mvs(14),
    },
    NO_DELIVERY_CONTAINER: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: StyleSheet.hairlineWidth,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: mvs(14),
      marginTop: mvs(15),
      borderColor: colors.filter_divider,
    },
    NoDelivery: {
      fontSize: mvs(15),
      color: colors.headerTitle,
    },
    PRICES_CONTAINER: {
      justifyContent: 'space-between',
    },
    PRICE_HEADING: {
      fontSize: mvs(15),
      color: colors.typeHeader,
      marginBottom: mvs(10),
    },
    MAX_MIN_PRICE: {
      // width: mvs(161),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    DIV: {
      marginTop: mvs(15),
      marginBottom: mvs(13),
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: colors.filter_divider,
    },
    DEL_TIME: {
      color: colors.typeHeader,
      fontSize: mvs(15),
      marginBottom: mvs(8),
    },
    RADIO_CONTAINER: {
      marginBottom: mvs(18),
    },
    RADIO_LABEL: {
      color: colors.headerTitle,
      fontSize: mvs(15),
    },
    BUTTON_CONTAINER: {
      marginTop: mvs(30),
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    BUTTON: {
      width: mvs(161),
    },
    buttonsContainer: {
      //height: mvs(44),
      paddingHorizontal: mvs(22),
      width: '100%',
      //borderWidth : 1,
      // marginTop: mvs(30),
      marginBottom: mvs(2),
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: mvs(20),
    },
    topButton: {
      height: mvs(52),
      width: '31%',
      // borderWidth: 1,
      borderRadius: mvs(10),
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      borderColor: colors.primary,
    },
  });
  