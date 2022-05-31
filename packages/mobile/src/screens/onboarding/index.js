import React from 'react';
import {StyleSheet, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Buttons from '../../components/atoms/Button';
import colors from '../../config/colors';
import {ms, scale, vs} from '../../config/metrices';
import Medium from '../../presentation/typography/medium-text';
import Regular from '../../presentation/typography/regular-text';
import Welcome from './../../../resource/assets/onboarding-icons/welcome.svg';

export const Onboarding = ({navigation, route}) => {
  return (
    <View style={{flex: 1, width: '100%', backgroundColor: colors.white}}>
      <View style={{paddingTop: scale(hp(5.5)), left: -66}}>
        <Welcome />
      </View>
      <View style={{marginTop: vs(40)}}>
        <Medium label={'Shop from abroad'} style={styles.TITLE} />
      </View>
      <View style={{marginTop: vs(9)}}>
        <Regular
          label={`From games to gadgets, get any product from\nabroad, delivered by travelers.`}
          style={styles.CONTENT}
        />
      </View>
      <View style={styles.BTN_CONTAINER}>
        <Buttons.ButtonPrimary
          style={styles.BTN_WIDTH}
          title={'Get Started'}
          onClick={() => {
            navigation.navigate('login');
          }}
        />
        {/* <Buttons.ButtonSeconday
          style={styles.BTN_WIDTH}
          title={'Skip'}
          onClick={() => {}}
        /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  BTN_CONTAINER: {
    width: '100%',
    position: 'absolute',
    flexDirection: 'row',
    // marginTop:xdHeight(205),
    bottom: scale(40),
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(22),
  },
  BTN_WIDTH: {
    width: '100%',
  },

  TITLE: {
    fontSize: ms(18),
    textAlign: 'center',
    color: colors.headerTitle,
  },
  CONTENT: {
    fontSize: ms(14),
    textAlign: 'center',
    color: colors.headerTitle,
  },
});
