import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Platform,
  Animated,
  ViewToken,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useThemedColors } from '../../../contexts/ThemeContext'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

interface ConsultantStoryModeProps {
  consultants: Array<{
    id: string
    name: string
    university: string
    universityColor: string
    major: string
    rating: number
    reviews: number
    price: number
    isOnline: boolean
    isVerified: boolean
    bio: string
    services: string[]
    imageUrl: string | null
    badge?: string
  }>
  onConsultantPress?: (consultantId: string) => void
  onBack?: () => void
}

// Helper function to generate story content from consultant data
const generateStoryContent = (consultant: ConsultantStoryModeProps['consultants'][0]) => {
  // Generate story title based on university and major
  const storyTitles = [
    `My Journey to ${consultant.university}`,
    `From Dreams to ${consultant.university} ${consultant.major}`,
    `Breaking into ${consultant.university}`,
    `${consultant.major} at ${consultant.university}`,
  ]
  
  // Generate highlights based on consultant data
  const highlights: string[] = []
  if (consultant.rating >= 4.8) highlights.push(`${consultant.rating} ★ Rating`)
  if (consultant.reviews >= 100) highlights.push(`${consultant.reviews}+ Reviews`)
  if (consultant.isVerified) highlights.push('Verified Expert')
  if (consultant.price <= 100) highlights.push('Affordable Rates')
  if (consultant.badge) highlights.push(consultant.badge)
  
  // Ensure we have at least 3 highlights
  if (highlights.length < 3) {
    if (consultant.services.length > 0) highlights.push(consultant.services[0])
    if (consultant.isOnline) highlights.push('Available Now')
    highlights.push(`${consultant.university} Student`)
  }
  
  return {
    ...consultant,
    storyTitle: storyTitles[Math.floor(Math.random() * storyTitles.length)],
    highlights: highlights.slice(0, 3),
  }
}

interface StoryItemProps {
  item: ReturnType<typeof generateStoryContent>
  index: number
  isActive: boolean
  onShowDetails: () => void
  onConsultantPress?: (consultantId: string) => void
}

const StoryItem: React.FC<StoryItemProps> = ({ item, index, isActive, onShowDetails, onConsultantPress }) => {
  const colors = useThemedColors()
  const scaleAnim = useRef(new Animated.Value(0.95)).current

  useEffect(() => {
    if (isActive) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start()
    } else {
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }).start()
    }
  }, [isActive])

  return (
    <Animated.View
      style={{
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        transform: [{ scale: scaleAnim }],
      }}
    >
      {/* Background Gradient */}
      <LinearGradient
        colors={[item.universityColor, '#000000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.3,
        }}
      />

      {/* Story Content */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* Avatar */}
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: item.universityColor,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
            borderWidth: 4,
            borderColor: 'rgba(255,255,255,0.2)',
          }}
        >
          <Text style={{
            fontSize: 48,
            fontWeight: '700',
            color: '#FFFFFF',
          }}>
            {item.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>

        {/* Story Title */}
        <Text style={{
          fontSize: 32,
          fontWeight: '700',
          color: '#FFFFFF',
          textAlign: 'center',
          marginBottom: 16,
          paddingHorizontal: 40,
        }}>
          {item.storyTitle}
        </Text>

        {/* Highlights */}
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          paddingHorizontal: 40,
          gap: 12,
        }}>
          {item.highlights.map((highlight, idx) => (
            <View
              key={idx}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.3)',
              }}
            >
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: '#FFFFFF',
              }}>
                {highlight}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Side Actions */}
      <View style={{
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: [{ translateY: -100 }],
        alignItems: 'center',
        gap: 24,
      }}>
        {/* Like Button */}
        <TouchableOpacity
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: 'rgba(255,255,255,0.1)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="heart-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Message Button */}
        <TouchableOpacity
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: 'rgba(255,255,255,0.1)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="chatbubble-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: 'rgba(255,255,255,0.1)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="share-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Bottom Info Bar */}
      <View style={{
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
      }}>
        <TouchableOpacity
          onPress={() => onConsultantPress ? onConsultantPress(item.id) : onShowDetails()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: 16,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.1)',
          }}
        >
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                color: '#FFFFFF',
                marginRight: 8,
              }}>
                {item.name}
              </Text>
              {item.isVerified && (
                <Ionicons name="checkmark-circle" size={18} color="#1DA1F2" />
              )}
            </View>
            <Text style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.8)',
            }}>
              {item.university} • {item.major}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '700',
              color: '#FFFFFF',
            }}>
              ${item.price}/hr
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="star" size={14} color="#FFC107" />
              <Text style={{
                fontSize: 14,
                color: 'rgba(255,255,255,0.8)',
                marginLeft: 4,
              }}>
                {item.rating} ({item.reviews})
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={{
          fontSize: 11,
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: 0.5,
          textAlign: 'center',
          marginTop: 8,
        }}>
          SWIPE UP FOR NEXT
        </Text>
      </View>
    </Animated.View>
  )
}

export const ConsultantStoryMode: React.FC<ConsultantStoryModeProps> = ({ consultants = [], onConsultantPress, onBack }) => {
  const colors = useThemedColors()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const flatListRef = useRef<FlatList>(null)
  
  // Transform consultants to story format
  const storyConsultants = consultants.map(generateStoryContent)
  
  // Handle empty state
  if (consultants.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Ionicons name="people-outline" size={64} color={colors.textSecondary} style={{ marginBottom: 16 }} />
        <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 8 }}>No Consultants Available</Text>
        <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center', paddingHorizontal: 40 }}>Check back later for new consultant stories</Text>
        <TouchableOpacity onPress={onBack} style={{ marginTop: 24, padding: 12 }}>
          <Text style={{ fontSize: 16, color: colors.primary, fontWeight: '600' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }
  
  // Hide status bar on mount
  useEffect(() => {
    StatusBar.setHidden(true)
    return () => StatusBar.setHidden(false)
  }, [])

  // Handle viewable items change
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0)
    }
  }).current

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current

  const renderItem = ({ item, index }: { item: typeof storyConsultants[0], index: number }) => (
    <StoryItem
      item={item}
      index={index}
      isActive={index === currentIndex}
      onShowDetails={() => setShowDetails(true)}
      onConsultantPress={onConsultantPress}
    />
  )

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <FlatList
        ref={flatListRef}
        data={storyConsultants}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
        initialScrollIndex={0}
        removeClippedSubviews={Platform.OS === 'android'}
        maxToRenderPerBatch={3}
        windowSize={3}
      />

      {/* Progress Indicators */}
      <View style={{
        position: 'absolute',
        top: 50,
        left: 64,
        right: 16,
        flexDirection: 'row',
        gap: 3,
      }}>
        {storyConsultants.map((_, index) => (
          <View
            key={index}
            style={{
              flex: 1,
              height: 2,
              backgroundColor: index === currentIndex
                ? '#FFFFFF'
                : 'rgba(255,255,255,0.2)',
              borderRadius: 1,
            }}
          />
        ))}
      </View>

      {/* Back Button */}
      <TouchableOpacity
        onPress={onBack}
        style={{
          position: 'absolute',
          top: 50,
          left: 16,
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: 'rgba(0,0,0,0.5)',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Details Modal - Would be implemented here */}
    </View>
  )
}