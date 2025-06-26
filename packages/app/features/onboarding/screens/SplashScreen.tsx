import React, { useEffect } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { MotiView } from 'moti'
import { Easing } from 'react-native-reanimated'

const { width, height } = Dimensions.get('window')

interface SplashScreenProps {
  onAnimationComplete: () => void
}

export function SplashScreen({ onAnimationComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationComplete()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onAnimationComplete])

  return (
    <LinearGradient
      colors={['#001f3f', '#8B0000', '#FFB800']}
      locations={[0, 0.6, 1]}
      style={styles.container}
    >
      {/* Floating shapes like Phantom */}
      {[...Array(6)].map((_, i) => (
        <MotiView
          key={i}
          from={{
            opacity: 0,
            scale: 0,
            translateX: Math.random() * width - width / 2,
            translateY: Math.random() * height - height / 2,
          }}
          animate={{
            opacity: [0, 0.3, 0],
            scale: [0, 1.5, 0],
            translateX: Math.random() * width - width / 2,
            translateY: Math.random() * height - height / 2,
          }}
          transition={{
            type: 'timing',
            duration: 3000,
            delay: i * 200,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            loop: true,
          }}
          style={[
            styles.floatingShape,
            {
              width: 100 + Math.random() * 100,
              height: 100 + Math.random() * 100,
              borderRadius: 50 + Math.random() * 50,
              backgroundColor: ['#0055FE', '#FFB800', '#8B0000'][i % 3],
            },
          ]}
        />
      ))}

      {/* Graduation cap animation */}
      <MotiView
        from={{ scale: 0, rotate: '0deg' }}
        animate={{ scale: 1, rotate: '360deg' }}
        transition={{
          type: 'spring',
          damping: 15,
          stiffness: 100,
          delay: 300,
        }}
        style={styles.capContainer}
      >
        <View style={styles.graduationCap}>
          <View style={styles.capTop} />
          <View style={styles.capBase} />
        </View>
      </MotiView>

      {/* Transform to letter */}
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: 'timing',
          duration: 800,
          delay: 1200,
          easing: Easing.out(Easing.exp),
        }}
        style={styles.letterContainer}
      >
        <View style={styles.acceptanceLetter}>
          <View style={styles.letterFlap} />
          <MotiView
            from={{ translateY: 20, opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            transition={{
              type: 'timing',
              duration: 600,
              delay: 1800,
            }}
            style={styles.logoContainer}
          >
            <View style={styles.logo}>
              {/* Proofr text logo placeholder */}
              <View style={styles.logoText} />
            </View>
          </MotiView>
        </View>
      </MotiView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingShape: {
    position: 'absolute',
    opacity: 0.3,
  },
  capContainer: {
    position: 'absolute',
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  graduationCap: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capTop: {
    width: 80,
    height: 10,
    backgroundColor: '#1a1a1a',
    position: 'absolute',
    top: 20,
  },
  capBase: {
    width: 0,
    height: 0,
    borderLeftWidth: 40,
    borderRightWidth: 40,
    borderBottomWidth: 40,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#1a1a1a',
    position: 'absolute',
    bottom: 20,
  },
  letterContainer: {
    position: 'absolute',
    width: 200,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptanceLetter: {
    width: 160,
    height: 100,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  letterFlap: {
    position: 'absolute',
    top: -20,
    width: 0,
    height: 0,
    borderLeftWidth: 80,
    borderRightWidth: 80,
    borderBottomWidth: 40,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#e8e8e8',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    width: 80,
    height: 20,
    backgroundColor: '#0055FE',
    borderRadius: 4,
  },
})