import React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { ProfileScreen as ProfileScreenImpl } from './ProfileScreen.native'
import { useTheme } from '../../../contexts/ThemeContext'

// Error boundary component
class ProfileErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('ProfileScreen error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, color: '#666' }}>Profile loading...</Text>
          <ActivityIndicator size="large" color="#10B981" style={{ marginTop: 20 }} />
        </View>
      )
    }

    return this.props.children
  }
}

// Wrapper that ensures theme is ready
export function ProfileScreen() {
  // Try to use theme, but don't crash if it's not ready
  const [isReady, setIsReady] = React.useState(false)
  
  React.useEffect(() => {
    // Give theme context time to initialize
    const timer = setTimeout(() => setIsReady(true), 100)
    return () => clearTimeout(timer)
  }, [])
  
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    )
  }
  
  return (
    <ProfileErrorBoundary>
      <ProfileScreenImpl />
    </ProfileErrorBoundary>
  )
}