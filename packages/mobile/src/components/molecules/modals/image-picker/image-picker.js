import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import colors from '../../../../config/colors';
import {mvs} from '../../../../config/metrices';
import Medium from '../../../../presentation/typography/medium-text';
import Regular from '../../../../presentation/typography/regular-text';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const ImagePicker = ({
  visible,
  onSubmit,
  onClose,
  showDelete = true,
  ...props
}) => {
  const [btnList, setBtnList] = React.useState([]);
  React.useEffect(() => {
    setBtnList(
      showDelete
        ? [
            {label: 'Camera', slug: 'Camera', icon: 'photo-camera'},
            {label: 'Gallery', slug: 'Gallery', icon: 'photo'},
            {label: 'Delete', slug: 'Delete', icon: 'delete'},
          ]
        : [
            {label: 'Camera', slug: 'Camera', icon: 'photo-camera'},
            {label: 'Gallery', slug: 'Gallery', icon: 'photo'},
          ],
    );
  }, [showDelete]);
  return (
    <ReactNativeModal
      onBackdropPress={() => onClose(false)}
      isVisible={visible}
      style={{margin: 0, padding: 0}}
      onBackButtonPress={() => onClose(false)}>
      <View style={styles.CONTAINER}>
        <Medium label={'Choose Profile Photo'} style={styles.HEADING_TXT} />
        <View style={styles.SUB_CONTAINER}>
          {btnList?.map((el, index) => (
            <View
              key={index}
              style={{
                width: mvs(80),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => onSubmit(el.slug)}
                style={styles.BTN_CONTAINER}>
                <MaterialIcons
                  name={el.icon}
                  size={mvs(20)}
                  color={colors.primary}
                />
              </TouchableOpacity>
              <Regular
                label={el.label}
                style={{marginTop: mvs(10), fontSize: mvs(13)}}
              />
            </View>
          ))}
        </View>
      </View>
    </ReactNativeModal>
  );
};

export default ImagePicker;

const styles = StyleSheet.create({
  CONTAINER: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: mvs(20),
    borderTopRightRadius: mvs(20),
    backgroundColor: colors.primary,
  },
  HEADING_TXT: {
    fontSize: mvs(15),
    color: colors.white,
    alignSelf: 'center',
    marginTop: mvs(13),
    marginBottom: mvs(16),
  },
  SUB_CONTAINER: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    paddingTop: mvs(20),
    paddingBottom: mvs(38),
    paddingHorizontal: mvs(22),
    borderTopLeftRadius: mvs(20),
    borderTopRightRadius: mvs(20),
  },
  BTN_CONTAINER: {
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.headerTitle,
    height: mvs(40),
    width: mvs(40),
    borderRadius: mvs(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
