import {placeholder} from '@babel/types';
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import ReactNativeModal from 'react-native-modal';
import colors from '../../../config/colors';
import {mvs, ms} from '../../../config/metrices';
import Medium from '../../../presentation/typography/medium-text';
import Regular from '../../../presentation/typography/regular-text';
import OrderDestination from '../../atoms/OrderDestination';
import OrderDestinationAddress from '../../atoms/OrderDestinationAddress';
import ImagePlaceholder from '../../atoms/Placeholder';
import * as SVGS from '../../../../resource/assets/order-car-icons';
import {TAKE_TO_IMAGES} from '../../../../resource/assets/image_resouce';
import Buttons from '../../atoms/Button';
import { connect } from 'react-redux';

const Widthdraw = ({
  visible,
  onClose,
  title,
  requestedReward = true,
  subtitle = 'Are you sure you want to withdraw your offer?',
  image,
  loading=false,
  name,
  site,
  price,
  reward,
  onConfirm,
  requested = false,
  isLocal,
  flagFrom,
  flagTo,
  from,
  to,
  offer_reward,
  profileData,
  ...props
}) => {
  const Aeroplane = SVGS['aeroplane'];
  const Car = SVGS['car']
  const Location = SVGS['location'];

  return (
    <ReactNativeModal
      propagateSwipe
      isVisible={visible}
      avoidKeyboard
      onBackdropPress={() => onClose(f => !f)}
      onBackButtonPress={() => onClose(f => !f)}
      style={{margin: 0, padding: 0}}>
      <View style={styles.mainContainer}>
        <Regular label={title} style={styles.header} />
        <Regular label={subtitle} style={styles.heading} />

        <View style={styles.productMainContainer}>
          <ImagePlaceholder
            bg_img={image}
            containerStyle={{
              width: '49%',
              height: mvs(151),
              borderRadius: mvs(20),
            }}
          />
          <View style={styles.productInfoContainer}>
            <Regular numberOfLines={2} label={name} style={styles.name} />
            <Regular label={site} style={styles.site} />
            <View style={styles.priceContainer}>
              <Regular label="Price" style={styles.price} />
              <Medium label={price} style={styles.price} />
            </View>
            <View style={styles.rewardContainer}>
              <Regular label="Reward" style={styles.rewardTitle} />
              <Medium label={reward} style={styles.reward} />
            </View>
          </View>
        </View>

        <View style={styles.routeMainContainer}>
          <OrderDestination
            SVGFirst={isLocal?  Car : Aeroplane}
            SVGSecond={Location}
            value={0}
            containerStyle={{width: '49%'}}
          />
          <OrderDestinationAddress
            imageFrom = {{uri : flagFrom}}
            imageTo = {{uri : flagTo}}
            label={`${from?.slice(0,15)} - ${to?.slice(0,15)}`}
            style={{width: '49%'}}
          />
        </View>

        {requested && (
          <>
            {requestedReward && (
              <View
                style={{
                  height: mvs(52),
                  width: '100%',
                  borderRadius: mvs(10),
                  borderWidth: mvs(0.5),
                  borderColor: colors.doted,
                  marginTop: mvs(20),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Regular
                  label={`Requested Reward ${offer_reward} ${profileData?.currency?.currency_code}`}
                  style={{color: colors.typeHeader}}
                />
              </View>
            )}
            <View
              style={{
                ...styles.buttonsContainer,
                marginTop: requestedReward ? mvs(10) : mvs(30),
              }}>
              <Buttons.ButtonPrimary
                title="Confirm"
                style={{width: '49%'}}
                loading = {loading}
                disabled = {loading}
                loaderColor = {colors.white}
                onClick={onConfirm}
              />
              <Buttons.ButtonSecondaryOutline
                title="Cancel"
                style={{width: '49%'}}
                onClick={onClose}
              />
            </View>
          </>
        )}

        {!requested && (
          <>
            <View style={styles.rewardMainContainer}>
              <View
                style={{
                  ...styles.rewardContainer1,
                  alignItems: 'flex-start',
                  paddingLeft: mvs(11),
                }}>
                <Medium
                  label="90"
                  style={{color: colors.pink, fontSize: mvs(23)}}
                />
                <Regular
                  label="US$"
                  style={{
                    color: colors.typeHeader,
                    fontSize: mvs(23),
                    position: 'absolute',
                    right: mvs(11),
                  }}
                />
              </View>
              <Buttons.ButtonPrimary
              title="Confirm"
              style={{
                ...styles.rewardContainer1,
                backgroundColor: colors.primary,
              }}
              loading = {loading}
              disabled = {loading}
              loaderColor = {colors.white}
              onClick={onConfirm}
            />
              {/* <TouchableOpacity
                onPress={onConfirm}
                style={{
                  ...styles.rewardContainer1,
                  backgroundColor: colors.primary,
                }}>
                <Regular label="Confirm" style={{color: colors.white}} />
              </TouchableOpacity> */}
            </View>
            <Buttons.ButtonSecondaryOutline
              title="Cancel"
              style={{marginTop: mvs(10)}}
              onClick={onClose}
            />
          </>
        )}
      </View>
    </ReactNativeModal>
  );
};

const mapStateToProps=state=>({
  profileData: state.auth.userInfo?.profile || {},
})
export default connect(mapStateToProps,{})(Widthdraw);

const styles = StyleSheet.create({
  mainContainer: {
    //height : mvs(400),
    width: ms(332),
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: mvs(20),
    alignSelf: 'center',
    paddingTop: mvs(23),
    paddingBottom: mvs(20),
    paddingHorizontal: mvs(10),
  },
  header: {
    fontSize: mvs(18),
    color: colors.pink,
    alignSelf: 'center',
  },
  heading: {
    fontSize: mvs(12),
    color: colors.lightgrey2,
    alignSelf: 'center',
    marginTop: mvs(5),
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
    //minHeight : mvs(54),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonsContainer: {
    width: '100%',
    marginTop: mvs(10),
    //borderWidth : 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    height: mvs(52),
    width: '49%',
    //borderWidth : 1
  },
  rewardMainContainer: {
    height: mvs(58),
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: mvs(10),
    marginTop: mvs(15),
    //paddingHorizontal: mvs(10),
    //borderWidth:0.3,
    borderColor: colors.lightgrey2,
  },
  rewardContainer1: {
    width: '49%',
    height: '100%',
    borderRadius: mvs(10),
    borderWidth: mvs(0.5),
    borderColor: colors.doted,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
