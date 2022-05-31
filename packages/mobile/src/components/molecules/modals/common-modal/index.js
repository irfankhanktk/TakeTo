import TAKE_2_API from '@khan_ahmad786/common/api/API';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import ReactNativeModal from 'react-native-modal';
import {connect} from 'react-redux';
import colors from '../../../../config/colors';
import {mvs} from '../../../../config/metrices';
import Medium from '../../../../presentation/typography/medium-text';
import Regular from '../../../../presentation/typography/regular-text';

const CurrencyList = (
  disbaled = false,
  visible,
  onClose,
  onSubmit,
  activeCurrency,
) => {
  //  console.log(activeCurrency)
  const [currenciesList, setCurrencyList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const request = await TAKE_2_API.fetchCurrenciesList();
        setCurrencyList(request?.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    })();
  }, []);

  const renderItem = ({item, index}) => {
    let bgColor =
      activeCurrency?.currency_id * 1 === item?.id
        ? colors.primary
        : colors.white;
    let lableColor =
      activeCurrency?.currency_id * 1 === item?.id
        ? colors.white
        : colors.headerTitle;

    return (
      <TouchableOpacity
        disabled={disbaled}
        activeOpacity={0.9}
        onPress={() => onSubmit(item)}
        style={{
          ...styles.ITEM,
          backgroundColor: bgColor,
        }}>
        <Regular
          label={item?.currency_name}
          style={{
            color: lableColor,
          }}
        />
        <Regular
          label={item?.currencyCode}
          style={{
            color: lableColor,
          }}
        />
      </TouchableOpacity>
    );
  };
  return (
    <ReactNativeModal
      onBackdropPress={() => onClose(false)}
      isVisible={visible}
      style={{margin: 0, padding: 0}}
      onBackButtonPress={() => onClose(false)}>
      <View style={styles.CONTAINER}>
        <Medium label={'Choose your currency'} style={styles.HEADING_TXT} />
        <View style={styles.SUB_CONTAINER}>
          {loading ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Chase color={colors.primary} size={mvs(30)} />
            </View>
          ) : !loading && currenciesList?.length <= 0 ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Regular
                label={`Oops! It seems something went wrong.`}
                style={{textAlign: 'center', color: colors.primary}}
              />
            </View>
          ) : (
            <FlatList
              data={currenciesList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
            />
          )}
        </View>
      </View>
    </ReactNativeModal>
  );
};

const TAKE_TO_COMMON_MODAL = {
  CurrencyList,
};

export default TAKE_TO_COMMON_MODAL;

const styles = StyleSheet.create({
  CONTAINER: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: mvs(20),
    borderTopRightRadius: mvs(20),
    backgroundColor: colors.primary,
  },
  HEADING_TXT: {
    fontSize: mvs(15),
    color: colors.white,
    alignSelf: 'center',
    marginTop: mvs(13),
    marginBottom: mvs(16),
  },
  SUB_CONTAINER: {
    backgroundColor: colors.white,
    // flexDirection: 'row',
    paddingTop: mvs(20),
    minHeight: mvs(200),
    paddingBottom: mvs(38),
    paddingHorizontal: mvs(22),
    borderTopLeftRadius: mvs(20),
    borderTopRightRadius: mvs(20),
  },
  ITEM: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.gray,
    justifyContent: 'space-between',
    paddingVertical: mvs(10),
    paddingHorizontal: mvs(20),
    borderRadius: mvs(10),
  },
});
