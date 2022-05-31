import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Header from '../../components/molecules/header/header-1x';
import colors from '../../config/colors';
import {WebView} from 'react-native-webview';
import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
const PrivacyAndTerms = props => {
  const {route} = props;
  const {URL} = route?.params;
  return (//TAKE_TO_CONSTANT.convertUpperCase(URL.replace('-',' '))
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <Header {...props} title={""} allowBackBtn spacebetween userIcon={false} />
      <View style={{flex: 1,paddingTop: mvs(27),}}>
        <WebView source={{uri:`https://taketo.exodevs.com/pages/${URL}`}}  startInLoadingState/>
      </View>
    </View>
  );
};

export default PrivacyAndTerms;

const styles = StyleSheet.create({});
