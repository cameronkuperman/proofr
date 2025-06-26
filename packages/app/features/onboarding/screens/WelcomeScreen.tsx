import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native'
import { MotiView } from 'moti'
import { LinearGradient } from 'expo-linear-gradient'
import { Easing } from 'react-native-reanimated'

const { width, height } = Dimensions.get('window')

interface WelcomeScreenProps {
  onGetStarted: () => void
  onLogin: () => void
}

export function WelcomeScreen({ onGetStarted, onLogin }: WelcomeScreenProps) {
  const floatingAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Continuous floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start()
  }, [floatingAnim])

  const translateY = floatingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  })

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#001f3f', '#0055FE', '#001f3f']}
        locations={[0, 0.5, 1]}
        style={styles.gradient}
      >
        {/* Animated background elements */}
        {[...Array(5)].map((_, i) => (
          <MotiView
            key={i}
            from={{
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              type: 'timing',
              duration: 4000 + i * 1000,
              delay: i * 500,
              loop: true,
            }}
            style={[
              styles.backgroundCircle,
              {
                width: 200 + i * 50,
                height: 200 + i * 50,
                left: Math.random() * width - 100,
                top: Math.random() * height - 100,
                backgroundColor: ['#0055FE', '#FFB800', '#8B0000'][i % 3],
              },
            ]}
          />
        ))}

        {/* Logo and tagline */}
        <Animated.View
          style={[
            styles.logoContainer,
            { transform: [{ translateY }] }
          ]}
        >
          <MotiView
            from={{ scale: 0, rotate: '0deg' }}
            animate={{ scale: 1, rotate: '360deg' }}
            transition={{
              type: 'spring',
              delay: 300,
            }}
            style={styles.logoWrapper}
          >
            <View style={styles.logo}>
              <Text style={styles.logoText}>P</Text>
            </View>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 800 }}
          >
            <Text style={styles.appName}>Proofr</Text>
            <Text style={styles.tagline}>Your Dream School Awaits</Text>
          </MotiView>
        </Animated.View>

        {/* Stats section */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1200 }}
          style={styles.statsContainer}
        >
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>15K+</Text>
            <Text style={styles.statLabel}>Success Stories</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statLabel}>Acceptance Rate</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>127</Text>
            <Text style={styles.statLabel}>Top Schools</Text>
          </View>
        </MotiView>

        {/* CTA Buttons */}
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 1500, type: 'spring' }}
          style={styles.ctaContainer}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onGetStarted}
            style={styles.getStartedButton}
          >
            <LinearGradient
              colors={['#FFB800', '#FFA000']}
              style={styles.getStartedGradient}
            >
              <Text style={styles.getStartedText}>Get Started</Text>
              <MotiView
                from={{ translateX: 0 }}
                animate={{ translateX: 5 }}
                transition={{
                  type: 'timing',
                  duration: 500,
                  loop: true,
                  repeatReverse: true,
                }}
              >
                <Text style={styles.arrow}>→</Text>
              </MotiView>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onLogin}
            style={styles.loginButton}
          >
            <Text style={styles.loginText}>I already have an account</Text>
          </TouchableOpacity>
        </MotiView>

        {/* Trust badges */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1800 }}
          style={styles.trustContainer}
        >
          <Text style={styles.trustText}>Trusted by students at</Text>
          <View style={styles.schoolBadges}>
            {['🏛️', '🌲', '🔬', '🎭'].map((emoji, i) => (
              <MotiView
                key={i}
                from={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  delay: 2000 + i * 100,
                }}
                style={styles.schoolBadge}
              >
                <Text style={styles.schoolEmoji}>{emoji}</Text>
              </MotiView>
            ))}
          </View>
        </MotiView>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundCircle: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoWrapper: {
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 25,
    backgroundColor: '#FFB800',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 10,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '900',
    color: '#001f3f',
  },
  appName: {
    fontSize: 48,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '300',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 60,
    paddingHorizontal: 40,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFB800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  ctaContainer: {
    width: '100%',
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  getStartedButton: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  getStartedGradient: {
    flexDirection: 'row',
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#001f3f',
    marginRight: 8,
  },
  arrow: {
    fontSize: 24,
    color: '#001f3f',
  },
  loginButton: {
    marginTop: 20,
    paddingVertical: 16,
  },
  loginText: {
    fontSize: 16,
    color: '#fff',
    textDecorationLine: 'underline',
  },
  trustContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  trustText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 12,
  },
  schoolBadges: {
    flexDirection: 'row',
    gap: 16,
  },
  schoolBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  schoolEmoji: {
    fontSize: 24,
  },
})