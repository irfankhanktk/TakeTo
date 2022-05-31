import { Image, StyleSheet, Text, TouchableOpacity, View, BackHandler, Alert } from 'react-native'
import React from 'react'
import Regular from '../../../presentation/typography/regular-text'
import Bold from '../../../presentation/typography/bold-text'
import { mvs } from '../../../config/metrices'
import colors from '../../../config/colors'
import ImagePlaceholder from '../../atoms/Placeholder'
import SplashScreen from 'react-native-splash-screen'
import services from '@khan_ahmad786/common/api/services'
import DropdownAlert from 'react-native-dropdownalert'
import UI_API from '@khan_ahmad786/common/store/services'
const VoipStartCall = (props) => {

    const { data, order_obj } = props?.route?.params || {}
    const alertRef = React.useRef();
    // console.log(order_obj)
    // { "chat_end": false,
    //  "has_dispute": true,
    //  "is_buyer": false,
    //  "offer_id": 221,
    //  "offer_reward": "USD 10.0",
    //  "order_id": 110,
    //  "order_request_id": 231,
    //  "order_reward": "USD 10.0",
    //  "order_shop_name": "Nike W Air Max 270 Barely Rose Atomic Pink White Orange DC1864-600 Women's 7  | eBay",
    //  "order_step": "order_step_2",
    //  "participant_id": 489,
    //  "participant_name": "Bobby",
    //  "participant_profile_picture": "https://api.taketo.exodevs.com/admin-theem/dist/img/no-image-icon-6.png",
    //  "raw_offer_reward": 10,
    //  "step": "dispute_1" 
    // }
    const [joinAppCalled, setJoinApiCalled] = React.useState(false);


    
    
    

    const _endCall = async () => {
        try {
            //58d9bd8-a3dc-468f-9ab8-e40ae9f93d82/calls/958d9bd8-a44a-4d39-b560-ab6afc04e3dc/end
            const response = await messangerClient.post(
                `${services.messanger.open_chat}/${data?.thread_id}/calls/${data?.id}/end`,
                {},
            );

            console.log("CALLING API :: ", response.data)
           // props.navigation.pop()
        } catch (error) {
            alertRef.current.alertWithType(
                'error',
                'Error',
                UI_API._returnError(error),
            );
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: `${colors.primary}`, justifyContent: 'center', alignItems: 'center' }}>

            <View style={{ flex: 0.7 }}>
                <ImagePlaceholder
                    containerStyle={{ height: mvs(150), width: mvs(150), borderRadius: mvs(150), marginVertical: mvs(20) }}
                />
                <Regular label={'Take To Outgoing Call'} style={{ textAlign: 'center', color: colors.white }} />
                <Bold label={order_obj?.participant_name} style={{ textAlign: 'center', fontSize: mvs(30), color: colors.white, marginTop: mvs(20), }} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '60%' }}>
                {/* <Image style={{
                    height: mvs(50),
                    width: mvs(50),
                    borderRadius: mvs(50),
                    // alignSelf: 'center',
                    transform: [{ rotate: '350deg' }]
                }}
                    source={require('./../../../../resource/assets/call/phone-call-acpt.png')}
                /> */}

                <TouchableOpacity onPress={() => _endCall()}>
                    <Image style={{
                        height: mvs(50),
                        width: mvs(50),
                        borderRadius: mvs(50),
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

export default VoipStartCall

const styles = StyleSheet.create({})