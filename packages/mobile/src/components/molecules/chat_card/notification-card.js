import moment from 'moment';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';
import ImagePlaceholder from '../../atoms/Placeholder';

const NotificationCard = ({
  user_img,
  user_name,
  message,
  time,
  counter,
  onPress,
  langauge,
  ...props
}) => {
  return (
    <View>
      <TouchableOpacity onPress={onPress} style={[styles.container, { borderWidth: counter > 0 ? 0 : StyleSheet.hairlineWidth, borderColor: colors.lightgrey2, backgroundColor: counter > 0 ? colors.secondary : colors.white, }]}>
        <ImagePlaceholder bg_img={user_img} containerStyle={styles.dp} />
        <View style={[styles.innerContainer,]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
            <Regular label={user_name} style={[styles.name]} />
            <Regular label={moment(time).format('DD / MM / YYYY')} style={styles.time} />
          </View>
         
         <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'}}>
        <View style={{width:'80%'}}>
        <Regular
            // numberOfLines={1}
            label={message}
            style={{
              ...styles.message,
            }}
          />
          </View>
          <Regular label={moment(time).format('hh:mm A')} style={{...styles.time,top:mvs(-5)}} />
           </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};


export const mapStateToProps = state => ({
  langauge: state.common?.langauge,
});

export const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(NotificationCard);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    marginBottom: mvs(15),
    padding: mvs(10),
    borderRadius: mvs(10),
  },
  dp: {
    height: mvs(46),
    width: mvs(50),
    borderRadius: mvs(8),
  },
  innerContainer: {
    flex: 1,
    marginLeft: mvs(10),
    // justifyContent: 'space-between',
  },
  name: {
    fontSize: mvs(15),
    color: colors.headerTitle,
  },
  message: {
    fontSize: mvs(13),
    color: colors.primary,
  },
  time: {
    fontSize: mvs(10),
    color: colors.message,
  },
  counterContainer: {
    height: mvs(21),
    width: mvs(21),
    borderRadius: mvs(21 / 2),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counter: {
    fontSize: mvs(12),
    color: colors.white,
  },
  line: {
    width: '81%',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.price_border,
    marginTop: mvs(15),
    alignSelf: 'flex-end',
  },
});
