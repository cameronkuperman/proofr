import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
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
  const supabase = useSupabaseClient()
  const user = useUser()
  
  const [theme, setThemeState] = useState<ThemeMode>('light')
  const [isSystem, setIsSystem] = useState(true)

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    
    // Set CSS variables for Tailwind
    const themeColors = theme === 'dark' ? colors.dark : colors.light
    
    // Background colors
    root.style.setProperty('--color-background', themeColors.background.default)
    root.style.setProperty('--color-surface', themeColors.background.paper)
    
    // Text colors
    root.style.setProperty('--color-text-primary', themeColors.text.primary)
    root.style.setProperty('--color-text-secondary', themeColors.text.secondary)
    
    // Primary colors
    root.style.setProperty('--color-primary', theme === 'dark' ? colors.primary[500] : colors.primary[700])
    root.style.setProperty('--color-primary-hover', theme === 'dark' ? colors.primary[400] : colors.primary[600])
    
    // Meta theme color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColors.background.default)
    }
  }, [theme])

  // Load theme on mount
  useEffect(() => {
    loadTheme()
  }, [])

  // Sync with Supabase when user is logged in
  useEffect(() => {
    if (!user) return

    loadUserTheme()

    const channel = supabase
      .channel(`theme-sync-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_theme_preferences',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const { theme_mode } = payload.new
          applyTheme(theme_mode)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, supabase])

  // Handle system theme changes
  useEffect(() => {
    if (!isSystem) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setThemeState(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [isSystem])

  const getSystemTheme = (): ThemeMode => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const loadTheme = () => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY)
      if (stored) {
        const { theme: storedTheme, isSystem: storedIsSystem } = JSON.parse(stored)
        setIsSystem(storedIsSystem)
        setThemeState(storedIsSystem ? getSystemTheme() : storedTheme)
      } else {
        // Default to system theme
        setThemeState(getSystemTheme())
      }
    } catch (error) {
      console.error('Error loading theme:', error)
      setThemeState(getSystemTheme())
    }
  }

  const loadUserTheme = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_theme_preferences')
        .select('theme_mode')
        .eq('user_id', user.id)
        .single()

      if (!error && data) {
        applyTheme(data.theme_mode)
      }
    } catch (error) {
      console.error('Error loading user theme:', error)
    }
  }

  const applyTheme = (themeMode: string) => {
    if (themeMode === 'system') {
      setIsSystem(true)
      setThemeState(getSystemTheme())
    } else {
      setIsSystem(false)
      setThemeState(themeMode as ThemeMode)
    }
  }

  const saveTheme = async (newTheme: ThemeMode | 'system') => {
    const isSystemTheme = newTheme === 'system'
    const actualTheme = isSystemTheme ? getSystemTheme() : newTheme

    // Save to local storage
    try {
      localStorage.setItem(
        THEME_STORAGE_KEY,
        JSON.stringify({ theme: actualTheme, isSystem: isSystemTheme })
      )
    } catch (error) {
      console.error('Error saving theme:', error)
    }

    // Save to Supabase if user is logged in
    if (user) {
      try {
        await supabase
          .from('user_theme_preferences')
          .upsert({
            user_id: user.id,
            theme_mode: newTheme,
            last_synced: new Date().toISOString(),
          }, {
            onConflict: 'user_id'
          })
      } catch (error) {
        console.error('Error syncing theme to Supabase:', error)
      }
    }
  }

  const setTheme = useCallback((newTheme: ThemeMode | 'system') => {
    applyTheme(newTheme)
    saveTheme(newTheme)
  }, [user])

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