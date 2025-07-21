import React, { useState, useEffect } from 'react'
import { View, Alert } from 'react-native'
import { GuideBrowser } from '../components/GuideBrowser'
import { GuideViewer } from '../components/GuideViewer'
import { GuideEditor } from '../components/GuideEditor'
import { MyGuidesScreen } from './MyGuidesScreen'
import { StudentGuide, CreateGuideInput, GuideStatus } from '../types'
import { supabase } from '../../../../../lib/supabase'

type ScreenView = 'browser' | 'viewer' | 'editor' | 'my-guides'

export function GuidesScreen() {
  const [currentView, setCurrentView] = useState<ScreenView>('browser')
  const [selectedGuide, setSelectedGuide] = useState<StudentGuide | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string>('')

  useEffect(() => {
    getCurrentUser()
  }, [])

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setCurrentUserId(user.id)
    }
  }

  const handleSelectGuide = (guide: StudentGuide) => {
    setSelectedGuide(guide)
    setCurrentView('viewer')
  }

  const handleCreateGuide = async (data: CreateGuideInput) => {
    try {
      const { data: guide, error } = await supabase
        .from('student_guides')
        .insert({
          author_id: currentUserId,
          ...data,
          status: GuideStatus.PendingReview,
          moderation_score: 0.95 // Placeholder - would be calculated by AI
        })
        .select()
        .single()

      if (error) throw error

      Alert.alert(
        'Success!', 
        'Your guide has been submitted for review. It will be published once approved.',
        [
          { text: 'OK', onPress: () => setCurrentView('browser') }
        ]
      )
    } catch (error) {
      console.error('Error creating guide:', error)
      throw error
    }
  }

  const renderScreen = () => {
    switch (currentView) {
      case 'browser':
        return (
          <GuideBrowser
            onSelectGuide={handleSelectGuide}
            onCreateGuide={() => setCurrentView('editor')}
            currentUserId={currentUserId}
          />
        )
      
      case 'viewer':
        return selectedGuide ? (
          <GuideViewer
            guide={selectedGuide}
            onBack={() => {
              setCurrentView('browser')
              setSelectedGuide(null)
            }}
            currentUserId={currentUserId}
          />
        ) : null
      
      case 'editor':
        return (
          <View style={{ flex: 1 }}>
            <GuideEditor
              onSave={handleCreateGuide}
              onCancel={() => setCurrentView('browser')}
            />
          </View>
        )
      
      case 'my-guides':
        return (
          <MyGuidesScreen
            userId={currentUserId}
            onBack={() => setCurrentView('browser')}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {renderScreen()}
    </View>
  )
}