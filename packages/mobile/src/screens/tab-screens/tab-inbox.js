import services from '@khan_ahmad786/common/api/services';
import TAKE_TO_ACTIONS from '@khan_ahmad786/common/store/actions/actions';
import { useIsFocused } from '@react-navigation/core';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View
} from 'react-native';
import { Chase } from 'react-native-animated-spinkit';
import DropdownAlert from 'react-native-dropdownalert';
import { connect } from 'react-redux';
import Conversation from '../../components/molecules/chat_card/conversation-card';
import Header from '../../components/molecules/header/header-1x';
import colors from '../../config/colors';
import { mvs } from '../../config/metrices';
import Regular from '../../presentation/typography/regular-text';

const InboxTab = props => {
  let isFocus = useIsFocused()
  const {inboxList, fetchInboxList, profileData, updateInboxList, fetchEcho, anotherEcho} =
    props;
  const [loading, setLoading] = React.useState(true);
  const alertRef = React.useRef();
  const scrollRef = React.useRef();

  const [echo, setEcho] = React.useState({});
  const [msgs, setMsgs] = React.useState([]);
  const [channel, setChannel] = React.useState({});


  const fetchInboxListHandler = async () => {
    try {
      setLoading(true);
      await fetchInboxList();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      // scrollRef.current.scrollTo({x: 0, y: 0, animated: true});
      alertRef.current.alertWithType(
        'error',
        'Error',
        UI_API._returnError(error),
      );
    }
  };



  React.useEffect(() => {
    if(isFocus){
      fetchInboxListHandler();
    }
  }, [isFocus]);


  React.useEffect(() => {
    anotherEcho?.newChannel?.stopListening('.new.message', null)
    anotherEcho?.newChannel?.listen('.new.message', function (data) {
      console.log('datadatadatadata:::',data);
      updateInboxList(data, profileData?.id , false);
    });
    
    
  },[])


console.log('inbox data::',inboxList?.data);

  if (loading) {
    return (
      <View style={styles.mainContainer}>
        <Header {...props} title="Inbox" spacebetween userIcon bellIcon />
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Chase size={mvs(30)} color={colors.primary} />
        </View>
      </View>
    );
  } else if (
    (!loading && Object?.keys(inboxList)?.length <= 0) ||
    inboxList?.data?.length <= 0
  ) {
    return (
      <View style={styles.mainContainer}>
        <Header {...props} title="Inbox" spacebetween userIcon bellIcon />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: mvs(20),
          }}>
          <Regular
            label={`No Record Found.`}
            style={{textAlign: 'center', color: colors.primary}}
          />
        </View>
      </View>
    );
  } else
    return (
      <View style={styles.mainContainer}>
        <Header {...props} title="Inbox" spacebetween userIcon bellIcon />
        <View style={{flex: 1}}>
          <FlatList
            data={inboxList?.data}
            renderItem={({item, index}) => (
              <Conversation
                lastMessage={item?.resources?.latest_message?.type_verbose}
                isMessageTab
                order_title={item?.order_title}
                type={'asd'}
                onPress={() => {
                  props.navigation.navigate('chat', {
                    thread_id: item?.id,
                    participant_name: item?.name,
                    //anotherEcho: echo,
                  });
                }}
                {...props}
                thread_id={item?.id}
                order_id={item?.order_id}
                user_name={item?.name}
                time={item?.updated_at || ''}
                counter={item?.unread_count || 0}
                message={item?.resources?.latest_message?.body || ''}
                user_img={`${item?.avatar?.sm}`}
              />
            )}
            keyExtractor={item => item?.thread_id?.toString()}
            style={styles.conversationsContainer}
            contentContainerStyle={{paddingBottom: mvs(46),paddingTop:mvs(27)}}
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
};

const mapStateToProps = state => {
  return {
    inboxList: state.inbox.inboxList || {},
    profileData: state.auth.userInfo?.profile || {},
    anotherEcho : state.common?.anotherEcho || {},
  };
};
const mapDispatchToProps = dispatch => ({
  fetchInboxList: () => dispatch(TAKE_TO_ACTIONS?.fetchInboxList()),
  updateInboxList: (list, id, counterOnly) => dispatch(TAKE_TO_ACTIONS?.updateInboxList( list , id, counterOnly)),
  fetchEcho: echo => dispatch(TAKE_TO_ACTIONS?.fetchEcho(echo)),
  newMessageArrived: msg => dispatch(TAKE_TO_ACTIONS.newMessageArrived(msg)),
});
export default connect(mapStateToProps, mapDispatchToProps)(InboxTab);

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  conversationsContainer: {
    flex: 1,
    paddingHorizontal: mvs(22),
  },
});