import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Use lucide-react-native for the native icons
import { Trophy, Wallet, User, LayoutDashboard, MessageCircle } from 'lucide-react-native'; 

import Dashboard from '../screens/Dashboard';
import WalletView from '../screens/Wallet';
import Chat from '../screens/Chat';
import Profile from '../screens/Profile';

const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false, 
        tabBarStyle: { 
          backgroundColor: '#020617', 
          borderTopColor: '#1e293b',
          height: 60,
          paddingBottom: 8
        },
        tabBarActiveTintColor: '#8b5cf6', // Violet color from your web theme
        tabBarInactiveTintColor: '#64748b',
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') return <LayoutDashboard color={color} size={size} />;
          if (route.name === 'Wallet') return <Wallet color={color} size={size} />;
          if (route.name === 'Chat') return <MessageCircle color={color} size={size} />;
          if (route.name === 'Profile') return <User color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen name="Wallet" component={WalletView} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
