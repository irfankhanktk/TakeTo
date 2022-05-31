import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import { useIsFocused } from '@react-navigation/native';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import * as Images from '../../../../resource/assets/order-car-icons';
import PagingLoader from '../../../components/atoms/paging-loader';
import Header from '../../../components/molecules/header/header-1x';
import DisputeModal from '../../../components/molecules/modals/dispute-modal';
import HistoryOrderCard from '../../../components/molecules/order_card/history-offer-card';
import colors from '../../../config/colors';
import { mvs } from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';

const Disputes = props => {
  const { disputed_Orders, fetchDisputedOrders, langauge, profileData, clearMenuPagination } = props;
  const Aeroplane = Images['aeroplane_white'];
  const AeroplaneActive = Images['aeroplane_active'];
  const Car = Images['car_white'];
  const CarActive = Images['car_active'];

  const [selected, setSelected] = useState({});
  const [disputeModal, setDisputeModal] = useState(false);
  const [pageLoading, setPageLoading] = React.useState(false);

  const [loading, setLoading] = React.useState(true);
  const alertRef = React.useRef();
  const isFocus = useIsFocused();

  const onPagination = async setLoading => {
    try {
      let page = UI_API._returnPage(disputed_Orders);
      console.log('page:::', page);
      if (!page) {
        return;
      }
      setLoading(true);
      await fetchDisputedOrders(page);
    } catch (error) {
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isFocus) {
      onPagination(setLoading);
    }
  }, [profileData?.currency, isFocus]);

  React.useEffect(() => {
    if (!isFocus) {
      clearMenuPagination();
    }
  }, [isFocus]);

  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <Header {...props} title="Disputes" allowBackBtn bellIcon />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Chase size={mvs(30)} color={colors.primary} />
        </View>
        <DropdownAlert zIndex={5}  elevation={15} 
          translucent
          activeStatusBarStyle={'light-content'}
          inactiveStatusBarBackgroundColor={colors.primary}
          ref={alertRef}
        />
      </View>
    );
  } else if (
    (!loading && Object.keys(disputed_Orders).length <= 0) ||
    disputed_Orders?.data?.length <= 0
  ) {
    return (
      <View style={styles.mainContainer}>
        <Header {...props} title="My Disputes" allowBackBtn bellIcon />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: mvs(20),
          }}>
          <Regular
            label={`No Record Found`}
            style={{ textAlign: 'center', color: colors.primary }}
          />
        </View>
        <DropdownAlert zIndex={5}  elevation={15} 
          translucent
          activeStatusBarStyle={'light-content'}
          inactiveStatusBarBackgroundColor={colors.primary}
          ref={alertRef}
        />
      </View>
    );
  }
  return (
    <View style={styles.mainContainer}>
      <Header {...props} title="disputes" allowBackBtn bellIcon />
      <View style={styles.container}>
        <FlatList
          data={disputed_Orders?.data}
          keyExtractor={item => item?.order_created_at?.toString()}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          onEndReached={() =>{
            if(!pageLoading&&!loading)
            onPagination(setPageLoading);
           }}
          contentContainerStyle={{
            ...styles.SCROLL_CONTAINER,
            paddingTop: mvs(27),
            paddingBottom: mvs(22),

          }}
          renderItem={({ item, index }) => {
            return (
              <>
                <HistoryOrderCard
                  {...props}
                  item={item}
                  style={{ backgroundColor: colors.secondary }}
                  type={''}
                  buttonLabel={
                    langauge?.translations?.order_dispute_steps[
                    item?.order_next_step || item?.order_status
                    ]
                  }
                  textStyle1={{ fontSize: mvs(12) }}
                  styleButton={{
                    height: mvs(57),
                    backgroundColor:
                      item?.order_next_step === 'dispute_won'
                        ? colors.green
                        : item?.order_next_step === 'dispute_lost'
                          ? colors.pink
                          : colors.primary,
                  }}
                  color={colors.disputes}
                  status={langauge?.translations?.order_dispute_steps['reward']}
                  onClick={() => {
                    if (
                      item?.order_next_step === 'dispute_1' ||
                      item?.order_next_step === 'dispute_2' ||
                      item?.order_next_step === 'dispute_3' ||
                      item?.order_next_step === 'dispute_4'
                    ) {
                      props.navigation.navigate('chat_dispute', {
                        dispute_id: item?.dispute_id,
                        chat_title: item?.order_title,
                      });
                    } else {
                      setDisputeModal(true);
                      setSelected(item);
                    }
                  }}
                  // lineStatus={(item?.subject === 'dispute_3') ? true : false}
                  trackLine={item?.subject === 'dispute_4' ? 2 : 0}
                  dotColor={item?.subject === 'dispute_4' ? colors.pink : colors.primary}
                  isActive={item?.subject === 'dispute_4'}
                  {...UI_API._returnOrderProps(item)}
                />
                <View style={{ marginTop: mvs(20) }} />
              </>
            );
          }}
        />
      </View>
      {pageLoading && <PagingLoader />}
      <DisputeModal
        visible={disputeModal}
        disputeOpenRej={
          selected?.order_next_step !== 'dispute_won' &&
          selected?.order_next_step !== 'dispute_lost'
        }
        title={
          selected?.order_next_step === 'dispute_won'
            ? 'Dispute Won'
            : selected?.order_next_step === 'dispute_lost'
              ? 'Dispute Lost'
              : 'Dispute'
        }
        won={selected?.order_next_step === 'dispute_won'}
        lost={selected?.order_next_step === 'dispute_lost'}
        reason={`${selected?.description}`}
        onClose={() => setDisputeModal(false)}
      />
      <DropdownAlert zIndex={5}  elevation={15} 
        translucent
        activeStatusBarStyle={'light-content'}
        inactiveStatusBarBackgroundColor={colors.primary}
        ref={alertRef}
      />
    </View>
  );
};

export const mapStateToProps = state => ({
  disputed_Orders: state.menu_orders?.disputedOrders,
  langauge: state.common?.langauge,
});

export const mapDispatchToProps = dispatch => ({
  fetchDisputedOrders: (page) => dispatch(TAKE_TO_ACTIONS.fetchDisputedOrders(page)),
  clearMenuPagination: () => dispatch(TAKE_TO_ACTIONS.clearMenuPagination()),

});
export default connect(mapStateToProps, mapDispatchToProps)(Disputes);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
  },
  SCROLL_CONTAINER: {
    paddingHorizontal: mvs(22),
  },
  buttonsContainer: {
    height: mvs(44),
    width: '100%',
    //borderWidth : 1,
    marginTop: mvs(30),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topButton: {
    height: '100%',
    width: '48%',
    borderWidth: 1,
    borderRadius: mvs(10),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: colors.primary,
  },
});
