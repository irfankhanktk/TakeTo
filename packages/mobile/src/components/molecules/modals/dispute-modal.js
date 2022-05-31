import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import { TAKE_TO_IMAGES } from '../../../../resource/assets/image_resouce';
import colors from '../../../config/colors';
import fonts from '../../../config/fonts';
import { mvs, ms } from '../../../config/metrices';
import Medium from '../../../presentation/typography/medium-text';
import Regular from '../../../presentation/typography/regular-text';
import { TAKE_TO_INPUT_FIELD } from '../../atoms';
import Buttons from '../../atoms/Button';
import CustomRadio from '../../atoms/RadioButton';
import CustomSwitch from '../../atoms/Switch';
import DualText from '../dual-text/dual-text';
import SettingCard from '../setting_card/setting-card';
const list = [true, false, false, true];
const DisputeModal = ({ visible, onClose, title = "Dispute", disputeOpenRej=false,reject = false, onConfirm, name, reason, won = false, lost = false }) => {
  const [payload, setPayload] = React.useState({
    reason: reject ? 'I wanted a space grey iPhone 13 Pro' : 'Receipt did not match the product price on the website.'
  });

  return (
    <ReactNativeModal
      propagateSwipe
      isVisible={visible}
      avoidKeyboard
      onBackdropPress={() => onClose(f => !f)}
      onBackButtonPress={() => onClose(f => !f)}
      style={{ margin: 0, padding: 0 }}>
      <View style={styles.CONTAINER}>
        <View style={styles.SUB_CONTAINER}>
          <Regular label={title} style={{...styles.HEADING_TXT,color:lost?colors.pink:won?colors.green:reject? styles.HEADING_TXT.color:colors.primary}} />
          <TAKE_TO_INPUT_FIELD.ViewReason
            containerStyle={{ maxHeight: mvs(81) }}
            label={reject ? 'Rejection Reason' : 'Dispute Reason'}
            value={reason}
            style={{ textAlign: 'center', fontSize: mvs(13), color: colors.typeHeader }}
            editable={false}
            onChangeText={text => setPayload({ ...payload, reason: text })}
          />
          {/* <Regular label={'Thank you for contacting us.'} style={{alignSelf:'center',color:colors.primary,marginTop:mvs(29)}}/> */}
          {disputeOpenRej && <DualText
            content={`We are still investigating the dispute.\nYou will be notified as soon as we reach a\nverdict. `}
            style={{
              fontSize: mvs(15),
              color: colors.lightgrey2,
              alignSelf: 'center',
              textAlign: 'center',
              marginTop: mvs(29)
            }}>
            <Regular
              label="Thank you."
              style={{ color: colors.primary }}
            />
          </DualText>}

          {won && <DualText
            content={`Congratulations, `}
            style={{
              fontSize: mvs(15),
              color: colors.green,
              alignSelf: 'center',
              textAlign: 'center',
              marginTop: mvs(29)
            }}
            highlightText={`the raised dispute was won, and the amount was released to your account.`}
            highlightTextStyle={{ color: colors.lightgrey2, fontSize: mvs(15), }}
          >
            <Regular
              label="Thank you."
              style={{ color: colors.primary }}
            />
          </DualText>}

          {lost && <DualText
            content={`Unfortunately, `}
            style={{
              fontSize: mvs(15),
              color: colors.pink,
              alignSelf: 'center',
              textAlign: 'center',
              marginTop: mvs(29)
            }}
            highlightText={`the raised dispute was lost, and the amount was released to the other party.`}
            highlightTextStyle={{ color: colors.lightgrey2, fontSize: mvs(15), }}
          >
            <Regular
              label="Thank you."
              style={{ color: colors.primary }}
            />
          </DualText>}


          {reject && <DualText
            content={`${name} `}
            style={{
              fontSize: mvs(15),
              color: colors.primary,
              alignSelf: 'center',
              textAlign: 'center',
              marginTop: mvs(29)
            }}>
            <Regular
              label="will be notified to send a product proof that fits your requirements."
              style={{ color: colors.typeHeader }}
            />
          </DualText>}



          {/* <SettingCard style={{ paddingTop: mvs(13), paddingBottom: mvs(7), marginTop: mvs(39) }} headingStyle={{ alignSelf: 'center', fontSize: mvs(14) }} heading={'Make sure your notifications are on'}>
            <CustomSwitch style={{ marginTop: 0 }} textStyle={{ color: colors.primary }} label={'Email'} />
            <CustomSwitch style={{ marginTop: mvs(10) }} textStyle={{ color: colors.primary }} label={'SMS'} />
          </SettingCard> */}

          {/* <View style={styles.BUTTON_CONTAINER}> */}
          {reject && <Buttons.ButtonPrimary
            onClick={onConfirm}
            style={{ ...styles.BUTTON, marginTop: mvs(29) }}
            title={'Confirm'}
          />}

          <Buttons.ButtonSecondaryOutline
            onClick={onClose}
            style={{ ...styles.BUTTON, marginTop: reject ? mvs(10) : mvs(29) }}
            title={reject ? 'Cancel' : 'Back'}
          />
          {/* </View> */}
        </View>
      </View>
    </ReactNativeModal>
  );
};
export default DisputeModal;
const styles = StyleSheet.create({
  CONTAINER: {
    // position: 'absolute',
    // bottom: 0,
    width: ms(332),
    borderRadius: mvs(20),
    alignSelf: 'center'
    //paddingHorizontal: mvs(22),
  },
  REFUND_CONATINER: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: mvs(37), marginBottom: mvs(39) },
  TEXT: { textAlign: 'center', marginTop: mvs(30), fontSize: mvs(14), color: colors.primary },
  HEADING_TXT: {
    fontSize: mvs(19.5),
    color: colors.pink,
    alignSelf: 'center',
    marginBottom: mvs(9.5),
  },
  SUB_CONTAINER: {
    backgroundColor: colors.white,
    // paddingTop: mvs(20),
    paddingVertical: mvs(20),
    borderRadius: mvs(20),
    paddingHorizontal: mvs(10),
    backgroundColor: colors.white,
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
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: mvs(14),
    marginTop: mvs(15),
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
    marginTop: mvs(14),
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
    marginTop: mvs(29),
    //borderWidth:1
  },
  BUTTON: {
    width: '100%',
  },
  BACK: { position: 'absolute', left: mvs(23), top: mvs(17) },
});
