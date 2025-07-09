import { useRef } from 'react'
import {
  View,
  Text,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')
const SWIPE_THRESHOLD = 80 // Lowered for easier swiping
const SWIPE_OUT_DURATION = 250
const ROTATION_MULTIPLIER = 0.15 // Slightly less rotation for professional look

interface SwipeableCardProps {
  consultant: any
  onSwipeLeft: () => void
  onSwipeRight: () => void
  onSwipeUp: () => void
  onViewProfile: () => void
  isFirst: boolean
  cardIndex?: number
}

export function SwipeableCard({
  consultant,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onViewProfile,
  isFirst,
  cardIndex = 0,
}: SwipeableCardProps) {
  const position = useRef(new Animated.ValueXY()).current
  const rotation = useRef(new Animated.Value(0)).current
  const actionOpacity = useRef(new Animated.Value(0)).current
  const lastTap = useRef(0)
  const animating = useRef(false)

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
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
          listener: (_evt: any, gestureState: any) => {
            // Rotation based on X position
            rotation.setValue(gestureState.dx * ROTATION_MULTIPLIER)
            
            // Show action labels
            const opacity = Math.min(Math.abs(gestureState.dx) / SWIPE_THRESHOLD, 1)
            actionOpacity.setValue(opacity)
          }
        }
      ),
      onPanResponderRelease: (_evt, gestureState) => {
        position.flattenOffset()

        // Check if it's a tap (minimal movement)
        if (Math.abs(gestureState.dx) < 5 && Math.abs(gestureState.dy) < 5) {
          handleCardPress()
          resetPosition()
          return
        }

        // Check for swipe up (super like)
        if (gestureState.dy < -SWIPE_THRESHOLD && Math.abs(gestureState.dx) < SWIPE_THRESHOLD) {
          swipeCard('up')
        } else if (gestureState.dx > SWIPE_THRESHOLD) {
          swipeCard('right')
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
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

    if (direction === 'right') {
      x = screenWidth + 100
    } else if (direction === 'left') {
      x = -screenWidth - 100
    } else if (direction === 'up') {
      y = -screenHeight
    }

    Animated.timing(position, {
      toValue: { x, y },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => {
      animating.current = false
      
      if (direction === 'right') onSwipeRight()
      else if (direction === 'left') onSwipeLeft()
      else if (direction === 'up') onSwipeUp()
      
      // Reset position after callback to prevent flash
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
      transform: [
        { translateX: position.x },
        { translateY: position.y },
        { rotate }
      ],
    }
  }

  const getLikeOpacity = () => {
    return position.x.interpolate({
      inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp',
    })
  }

  const getNopeOpacity = () => {
    return position.x.interpolate({
      inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp',
    })
  }

  const getSuperLikeOpacity = () => {
    return position.y.interpolate({
      inputRange: [-SWIPE_THRESHOLD, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    })
  }

  const scale = 1 - cardIndex * 0.05
  const translateY = cardIndex * 10

  const handleCardPress = () => {
    if (!isFirst) return
    
    const now = Date.now()
    const DOUBLE_PRESS_DELAY = 300
    
    if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
      // Double tap - quick like
      swipeCard('right')
    } else {
      // Single tap - view profile
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
      <View
        {...(isFirst ? panResponder.panHandlers : {})}
        style={{
          width: '100%',
          height: '100%',
          maxWidth: 400,
          maxHeight: 600,
        }}
      >
        <View style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          padding: 24,
          shadowColor: '#D4AF37',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          elevation: 10,
          borderWidth: 1,
          borderColor: '#F8E5D3',
          overflow: 'hidden',
        }}>
        {/* Subtle gradient overlay */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 100,
          backgroundColor: '#FFF8F3',
          opacity: 0.4,
        }} />
        {/* LIKE label */}
        {isFirst && (
          <Animated.View
            style={{
              position: 'absolute',
              top: 50,
              left: 40,
              zIndex: 1000,
              opacity: getLikeOpacity(),
              transform: [{ rotate: '-30deg' }],
            }}
          >
            <View style={{
              borderWidth: 2,
              borderColor: '#68A357',
              borderRadius: 20,
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: 'rgba(104, 163, 87, 0.05)',
              shadowColor: '#68A357',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
            }}>
              <Text style={{
                fontSize: 26,
                fontWeight: '600',
                color: '#68A357',
                letterSpacing: 1.5,
              }}>
                CONNECT
              </Text>
            </View>
          </Animated.View>
        )}

        {/* NOPE label */}
        {isFirst && (
          <Animated.View
            style={{
              position: 'absolute',
              top: 50,
              right: 40,
              zIndex: 1000,
              opacity: getNopeOpacity(),
              transform: [{ rotate: '30deg' }],
            }}
          >
            <View style={{
              borderWidth: 2,
              borderColor: '#E8B4B8',
              borderRadius: 20,
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: 'rgba(232, 180, 184, 0.05)',
              shadowColor: '#E8B4B8',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
            }}>
              <Text style={{
                fontSize: 26,
                fontWeight: '600',
                color: '#E8B4B8',
                letterSpacing: 1.5,
              }}>
                SKIP
              </Text>
            </View>
          </Animated.View>
        )}

        {/* SUPER LIKE label */}
        {isFirst && (
          <Animated.View
            style={{
              position: 'absolute',
              bottom: 100,
              alignSelf: 'center',
              zIndex: 1000,
              opacity: getSuperLikeOpacity(),
            }}
          >
            <View style={{
              borderWidth: 2,
              borderColor: '#D4AF37',
              borderRadius: 20,
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: 'rgba(212, 175, 55, 0.05)',
              shadowColor: '#D4AF37',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
            }}>
              <Text style={{
                fontSize: 26,
                fontWeight: '600',
                color: '#D4AF37',
                letterSpacing: 1.5,
              }}>
                PRIORITY
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Card Content */}
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <View style={{
            width: 84,
            height: 84,
            borderRadius: 42,
            backgroundColor: '#FFF8F3',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
            borderWidth: 2,
            borderColor: '#F8E5D3',
            shadowColor: '#D4AF37',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
            <Ionicons name="person-circle" size={72} color="#E8B4B8" />
          </View>
          
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{
                fontSize: 22,
                fontWeight: '700',
                color: '#2C2825',
              }}>
                {consultant.name}
              </Text>
              {consultant.instantBooking && (
                <View style={{
                  backgroundColor: '#68A357',
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 10,
                  marginLeft: 8,
                }}>
                  <Text style={{
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: '600',
                  }}>
                    INSTANT
                  </Text>
                </View>
              )}
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{
                backgroundColor: '#F8E5D3',
                paddingHorizontal: 12,
                paddingVertical: 5,
                borderRadius: 16,
                marginRight: 8,
                borderWidth: 1,
                borderColor: '#D4AF37',
              }}>
                <Text style={{
                  color: '#8B6F47',
                  fontSize: 12,
                  fontWeight: '600',
                  letterSpacing: 0.5,
                }}>
                  {consultant.university}
                </Text>
              </View>
              <Text style={{
                fontSize: 14,
                color: '#8B7355',
              }}>
                {consultant.major}
              </Text>
            </View>
            
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
                <Ionicons name="star" size={14} color="#D4A574" />
                <Text style={{ color: '#2C2825', marginLeft: 4, fontSize: 12 }}>
                  {consultant.rating}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="checkmark-circle" size={14} color="#68A357" />
                <Text style={{ color: '#2C2825', marginLeft: 4, fontSize: 12 }}>
                  {consultant.acceptanceRate}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={{
          fontSize: 16,
          color: '#4A4541',
          marginBottom: 16,
          lineHeight: 22,
        }}>
          {consultant.bio}
        </Text>

        <View style={{ marginBottom: 16 }}>
          <Text style={{
            fontSize: 14,
            color: '#8B7355',
            marginBottom: 8,
          }}>
            Specializes in
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {consultant.specialties.map((specialty: string, index: number) => (
              <View key={index} style={{
                backgroundColor: 'rgba(232, 180, 184, 0.1)',
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 18,
                marginRight: 8,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: '#F8E5D3',
              }}>
                <Text style={{
                  color: '#8B6F47',
                  fontSize: 13,
                  fontWeight: '500',
                  letterSpacing: 0.3,
                }}>
                  {specialty}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}>
          <View>
            <Text style={{ fontSize: 12, color: '#8B7355' }}>
              Response time
            </Text>
            <Text style={{ fontSize: 14, color: '#2C2825', fontWeight: '600' }}>
              {consultant.responseTime}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 12, color: '#8B7355' }}>
              Next available
            </Text>
            <Text style={{ fontSize: 14, color: '#2C2825', fontWeight: '600' }}>
              {consultant.nextAvailable}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 12, color: '#8B7355' }}>
              Students helped
            </Text>
            <Text style={{ fontSize: 14, color: '#2C2825', fontWeight: '600' }}>
              {consultant.studentsHelped}
            </Text>
          </View>
        </View>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 16,
          borderTopWidth: 1,
          borderTopColor: '#F8E5D3',
          marginTop: 'auto',
        }}>
          <View>
            <Text style={{ 
              fontSize: 11, 
              color: '#8B7355',
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}>
              Investment
            </Text>
            <Text style={{
              fontSize: 22,
              fontWeight: '600',
              color: '#3E2723',
              marginTop: 2,
            }}>
              {consultant.price}
            </Text>
          </View>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center',
            backgroundColor: 'rgba(212, 175, 55, 0.05)',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
          }}>
            <Ionicons name="sparkles" size={14} color="#D4AF37" />
            <Text style={{
              color: '#8B6F47',
              fontSize: 11,
              marginLeft: 4,
              fontWeight: '500',
              letterSpacing: 0.3,
            }}>
              Swipe up for priority request
            </Text>
          </View>
        </View>
      </View>
      </View>
    </Animated.View>
  )
}