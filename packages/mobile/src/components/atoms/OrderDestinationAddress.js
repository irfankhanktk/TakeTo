import React from 'react';
import {StyleSheet, Text, View, Image, ImageBackground} from 'react-native';
import {TAKE_TO_IMAGES} from '../../../resource/assets/image_resouce';
import colors from '../../config/colors';
import {mvs} from '../../config/metrices';
import Regular from '../../presentation/typography/regular-text';

const OrderDestinationAddress = ({
  label,
  fontSize = 9,
  style,
  imageFrom,
  imageTo,
}) => {
  return (
    <View
      style={{
        // flex: 1,//to give abosulte size uncomment this line
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        //  overflow :'hidden',
        flexDirection: 'row',
        ...style,
      }}>
      <ImageBackground
        resizeMode="contain"
        source={TAKE_TO_IMAGES.placeholder}
        style={{
          height: mvs(23),
          width: mvs(23),
          borderRadius: mvs(11.5),
          overflow: 'hidden',
          backgroundColor: colors.lightgrey,
        }}>
        <Image
          resizeMode="contain"
          source={imageFrom}
          style={{
            height: '100%',
            width: '100%',
          }}
        />
      </ImageBackground>
      <View style={{width: '65%'}}>
        <Regular
          numberOfLines={3}
          label={label}
          style={{
            textAlign: 'center',
            fontSize: mvs(fontSize),
            color: colors.primary,
          }}
        />
      </View>
      <ImageBackground
        resizeMode="contain"
        source={TAKE_TO_IMAGES.placeholder}
        style={{
          height: mvs(23),
          width: mvs(23),
          borderRadius: mvs(11.5),
          overflow: 'hidden',
          backgroundColor: colors.lightgrey,
        }}>
        <Image
          resizeMode="contain"
          source={imageTo}
          style={{
            height: '100%',
            width: '100%',
          }}
        />
      </ImageBackground>
    </View>
  );
};

export default OrderDestinationAddress;

const styles = StyleSheet.create({});
