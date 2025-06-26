import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { WelcomeScreen } from './screens/WelcomeScreen'
import { SplashScreen } from './screens/SplashScreen'
import { RoleSelectionScreen } from './screens/RoleSelectionScreen'
import { DreamSchoolsScreen } from './screens/student/DreamSchoolsScreen'
import { YearSelectionScreen } from './screens/student/YearSelectionScreen'
import { PainPointsScreen } from './screens/student/PainPointsScreen'
import { SuccessStoryScreen } from './screens/student/SuccessStoryScreen'
import { VerificationScreen } from './screens/consultant/VerificationScreen'
import { ProfileSetupScreen } from './screens/consultant/ProfileSetupScreen'
import { ServicesScreen } from './screens/consultant/ServicesScreen'
import { EarningsPreviewScreen } from './screens/consultant/EarningsPreviewScreen'
import { AccountCreationScreen } from './screens/AccountCreationScreen'
import { MatchingScreen } from './screens/MatchingScreen'
import { OnboardingState, UserRole } from './types'

// AsyncStorage might not be available in all environments
let AsyncStorage: any
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default
} catch (error) {
  console.log('AsyncStorage not available in OnboardingNavigator')
  AsyncStorage = {
    getItem: async () => null,
    setItem: async () => {},
  }
}

interface OnboardingNavigatorProps {
  route?: {
    params?: {
      skipWelcome?: boolean
    }
  }
}

export function OnboardingNavigator({ route }: OnboardingNavigatorProps) {
  const navigation = useNavigation<any>()
  const skipWelcome = route?.params?.skipWelcome || false
  
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
    navigation.navigate('login')
  }

  const handleSplashComplete = () => {
    setCurrentScreen('roleSelection')
  }

  const handleRoleSelection = (role: UserRole) => {
    setOnboardingState(prev => ({ ...prev, role }))
    if (role === 'student') {
      setCurrentScreen('dreamSchools')
    } else {
      setCurrentScreen('consultantProfile')
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
    navigation.navigate('login')
  }

  const handleSkipDreamSchools = () => {
    setCurrentScreen('yearSelection')
  }

  // Consultant flow handlers
  const handleVerificationContinue = (email: string) => {
    setOnboardingState(prev => ({
      ...prev,
      consultantData: { ...prev.consultantData, universityEmail: email, isVerified: true },
    }))
    setCurrentScreen('consultantProfile')
  }

  const handleProfileSetupContinue = (profileData: any) => {
    setOnboardingState(prev => ({
      ...prev,
      consultantData: {
        ...prev.consultantData,
        university: profileData.university,
        year: profileData.year,
        major: profileData.major,
        gpa: profileData.gpa,
        testScores: {
          sat: profileData.satScore,
          act: profileData.actScore,
        },
        successStory: profileData.successStory,
      },
    }))
    setCurrentScreen('consultantServices')
  }

  const handleServicesContinue = (services: any[]) => {
    setOnboardingState(prev => ({
      ...prev,
      consultantData: {
        ...prev.consultantData,
        services: services.map(s => ({
          type: s.id as any,
          minPrice: s.priceRange.min,
          maxPrice: s.priceRange.max,
          isActive: true,
        })),
      },
    }))
    setCurrentScreen('consultantEarnings')
  }

  const handleEarningsPreviewContinue = () => {
    setCurrentScreen('createAccount')
  }

  const handleAccountCreated = () => {
    setCurrentScreen('matching')
  }

  const completeOnboarding = async () => {
    console.log('completeOnboarding called')
    try {
      // Save onboarding state
      await AsyncStorage.setItem('onboardingState', JSON.stringify(onboardingState))
      await AsyncStorage.setItem('onboardingComplete', 'true')
      await AsyncStorage.setItem('authToken', 'temp-token') // Temporary auth token
      
      console.log('Saved onboarding state, navigation will update automatically...')
    } catch (error) {
      console.error('Error completing onboarding:', error)
    }
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

      // Consultant screens
      case 'consultantVerification':
        return <VerificationScreen onContinue={handleVerificationContinue} />

      case 'consultantProfile':
        return (
          <ProfileSetupScreen
            universityEmail={onboardingState.consultantData.universityEmail}
            onContinue={handleProfileSetupContinue}
          />
        )

      case 'consultantServices':
        return <ServicesScreen onContinue={handleServicesContinue} />

      case 'consultantEarnings':
        return (
          <EarningsPreviewScreen
            services={onboardingState.consultantData.services}
            onContinue={handleEarningsPreviewContinue}
          />
        )

      case 'createAccount':
        return (
          <AccountCreationScreen
            state={onboardingState}
            onComplete={handleAccountCreated}
          />
        )

      case 'matching':
        return (
          <MatchingScreen
            state={onboardingState}
            onComplete={completeOnboarding}
          />
        )

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