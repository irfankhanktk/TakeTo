import React from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator, Image} from 'react-native';
import {CARD_ICONS} from '../../../resource/assets/balance-cards';
import SVGS from '../../../resource/assets/rtl-button-icons';
import buttonStyles from '../../config/button';
import colors from '../../config/colors';
import {mvs} from '../../config/metrices';
import Light from '../../presentation/typography/light-text';
import Regular from '../../presentation/typography/regular-text';
import ImagePlaceholder from './Placeholder';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Chase } from 'react-native-animated-spinkit'
const ButtonPrimary = ({
  title,
  loading = false,
  loaderColor = colors.white,
  onClick,
  style,
  textStyle,
  disabled,
  ...props
}) => {
  return (
    <TouchableOpacity
      {...props}
      style={{...buttonStyles.buttonPrimary, ...style}}
      disabled={disabled}
      onPress={() => onClick()}
      activeOpacity={0.5}>
      {loading ? (
        <Chase size={mvs(20)}  color={loaderColor || colors.white} />
      ) : (
        <Regular
          {...props}
          label={title}
          style={{color: colors.white, ...textStyle}}
        />
      )}
    </TouchableOpacity>
  );
};
const ButtonPrimaryCard = ({
  title,
  loading = false,
  loaderColor = colors.headerTitle,
  title1,
  onClick,
  style,
  textStyle,
  textStyle1,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={{...buttonStyles.buttonPrimary, ...style}}
      onPress={() => onClick()}
      activeOpacity={0.5}>
      {loading ? (
        <Chase size={mvs(20)} color={loaderColor || colors.white}  />
      ) : (
        <Regular
          {...props}
          label={title}
          style={{...textStyle, color: colors.white}}
        />
      )}
    </TouchableOpacity>
  );
};
const ButtonPrimaryLight = ({
  title,
  loading = false,
  loaderColor = colors.headerTitle,
  onClick,
  style,
  textStyle,
  disabled,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={{...buttonStyles.buttonPrimary, ...style}}
      onPress={() => onClick()}
      disabled={disabled}
      activeOpacity={0.5}>
      {loading ? (
        <Chase size={mvs(20)}  color={loaderColor || colors.white} />
      ) : (
        <Light
          {...props}
          label={title}
          style={{...textStyle, color: colors.white}}
        />
      )}
    </TouchableOpacity>
  );
};

const ButtonSeconday = ({
  title,
  loading = false,
  loaderColor = colors.headerTitle,
  onClick,
  style,
  textStyle,
  ...props
}) => {
  return (
    <TouchableOpacity
      {...props}
      style={{...buttonStyles.buttonOutlineWhite, ...style}}
      onPress={() => onClick()}
      activeOpacity={0.5}>
      {loading ? (
        <Chase size={mvs(20)} color={loaderColor || colors.white}  />
      ) : (
        <Regular
          numberOfLines={1}
          {...props}
          label={title}
          style={{color: colors.typeHeader, ...textStyle}}
        />
      )}
    </TouchableOpacity>
  );
};
const ButtonSecondayLight = (
  {title, loading, loaderColor = colors.headerTitle, onClick, style},
  props,
) => {
  return (
    <TouchableOpacity
      {...props}
      style={{...buttonStyles.buttonOutlineWhite, ...style}}
      onPress={() => onClick()}
      activeOpacity={0.5}>
      {loading ? (
        <Chase  size={mvs(20)} color={loaderColor || colors.white} />
      ) : (
        <Light {...props} label={title} style={{color: colors.typeHeader}} />
      )}
    </TouchableOpacity>
  );
};

const ButtonSecondaryOutline = ({
  title,
  loading = false,
  loaderColor = colors.primary,
  onClick,
  disabled,
  style,
  textStyle,
  ...props
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      {...props}
      style={{...buttonStyles.buttonOutline, ...style}}
      onPress={() => onClick()}
      activeOpacity={0.5}>
      {loading ? (
        <Chase size={mvs(20)} color={loaderColor || colors.white}  />
      ) : (
        <Regular
          {...props}
          label={title}
          style={{color: colors.typeHeader, ...textStyle}}
        />
      )}
    </TouchableOpacity>
  );
};
const ButtonRTL = ({
  title,
  loading = false,
  loaderColor = colors.headerTitle,
  showIcon = true,
  onClick,
  style,
  textStyle,
  iconName = 'flag',
  iconStyle = {height: mvs(20), width: mvs(20)},
  disabled = false,
  ...props
}) => {
  const Icon = SVGS[iconName];
  return (
    <TouchableOpacity
      {...props}
      style={{...buttonStyles.buttonRTL, ...style}}
      onPress={() => onClick()}
      activeOpacity={0.5}
      disabled={disabled}>
      {loading ? (
        <Chase  size={mvs(20)} color={loaderColor || colors.white} />
      ) : (
        <>
          {showIcon && (
            <Icon height={iconStyle.height} width={iconStyle.width} />
          )}
          <Regular
            numberOfLines={1}
            {...props}
            label={title}
            style={{...textStyle}}
          />
        </>
      )}
    </TouchableOpacity>
  );
};
const ButtonLocation = ({
  title,
  loading = false,
  loaderColor = colors.headerTitle,
  showIcon = true,
  onClick,
  style,
  textStyle,
  iconName = '',
  iconStyle = {height: mvs(20), width: mvs(20)},
  disabled = false,
  flagStyle,
  ...props
}) => {
  return (
    <TouchableOpacity
      {...props}
      style={{...buttonStyles.buttonLoc, ...style}}
      onPress={() => onClick()}
      activeOpacity={0.5}
      disabled={disabled}>
      <Regular
        numberOfLines={1}
        {...props}
        label={title}
        style={{...textStyle, flex: 1}}
      />
      <View style={{width: '7%',...flagStyle,marginRight:mvs(5)}}>
        {console.log('iconName::',iconName)}
        <Image source={{uri: iconName}}  style={{width: iconStyle.width, height: iconStyle.height}}/>
        {/* <ImagePlaceholder
          bg_img={iconName}
          containerStyle={{width: iconStyle.width, height: iconStyle.height}}
        /> */}
      </View>
    </TouchableOpacity>
  );
};
const ButtonBlanceCard = ({loading,iconName = 'visa', onClick, style}) => {
  const Icon = CARD_ICONS[iconName];
  return (
    <TouchableOpacity
      style={{...buttonStyles.buttonCard, ...style}}
      onPress={() => onClick()}
      activeOpacity={0.5}>
      {loading ? (
        <Chase color={loaderColor || colors.white} size={mvs(20)} />
      ) : (
        <Icon />
      )}
    </TouchableOpacity>
  );
};
const ButtonDeliveryLocation = ({
  title = '',
  subTitle = '',
  iconName = 'date',
  isTick = false,
  onClick,
  iconHeight = mvs(24.5),
  iconWidth = mvs(20),
  checkHeight = mvs(15),
  checkWidth = mvs(18.7),
  blue = false,
  titleStyle,
  style,
}) => {
  const Icon = SVGS[iconName];
  return (
    <TouchableOpacity
      style={{...buttonStyles.buttonDelvieryLoc, ...style}}
      onPress={() => onClick()}
      activeOpacity={0.5}>
      <View style={{...buttonStyles.buttonDelvieryLocSub}}>
        <Icon
          height={iconHeight}
          width={iconWidth}
          style={{marginRight: mvs(10)}}
        />
        <View style={{width:'90%'}}>
          <Regular
            label={title}
            style={{color: colors.typeHeader, fontSize: 15, ...titleStyle}}
          />
          <Regular
            label={subTitle}
            style={{color: colors.lightgrey2, fontSize: 10, marginTop: mvs(2)}}
          />
        </View>
      </View>
      {isTick &&
       <View style={{position:'absolute',right:mvs(5)}}>
          {blue ? (
          <SVGS.tickBlue height={checkHeight} width={checkWidth} />
        ) : (
          <SVGS.tick height={checkHeight} width={checkWidth} />
        )}
       </View>
       }
    </TouchableOpacity>
  );
};

const ButtonCamera = ({onClick, iconStyle, ...props}) => {
  return (
    <TouchableOpacity
      onPress={() => onClick()}
      activeOpacity={1}
      style={{
        position: 'absolute',
        top: mvs(105),
        alignSelf: 'center',
        zIndex: 1001,
        backgroundColor: colors.primary,
        ...colors.shadow,
        justifyContent: 'center',
        alignItems: 'center',
        padding: mvs(10),
        overflow: 'hidden',
        borderRadius: mvs(20),
        ...iconStyle,
      }}>
      <MaterialIcons name="add-a-photo" size={mvs(20)} color={colors.white} />
    </TouchableOpacity>
  );
};
const Buttons = {
  ButtonPrimary,
  ButtonPrimaryCard,
  ButtonPrimaryLight,
  ButtonSeconday,
  ButtonSecondaryOutline,
  ButtonRTL,
  ButtonSecondayLight,
  ButtonBlanceCard,
  ButtonDeliveryLocation,
  ButtonLocation,
  ButtonCamera
};
export default Buttons;
