import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useThemedColors, usePrimaryColors } from 'app/contexts/ThemeContext'
import { colors } from 'app/constants/colors'
import { RequestStatus } from '../types'

interface FilterPillsProps {
  selectedFilter: RequestStatus | 'all'
  onFilterChange: (filter: RequestStatus | 'all') => void
  counts: {
    all: number
    active: number
    in_review: number
    completed: number
    pending: number
  }
}

const filters: Array<{ key: RequestStatus | 'all'; label: string; color?: string }> = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active', color: colors.primary[500] },
  { key: 'in_review', label: 'In Review', color: colors.warning.main },
  { key: 'completed', label: 'Completed', color: colors.success.main },
  { key: 'pending', label: 'Pending', color: colors.purple[500] },
]

export function FilterPills({ selectedFilter, onFilterChange, counts }: FilterPillsProps) {
  const themedColors = useThemedColors()
  const primaryColors = usePrimaryColors()

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 12,
        gap: 8,
      }}
    >
      {filters.map((filter) => {
        const isSelected = selectedFilter === filter.key
        const count = counts[filter.key]
        
        if (count === 0 && filter.key !== 'all') return null

        return (
          <TouchableOpacity
            key={filter.key}
            onPress={() => onFilterChange(filter.key)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: isSelected
                ? filter.color || primaryColors.primary
                : themedColors.background.subtle,
              borderWidth: isSelected ? 0 : 1,
              borderColor: themedColors.border.default,
              gap: 6,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: isSelected ? '#FFFFFF' : themedColors.text.primary,
              }}
            >
              {filter.label}
            </Text>
            <View
              style={{
                backgroundColor: isSelected ? 'rgba(255,255,255,0.3)' : themedColors.border.default,
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 10,
                minWidth: 20,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: isSelected ? '#FFFFFF' : themedColors.text.secondary,
                }}
              >
                {count}
              </Text>
            </View>
          </TouchableOpacity>
        )
      })}
    </ScrollView>
  )
}