import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import React from 'react';
import { Keyboard, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView from 'react-native-maps';
import { connect } from 'react-redux';
import UI_API from '../../../../common/store/services';
import TAKE_TO_CONSTANT from '../../../../common/utils/utils';
import { TAKE_TO_INPUT_FIELD } from '../../components/atoms';
import Buttons from '../../components/atoms/Button';
import Header from '../../components/molecules/header/header-1x';
import colors from '../../config/colors';
import DropdownAlert from 'react-native-dropdownalert';
import { mvs } from '../../config/metrices';

const SelectAddress = props => {
  const alertRef = React.useRef(null);
  const [visible, setVisible] = React.useState(false);
  const { fetchShopAddress } = props;
  const [dismissBtn, setDismissBtn] = React.useState(false)

  const [region, setRegion] = React.useState(props.route.params.region||{ 
     latitude: 37.78825,
    latitudeDelta: 0.015,
    longitude: -122.4324,
    longitudeDelta: 0.0121,});

  const [payload, setPayload] = React.useState({
    ...props.route.params.address,
    street_address: '',
  });

  // React.useEffect(() => {
  //   console.log("selectedAddress:", payload)
  // }, [])

  const onConfirm = async () => {
    // console.log('payload:', payload);
    try {
      const response = await TAKE_TO_CONSTANT.shopAddressValidation(payload);
      if (response.status) {
        fetchShopAddress({
          street_address: payload?.street_address,
          street: payload?.street_number,
          block: payload?.area,
          city: payload?.city,
          country: payload?.country,
          latitude: region?.latitude,
          longitude: region?.longitude,
          place_id: payload?.place_id,
          fulladdress: payload?.fulladdress,
          country_short_name: payload?.country_short_name
        });
        props.navigation.pop(2);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      //alert(UI_API._returnError(error));
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }

  };

  React.useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  const _keyboardDidShow = () => {
    setDismissBtn(true)
  };

  const _keyboardDidHide = () => {
    setDismissBtn(false)
  };

  return (
    <View style={styles.CONTAINER}>
      <Header {...props} title="Shop Address" allowBackBtn userIcon={false} />
      <View style={styles.BODY}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.SCROLL}>
          <TouchableOpacity
          onPress={()=>props.navigation.pop()}
            activeOpacity={0.5}
            //onPress={() => props.navigation.navigate('deliverylocation')}
            style={{
              backgroundColor: colors.secondary,
              height: mvs(95),
              borderRadius: mvs(20),
              marginBottom: mvs(20),
              overflow: 'hidden',
              justifyContent: 'center',
            }}>
            <MapView
              initialRegion={region}
              scrollEnabled={false}
              style={{ flex: 1 }}
              zoomEnabled={false}
              showsMyLocationButton={false}
            />

            <View style={styles.pointer} />
          </TouchableOpacity>

          <TAKE_TO_INPUT_FIELD.InputSecondary
            placeholderColor={colors.doted}
            containerStyle={{ marginBottom: mvs(13), width: '100%' }}
            style={{ width: '100%' }}
            onChangeText={text =>
              setPayload({ ...payload, street_address: text })
            }
            label={'Address'}
            placeholder={'Floor/Building/Appartment etc...'}
            value={payload.street_address}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TAKE_TO_INPUT_FIELD.InputSecondary
            isRequired
              placeholderColor={colors.doted}
              containerStyle={{ marginBottom: mvs(13), width: '49%' }}
              style={{ width: '100%' }}
              value={payload.street_number}
              onChangeText={text =>
                setPayload({ ...payload, street_number: text })
              }
              label={'Street'}
              placeholder={'Street/Road'}
            />
            <TAKE_TO_INPUT_FIELD.InputSecondary
            isRequired
              placeholderColor={colors.doted}
              containerStyle={{ marginBottom: mvs(13), width: '49%' }}
              style={{ width: '100%' }}
              value={payload.area}
              onChangeText={text => setPayload({ ...payload, area: text })}
              label={'Area'}
              placeholder={'Area/Block'}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TAKE_TO_INPUT_FIELD.InputSecondary
            isRequired
              containerStyle={{ marginBottom: mvs(13), width: '49%' }}
              style={{ width: '100%' }}
              onChangeText={text => setPayload({ ...payload, city: text })}
              label={'City'}
              placeholder={'City'}
              placeholderColor={colors.doted}
              value={payload.city}
            />
            <TAKE_TO_INPUT_FIELD.InputSecondary
            isRequired
              containerStyle={{ marginBottom: mvs(13), width: '49%' }}
              style={{ width: '100%' }}
              onChangeText={text => setPayload({ ...payload, houseNumber: text })}
              label={'Country'}
              placeholder={'Country'}
              placeholderColor={colors.doted}
              value={payload.country}
              editable={false}
            />
          </View>


        </ScrollView>
        <View style={styles.confirm_button}>
{!dismissBtn&&
        <Buttons.ButtonPrimary
          onClick={onConfirm}
          title={'Confirm'}
        />
}
        </View>
      </View>
      <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'}  inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
    </View>
  );
};

const mapStateToProps = state => {
  return {
    selectedShopAddress: state.common.selectedShopAddress,
  };
};
const mapDispatchToProps = dispatch => ({
  fetchShopAddress: data => dispatch(TAKE_TO_ACTIONS.fetchShopAddress(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectAddress);

const styles = StyleSheet.create({
  CONTAINER: {
    flex: 1,
    backgroundColor: colors.white,
  },
  BODY: {
    flex: 1,
  },
  SCROLL: {
    flexGrow: 1,
    paddingHorizontal: mvs(22),
    paddingTop:mvs(27),
    paddingBottom: mvs(120),

  },
  LABEL: {},
  LIST_CONTAINER: {
    paddingBottom: mvs(9),
    marginBottom: mvs(15),
    borderColor: colors.price_border,
  },
  pointer: {
    height: mvs(21),
    width: mvs(21),
    backgroundColor: colors.primary,
    borderRadius: mvs(21 / 2),
    position: 'absolute',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  confirm_button: {
    position: 'absolute',
    paddingBottom: mvs(40),
    paddingHorizontal:mvs(22),
    bottom:0,
    width:'100%',
  }
});
