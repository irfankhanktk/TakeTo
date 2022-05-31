// In App.js in a new project

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import DeliveredOrders from '../../screens/orders/delivered-orders';
import International from '../../screens/orders/international';
import PostedOrders from '../../screens/orders/posted-orders';
import ProcessingOrders from '../../screens/orders/processing-orders';
import HomeTab from '../../screens/tab-screens/tab-home';


const Stack = createNativeStackNavigator();
export const HomeStack=()=> {
  return (
      <Stack.Navigator initialRouteName='postedorders' screenOptions={{headerShown:false}} >
      <Stack.Screen name="Home" component={HomeTab} />
      <Stack.Screen name="international" component={International} />
      <Stack.Screen name="processingorders" component={ProcessingOrders} />
      <Stack.Screen name="deliveredOrders" component={DeliveredOrders} />
      <Stack.Screen name="postedorders" component={PostedOrders} />

      </Stack.Navigator>
  );
}