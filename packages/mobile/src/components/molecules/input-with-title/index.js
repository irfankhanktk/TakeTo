import React from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {TAKE_TO_IMAGES} from '../../../../resource/assets/image_resouce';
import colors from '../../../config/colors';
import {mvs} from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';
import * as SVGS from '../../../../resource/assets/order-car-icons';
import ImagePlaceholder from '../../atoms/Placeholder';
import DualText from '../dual-text/dual-text';
import { connect } from 'react-redux';

const InputWithTitle = ({
  style,
  textStyle,
  textStyle1,
  textStyle2,
  title,
  placeholder,
  value,
  value1,
  value2,
  editable,
  editable1,
  editable2,
  multiline = false,
  row = false,
  flag = false,
  countrypicker = false,
  double = false,
  half = false,
  singleInput = true,
  doubleInput = false,
  placeholder1,
  placeholder2,
  titleStyle,
  placeholderColor,
  flagStyle,
  calendar = false,
  tag = false,
  onIconPress,
  onPress,
  onChangeText,
  onChangeText1,
  onChangeText2,
  flagUri,
  maxLength = 200,
  onChange,
  moreOrLess = false,
  profileData,
  placeholderTextColor,
  isRequired,
  ...props
}) => {
  const Calender = SVGS['calendar'];
const [isFocus,setIsFocus]=React.useState(false)
  const [readMore, setReadMore] = React.useState(false);
  // alert(isFocus)
  return (
    <View
      style={{
        ...styles.mainContainer,
        alignItems: row ? 'center' : null,
        justifyContent: row ? 'space-between' : 'flex-start',
        alignItems: row ? 'center' : 'flex-start',
        flexDirection: row ? 'row' : 'column',
        ...style,
      }}>
      {title && (
        <Regular label={title} style={{...styles.title, ...titleStyle}} >
          {isRequired&&
           <Regular label={'*'} style={{color:colors.mendatory}} />
          }
          </Regular>
      )}

      {moreOrLess && (
        <View
          style={{
            ...styles.input,

            paddingBottom: mvs(10), // multiline ? mvs(23) : mvs(10),
            width: row ? '48%' : '100%',
            marginTop: row ? mvs(0) : mvs(10),
          }}>
          <DualText
            content={readMore ? value : value?.substring(0, 97)}
            style={{...textStyle, fontSize: mvs(13)}}
            highlightText={value?.length>97&&`${
              !readMore ? '... Read more' : ' Read less'
            }`}
            onPress={() => setReadMore(state => !state)}
            highlightTextStyle={{
              ...textStyle,
              fontSize: mvs(13),
              color: colors.headerTitle,
            }}
          />
        </View>
      )}
      {singleInput && (
        <TextInput
        onPressIn={onPress}
          style={{
            ...styles.input,

            paddingBottom: mvs(10), // multiline ? mvs(23) : mvs(10),
            width: row ? '48%' : '100%',
            marginTop: row ? mvs(0) : mvs(10),

            ...textStyle,
          }}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          multiline={multiline}
          onChangeText={onChangeText}
          onChange={onChange}
          value={value}
          editable={editable}
          onPress={onPress}
          maxLength={maxLength}
        />
      )}

      {doubleInput && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <TextInput
         
         
            style={{
              ...styles.input,
              paddingBottom: multiline ? mvs(23) : mvs(10),
              width: '48%',
              marginTop: row ? mvs(0) : mvs(10),
              ...textStyle1,
            }}
            placeholder={placeholder1}
            placeholderTextColor={placeholderTextColor}
            multiline={multiline}
            onChangeText={onChangeText1}
            value={value1}
            editable={editable1}
            maxLength={maxLength}
          />
          {!half && (
            <TextInput
           
          
              style={{
                ...styles.input,

                paddingBottom: multiline ? mvs(23) : mvs(10),
                width: '48%',
                marginTop: row ? mvs(0) : mvs(10),
                ...textStyle2,
              }}
              placeholder={placeholder2}
              multiline={multiline}
              onChangeText={onChangeText2}
              placeholderTextColor={placeholderTextColor}
              value={value2}
              editable={editable2}
              maxLength={maxLength}
            />
          )}
        </View>
      )}

      {flag && (
        <ImagePlaceholder
          bg_img={flagUri}
          containerStyle={{...styles.flag, ...flagStyle}}
        />
      )}

      {calendar && (
        <View
          style={{
            ...styles.flag,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Calender {...flagStyle} onPress={onIconPress} />
        </View>
      )}
      {tag && <Regular label={`${profileData?.currency?.currency_code}`} style={{...styles.tag, ...flagStyle}} />}
    </View>
  );
};

const mapStateToProps=state=>{
  return{
    profileData: state.auth.userInfo?.profile || {},
  }
}
export default connect(mapStateToProps,{})(InputWithTitle);

const styles = StyleSheet.create({
  mainContainer: {
    //flex : 1,
  },
  title: {
    fontSize: mvs(13),
    color: colors.headerTitle,
  },
  input: {
    width: '100%',
    borderRadius: mvs(10),
    backgroundColor: colors.secondary,
    padding: mvs(10),
    paddingBottom: mvs(23),
    color: colors.primary,
  },
  flag: {
    height: mvs(23),
    width: mvs(23),
    borderRadius: mvs(23 / 2),
    position: 'absolute',
    right: mvs(10),
    overflow: 'hidden',
  },
  tag: {
    position: 'absolute',
    right: mvs(10),
  },
});
