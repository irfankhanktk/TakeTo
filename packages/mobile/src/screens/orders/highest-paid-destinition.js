import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import { connect } from 'react-redux';
import HighestDestinationCard from '../../components/molecules/destination-card/highest-paid-destination-card';
import Header from '../../components/molecules/header/header-1x';
import InternationalOrderDateFilterModal from '../../components/molecules/modals/international-order-date-filter-modal';
import OrderTypeHeader from '../../components/molecules/order_card/order-type-header';
import colors from '../../config/colors';
import { mvs, width } from '../../config/metrices';
import Regular from '../../presentation/typography/regular-text';

const HighestPaidDestinations = props => {
  const { fetchHeighPaidOrdersList, heigh_paid_destinations, clearBrowseOrders } = props
  const { isLocal } = props?.route?.params;
  const [openFilter, setOpenFilter] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = props?.navigation.addListener('focus', () => {
      clearBrowseOrders();
    });
    return unsubscribe;
  }, [props.navigation]);


  React.useEffect(() => {
    (async () => {

      try {
        setLoading(true);
        await fetchHeighPaidOrdersList(isLocal);
        console.log("data:::", heigh_paid_destinations)
        setLoading(false);
      } catch (error) {
        alert(UI_API._returnError(error));
      }
    })();

  }, []);



  const listHeaderView = () => {
    return <View style={{ paddingHorizontal: mvs(22), marginTop: mvs(10) }}><OrderTypeHeader title="Highest Paid Destinations" seeMore={false} /></View>
  }
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Header {...props} title="Highest paid destinations" allowBackBtn bellIcon />
        {listHeaderView()}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Chase size={mvs(30)} color={colors.primary} />
        </View>
      </View>
    );
  }
  else if (!loading && heigh_paid_destinations?.length <= 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Header {...props} title={'local orders'} allowBackBtn bellIcon />
        {listHeaderView()}
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
      </View>
    );
  }
  else
    return (
      <View style={{ flex: 1, backgroundColor: colors.white }}>
        <Header {...props} title="Highest paid destinations" allowBackBtn bellIcon />
        <View style={{flex:1,backgroundColor:colors.white}}>
        {listHeaderView()}
        <View style={{ flex: 1 }}>
          <FlatList
            data={heigh_paid_destinations}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingHorizontal: mvs(22), paddingTop: mvs(0) }}
            // ListHeaderComponent={}
            renderItem={({ item, index }) => {
              return (
                <HighestDestinationCard
                  isLocalOrders={isLocal}
                  {...props}
                  key={index}
                  item={item}
                  onClick={() => { }}
                />
              )
            }}
          />
        </View>
        </View>
        {/* <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: mvs(10)}}>
        <View style={{flex: 1}}>
          <View style={{paddingHorizontal: mvs(22)}}>
            <OrderTypeHeader title="Highest Paid Destinations" seeMore={false} />
            <ScrollView>
              {Array(20)
                .fill('')
                .map((ele, index) => (
                  <HighestDestinationCard
                    {...props}
                    key={index}
                    item={ele}
                    onClick={() => {}}
                  />
                ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView> */}
        <InternationalOrderDateFilterModal
          onApply={() => {
            setOpenFilter(false);
            props.navigation.navigate('internationaldelivery', {
              isLocalOrder: false,
            });
          }}
          visible={openFilter}
          onClose={setOpenFilter}
          {...props}
        />
      </View>
    );
};

//export default HighestPaidDestinations;
const mapStateToProps = state => ({
  heigh_paid_destinations: state.common_orders_list?.heigh_paid_orders?.data
});

const mapDispatchToProps = dispatch => ({
  fetchHeighPaidOrdersList: (isLocal) =>
    dispatch(TAKE_TO_ACTIONS.fetchHeighPaidOrdersList(isLocal)),
  clearBrowseOrders: () => dispatch(TAKE_TO_ACTIONS.clearBrowseOrders()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HighestPaidDestinations);

const styles = StyleSheet.create({
  SCROLL_CONTAINER: {
    paddingHorizontal: mvs(22),
    flexGrow: 1,
  },
  RELEVENT_ORDER: {
    paddingBottom: mvs(22),
    marginBottom: mvs(25),
    width: width,
    alignSelf: 'center',
  },
  PAGINATION: {
    bottom: mvs(0),
  },
});
