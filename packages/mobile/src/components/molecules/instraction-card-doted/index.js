import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../../../config/colors';
import {mvs} from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';

const InstractionCard = ({title, detail, border = true, ...props}) => {
  return (
    <>
      <View style={styles.point} />
      <View style={{...styles.mainContainer, borderLeftWidth: border ? 0 : 0}}>
        <Regular label={title} style={styles.title} />
        <View style={styles.detailContainer}>
          <Regular label={detail} style={styles.detail} />
        </View>
        {border && <View style={styles.dotedLine} />}
      </View>
    </>
  );
};

export default InstractionCard;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.white,
    paddingLeft: mvs(20 + 5.5),
    // borderColor : colors.doted,
    borderLeftColor: colors.doted,
    borderStyle: 'dashed',
    //borderRadius: 1,
    // minHeight: mvs(78),
    // paddingBottom: mvs(49),
  },
  title: {
    fontSize: mvs(18),
    color: colors.primary,
    marginTop: -mvs(8),
  },
  detailContainer: {
    //borderWidth : 1,
    marginTop: mvs(10),
    marginBottom:mvs(30),
    paddingRight: mvs(20),
  },
  detail: {
    fontSize: mvs(12),
    color: colors.headerTitle,
  },
  point: {
    height: mvs(12),
    width: mvs(12),
    zIndex: 1001,
    borderRadius: mvs(6),
    backgroundColor: colors.primary,
    position: 'absolute',
    left: -mvs(5),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
  dotedLine: {
    borderWidth: StyleSheet.hairlineWidth,
    position: 'absolute',
    left: 0,
    zIndex: 1001,
    borderStyle: 'dashed',
    borderRadius: 0,
    height: '100%',
    borderColor: colors.doted,
  },
});
