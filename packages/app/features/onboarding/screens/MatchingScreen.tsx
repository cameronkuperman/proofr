import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { MotiView } from 'moti'
import { Ionicons } from '@expo/vector-icons'
interface MatchingScreenProps {
  state: any
  onComplete: () => void
}

export function MatchingScreen({ state, onComplete }: MatchingScreenProps) {
  const isStudent = state.role === 'student'

  useEffect(() => {
    // Navigate to home after animation completes
    const timer = setTimeout(() => {
      onComplete()
    }, 2500) // Reduced from 4000ms to 2500ms

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <LinearGradient
        colors={['#1a1a1a', '#000000']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        {/* Animated circles */}
        <View style={{ position: 'relative', width: 300, height: 300 }}>
          {/* Student/User circle */}
          <MotiView
            from={{
              translateX: -100,
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              translateX: 0,
              opacity: 1,
              scale: 1,
            }}
            transition={{
              type: 'timing',
              duration: 1000,
            }}
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              marginTop: -60,
            }}
          >
            <View style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: '#9333ea',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Ionicons name="person" size={50} color="#fff" />
            </View>
          </MotiView>

          {/* Consultant circle */}
          <MotiView
            from={{
              translateX: 100,
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              translateX: 0,
              opacity: 1,
              scale: 1,
            }}
            transition={{
              type: 'timing',
              duration: 1000,
            }}
            style={{
              position: 'absolute',
              right: 0,
              top: '50%',
              marginTop: -60,
            }}
          >
            <View style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: '#7c3aed',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Ionicons name="school" size={50} color="#fff" />
            </View>
          </MotiView>

          {/* Connection line */}
          <MotiView
            from={{
              scaleX: 0,
              opacity: 0,
            }}
            animate={{
              scaleX: 1,
              opacity: 1,
            }}
            transition={{
              type: 'timing',
              duration: 800,
              delay: 1000,
            }}
            style={{
              position: 'absolute',
              left: 60,
              right: 60,
              top: '50%',
              height: 3,
              backgroundColor: 'rgba(147, 51, 234, 0.5)',
              marginTop: -1.5,
            }}
          />

          {/* Sparkles */}
          {[...Array(6)].map((_, i) => (
            <MotiView
              key={i}
              from={{
                opacity: 0,
                scale: 0,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                type: 'timing',
                duration: 2000,
                delay: 1800 + (i * 200),
                loop: true,
              }}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                marginLeft: -10,
                marginTop: -10,
              }}
            >
              <Ionicons
                name="sparkles"
                size={20}
                color="#9333ea"
                style={{
                  transform: [
                    { translateX: Math.cos(i * 60 * Math.PI / 180) * 80 },
                    { translateY: Math.sin(i * 60 * Math.PI / 180) * 80 },
                  ],
                }}
              />
            </MotiView>
          ))}
        </View>

        {/* Text */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: 'timing',
            duration: 600,
            delay: 1800,
          }}
          style={{ marginTop: 80 }}
        >
          <Text style={{
            fontSize: 28,
            fontWeight: '700',
            color: '#fff',
            textAlign: 'center',
            marginBottom: 12,
          }}>
            {isStudent ? 'Finding Your Perfect Match' : 'Connecting You with Students'}
          </Text>
          
          <Text style={{
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.7)',
            textAlign: 'center',
            paddingHorizontal: 40,
          }}>
            {isStudent 
              ? 'We\'re matching you with consultants who got into your dream schools'
              : 'Get ready to help students achieve their college dreams'
            }
          </Text>
        </MotiView>

        {/* Loading dots */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            type: 'timing',
            duration: 600,
            delay: 2400,
          }}
          style={{
            flexDirection: 'row',
            marginTop: 40,
          }}
        >
          {[0, 1, 2].map((i) => (
            <MotiView
              key={i}
              animate={{
                translateY: [0, -10, 0],
              }}
              transition={{
                type: 'timing',
                duration: 600,
                delay: i * 200,
                loop: true,
              }}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: '#9333ea',
                marginHorizontal: 4,
              }}
            />
          ))}
        </MotiView>
      </LinearGradient>
    </View>
  )
}