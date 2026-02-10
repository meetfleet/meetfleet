import { Tabs } from 'expo-router';
import React from 'react';

import BottomNavBar from '@/components/ui/bottom-navbar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={props => <BottomNavBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen 
        name="index" 
        options={{ tabBarStyle: { display: 'flex' } }}
      />
      <Tabs.Screen 
        name="events" 
        options={{ tabBarStyle: { display: 'flex' } }}
      />
      <Tabs.Screen 
        name="request" 
        options={{ tabBarStyle: { display: 'none' } }}
      />
      <Tabs.Screen 
        name="messages" 
        options={{ tabBarStyle: { display: 'flex' } }}
      />
      <Tabs.Screen 
        name="addcard" 
        options={{ tabBarStyle: { display: 'flex' } }}
      />

    </Tabs>
  );
}
