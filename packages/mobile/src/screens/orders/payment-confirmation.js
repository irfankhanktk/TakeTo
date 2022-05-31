import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import Buttons from '../../components/atoms/Button';
import ImagePlaceholder from '../../components/atoms/Placeholder';
import CustomSwitch from '../../components/atoms/Switch';
import DualText from '../../components/molecules/dual-text/dual-text';
import Header from '../../components/molecules/header/header-1x';
import SettingCard from '../../components/molecules/setting_card/setting-card';
import colors from '../../config/colors';
import {mvs} from '../../config/metrices';
import Regular from '../../presentation/typography/regular-text';

const PaymentConfirmation = props => {
  const [payload, setPayload] = React.useState({
    isPromotionEmail: true,
    isOrderEmail: true,
    isSms: false,
  });

  return (
    <View style={styles.mainContainer}>
      <Header {...props} title="payment confirmation" />
      <ScrollView style={styles.container}>
        <Regular label="Congratulations" style={styles.title} />
        <Regular
          label="Your payment was successfully made,"
          style={styles.detail}
        />
        <Regular
          label="& your offers were requested."
          style={{...styles.detail, marginTop: 0}}
        />
        <View style={styles.imageContainer}>
          <ImagePlaceholder containerStyle={styles.image} />
        </View>
        <Regular
          label="iPhone 13 Pro 128GB Sierra blue"
          style={styles.productName}
        />

        <SettingCard
          heading={'Make sure your notifications are on'}
          headingStyle={{alignSelf: 'center'}}
          style={{marginTop: mvs(33)}}>
          <DualText
            style={{
              alignSelf: 'center',
              fontSize: mvs(11),
              color: colors.lightgrey2,
            }}
            content={'You will be notified when you start receiving Offers'}
          />
          <CustomSwitch
            value={payload.isOrderEmail}
            label={'Email'}
            onChange={v => setPayload({...payload, isOrderEmail: v})}
            textStyle={{color: colors.primary}}
          />
          <CustomSwitch
            style={{marginTop: mvs(28)}}
            value={payload.isSms}
            label={'SMS'}
            onChange={v => setPayload({...payload, isSms: v})}
            textStyle={{color: colors.primary}}
          />
        </SettingCard>

        <View style={styles.noteContainer}>
          <DualText
            style={{
              color: colors.headerTitle,
              fontSize: mvs(12),
            }}
            content={'By publishing my order, I agree to Taketo’s'}
            highlightText={' Terms of Use'}
            highlightTextStyle={{
              textDecorationLine: 'underline',
              fontSize: mvs(12),
            }}>
            <Regular
              style={{
                color: colors.headerTitle,
                fontSize: mvs(12),
              }}
              label=". I understand that if the product price is incorrect, my order may be canceled."
            />
          </DualText>
        </View>

        <Buttons.ButtonPrimary
          onClick={() => {
            props.navigation.navigate('main');
          }}
          style={styles.button}
          title="Cancel Order"
        />

        <Buttons.ButtonPrimary
          onClick={() => {
            props.navigation.navigate('Home');
          }}
          style={styles.button1}
          title="Back to Home Page"
        />
      </ScrollView>
    </View>
  );
};

export default PaymentConfirmation;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: mvs(22),
  },
  imageContainer: {
    alignSelf: 'center',
    marginTop: mvs(30),
    height: mvs(125),
    width: mvs(104),
    borderWidth: 0.3,
    borderRadius: mvs(10),
    borderColor: colors.price_border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: mvs(98),
    width: mvs(75),
    borderRadius: mvs(10),
  },
  productName: {
    fontSize: mvs(18),
    color: colors.headerTitle,
    alignSelf: 'center',
    marginTop: mvs(10),
  },
  title: {
    fontSize: mvs(20),
    color: colors.primary,
    alignSelf: 'center',
    marginTop: mvs(37),
  },
  detail: {
    fontSize: mvs(13),
    color: colors.lightgrey2,
    alignSelf: 'center',
    marginTop: mvs(10),
  },
  noteContainer: {
    //borderWidth : 1,
    marginTop: mvs(20),
  },
  button: {
    marginTop: mvs(74),
    backgroundColor: colors.pink,
  },
  button1: {
    marginTop: mvs(12),
    marginBottom: mvs(40),
  },
});
