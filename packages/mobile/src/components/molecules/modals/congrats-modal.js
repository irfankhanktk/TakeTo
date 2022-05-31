import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import colors from '../../../config/colors';
import { mvs, width } from '../../../config/metrices';
import Medium from '../../../presentation/typography/medium-text';
import Regular from '../../../presentation/typography/regular-text';
import Buttons from '../../atoms/Button';
import { TAKE_TO_INPUT_FIELD } from '../../atoms';
import CustomRadio from '../../atoms/RadioButton';
import Back from '../../../../resource/assets/common-icons/back-white.svg';
import Calendar from '../calendar/calendar';
import ImagePlaceholder from '../../atoms/Placeholder';
import SettingCard from '../setting_card/setting-card';
import DualText from '../dual-text/dual-text';
import CustomSwitch from '../../atoms/Switch';
import { HeaderLogo } from '../../../../resource/assets/common-icons'

const CongratsModal = ({ visible, onClose, onApply,onChangeDMY, onPress, productName = "", image, onTerm,...props}) => {  
 

  return (
    <ReactNativeModal
      propagateSwipe
      isVisible={visible}
      avoidKeyboard
      onBackdropPress={() => onClose()}
      onBackButtonPress={() => onClose()}
      style={{ margin: 0}}>
        <View style={{...styles.SUB_CONTAINER, }}>
              <HeaderLogo style = {{alignSelf : 'center'}}/>
              <Regular label = "Congratulations" style = {styles.title}/>
              <Regular label = "Your order was successfully submitted," style = {styles.detail}/>
              <Regular label = "& your offers were requested." style = {{...styles.detail, marginTop : 0}}/> 
              <View style = {styles.imageContainer}>
                {/* <Image source = {TAKE_TO_IMAGES.chat_dp} style = {styles.image}/> */}
                <ImagePlaceholder
                bg_img = {image}
                containerStyle = {styles.image}
                />
              </View> 
              <View style = {{marginTop : mvs(10), paddingHorizontal : mvs(20)}}>
              <Regular 
              label = {productName} 
              style = {styles.productName}/>
              </View>
              

              {/* <SettingCard
              heading = {'Make sure your notifications are on'} 
              headingStyle = {{alignSelf : 'center'}}
              style={{marginTop : mvs(20)}}>
                    <DualText
                    style = {{alignSelf : 'center', fontSize : mvs(11), color : colors.lightgrey2}}
                    content={'You will be notified when you start receiving Offers'}
                    />
                    <CustomSwitch
                    value={payload.isOrderEmail}
                    label={'Email'}
                    onChange={v => setPayload({...payload, isOrderEmail: v})}
                    textStyle={{color : colors.primary}}
                    />
                    <CustomSwitch
                    style={{marginTop: mvs(28)}}
                    value={payload.isSms}
                    label={'SMS'}
                    onChange={v => setPayload({...payload, isSms: v})}
                    textStyle={{color : colors.primary}}
                    />
                </SettingCard> */}
              
              <View style = {styles.noteContainer}>
                 <DualText
                 style = {{
                    color : colors.headerTitle,
                    fontSize : mvs(12),
                    textAlign : 'center'
                 }}
                 content = {"By publishing my order, I agree to Taketo’s"}
                 highlightText = {" Terms of Use"}
                 onPress = {onTerm}
                 highlightTextStyle = {{
                     textDecorationLine : 'underline',
                     fontSize : mvs(12)
                    }}
                 >
                  <Regular 
                  style = {{
                    color : colors.headerTitle,
                    fontSize : mvs(12)
                 }}
                  label = ". I understand that if the product price is incorrect, my order may be canceled."/>   
                </DualText>   
              </View>

              <Buttons.ButtonPrimary
              onClick = {onPress}
              style = {styles.button}
              title = "Create a new Order"/>
        </View>
    </ReactNativeModal>
  );
};
export default CongratsModal;
const styles = StyleSheet.create({
  CONTAINER: {
    position: 'absolute',
    bottom: 0,
   // height : mvs(656),
    width: '100%',
    borderTopLeftRadius: mvs(20),
    borderTopRightRadius: mvs(20),
    backgroundColor: colors.white,
    paddingHorizontal : mvs(22),
    paddingTop : mvs(20)
  },
  HEADING_TXT: {
    fontSize: mvs(15),
    color: colors.white,
    alignSelf: 'center',
    marginTop: mvs(13),
    marginBottom: mvs(16),
  },
  SUB_CONTAINER: {
    position:'absolute',
    bottom:0,
    backgroundColor: colors.white,
    paddingVertical: mvs(15),
    paddingHorizontal: mvs(22),
    borderTopLeftRadius: mvs(20),
    borderTopRightRadius: mvs(20),
    alignSelf:'center',
    width:width
  },
  DESTINATION_CONTAINER: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  FLAG_BUTTON: {
    width: mvs(161),
    height: mvs(38),
    flexDirection: 'row-reverse',
    backgroundColor: colors.secondary,
  },
  SEARCH_MAP: {
    marginTop: mvs(15),
    alignSelf: 'flex-end',
    width: mvs(161),
    height: mvs(38),
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingHorizontal: mvs(23),
  },
  MAP_ICON: {
    height: mvs(18),
    width: mvs(14),
  },
  NO_DELIVERY_CONTAINER: {
    // borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: mvs(14),
    borderColor: colors.filter_divider,
  },
  NoDelivery: {
    fontSize: mvs(15),
    color: colors.headerTitle,
  },
  PRICES_CONTAINER: {
    marginTop: mvs(13),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  PRICE_HEADING: {
    fontSize: mvs(15),
    color: colors.primary,
    marginBottom: mvs(10),
  },
  MAX_MIN_PRICE: {
    width: mvs(161),
  },
  DIV: {
    marginTop: mvs(15),
    marginBottom: mvs(13),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.filter_divider,
  },
  DEL_TIME: {
    color: colors.primary,
    fontSize: mvs(15),
    marginBottom: mvs(8),
  },
  RADIO_CONTAINER: {
    marginBottom: mvs(30),
  },
  RADIO_LABEL: {
    color: colors.headerTitle,
    fontSize: mvs(15),
  },
  BUTTON_CONTAINER: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  BUTTON: {
    width: mvs(161),
  },
  BACK: { position: 'absolute', left: mvs(23), top: mvs(17) },
  mainContainer : {
    flex : 1,
    backgroundColor : colors.white
},
container: {
    flex : 1,
    paddingHorizontal : mvs(22)
},
imageContainer: {
    alignSelf : 'center',
    marginTop : mvs(19),
    height : mvs(125),
    width : mvs(104),
    borderWidth : 0.3,
    borderRadius : mvs(10),
    borderColor : colors.price_border,
    justifyContent : 'center',
    alignItems : 'center'
},
image: {
    height : mvs(98),
    width : mvs(75),
    borderRadius : mvs(10)
},
productName: {
    fontSize : mvs(18),
    color : colors.headerTitle,
    alignSelf : 'center',
    //marginTop : mvs(10),
    textAlign : 'center'
},
title: {
    fontSize : mvs(20),
    color : colors.primary,
    alignSelf : 'center',
    marginTop : mvs(24),
},
detail: {
    fontSize : mvs(13),
    color : colors.lightgrey2,
    alignSelf : 'center',
    marginTop : mvs(12),
},
noteContainer: {
    //borderWidth : 1,
    marginTop : mvs(20)
},
button: {
    marginTop : mvs(30),
    marginBottom : mvs(40),
    backgroundColor : colors.primary
},
});
