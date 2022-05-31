import React from 'react';
import {
  ScrollView, StyleSheet, TouchableOpacity, View
} from 'react-native';
import { connect } from 'react-redux';
import * as Images from '../../../resource/assets/bank-info-icons';
import Buttons from '../../components/atoms/Button';
import Header from '../../components/molecules/header/header-1x';
import colors from '../../config/colors';
import { mvs } from '../../config/metrices';
import Regular from '../../presentation/typography/regular-text';

const SavedAddress = props => {
  const {addressesList} = props;
  const [payload, setPayload] = React.useState({
    isPromotionEmail: true,
    isOrderEmail: true,
    isSms: false,
  });
  const list = [0, 1, 2];
  const Plus = Images['plus'];


console.log('addressesList::',addressesList);


  return (
    <View style={styles.CONTAINER}>
      <Header
        {...props}
        title="Saved Addresses"
        allowBackBtn
        userIcon={false}
      />
      {addressesList?.length > 0 ? (
        <>
          <ScrollView contentContainerStyle={styles.SCROLL}>
            <View style={styles.BODY}>
              {addressesList.map((ele, index) => (
                <TouchableOpacity
                  onPress={()=> props.navigation.navigate('newaddress', {type: 'savedaddress',edit_payload:ele})}
                  key={index}
                  style={{
                    ...styles.LIST_CONTAINER,
                  }}>
                  <Regular
                    label={`${ele?.name} (${ele.type})`}
                    style={{...styles.LABEL, color: colors.primary}}
                  />
                  <Regular label={ele?.address} style={styles.LABEL} />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: mvs(20),
          }}>
          <Regular
            label={`You don't have any saved address please add your address.`}
            style={{textAlign: 'center'}}
          />
        </View>
      )}
      <View
        style={{
          position: 'absolute',
          bottom: mvs(0),
          paddingHorizontal: mvs(22),
          paddingBottom: mvs(40),
          width: '100%',
          backgroundColor: colors.white,
        }}>
        <Buttons.ButtonPrimary
          title={'Add Address'}
          onClick={() =>
            props.navigation.navigate('newaddress', {type: 'savedaddress'})
          }
        />
      </View>
    </View>
  );
};
const mapStateToProps = state => {
  return {
    addressesList: state.auth.userInfo?.addresses || [],

  };
};

export default connect(mapStateToProps, {})(SavedAddress);
const styles = StyleSheet.create({
  CONTAINER: {
    flex: 1,
    backgroundColor: colors.white,
  },
  BODY: {
    flex: 1,
  },
  SCROLL: {
    flexGrow: 1,
    paddingTop: mvs(27),
    paddingHorizontal: mvs(22),
    paddingBottom: mvs(90),
  },
  LABEL: {},
  LIST_CONTAINER: {
    paddingBottom: mvs(9),
    marginBottom: mvs(15),
    borderColor: colors.price_border,
    backgroundColor: colors.secondary,
    padding: mvs(10),
    borderRadius: mvs(10),
  },
  PLUS: {
    position: 'absolute',
    bottom: mvs(40),
    alignSelf: 'center',
  },
});
