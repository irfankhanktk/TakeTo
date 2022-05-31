import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import React, {useState} from 'react';
import { useIsFocused } from '@react-navigation/core';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import {connect} from 'react-redux';
import PagingLoader from '../../../components/atoms/paging-loader';
import Header from '../../../components/molecules/header/header-1x';
import HistoryOrderCard from '../../../components/molecules/order_card/history-offer-card';
import colors from '../../../config/colors';
import {mvs} from '../../../config/metrices';
import Regular from '../../../presentation/typography/regular-text';
import { useEffect } from 'react';
import { Chase } from 'react-native-animated-spinkit';

const MyOffers = props => {
  const {myOffersList, fetchMyOffersList,profileData,clearMenuPagination} = props;
  const [loading, setLoading] = React.useState(true);
  const alertRef = React.useRef();
  const [pageLoading, setPageLoading] = React.useState(false);
  const isFocus= useIsFocused();
  // React.useEffect(() => {
  //   (async () => {
  //     try {
  //       setLoading(true);
  //       await fetchMyOffersList();
  //       setLoading(false);
  //     } catch (error) {
  //       setLoading(false);
  //       // scrollRef.current.scrollTo({x: 0, y: 0, animated: true});
  //       alertRef.current.alertWithType(
  //         'error',
  //         'Error',
  //         UI_API._returnError(error),
  //       );
  //     }
  //   })();
  // }, [isFocus]);
  React.useEffect(() => {
    if(!isFocus){
      clearMenuPagination();
    }else{
      onPagination(setLoading);
    }
  }, [isFocus,profileData?.currency]);

  const onPagination = async setLoading => {
    try {
      let page = UI_API._returnPage(myOffersList);
      console.log('page:::',page);
      if (!page) {
        return;
      }
      setLoading(true);
      await fetchMyOffersList(page);
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

  // React.useEffect(() => {
  //   onPagination(setLoading);
  // }, [profileData?.country]);



  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <Header {...props} title="My offers" allowBackBtn bellIcon />
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Chase size={mvs(30)} color={colors.primary} />
        </View>
        <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'}  inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
      </View>
    );
  } else if (!loading && (myOffersList?.data===undefined||Object.keys(myOffersList?.data).length <= 0)) {
    return (
      <View style={styles.mainContainer}>
        <Header {...props} title="My offers" allowBackBtn bellIcon />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: mvs(20),
          }}>
          <Regular
            label={`Oops! you have no offers yet`}
            style={{textAlign: 'center', color: colors.primary}}
          />
        </View>
        <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'}  inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />

      </View>
    );
  } else
    return (
      <View style={styles.mainContainer}>
        <Header {...props} title="My offers" allowBackBtn bellIcon />
        <View style={styles.container}>
          <FlatList
            data={myOffersList?.data}
            keyExtractor={(item,index) => index?.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              ...styles.SCROLL_CONTAINER,
              paddingTop: mvs(27),
              paddingBottom: mvs(22),
            }}
            onEndReachedThreshold={0.5}
            onEndReached={() =>{
              if(!pageLoading&&!loading)
              onPagination(setPageLoading);
             }}
            renderItem={({item}) => {
              return (
                <>
                  <HistoryOrderCard
                    {...props}
                    {...UI_API._returnOrderProps(item)}
                    // style={{backgroundColor: colors.secondary}}
                    status={'Pending'}
                    type={'Reward'}
                    
                    buttonLabel={`Offer\nDetails`}
                    styleButton={{
                      height: mvs(57),
                      backgroundColor: colors.primary,
                    }}
                    buttonLabel1={'US$ 45'}
                    textStyle1={{fontSize: mvs(18)}}
                    color={colors.pink}
                    trackLine={0}
                    order_img={item?.order_image}
                    onClick={() => {
                      props.navigation.navigate('myofferdetails', {
                        offer_details: item,
                      });
                    }}
                  />
                  <View style={{marginTop: mvs(20)}} />
                </>
              );
            }}
          />
        </View>
        {pageLoading && (
         <PagingLoader/>
        )}
        <DropdownAlert zIndex={5}  elevation={15}  translucent activeStatusBarStyle={'light-content'}  inactiveStatusBarBackgroundColor={colors.primary} ref={alertRef} />
      </View>
    );
};

export const mapStateToProps = state => ({
  myOffersList: state.menu_orders?.myOffersList,
  profileData: state.auth.userInfo?.profile || {},

});

export const mapDispatchToProps  = dispatch => ( {
  fetchMyOffersList: (page) => dispatch(TAKE_TO_ACTIONS.fetchMyOffersList(page)),
  clearMenuPagination: () => dispatch(TAKE_TO_ACTIONS.clearMenuPagination()),
});
export default connect(mapStateToProps, mapDispatchToProps)(MyOffers);

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
