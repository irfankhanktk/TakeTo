import { Image, StyleSheet, Text, View, TouchableOpacity, BackHandler, Alert } from 'react-native'
import React from 'react'
import Regular from '../../../presentation/typography/regular-text'
import Bold from '../../../presentation/typography/bold-text'
import { mvs } from '../../../config/metrices'
import colors from '../../../config/colors'
import ImagePlaceholder from '../../atoms/Placeholder'
import services from '@khan_ahmad786/common/api/services'
import DropdownAlert from 'react-native-dropdownalert'
import UI_API from '@khan_ahmad786/common/store/services'
import InCallManager from 'react-native-incall-manager';
const VoipIncommingCall = (props) => {

    const { data } = props?.route?.params || {}
    const alertRef = React.useRef();
console.log('data::::',data);
    const _endCall = async () => {
        try {
            InCallManager.stopRingtone();
            InCallManager.stop();
            //58d9bd8-a3dc-468f-9ab8-e40ae9f93d82/calls/958d9bd8-a44a-4d39-b560-ab6afc04e3dc/end
            const response = await messangerClient.post(
                `${services.messanger.open_chat}/${data?.call?.thread_id}/calls/${data?.call?.id}/end`,
                {},
            );


            //  props.navigation.pop()
        } catch (error) {
            alertRef.current.alertWithType(
                'error',
                'Error',
                UI_API._returnError(error),
            );
        }
    }


    const backAction = () => {
        Alert.alert("Cancel Call?", "Are you sure you want cancel the call?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel"
          },
          { text: "YES", onPress: () => {
              _endCall()
          }}
        ]);
        return true;
      };
    
      React.useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);
    
        return () =>
          BackHandler.removeEventListener("hardwareBackPress", backAction);
      }, []);

    const _AcceptCall = async () => {
        try {
            InCallManager.stopRingtone();
            InCallManager.stop();
            //58d9bd8-a3dc-468f-9ab8-e40ae9f93d82/calls/958d9bd8-a44a-4d39-b560-ab6afc04e3dc/end
            const response = await messangerClient.post(
                `${services.messanger.open_chat}/${data?.call?.thread_id}/calls/${data?.call?.id}/join`,
                {},
            );

            // props.navigation.replace("joincalling",{sessionId:response?.data?.id,name:data?.sender?.name})
        } catch (error) {
            alertRef.current.alertWithType(
                'error',
                'Error',
                UI_API._returnError(error),
            );
        }
    }

    //console.log("URL:", `${services?.base_url.replace('v1/','')}${(data?.sender?.base?.profile_picture).replace('size','512x512')}`)
    return (
        <View style={{ flex: 1, backgroundColor: `${colors.primary}`, justifyContent: 'center', alignItems: 'center' }}>

            <View style={{ flex: 0.7, alignItems: 'center'  }}>
                <ImagePlaceholder
                    bg_img = {`${data?.sender?.profile_picture}`}
                    containerStyle={{ height: mvs(150), width: mvs(150), borderRadius: mvs(150), marginVertical: mvs(20) }}
                />
                <Bold label={data?.sender?.name} style={{ textAlign: 'center', color: colors.white, fontSize: mvs(30), }} />
                <Regular label={'Take To Incomming Call'} style={{ textAlign: 'center', color: colors.white, marginTop: mvs(20) }} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '60%' }}>
                <TouchableOpacity onPress={() => _AcceptCall()}>
                    <Image style={{
                        height: mvs(50),
                        width: mvs(50),
                        borderRadius: mvs(50),
                        // ...colors.shadow,
                        backgroundColor: colors.white,
                        // alignSelf: 'center',
                        transform: [{ rotate: '350deg' }]
                    }}
                        source={require('./../../../../resource/assets/call/phone-call-acpt.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => _endCall()}>
                    <Image style={{
                        height: mvs(50),
                        width: mvs(50),
                        borderRadius: mvs(50),
                        // ...colors.shadow,
                        backgroundColor: colors.white,
                        // alignSelf: 'center',
                        transform: [{ rotate: '170deg' }]
                    }}
                        source={require('./../../../../resource/assets/call/phone-call-rej.png')}
                    />
                </TouchableOpacity>

            </View>
            <DropdownAlert zIndex={5}  elevation={15}
                translucent
                activeStatusBarStyle={'light-content'}
                inactiveStatusBarBackgroundColor={colors.primary}
                ref={alertRef}
            />

        </View>
    )
}

export default VoipIncommingCall

const styles = StyleSheet.create({})