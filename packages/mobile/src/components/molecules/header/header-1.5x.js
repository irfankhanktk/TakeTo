import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import { connect } from 'react-redux';
import {TAKE_TO_IMAGES} from '../../../../resource/assets/image_resouce';
import Inbox from '../../../../resource/assets/tabbar-icons/inbox.svg';
import colors from '../../../config/colors';
import {ms, mvs, scale, vs} from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';
import ImagePlaceholder from '../../atoms/Placeholder';
import Back from './../../../../resource/assets/headers-icons/back.svg';
import User from './../../../../resource/assets/headers-icons/user.svg';
const Header = ({
  navigation,
  route,
  title = 'Home',
  allowBackBtn = false,
  spacebetween = false,
  avatar = false,
  chat = false,
  profile_picture
}) => {
  return (
    <View style={styles.CONTAINER}>
      {allowBackBtn && (
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Back />
          </TouchableOpacity>
        </View>
      )}

      <View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            // width:'100%',
            position: 'absolute',
            bottom: mvs(40),
            left: allowBackBtn?mvs(59):mvs(30),
            //borderWidth:1
          },
          !allowBackBtn && {
            alignSelf: 'center',
            width:'100%',
          },
        ]}>
        <View style={styles.AVATAR}>
          <ImagePlaceholder
            bg_img={profile_picture}
            containerStyle={{height: '100%', width: '100%'}}
          />
        </View>
        <Regular
          label={title}
          style={styles.TITLE}
        />
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: mvs(53),
    backgroundColor: colors.white,
    height: mvs(103),
    paddingHorizontal: mvs(22),
    borderBottomLeftRadius: mvs(20),
    borderBottomRightRadius: mvs(20),
    // ...colors.shadow
  },
  TITLE: {
    fontSize: ms(18),
    color: colors.typeHeader,
    marginLeft: mvs(12),
  },
  AVATAR: {
    height: mvs(30),
    width: mvs(30),
    // top: mvs(4),
    borderRadius: mvs(5),
    overflow: 'hidden',
  },
});
