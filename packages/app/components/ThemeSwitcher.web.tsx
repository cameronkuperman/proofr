import React from 'react'
import { useTheme } from '../contexts/ThemeContext.web'
import { Sun, Moon, Monitor } from 'lucide-react'

export function ThemeSwitcher() {
  const { theme, setTheme, isSystem } = useTheme()

  const options = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ] as const

  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-900 rounded-xl p-1 gap-1">
      {options.map((option) => {
        const Icon = option.icon
        const isActive = isSystem
          ? option.value === 'system'
          : option.value === theme

        return (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-200
              ${
                isActive
                  ? 'bg-white dark:bg-gray-800 text-primary-700 dark:text-primary-500 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }
            `}
          >
            <Icon size={16} />
            <span>{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// Compact version for navigation bars
export function ThemeSwitcherCompact() {
  const { theme, setTheme, isSystem, isDark } = useTheme()

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
    if (isSystem) return Monitor
    return isDark ? Moon : Sun
  }

  const Icon = getIcon()

  return (
    <button
      onClick={cycleTheme}
      className="
        w-10 h-10 rounded-full
        bg-gray-100 dark:bg-gray-900
        border border-gray-200 dark:border-gray-700
        flex items-center justify-center
        hover:bg-gray-200 dark:hover:bg-gray-800
        transition-colors duration-200
        group
      "
      aria-label="Toggle theme"
    >
      <Icon
        size={20}
        className="text-primary-700 dark:text-primary-500 group-hover:scale-110 transition-transform"
      />
    </button>
  )
}

// Animated theme switcher with smooth transitions
export function ThemeSwitcherAnimated() {
  const { theme, setTheme, isSystem, isDark } = useTheme()

  const handleThemeChange = (value: 'light' | 'dark' | 'system') => {
    setTheme(value)
  }

  return (
    <div className="relative inline-flex items-center bg-gray-100 dark:bg-gray-900 rounded-full p-1">
      {/* Sliding background indicator */}
      <div
        className={`
          absolute h-8 bg-white dark:bg-gray-800 rounded-full
          transition-all duration-300 ease-out shadow-sm
          ${isSystem ? 'w-20 translate-x-[152px]' : theme === 'light' ? 'w-16 translate-x-0' : 'w-16 translate-x-[76px]'}
        `}
      />
      
      {/* Buttons */}
      <button
        onClick={() => handleThemeChange('light')}
        className={`
          relative z-10 flex items-center gap-2 px-3 py-1.5 rounded-full
          text-sm font-medium transition-colors duration-200
          ${(!isSystem && theme === 'light')
            ? 'text-primary-700 dark:text-primary-500'
            : 'text-gray-600 dark:text-gray-400'
          }
        `}
      >
        <Sun size={16} />
        <span>Light</span>
      </button>
      
      <button
        onClick={() => handleThemeChange('dark')}
        className={`
          relative z-10 flex items-center gap-2 px-3 py-1.5 rounded-full
          text-sm font-medium transition-colors duration-200
          ${(!isSystem && theme === 'dark')
            ? 'text-primary-700 dark:text-primary-500'
            : 'text-gray-600 dark:text-gray-400'
          }
        `}
      >
        <Moon size={16} />
        <span>Dark</span>
      </button>
      
      <button
        onClick={() => handleThemeChange('system')}
        className={`
          relative z-10 flex items-center gap-2 px-3 py-1.5 rounded-full
          text-sm font-medium transition-colors duration-200
          ${isSystem
            ? 'text-primary-700 dark:text-primary-500'
            : 'text-gray-600 dark:text-gray-400'
          }
        `}
      >
        <Monitor size={16} />
        <span>System</span>
      </button>
    </div>
  )
}