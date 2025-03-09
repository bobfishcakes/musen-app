import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native'; // Add View here
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#41604a',
        tabBarInactiveTintColor: '#000000',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => (
          <View style={{ 
            flex: 1, 
            backgroundColor: '#B5BFB5'
          }} />
        ),
        tabBarStyle: {
          display: 'none', // This will hide the tab bar
          position: 'absolute',
          height: Platform.OS === 'ios' ? 80 : 55,
          bottom: 0,
          marginBottom: Platform.OS === 'ios' ? 0 : -24,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="stream"
        options={{
          title: 'Stream',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="headphones" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.crop.circle" color={color} />,
        }}
      />
    </Tabs>
  );
}