import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { Platform, Appearance, useColorScheme as useDeviceColorScheme } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { colors, ThemeMode } from '../constants/colors'

interface ThemeContextType {
  theme: ThemeMode
  setTheme: (theme: ThemeMode | 'system') => void
  colors: typeof colors
  isDark: boolean
  isSystem: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = '@proofr/theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const deviceColorScheme = useDeviceColorScheme()
  
  const [theme, setThemeState] = useState<ThemeMode>('light')
  const [isSystem, setIsSystem] = useState(true)

  // Load theme from storage on mount
  useEffect(() => {
    loadTheme()
  }, [])

  // Handle system theme changes
  useEffect(() => {
    if (!isSystem) return

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setThemeState(colorScheme || 'light')
    })

    return () => subscription?.remove()
  }, [isSystem])

  const loadTheme = async () => {
    try {
      if (Platform.OS === 'web') {
        const stored = localStorage.getItem(THEME_STORAGE_KEY)
        if (stored) {
          const { theme: storedTheme, isSystem: storedIsSystem } = JSON.parse(stored)
          setIsSystem(storedIsSystem)
          if (storedIsSystem) {
            setThemeState(deviceColorScheme || 'light')
          } else {
            setThemeState(storedTheme)
          }
        }
      } else {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY)
        if (stored) {
          const { theme: storedTheme, isSystem: storedIsSystem } = JSON.parse(stored)
          setIsSystem(storedIsSystem)
          if (storedIsSystem) {
            setThemeState(deviceColorScheme || 'light')
          } else {
            setThemeState(storedTheme)
          }
        }
      }
    } catch (error) {
      console.error('Error loading theme:', error)
    }
  }

  const saveTheme = async (newTheme: ThemeMode | 'system') => {
    const isSystemTheme = newTheme === 'system'
    const actualTheme = isSystemTheme ? (deviceColorScheme || 'light') : newTheme

    // Save to local storage
    try {
      const toStore = JSON.stringify({ theme: actualTheme, isSystem: isSystemTheme })
      if (Platform.OS === 'web') {
        localStorage.setItem(THEME_STORAGE_KEY, toStore)
      } else {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, toStore)
      }
    } catch (error) {
      console.error('Error saving theme:', error)
    }
  }

  const setTheme = useCallback((newTheme: ThemeMode | 'system') => {
    if (newTheme === 'system') {
      setIsSystem(true)
      setThemeState(deviceColorScheme || 'light')
    } else {
      setIsSystem(false)
      setThemeState(newTheme)
    }
    saveTheme(newTheme)
  }, [deviceColorScheme])

  const value: ThemeContextType = {
    theme,
    setTheme,
    colors,
    isDark: theme === 'dark',
    isSystem,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Helper hook for getting themed colors
export const useThemedColors = () => {
  const { theme, colors } = useTheme()
  return theme === 'dark' ? colors.dark : colors.light
}

// Helper hook for getting primary colors based on theme
export const usePrimaryColors = () => {
  const { theme, colors } = useTheme()
  return {
    primary: theme === 'dark' ? colors.primary[500] : colors.primary[700],
    primaryLight: theme === 'dark' ? colors.primary[400] : colors.primary[600],
    primaryDark: theme === 'dark' ? colors.primary[600] : colors.primary[800],
  }
}