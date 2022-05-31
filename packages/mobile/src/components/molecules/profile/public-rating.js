import moment from 'moment';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { mvs } from '../../../config/metrices';
import { GrayStar, YellowStar } from '../../../../resource/assets/profile';
import colors from '../../../config/colors';
import Regular from '../../../presentation/typography/regular-text';
import ImagePlaceholder from '../../atoms/Placeholder';
const PublicRating = ({ rate_by_profile_picture, rate = 0, name = '', feedback = '', rate_created_at }) => {
  return (
    <View style={styles.CONTAINER}>
      <View style={styles.BACK_IMAGE}>
        {/* <View style={{width: '100%', height: '100%'}} /> */}
        <ImagePlaceholder bg_img={rate_by_profile_picture} containerStyle={{ width: '100%', height: '100%' }} />
      </View>
      <View style={{ flex: 1, marginLeft: mvs(15) }}>
        <View style={styles.ROW}>
          <Regular
            label={name}
            style={{ fontSize: mvs(10), color: colors.primary }}
          />
          <Regular label={moment(rate_created_at).format('YYYY-MM-DD hh:mm A')} style={{ fontSize: mvs(10), color: colors.primary }} />
        </View>
        <View style={{ ...styles.ROW, justifyContent: 'flex-start', marginTop: mvs(5.8) }}>
          {[0, 1, 2, 3, 4].map((star, index) => (
            <View key={index} style={{ marginRight: mvs(5) }}>
              {index < rate ? <YellowStar height={mvs(14)} width={mvs(14)} /> : <GrayStar height={mvs(14)} width={mvs(14)} />}
            </View>
          ))}
        </View>
        <Regular style={{ marginTop: mvs(11.5), fontSize: mvs(10), color: colors.typeHeader }} label={feedback} />
      </View>
    </View>
  );
};
export default PublicRating;
const styles = StyleSheet.create({
  CONTAINER: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: mvs(5),
    padding: mvs(13),
    backgroundColor: colors.secondary,
    borderTopEndRadius: mvs(10),
    borderTopStartRadius: mvs(20),
    borderBottomEndRadius: mvs(20),
    borderBottomStartRadius: mvs(10),
  },
  LABEL: {
    fontSize: mvs(13),
  },
  BACK_IMAGE: {
    backgroundColor: colors.black,
    height: mvs(65),
    width: mvs(65),
    borderRadius: mvs(20),
    overflow: 'hidden',
  },
  ROW: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
