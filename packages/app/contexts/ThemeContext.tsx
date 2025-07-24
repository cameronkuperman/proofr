import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { Platform, Appearance, useColorScheme as useDeviceColorScheme, View, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Minimal color definitions to ensure we always have something
const defaultColors = {
  primary: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  accent: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  success: { light: '#A7F3D0', main: '#10B981', dark: '#047857' },
  warning: { light: '#FEF3C7', main: '#F59E0B', dark: '#D97706' },
  error: { light: '#FECACA', main: '#EF4444', dark: '#B91C1C' },
  light: {
    background: {
      default: '#FAF7F0',
      paper: '#FFFFFF',
      subtle: '#F8FAFC',
    },
    surface: {
      raised: '#FFFFFF',
      overlay: 'rgba(255, 255, 255, 0.9)',
      sunken: '#F1F5F9',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
      disabled: '#D1D5DB',
    },
    border: {
      default: '#E5E7EB',
      light: '#F3F4F6',
      dark: '#D1D5DB',
    },
  },
  dark: {
    background: {
      default: '#000000',
      paper: '#0A0A0A',
      subtle: '#050505',
    },
    surface: {
      raised: '#141414',
      overlay: 'rgba(0, 0, 0, 0.9)',
      sunken: '#000000',
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#D1D5DB',
      tertiary: '#6B7280',
      disabled: '#4B5563',
    },
    border: {
      default: '#1F2937',
      light: '#111827',
      dark: '#374151',
    },
  },
}

// Try to import colors, fallback to defaults
let colors = defaultColors
try {
  const colorModule = require('../constants/colors')
  // The colors module exports { colors } as a named export
  if (colorModule && colorModule.colors) {
    colors = { ...defaultColors, ...colorModule.colors }
  } else {
    console.warn('Color module loaded but no colors found, using defaults')
  }
} catch (e) {
  console.warn('Failed to load colors module:', e.message, ', using defaults')
}

export type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
  theme: ThemeMode
  setTheme: (theme: ThemeMode | 'system') => void
  colors: typeof colors
  isDark: boolean
  isSystem: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Debug: Check if createContext worked
if (!ThemeContext) {
  console.error('ThemeContext creation failed!')
}

const THEME_STORAGE_KEY = '@proofr/theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const deviceColorScheme = useDeviceColorScheme()
  
  // Start with safe defaults that work immediately
  const [theme, setThemeState] = useState<ThemeMode>('light')
  const [isSystem, setIsSystem] = useState(true)
  const [isInitialized, setIsInitialized] = useState(true) // Start as true with defaults
  const [colorsLoaded, setColorsLoaded] = useState(false)

  // Load theme from storage on mount
  useEffect(() => {
    // Set device color scheme immediately if available
    if (deviceColorScheme) {
      setThemeState(deviceColorScheme)
    }
    
    // Then load saved preferences
    loadTheme().then(() => {
      setColorsLoaded(true)
    })
  }, [])

  // Handle system theme changes
  useEffect(() => {
    if (!isSystem) return

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setThemeState(colorScheme || 'light')
    })

    return () => subscription?.remove()
  }, [isSystem])

  const loadTheme = async (): Promise<void> => {
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
    theme: theme || 'light',
    setTheme,
    colors: colors || defaultColors, // Always ensure colors exist
    isDark: theme === 'dark',
    isSystem,
  }

  // No loading screen - render immediately with defaults
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  try {
    const context = useContext(ThemeContext)
    
    // Always return a valid object with safe defaults
    if (!context) {
      console.warn('ThemeContext not available, returning defaults')
      return {
        theme: 'light' as ThemeMode,
        setTheme: () => {},
        colors: colors || defaultColors,
        isDark: false,
        isSystem: true,
      }
    }
    
    // Ensure context has valid colors
    if (!context.colors || typeof context.colors !== 'object') {
      console.warn('Context colors invalid, merging with defaults')
      return {
        ...context,
        colors: colors || defaultColors,
      }
    }
    
    return context
  } catch (error) {
    console.error('Error in useTheme:', error)
    // If useContext throws, return defaults
    return {
      theme: 'light' as ThemeMode,
      setTheme: () => {},
      colors: colors || defaultColors,
      isDark: false,
      isSystem: true,
    }
  }
}

// Helper hook for getting themed colors
export const useThemedColors = () => {
  const { isDark, colors: themeColors } = useTheme()
  
  // Use the full colors object from the theme
  const fullColors = themeColors || colors || defaultColors
  
  // Return the nested structure that components expect
  if (isDark) {
    return {
      // Return the full nested dark theme object
      ...fullColors.dark,
      
      // Also include commonly used flat properties for backward compatibility
      primary: fullColors.primary?.[500] || '#10B981',
      accent: fullColors.accent?.[600] || '#DC2626',
      success: fullColors.success?.main || '#10B981',
      error: fullColors.error?.main || '#EF4444',
      warning: fullColors.warning?.main || '#F59E0B',
      info: fullColors.info?.main || '#3B82F6',
      
      // Include full color scales
      gray: fullColors.gray || {},
      purple: fullColors.purple || {},
      teal: fullColors.teal || {},
      orange: fullColors.orange || {
        50: '#FFF7ED',
        100: '#FFEDD5',
        200: '#FED7AA',
        300: '#FDBA74',
        400: '#FB923C',
        500: '#F97316',
        600: '#EA580C',
        700: '#C2410C',
        800: '#9A3412',
        900: '#7C2D12',
      },
      
      isDark: true,
    }
  }
  
  return {
    // Return the full nested light theme object
    ...fullColors.light,
    
    // Also include commonly used flat properties for backward compatibility
    primary: fullColors.primary?.[700] || '#047857',
    accent: fullColors.accent?.[600] || '#DC2626',
    success: fullColors.success?.main || '#10B981',
    error: fullColors.error?.main || '#EF4444',
    warning: fullColors.warning?.main || '#F59E0B',
    info: fullColors.info?.main || '#3B82F6',
    
    // Include full color scales
    gray: fullColors.gray || {},
    purple: fullColors.purple || {},
    teal: fullColors.teal || {},
    orange: fullColors.orange || {
      50: '#FFF7ED',
      100: '#FFEDD5',
      200: '#FED7AA',
      300: '#FDBA74',
      400: '#FB923C',
      500: '#F97316',
      600: '#EA580C',
      700: '#C2410C',
      800: '#9A3412',
      900: '#7C2D12',
    },
    
    isDark: false,
  }
}

// Helper hook for getting primary colors based on theme
export const usePrimaryColors = () => {
  const context = useTheme()
  const isDark = context?.isDark || false
  
  // Just return hardcoded primary colors
  if (isDark) {
    return {
      primary: '#10B981',     // primary[500]
      primaryLight: '#34D399', // primary[400]
      primaryDark: '#059669',  // primary[600]
    }
  }
  
  return {
    primary: '#047857',     // primary[700]
    primaryLight: '#059669', // primary[600]
    primaryDark: '#065F46',  // primary[800]
  }
}
