import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import UI_API from '@khan_ahmad786/common/store/services';
import TAKE_TO_CONSTANT from '@khan_ahmad786/common/utils/utils';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  View,
  Linking
} from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import { connect } from 'react-redux';
import Header from '../../components/molecules/header/header-1x';
import PopularStores from '../../components/molecules/popular_stores/store';
import colors from '../../config/colors';
import { mvs } from '../../config/metrices';
import Regular from '../../presentation/typography/regular-text';

const Stores = props => {
  const {fetchPopularStores, popular_stores_list} = props;
  const [loading, setLoading] = React.useState(false);

  const fetchPopularStoreHandler = async () => {
    try {
      setLoading(true);
      await fetchPopularStores();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert(UI_API._returnError(error));
    }
  };

  React.useEffect(() => {
    fetchPopularStoreHandler();
  }, []);

  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <Header {...props} title={'Popular stores'} allowBackBtn bellIcon />
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Chase size={mvs(30)} color={colors.primary} />
        </View>
      </View>
    );
  } else if (!loading && !popular_stores_list.data) {
    return (
      <View style={styles.mainContainer}>
        <Header {...props} title={'Popular stores'} allowBackBtn bellIcon />
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Regular
            label={`Oops! it seems their is no popular store available.`}
            style={{textAlign: 'center', color: colors.primary}}
          />
        </View>
      </View>
    );
  } else
    return (
      <View style={styles.mainContainer}>
        <Header {...props} title={'Popular stores'} allowBackBtn bellIcon />

        <ScrollView contentContainerStyle={styles.storesMainContainer}>
          {TAKE_TO_CONSTANT.returnObjectKeys(popular_stores_list.data).map(
            (key, index) => (
              <View style={styles.stores} key={index}>
                <Regular
                  label={TAKE_TO_CONSTANT.convertCapitalizeFirst(key)}
                  style={styles.storeType}
                />
                <View style={{height: mvs(185)}}>
                  <FlatList
                    data={popular_stores_list.data[key]}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    renderItem={({item, index}) => (
                      <>
                        <PopularStores
                          store_url={item.name}
                          store_img={item?.image}
                          fav_icon={item?.fav_icon}
                          //onPress={()=> alert("")}
                          onPress={() => Linking.openURL(item?.url)}
                        />
                        <View style={{width: mvs(15)}} />
                      </>
                    )}
                  />
                </View>
              </View>
            ),
          )}
        </ScrollView>
      </View>
    );
};

const mapStateToProps = state => ({
  popular_stores_list: state.common_orders_list?.popular_stores_list,
});

const mapDispatchToProps = {
  fetchPopularStores: () => TAKE_TO_ACTIONS.fetchPopularStores(),
};

export default connect(mapStateToProps, mapDispatchToProps)(Stores);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  storesMainContainer: {
    // flex: 1,
    paddingLeft: mvs(23),
    paddingBottom: mvs(100),
    //borderWidth : 1
  },
  stores: {
    height: mvs(222),
    width: '100%',
    //borderWidth : 1,
    marginTop: mvs(22),
    justifyContent: 'space-between',
  },
  storeType: {
    //textDecorationLine: 'underline',
    fontSize: mvs(20),
    color: colors.headerTitle,
  },
});
