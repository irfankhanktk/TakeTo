import UI_API from '@khan_ahmad786/common/store/services';
import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import React from 'react';
import { Platform, ScrollView, TextInput, TouchableOpacity, View,Image } from 'react-native';
import Geocoder from 'react-native-geocoding';
import PhoneInput from 'react-native-phone-number-input';
import Icon from 'react-native-vector-icons/Ionicons';
import { RCross, Tick } from '../../../resource/assets/common-icons';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { INPUT_STYLES } from '../../config/input';
import { mvs } from '../../config/metrices';
import Medium from '../../presentation/typography/medium-text';
import Regular from '../../presentation/typography/regular-text';
import GoogleSearchBar from '../molecules/google-search-bar';
import { OtpInput } from '../molecules/otp-input/otp-input';
import Eye from './../../../resource/assets/common-icons/eye.svg';
import Buttons from './Button';

const CustomInput = ({
  label = '',
  value = '',
  editable = true,
  onChangeText,
  placeholder = '',
  secureTextEntry = false,
  secure = false,
  keyboardType = 'default',
  returnKeyType = 'default',
  isRequired = false,
  divider = false,
  isVerify = false,
  isReject = false,
  onPressIcon,
  labelStyle,
  containerStyle,
  onPress,
  disabled = true,
  style,
  DOB = false,
}) => {
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} style={[containerStyle]}>
      <Regular
        label={label}
        style={{ ...INPUT_STYLES.LABLE_STYLE, ...labelStyle }}
      >
        {isRequired && <Regular label={'*'} style={{ color: colors.mendatory }} />}
      </Regular>

      <>
        <TextInput
          value={value}
          onPressIn={onPress}
          disabled={disabled}
          secureTextEntry={secureTextEntry}
          onChangeText={onChangeText}
          editable={editable}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          placeholder={placeholder}
          placeholderTextColor={colors.input_placehoder}
          style={[
            {
              ...INPUT_STYLES.INPUT_TXT,
              ...style,
              paddingVertical: 0,
              paddingRight: mvs(
                secureTextEntry ? 60 : isVerify ? mvs(40) : mvs(10),
              ),
            },
            divider && { borderBottomWidth: 0 },
          ]}
        />

        <TouchableOpacity
          //disabled={!secureTextEntry}
          style={{
            position: 'absolute',
            right: mvs(10),
            bottom: mvs(23),
            flexDirection: 'row',
          }}
          onPress={onPressIcon}>
          {secure && (
            <Icon
              name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
              color={colors.typeHeader}
              size={mvs(22)}
            />
          )}
        </TouchableOpacity>

        <View
          style={{
            position: 'absolute',
            right: secure ? mvs(40) : mvs(10),
            bottom: mvs(29),
            flexDirection: 'row',
          }}>
          {isVerify ? (
            <Tick />
          ) : (
            isReject && <RCross width={mvs(15)} height={mvs(15)} />
          )}
        </View>
      </>
    </TouchableOpacity>
  );
};
const CustomInputWithButton = ({
  label = '',
  value = '',
  editable = true,
  onChangeText,
  placeholder = '',
  secureTextEntry = false,
  keyboardType = 'default',
  returnKeyType = 'default',
  isRequired = false,
  divider = false,
  isVerify = false,
  onPressVerify,
  labelStyle,
  style,
  DOB = false,
  emailVerifyLoader = false
}) => {
  return (
    <View style={{ ...style, marginBottom: mvs(15) }}>
      <Regular
        label={label}
        style={{ ...INPUT_STYLES.LABLE_STYLE, ...labelStyle }}
      >
        {isRequired && <Regular label={'*'} style={{ color: colors.mendatory }} />}
      </Regular>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TextInput
          value={value}
          secureTextEntry={secureTextEntry}
          onChangeText={onChangeText}
          editable={editable}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          placeholder={placeholder}
          placeholderTextColor={colors.input_placehoder}
          style={[
            {
              ...INPUT_STYLES.INPUT_TXT,
              marginBottom: mvs(0),
              ...style,
              width: isVerify ? '100%' : '77%',
            },
          ]}
        />

        {isVerify ? (
          <Tick style={{ position: 'absolute', right: mvs(10) }} />
        ) : value ? (
          <Buttons.ButtonPrimary
            loading={emailVerifyLoader}
            loaderColor={colors.white}
            disabled={emailVerifyLoader}
            onClick={onPressVerify}
            title={'Verify'}
            style={{ width: '20%', height: mvs(38) }}
          />
        ) : (
          <Buttons.ButtonPrimary
            textStyle={{ color: colors.doted }}
            disabled
            title={'Verify'}
            style={{
              width: '20%',
              height: mvs(38),
              backgroundColor: colors.secondary,
            }}
          />
        )}
      </View>
    </View>
  );
};
const PriceInput = ({
  label = '',
  value = '',
  editable = true,
  onChangeText,
  placeholder = '',
  secureTextEntry,
  keyboardType = 'numeric',
  returnKeyType = 'default',
  isRequired = false,
  divider = false,
  priceUnit = 'USD',
  style,
  containerStyle,
  unitStyle,
  maxLength = 9,
}) => {
  const [isVerify, setIsVerify] = React.useState(true);
  return (
    <View style={{ ...INPUT_STYLES.PRICE_CONTAINER, ...containerStyle }}>
      <TextInput
        value={value}
        maxLength={maxLength}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        // onChangeText={text => {
        //   // console.log('TAKE_TO_CONSTANT.floatValidation(text):',TAKE_TO_CONSTANT.floatValidation(text));
        //   //console.log('length:', text.split('.').length - 1);
        //   // if (text.length===0||TAKE_TO_CONSTANT.floatValidation(text)||(text.split('.').length-1)===1&&text[0]!=='.'&&text[text.length-1]==='.') {
        //   // //if (TAKE_TO_CONSTANT.floatValidation(text) || !text) {
        //   //    onChangeText(!text ? '0' : parseFloat(text).toString());
        //   // }
        // }}
        editable={editable}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        placeholder={placeholder}
        placeholderTextColor={colors.input_placehoder}
        style={[INPUT_STYLES.PRICE_INPUT_TXT, style, { paddingVertical: 0 }]}
      />
      <Medium
        label={priceUnit}
        style={{ color: colors.typeHeader, fontSize: mvs(15), ...unitStyle }}
      />
    </View>
  );
};
const SearchInput=({
  value,
  falg='',
  slug,
  onChangeText,
  is_full_address,
  ...props
})=>{
  return(
    <View style={{ width: '75%', height: mvs(40), }}>
    <View style={{ position: 'absolute', width: '100%', alignSelf: 'flex-end' }}>
      <GoogleSearchBar
        clear={!is_full_address}
        // autoCompleteRef={ref}
        countrySlug={slug||null}
        style={{paddingHorizontal: mvs(10) }}
        cross
        textInputContainer={{ backgroundColor: colors.secondary, borderRadius: 10, }}
        {...props}
        placeholderStyle={{placeholderTextColor:is_full_address?colors.primary:colors.lightgrey2}}
        placeholder={value?.slice(0,20)}
        inputStyle={{ color: colors.primary, paddingRight: mvs(30), }}
        onClick={() => {
          //  props?.navigation?.replace(isLocalOrder ? 'localtrip' : 'internationaltrip', { isFilter: true, isOnline: selected === 0, is_Map_screen: true })
        }}
        onPress={(data,details)=>{
          Geocoder.from(details?.geometry?.location?.lat, details?.geometry?.location?.lng)
               .then(json => {
                   var addressComponent = UI_API._returnAddress(json);
                  onChangeText(addressComponent);
               }).catch(error => {
                   alert(UI_API._returnError(error))
               })
        }}
      />
    </View>
    <View style={{height:mvs(40),width:30,alignSelf:'flex-end',marginRight:mvs(5),alignItems:'center',justifyContent:'center'}}>
      <Image style={{height:mvs(23),width:mvs(23),}} source={{uri:falg}}/>
      </View>
  </View>
  )
}
const InputSecondary = ({
  maxLength = 6,
  label = '',
  value = '',
  editable = true,
  onChangeText,
  placeholder = 'placeholder',
  placeholderColor = colors.input_placehoder,
  secureTextEntry = false,
  keyboardType = 'default',
  returnKeyType = 'default',
  isRequired = false,
  divider = false,
  containerStyle,
  style,
  verify = false,
  onPressIcon,
  codeText = false,
  onSendCode,
  emptySpace = false,
  onPress,
  disabled = true,
  labelStyle,
}) => {
  return (
    <View style={[{ marginBottom: mvs(18) }, containerStyle]}>
      <Regular
        label={label}
        style={{ color: colors.typeHeader, marginBottom: mvs(10), ...labelStyle }}
      >
        {isRequired && <Regular label={'*'} style={{ color: colors.mendatory }} />}
      </Regular>
      <TouchableOpacity style={{}} disabled={disabled} onPress={onPress}>
        <TextInput
          editable={editable}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={colors.input_placehoder}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          style={{ ...INPUT_STYLES.SECONDARY_INPUT, ...style }}
        />
        {emptySpace ? null : codeText ? (
          <Regular
            onPress={onSendCode}
            label={'Send code'}
            style={INPUT_STYLES.SEND_CODE}
          />
        ) : (
          <>
            {verify && (
              <Tick
                style={{
                  position: 'absolute',
                  right: mvs(25),
                  top: mvs(10),
                  color: colors.primary,
                  textDecorationLine: 'underline',
                  fontSize: mvs(13),
                  bottom: mvs(30),
                }}
              />
            )}
            {secureTextEntry && (
              <TouchableOpacity
                disabled={!secureTextEntry}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: mvs(10),
                  flexDirection: 'row',
                }}
                onPress={onPressIcon}>
                {secureTextEntry && <Eye height={mvs(20)} width={mvs(20)} />}
              </TouchableOpacity>
            )}
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const ReviewInput = ({
  maxLength = 200,
  label = 'Write a Review',
  value = '',
  editable = true,
  onChangeText,
  placeholder = '',
  secureTextEntry,
  keyboardType = 'default',
  returnKeyType = 'default',
  isRequired = false,
  style,
  containerStyle,
}) => {
  return (
    <View style={{ paddingTop: mvs(15) }}>
      <View style={[INPUT_STYLES.REVIEW_CONTAINER, containerStyle]}>
        <TextInput
          value={value}
          multiline
          editable={editable}
          returnKeyType={returnKeyType}
          numberOfLines={3}
          placeholder={placeholder}
          placeholderTextColor={colors.input_placehoder}
          onChangeText={onChangeText}
          maxLength={maxLength}
          keyboardType={keyboardType}
          textAlignVertical={'top'}
          style={{ paddingVertical: mvs(5),color:colors.typeHeader, ...style }}
        />
      </View>
      <View style={INPUT_STYLES.REVIEW_LABEL_CONTAINER}>
        <Regular
          label={label}
          style={{ fontSize: mvs(14), color: colors.typeHeader }}
        />
      </View>
    </View>
  );
};

const ViewReason = ({
  maxLength = 200,
  label = 'Write a Review',
  value = '',
  editable = true,
  onChangeText,
  placeholder = '',
  secureTextEntry,
  keyboardType = 'default',
  returnKeyType = 'default',
  isRequired = false,
  style,
  containerStyle,
}) => {
  return (
    <View style={{ paddingTop: mvs(15) }}>
      <View style={[INPUT_STYLES.REVIEW_CONTAINER, containerStyle]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Regular label={value} />
        </ScrollView>
      </View>
      <View style={INPUT_STYLES.REVIEW_LABEL_CONTAINER}>
        <Regular
          label={label}
          style={{ fontSize: mvs(14), color: colors.typeHeader }}
        />
      </View>
    </View>
  );
};
const PhoneInputComponent = ({
  phoneInput,
  defaultValue,
  value,
  placeholder = 'Phone Number',
  defaultCode = 'KW',
  layout = 'second',
  withDarkTheme = false,
  wrapperStyle = {},
  containerStyle = {},
  codeTextStyle = {},
  textInputStyle = {},
  onChangeFormattedText,
  onChangeText,
  disabled = false,
}) => {
  return (
    <View
      style={{
        // borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
        marginBottom: mvs(15),
        ...wrapperStyle,
      }}>
      <Regular label={placeholder} style={INPUT_STYLES.LABLE_STYLE} />
      <PhoneInput
        disabled={disabled}
        ref={phoneInput}
        // placeholder={placeholder}
        defaultValue={defaultValue}
        containerStyle={{ width: '100%', padding: 0, ...containerStyle }}
        textContainerStyle={{
          backgroundColor: colors.secondary,
          borderRadius: mvs(10),
          height: mvs(40),
        }}
        codeTextStyle={{
          color: colors.headerTitle,
          fontFamily: fonts.carosSoftRegular,
          fontSize: mvs(15),
          ...codeTextStyle,
        }}
        textInputStyle={{
          width: '100%',
          paddingHorizontal: mvs(10),
          borderRadius: mvs(10),
          height: mvs(40),
          color: colors.headerTitle,
          fontFamily: fonts.carosSoftRegular,
          fontSize: mvs(15),
          padding: 0,
          ...textInputStyle,
        }}
        textInputProps={{ keyboardType: 'phone-pad', placeholderTextColor : colors.input_placehoder }}
        defaultCode={defaultCode}
        layout={layout}
        onChangeText={onChangeText}
        onChangeFormattedText={onChangeFormattedText}
        value={value}
        withDarkTheme={withDarkTheme}
      />
    </View>
  );
};
const CustomOtpInput = ({ value, setValue }) => {
  return (
    <View style={{ height: mvs(85), marginTop: mvs(28), alignItems: 'center' }}>
      <Regular
        label={'Verification Code'}
        style={{ color: colors.lightgrey2, marginBottom: mvs(7) }}
      />
      <OtpInput value={value} setValue={setValue} />
    </View>
  );
};

export const TAKE_TO_INPUT_FIELD = {
  CustomInput,
  CustomInputWithButton,
  PriceInput,
  CustomOtpInput,
  PhoneInputComponent,
  ReviewInput,
  ViewReason,
  InputSecondary,
  SearchInput,
};
