import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  // ActivityIndicator,
  // KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView as KeyboardAvoidingView } from 'react-native-keyboard-aware-scroll-view';
import { mvs } from '../../config/metrices';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { StarTick } from '../../../resource/assets/profile';
import { TAKE_TO_INPUT_FIELD } from '../../components/atoms';
import Buttons from '../../components/atoms/Button';
import Header from '../../components/molecules/header/header-1x';
import PublicRating from '../../components/molecules/profile/public-rating';
import UserInfo from '../../components/molecules/profile/user-info';
import UserRating from '../../components/molecules/profile/user-rating';
import colors from '../../config/colors';
import Medium from '../../presentation/typography/medium-text';
import Regular from '../../presentation/typography/regular-text';
import RatingSubmittedModal from '../../components/molecules/modals/rating-submited-modal';
import { connect } from 'react-redux';
import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import DropdownAlert from 'react-native-dropdownalert';
import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import { Chase } from 'react-native-animated-spinkit';
const UserProfile = props => {
  const { route, navigation, publicUserInfo, fetchPublicUserInfo, profileData } = props;
  const { user_id, is_review, order_id } = route?.params;
  const [ratingSubmittedModal, setRatingSubmittedModal] = React.useState(false)
  const [loading, setLoading] = React.useState(false);
  console.log(publicUserInfo)
  const [payload, setPayload] = React.useState({});
  console.log('payload:::::', payload);
  const [isSubmitReview, setIsSubmitReviews] = React.useState(false)
  const alertRef = React.useRef();

  const [ratingLoader, setRatingLoader] = React.useState(false)

  console.log('publicUserInfo::', publicUserInfo);
  const getPublicUserInfo = async (setLoading) => {
    try {
      setLoading(true);
      await fetchPublicUserInfo(user_id);
    } catch (error) {
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    } finally {
      setLoading(false);
    }
  }
  React.useEffect(() => {
    // console.log('props::',props?.route?.params);
    if (user_id) {
      getPublicUserInfo(setLoading);
    }
  }, [user_id])

  React.useEffect(() => {
    setPayload({
      communicationStar: publicUserInfo?.communication,
      // valueStar: publicUserInfo?.punctuality,
      ServiceStar: publicUserInfo?.service,
      PunctualityStar: publicUserInfo?.punctuality,
      review: '',
    })
  }, [publicUserInfo])

  console.log('payload::', payload);
  const submitRatingHandler = async () => {
    try {
      const response = TAKE_TO_CONSTANT.submitReviewValidation(payload);
      if (!response.status) {
        alertRef.current.alertWithType(
          'error',
          'Error',
          response.message,
        );
        return;
      }
      const data = {
        "user_id": user_id,
        "order_id": order_id,
        "comment": payload?.review,
        "comunication_rating": payload?.communicationStar,//
        "value_rating": 0,
        "punctuality_rating": payload?.PunctualityStar,//
        "service_rating": payload?.ServiceStar//
      }

      // return console.log(data)
      setRatingLoader(true)
      await client.post('store-reviews', data);
      await getPublicUserInfo(setRatingLoader);
      setIsSubmitReviews(true)
      alertRef.current.alertWithType(
        'success',
        'Reivew Submitted',
        'Your review successfully submitted',
      );
      setTimeout(() => {
        // setRatingSubmittedModal(true)
        props.navigation.navigate(props?.route?.params?.is_traveler ? 'deliveryhistory' : 'orderhistory')

      }, 2000)
      setRatingLoader(false)
    } catch (error) {
      setRatingLoader(false)
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  }

  const bool = publicUserInfo?.rate_by?.some(el => el.order_id === order_id && el.rated_by_id === profileData?.id);
  console.log('bool:::', bool, is_review);
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Header {...props} title="Profile" allowBackBtn userIcon={false} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Chase size={mvs(30)} color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.white }}
    >
      <View style={styles.CONTAINER}>
        <Header {...props} title="Profile" allowBackBtn userIcon={false} />
        <KeyboardAvoidingView nestedScrollEnabled showsVerticalScrollIndicator={false} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} contentContainerStyle={{ flexGrow: 1,paddingTop: mvs(27), }}>
          <UserInfo {...props} />
          <ScrollView style={{ marginTop: mvs(33), }} contentContainerStyle={styles.SCROLL} showsVerticalScrollIndicator={false}>
            {publicUserInfo?.rate_by?.length > 0 && <View style={{ maxHeight: mvs(197), }}>
              <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                {publicUserInfo?.rate_by?.map((item, index) => (
                  <PublicRating {...item} />
                ))}
              </ScrollView>
            </View>}
            <View style={{ marginTop: mvs(18) }}>
              <UserRating
                disabled={!is_review || bool}
                onPress={number =>
                  setPayload({ ...payload, communicationStar: number })
                }
                fill={payload.communicationStar}
                label={'Communication'}
              />
              {/* <UserRating
              onPress={number => setPayload({ ...payload, valueStar: number })}
              fill={payload.valueStar}
              label={'Value'}
            /> */}
              <UserRating
                disabled={!is_review || bool}
                onPress={number => setPayload({ ...payload, ServiceStar: number })}
                fill={payload.ServiceStar}
                label={'Service'}
              />
              <UserRating
                disabled={!is_review || bool}
                onPress={number =>
                  setPayload({ ...payload, PunctualityStar: number })
                }
                fill={payload.PunctualityStar}
                label={'Punctuality'}
              />
            </View>
            {(is_review && !isSubmitReview && !bool) && <>
              <View style={{ marginTop: mvs(17), marginBottom: mvs(20)}}>
                <TAKE_TO_INPUT_FIELD.ReviewInput
                  label='Write a Review'
                  placeholder='Write a Review'
                  style={{ minHeight: mvs(80)}}
                  value={payload.review}
                  onChangeText={text => setPayload({ ...payload, review: text })}
                />
              </View>
              <View
                style={{
                  paddingBottom: mvs(20),
                  width: '100%',
                  backgroundColor: colors.white,
                }}>
                <Buttons.ButtonPrimary
                  loaderColor={colors.white}
                  loading={ratingLoader}
                  disabled={ratingLoader}
                  // onClick={() => props.navigation.navigate('orderhistory')}
                  onClick={submitRatingHandler}
                  title={'Submit Rating'}
                />
              </View>
            </>}
          </ScrollView>

        </KeyboardAvoidingView>
        <RatingSubmittedModal
          onClose={() => setRatingSubmittedModal(false)}
          onOuline={() => {
            setRatingSubmittedModal(false)
            props.navigation.navigate('orderhistory')
          }}
          onPrimary={() => setRatingSubmittedModal(false)} visible={ratingSubmittedModal} />
        <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'} inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
      </View>
    </View>
  );
};
const mapStateToProps = state => ({
  publicUserInfo: state.auth?.publicUserInfo,
  profileData: state.auth.userInfo?.profile || {},
});

const mapDispatchToProps = {
  fetchPublicUserInfo: (user_id) => TAKE_TO_ACTIONS.fetchPublicUserInfo(user_id),
};
export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);


const styles = StyleSheet.create({
  CONTAINER: {
    flex: 1,
    backgroundColor: colors.white,
  },
  BODY: {
    flex: 1,
  },
  SCROLL: {
    paddingHorizontal: mvs(22),
    // paddingBottom:mvs(120)
  },
  LABEL: {},
  LIST_CONTAINER: {
    paddingBottom: mvs(9),
    marginBottom: mvs(15),
    borderColor: colors.price_border,
  },
});
