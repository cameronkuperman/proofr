import { useRef } from 'react'
import {
  View,
  Text,
  PanResponder,
  Animated,
  Dimensions,
  Image,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, useThemedColors, usePrimaryColors } from '../../../contexts/ThemeContext'
import { colors } from '../../../constants/colors'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')
const SWIPE_THRESHOLD = 80
const SWIPE_OUT_DURATION = 250
const ROTATION_MULTIPLIER = 0.15

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

  const position = useRef(new Animated.ValueXY()).current
  const rotation = useRef(new Animated.Value(0)).current
  const actionOpacity = useRef(new Animated.Value(0)).current
  const lastTap = useRef(0)
  const animating = useRef(false)

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        position.setOffset({
          x: (position.x as any)._value || 0,
          y: (position.y as any)._value || 0,
        })
        position.setValue({ x: 0, y: 0 })
      },
      onPanResponderMove: Animated.event(
        [null, { dx: position.x, dy: position.y }],
        {
          useNativeDriver: false,
          listener: (_evt, gs) => {
            rotation.setValue(gs.dx * ROTATION_MULTIPLIER)
            const opacity = Math.min(Math.abs(gs.dx) / SWIPE_THRESHOLD, 1)
            actionOpacity.setValue(opacity)
          },
        }
      ),
      onPanResponderRelease: (_evt, gs) => {
        position.flattenOffset()

        // tap vs swipe
        if (Math.abs(gs.dx) < 5 && Math.abs(gs.dy) < 5) {
          handleCardPress()
          resetPosition()
          return
        }

        if (gs.dy < -SWIPE_THRESHOLD && Math.abs(gs.dx) < SWIPE_THRESHOLD) {
          swipeCard('up')
        } else if (gs.dx > SWIPE_THRESHOLD) {
          swipeCard('right')
        } else if (gs.dx < -SWIPE_THRESHOLD) {
          swipeCard('left')
        } else {
          resetPosition()
        }
      },
    })
  ).current

  const swipeCard = (direction: 'left' | 'right' | 'up') => {
    if (animating.current) return
    animating.current = true

    let x = 0
    let y = 0
    if (direction === 'right') x = screenWidth + 100
    if (direction === 'left') x = -screenWidth - 100
    if (direction === 'up') y = -screenHeight

    Animated.timing(position, {
      toValue: { x, y },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => {
      animating.current = false
      if (direction === 'right') onSwipeRight()
      if (direction === 'left') onSwipeLeft()
      if (direction === 'up') onSwipeUp()
      // reset immediately after
      setTimeout(() => {
        position.setValue({ x: 0, y: 0 })
        rotation.setValue(0)
        actionOpacity.setValue(0)
      }, 50)
    })
  }

  const resetPosition = () => {
    Animated.parallel([
      Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        friction: 4,
        useNativeDriver: false,
      }),
      Animated.timing(rotation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(actionOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start()
  }

  const getCardStyle = () => {
    const rotate = rotation.interpolate({
      inputRange: [-screenWidth, 0, screenWidth],
      outputRange: ['-30deg', '0deg', '30deg'],
    })
    return {
      ...position.getLayout(),
      transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }],
    }
  }

  const getLikeOpacity = () =>
    position.x.interpolate({
      inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp',
    })
  const getNopeOpacity = () =>
    position.x.interpolate({
      inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp',
    })
  const getSuperLikeOpacity = () =>
    position.y.interpolate({
      inputRange: [-SWIPE_THRESHOLD, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    })

  const scale = 1 - cardIndex * 0.05
  const translateY = cardIndex * 10

  const handleCardPress = () => {
    if (!isFirst) return
    const now = Date.now()
    const DOUBLE_PRESS_DELAY = 300
    if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
      swipeCard('right')
    } else {
      lastTap.current = now
      setTimeout(() => {
        if (Date.now() - lastTap.current >= DOUBLE_PRESS_DELAY) {
          onViewProfile()
        }
      }, DOUBLE_PRESS_DELAY)
    }
  }

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
          transform: isFirst ? [] : [{ scale }, { translateY }],
        },
        isFirst && getCardStyle(),
      ]}
    >
      <View {...(isFirst ? panResponder.panHandlers : {})} style={{ flex: 1, maxWidth: 400, maxHeight: 600 }}>
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

          {isFirst && (
            <Animated.View style={{ position: 'absolute', top: 50, left: 40, zIndex: 1, opacity: getLikeOpacity(), transform: [{ rotate: '-30deg' }] }}>
              <View style={{ borderWidth: 2, borderColor: primaryColors.primary, borderRadius: 20, padding: 10, backgroundColor: isDark ? colors.primary[900] : colors.primary[50] }}>
                <Text style={{ fontSize: 26, fontWeight: '600', color: primaryColors.primary }}>CONNECT</Text>
              </View>
            </Animated.View>
          )}

          {isFirst && (
            <Animated.View style={{ position: 'absolute', top: 50, right: 40, zIndex: 1, opacity: getNopeOpacity(), transform: [{ rotate: '30deg' }] }}>
              <View style={{ borderWidth: 2, borderColor: '#E8B4B8', borderRadius: 20, padding: 10, backgroundColor: 'rgba(232,180,184,0.05)' }}>
                <Text style={{ fontSize: 26, fontWeight: '600', color: '#E8B4B8' }}>SKIP</Text>
              </View>
            </Animated.View>
          )}

          {isFirst && (
            <Animated.View style={{ position: 'absolute', bottom: 100, zIndex: 1, opacity: getSuperLikeOpacity() }}>
              <View style={{ borderWidth: 2, borderColor: '#D4AF37', borderRadius: 20, padding: 10, backgroundColor: 'rgba(212,175,55,0.05)' }}>
                <Text style={{ fontSize: 26, fontWeight: '600', color: '#D4AF37' }}>PRIORITY</Text>
              </View>
            </Animated.View>
          )}

          {service && (
            <View style={{ position: 'absolute', top: 20, left: 20, right: 20, backgroundColor: 'rgba(212,175,55,0.95)', padding: 8, borderRadius: 20 }}>
              <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '700', textAlign: 'center' }}>
                {service.type.toUpperCase()}
              </Text>
            </View>
          )}

          <View style={{ marginTop: service ? 60 : 20, flex: 1 }}>
            {/* Consultant Info */}
            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
              <Image source={{ uri: consultant.image }} style={{ width: 72, height: 72, borderRadius: 36, marginRight: 16 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#2C2825' }}>{consultant.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, marginBottom: 8 }}>
                  <View style={{ backgroundColor: '#F8E5D3', padding: 4, borderRadius: 12, marginRight: 8 }}>
                    <Text style={{ color: '#8B6F47', fontSize: 11, fontWeight: '600' }}>
                      {consultant.university} '{consultant.year.slice(2)}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 13, color: '#8B7355' }}>{consultant.major}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
                    <Ionicons name="star" size={14} color="#D4A574" />
                    <Text style={{ marginLeft: 4 }}>{consultant.rating}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="checkmark-circle" size={14} color="#68A357" />
                    <Text style={{ marginLeft: 4 }}>{consultant.acceptanceRate}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Service Details */}
            {service && (
              <View style={{ backgroundColor: 'rgba(248,229,211,0.3)', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F8E5D3' }}>
                <Text style={{ marginBottom: 12 }}>{service.description}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {service.includes.map((item: string, i: number) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8, marginBottom: 4 }}>
                      <Ionicons name="checkmark-circle" size={14} color="#68A357" />
                      <Text style={{ marginLeft: 4, fontSize: 12 }}>{item}</Text>
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
                  <Text style={{ marginLeft: 8 }}>{matchReason}</Text>
                </View>
              </View>
            )}

            {/* Stats */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
              {['rating', 'studentsHelped', 'acceptanceRate', 'responseTime'].map((stat, i) => (
                <View key={i} style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, fontWeight: '700' }}>
                    {String(consultant[stat]).replace(/[<>]/g, '').trim()}
                  </Text>
                  <Text style={{ fontSize: 11, marginTop: 2, color: '#8B7355' }}>
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
                <Text style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>
                  {service ? 'Service Price' : 'Hourly Rate'}
                </Text>
                <Text style={{ fontSize: 22, fontWeight: '600', marginTop: 2 }}>
                  {service ? service.price : consultant.price}
                </Text>
                {service && <Text style={{ fontSize: 12, marginTop: 2 }}>{service.duration}</Text>}
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                {availability && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', padding: 6, borderRadius: 16, marginBottom: 8, backgroundColor: instantBooking ? 'rgba(104,163,87,0.1)' : 'rgba(212,175,55,0.1)' }}>
                    <Ionicons name={instantBooking ? 'flash' : 'calendar'} size={14} color={instantBooking ? '#68A357' : '#D4AF37'} />
                    <Text style={{ marginLeft: 4, fontSize: 12, fontWeight: '600' }}>{availability}</Text>
                  </View>
                )}
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 6, borderRadius: 16, backgroundColor: 'rgba(212,175,55,0.05)' }}>
                  <Ionicons name="arrow-up" size={14} color="#D4AF37" />
                  <Text style={{ marginLeft: 4, fontSize: 11 }}>Swipe up for priority</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  )
}
