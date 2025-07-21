import React from 'react'
import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemedColors } from 'app/contexts/ThemeContext'
import { RequestStatus } from '../types'

interface EmptyStateProps {
  filter: RequestStatus | 'all'
}

const emptyStateContent: Record<RequestStatus | 'all', {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  subtitle: string
}> = {
  all: {
    icon: 'document-text-outline',
    title: 'No requests yet',
    subtitle: 'Your journey begins with your first request',
  },
  active: {
    icon: 'time-outline',
    title: 'No active requests',
    subtitle: 'All caught up! Time to work on new applications',
  },
  pending: {
    icon: 'hourglass-outline',
    title: 'No pending requests',
    subtitle: 'All your requests have been accepted',
  },
  in_review: {
    icon: 'eye-outline',
    title: 'Nothing in review',
    subtitle: 'Your consultants have completed their work',
  },
  completed: {
    icon: 'checkmark-circle-outline',
    title: 'No completed requests',
    subtitle: 'Your completed work will appear here',
  },
  revision_requested: {
    icon: 'refresh-outline',
    title: 'No revision requests',
    subtitle: 'All your work is perfect as is!',
  },
}

export function EmptyState({ filter }: EmptyStateProps) {
  const colors = useThemedColors()
  const content = emptyStateContent[filter] || emptyStateContent.all

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.border,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Ionicons name={content.icon} size={40} color={colors.textSecondary} />
      </View>
      
      <Text
        style={{
          fontSize: 20,
          fontWeight: '700',
          color: colors.text,
          marginBottom: 8,
        }}
      >
        {content.title}
      </Text>
      
      <Text
        style={{
          fontSize: 16,
          color: colors.textSecondary,
          textAlign: 'center',
          paddingHorizontal: 40,
        }}
      >
        {content.subtitle}
      </Text>
    </View>
  )
}