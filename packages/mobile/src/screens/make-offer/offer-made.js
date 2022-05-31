import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ReactNativeModal from 'react-native-modal';
import { connect } from 'react-redux';
import { HeaderLogo } from '../../../resource/assets/common-icons';
import Buttons from '../../components/atoms/Button';
import { OfferDetailCard } from '../../components/molecules/order_card/order-detail-card/offer-detail-card';
import colors from '../../config/colors';
import fonts from '../../config/fonts';
import { mvs } from '../../config/metrices';
import Regular from '../../presentation/typography/regular-text';

const Congratulation = ({user_name}) => (
  <View style={styles.CONGRATULATION_CONTAINER}>
    <Regular
      label={'Congratulations'}
      style={{ fontSize: 18, color: colors.primary, marginBottom: mvs(12) }}
    />
    <Regular
      label={`Your offer was delivered to ${user_name}.\nYou will be notified with the status of your offer.`}
      style={{
        fontSize: mvs(12),
        color: colors.label,
        marginBottom: mvs(14),
        alignSelf: 'center',
        textAlign: 'center',
      }}
    />
  </View>
);
// const InfoField = ({
//   label = 'label',
//   value = 'value',
//   labelStyle,
//   valueStyle,
//   containerStyle,
// }) => (
//   <View style={{ ...styles.FIELD_CONTAINER, ...containerStyle }}>
//     <Regular label={label} style={{ color: colors.label, ...labelStyle }} />
//     <Regular
//       label={value}
//       style={{ color: colors.headerTitle, ...valueStyle }}
//     />
//   </View>
// );
const OfferMade = props => {
  const { isLocalOrder, orderType, offerData,visible,onClose, offeredPrice,profileData,navigation ,user_name=''} = props;
  //console.log({ isLocalOrder, orderType });
  const [modal, setModal] = useState(false)
  const [showImgsModal, setShowImgsModal] = React.useState(false);
  const [payload, setPayload] = React.useState({
    rewardPrice: '90',
    offerPrice: '100',
  });
  return (
    <ReactNativeModal 
     swipeDirection={'down'}
     onSwipeComplete={onClose}
     onBackdropPress={onClose}
     onBackButtonPress={onClose}
     isVisible={visible}
      style={{ margin:0,}}>
      <View style={{...styles.SCROLL_CONTAINER}}>
        <HeaderLogo height={mvs(31)} width={mvs(175)} style={{ alignSelf: 'center', marginTop: mvs(30), marginBottom: mvs(28) }} />
        <Congratulation user_name={user_name}/>
        <OfferDetailCard
          {...props}
         onPressImage={()=>{}}
          style={{ marginTop: mvs(26), }}
          local={offerData?.is_international}
          title={offerData?.order_title}
          price={offerData?.order_price}
          store_img={offerData?.order_image}
          reward={offerData?.order_reward_price}
          user_img={offerData?.order_by?.user_image}
          user_name={offerData?.order_by?.user_name}
          user_id={offerData?.order_by?.user_id}
          order_from={offerData?.order_from}
          order_to={offerData?.order_to}
          order_from_flag={offerData?.order_from_flag}
          order_to_flag={offerData?.order_to_flag}
          orderType={
            orderType === 'normal' ? 0 : orderType === 'processing' ? 1 : 2
          }
          isLocalOrder={isLocalOrder}
        />
         <Buttons.ButtonSecondaryOutline
          // onClick={() => { }} //props.navigation.popToTop()
          onClick={() => onClose()}
          disabled
          title={`Requested Reward ${isLocalOrder?profileData?.currency?.currency_code:'USD'} ${offeredPrice}`}
          style={{marginTop: mvs(49) }}
        /> 
        <Buttons.ButtonPrimary
          onClick={() =>onClose()}
          title={`Back`}//Back to Search Results
          style={{ marginTop: mvs(10), marginBottom: mvs(20) }}
        /> 
      </View>

    </ReactNativeModal>
  );
};
const mapStateToProps=state=>({
  profileData: state.auth.userInfo?.profile || {},
})
export default connect(mapStateToProps,{})(OfferMade);

const styles = StyleSheet.create({
  SCROLL_CONTAINER: {
    // flex:1,
    backgroundColor:colors.white,
    borderTopLeftRadius:mvs(20),
    borderTopRightRadius:mvs(20),
    paddingHorizontal: mvs(22),
    position:'absolute',
    width:'100%',
    bottom:0,
  },
  DIV: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: mvs(10.9),
    marginBottom: mvs(13),
    borderColor: colors.border,
  },
  FIELD_CONTAINER: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: mvs(8),
  },
  CONGRATULATION_CONTAINER: {
    paddingHorizontal: mvs(13),
    borderRadius: mvs(10),
    alignItems: 'center',
  },
  INPUT: {
    paddingVertical: mvs(5),
    fontFamily: fonts.carosSoftRegular,
    fontSize: mvs(15),
  },
  TOT_REWARD: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  MAKE_OFFER_CONTAINER: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: mvs(40),
  },
  PRICE_INPUT: {
    height: mvs(52),
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    width : '49%'
  },
});
