import React from 'react';
import { View, Text } from 'react-native';
import { mvs } from '../../../../config/metrices';
import Regular from '../../../../presentation/typography/regular-text';
import Buttons from '../../../atoms/Button';
import ModalWrapper from '../../modal-wrapper/modal-wrapper';
import { TAKE_TO_INPUT_FIELD } from '../../../atoms/Input';
import Camera from './../../../../../resource/assets/headers-icons/camera.svg';
import colors from './../../../../config/colors';
const IdVerificationModal = ({visible=false,onCLose}) => {
    const [payload,setPayload]=React.useState({
        email:'',
        otpCode:'',
    });
    return (
       <ModalWrapper onClose={onCLose} title={'Verify Your Identity'} isBack={true} visible={visible}>
             <View style={{alignItems:'center',paddingBottom:mvs(40)}}>
                 <Regular label={'Upload Civil ID picture'} style={{marginBottom:mvs(30)}}/>
                 <View style={{height:mvs(130),width:mvs(130),backgroundColor:colors.secondary,alignItems:'center',justifyContent:'center',borderRadius:mvs(20)}}>
                   <Camera/>
                 </View>
             </View>
            <Buttons.ButtonPrimary onClick={()=>{}} style={{marginTop:mvs(10)}} title={'Upload'}/>
       </ModalWrapper>
    );
};
export default IdVerificationModal;