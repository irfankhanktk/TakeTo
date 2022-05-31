import React from 'react';
import {View, Text} from 'react-native';
import {mvs} from '../../../../config/metrices';
import Regular from '../../../../presentation/typography/regular-text';
import Buttons from '../../../atoms/Button';
import ModalWrapper from '../../modal-wrapper/modal-wrapper';
import {TAKE_TO_INPUT_FIELD} from '../../../atoms/Input';
import CustomPhoneInput from './../../phone-input/phone-input';
import colors from './../../../../config/colors';
const PhoneVerificationModal = ({visible = false, onCLose, onVerify, onSend}) => {
  const [payload, setPayload] = React.useState({
    phone: '',
    otpCode: '',
  });
  return (
    <ModalWrapper
      onClose={onCLose}
      title={'Add phone number'}
      isBack={true}
      visible={visible}>
      <CustomPhoneInput
        label="Phone Number"
        setPhone={t => setPayload({...payload, phone: t})}
        phone={payload.phone}
      />
      <Buttons.ButtonPrimary
        textStyle={{color: payload.phone ? colors.doted : colors.white}}
        //disabled={!payload.phone}
        onClick={onSend}
        style={{
          marginTop: mvs(10),
          backgroundColor: payload.phone ? colors.secondary : colors.primary,
        }}
        title={'Send Code'}
      />
      <TAKE_TO_INPUT_FIELD.CustomOtpInput
        value={payload.otpCode}
        setValue={c => setPayload({...payload, otpCode: c})}
      />
      {payload.phone ? (
        <>
          <Buttons.ButtonSecondaryOutline
            style={{marginTop: mvs(40)}}
            onClick={() => {}}
            title={'Resend code'}
          />
          <Buttons.ButtonSecondaryOutline
            style={{marginTop: mvs(10)}}
            onClick={() => {}}
            title={'Verify via Voice Call'}
          />
        </>
      ) : null}
      <Buttons.ButtonPrimary
        textStyle={{color: payload.phone ? colors.white : colors.doted}}
        style={{
          backgroundColor: payload.phone ? colors.primary : colors.secondary,
          marginTop: mvs(payload.phone ? 10 : 164),
        }}
        onClick={()=>onVerify(payload?.otpCode,'mobile')}
        title={'Verify'}
      />
    </ModalWrapper>
  );
};
export default PhoneVerificationModal;
