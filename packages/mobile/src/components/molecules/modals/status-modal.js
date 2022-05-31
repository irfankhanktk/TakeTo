import React from 'react';
import {StyleSheet, View} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import colors from '../../../config/colors';
import {ms, mvs} from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';
import Buttons from '../../atoms/Button';
import CustomSwitch from '../../atoms/Switch';
import DualText from '../dual-text/dual-text';
import SettingCard from '../setting_card/setting-card';
const list = [true, false, false, true];

const StatusModal = ({
  btnColor,
  visible,
  onClose,
  onConfirm,
  title,
  titleStyle,
  buttonTitle,
  name = 'Zenab Thaqi',
  fromApprove = false,
  endButton = false,
  endButtonTitle,
  mainButton = false,
  endButtonStyle,
  product = false,
  loading = false,
}) => {
  const [payload, setPayload] = React.useState({
    reason: 'Deliverer not responding to my messages after several trials.',
  });

  return (
    <ReactNativeModal
      propagateSwipe
      isVisible={visible}
      // avoidKeyboard
      onBackdropPress={() => onClose(f => !f)}
      onBackButtonPress={() => onClose(f => !f)}
      style={{margin: 0, padding: 0}}>
      <View style={styles.CONTAINER}>
        <View style={styles.SUB_CONTAINER}>
          <Regular
            label={title}
            style={{
              ...styles.HEADING_TXT,
              ...titleStyle,
              color: title.includes('Sent')
                ? colors.primary
                : title.includes('Accepted') || title.includes('Approve')
                ? colors.green
                : colors.pink,
            }}
          />

          {title == 'Receipt Sent' && (
            <Regular
              label="Receipt was sent for Buyer approval."
              style={{
                color: colors.typeHeader,
                marginTop: mvs(10),
                alignSelf: 'center',
              }}
            />
          )}

          {title == 'Product Sent' && (
            <Regular
              label="Product was sent for Buyer approval."
              style={{
                color: colors.typeHeader,
                marginTop: mvs(10),
                alignSelf: 'center',
              }}
            />
          )}

          {title == 'Receipt Accepted' && !fromApprove && (
            <DualText
              highlightText="Ralph Wakim"
              highlightTextStyle={{color: colors.primary, fontSize: mvs(15)}}
              content="Congratulations "
              style={{
                color: colors.typeHeader,
                fontSize: mvs(15),
                marginTop: mvs(10),
                textAlign: 'center',
              }}>
              <Regular
                label={`,\n the buyer has accepted the Receipt.`}
                style={{color: colors.typeHeader}}
              />
            </DualText>
          )}

          {(title == 'Receipt Accepted' || title == 'Approve Receipt') &&
            fromApprove && (
              <DualText
                style={{marginTop: mvs(10), textAlign: 'center'}}
                highlightText={name}
                highlightTextStyle={{fontSize: mvs(15)}}>
                <Regular
                  style={{
                    ...styles.TEXT,
                    fontSize: mvs(15),
                    color: colors.typeHeader,
                  }}
                  label={` will be notified.`}
                />
              </DualText>
            )}

          {title == 'Deal Rejected' && (
            <DualText
              style={{
                marginTop: mvs(10),
                textAlign: 'center',
                fontSize: mvs(15),
                color: colors.typeHeader,
              }}
              content="Unfortunately, the buyer has rejected the deal."
              highlightText={`\nSorry for the inconvenience.`}
              highlightTextStyle={{
                fontSize: mvs(15),
                textAlign: 'center',
              }}></DualText>
          )}

          {(title == 'Product Accepted' ||
            title == 'Approve Reward' ||
            title == 'Approve Product') && (
            <DualText
              style={{marginTop: mvs(10), textAlign: 'center'}}
              highlightText={name}
              highlightTextStyle={{fontSize: mvs(15)}}>
              <Regular
                style={{
                  ...styles.TEXT,
                  fontSize: mvs(15),
                  color: colors.typeHeader,
                  marginTop: mvs(27),
                  marginBottom: mvs(27),
                }}
                label={` is notified to proceed confirming your ${
                  product ? 'Product' : 'Receipt'
                }.`}
              />
            </DualText>
          )}

          {(title == 'Reject Offer' || title == 'Reject Deal') && (
            <DualText
              style={{marginTop: mvs(10), textAlign: 'center'}}
              highlightText={name}
              highlightTextStyle={{fontSize: mvs(15)}}>
              <Regular
                style={{
                  ...styles.TEXT,
                  fontSize: mvs(15),
                  color: colors.typeHeader,
                  marginTop: mvs(27),
                  marginBottom: mvs(27),
                }}
                label={` will be notified that the ${title?.split(' ')[1]?.toLowerCase()} is rejected.`}
              />
            </DualText>
          )}

          {title == 'Reward Accepted' && (
            <DualText
              style={{marginTop: mvs(10), textAlign: 'center'}}
              highlightText={name}
              highlightTextStyle={{fontSize: mvs(15)}}>
              <Regular
                style={{
                  ...styles.TEXT,
                  fontSize: mvs(15),
                  color: colors.typeHeader,
                  marginTop: mvs(27),
                  marginBottom: mvs(27),
                }}
                label={` is notified to proceed confirming\nyour Product.`}
              />
            </DualText>
          )}

          {/* <SettingCard style={{ paddingTop: mvs(13), paddingBottom: mvs(7), marginTop: mvs(43) }} headingStyle={{ alignSelf: 'center', fontSize: mvs(14) }} heading={'Make sure your notifications are on'}>
            <CustomSwitch style={{ marginTop: 0 }} textStyle={{ color: colors.primary }} label={'Email'} />
            <CustomSwitch style={{ marginTop: mvs(10) }} textStyle={{ color: colors.primary }} label={'SMS'} />
          </SettingCard> */}

          {mainButton && (
            <Buttons.ButtonPrimary
              onClick={onConfirm}
              loading = {loading}
              loaderColor = {colors.white}
              style={{...styles.BUTTON, marginTop: mvs(29)}}
              title={buttonTitle}
            />
          )}

          {endButton && (
            <Buttons.ButtonSecondaryOutline
              onClick={onClose}
              style={{
                ...styles.BUTTON,
                marginTop: mvs(12),
                backgroundColor: btnColor,
              }}
              title={endButtonTitle}
              textStyle={btnColor ? {color: colors.white} : {}}
            />
          )}
        </View>
      </View>
    </ReactNativeModal>
  );
};
export default StatusModal;
const styles = StyleSheet.create({
  CONTAINER: {
    // position: 'absolute',
    // bottom: 0,
    width: ms(332),
    borderRadius: mvs(20),
    alignSelf: 'center',
    //paddingHorizontal: mvs(22),
  },
  REFUND_CONATINER: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: mvs(20),
  },
  TEXT: {
    textAlign: 'center',
    marginTop: mvs(30),
    fontSize: mvs(14),
    color: colors.primary,
  },
  HEADING_TXT: {
    fontSize: mvs(19.5),
    color: colors.green,
    alignSelf: 'center',
    //marginBottom: mvs(9.5),
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
  },
  BUTTON: {
    width: '100%',
  },
  BACK: {position: 'absolute', left: mvs(23), top: mvs(17)},
});
