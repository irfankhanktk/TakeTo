import moment from 'moment';
import React from 'react';
import {Image, StyleSheet, View, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import {TAKE_TO_IMAGES} from '../../../../resource/assets/image_resouce';
import colors from '../../../config/colors';
import {ms, mvs, scale, vs, xdHeight} from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';
import ImagePlaceholder from '../../atoms/Placeholder';
import Back from './../../../../resource/assets/headers-icons/back.svg';
const Header = ({
  navigation,
  route,
  title = 'Home',
  allowBackBtn = false,
  avatarCreatedAt = false,
  createdAt = false,
  avatar = false,
  profile_picture
}) => {
  // console.log( "Math.round((151/812)*100) ",Math.round((Math.round((151/812)*100)*height)/100))
  // console.log("xdHeight(151) : ",xdHeight(151))
  // console.log("mvs(xdHeight(151)) : ",mvs(xdHeight(151)))
  return (
    <View style={styles.CONTAINER}>
      <View
        style={{
          position: 'absolute',
          top: vs(45),
          left: mvs(22),
        }}>
        {allowBackBtn && <Back onPress={() => navigation.pop()} />}
      </View>
      {!allowBackBtn && <Regular label={title} style={styles.TITLE} />}
      <View style={{}}>{/* <User /> */}</View>
 

      {avatarCreatedAt && (
        <View style={styles.userContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('userprofile');
            }}
            style={{paddingRight: mvs(10)}}>
              <ImagePlaceholder bg_img={profile_picture} containerStyle={styles.dp}/>
          </TouchableOpacity>
          <View style={styles.userInfoContainer}>
            <Regular label="Ralph Wakim" style={styles.username} />
            <Regular
              label={`Joined on ${moment('2021-11-19T06:57:39.595Z').format(
                'DD MMMM YYYY',
              )}`}
              style={styles.joinDate}
            />
          </View>
        </View>
      )}
      {createdAt && (
        <View style={styles.userContainer}>
          <View style={styles.userInfoContainer}>
            <Regular label="Ralph Wakim" style={styles.username} />
            <Regular
              label={`Joined on ${moment('2021-11-19T06:57:39.595Z').format(
                'DD MMMM YYYY',
              )}`}
              style={styles.joinDate}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const mapStateToProps=state=>{
  return{
    profile_picture: state.auth.userInfo?.profile?.profile_picture||""
  }
}
export default connect(mapStateToProps,{})(Header);

const styles = StyleSheet.create({
  CONTAINER: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    height: mvs(151),
    marginBottom: 1,
    paddingHorizontal: mvs(22),
    borderBottomLeftRadius: mvs(20),
    borderBottomRightRadius: mvs(20),
    // ...colors.shadow
  },
  TITLE: {
    fontSize: ms(34),
    color: colors.headerTitle,
  },
  AVATAR: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: vs(130),
    width: vs(130),
    borderRadius: vs(65),
    backgroundColor: colors.white,
    bottom: vs(-75),
    zIndex: 1001,
    ...colors.shadow,
  },
  AVATAR_PROFILE: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: mvs(124),
    width: mvs(124),
    borderRadius: mvs(65),
    backgroundColor: colors.white,
    bottom: mvs(-65),
    right: mvs(41),
    zIndex: 1001,
    ...colors.shadow,
    overflow: 'hidden',
  },
  userContainer: {
    height: mvs(55),
    width: mvs(255),
    //borderWidth : 1,
    position: 'absolute',
    left: mvs(22),
    bottom: mvs(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  dp: {
    height: mvs(55),

    width: mvs(55),
    borderRadius: mvs(55 / 2),
  },
  userInfoContainer: {
    //borderWidth:1,
    height: '100%',
    flex: 1,
    // paddingLeft : mvs(10),
    justifyContent: 'center',
  },
  username: {
    fontSize: mvs(15),
    color: colors.input_label,
  },
  joinDate: {
    fontSize: mvs(10),
    color: colors.headerTitle,
    marginTop: mvs(3),
  },
});
