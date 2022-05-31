import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import UI_API from '../../../../common/store/services';
import TAKE_TO_CONSTANT from '../../../../common/utils/utils';
import Buttons from '../../components/atoms/Button';
import Header from '../../components/molecules/header/header-1x';
import DropdownAlert from 'react-native-dropdownalert';
import InputWithTitle from '../../components/molecules/input-with-title';
import DatePickerModal from '../../components/molecules/modals/date-picker-modal';
import DeliveryLocationModal from '../../components/molecules/modals/delivery-location-modal';
import SearchLocationModal from '../../components/molecules/modals/search-location-modal/searchlocation-modal';
import colors from '../../config/colors';
import {mvs} from '../../config/metrices';
import Regular from '../../presentation/typography/regular-text';
import {TAKE_TO_INPUT_FIELD} from '../../components/atoms';

const OrderDeliveryDetail = props => {
  let isFoucs = useIsFocused();
  const alertRef = React.useRef(null);
  const [locationModal, setLocationModal] = useState(false);
  const {
    navigation,
    route,
    selectedDeliveryAddress,
    fetchDeliveryAddress,
    profileData,
  } = props;
  const [tempDate, setTempDate] = useState('');
  const {isLocal} = route?.params;
  const [payload, setPayload] = React.useState({
    ...route.params.payload,
    isTraveller: true,
    isCarrier: false,
    storeAddress: '',
    reward: '',
    is24Days: true,
    is2Days: false,
    is3Days: false,
    isUrgent: true,
    deliveryLocation: '',
  });

  React.useEffect(() => {
    fetchDeliveryAddress('');
  }, []);

  useEffect(() => {
    //console.log("selectedDeliveryAddress:", selectedDeliveryAddress)
    setPayload({
      ...payload,
      deliveryLocation: selectedDeliveryAddress,
    });
  }, [selectedDeliveryAddress]);

  useEffect(() => {
    setPayload({
      ...payload,
      storeAddress: payload?.shopAddress,
    });
  }, []);

  const [visible, setVisible] = React.useState(false);
  const [list, setList] = React.useState([
    {
      title: 'Home Salmiya',
      subTitle: '5 St. 4 lane, Salmiya',
      isSelected: true,
      iconName: 'map',
    },
    {
      title: 'Work',
      subTitle: 'Kuwait, Dhow tower',
      isSelected: false,
      iconName: 'map',
    },
    {
      title: 'Deliver to current location',
      subTitle: 'Allow Taketo to access your location',
      isSelected: false,
      iconName: 'any',
    },
    {
      title: 'Deliver to a different location',
      subTitle: 'Choose location on map',
      isSelected: false,
      iconName: 'any',
    },
  ]);

  const [dateOption, setDateOption] = React.useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);

  const hideDatePicker = d => {
    //  console.log("date::", d);
    // console.log(`${date?.day} / ${date?.month+1} / ${date?.year}`);
    setPayload({
      ...payload,
      date: `${d?.day}-${d?.month + 1}-${d?.year}`, //moment({years: d.year, months: d.month, days: d.day}),
    });
    setTempDate(`${d?.day} / ${d?.month + 1} / ${d?.year}`);
    // setPayload({
    //   ...payload,
    //   [option]: moment().format('YYYY-MM-DD'), //`${new Date().getDate()} / ${new Date().getMonth()} / ${new Date().getFullYear()}`,
    // });

    setDatePickerVisibility(false);
  };

  const showDatePicker = option => {
    // if (!payload[option]) {

    setDateOption(option);
    setDatePickerVisibility(true);
  };

  const isDisplay = payload?.country
    ? payload?.country !== payload?.deliveryLocation?.country
    : payload?.storeAddress?.country
    ? payload?.storeAddress?.country !== payload?.deliveryLocation?.country
    : true;
  console.log('PAYLOAD :: ', payload);
  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: colors.white}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={{flex: 1, backgroundColor: colors.white}}>
        <Header {...props} title="Delivery Details" allowBackBtn bellIcon />
        <View style={styles.BODY}>
          <ScrollView contentContainerStyle={styles.SCROLL_CONTAINER}>
            <View style={{paddingHorizontal: mvs(22)}}>
              <TouchableOpacity
                disabled={true} //{payload?.isPhysical}
                onPress={() => {
                  setLocationModal(true);
                }}>
                {/* {console.log(payload)} */}
                <InputWithTitle
                  title="Buy from"
                  isRequired
                  titleStyle={{fontSize: mvs(15)}}
                  value={
                    props.route.params.type == 'pstore'
                      ? payload?.shopAddress?.fulladdress
                      : //`${payload?.shopAddress?.street_address}, ${payload?.shopAddress?.street}, ${payload?.shopAddress?.block}, ${payload?.shopAddress?.city}, ${payload?.shopAddress?.country}`
                        //payload?.storeAddress?.fulladdress
                        payload?.country
                  }
                  textStyle={{color: colors.primary}}
                  flagStyle={{
                    top: Platform.OS === 'android' ? mvs(44) : mvs(30),
                  }} //changed from 32 to 44
                  // flag={true}
                  flag={!payload?.isPhysical}
                  multiline //={payload?.isPhysical}
                  flagUri={
                    props.countryList?.find(
                      el =>
                        el.short_name ===
                        (payload?.isPhysical
                          ? payload?.shopAddress?.country_short_name?.toLowerCase()
                          : payload?.country_short_name?.toLowerCase()),
                    )?.flag
                    //  payload?.flag
                  }
                  editable={false}
                  placeholder="Select Store Location"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  fetchDeliveryAddress('');
                  props.navigation.navigate('deliverto');
                }}
                style={{marginTop: mvs(22)}}>
                <InputWithTitle
                  title="Deliver to"
                  isRequired
                  onPress={() => {
                    fetchDeliveryAddress('');
                    props.navigation.navigate('deliverto');
                  }}
                  titleStyle={{fontSize: mvs(15)}}
                  placeholderTextColor={colors.input_placehoder}
                  placeholder="Select"
                  editable={false}
                  multiline
                  value={
                    payload?.deliveryLocation?.fulladdress
                      ? payload?.deliveryLocation?.fulladdress
                      : payload?.deliveryLocation?.address
                  }
                />
              </TouchableOpacity>
            </View>

            <View style={{...styles.BOTTOM_CONTAINER}}>
              <View style={styles.urgentContainer}>
                <Regular label="Urgent Delivery" style={{color: colors.pink}} />
                <Regular
                  label="Extra Rewards apply for deliveries before"
                  style={{
                    fontSize: mvs(12),
                    color: colors.lightgrey2,
                    marginTop: mvs(6),
                  }}
                />
                <View style={styles.radiosContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setPayload({
                        ...payload,
                        is24Days: true,
                        is3Days: false,
                        is2Days: false,
                        reward: '',
                        isUrgent: true,
                        date: '',
                      });
                      setTempDate('');
                    }}
                    style={{
                      ...styles.radioBox,
                      ...colors.shadow,
                      shadowColor: payload.is24Days
                        ? colors.black
                        : colors.white,
                      elevation: payload.is24Days ? 10 : 0,
                      borderWidth: payload.is24Days ? 0 : mvs(0.5),
                    }}>
                    <View style={styles.radioOuter}>
                      <View
                        style={{
                          ...styles.radioInner,
                          backgroundColor: payload.is24Days
                            ? colors.pink
                            : colors.secondary,
                        }}></View>
                    </View>
                    <Regular label="24 hours" style={styles.time} />
                    <View
                      style={{
                        ...styles.rewardMainContainer,
                        backgroundColor: payload.is24Days
                          ? colors.pink
                          : colors.secondary,
                      }}>
                      <Regular
                        label={'Reward'}
                        style={{
                          fontSize: mvs(12),
                          marginTop: mvs(4),
                          color: payload.is24Days
                            ? colors.white
                            : colors.headerTitle,
                        }}
                      />
                      <View style={styles.price_container}>
                        <TextInput
                          placeholder={payload.is24Days ? '0' : undefined}
                          placeholderTextColor={colors.input_placehoder}
                          textAlign="center"
                          style={{
                            width: '50%',
                            color: colors.primary,
                            padding: 0,
                            fontSize: mvs(15),
                          }}
                          value={payload.is24Days ? payload.reward : null}
                          keyboardType="number-pad"
                          editable={payload.is24Days}
                          onChangeText={txt => {
                            if (txt === '') {
                              setPayload({
                                ...payload,
                                reward: txt.trim(),
                              });
                            } else if (TAKE_TO_CONSTANT.floatValidation(txt)) {
                              setPayload({
                                ...payload,
                                reward: txt.trim(),
                              });
                            }
                          }}
                        />
                        {payload.is24Days && (
                          <Regular
                            label={isLocal? `${profileData?.currency?.currency_code}` : 'USD'}
                          />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setPayload({
                        ...payload,
                        is24Days: false,
                        is3Days: false,
                        is2Days: true,
                        reward: '',
                        isUrgent: true,
                        date: '',
                      });
                      setTempDate('');
                    }}
                    style={{
                      ...styles.radioBox,
                      ...colors.shadow,
                      shadowColor: payload.is2Days
                        ? colors.black
                        : colors.white,
                      elevation: payload.is2Days ? 10 : 0,
                      borderWidth: payload.is2Days ? 0 : mvs(0.5),
                    }}>
                    <View style={styles.radioOuter}>
                      <View
                        style={{
                          ...styles.radioInner,
                          backgroundColor: payload.is2Days
                            ? colors.pink
                            : colors.secondary,
                        }}></View>
                    </View>
                    <Regular label="2 days" style={styles.time} />
                    <View
                      style={{
                        ...styles.rewardMainContainer,
                        backgroundColor: payload.is2Days
                          ? colors.pink
                          : colors.secondary,
                      }}>
                      <Regular
                        label={'Reward'}
                        style={{
                          fontSize: mvs(12),
                          marginTop: mvs(4),
                          color: payload.is2Days
                            ? colors.white
                            : colors.headerTitle,
                        }}
                      />
                      <View style={styles.price_container}>
                        <TextInput
                          textAlign="center"
                          placeholder={payload.is2Days ? '0' : undefined}
                          placeholderTextColor={colors.input_placehoder}
                          style={{
                            width: '50%',
                            color: colors.primary,
                            padding: 0,
                            fontSize: mvs(15),
                          }}
                          value={payload.is2Days ? payload.reward : null}
                          keyboardType="number-pad"
                          editable={payload.is2Days}
                          onChangeText={txt => {
                            if (txt === '') {
                              setPayload({
                                ...payload,
                                reward: txt.trim(),
                              });
                            } else if (TAKE_TO_CONSTANT.floatValidation(txt)) {
                              setPayload({
                                ...payload,
                                reward: txt.trim(),
                              });
                            }
                          }}
                        />
                        {payload.is2Days && (
                          <Regular
                            label={isLocal? `${profileData?.currency?.currency_code}` : 'USD'}
                          />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setPayload({
                        ...payload,
                        is24Days: false,
                        is3Days: true,
                        is2Days: false,
                        reward: '',
                        isUrgent: true,
                        date: '',
                      });
                      setTempDate('');
                    }}
                    style={{
                      ...styles.radioBox,
                      ...colors.shadow,
                      shadowColor: payload.is3Days
                        ? colors.black
                        : colors.white,
                      elevation: payload.is3Days ? 10 : 0,
                      borderWidth: payload.is3Days ? 0 : mvs(0.5),
                    }}>
                    <View style={styles.radioOuter}>
                      <View
                        style={{
                          ...styles.radioInner,
                          backgroundColor: payload.is3Days
                            ? colors.pink
                            : colors.secondary,
                        }}></View>
                    </View>
                    <Regular label="3 days" style={styles.time} />
                    <View
                      style={{
                        ...styles.rewardMainContainer,
                        backgroundColor: payload.is3Days
                          ? colors.pink
                          : colors.secondary,
                      }}>
                      <Regular
                        label={'Reward'}
                        style={{
                          fontSize: mvs(12),
                          marginTop: mvs(4),
                          color: payload.is3Days
                            ? colors.white
                            : colors.headerTitle,
                        }}
                      />
                      <View style={styles.price_container}>
                        <TextInput
                          placeholder={payload.is3Days ? '0' : undefined}
                          placeholderTextColor={colors.input_placehoder}
                          textAlign="center"
                          style={{
                            width: '50%',
                            color: colors.primary,
                            padding: 0,
                            fontSize: mvs(15),
                          }}
                          value={payload.is3Days ? payload.reward : null}
                          keyboardType="number-pad"
                          editable={payload.is3Days}
                          onChangeText={txt => {
                            if (txt === '') {
                              setPayload({
                                ...payload,
                                reward: txt.trim(),
                              });
                            } else if (TAKE_TO_CONSTANT.floatValidation(txt)) {
                              setPayload({
                                ...payload,
                                reward: txt.trim(),
                              });
                            }
                          }}
                        />
                        {payload.is3Days && (
                          <Regular
                            label={isLocal? profileData?.currency?.currency_code : 'USD'}
                          />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              {isDisplay && (
                <View
                  style={{
                    ...styles.dateAndRewardMainContainer,
                    ...colors.shadow,
                    shadowOpacity: 0.2,
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      setPayload({
                        ...payload,
                        is24Days: false,
                        is3Days: false,
                        is2Days: false,
                        isUrgent: false,
                      });
                    }}
                    style={{
                      ...styles.dateAndRewardContainer,
                      elevation:
                        payload?.is24Days ||
                        payload?.is3Days ||
                        payload?.is2Days
                          ? 0
                          : 10,
                      borderWidth:
                        payload?.is24Days ||
                        payload?.is3Days ||
                        payload?.is2Days
                          ? mvs(0.5)
                          : mvs(0),
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Regular
                        label={'Or Deliver before'}
                        style={{color: colors.typeHeader}}>
                        <Regular
                          label={payload?.isUrgent ? '' : '*'}
                          style={{color: colors.mendatory}}
                        />
                      </Regular>
                      <Buttons.ButtonRTL
                        textStyle={{
                          color: tempDate ? colors.primary : colors.label,
                        }}
                        // disabled={ifRadio(radioLabels.label1Way)}
                        onClick={() => {
                          setPayload({
                            ...payload,
                            is24Days: false,
                            is3Days: false,
                            is2Days: false,
                            reward: payload.isUrgent ? '' : payload.reward,
                            isUrgent: false,
                          });
                          showDatePicker('date');
                        }}
                        iconName={!payload?.isUrgent?'date': 'dateGray'}
                        title={
                          // tempDate &&
                          tempDate ||
                          //moment(payload?.date).format('DD / MM / YYYY') ||
                          'Date'
                        }
                        style={{
                          width: '49%',
                          height: mvs(38),
                          flexDirection: 'row-reverse',
                          backgroundColor: colors.secondary,
                        }}
                      />
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: mvs(10),
                      }}>
                      <Regular label={'Reward'}>
                        <Regular
                          label={payload?.isUrgent ? '' : '*'}
                          style={{color: colors.mendatory}}
                        />
                      </Regular>
                      <TAKE_TO_INPUT_FIELD.PriceInput
                        containerStyle={{width: '49%'}}
                        placeholder="0"
                        style={{color: colors.primary}}
                        editable={!payload.isUrgent}
                        value={!payload.isUrgent ? payload.reward : ''}
                        onChangeText={txt => {
                          if (txt === '') {
                            setPayload({
                              ...payload,
                              reward: txt.trim(),
                            });
                          } else if (TAKE_TO_CONSTANT.floatValidation(txt)) {
                            setPayload({
                              ...payload,
                              reward: txt.trim(),
                            });
                          }
                        }}
                        priceUnit={isLocal? profileData?.currency?.currency_code : 'USD'}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              <View style={{paddingHorizontal: mvs(22)}}>
                <Buttons.ButtonPrimary
                  onClick={async () => {
                    console.log("COUNTRY::",payload?.country);
                    try {
                      const response =
                        TAKE_TO_CONSTANT.deliveryDetailsValidation(payload);
                      if (response.status) {
                        if (isLocal) {
                          if (
                            payload?.country ===
                            selectedDeliveryAddress?.country
                          ) {
                            props.navigation.navigate('detailsconfirmation', {
                              payload: {
                                ...payload,
                                date: payload?.date,
                              },
                              isLocal: isLocal
                            });
                          } else {
                            alertRef.current.alertWithType(
                              'error',
                              'Error',
                              'Oops! It seems you forgot to select within the same country delivery location',
                            );
                          }
                        } else if (!isLocal) {
                          if (
                            payload?.country !==
                            selectedDeliveryAddress?.country
                          ) {
                            props.navigation.navigate('detailsconfirmation', {
                              payload: {
                                ...payload,
                                date: payload?.date,
                              },
                              isLocal: isLocal
                            });
                          } else {
                            alertRef.current.alertWithType(
                              'error',
                              'Error',
                              'Oops! You must have to select different country location for delivery address while creating international orders.',
                            );
                          }
                        }
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
                  }}
                  title={payload.isCarrier ? 'Apply & Wait' : 'Next'}
                  style={{
                    backgroundColor: colors.primary,
                    marginTop: mvs(133),
                  }}
                  textStyle={{
                    color: colors.white,
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </View>
        <DeliveryLocationModal
          list={list}
          selectedLocation={payload.deliveryLocation}
          visible={visible}
          onClose={() => {
            setVisible(false);
            const selectedItem = list.find(ele => ele.isSelected);
            console.log('sele: ', selectedItem);
            setPayload({...payload, deliveryLocation: selectedItem?.title});
          }}
          onCancel={() => setVisible(false)}
          onChangeSelection={(item, index) => {
            const copy = [...list.map(ele => ({...ele, isSelected: false}))];
            item.isSelected = true;
            copy[index] = item;
            setList(copy);
          }}
        />

        <DatePickerModal
          visible={isDatePickerVisible}
          onClose={() => {
            setDatePickerVisibility(false);
          }}
          onApply={d => hideDatePicker(d)}
        />

        <SearchLocationModal
          visible={locationModal}
          setVisible={() => {
            setLocationModal(false);
          }}
          setLocation={res => {
            console.log(res);
            setPayload({
              ...payload,
              storeAddress: res,
            });
          }}
        />
      </View>
      <DropdownAlert zIndex={5} 
        elevation={15}
        translucent
        activeStatusBarStyle={'light-content'}
        inactiveStatusBarBackgroundColor={colors.primary}
        ref={alertRef}
      />
    </KeyboardAvoidingView>
  );
};

//export default OrderDeliveryDetail;
const mapStateToProps = state => {
  return {
    // addressesList: state.auth.userInfo?.addresses || [],
    selectedDeliveryAddress: state.common.selectedDeliveryAddress,
    profileData: state.auth.userInfo?.profile || {},
    countryList: state.common.countriesList || [],
  };
};

const mapDispatchToProps = dispatch => ({
  fetchDeliveryAddress: data =>
    dispatch(TAKE_TO_ACTIONS.fetchDeliveryAddress(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrderDeliveryDetail);

const styles = StyleSheet.create({
  SCROLL_CONTAINER: {
    flexGrow: 1,
    paddingBottom: mvs(100),
    paddingTop: mvs(27),
  },
  BODY: {
    flex: 1,
    backgroundColor: colors.white,
  },
  CARD: {
    paddingTop: mvs(29),
    backgroundColor: colors.white,
    paddingBottom: mvs(20),
    paddingHorizontal: mvs(22),
    borderBottomEndRadius: mvs(20),
    borderBottomStartRadius: mvs(20),
  },
  BOTTOM_CONTAINER: {
    //borderWidth : 1
  },
  URGENT_CONTAINER: {
    padding: mvs(15),
    backgroundColor: colors.white,
    borderRadius: mvs(10),
    marginTop: mvs(22),
  },
  FLAG_BUTTON: {
    // width: mvs(161),
    height: mvs(38),
    flexDirection: 'row-reverse',
    backgroundColor: colors.secondary,
  },
  ROW: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.price_border,
    paddingBottom: mvs(10),
  },
  DELIVERY_LOC: {
    backgroundColor: colors.secondary,
    alignItems: 'flex-start',
    paddingHorizontal: mvs(10),
    width: '65%',
    height: mvs(38),
  },
  calendarContainer: {
    backgroundColor: colors.white,
    paddingBottom: mvs(20),
  },
  urgentContainer: {
    //borderWidth : 1,
    paddingHorizontal: mvs(22),
    paddingTop: mvs(22),
    paddingBottom: mvs(30),
  },
  radiosContainer: {
    //height : mvs(121),
    //borderWidth : 1,
    width: '100%',
    marginTop: mvs(18),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioBox: {
    backgroundColor: colors.white,
    borderRadius: mvs(10),
    height: '100%',
    width: '32%',
    alignItems: 'center',
    padding: mvs(5),
    borderWidth: mvs(0.5),
    borderColor: '#BBC0C3',
  },
  radioOuter: {
    height: mvs(15),
    width: mvs(15),
    borderRadius: mvs(15 / 2),
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: mvs(5),
  },
  radioInner: {
    height: mvs(7),
    width: mvs(7),
    borderRadius: mvs(7 / 2),
    backgroundColor: colors.white,
  },
  time: {
    fontSize: mvs(14),
    color: colors.typeHeader,
    marginTop: mvs(7),
  },
  rewardMainContainer: {
    //height : mvs(60),
    width: '100%',
    backgroundColor: colors.secondary,
    marginTop: mvs(10),
    borderRadius: mvs(10),
    padding: mvs(4),
    alignItems: 'center',
  },
  rewardContainer: {
    //  paddingHorizontal : mvs(14),
    // paddingVertical : mvs(9),
    padding: 0,
    paddingHorizontal: mvs(10),
    backgroundColor: colors.white,
    borderRadius: mvs(10),
    marginTop: mvs(5),
    width: '100%',
    height: mvs(31),
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.primary,
  },
  dateAndRewardMainContainer: {
    paddingHorizontal: mvs(22),
  },
  dateAndRewardContainer: {
    borderWidth: mvs(0.5),
    //height : mvs(120),
    borderRadius: mvs(10),
    borderColor: '#BBC0C3',
    padding: mvs(10),
    backgroundColor: colors.white,
  },
  price_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: mvs(10),
    width: '100%',
    marginTop: mvs(5),
    height: mvs(31),
    paddingHorizontal: mvs(9),
  },
});
