// Modern Ivy Supreme - Production Color System
export const colors = {
  // Primary Scale - Emerald
  primary: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981', // Hero Green
    600: '#059669',
    700: '#047857', // Deep Emerald
    800: '#065F46',
    900: '#064E3B',
  },

  // Accent Scale - Crimson
  accent: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626', // Hero Red
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },

  // Purple Scale - Expert
  purple: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#A78BFA',
    500: '#8B5CF6', // Hero Purple
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },

  // Teal Scale - Fresh
  teal: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6', // Hero Teal
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
  },

  // Semantic Colors
  success: {
    light: '#A7F3D0',
    main: '#10B981',
    dark: '#047857',
  },

  warning: {
    light: '#FEF3C7',
    main: '#F59E0B',
    dark: '#D97706',
  },

  info: {
    light: '#DBEAFE',
    main: '#3B82F6',
    dark: '#1D4ED8',
  },

  error: {
    light: '#FECACA',
    main: '#EF4444',
    dark: '#B91C1C',
  },

  // Neutral Scale - Slate
  gray: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },

  // Chart/Data Visualization
  chart: {
    1: '#10B981', // Primary Green
    2: '#3B82F6', // Blue
    3: '#8B5CF6', // Purple
    4: '#F59E0B', // Amber
    5: '#EF4444', // Red
    6: '#14B8A6', // Teal
  },

  // University Colors
  university: {
    harvard: '#A51C30',
    yale: '#00356B',
    princeton: '#FF6900',
    stanford: '#8C1515',
    mit: '#A31F34',
    columbia: '#B9D9EB',
    penn: '#011F5B',
    brown: '#4E3629',
    cornell: '#B31B1B',
    dartmouth: '#00693E',
  },

  // Light Mode Surfaces
  light: {
    background: {
      default: '#FAFAF8', // Warm off-white
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

  // Dark Mode Surfaces
  dark: {
    background: {
      default: '#000000', // True black
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

  // Special Effects
  effects: {
    shadowLight: 'rgba(0, 0, 0, 0.05)',
    shadowMedium: 'rgba(0, 0, 0, 0.07)',
    shadowDark: 'rgba(0, 0, 0, 0.1)',
    glowPrimary: 'rgba(16, 185, 129, 0.4)',
    glowAccent: 'rgba(220, 38, 38, 0.4)',
    glowPurple: 'rgba(139, 92, 246, 0.4)',
    blur: 'rgba(255, 255, 255, 0.8)',
  },

  // Interactive States
  alpha: {
    hover: 0.08,
    pressed: 0.12,
    selected: 0.16,
    focus: 0.24,
    disabled: 0.38,
  },
} as const

// Helper function to get color with opacity
export const withOpacity = (color: string, opacity: number): string => {
  // Convert hex to rgba
  const hex = color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

// Type-safe theme colors
export type Colors = typeof colors
export type ThemeMode = 'light' | 'dark'