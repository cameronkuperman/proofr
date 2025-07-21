import React from 'react'
import { View, Text } from 'react-native'
import { useThemedColors, usePrimaryColors } from 'app/contexts/ThemeContext'
import { colors as themeColors } from 'app/constants/colors'
import { RequestsStats } from '../types'

interface JourneyHeaderProps {
  stats: RequestsStats
}

export function JourneyHeader({ stats }: JourneyHeaderProps) {
  const colors = useThemedColors()
  const primaryColors = usePrimaryColors()
  
  return (
    <View>
      <Text style={{ fontSize: 16, color: colors.textSecondary, marginBottom: 8 }}>
        Your Application Journey
      </Text>
      
      {/* Progress Bar */}
      <View style={{ marginBottom: 12 }}>
        <View
          style={{
            height: 8,
            backgroundColor: colors.border,
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${stats.journeyProgress}%`,
              backgroundColor: primaryColors.primary,
              borderRadius: 4,
            }}
          />
          {/* Animated dot at the end of progress */}
          <View
            style={{
              position: 'absolute',
              left: `${stats.journeyProgress}%`,
              top: '50%',
              transform: [{ translateX: -6 }, { translateY: -6 }],
              width: 12,
              height: 12,
              backgroundColor: primaryColors.primary,
              borderRadius: 6,
              borderWidth: 2,
              borderColor: colors.card,
            }}
          />
        </View>
        <Text
          style={{
            fontSize: 14,
            color: colors.textSecondary,
            marginTop: 4,
            fontWeight: '600',
          }}
        >
          {stats.journeyProgress}% Complete
        </Text>
      </View>
      
      {/* Stats Row */}
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text }}>
            {stats.activeRequests}
          </Text>
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>Active</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: themeColors.warning.main }}>
            {stats.inReviewRequests}
          </Text>
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>In Review</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: themeColors.success.main }}>
            {stats.completedRequests}
          </Text>
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>Completed</Text>
        </View>
      </View>
    </View>
  )
}