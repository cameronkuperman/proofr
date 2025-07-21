import React from 'react'
import { SafeArea } from 'app/provider/safe-area'
import { NavigationProvider } from './navigation'
import { ThemeProvider } from '../contexts/ThemeContext'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeArea>
        <ThemeProvider>
          <NavigationProvider>{children}</NavigationProvider>
        </ThemeProvider>
      </SafeArea>
    </GestureHandlerRootView>
  )
}
