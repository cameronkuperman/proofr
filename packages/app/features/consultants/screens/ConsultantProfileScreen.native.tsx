import React from 'react'
import { ScrollView, View, StatusBar, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute, RouteProp } from '@react-navigation/native'
import { useThemedColors } from '../../../contexts/ThemeContext'
import { ConsultantProfile } from '../components/ConsultantProfile'

type RouteParams = {
  'consultant-profile': {
    consultantId: string
  }
}

export function ConsultantProfileScreen() {
  const colors = useThemedColors()
  const route = useRoute<RouteProp<RouteParams, 'consultant-profile'>>()
  const consultantId = route.params?.consultantId

  if (!consultantId) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No consultant ID provided</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={colors.isDark ? 'light-content' : 'dark-content'} />
      <ConsultantProfile consultantId={consultantId} />
    </SafeAreaView>
  )
}