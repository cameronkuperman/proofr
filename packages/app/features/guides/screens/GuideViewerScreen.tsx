import React, { useState, useEffect } from 'react'
import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native'
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'
import { GuideViewer } from '../components/GuideViewer'
import { StudentGuide, GuideInteraction } from '../types'
import { supabase } from '../../../../../lib/supabase'

// AsyncStorage for getting user info
let AsyncStorage: any
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default
} catch (error) {
  AsyncStorage = {
    getItem: async () => null,
    setItem: async () => {},
  }
}

type RouteParams = {
  GuideViewer: {
    guideId: string
  }
}

export function GuideViewerScreen() {
  const route = useRoute<RouteProp<RouteParams, 'GuideViewer'>>()
  const navigation = useNavigation()
  const { guideId } = route.params

  const [guide, setGuide] = useState<StudentGuide | null>(null)
  const [interaction, setInteraction] = useState<GuideInteraction | undefined>()
  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [guideId])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current user ID
      const authToken = await AsyncStorage.getItem('authToken')
      const onboardingState = await AsyncStorage.getItem('onboardingState')
      
      let userId = ''
      if (onboardingState) {
        const state = JSON.parse(onboardingState)
        userId = state.userId || ''
      }
      setCurrentUserId(userId)

      // Fetch guide
      const { data: guideData, error: guideError } = await supabase
        .from('student_guides')
        .select(`
          *,
          author:students!author_id(
            id,
            name,
            bio
          )
        `)
        .eq('id', guideId)
        .single()

      if (guideError) throw guideError

      if (guideData) {
        setGuide(guideData)

        // Fetch user interaction if logged in
        if (userId) {
          const { data: interactionData } = await supabase
            .from('guide_interactions')
            .select('*')
            .eq('guide_id', guideId)
            .eq('user_id', userId)
            .single()

          if (interactionData) {
            setInteraction(interactionData)
          }
        }
      }
    } catch (err) {
      console.error('Error fetching guide:', err)
      setError('Failed to load guide')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigation.goBack()
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#0055FE" />
      </View>
    )
  }

  if (error || !guide) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 20 }}>
        <Text style={{ fontSize: 16, color: '#EF4444', textAlign: 'center' }}>
          {error || 'Guide not found'}
        </Text>
        <TouchableOpacity 
          onPress={handleBack}
          style={{
            marginTop: 20,
            paddingHorizontal: 24,
            paddingVertical: 12,
            backgroundColor: '#0055FE',
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <GuideViewer
      guide={guide}
      interaction={interaction}
      onBack={handleBack}
      currentUserId={currentUserId}
    />
  )
}