import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import {
  Call,
  VideoCall,
  Option
} from '../../../../resource/assets/chat-options-modal-icons';
import { HeaderLogo, HeaderHomeLogo } from '../../../../resource/assets/common-icons';
import { TAKE_TO_IMAGES } from '../../../../resource/assets/image_resouce';
import Inbox from '../../../../resource/assets/tabbar-icons/inbox.svg';
import colors from '../../../config/colors';
import { ms, mvs, scale, vs } from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';
import ImagePlaceholder from '../../atoms/Placeholder';
import CalOptionsModal from '../modals/call-options-modal';
// import Back from './../../../../resource/assets/headers-icons/back.svg';
// import User from './../../../../resource/assets/headers-icons/user.svg';
import {
  bell as Bell,
  user as User,
  back as Back,
} from './../../../../resource/assets/headers-icons';
const Header = ({
  navigation,
  route,
  title = 'Home',
  allowBackBtn = false,
  spacebetween = false,
  avatar = false,
  chat = false,
  userIcon = true,
  bellIcon = false,
  headerLog = false,
  disputedDelivery = false,
  callIcons = false,
  isReject = false,
  style,
  profile_picture,
  isGuest,
  unread_notifications,
  onReject,
  onDispute,
  onPressOptions,
  is_chat_close,
  isShadow = true,
  option = false,
  children
}) => {
  const shadow = isShadow?{
    ...colors.shadow, elevation: 5, 
    borderBottomLeftRadius:  mvs(20) ,
    borderBottomRightRadius: mvs(20),
  }:{

  };

  return (
    <View style={[styles.CONTAINER, shadow, style]}>
      <View style={{}}>
        {allowBackBtn && (
          <View style={{ flexDirection: 'row',alignItems:'center',marginTop:mvs(-10) }}>
            <TouchableOpacity
              style={{ marginTop: mvs(2) }}
              onPress={() => {
                navigation.goBack();
              }}>
              <Back height={mvs(16)} width={mvs(16)} />
            </TouchableOpacity>
            {!spacebetween && (
              <View style={{ paddingLeft: scale(21.5), }}>
                <Regular
                  numberOfLines={1}
                  label={TAKE_TO_CONSTANT._returnHeaderTitle(title)}
                  style={styles.TITLE}
                />
              </View>
            )}
          </View>
        )}
        {console.log('title::', title)}
        {/* {headerLog && (
         <HeaderLogo height={mvs(30)} width={mvs(174)} style={{}} />
        )} */}
      </View>
      {headerLog && <View style={{ flex: 1, alignItems: 'center' }}><HeaderHomeLogo style={{}} /></View>}
      {!headerLog && spacebetween && (
        <View style={{}}>
          <Regular
            numberOfLines={1}
            label={TAKE_TO_CONSTANT._returnHeaderTitle(title)}
            style={styles.TITLE}
          />
        </View>
      )}
      <View style={{}}>
        {!isGuest && avatar ? (
          // <View style={styles.AVATAR}>
          //   <Image source={TAKE_TO_IMAGES.chat_dp} style={{ height: '100%', width: '100%', }} />
          // </View>
          <ImagePlaceholder
            bg_img={profile_picture}
            containerStyle={styles.AVATAR}
          />
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {chat && (
              <View style={{ paddingRight: mvs(30) }}>
                <Inbox
                  height={mvs(25)}
                  width={mvs(25)}
                  onPress={() => navigation.navigate('menu')}
                />
              </View>
            )}
            {bellIcon && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => navigation.navigate('notifications')}
                style={{
                  marginRight: mvs(!userIcon && bellIcon ? -15 : 24),
                  position: 'absolute',
                  right: mvs(15),
                }}>
                <Bell height={mvs(18)} width={mvs(16)} />
                {unread_notifications && (
                  <View
                    style={{
                      position: 'absolute',
                      right: mvs(0),
                      height: mvs(8),
                      width: mvs(8),
                      borderRadius: mvs(8 / 2),
                      backgroundColor: 'red',
                    }}
                  />
                )}
              </TouchableOpacity>
            )}
            {userIcon && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => navigation.navigate('menu')}>
                <User height={mvs(18)} width={mvs(16)} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      {console.log('is_chat_close::::', is_chat_close)}
      {callIcons ? (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <VideoCall style={{ marginRight: mvs(24) }} />
          <Call />
        </View>
      )
        :
        disputedDelivery ? (
          <View style={{ flexDirection: 'row' }}>
            <Regular
              onPress={onDispute}
              label={'Dispute'}
              style={{ color: colors.disputes, fontSize: mvs(13) }}
            />
            <TouchableOpacity disabled={is_chat_close} onPress={onPressOptions} >
              <Option
                height={mvs(18)}
                width={mvs(18)}
                style={{ marginLeft: mvs(10) }} />
            </TouchableOpacity>
          </View>
        )
          :
          (
            isReject && (
              <View style={{ flexDirection: 'row' }}>
                <Regular
                  // onPress={()=>alert('show kr modal bhai')}
                  label={'Reject Deal'}
                  style={{ color: colors.pink, fontSize: mvs(13) }}
                  onPress={onReject}
                />
                <TouchableOpacity  disabled={is_chat_close} onPress={onPressOptions} style={{ marginLeft: mvs(10) }} >
                  <Option
                    height={mvs(15)}
                    width={mvs(15)}
                   
                  />
                </TouchableOpacity>
              </View>
            )
          )}
      {!callIcons && !disputedDelivery && !isReject && option &&
        <TouchableOpacity disabled={is_chat_close} onPress={onPressOptions}>
          <Option
            height={mvs(15)}
            width={mvs(15)}
            style={{ marginLeft: mvs(10) }} />
        </TouchableOpacity>
      }
    </View>
  );
};

const mapStateToProps = state => {
  return {
    profile_picture: state.auth.userInfo?.profile?.profile_picture || '',
    unread_notifications: state.auth.userInfo?.unread_notifications,
    isGuest: state.auth.isGuest,
  };
};
export default connect(mapStateToProps, {})(Header);

const styles = StyleSheet.create({
  CONTAINER: {
    zIndex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingBottom: mvs(10),
    paddingTop: mvs(43),
    backgroundColor: colors.white,
    height: mvs(93), //vs(83),
    // marginBottom:mvs(2),
    paddingHorizontal: mvs(22),
    borderBottomLeftRadius: mvs(20),
    borderBottomRightRadius: mvs(20),
  },
  TITLE: {
    fontSize: mvs(15),
    color: colors.primary,
  },
  AVATAR: {
    height: mvs(30),
    width: mvs(30),
    bottom: mvs(0),
    borderRadius: mvs(5),
    overflow: 'hidden',
  },

});