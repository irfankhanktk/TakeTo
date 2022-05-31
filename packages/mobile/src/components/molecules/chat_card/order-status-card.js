import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../../../config/colors';
import {mvs} from '../../../config/metrices';
import Medium from '../../../presentation/typography/medium-text';
import Regular from '../../../presentation/typography/regular-text';
import OrderStatus from '../../atoms/OrderStatus';


const DotttedLine = ({index}) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '23%',
      marginHorizontal: mvs(3),
    }}>
    {Array(15)
      .fill()
      .map(ele => (
        <View
          style={{
            height: mvs(1),
            borderRadius: mvs(1),
            width: mvs(2.5),
            marginBottom: mvs(2),
            backgroundColor: colors.typeHeader,
          }}
        />
      ))}
    {/* <View style={{ height: mvs(1), borderRadius: mvs(1), width: mvs(4), backgroundColor: colors.typeHeader }} /> */}
  </View>
);

const OrderStatusCard = ({reward = 0, ...props}) => {
  // const { } = props || {};
  const {active_chat, message} = props || {};

  // console.log(active_chat?.data)
  // const active_chat = {
  //   order: {
  //     is_buyer: true,
  //     order_id: 4,
  //     order_reward: "USD 65",
  //     order_shop_name: "Samsung galaxy s5",
  //     order_step: "order_step_3",
  //     type_verbose: 'PRODUCT_IMAGE'
  //   }
  // };

  // const message = {
  //   type_verbose: 'PRODUCT_IMAGE'
  // }
  // console.log(props)
  const activeStep =
    active_chat?.order?.order_step === 'negotiate'
      ? 0
      : active_chat?.order?.order_step?.includes('_')
      ? active_chat?.order?.order_step?.split('_')[2] * 1
      : active_chat?.order?.order_step?.toLowerCase();

  // const dispute_type = message?.type_verbose?.startsWith('PRODUCT_IMAGE')
  //   ? 'IMAGE'
  //   : message?.type_verbose?.startsWith('RECEIPT_IMAGE')
  //   ? 'RECIEPT'
  //   : message?.type_verbose?.startsWith('MAP')
  //   ? 'DISPUTE_DELIVERY'
  //   : '';

  const dispute_type = 
      active_chat?.order?.step === 'dispute_1'   
    ? 'IMAGE'
    : active_chat?.order?.step === 'dispute_2'
    ? 'RECIEPT'
    : (active_chat?.order?.step === 'dispute_3' || active_chat?.order?.step === 'dispute_4')
    ? 'DISPUTE_DELIVERY'
    : '';  

  const {data} = active_chat;
  //  console.log('activeStep :: ', activeStep);
  //  console.log('dispute_type :: ', dispute_type);
  return (
    <View style={[styles.CONTAINER]}>
      <View style={[styles.LEFT_CONTAINER, styles.ROW]}>
        <View>
          <Regular
            label={
              active_chat?.order?.order_shop_name?.length > 27
                ? `${active_chat?.order?.order_shop_name?.substring(0, 27)} ...`
                : active_chat?.order?.order_shop_name
            }
            style={{lineHeight: mvs(21), color: colors.typeHeader}}
          />
          <Regular
            label={''}
            style={{lineHeight: mvs(21), color: colors.lightgrey2}}
          />
        </View>
        <View>
          <Regular
            label={'Reward'}
            style={{color: colors.primary, marginTop: mvs(3)}}
          />
          <Medium
            label={reward}
            style={{color: colors.primary, marginTop: mvs(3)}}
          />
        </View>
      </View>
      <View
        style={{
          borderWidth: StyleSheet.hairlineWidth,
          marginTop: mvs(20),
          borderColor: colors.doted,
          borderRadius: mvs(10),
          paddingVertical: mvs(10),
          paddingHorizontal: mvs(13),
        }}>
        <View style={{flexDirection: 'row', alignSelf: 'center'}}>
          {Array(3)
            .fill()
            .map((e, index) => (
              <>
                <DotttedLine key={index} index={index} />
              </>
            ))}
        </View>
        <View
          style={{flexDirection: 'row', width: '100%', marginTop: -mvs(4.5)}}>
          <View style={{width: '25%', alignItems: 'center'}}>
            <OrderStatus
              label={ active_chat?.order?.is_buyer? 'Offer Approve' : 'Offer Approved' }
              //(activeStep === 'disputed' && dispute_type==='IMAGE') ? 'disputed' :
              level={
                activeStep === 'completed' || activeStep >= 1 || dispute_type
                  ? 'completed'
                  : activeStep !== 'completed' && activeStep < 2 
                  ? 'active'
                  : 0
              }
            />
          </View>
          <View style={{width: '25%', alignItems: 'center'}}>
            <OrderStatus
              label={ active_chat?.order?.is_buyer? 'Product Approve' : 'Product Approved'} //activeStep === 'completed' || activeStep >=5
              level={
                activeStep === 'disputed' && dispute_type === 'IMAGE'
                  ? 'disputed'
                  : activeStep === 'completed' ||
                    activeStep >= 3 ||
                    (activeStep === 'disputed' && dispute_type === 'IMAGE') ||
                    (activeStep === 'disputed' && dispute_type === 'RECIEPT') ||
                    (activeStep === 'disputed' &&
                      dispute_type === 'DISPUTE_DELIVERY')
                  ? 'completed'
                  : activeStep !== 'completed' &&
                    activeStep >= 1 &&
                    activeStep <= 4
                  ? 'active'
                  : 0
              }
            />
          </View>
          <View style={{width: '25%', alignItems: 'center'}}>
            <OrderStatus
              label={ active_chat?.order?.is_buyer ? 'Receipt Approve' : 'Receipt Approved'}
              level={
                activeStep === 'disputed' && dispute_type === 'RECIEPT'
                  ? 'disputed'
                  : activeStep === 'completed' ||
                    activeStep >= 5 ||
                    (activeStep === 'disputed' && dispute_type === 'RECIEPT') ||
                    (activeStep === 'disputed' &&
                      dispute_type === 'DISPUTE_DELIVERY')
                  ? 'completed'
                  : activeStep !== 'completed' &&
                    activeStep >= 3 &&
                    activeStep <= 6
                  ? 'active'
                  : 0
              }
            />
          </View>
          <View style={{width: '25%', alignItems: 'center'}}>
            <OrderStatus
              label={ active_chat?.order?.is_buyer ? 'Delivery Confirm' : 'Delivery Confirmed'}
              level={
                activeStep === 'disputed' && dispute_type === 'DISPUTE_DELIVERY'
                  ? 'disputed'
                  : activeStep === 'completed' || activeStep > 8
                  ? 'completed'
                  : activeStep !== 'completed' &&
                    activeStep >= 5 &&
                    activeStep <= 8
                  ? 'active'
                  : 0
              }
            />
          </View>
          {/* <OrderStatus label={'Approve Product'} level={2} />
                    <OrderStatus label={'Approve Product'} level={2} />
                    <OrderStatus label={'Approve Product'} level={2} /> */}
        </View>
        {/*  
                // 
                <DotttedLine />
                <OrderStatus label={'Approve Receipt'} level={1} />
                <DotttedLine />
                <OrderStatus label={'Confirm Delivery'} level={0} /> */}
      </View>
    </View>
  );
};
export default OrderStatusCard;
const styles = StyleSheet.create({
  CONTAINER: {
    paddingHorizontal: mvs(22),
    backgroundColor: colors.white,
    // borderBottomLeftRadius: mvs(20),
    // borderBottomRightRadius: mvs(20),
  },
  LEFT_CONTAINER: {
    // width: '45%',
  },
  ROW: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  DOT: {
    marginTop: -mvs(5),
    height: mvs(12),
    width: mvs(12),
    borderColor: colors.price_border,
    borderRadius: mvs(6),
  },
});
