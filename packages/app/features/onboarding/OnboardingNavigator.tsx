import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { useRouter } from 'solito/router'
import { WelcomeScreen } from './screens/WelcomeScreen'
import { SplashScreen } from './screens/SplashScreen'
import { RoleSelectionScreen } from './screens/RoleSelectionScreen'
import { DreamSchoolsScreen } from './screens/student/DreamSchoolsScreen'
import { YearSelectionScreen } from './screens/student/YearSelectionScreen'
import { PainPointsScreen } from './screens/student/PainPointsScreen'
import { SuccessStoryScreen } from './screens/student/SuccessStoryScreen'
import { OnboardingState, UserRole } from './types'

interface OnboardingNavigatorProps {
  skipWelcome?: boolean // If coming from sign-up, skip welcome
}

export function OnboardingNavigator({ skipWelcome = false }: OnboardingNavigatorProps) {
  const { push } = useRouter()
  const [currentScreen, setCurrentScreen] = useState<string>(skipWelcome ? 'splash' : 'welcome')
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    currentStep: 0,
    role: null,
    studentData: {
      dreamSchools: [],
      year: null,
      painPoints: [],
      name: '',
      email: '',
    },
    consultantData: {
      universityEmail: '',
      isVerified: false,
      university: '',
      year: '',
      major: '',
      gpa: '',
      testScores: {},
      successStory: '',
      services: [],
    },
  })

  const handleGetStarted = () => {
    setCurrentScreen('splash')
  }

  const handleLogin = () => {
    push('/sign-in')
  }

  const handleSplashComplete = () => {
    setCurrentScreen('roleSelection')
  }

  const handleRoleSelection = (role: UserRole) => {
    setOnboardingState(prev => ({ ...prev, role }))
    if (role === 'student') {
      setCurrentScreen('dreamSchools')
    } else {
      setCurrentScreen('consultantVerify')
    }
  }

  const handleDreamSchoolsContinue = (schools: string[]) => {
    setOnboardingState(prev => ({
      ...prev,
      studentData: { ...prev.studentData, dreamSchools: schools },
    }))
    setCurrentScreen('yearSelection')
  }

  const handleYearSelection = (year: 'senior' | 'junior' | 'sophomore' | 'transfer') => {
    setOnboardingState(prev => ({
      ...prev,
      studentData: { ...prev.studentData, year },
    }))
    setCurrentScreen('painPoints')
  }

  const handlePainPointsContinue = (painPoints: ('essays' | 'interviews' | 'activities' | 'test_prep')[]) => {
    setOnboardingState(prev => ({
      ...prev,
      studentData: { ...prev.studentData, painPoints },
    }))
    setCurrentScreen('successStory')
  }

  const handleSuccessStoryContinue = () => {
    setCurrentScreen('createAccount')
  }

  const handleSignIn = () => {
    push('/sign-in')
  }

  const handleSkipDreamSchools = () => {
    setCurrentScreen('yearSelection')
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen
            onGetStarted={handleGetStarted}
            onLogin={handleLogin}
          />
        )

      case 'splash':
        return <SplashScreen onAnimationComplete={handleSplashComplete} />

      case 'roleSelection':
        return (
          <RoleSelectionScreen
            onSelectRole={handleRoleSelection}
            onSignIn={handleSignIn}
          />
        )

      case 'dreamSchools':
        return (
          <DreamSchoolsScreen
            onContinue={handleDreamSchoolsContinue}
            onSkip={handleSkipDreamSchools}
          />
        )

      case 'yearSelection':
        return <YearSelectionScreen onContinue={handleYearSelection} />

      case 'painPoints':
        return <PainPointsScreen onContinue={handlePainPointsContinue} />

      case 'successStory':
        return <SuccessStoryScreen onContinue={handleSuccessStoryContinue} />

      case 'createAccount':
        // TODO: Add account creation screen
        return null

      default:
        return null
    }
  }

  return <View style={styles.container}>{renderScreen()}</View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
})