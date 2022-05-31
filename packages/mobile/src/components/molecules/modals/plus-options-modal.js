import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import * as Icons from '../../../../resource/assets/chat-options-modal-icons';
import colors from '../../../config/colors';
import {mvs} from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';
import Buttons from '../../atoms/Button';


const PlusOptionsModal = ({visible, onClose, onPress,list=[
  {icon: 'Camera', title: 'Camera'},
  {icon: 'Gallery', title: 'Photo & Video Library'},
  {icon: 'doc', title: 'Document'},
  {icon: 'audio', title: 'Audio'},
  {icon: 'Location', title: 'Location'},
]}) => {
  const Item = ({icon = 'Call', title, index}) => {
    const Icon = Icons[icon];
    return (
      <TouchableOpacity
        onPress={() => onPress(title)}
        style={{
          ...styles.item,
          borderBottomWidth: index !== 4 ? StyleSheet.hairlineWidth : 0,
          borderTopWidth: index !== 0 ? StyleSheet.hairlineWidth : 0,
        }}>
        <Icon height = {mvs(20)} width = {mvs(20)} />
        <Regular label={title} style={{marginLeft: mvs(23)}} />
      </TouchableOpacity>
    );
  };
  return (
    <ReactNativeModal
      propagateSwipe
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection='down'
      style={{margin: 0}}>
      <View
        style={{
          alignSelf: 'center',
          backgroundColor: colors.white,
          width: '100%',
          paddingHorizontal: mvs(22),
          paddingVertical: mvs(15),
          paddingBottom : Platform.OS == 'ios' ? mvs(30) : mvs(17),
          position: 'absolute',
          bottom: 0,
          borderTopLeftRadius: mvs(20),
          borderTopRightRadius: mvs(20),
        }}>
        {list.map((ele, index) => (
          <Item key={index} index={index} {...ele} />
        ))}
        <Buttons.ButtonSecondaryOutline
          onClick={onClose}
          style={{marginTop: mvs(20)}}
          title={'Cancel'}
        />
      </View>
    </ReactNativeModal>
  );
};
export default PlusOptionsModal;
const styles = StyleSheet.create({
  item: {
    paddingVertical: mvs(12),
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.doted,
  },
});
