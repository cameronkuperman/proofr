import React, { useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Animated, Image } from 'react-native'

export function LoginScreen() {
  // Animations
  const logoScale = useRef(new Animated.Value(0)).current
  const logoRotate = useRef(new Animated.Value(0)).current
  const fadeIn = useRef(new Animated.Value(0)).current
  const slideUp = useRef(new Animated.Value(50)).current

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

  const logoRotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      
      <View style={styles.content}>
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
              <Text style={styles.googleIcon}>G</Text>
            </View>
            <Text style={styles.buttonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.appleButton}>
            <View style={styles.appleIconContainer}>
              <Text style={styles.appleIcon}></Text>
            </View>
            <Text style={styles.buttonText}>Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.xButton}>
            <View style={styles.xIconContainer}>
              <Text style={styles.xIcon}>𝕏</Text>
            </View>
            <Text style={styles.buttonText}>Continue with X</Text>
          </TouchableOpacity>

          {/* OR Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email/Username Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputPlaceholder}>Email or Username</Text>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputPlaceholder}>Password</Text>
            <Text style={styles.eyeIcon}>👁️</Text>
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
            Don't have an account? <Text style={styles.signupLink}>Sign up</Text>
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a', // Much darker background
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  
  // Animated Logo Section
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
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
    marginTop: 8,
    textAlign: 'center',
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
    marginBottom: 16,
  },
  
  // Auth Section
  authSection: {
    paddingHorizontal: 0,
    marginBottom: 20,
  },
  
  // Modern Dark Social Buttons
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  googleIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 35, // Perfect circle
    backgroundColor: '#4285f4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    margin: 0,
  },
  googleIcon: {
    color: 'white',
    fontWeight: '700',
    fontSize: 20,
    margin: 0,
    padding: 0,
  },
  xButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  appleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  appleIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 35, // Perfect circle
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    margin: 0,
  },
  appleIcon: {
    color: 'black',
    fontWeight: '400',
    fontSize: 20,
    margin: 0,
    padding: 0,
  },
  xIconContainer: {
    width: 39,
    height: 39,
    borderRadius: 39, // Perfect circle
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    margin: 0,
  },
  xIcon: {
    fontSize: 20, // 40% larger: 14 * 1.4 = 19.6 ≈ 20
    color: 'white',
    fontWeight: '700',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginRight: 28, // Offset for icon space to center text
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
  inputPlaceholder: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '400',
  },
  eyeIcon: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.5)',
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