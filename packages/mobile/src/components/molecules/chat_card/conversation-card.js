import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { location_deactive as Location } from '../../../../resource/assets/order-car-icons';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Bold from '../../../presentation/typography/bold-text';
//import { View , Image} from 'native-base'
import Medium from '../../../presentation/typography/medium-text';
import Regular from '../../../presentation/typography/regular-text';
import ImagePlaceholder from '../../atoms/Placeholder';
import * as Icons from '../../../../resource/assets/chat-options-modal-icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SemiBold from '../../../presentation/typography/semibold-text';
import moment from 'moment';


const Conversation = ({
  user_img,
  user_name,
  message,
  time,
  counter,
  lastMessage,
  isMessageTab,
  thread_id,
  order_id,
  onPress,
  order_title,
  ...props
}) => {
  console.log(user_img);
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.container,
          {
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: colors.lightgrey2,
            backgroundColor: colors.white,
          },
        ]}>
        <View style={styles.dp}>
          <ImagePlaceholder bg_img={user_img} containerStyle={{ height: '100%', width: '100%' }} />
        </View>
        <View
          style={[styles.innerContainer, { justifyContent: 'space-between' }]}>
          <SemiBold label={order_title} style={{ ...styles.name, color: colors.primary }} numberOfLines={1} />
          <SemiBold label={user_name} style={styles.name} />
          {lastMessage === 'MESSAGE' ? <Regular
            numberOfLines = {1}
            label={
              message//.length > 22 ? `${message.substring(0, 18)} ...` : message
            }
            style={styles.message}
          /> : lastMessage === 'MAP' ?
            <Location /> :
            lastMessage === 'RECEIPT_IMAGE_MESSAGE' || lastMessage === 'PRODUCT_IMAGE_MESSAGE_REJECTED' ?
              <FontAwesome color={lastMessage === 'PRODUCT_IMAGE_MESSAGE_REJECTED' ? colors.pink : colors.primary} name={'image'} size={mvs(20)} /> :
              lastMessage === 'IMAGE_MESSAGE' ?
                <FontAwesome color={colors.primary} name={'image'} size={mvs(20)} /> :
                lastMessage === 'DOCUMENT_MESSAGE' ?
                  <FontAwesome color={colors.primary} name={'file-text-o'} size={mvs(20)} /> :
                  lastMessage === 'AUDIO_MESSAGE' ?
                    <FontAwesome color={colors.primary} name={'microphone'} size={mvs(20)} /> :
                    lastMessage === 'VIDEO_MESSAGE' &&
                    <FontAwesome color={colors.primary} name={'file-video-o'} size={mvs(20)} />
          }
        </View>
        <View
          style={{
            width: '25%',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}>
          <View>  
          <Regular
          label={moment(time).format('DD / MM / YYYY')}
          style={{...styles.time , alignSelf : 'flex-start'}}
        />
          <Regular
            label={TAKE_TO_CONSTANT.getConversationTime(time)}
            style={{...styles.time, alignSelf : 'flex-end'}}
          />
          </View>
          {counter > 0 && (
            <View style={styles.counterContainer}>
              <Medium label={counter > 99 ? `99+` : counter} style={{ ...styles.counter, fontSize: counter > 99 ? mvs(9) : mvs(12) }} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Conversation;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    marginBottom: mvs(15),
    padding: mvs(10),
    borderRadius: mvs(10),
  },
  dp: {
    height: mvs(46),
    width: mvs(50),
    borderRadius: mvs(8),
  },
  innerContainer: {
    flex: 1,
    marginLeft: mvs(10),
    justifyContent: 'space-between',
  },
  name: {
    fontSize: mvs(14),
    color: colors.headerTitle,
  },
  message: {
    fontSize: mvs(13),
    color: colors.lightgrey2,
  },
  time: {
    fontSize: mvs(10),
    color: colors.message,
  },
  counterContainer: {
    height: mvs(22),
    width: mvs(22),
    borderRadius: mvs(22 / 2),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counter: {
    fontSize: mvs(9),
    color: colors.white,
  },
  line: {
    width: '81%',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.price_border,
    marginTop: mvs(15),
    alignSelf: 'flex-end',
  },
});
