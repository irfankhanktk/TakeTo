import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import colors from '../../../config/colors';
import Header from '../../../components/molecules/header/header-1x';
import InputWithTitle from '../../../components/molecules/input-with-title';
import {mvs} from '../../../config/metrices';
import Buttons from '../../../components/atoms/Button';
import DropdownAlert from 'react-native-dropdownalert';
import UI_API from '@khan_ahmad786/common/store/services';
import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';

const SubmitRequest = props => {
  const alertRef = React.useRef();
  const [loading, setLoading] = React.useState(false);
  const [payload, setPayload] = React.useState({
    title: '',
    message: '',
  });

  const onChangeField = (key, value) => {
    setPayload({...payload, [key]: value});
  };

  const onSubmitRequest = async () => {
    try {
      setLoading(true);
      const status = TAKE_TO_CONSTANT.submitRequestValidation(payload);
      if (!status.status) throw new Error(status.message);
      setLoading(false);
      setPayload({});
      alertRef.current.alertWithType(
        'success',
        'Feedback',
        'Your request has been submitted.',
      );
    } catch (error) {
      setLoading(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };
  return (
    <View style={styles.mainContainer}>
      <Header
        {...props}
        title="Submit a request"
        allowBackBtn
        userIcon={false}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <InputWithTitle
          singleInput
          value={payload?.title}
          onChangeText={text => onChangeField('title', text)}
          title={'Title'}
          titleStyle={{fontSize: mvs(15)}}
          placeholder="Title ..."
          placeholderTextColor = {colors.input_placehoder}
          // style={{marginTop: mvs(22)}}
        />
        <InputWithTitle
          singleInput
          value={payload?.message}
          maxLength={500}
          onChangeText={text => onChangeField('message', text)}
          title={'Message'}
          titleStyle={{fontSize: mvs(15)}}
          placeholder="Type your message …"
          placeholderTextColor = {colors.input_placehoder}
          style={{marginTop: mvs(22)}}
          textStyle={{
            height: mvs(187),
            textAlignVertical: 'top',
          }}
          multiline
        />

        <Buttons.ButtonPrimary
          title="Submit"
          loaderColor={colors.white}
          loading={loading}
          disabled={loading}
          onClick={onSubmitRequest}
          style={{marginTop: mvs(314), marginBottom: mvs(40)}}
        />
      </ScrollView>
      <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'}  inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
    </View>
  );
};

export default SubmitRequest;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    //flex : 1,
    paddingTop: mvs(27),
    paddingHorizontal: mvs(22),
  },
});
