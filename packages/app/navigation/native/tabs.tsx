import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { View, Text } from 'react-native'

// Import screens
import { HomeScreen } from '../../features/home/screens/HomeScreen'
import { ProfileScreen } from '../../features/profile/screens/ProfileScreen'

const Tab = createBottomTabNavigator()

// Placeholder screen component
const ComingSoonScreen = ({ title }: { title: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF8F0' }}>
    <Text style={{ color: '#1a1f36', fontSize: 24, fontWeight: '700' }}>{title}</Text>
    <Text style={{ color: '#62646A', fontSize: 16, marginTop: 8 }}>Coming Soon</Text>
  </View>
)

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E0E0E0',
          height: 90,
          paddingBottom: 34,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#1DBF73',
        tabBarInactiveTintColor: '#62646A',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={() => <ComingSoonScreen title="Messages" />}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Browse"
        component={() => <ComingSoonScreen title="Browse Consultants" />}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Requests"
        component={() => <ComingSoonScreen title="My Requests" />}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}