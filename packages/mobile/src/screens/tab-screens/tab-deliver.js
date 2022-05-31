import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, View
} from 'react-native';
import { connect } from 'react-redux';
import Buttons from '../../components/atoms/Button';
import Header from '../../components/molecules/header/header-1x';
import InstractionCard from '../../components/molecules/instraction-card-doted';
import InternationalOrderDateFilterModal from '../../components/molecules/modals/international-order-date-filter-modal';
import LocalOrderFilterModal from '../../components/molecules/modals/local-order-filter-modal';
import colors from '../../config/colors';
import { mvs } from '../../config/metrices';

const DeliveryTab = props => {
  const {isGuest,profileData} = props;
  const [inst, setInst] = useState(true);
  const [openFilter, setOpenFilter] = React.useState({
    local: false,
    international: false,
  });
  const [makeMoney] = React.useState([
    {
      title: 'Add trip',
      description:
        'Start by adding your trip to see requested orders along your route.',
    },
    {
      title: 'Make Offers',
      description:
        'You choose the orders you’d like to deliver and arrange the details with your shoppers.',
    },
    {
      title: 'Buy the Product',
      description:
        'Once shoppers accept your offer, they pay. We hold payment. Then, you buy the item with your money.',
    },
    {
      title: 'Deliver & Get Paid',
      description:
        'Meet in person, deliver the product, get paid automatically by Taketo.',
    },
  ]);

  return (
    <View style={styles.mainContainer}>
      <Header {...props} title="How to Deliver" spacebetween bellIcon />
      <ScrollView contentContainerStyle={{flexGrow:1}}>
        <View style={styles.container}>
          <View
            style={{
              // marginHorizontal: mvs(22),
              paddingLeft: mvs(10),
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

          <Buttons.ButtonRTL
            iconName="aeroplanewhite"
            onClick={() => {
              isGuest
                ? props.navigation.navigate('login')
                : props.navigation.navigate('internationaltrip',{isFilter:false,isOnline:true});
            }}
            title="Add International Trip"
            style={{justifyContent: 'center'}}
            textStyle={{marginLeft: mvs(18), color: colors.white}}
          />
       <Buttons.ButtonRTL
            disabled={!profileData?.country?.is_enable}
            iconName="carwhite"
            onClick={() => {
              isGuest
                ? props.navigation.navigate('login')
                : props.navigation.navigate('localtrip',{isFilter:false,isOnline:true});
            }}
            title="Add Local Trip"
            style={{justifyContent: 'center', marginTop: mvs(10),
            backgroundColor: profileData?.country?.is_enable
            ? colors.primary
            : colors.primary50,
          }}
            textStyle={{marginLeft: mvs(18), color: colors.white}}
          />
          <Buttons.ButtonSecondaryOutline
            onClick={() => {
              isGuest
                ? props.navigation.navigate('login')
                : props.navigation.navigate('deliveryhistory');
            }}
            title="My Delivery History"
            style={{marginTop: mvs(10)}}
          />
        </View>
      </ScrollView>
      <InternationalOrderDateFilterModal
        onApply={() => {
          setOpenFilter({...openFilter, international: false});
          props.navigation.navigate('internationaldelivery', {
            isLocalOrder: false,
          });
        }}
        visible={openFilter.international}
        onClose={() => setOpenFilter({...openFilter, international: false})}
        {...props}
      />
      <LocalOrderFilterModal
        onApply={() => {
          setOpenFilter({...openFilter, local: false});
          props.navigation.navigate('internationaldelivery', {
            isLocalOrder: true,
          });
        }}
        onSearchMap={() => props.navigation.navigate('searchmap')}
        visible={openFilter.local}
        onClose={() => setOpenFilter({...openFilter, local: false})}
      />
    </View>
  );
};

//export default DeliveryTab;
const mapStateToProps = state => {
  return {
    isGuest: state.auth.isGuest,
  profileData: state.auth.userInfo?.profile,
  };
};

const mapDispatchToProps = dispatch => ({
  postSigninData: data => dispatch(TAKE_TO_ACTIONS.postSigninData(data)),
});
export default connect(mapStateToProps, mapDispatchToProps)(DeliveryTab);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: mvs(22),
    paddingLeft: mvs(22 + 5.5),
    paddingTop: mvs(27),
  },
  optionsContainer: {
    // height: mvs(270),
    width: '100%',
    borderBottomEndRadius: mvs(20),
    borderBottomStartRadius: mvs(20),
    backgroundColor: colors.white,
    paddingBottom: mvs(20),
  },
  optionsMainContainer: {
    flex: 1,
    paddingHorizontal: mvs(22),
  },
  option1: {
    //height : mvs(56),
    width: '100%',
    alignSelf: 'center',
    marginTop: mvs(30),
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: mvs(10),
    paddingHorizontal: mvs(10),
    paddingTop: mvs(12),
    paddingBottom: mvs(13),
  },
  option2: {
    //height : mvs(71),
    width: '100%',
    alignSelf: 'center',
    marginTop: mvs(12),
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: mvs(10),
    paddingHorizontal: mvs(10),
    paddingTop: mvs(12),
    paddingBottom: mvs(13),
  },
  optionTitle: {
    fontSize: mvs(15),
    color: colors.primary,
  },
  optionDetail: {
    fontSize: mvs(12),
    color: colors.headerTitle,
    marginTop: mvs(4),
  },
  buttonContainer: {
    marginVertical: mvs(18),
    paddingHorizontal: mvs(22),
  },
});
