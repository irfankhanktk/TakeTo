import UI_API from '@khan_ahmad786/common/store/services';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import ReactNativeModal from 'react-native-modal';
import { connect } from 'react-redux';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';
import Buttons from '../../atoms/Button';
import CustomSwitch from '../../atoms/Switch';
import SettingCard from '../setting_card/setting-card';

const DeliveryAddressRequested = ({
  visible,
  onClose,
  title,
  image,
  name,
  settingCard = false,
  backButton = false,
  step = 1,
  backButtonTitle = 'Back',
  onNext,
  deliveryAddress,
  order_step=false,
  ...props
}) => {
  const navigation = useNavigation();
  const [payload, setPayload] = React.useState({
    isPromotionEmail: true,
    isLocationServices: true,
    isOrderEmail: true,
    isSms: true,
    home: false,
    work: false,
    current: false,
    different: false,
    //step: step
  });
  const [addressesList, setAddressesList] = React.useState(
    props?.addressesList || [],
  );
  const alertRef = React.useRef();
  const [locationLoader, setLocationLoader] = React.useState(false);
  const [location, setLocation] = React.useState({});
  const fetchCurrenLocation = async () => {
    try {
      setLocationLoader(true);
      await UI_API._requestLocationPermission(alertRef, Linking);
      const location = await UI_API._get_current_location();
      // console.log('location :: ', location);
      if (location) {
        setLocation(location);
        let copy = [...addressesList];
        copy = copy.map(e => ({ ...e, selected: false }));

        setAddressesList(copy);
        setPayload({
          home: false,
          work: false,
          current: true,
          different: false,
          step: 1,
        });
      }
      setLocationLoader(false);
    } catch (error) {
      setLocationLoader(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };

  React.useEffect(() => {
    if (addressesList?.length > 1) {
      const copy = [...addressesList];
      copy[0] = { ...copy[0], selected: false };
      setAddressesList(copy);
    }
  }, []);
  const onChangeSlection = (item, index) => {
    try {
      let copy = [...addressesList];
      copy = copy.map(e => ({ ...e, selected: false }));
      if (item && index !== undefined) {
        item.selected = true;
        copy[index] = item;
      }
      setLocation({
        latitude: item?.lat_long?.split(',')[0] * 1,
        longitude: item?.lat_long?.split(',')[1] * 1
      })
      setAddressesList(copy);
    } catch (error) {
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };


  React.useEffect(() => {
    if (deliveryAddress !== undefined && Object.keys(deliveryAddress).length > 0) {
      setLocation(deliveryAddress?.region)
    }
  }, [deliveryAddress])

  // console.log(location)

  const onSendLocation=()=>{
    if(location&&Object.keys(location).length>0){
      onNext(location);
    }else{
      alertRef.current.alertWithType(
        'error',
        'Error',
        'Oops! It seems you have forgot to select delivery location.',
      );
    }
  }
  return (
    <ReactNativeModal
      propagateSwipe
      isVisible={visible}
      avoidKeyboard
      onBackdropPress={() => onClose(false)}
      onBackButtonPress={() => onClose(false)}
      style={{margin: 0, paddingHorizontal: mvs(11)}}>
        <DropdownAlert zIndex={5}  elevation={15}  ref={alertRef}/>
      <View style={styles.mainContainer}>
        {/* {console.log('props.deliveryAddress', props?.deliveryAddress)} */}
        <Regular
          label={
            step == 1
              ? 'Delivery Addresses'
              : step == 2
                ? 'Successful'
                : `Delivery ${order_step?'Confirmation':'Address Requested'}`
          }
          style={styles.header}
        />
        {step != 1 && (
          <Regular
            label={
              step == 0
                ? `Delivery Address was requested by the \n deliverer. Please choose an address.`
                // : step == 3?
                // `Delivery Address was requested.\n You are almost done.`
                :`Delivery ${order_step?'confirmation request was sent to buyer. You will be notified when it’s confirmed.':'Address was requested.\n You are almost done.'}`
            }
            style={styles.heading}
          />
        )}

        {/* {step == 0 && (
          <SettingCard
            heading="Make sure your notifications are on"
            headingStyle={{ alignSelf: 'center' }}
            style={{
              marginTop: mvs(43),
              paddingTop: mvs(13),
              paddingBottom: mvs(7),
            }}>
            <CustomSwitch
              value={payload.isOrderEmail}
              label={'Email'}
              textStyle={{ color: colors.primary }}
              onChange={v => setPayload({ ...payload, isOrderEmail: v })}
              style={{ marginTop: mvs(13) }}
            />
            <CustomSwitch
              style={{ marginTop: mvs(28) }}
              value={payload.isSms}
              label={'SMS'}
              textStyle={{ color: colors.primary }}
              onChange={v => setPayload({ ...payload, isSms: v })}
              style={{ marginTop: mvs(10) }}
            />
          </SettingCard>
        )} */}

        {step == 1 && (
          <>
            <View style={{ marginTop: mvs(23) }}>
              {addressesList?.slice(0, 2)?.map((ele, index) => (
                <Buttons.ButtonDeliveryLocation
                  title={ele?.type} //name
                  iconName="locationActive"
                  titleStyle={{
                    color: payload.home ? colors.primary : colors.typeHeader,
                  }}
                  isTick={ele.selected}
                  // subTitle="5 St. 4 lane, Salmiya"
                  subTitle={`${ele?.street}${ele?.street && ' St.,'}${ele?.city
                    }${ele?.country && ','} ${ele?.country}`}
                  blue={true}
                  style={{ ...styles.deliveryOption, marginTop: mvs(10) }}
                  onClick={() => {
                    setPayload({

                      current: false,
                      different: false,
                      step: 1,
                    });
                    onChangeSlection(ele, index);
                  }}
                />
              ))}
            </View>
            <Buttons.ButtonDeliveryLocation
              title="Deliver to current location"
              iconName="anyBlue"
              isTick={payload.current}
              titleStyle={{
                color: payload.current ? colors.primary : colors.typeHeader,
              }}
              blue={true}
              subTitle="Allow Taketo to access your location"
              style={{ ...styles.deliveryOption, marginTop: mvs(10) }}
              onClick={fetchCurrenLocation}
            />
            {/* {console.log('deliveryAddress ::',deliveryAddress)} */}

            <Buttons.ButtonDeliveryLocation
              title="Deliver to a different location"
              iconName="anyBlue"
              isTick={payload.different}
              titleStyle={{
                color: payload.different ? colors.primary : colors.typeHeader,
              }}
              blue={true}
              subTitle={deliveryAddress?.fulladdress || "Choose location on map"}
              style={{ ...styles.deliveryOption, marginTop: mvs(10),}}
              onClick={() => {
                setPayload({
                  home: false,
                  work: false,
                  current: false,
                  different: true,
                  step: 1,
                });

                onChangeSlection();

                onClose();
                navigation.navigate('deliveryaddress');
              }}
            />
          </>
        )}
        {
          <Buttons.ButtonPrimary

            onClick={() => {
              step == 0 ? {} : step == 1 ? onSendLocation() : onNext();
            }}
            title={
              step == 0
                ? 'Choose Delivery Address'
                : step == 1
                  ? 'Send Delivery Address'
                  : 'Back'
            }
            loading={locationLoader}
            disabled={locationLoader}
            loaderColor={colors.white}
            style={{ marginTop: mvs(30) }}
          />
        }

        {backButton && (
          <Buttons.ButtonSecondaryOutline
            title={backButtonTitle}
            style={{ marginTop: mvs(10) }}
            onClick={onClose}
          />
        )}
      </View>
    </ReactNativeModal>
  );
};

// export default DeliveryAddressRequested
const mapStateToProps = state => {
  return {
    addressesList: state.auth.userInfo?.addresses || [],
    deliveryAddress: state.common.deliveryAddress || {},
  };
};

export default connect(mapStateToProps, {})(DeliveryAddressRequested);

const styles = StyleSheet.create({
  mainContainer: {
    //height : mvs(400),
    width: '90%',
    // paddingHorizontal: mvs(11),
    backgroundColor: colors.white,
    borderRadius: mvs(20),
    alignSelf: 'center',
    paddingTop: mvs(24),
    paddingBottom: mvs(20),
    paddingHorizontal: mvs(10),
  },
  header: {
    fontSize: mvs(20),
    color: colors.primary,
    alignSelf: 'center',
    textAlign:'center'
  },
  heading: {
    fontSize: mvs(15),
    color: colors.typeHeader,
    alignSelf: 'center',
    marginTop: mvs(10),
    textAlign: 'center',
  },
  productMainContainer: {
    width: '100%',
    flexDirection: 'row',
    //borderWidth : 1,
    //height : mvs(210),
    marginTop: mvs(23),
    justifyContent: 'space-between',
  },
  productInfoContainer: {
    width: '49%',
    //borderWidth : 1,
    //paddingLeft : mvs(9)
  },
  name: {
    fontSize: mvs(12),
    color: colors.typeHeader,
    marginTop: mvs(28),
  },
  site: {
    fontSize: mvs(12),
    color: colors.primary,
    marginTop: mvs(9),
  },
  priceContainer: {
    height: mvs(25),
    width: '100%',
    borderTopWidth: mvs(0.5),
    borderBottomWidth: mvs(0.5),
    borderColor: colors.horizontalLine,
    marginTop: mvs(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: mvs(12),
    color: colors.typeHeader,
  },
  rewardContainer: {
    //height : mvs(25),
    width: '100%',
    marginTop: mvs(13),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  rewardTitle: {
    fontSize: mvs(12),
    color: colors.primary,
  },
  reward: {
    fontSize: mvs(18),
    color: colors.primary,
  },
  routeMainContainer: {
    //borderWidth : 1,
    width: '100%',
    marginTop: mvs(15),
    minHeight: mvs(54),
  },
  buttonsContainer: {
    width: '100%',
    marginTop: mvs(25),
    //borderWidth : 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    height: mvs(52),
    width: '49%',
    //borderWidth : 1
  },
  deliveryOption: {
    borderWidth: mvs(0.5),
    paddingHorizontal: mvs(10),
    paddingVertical: mvs(11),
    borderRadius: mvs(10),
    borderColor: colors.lightgrey2,
    marginTop: mvs(33),
  },
});
