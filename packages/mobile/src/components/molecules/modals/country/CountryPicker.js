import React from 'react';

import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {mvs} from '../../../../config/metrices';
import colors from '../../../../config/colors';
import Regular from '../../../../presentation/typography/regular-text';
import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import CountryPickr from 'react-native-country-picker-modal'

const CountryPicker = ({
  visible,
  onClose,
  onSelect,
  activeCountry,
  countriesList,
  activeCountryList,
  ...props
}) => {

  const [list,setList]=React.useState(countriesList)
  // console.log(countriesList);

  // const renderItem = ({item, index}) => {
  //   return (
  //     <TouchableOpacity
  //       activeOpacity={0.8}
  //       onPress={() => {
  //         setList(UI_API._returnNewCountryList(countriesList, index));
  //         onSelect(item?.name, item?.flag,item?.short_name);
  //       }}
  //       style={{
  //         ...styles.ITEM,
  //         backgroundColor: item?.isActive ? colors.primary : colors.white,
  //       }}>
  //       <Image
  //         style={styles.FLAG}
  //         source={{uri: item?.flag}}
  //         resizeMode="center"
  //       />
  //       <Regular
  //         label={item?.name}
  //         style={{
  //           marginHorizontal: mvs(10),
  //           color: item?.isActive ? colors.white : colors.headerTitle,
  //         }}
  //       />
  //     </TouchableOpacity>
  //   );
  // };

  return (
    <CountryPickr
      visible={visible}
      withFilter
      onSelect={(item) => 
        onSelect(
        item?.name,
        countriesList?.find(x => x.name == item?.name)?.flag,
        item?.cca2)
      }
      />
    // <Modal
    //   isVisible={visible}
    //   onBackButtonPress={onClose}
    //   onBackdropPress={onClose}
    //   style={{margin: 0, padding: 0, justifyContent: 'flex-end'}}>
    //   <View style={styles.CONTAINER}>
    //     <FlatList
    //       data={list}
    //       keyExtractor={(item, index) => index.toString()}
    //       contentContainerStyle={{padding: mvs(20)}}
    //       renderItem={renderItem}
    //     />
    //   </View>
    // </Modal>
  );
};

const mapStateToProps = state => {
  return {
    countriesList: state.common.countriesList,
  };
};

const mapDispatchToProps = dispatch => ({
  activeCountryList: list => dispatch(TAKE_TO_ACTIONS.activeCountryList(list)),
});
export default connect(mapStateToProps, mapDispatchToProps)(CountryPicker);

const styles = StyleSheet.create({
  CONTAINER: {
    // flex:1
    height: mvs(400),
    width: '100%',
    backgroundColor: colors.white,
    borderTopRightRadius: mvs(10),
    borderTopLeftRadius: mvs(10),
    alignSelf: 'center',
  },
  ITEM: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.gray,
    paddingVertical: mvs(10),
    paddingHorizontal: mvs(20),
    borderRadius: mvs(10),
  },
  FLAG: {
    height: mvs(30),
    width: mvs(30),
    borderRadius: mvs(15),
  },
});
