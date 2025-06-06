import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Animated, Image, ScrollView, Keyboard } from 'react-native'

export function LoginScreen() {
  // State for form inputs
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Animations
  const logoScale = useRef(new Animated.Value(0)).current
  const logoRotate = useRef(new Animated.Value(0)).current
  const fadeIn = useRef(new Animated.Value(0)).current
  const slideUp = useRef(new Animated.Value(50)).current
  const scrollViewRef = useRef(null)

  useEffect(() => {
    // Logo entrance animation - similar to Freelancer bird
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeIn, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideUp, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start()
  }, [])

  const handleInputFocus = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }

  const logoRotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Animated Logo Section */}
        <View style={styles.logoSection}>
          <Animated.View 
            style={[
              styles.logoContainer,
              {
                transform: [
                  { scale: logoScale },
                  { rotate: logoRotateInterpolate }
                ]
              }
            ]}
          >
            <Image 
              source={require('../../../assets/images/proofr-logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </Animated.View>
          <Text style={styles.logoText}>proofr</Text>
          <Animated.View style={{ opacity: fadeIn }}>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.subtitle}>Your dream school awaits</Text>
          </Animated.View>
        </View>

        {/* Animated Auth Section */}
        <Animated.View 
          style={[
            styles.authSection,
            {
              opacity: fadeIn,
              transform: [{ translateY: slideUp }]
            }
          ]}
        >
          <TouchableOpacity style={styles.googleButton}>
            <View style={styles.googleIconContainer}>
              <Image 
                source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/800px-Google_%22G%22_logo.svg.png'}}
                style={styles.googleLogoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.appleButton}>
            <View style={styles.appleIconContainer}>
              <Text style={styles.appleIcon}></Text>
            </View>
            <Text style={styles.appleButtonText}>Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkedinButton}>
            <View style={styles.linkedinIconContainer}>
              <Text style={styles.linkedinIcon}>in</Text>
            </View>
            <Text style={styles.linkedinButtonText}>Continue with LinkedIn</Text>
          </TouchableOpacity>

          {/* OR Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email/Username Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="Email or Username"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={handleInputFocus}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInputWithIcon}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={handleInputFocus}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.showHideText}>{showPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Log In Button */}
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Log in</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Animated Bottom Section */}
        <Animated.View 
          style={[
            styles.bottomSection,
            {
              opacity: fadeIn,
              transform: [{ translateY: slideUp }]
            }
          ]}
        >
          <Text style={styles.signupPrompt}>
            Don&apos;t have an account? <Text style={styles.signupLink}>Sign up</Text>
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a', // Much darker background
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  
  // Animated Logo Section
  logoSection: {
    alignItems: 'center',
    marginBottom: -75,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: -55,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoImage: {
    width: 160,
    height: 160,
    // Removed tintColor to show actual logo
  },
  logoText: {
    fontSize: 42,
    fontWeight: '700',
    color: 'white',
    marginTop: 0,
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 95,
  },
  
  // Auth Section
  authSection: {
    paddingHorizontal: 0,
    marginBottom: 20,
  },
  
  // Premium Social Login Buttons
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#dadce0',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  googleIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  googleIcon: {
    color: '#4285f4',
    fontWeight: '700',
    fontSize: 18,
    fontFamily: 'Product Sans',
  },
  googleLogoImage: {
    width: 24,
    height: 24,
  },
  linkedinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0077b5',
    borderWidth: 0,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#0077b5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    borderWidth: 0,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  appleIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  appleIcon: {
    color: 'white',
    fontWeight: '400',
    fontSize: 20,
  },
  linkedinIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  linkedinIcon: {
    fontSize: 16,
    color: 'white',
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3c4043',
    flex: 1,
    textAlign: 'center',
  },
  linkedinButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  appleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  
  // OR Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 16,
    fontWeight: '400',
  },
  
  // Modern Dark Input Fields
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    fontSize: 16,
    color: 'white',
    fontWeight: '400',
    flex: 1,
  },
  textInputWithIcon: {
    fontSize: 16,
    color: 'white',
    fontWeight: '400',
    flex: 1,
    marginRight: 12,
  },
  showHideText: {
    fontSize: 14,
    color: '#06b6d4',
    fontWeight: '600',
  },
  
  // Forgot Password
  forgotPassword: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#06b6d4',
    fontWeight: '600',
  },
  
  // Login Button - Enhanced for dark theme
  loginButton: {
    backgroundColor: '#06b6d4',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: 'white',
  },
  
  // Bottom Section
  bottomSection: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  signupPrompt: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '400',
  },
  signupLink: {
    color: '#06b6d4',
    fontWeight: '700',
  },
})