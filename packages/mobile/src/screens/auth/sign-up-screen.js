import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { SignUpPage } from '../../components/pages';

const SignUpScreen = props => {
  return (
    <View style={{flex: 1}}>
      <SignUpPage {...props} />
    </View>
  );
};

const mapStateToProps = state => {
  return {
    userData: state.auth,
    langauge: state.common?.langauge,
    countriesList: state.common.countriesList,
    defaultCountry: state.common.defaultCountry,
  };
};

const mapDispatchToProps = dispatch => ({
  postRegisterData: payload =>
    dispatch(TAKE_TO_ACTIONS.postRegisterData(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen);
