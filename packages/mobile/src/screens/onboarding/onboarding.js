import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GPSState from 'react-native-gps-state'
import React, { useState, useEffect } from 'react';
import {
  Alert,
  Animated,
  AppState,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { connect } from 'react-redux';
import TAKE_TO_MOCK from '../../../../common/utils/mock';
import { BgLogo } from '../../../resource/assets/common-icons';
import Buttons from '../../components/atoms/Button';
import CustomSwitch from '../../components/atoms/Switch';
import InstractionCard from '../../components/molecules/instraction-card-doted';
import SettingCard from '../../components/molecules/setting_card/setting-card';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { mvs } from '../../config/metrices';
import Medium from '../../presentation/typography/medium-text';
import Regular from '../../presentation/typography/regular-text';
import DropdownAlert from 'react-native-dropdownalert';
import messaging from '@react-native-firebase/messaging';

const data = TAKE_TO_MOCK.onBoardContentList;
const { width } = Dimensions.get('window');
const DOT_SIZE = mvs(9);
const Pagination = ({ scrollX }) => {
  const inputRange = [-width, 0, width];
  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: [-(DOT_SIZE + 10), 0, DOT_SIZE + 10],
  });
  return (
    <View style={[styles.pagination]}>
      <Animated.View
        style={[
          styles.paginationDot,
          {
            position: 'absolute',
            transform: [{ translateX }],
            zIndex: 1001,
            backgroundColor: colors.primary,
            // right:10,
          },
        ]}
      />
      {data.map((item, index) => {
        return (
          <View key={index} style={styles.paginationDotContainer}>
            <View style={[styles.paginationDot]} />
          </View>
        );
      })}
    </View>
  );
};

const Onboarding2 = props => {
  const {
    fetchCountriesList,
    fetchUserInfo,
    fetchLangauge,
    changeDefaultCountry,
    countriesList,
    langauge,
  } = props;
  global.navLinking = props?.navigation
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const scrollRef = React.useRef(null);
  const alertRef = React.useRef(null);
  const shop_from_abroad_list =
    langauge?.translations?.shop_from_abroad_list || {};
  const make_money_traveling_list =
    langauge?.translations?.make_money_traveling_list || {};
  const btnTranslation = langauge?.translations?.button || {};
  const onBoardingTranslation =
    langauge?.translations?.onboarding_screens || {};
  const gray_modal_lable = langauge?.translations?.gray_modal || {};

  // console.log(shop_from_abroad_list);

  const [shopFromAbroad, setShopFromAbroad] = React.useState([]);
  const [makeMoney, setMakeMoney] = React.useState([]);

  React.useEffect(() => {

    setShopFromAbroad([
      {
        title: shop_from_abroad_list['create_your_order'],
        description: shop_from_abroad_list['create_your_order_content'],
      },
      {
        title: shop_from_abroad_list['recieve_offers'],
        description: shop_from_abroad_list['recieve_offers_content'],
      },
      {
        title: shop_from_abroad_list['pay_secure'],
        description: shop_from_abroad_list['pay_secure_content'],
      },
      {
        title: shop_from_abroad_list['recieve_your_order'],
        description: shop_from_abroad_list['recieve_your_order_content'],
      },
    ]);

    setMakeMoney([
      {
        title: make_money_traveling_list['add_trip'],
        description: make_money_traveling_list['add_trip_content'],
      },
      {
        title: make_money_traveling_list['make_Offers'],
        description: make_money_traveling_list['make_Offers_content'],
      },
      {
        title: make_money_traveling_list['buy_product'],
        description: make_money_traveling_list['buy_product_content'],
      },
      {
        title: make_money_traveling_list['deliver_get_paid'],
        description: make_money_traveling_list['deliver_get_paid_content'],
      },
    ]);
  }, [langauge]);

  const [payload, setPayload] = React.useState({
    isPromotionEmail: false,
    isOrderEmail: false,
    isLocation: false,
  });

  const viewableItemsChanged = React.useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = React.useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;


  const locationSettingAlert = () => {
    Alert.alert(
      'Location',
      'Do you want to change Location Permission from mobile Settings',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        { text: 'OK', onPress: () => Platform.OS==='android'? GPSState.openAppDetails():Linking.openURL("app-settings:") }
      ]
    );
  }
  const changeLocationService = async (is_app_state_changed = false) => {
    let flag = false
    //alert(is_app_state_changed)
    // GPSState.isAuthorized()
    // alert(gps)
    if (is_app_state_changed) {
      flag = await UI_API._getLocPermissionStatus(Linking, alertRef);
      if (flag == true) {
        await getCurrentLocation();
      }
      if (flag === 'disabled') {
        locationSettingAlert();
      } else {
        setPayload({ ...payload, isLocation: flag });
      }
    } else {
      locationSettingAlert();
    }


  }

  const appState = React.useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", async nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");
        if(payload?.isLocation){
          const permissionStatus = await UI_API._checkPermissions(alertRef, Linking)
          setPayload({ ...payload, isLocation: permissionStatus === 'disabled' ? false : permissionStatus });
        }
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState", appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const getCurrentLocation = async () => {
    try {
      const request = await UI_API._get_current_location();
      if (request) {

        const address = await UI_API._returnGeoCodeData(request);
        const country = countriesList.find(el => el?.name === address?.country);

        country !== undefined && changeDefaultCountry(country);

      }
    } catch (error) {
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };
  const getAsyncStoreData = async () => {
    try {
      const location = await AsyncStorage.getItem('@location');
      const skipOnBoarding = await AsyncStorage.getItem('@onboarding');

      if (location) {
        setPayload({ ...payload, isLocation: true });
      }
      await fetchCountriesList();
      await fetchLangauge();
      const jsonValue = await AsyncStorage.getItem('@token');
      if (jsonValue != null) {
        props.onChangeGuest(false);
        await fetchUserInfo();

        props.navigation?.replace('main');
      } else if (skipOnBoarding) {
        props.navigation.replace('login')
      }
      setTimeout(() => {
        SplashScreen.hide();
      }, 1000)
    } catch (error) {
      SplashScreen.hide();
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };

  const { width } = useWindowDimensions();

  React.useEffect(() => {
    getAsyncStoreData();
  }, []);

  // React.useEffect(() => {
  //   if (countriesList?.length > 0) {

  //   }
  // }, [countriesList])


  const onBoardingHandler = async () => {
    await AsyncStorage.setItem('@onboarding', UI_API._returnStringify(true));
    props.navigation.replace('login')
  }

  return (
    <View style={styles.container}>
      <FlatList
        // contentContainerStyle={{ backgroundColor: 'gray', flex: 1 }}
        data={data}
        horizontal
        pagingEnabled
        bounces={false}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: { x: scrollX },
              },
            },
          ],
          {
            useNativeDriver: false,
          },
        )}
        scrollEventThrottle={32}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={scrollRef}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View
            style={{
              flex: 1,
              backgroundColor: colors.white,
              width,
              marginBottom: mvs(110),
            }}>
            {index !== 0 && index !== 1 && (
              <View style={{ marginTop: mvs(50, 1.5) }}>
                <View style={{}}>
                  <Medium style={styles.title} label={item.title} />
                </View>
                <Regular style={{...styles.description,}} label={item.content} />
              </View>
            )}
            {index === 0 && (
              <>
                <BgLogo
                  width={mvs(500)}
                  height={mvs(300)}
                  style={{
                    position: 'absolute',
                    top: mvs(-110),
                    left: mvs(-162),
                    //transform: [{ rotate: "-10deg" }]
                  }}
                />
                <View style={{ marginTop: mvs(200, 1.5) }}>
                  <Image
                    source={require('./../../../resource/assets/logo/banner_img.png')}
                    resizeMode="contain"
                    style={{
                      height: mvs(175),
                      width: mvs(150),
                      alignSelf: 'center',
                      bottom: 0,
                    }}
                  />
                </View>
              </>
            )}
            {index === 1 && (
              <View style={{ marginTop: mvs(50, 1.5) }}>
                <Image
                  source={require('./../../../resource/assets/logo/delivery_img.png')}
                  resizeMode="cover"
                  style={{ height: mvs(360, 2.7), width }} //300
                />
              </View>
            )}
            <View
              style={{
                position: 'absolute',
                top: index === 0 || index === 1 ? mvs(400, 1.5) : mvs(220, 1.5),
                width,
              }}>
              {(index === 0 || index === 1) && (
                <React.Fragment>
                  <View style={{}}>
                    <Text style={styles.title}>
                      {index === 0
                        ? onBoardingTranslation['welcome_taketo']
                        : onBoardingTranslation['notification_and_location']}
                    </Text>
                  </View>
                  <Text style={styles.description}>
                    {index === 0
                      ? onBoardingTranslation['welcome_taketo_def']
                      : onBoardingTranslation['shop_from_abroad_content']}
                  </Text>
                </React.Fragment>
              )}
              {index === 1 && (
                <View
                  style={{
                    paddingHorizontal: mvs(22),
                    marginTop: mvs(35),
                  }}>
                  <SettingCard style={{ marginTop: mvs(0) }}>
                    <CustomSwitch
                      style={{ marginTop: mvs(0) }}
                      value={payload.isOrderEmail}
                      label={gray_modal_lable['notifications']}
                      onChange={v => setPayload({ ...payload, isOrderEmail: v })}
                    />
                    <CustomSwitch
                      style={{ marginTop: mvs(15) }}
                      value={payload.isLocation}
                      label={gray_modal_lable['location_services']}
                      onChange={state => changeLocationService(state)}
                    />
                  </SettingCard>
                </View>
              )}
              {index === 2 && (
                <View
                  style={{
                    marginHorizontal: mvs(22),
                    paddingLeft: mvs(5),
                  }}>
                  {shopFromAbroad.map((abroad, index) => (
                    <View style={{}} key={index}>
                      <InstractionCard
                        title={abroad.title}
                        detail={abroad.description}
                        border={shopFromAbroad.length - 1 !== index}
                      />
                    </View>
                  ))}
                </View>
              )}
              {index === 3 && (
                <View
                  style={{
                    marginHorizontal: mvs(22),
                    paddingLeft: mvs(5),
                  }}>
                  {makeMoney.map((abroad, index) => (
                    <View style={{}} key={index}>
                      <InstractionCard
                        title={abroad.title}
                        detail={abroad.description}
                        border={makeMoney.length - 1 !== index}
                      />
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}
      />

      <Pagination scrollX={scrollX} width={width} />
      <View style={styles.BUTTON_CONTAINER}>
        <Buttons.ButtonPrimary
          onClick={() => {
            if (currentIndex === 3) {
              onBoardingHandler()
            } else {
              setCurrentIndex(currentIndex + 1);
              scrollRef.current.scrollToIndex({
                animated: false,
                index: currentIndex + 1,
                viewOffset: 1,
                viewPosition: 0.5,
              });
            }
          }}
          title={
            currentIndex !== 3
              ? btnTranslation['next']
              : btnTranslation['get_started']
          }
          style={{
            width: currentIndex !== 3 ? '49%' : '100%',
          }}
        />
        {currentIndex !== 3 && (
          <Buttons.ButtonSecondaryOutline
            onClick={onBoardingHandler}
            title={btnTranslation['skip']}
            style={{
              width: '49%',
            }}
          />
        )}
      </View>
      <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'}  inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
    </View>
  );
};

const mapStateToProps = state => {
  return {
    authData: state.auth,
    countriesList: state.common.countriesList,
    langauge: state.common?.langauge,
  };
};

const mapDispatchToProps = dispatch => ({
  onChangeGuest: () => dispatch(TAKE_TO_ACTIONS.onChangeGuest(false)),
  fetchCountriesList: () => dispatch(TAKE_TO_ACTIONS.fetchCountriesList()),
  fetchUserInfo: () => dispatch(TAKE_TO_ACTIONS.fetchUserInfo()),
  fetchLangauge: () => dispatch(TAKE_TO_ACTIONS.fetchLangauge()),
  changeDefaultCountry: obj =>
    dispatch(TAKE_TO_ACTIONS.changeDefaultCountry(obj)),
});
// export default SignInScreen;
export default connect(mapStateToProps, mapDispatchToProps)(Onboarding2);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  BUTTON_CONTAINER: {
    width: '100%',
    paddingHorizontal: mvs(22),
    position: 'absolute',
    bottom: mvs(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    flex: 1,
    width: '100%',
  },
  title: {
    color: colors.primary,
    fontSize: mvs(20),
    // alignSelf: 'center',
    fontFamily: fonts.carosSoftMedium,
    textAlign: 'left',
    marginLeft: mvs(22),
    marginTop: mvs(35),
  },
  description: {
    color: colors.headerTitle,
    fontSize: mvs(13),
    fontFamily: fonts.carosSoftRegular,
    textAlign: 'left',
    marginLeft: mvs(22),
    marginTop: mvs(7),
  },

  pagination: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: mvs(90),
    flexDirection: 'row',
    height: DOT_SIZE,
  },
  paginationDot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: colors.gray,
  },
  paginationDotContainer: {
    marginRight: 10,
    width: DOT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationIndicator: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: 2,
    // borderColor: ,
    backgroundColor: colors.headerTitle,
  },
});
