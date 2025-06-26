import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { MotiView } from 'moti'
import { Ionicons } from '@expo/vector-icons'
interface AccountCreationScreenProps {
  state: any
  onComplete: () => void
}

export function AccountCreationScreen({ state, onComplete }: AccountCreationScreenProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const isStudent = state.role === 'student'
  const userData = isStudent ? state.studentData : state.consultantData

  const handleCreateAccount = async () => {
    // Validation
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email')
      return
    }
    if (!password || password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters')
      return
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }

    setIsLoading(true)
    
    try {
      // TODO: Implement actual account creation API call
      // const response = await createAccount({
      //   email,
      //   password,
      //   role: state.role,
      //   onboardingData: userData,
      // })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Complete account creation
      onComplete()
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <LinearGradient
        colors={['#1a1a1a', '#000000']}
        style={{ flex: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 80 }}>
              {/* Header */}
              <MotiView
                from={{ opacity: 0, translateY: -20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 600 }}
              >
                <View style={{ alignItems: 'center', marginBottom: 40 }}>
                  <View style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 24,
                  }}>
                    <Ionicons name="person-add" size={40} color="#fff" />
                  </View>
                  
                  <Text style={{
                    fontSize: 28,
                    fontWeight: '700',
                    color: '#fff',
                    marginBottom: 8,
                  }}>
                    Create Your Account
                  </Text>
                  
                  <Text style={{
                    fontSize: 16,
                    color: 'rgba(255, 255, 255, 0.7)',
                    textAlign: 'center',
                  }}>
                    Join {isStudent ? 'thousands of students' : 'our community of consultants'}
                  </Text>
                </View>
              </MotiView>

              {/* Form */}
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 600, delay: 200 }}
              >
                <View style={{ marginBottom: 20 }}>
                  <Text style={{
                    fontSize: 14,
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: 8,
                  }}>
                    Email
                  </Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: 12,
                      padding: 16,
                      fontSize: 16,
                      color: '#fff',
                    }}
                  />
                </View>

                <View style={{ marginBottom: 20 }}>
                  <Text style={{
                    fontSize: 14,
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: 8,
                  }}>
                    Password
                  </Text>
                  <View>
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Create a password"
                      placeholderTextColor="rgba(255, 255, 255, 0.3)"
                      secureTextEntry={!showPassword}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: 12,
                        padding: 16,
                        fontSize: 16,
                        color: '#fff',
                        paddingRight: 50,
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: 16,
                        top: 16,
                      }}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={24}
                        color="rgba(255, 255, 255, 0.5)"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{ marginBottom: 32 }}>
                  <Text style={{
                    fontSize: 14,
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: 8,
                  }}>
                    Confirm Password
                  </Text>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm your password"
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    secureTextEntry={!showPassword}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderWidth: 1,
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: 12,
                      padding: 16,
                      fontSize: 16,
                      color: '#fff',
                    }}
                  />
                </View>

                {/* Password Requirements */}
                <View style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 32,
                }}>
                  <Text style={{
                    fontSize: 14,
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: 8,
                  }}>
                    Password must have:
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={password.length >= 8 ? '#4CAF50' : 'rgba(255, 255, 255, 0.3)'}
                    />
                    <Text style={{
                      fontSize: 14,
                      color: password.length >= 8 ? '#4CAF50' : 'rgba(255, 255, 255, 0.5)',
                      marginLeft: 8,
                    }}>
                      At least 8 characters
                    </Text>
                  </View>
                </View>
              </MotiView>

              {/* Create Account Button */}
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 600, delay: 400 }}
              >
                <TouchableOpacity
                  onPress={handleCreateAccount}
                  disabled={isLoading}
                  style={{ marginBottom: 24 }}
                >
                  <LinearGradient
                    colors={['#9333ea', '#7c3aed']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      paddingVertical: 16,
                      borderRadius: 30,
                      alignItems: 'center',
                      opacity: isLoading ? 0.7 : 1,
                    }}
                  >
                    <Text style={{
                      fontSize: 18,
                      fontWeight: '600',
                      color: '#fff',
                    }}>
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Terms */}
                <Text style={{
                  fontSize: 14,
                  color: 'rgba(255, 255, 255, 0.5)',
                  textAlign: 'center',
                  lineHeight: 20,
                }}>
                  By creating an account, you agree to our{'\n'}
                  <Text style={{ color: '#9333ea' }}>Terms of Service</Text> and{' '}
                  <Text style={{ color: '#9333ea' }}>Privacy Policy</Text>
                </Text>
              </MotiView>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  )
}