import React from 'react';
import {
  StyleSheet, View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { TAKE_TO_IMAGES } from '../../../resource/assets/image_resouce';
import { mvs } from '../../config/metrices';

const ImagePlaceholder = ({
  containerStyle,
  style,
  bg_img,
  resizeMode,
  iconStyle,
  ...props
}) => {
  return (
    <>
      <View style={{...containerStyle, overflow: 'hidden'}}>
        <FastImage
        resizeMode={'cover'}
          source={TAKE_TO_IMAGES.placeholder}
          style={{
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            borderRadius: mvs(10),
          }}>
          <FastImage
            source={{uri: bg_img}}
            style={{
              height: '100%',
              width: '100%',
              alignSelf: 'center',
              justifyContent: 'flex-end',
              position: 'absolute',
            }}
            resizeMode={'cover'}
          />
          <View
            style={{
              position: 'absolute',
              width: '100%',
              alignItems: 'center',
              bottom: mvs(5),
              ...style,
            }}>
            {props.children}
          </View>
        </FastImage>
      </View>
    </>
  );
};

export default ImagePlaceholder;

const styles = StyleSheet.create({});
