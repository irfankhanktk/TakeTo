import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import colors from '../../../config/colors';
import Header from '../../../components/molecules/header/header-1x';
import InputWithTitle from '../../../components/molecules/input-with-title';
import {mvs} from '../../../config/metrices';
import Buttons from '../../../components/atoms/Button';
import {HeaderLogo} from '../../../../resource/assets/common-icons';
import Regular from '../../../presentation/typography/regular-text';
import WebView from 'react-native-webview';

const TermsOfUse = props => {
  const {route} = props;
  const {URL} = route?.params;
  return (
    <View style={styles.mainContainer}>
      <Header {...props} title="Terms of use" allowBackBtn userIcon={false} />

      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <HeaderLogo />
        </View>
        <View style={styles.headerContainer}>
          <Regular
            label="Terms of Use"
            style={{fontSize: mvs(18), color: colors.primary}}
          />
        </View>
        <View
          //  showsVerticalScrollIndicator = {false}
          //  contentContainerStyle = {{paddingBottom : mvs(20)}}
          style={styles.termsContainer}>
          {/* <Regular 
               label = {terms}
               style = {{fontSize : mvs(12), color : colors.typeHeader}}
               /> */}
          <WebView
            source={{uri: `https://taketo.exodevs.com/pages/${URL}`}}
            startInLoadingState
            style={{backgroundColor: 'transparent'}}
          />
        </View>
      </View>
    </View>
  );
};

export default TermsOfUse;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: mvs(22),
    paddingTop: mvs(27),
  },
  headerContainer: {
    height: mvs(41),
    width: '100%',
    backgroundColor: colors.lightgrey,
    borderRadius: mvs(10),
    marginTop: mvs(38),
    justifyContent: 'center',
    paddingLeft: mvs(10),
  },
  termsContainer: {
    flex: 1,
    // paddingHorizontal : mvs(10),
    // paddingVertical : mvs(20),
    width: '100%',
    backgroundColor: colors.lightgrey,
    borderRadius: mvs(10),
    marginTop: mvs(19),
    marginBottom: mvs(40),
  },
  logoContainer: {
    alignItems: 'center',
  },
});
