import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Alert, View } from 'react-native';
import { HomeStack } from '..';
import BottomMenu from '../../components/atoms/BottomMenu';
import BottomMenuIcon from '../../components/atoms/BottomMenuIcon';
import DeliveryTab from '../../screens/tab-screens/tab-deliver';
import InboxTab from '../../screens/tab-screens/tab-inbox';
import OrderTab from '../../screens/tab-screens/tab-order';

const BottomTab = createBottomTabNavigator();


const TabNavigator = props => {

  const showGuestAlert = () => {
    Alert.alert(
      'Alert',
      'You are a guest, please register yourself',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        { text: 'OK', onPress: () => props?.navigation?.navigate('login') }
      ]
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', }}>
      <BottomTab.Navigator
        screenOptions={{ headerShown: false }}

        tabBar={props => <View style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,

          elevation: 10,
        }}>
          <BottomMenu showGuestAlert={showGuestAlert} {...props} />
        </View>}
      >
        <BottomTab.Screen
          name="Home"
          component={HomeStack}
          options={{
            title: 'Home',
            tabBarIcon: (focused) => <BottomMenuIcon name="home" focused={focused} />,
          }}
        />
        <BottomTab.Screen
          name="Order"
          component={OrderTab}
          options={{
            title: 'Order',
            tabBarIcon: (focused) => <BottomMenuIcon name="order" focused={focused} />,
          }}
        />
        <BottomTab.Screen
          name="Deliver"
          component={DeliveryTab}
          options={{
            title: 'Deliver',
            tabBarIcon: (focused) => <BottomMenuIcon name="delivery" focused={focused} />,
          }}
        />
        <BottomTab.Screen
          name="Inbox"
          component={InboxTab}
          options={{
            unmountOnBlur: true,
            title: 'Inbox',
            tabBarIcon: (focused) => <BottomMenuIcon name="inbox" focused={focused} />,
          }}
        />
      </BottomTab.Navigator>
    </View>
  );
};

export default TabNavigator;

