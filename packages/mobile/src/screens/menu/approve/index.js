import TAKE_2_API from '@khan_ahmad786/common/api/API';
import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import { TAKE_TO_IMAGES } from '../../../../resource/assets/image_resouce';
import Buttons from '../../../components/atoms/Button';
import ImagePlaceholder from '../../../components/atoms/Placeholder';
import Header from '../../../components/molecules/header/header-1x';
import DeliveryDisputedModal from '../../../components/molecules/modals/dilivery-disputed-modal';
import DisputeModal from '../../../components/molecules/modals/dispute-modal';
import DisputeSubmitModal from '../../../components/molecules/modals/dispute-submit-modal';
import DisputeSubmitedModal from '../../../components/molecules/modals/dispute-submited-modal';
import ProductRejectedModal from '../../../components/molecules/modals/product-rejected-modal';
import RatingSubmittedModal from '../../../components/molecules/modals/rating-submited-modal';
import ReceiptDisputedModal from '../../../components/molecules/modals/receipt-disputed-modal';
import StatusModal from '../../../components/molecules/modals/status-modal';
import StatusWithReasonModal from '../../../components/molecules/modals/status-with-reason-modal';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';
import { KeyboardAwareScrollView as KeyboardAvoidingView } from 'react-native-keyboard-aware-scroll-view';

const Approve = props => {
  const { route, fetchActiveChat, countriesList, navigation } = props;
  const { order_data, thread_id } = route?.params || {};
  // console.log(order_data);
  const alertRef = React.useRef();
  const [type, setType] = useState(props.route.params.type);
  const [approveModal, setApproveModal] = useState(false);
  const [disputedModal, setDisputedModal] = useState(false);
  const [rejectedModal, setRejectedModal] = useState(false);
  const [reason, setReason] = React.useState('i am sure about this');
  const [loadingAppRejProd, setLoadingAppRejProd] = React.useState(false);
  const [loadingAppRejReciep, setLoadingAppReciep] = React.useState(false);
  const [btnName, setBtnName] = React.useState('');
  const [disputSubmitted, setDisputSubmitted] = useState(false);
  const [reOrderLoading, setReOrderLoading] = useState(false);

  const approveOrRejectProduct = async (approve = true) => {
    try {
      const payload = {
        id: order_data?.order_id,
        status: approve ? 'order_step_3' : 'order_step_1',//for resending image from taveler side
        reason: approve ? '' : reason,
        status_approved: approve ? 1 : 0,
        thread_id: order_data?.thread_id
      };
      // setRejectedModal(false)
      approve ? setApproveModal(false) : setRejectedModal(false);
      setLoadingAppRejProd(true);
      await client.post(`update-order-status`, payload);
      await fetchActiveChat(order_data?.thread_id);
      setLoadingAppRejProd(false);
      props.navigation.pop()
    } catch (error) {
      setLoadingAppRejProd(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };

  const approveOrDisputeReciept = async (approve = true) => {
    try {
      const payload = {
        id: order_data?.order_id,
        status: approve ? 'order_step_5' : 'order_step_4',
        reason: approve ? '' : reason,
        status_approved: approve ? 1 : 2,
        thread_id: order_data?.thread_id
      };
      // setDisputedModal(false)
      approve ? setApproveModal(false) : setDisputedModal(false);

      setLoadingAppReciep(true);
      await client.post(`update-order-status`, payload);
      await fetchActiveChat(order_data?.thread_id);
      setLoadingAppReciep(false);
      !approve && setDisputSubmitted(true);
      approve && props.navigation.pop()
    } catch (error) {
      setLoadingAppReciep(false);
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.mainContainer}>
          <Header
            {...props}
            title={order_data?.participant_name}
            allowBackBtn
            userIcon={false}
          />
        <View style={{ flex: 1 }}>
          <KeyboardAvoidingView nestedScrollEnabled showsVerticalScrollIndicator={false} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} contentContainerStyle={{ flexGrow: 1,paddingTop:mvs(27) }}>
            <View style={styles.imageContainer}>
              <ImagePlaceholder
                bg_img={order_data?.product_image}
                containerStyle={styles.image}
              />
            </View>

            <View style={styles.container}>
              {type == 'receipt' && (
                <View style={styles.priceMainContainer}>
                  <Regular label="Product Price" style={styles.priceTitle} />
                  <View style={styles.priceContainer}>
                    <Regular
                      label={order_data?.order_reward}
                      style={styles.price}
                    />
                  </View>
                </View>
              )}

              {type == 'product' && (
                <>
                  <View style={styles.reasonMainContainer}>
                    <View style={styles.reasonContainer}>
                      <View style={styles.reasonHeader}>
                        <Regular
                          label="Reject Reason"
                          style={{
                            ...styles.reasonHeaderTitle,
                            color: colors.pink,
                          }}
                        />
                      </View>

                      <TextInput
                        placeholderTextColor={colors.input_placehoder}
                        value={reason}
                        style={styles.input}
                        placeholder="Enter reject comments"
                        multiline={true}
                        onChangeText={setReason}
                      />
                    </View>
                  </View>
                  <Buttons.ButtonPrimary
                    onClick={() => {
                      // approveOrRejectProduct(false);
                      setRejectedModal(true)
                      setBtnName('reject');
                    }}
                    loading={btnName === 'reject' && loadingAppRejProd}
                    disabled={loadingAppRejProd}
                    loaderColor={colors.white}
                    title={'Reject Product'}
                    style={{
                      marginTop: mvs(15),
                      backgroundColor: colors.pink,
                      height: mvs(52),
                    }}
                  />

                  <Buttons.ButtonPrimary
                    onClick={() => {
                      // approveOrRejectProduct(true);
                      setApproveModal(true)
                      setBtnName('accept');
                    }}
                    loading={btnName === 'accept' && loadingAppRejProd}
                    disabled={loadingAppRejProd}
                    loaderColor={colors.white}
                    title={'Approve Product'}
                    style={{
                      marginTop: mvs(10),
                      backgroundColor: colors.green,
                      height: mvs(52),
                    }}
                  />
                </>
              )}

              {type == 'receipt' && (
                <>
                  <View style={styles.reasonMainContainer}>
                    <View style={styles.reasonContainer}>
                      <View style={styles.reasonHeader}>
                        <Regular
                          label="Dispute Reason"
                          style={styles.reasonHeaderTitle}
                        />
                      </View>

                      <TextInput
                        value={reason}
                        placeholder={'Enter the reason'}
                        placeholderTextColor={colors.input_placehoder}
                        style={styles.input}
                        multiline={true}
                        onChangeText={setReason}
                      />
                    </View>
                  </View>

                  <Buttons.ButtonPrimary
                    onClick={() => {
                      // approveOrDisputeReciept(false);
                      setDisputedModal(true)
                      setBtnName('reject');
                    }}
                    title={'Dispute Receipt'}
                    loading={btnName === 'reject' && loadingAppRejReciep}
                    disabled={loadingAppRejReciep}
                    loaderColor={colors.white}
                    style={{
                      marginTop: mvs(15),
                      backgroundColor: colors.disputes,
                      height: mvs(52),
                    }}
                    textStyle={{ color: colors.typeHeader }}
                  />
                  <Buttons.ButtonPrimary
                    onClick={() => {
                      // approveOrDisputeReciept(true);
                      setApproveModal(true)
                      setBtnName('accept');
                    }}
                    title={'Approve Receipt'}
                    loading={btnName === 'accept' && loadingAppRejReciep}
                    disabled={loadingAppRejReciep}
                    loaderColor={colors.white}
                    style={{
                      marginTop: mvs(10),
                      backgroundColor: colors.green,
                      height: mvs(52),
                    }}
                  />
                </>
              )}
            </View>
          </KeyboardAvoidingView>
        </View>
        <StatusModal
          visible={approveModal}
          title={type == 'receipt' ? 'Approve Receipt' : 'Approve Product'}
          buttonTitle="Confirm"
          name={order_data?.participant_name}
          fromApprove
          mainButton
          endButton
          endButtonTitle="Cancel"
          onConfirm={() => type == 'receipt' ? approveOrDisputeReciept(true) : approveOrRejectProduct(true)}
          onClose={() => setApproveModal(false)}
        />
        <ReceiptDisputedModal
          visible={disputedModal}
          dispute
          reason={reason}
          name={order_data?.participant_name}
          onClose={() => setDisputedModal(false)}
          onSubmit={() => approveOrDisputeReciept(false)}
          onAttach={() => { }}
        />

        {/* <ProductRejectedModal
      title = "Reject Product"
      visible = {rejectedModal}
      onClose = {() => setRejectedModal(false)}
      /> */}
        <DisputeModal
          visible={rejectedModal}
          onClose={() => setRejectedModal(false)}
          onConfirm={() => approveOrRejectProduct(false)}
          reject
          reason={reason}
          name={order_data?.participant_name}
          title="Reject Product"
        />

         <RatingSubmittedModal
          onPrimary={async()=>{
            try {
              setReOrderLoading(true)
              const res = await TAKE_2_API.fetchOrderDetails(order_data?.order_request_id);
              UI_API._reOrderHandler(res?.data, countriesList, (screen, reorder_obj) => {
                // navigation?.navigate(screen, reorder_obj);
                console.log('reorder_obj',reorder_obj);
                navigation?.navigate(screen, {...reorder_obj,isLocal:reorder_obj?.reward?.inculdes('USD')?false:true});
              
              })
            } catch (error) {
              setReOrderLoading(false);
              alertRef.current.alertWithType(
                'error',
                'Error',
                UI_API._returnError(error),
              );
            } 
            finally
            {
              setReOrderLoading(false);
              setDisputSubmitted(false);
            }
          }}
          onOuline={()=>{
          setDisputSubmitted(false);
          props?.navigation?.replace(order_data?.is_buyer?'orderhistory':'deliveryhistory')
          }}
          onClose={setDisputSubmitted} visible={disputSubmitted}
          reOrderLoading={reOrderLoading}
        />

        <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'}  inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
      </View>
    </View>
  );
};
const mapStateToProps = state => {
  return {
    countriesList: state.common.countriesList,
  };
};

const mapDispatchToProps = dispatch => ({
  fetchActiveChat: thread_id =>
    dispatch(TAKE_TO_ACTIONS.fetchActiveChat(thread_id)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Approve);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    backgroundColor: colors.white,
  },
  imageContainer: {
    width: '100%',
    backgroundColor: colors.white,
    borderBottomLeftRadius: mvs(20),
    borderBottomRightRadius: mvs(20),
    paddingBottom: mvs(40),
    justifyContent: 'center',
    alignItems: 'center',
    //borderWidth:1
  },
  image: {
    height: mvs(240),
    width: mvs(191),
  },
  container: {
    flex: 1,
    paddingHorizontal: mvs(22),
    paddingBottom: mvs(40),
  },
  priceMainContainer: {
    width: '100%',
    //borderWidth : 1,
    marginTop: mvs(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceTitle: {
    fontSize: mvs(15),
    color: colors.typeHeader,
  },
  priceContainer: {
    height: mvs(38),
    width: mvs(161),
    borderRadius: mvs(10),
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    paddingLeft: mvs(11),
  },
  price: {
    fontSize: mvs(18),
    color: colors.typeHeader,
  },
  reasonMainContainer: {
    //height : mvs(114),
    width: '100%',
    marginTop: mvs(180),
    //borderWidth : 1,
    justifyContent: 'flex-end',
  },
  reasonContainer: {
    //height : mvs(99),
    width: '100%',
    //borderWidth : 1,
    backgroundColor: colors.secondary,
    borderRadius: mvs(15),
    alignItems: 'center',
    paddingBottom: mvs(10),
    marginTop: mvs(16),
    paddingHorizontal: mvs(22),
  },
  reasonHeader: {
    height: mvs(31),
    width: mvs(169),
    backgroundColor: colors.white,
    borderRadius: mvs(12),
    position: 'absolute',
    top: mvs(-31 / 2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  reasonHeaderTitle: {
    fontSize: mvs(14),
    color: colors.disputes,
  },
  input: {
    marginTop: mvs(20),
    width: '100%',
    minHeight: mvs(60),
    padding: 0,
    color: colors.typeHeader,
    textAlignVertical: 'top',
  },
});
