import moment from 'moment';
import React from 'react';
import {View, Text, StyleSheet, ImageBackground} from 'react-native';
import {BlueStar, StarTick} from '../../../../resource/assets/profile';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Medium from '../../../presentation/typography/medium-text';
import Regular from '../../../presentation/typography/regular-text';
import ImagePlaceholder from '../../atoms/Placeholder';
const UserInfo = (props) => {
  const {publicUserInfo}=props;
  const is_verified=(publicUserInfo?.is_email_verified || publicUserInfo?.is_mob_verified)?true:false;
  return (
    <View style={{...styles.ROW,paddingHorizontal:mvs(22)}}>
      <ImagePlaceholder resizeMode='contain' bg_img={publicUserInfo?.profile_picture} containerStyle={styles.IMG_CONTAINER} />
      <View style={styles.INFO_CONTAINER}>
        <View style={{...styles.ROW}}>
          <Regular label={publicUserInfo?.user_name} style={{...styles.NAME}} />
          <View style={styles.ROW}>
              <BlueStar height={mvs(19)} width={mvs(19)}/>
              <Medium label={publicUserInfo?.rating} style={{marginLeft:mvs(4),color:colors.typeHeader}}/>
          </View>
        </View>
        <Regular label={`Member since ${publicUserInfo?.member_since}`} style={{...styles.JOIN}} />
        <View
          style={{
            ...styles.ROW,
            marginTop: mvs(6),
            justifyContent: 'flex-start',
          }}>
          <Medium label={is_verified?'Verified User':'Un-Verified User'} style={styles.VERIFIED} />
          {is_verified&&<StarTick height={mvs(15)} width={mvs(15)} />}
        </View>
        <View style={{...styles.ROW, ...styles.SUCCESSFUL_CONTAINER}}>
          <Regular label={'Successful Deliveries'} style={{...styles.SUCCESSFUL}} />
          <Regular label={publicUserInfo?.successful_deliveries} style={{...styles.VAULE}} />
        </View>
        <View
          style={{
            ...styles.ROW,
            ...styles.SUCCESSFUL_CONTAINER,
            marginTop: 0,
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}>
          <Regular label={'Unsuccessful Deliveries'} style={{...styles.SUCCESSFUL,color:colors.pink}} />
          <Regular label={publicUserInfo?.unsuccessful_deliveries} style={{...styles.VAULE,color:colors.pink}} />
        </View>
      </View>
    </View>
  );
};
export default UserInfo;
const styles = StyleSheet.create({
  ROW: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  IMG_CONTAINER: {
    width: mvs(104),
    height: mvs(150),
    borderRadius: mvs(8),
    overflow: 'hidden',
  },
  NAME: {
    fontSize: mvs(18),
    color: colors.primary,
  },
  INFO_CONTAINER: {
    paddingTop: mvs(23),
    flex: 1,
    height: '100%',
    paddingHorizontal: mvs(9),
  },
  JOIN: {
    fontSize: 12,
    color:colors.typeHeader,
    paddingTop: mvs(3),
  },
  VERIFIED: {
    fontSize: mvs(10),
    marginRight: mvs(8),
    color: colors.primary,
  },
  SUCCESSFUL_CONTAINER: {
    borderColor: colors.price_border,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: mvs(10),
    paddingVertical: mvs(3),
  },
  SUCCESSFUL: {
    fontSize: mvs(15),
    color: colors.primary,

  },
  VAULE: {
    fontSize: mvs(15),
    color: colors.primary,
  },
});
