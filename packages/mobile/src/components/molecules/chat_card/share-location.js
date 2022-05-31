import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native';
import { DCross, RCross, Tick } from '../../../../resource/assets/common-icons';
import { TAKE_TO_IMAGES } from '../../../../resource/assets/image_resouce';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import ImagePlaceholder from '../../atoms/Placeholder';
import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import * as SVGS from '../../../../resource/assets/common-icons'
import { Chase } from 'react-native-animated-spinkit';

const ShareLocation = ({
  label = 'Shared Delivery Location',
  item,
  profileData = {},
  style,
  mapStyles,
  onPress,
  ...props
}) => {
  const Seen = SVGS['seened'];
  const Deliver = SVGS['delivered'];
  const Sent = SVGS['sent']
  const [region, setRegion] = useState({
    latitude: 37.78825,
    latitudeDelta: 0.015,
    longitude: -122.4324,
    longitudeDelta: 0.0121,
  });
   
  
  // const mapRef = React.useRef(null);

  React.useEffect(() => {
    if (item?.body && Object.keys(item?.body)) {
      // console.log("REGION SUCESS :: ", item?.body)
      setTimeout(() => {
        setRegion({
          latitude: item && item?.body?.split(',')[0] * 1,
          latitudeDelta: 0.015,
          longitude: item && item?.body?.split(',')[1] * 1,
          longitudeDelta: 0.0121,
        });
      })
    }
  }, [item]);


  // console.log('item::',item)


  return (
    <View style={{ ...styles.CONTAINER, ...style }}>
      {
        <Regular
          label={item?.body !== '' ? label : ''}
          style={{
            color: colors.green,
            fontSize: mvs(12),
          }}
        />
      }
      <TouchableOpacity
        onPress={onPress}
        disabled={item?.body === ''}
        style={[styles.ROW, mapStyles]}>
        <View style={{
          width: mvs(120),
          height: '100%',
          borderRadius: mvs(10),
          overflow: 'hidden',
          justifyContent: item?.body === '' ? 'center' : null,
          alignItems: item?.body === '' ? 'center' : null,
          borderWidth: item?.body === '' ? 1 : 0,
          borderColor: colors.lightgrey
        }}>
          {item?.body !== '' ? <MapView
            // ref={mapRef}
            initialRegion={region}
            region={region}
            scrollEnabled={false}
            style={{ flex: 1 }}
            zoomEnabled={false}
          //   mapType='standard'
          //showsMyLocationButton={false}
          />
            :
            <Chase
              size={mvs(20)}
              color={colors.primary}
            />
            // <ActivityIndicator size = {'small'} color = {colors.primary}/>
          }
        </View>
      </TouchableOpacity>

      {item?.body !== '' && <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          alignItems: 'center',
        }}
      >
        {item?.owner_id === profileData?.id &&
          (item?.unread ?
            <Deliver />
            :
            <Seen />)
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
export default ShareLocation;

const styles = StyleSheet.create({
  CONTAINER: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: mvs(15),
    paddingRight: mvs(39),
    //borderWidth : 1,
  },
  ROW: {
    borderWidth: 1,
    borderColor: colors.white,
    height: mvs(62),
    //width: mvs(120),
    // overflow: 'hidden',

  },
  pointer: {
    height: mvs(10),
    width: mvs(10),
    position: 'absolute',
    backgroundColor: colors.primary,
    alignSelf: 'center',
    borderRadius: mvs(10 / 2),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
});
