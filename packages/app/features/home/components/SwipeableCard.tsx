import React, { useRef } from 'react'
import {
  View,
  Text,
  PanResponder,
  Animated,
  Dimensions,
  Platform,
  TouchableOpacity,
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
  const lastTap = useRef(0).current
  const animating = useRef(false)

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        position.setOffset({
          x: position.x._value,
          y: position.y._value,
        })
        position.setValue({ x: 0, y: 0 })
      },
      onPanResponderMove: (evt, gestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy })
        
        // Rotation based on X position
        rotation.setValue(gestureState.dx * ROTATION_MULTIPLIER)
        
        // Show action labels
        const opacity = Math.min(Math.abs(gestureState.dx) / SWIPE_THRESHOLD, 1)
        actionOpacity.setValue(opacity)
      },
      onPanResponderRelease: (evt, gestureState) => {
        position.flattenOffset()

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
      position.setValue({ x: 0, y: 0 })
      rotation.setValue(0)
      
      if (direction === 'right') onSwipeRight()
      else if (direction === 'left') onSwipeLeft()
      else if (direction === 'up') onSwipeUp()
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
      transform: [{ rotate }],
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
      {...(isFirst ? panResponder.panHandlers : {})}
    >
      <TouchableOpacity
        onPress={handleCardPress}
        activeOpacity={1}
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
          borderRadius: 20,
          padding: 20,
          shadowColor: '#8B7355',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 3,
          borderWidth: 1,
          borderColor: '#F5E6D3',
        }}>
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
              borderWidth: 4,
              borderColor: '#68A357',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
              backgroundColor: 'rgba(104, 163, 87, 0.1)',
            }}>
              <Text style={{
                fontSize: 32,
                fontWeight: '800',
                color: '#68A357',
              }}>
                LIKE
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
              borderWidth: 4,
              borderColor: '#D4A574',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
              backgroundColor: 'rgba(212, 165, 116, 0.1)',
            }}>
              <Text style={{
                fontSize: 32,
                fontWeight: '800',
                color: '#D4A574',
              }}>
                PASS
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
              borderWidth: 4,
              borderColor: '#2D5016',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
              backgroundColor: 'rgba(45, 80, 22, 0.1)',
            }}>
              <Text style={{
                fontSize: 32,
                fontWeight: '800',
                color: '#2D5016',
              }}>
                PRIORITY
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Card Content */}
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#FAF7F0',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
            borderWidth: 2,
            borderColor: '#F5E6D3',
          }}>
            <Ionicons name="person-circle" size={70} color="#E8D5C4" />
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
                backgroundColor: '#D4A574',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 12,
                marginRight: 8,
              }}>
                <Text style={{
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: '600',
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
                backgroundColor: '#F5E6D3',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                marginRight: 8,
                marginBottom: 8,
              }}>
                <Text style={{
                  color: '#8B7355',
                  fontSize: 14,
                  fontWeight: '500',
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
          borderTopColor: '#F5E6D3',
          marginTop: 'auto',
        }}>
          <View>
            <Text style={{ fontSize: 12, color: '#8B7355' }}>
              Service rate
            </Text>
            <Text style={{
              fontSize: 20,
              fontWeight: '700',
              color: '#2C2825',
            }}>
              {consultant.price}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="flash" size={16} color="#D4A574" />
            <Text style={{
              color: '#D4A574',
              fontSize: 12,
              marginLeft: 4,
            }}>
              Swipe up for priority
            </Text>
          </View>
        </View>
      </View>
      </TouchableOpacity>
    </Animated.View>
  )
}