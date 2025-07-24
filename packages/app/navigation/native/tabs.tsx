import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { View, Text } from 'react-native'
import { useThemedColors } from '../../contexts/ThemeContext'

// Import screens
import { HomeScreen } from '../../features/home/screens/HomeScreen'
import { ProfileScreen } from '../../features/profile/screens/ProfileScreenWrapper.native'
import { MessagesScreen } from '../../features/messages/screens/MessagesScreen.native'
import { RequestsScreen } from '../../features/requests/screens'
import { GuidesScreen } from '../../features/guides/screens/GuidesScreen'
import { BrowseScreen } from '../../features/browse/screens/BrowseScreen.native'

const Tab = createBottomTabNavigator()

// Placeholder screen component
const ComingSoonScreen = ({ title }: { title: string }) => {
  const colors = useThemedColors()
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background.default }}>
      <Text style={{ color: colors.text.primary, fontSize: 24, fontWeight: '700' }}>{title}</Text>
      <Text style={{ color: colors.text.secondary, fontSize: 16, marginTop: 8 }}>Coming Soon</Text>
    </View>
  )
}

export function TabNavigator() {
  const colors = useThemedColors()
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border.default,
          height: 90,
          paddingBottom: 34,
          paddingTop: 10,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
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
        component={MessagesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Browse"
        component={BrowseScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Requests"
        component={RequestsScreen}
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