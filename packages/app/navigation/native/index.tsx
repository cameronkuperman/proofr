import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ActivityIndicator, View } from 'react-native'

import { UserDetailScreen } from 'app/features/user/detail-screen'
import { OnboardingNavigator } from 'app/features/onboarding/OnboardingNavigator.native'
import { TabNavigator } from './tabs'
import { ChatScreen } from 'app/features/messages/screens/ChatScreen.native'
import { MyGuidesScreen } from 'app/features/guides/screens/MyGuidesScreen'
import { GuideEditor } from 'app/features/guides/components/GuideEditor'
import { GuideViewerScreen } from 'app/features/guides/screens/GuideViewerScreen'
import { GuidesScreen } from 'app/features/guides/screens/GuidesScreen'
import { ResourcesScreen } from 'app/features/resources/screens/ResourcesScreen'
import { ConsultantProfileScreen } from 'app/features/consultants/screens/ConsultantProfileScreen.native'

// AsyncStorage might not be available in all environments
let AsyncStorage: any
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default
} catch (error) {
  console.log('AsyncStorage not available, using mock')
  AsyncStorage = {
    getItem: async () => null,
    setItem: async () => {},
  }
}

const Stack = createNativeStackNavigator<{
  onboarding: { skipWelcome?: boolean }
  login: undefined
  tabs: undefined
  'user-detail': {
    id: string
  }
  chat: {
    userId: string
    userName: string
    userAvatar: string
    isVerified?: boolean
  }
  MyGuides: undefined
  CreateGuide: undefined
  GuideViewer: {
    guideId: string
  }
  AllGuides: undefined
  Resources: {
    selectedResource?: string
  }
  'consultant-profile': {
    consultantId: string
  }
}>()

export function NativeNavigation() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)

  useEffect(() => {
    checkAuthState()
    
    // Listen for auth state changes
    const interval = setInterval(() => {
      checkAuthState()
    }, 1000) // Check every second
    
    return () => clearInterval(interval)
  }, [])

  const checkAuthState = async () => {
    try {
      // Check if user is authenticated
      const token = await AsyncStorage.getItem('authToken')
      const onboardingComplete = await AsyncStorage.getItem('onboardingComplete')
      
      setIsAuthenticated(!!token)
      setHasCompletedOnboarding(onboardingComplete === 'true')
    } catch (error) {
      console.error('Error checking auth state:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0055FE" />
      </View>
    )
  }

  return (
    <Stack.Navigator>
      {!isAuthenticated ? (
        // Not authenticated - show onboarding/login flow
        <>
          <Stack.Screen
            name="onboarding"
            component={OnboardingNavigator}
            options={{
              headerShown: false,
              animation: 'fade',
            }}
            initialParams={{ skipWelcome: false }}
          />
          <Stack.Screen
            name="login"
            getComponent={() => require('app/features/login/screens/LoginScreen.native').LoginScreen}
            options={{
              headerShown: false,
              animation: 'slide_from_bottom',
            }}
          />
        </>
      ) : !hasCompletedOnboarding ? (
        // Authenticated but hasn't completed onboarding
        <Stack.Screen
          name="onboarding"
          component={OnboardingNavigator}
          options={{
            headerShown: false,
            animation: 'fade',
          }}
          initialParams={{ skipWelcome: true }}
        />
      ) : (
        // Authenticated and completed onboarding
        <>
          <Stack.Screen
            name="tabs"
            component={TabNavigator}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="user-detail"
            component={UserDetailScreen}
            options={{
              title: 'User',
            }}
          />
          <Stack.Screen
            name="chat"
            component={ChatScreen}
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="MyGuides"
            component={MyGuidesScreen}
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="CreateGuide"
            component={GuideEditor}
            options={{
              headerShown: false,
              animation: 'slide_from_bottom',
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="GuideViewer"
            component={GuideViewerScreen}
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="AllGuides"
            component={GuidesScreen}
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="Resources"
            component={ResourcesScreen}
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="consultant-profile"
            component={ConsultantProfileScreen}
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  )
}