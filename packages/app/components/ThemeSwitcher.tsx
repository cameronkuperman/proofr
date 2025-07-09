import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useTheme, useThemedColors } from '../contexts/ThemeContext'
import { Feather } from '@expo/vector-icons'

export function ThemeSwitcher() {
  const { theme, setTheme, isSystem } = useTheme()
  const themedColors = useThemedColors()

  const options = [
    { value: 'light', label: 'Light', icon: 'sun' },
    { value: 'dark', label: 'Dark', icon: 'moon' },
    { value: 'system', label: 'System', icon: 'monitor' },
  ] as const

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: themedColors.surface.raised,
        borderRadius: 12,
        padding: 4,
        gap: 4,
      }}
    >
      {options.map((option) => {
        const isActive = isSystem
          ? option.value === 'system'
          : option.value === theme

        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => setTheme(option.value)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: isActive
                ? theme === 'dark'
                  ? 'rgba(16, 185, 129, 0.2)'
                  : 'rgba(4, 120, 87, 0.1)'
                : 'transparent',
              gap: 8,
            }}
          >
            <Feather
              name={option.icon as any}
              size={16}
              color={
                isActive
                  ? theme === 'dark'
                    ? '#10B981'
                    : '#047857'
                  : themedColors.text.secondary
              }
            />
            <Text
              style={{
                fontSize: 14,
                fontWeight: isActive ? '600' : '400',
                color: isActive
                  ? theme === 'dark'
                    ? '#10B981'
                    : '#047857'
                  : themedColors.text.secondary,
              }}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

// Compact version for navigation bars
export function ThemeSwitcherCompact() {
  const { theme, setTheme, isSystem, isDark } = useTheme()
  const themedColors = useThemedColors()

  const cycleTheme = () => {
    if (isSystem) {
      setTheme('light')
    } else if (theme === 'light') {
      setTheme('dark')
    } else {
      setTheme('system')
    }
  }

  const getIcon = () => {
    if (isSystem) return 'monitor'
    return isDark ? 'moon' : 'sun'
  }

  return (
    <TouchableOpacity
      onPress={cycleTheme}
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: themedColors.surface.raised,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: themedColors.border.default,
      }}
    >
      <Feather
        name={getIcon() as any}
        size={20}
        color={isDark ? '#10B981' : '#047857'}
      />
    </TouchableOpacity>
  )
}