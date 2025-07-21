import { useCallback, useEffect } from 'react'
import { View, Text, Dimensions, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
  withDecay,
} from 'react-native-reanimated'
import { useTheme, useThemedColors, usePrimaryColors } from '../../../contexts/ThemeContext'
import { colors } from '../../../constants/colors'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')
const SWIPE_THRESHOLD = screenWidth * 0.25 // 25% of screen width
const SWIPE_VELOCITY_THRESHOLD = 800
const ROTATION_MULTIPLIER = 0.15
const MAX_ROTATION = 30

interface SwipeableCardProps {
  consultant: any
  service?: any
  matchReason?: string
  availability?: string
  instantBooking?: boolean
  onSwipeLeft: () => void
  onSwipeRight: () => void
  onSwipeUp: () => void
  onViewProfile: () => void
  isFirst: boolean
  cardIndex?: number
}

export function SwipeableCard({
  consultant,
  service,
  matchReason,
  availability,
  instantBooking,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onViewProfile,
  isFirst,
  cardIndex = 0,
}: SwipeableCardProps) {
  const { isDark } = useTheme()
  const themedColors = useThemedColors()
  const primaryColors = usePrimaryColors()

  // Shared values for animations - these run on UI thread
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const scale = useSharedValue(1 - cardIndex * 0.05)
  const opacity = useSharedValue(1)
  const stackTranslateY = useSharedValue(cardIndex * 10)

  // Action indicator opacities
  const likeOpacity = useSharedValue(0)
  const nopeOpacity = useSharedValue(0)
  const superLikeOpacity = useSharedValue(0)

  // Double tap detection
  const lastTapTime = useSharedValue(0)

  // Spring configuration for natural feel
  const springConfig = {
    damping: 15,
    stiffness: 150,
    mass: 1,
  }

  // Reset card position
  const resetPosition = useCallback(() => {
    'worklet'
    translateX.value = withSpring(0, springConfig)
    translateY.value = withSpring(0, springConfig)
    likeOpacity.value = withTiming(0, { duration: 200 })
    nopeOpacity.value = withTiming(0, { duration: 200 })
    superLikeOpacity.value = withTiming(0, { duration: 200 })
  }, [])

  // Swipe card off screen
  const swipeAway = useCallback((direction: 'left' | 'right' | 'up') => {
    'worklet'
    const multiplier = direction === 'left' ? -1 : 1
    const x = direction !== 'up' ? screenWidth * 1.5 * multiplier : 0
    const y = direction === 'up' ? -screenHeight * 1.2 : 50

    translateX.value = withTiming(x, { duration: 300 })
    translateY.value = withTiming(y, { duration: 300 })
    opacity.value = withTiming(0, { duration: 300 }, () => {
      // Run callbacks on JS thread
      if (direction === 'left') runOnJS(onSwipeLeft)()
      else if (direction === 'right') runOnJS(onSwipeRight)()
      else if (direction === 'up') runOnJS(onSwipeUp)()
      
      // Reset after callback
      runOnJS(() => {
        setTimeout(() => {
          translateX.value = 0
          translateY.value = 0
          opacity.value = 1
          resetPosition()
        }, 50)
      })()
    })
  }, [onSwipeLeft, onSwipeRight, onSwipeUp])

  // Modern gesture handling - all on UI thread
  const gesture = Gesture.Pan()
    .enabled(isFirst)
    .onUpdate((event) => {
      'worklet'
      translateX.value = event.translationX
      translateY.value = event.translationY

      // Update action indicators based on position
      const absX = Math.abs(event.translationX)
      const absY = Math.abs(event.translationY)
      
      if (event.translationY < -SWIPE_THRESHOLD && absX < SWIPE_THRESHOLD) {
        superLikeOpacity.value = interpolate(
          event.translationY,
          [-SWIPE_THRESHOLD, -SWIPE_THRESHOLD * 2],
          [0, 1],
          Extrapolate.CLAMP
        )
        likeOpacity.value = 0
        nopeOpacity.value = 0
      } else if (event.translationX > 0) {
        likeOpacity.value = interpolate(
          event.translationX,
          [0, SWIPE_THRESHOLD],
          [0, 1],
          Extrapolate.CLAMP
        )
        nopeOpacity.value = 0
        superLikeOpacity.value = 0
      } else {
        nopeOpacity.value = interpolate(
          event.translationX,
          [0, -SWIPE_THRESHOLD],
          [0, 1],
          Extrapolate.CLAMP
        )
        likeOpacity.value = 0
        superLikeOpacity.value = 0
      }
    })
    .onEnd((event) => {
      'worklet'
      const velocityX = event.velocityX
      const velocityY = event.velocityY
      const absX = Math.abs(event.translationX)
      const absY = Math.abs(event.translationY)

      // Check for swipe based on position OR velocity
      const shouldSwipeRight = event.translationX > SWIPE_THRESHOLD || velocityX > SWIPE_VELOCITY_THRESHOLD
      const shouldSwipeLeft = event.translationX < -SWIPE_THRESHOLD || velocityX < -SWIPE_VELOCITY_THRESHOLD
      const shouldSwipeUp = event.translationY < -SWIPE_THRESHOLD && absX < SWIPE_THRESHOLD && velocityY < -SWIPE_VELOCITY_THRESHOLD / 2

      if (shouldSwipeUp) {
        swipeAway('up')
      } else if (shouldSwipeRight) {
        swipeAway('right')
      } else if (shouldSwipeLeft) {
        swipeAway('left')
      } else {
        // Spring back with decay for natural feel
        if (Math.abs(velocityX) > 100 || Math.abs(velocityY) > 100) {
          translateX.value = withDecay({
            velocity: velocityX,
            clamp: [-SWIPE_THRESHOLD / 2, SWIPE_THRESHOLD / 2],
          }, () => {
            translateX.value = withSpring(0, springConfig)
          })
          translateY.value = withDecay({
            velocity: velocityY,
            clamp: [-SWIPE_THRESHOLD / 2, SWIPE_THRESHOLD / 2],
          }, () => {
            translateY.value = withSpring(0, springConfig)
          })
        } else {
          resetPosition()
        }
      }
    })

  // Tap gesture for viewing profile or double tap to like
  const tapGesture = Gesture.Tap()
    .enabled(isFirst)
    .onEnd(() => {
      'worklet'
      const now = Date.now()
      const timeSinceLastTap = now - lastTapTime.value
      
      if (timeSinceLastTap < 300) {
        // Double tap - like
        swipeAway('right')
      } else {
        lastTapTime.value = now
        // Single tap - wait to see if double tap
        runOnJS(() => {
          setTimeout(() => {
            if (Date.now() - lastTapTime.value >= 300) {
              onViewProfile()
            }
          }, 300)
        })()
      }
    })

  // Composed gesture
  const composedGesture = Gesture.Simultaneous(tapGesture, gesture)

  // Animated styles - reactive to shared values
  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-screenWidth / 2, 0, screenWidth / 2],
      [-MAX_ROTATION, 0, MAX_ROTATION],
      Extrapolate.CLAMP
    )

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
        { scale: isFirst ? 1 : scale.value },
        { translateY: isFirst ? 0 : stackTranslateY.value },
      ],
      opacity: opacity.value,
    }
  })

  const likeStyle = useAnimatedStyle(() => ({
    opacity: likeOpacity.value,
  }))

  const nopeStyle = useAnimatedStyle(() => ({
    opacity: nopeOpacity.value,
  }))

  const superLikeStyle = useAnimatedStyle(() => ({
    opacity: superLikeOpacity.value,
  }))

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
        },
        cardStyle,
      ]}
    >
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={{ flex: 1, maxWidth: 400, maxHeight: 600 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: themedColors.surface.raised,
              borderRadius: 24,
              padding: 24,
              shadowColor: isDark ? colors.primary[500] : '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: isDark ? 0.3 : 0.15,
              shadowRadius: 20,
              elevation: 10,
              borderWidth: 1,
              borderColor: themedColors.border.default,
              overflow: 'hidden',
            }}
          >
            {/* gradient overlay */}
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 100, backgroundColor: '#FFF8F3', opacity: 0.4 }} />

            {/* Action indicators - only show on first card */}
            {isFirst && (
              <>
                <Animated.View style={[{ position: 'absolute', top: 50, left: 40, zIndex: 1, transform: [{ rotate: '-30deg' }] }, likeStyle]}>
                  <View style={{ borderWidth: 2, borderColor: primaryColors.primary, borderRadius: 20, padding: 10, backgroundColor: isDark ? colors.primary[900] : colors.primary[50] }}>
                    <Text style={{ fontSize: 26, fontWeight: '600', color: primaryColors.primary }}>CONNECT</Text>
                  </View>
                </Animated.View>

                <Animated.View style={[{ position: 'absolute', top: 50, right: 40, zIndex: 1, transform: [{ rotate: '30deg' }] }, nopeStyle]}>
                  <View style={{ borderWidth: 2, borderColor: '#E8B4B8', borderRadius: 20, padding: 10, backgroundColor: 'rgba(232,180,184,0.05)' }}>
                    <Text style={{ fontSize: 26, fontWeight: '600', color: '#E8B4B8' }}>SKIP</Text>
                  </View>
                </Animated.View>

                <Animated.View style={[{ position: 'absolute', bottom: 100, left: 0, right: 0, alignItems: 'center', zIndex: 1 }, superLikeStyle]}>
                  <View style={{ borderWidth: 2, borderColor: '#D4AF37', borderRadius: 20, padding: 10, backgroundColor: 'rgba(212,175,55,0.05)' }}>
                    <Text style={{ fontSize: 26, fontWeight: '600', color: '#D4AF37' }}>PRIORITY</Text>
                  </View>
                </Animated.View>
              </>
            )}

            {/* Service badge */}
            {service && (
              <View style={{ position: 'absolute', top: 20, left: 20, right: 20, backgroundColor: 'rgba(212,175,55,0.95)', padding: 8, borderRadius: 20 }}>
                <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '700', textAlign: 'center' }}>
                  {service.type.toUpperCase()}
                </Text>
              </View>
            )}

            {/* Card content */}
            <View style={{ marginTop: service ? 60 : 20, flex: 1 }}>
              {/* Consultant Info */}
              <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                <Image source={{ uri: consultant.image }} style={{ width: 72, height: 72, borderRadius: 36, marginRight: 16 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 20, fontWeight: '700', color: themedColors.text.primary }}>{consultant.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, marginBottom: 8 }}>
                    <View style={{ backgroundColor: '#F8E5D3', padding: 4, borderRadius: 12, marginRight: 8 }}>
                      <Text style={{ color: '#8B6F47', fontSize: 11, fontWeight: '600' }}>
                        {consultant.university} '{consultant.year.slice(2)}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 13, color: themedColors.text.secondary }}>{consultant.major}</Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
                      <Ionicons name="star" size={14} color="#D4A574" />
                      <Text style={{ marginLeft: 4, color: themedColors.text.primary }}>{consultant.rating}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="checkmark-circle" size={14} color="#68A357" />
                      <Text style={{ marginLeft: 4, color: themedColors.text.primary }}>{consultant.acceptanceRate}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Service Details */}
              {service && (
                <View style={{ backgroundColor: 'rgba(248,229,211,0.3)', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F8E5D3' }}>
                  <Text style={{ marginBottom: 12, color: themedColors.text.primary }}>{service.description}</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {service.includes.map((item: string, i: number) => (
                      <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8, marginBottom: 4 }}>
                        <Ionicons name="checkmark-circle" size={14} color="#68A357" />
                        <Text style={{ marginLeft: 4, fontSize: 12, color: themedColors.text.primary }}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Match Reason */}
              {matchReason && (
                <View style={{ backgroundColor: 'rgba(104,163,87,0.1)', borderRadius: 12, padding: 12, marginBottom: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="sparkles" size={16} color="#68A357" />
                    <Text style={{ marginLeft: 8, color: themedColors.text.primary }}>{matchReason}</Text>
                  </View>
                </View>
              )}

              {/* Stats */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                {['rating', 'studentsHelped', 'acceptanceRate', 'responseTime'].map((stat, i) => (
                  <View key={i} style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: '700', color: themedColors.text.primary }}>
                      {String(consultant[stat]).replace(/[<>]/g, '').trim()}
                    </Text>
                    <Text style={{ fontSize: 11, marginTop: 2, color: themedColors.text.secondary }}>
                      {stat === 'studentsHelped'
                        ? 'Students'
                        : stat === 'acceptanceRate'
                        ? 'Success'
                        : stat === 'responseTime'
                        ? 'Response'
                        : 'Rating'}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Bottom Bar */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F8E5D3' }}>
                <View>
                  <Text style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: themedColors.text.secondary }}>
                    {service ? 'Service Price' : 'Hourly Rate'}
                  </Text>
                  <Text style={{ fontSize: 22, fontWeight: '600', marginTop: 2, color: themedColors.text.primary }}>
                    {service ? service.price : consultant.price}
                  </Text>
                  {service && <Text style={{ fontSize: 12, marginTop: 2, color: themedColors.text.secondary }}>{service.duration}</Text>}
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  {availability && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 6, borderRadius: 16, marginBottom: 8, backgroundColor: instantBooking ? 'rgba(104,163,87,0.1)' : 'rgba(212,175,55,0.1)' }}>
                      <Ionicons name={instantBooking ? 'flash' : 'calendar'} size={14} color={instantBooking ? '#68A357' : '#D4AF37'} />
                      <Text style={{ marginLeft: 4, fontSize: 12, fontWeight: '600', color: themedColors.text.primary }}>{availability}</Text>
                    </View>
                  )}
                  <View style={{ flexDirection: 'row', alignItems: 'center', padding: 6, borderRadius: 16, backgroundColor: 'rgba(212,175,55,0.05)' }}>
                    <Ionicons name="arrow-up" size={14} color="#D4AF37" />
                    <Text style={{ marginLeft: 4, fontSize: 11, color: themedColors.text.secondary }}>Swipe up for priority</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  )
}