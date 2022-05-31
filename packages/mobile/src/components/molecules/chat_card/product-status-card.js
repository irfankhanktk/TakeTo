import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { DCross, Play2, RCross, Tick } from '../../../../resource/assets/common-icons';
import { TAKE_TO_IMAGES } from '../../../../resource/assets/image_resouce';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';
import ImagePlaceholder from '../../atoms/Placeholder';
import * as SVGS from '../../../../resource/assets/common-icons'
import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import { Chase } from 'react-native-animated-spinkit';



const ProductStatusCard = ({
  label = label,
  item = {},
  profileData = {},
  status,
  showStatus,
  image,
  onPressImage,
  show_img = true,
  sending,
  style,
  imageStyle,
  video = false,
  timeContainerStyle,
  removeSeen = false,
  showTime = true
}) => {



  const Seen = SVGS['seened'];
  const Deliver = SVGS['delivered'];
  const Sent = SVGS['sent']

  return (
    <View
      style={[
        styles.CONTAINER,
        { justifyContent: !showStatus ? 'flex-end' : 'space-between' },
        style,
      ]}>
      {showStatus && (
        <Regular
          label={label}
          style={{
            color:
              status == 'Rejected'
                ? colors.pink
                : status == 'Disputed'
                  ? colors.disputes
                  : colors.green,
            fontSize: mvs(12),
            //marginLeft : showTime? null : mvs(40) 
          }}
        />
      )}
      {show_img && (
        <View style={[styles.ROW, {}]}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={onPressImage}
            style={{
              borderWidth: 1,
              borderColor: colors.primary,
              backgroundColor: colors.white,
              width: mvs(73),
              height: mvs(73),
              paddingVertical: mvs(5),
              paddingHorizontal: mvs(12),
              borderRadius: mvs(13),
              marginRight: mvs(19),
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              ...imageStyle,
            }}>
            {sending ?
              <Chase
                size={video ? mvs(30) : mvs(20)}
                color={colors.primary}
              />
              :
              <ImagePlaceholder
                bg_img={image}
                containerStyle={{ height: '100%', width: '100%' }}
              />}
            {(!sending && video) && <Play2
              height={mvs(50)}
              width={mvs(50)}
              style={{
                position: 'absolute',
              }}
            />}
          </TouchableOpacity>
          {/* {showStatus && 
                <>
                {status == "Approved" && <Tick width={mvs(14)} height={mvs(18)} style={{marginLeft:mvs(5)}}/>}
                {status == "Rejected" && <RCross width={mvs(14)} height={mvs(18)} style={{marginLeft:mvs(5)}}/>}
                {status == "Disputed" && <DCross width={mvs(14)} height={mvs(18)} style={{marginLeft:mvs(5)}}/>}
            </>} */}

        </View>
      )}

      {showTime && <View
        style={{
          position: 'absolute',
          bottom: 0,
          //borderWidth : 1,
          right: 0,
          //width : mvs(50),
          alignItems: 'center',
          ...timeContainerStyle
        }}
      >{!removeSeen &&
        <>
          {(item?.type_verbose === 'PRODUCT_IMAGE_MESSAGE_REJECTED' ? item?.owner_id !== profileData?.id : item?.owner_id === profileData?.id) &&
            (item?.unread ?
              <Deliver />
              :
              <Seen />)
          }
        </>
        }
        <Regular
          label={TAKE_TO_CONSTANT.getConversationTime(item?.created_at)}
          style={{
            color: colors.typeHeader,
            fontSize: mvs(10),
            marginTop: mvs(10)
          }}
        />
      </View>}
    </View>
  );
};
export default ProductStatusCard;
const styles = StyleSheet.create({
  CONTAINER: {
    flexDirection: 'row',
    //justifyContent:'space-between',
    alignItems: 'center',
    paddingRight: mvs(39),
    marginTop: mvs(15),
    //borderWidth : 1,
  },
  ROW: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderWidth : 1,
  },
});
