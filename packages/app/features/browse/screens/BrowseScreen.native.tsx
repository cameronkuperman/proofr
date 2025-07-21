import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
  FlatList,
  StatusBar,
  Platform,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
// import { BlurView } from 'expo-blur' // Temporarily disabled
import { useThemedColors } from '../../../contexts/ThemeContext'
import { ConsultantGridCard } from '../components/ConsultantGridCard'
import { ConsultantStoryMode } from '../components/ConsultantStoryMode'
import { AIMatchMode } from '../components/AIMatchMode'
import { useConsultants } from '../../consultants/hooks/useConsultants'
import { useRouter } from 'solito/router'
import type { ConsultantWithServices, ConsultantFilters } from '../../consultants/types/consultant.types'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

// University color mapping
const universityColors: Record<string, string> = {
  'Stanford University': '#8C1515',
  'Harvard University': '#A51C30',
  'MIT': '#A31F34',
  'Yale University': '#00356B',
  'Princeton University': '#FF6600',
  'Columbia University': '#003DA5',
  'University of Pennsylvania': '#990000',
  'California Institute of Technology': '#FF6600',
  'Duke University': '#00356B',
  'Northwestern University': '#4E2A84',
  'Brown University': '#4E3629',
  'Cornell University': '#B31B1B',
  'Dartmouth College': '#00693E',
  'Vanderbilt University': '#866D4B',
  'Rice University': '#002D72',
}

const filterCategories = [
  { id: 'all', label: 'All', icon: 'apps' },
  { id: 'online', label: 'Available', icon: 'radio-button-on' },
  { id: 'verified', label: 'Verified', icon: 'checkmark-circle' },
  { id: 'top-rated', label: 'Top Rated', icon: 'star' },
  { id: 'budget', label: 'Under $100', icon: 'cash-outline' },
]

// Transform Supabase data to match component expectations
const transformConsultant = (consultant: ConsultantWithServices) => {
  const minPrice = consultant.services?.length > 0 
    ? Math.min(...consultant.services.flatMap(s => s.prices))
    : 0
    
  const serviceTypes = consultant.services?.map(s => {
    const typeMap: Record<string, string> = {
      'essay_review': 'Essay Review',
      'interview_prep': 'Interview Prep',
      'application_strategy': 'Application Strategy',
      'test_prep': 'Test Prep',
      'extracurricular_planning': 'Activities Planning'
    }
    return typeMap[s.service_type] || s.title
  }) || []

  // Determine badge based on stats
  let badge = undefined
  if (consultant.rating >= 4.9 && consultant.total_reviews >= 50) {
    badge = 'Top Rated'
  } else if (consultant.total_bookings >= 100) {
    badge = 'Expert'
  } else if (consultant.created_at && new Date(consultant.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
    badge = 'Rising Star'
  }

  return {
    id: consultant.id,
    name: consultant.name,
    university: consultant.current_college,
    universityColor: universityColors[consultant.current_college] || '#666666',
    major: consultant.major,
    rating: consultant.rating || 0,
    reviews: consultant.total_reviews || 0,
    price: minPrice,
    isOnline: consultant.is_available && !consultant.vacation_mode,
    isVerified: consultant.verification_status === 'approved',
    bio: consultant.bio,
    services: serviceTypes,
    imageUrl: consultant.user?.profile_image_url || null,
    badge,
  }
}

export const BrowseScreen = () => {
  const colors = useThemedColors()
  const router = useRouter()
  const [currentMode, setCurrentMode] = useState<'grid' | 'story' | 'ai'>('grid')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showModeSelector, setShowModeSelector] = useState(false)
  
  // Build filters based on selected filter
  const filters: ConsultantFilters = {
    search: searchQuery,
    ...(selectedFilter === 'verified' && { verified_only: true }),
    ...(selectedFilter === 'top-rated' && { min_rating: 4.8 }),
    ...(selectedFilter === 'budget' && { max_price: 100 }),
    sort_by: selectedFilter === 'top-rated' ? 'rating' : 'bookings'
  }

  // Fetch consultants using the shared hook
  const { consultants, loading, error, refetch } = useConsultants(filters)
  
  // Transform consultants for display
  const displayConsultants = consultants
    .filter(c => selectedFilter !== 'online' || (c.is_available && !c.vacation_mode))
    .map(transformConsultant)
  
  // Animation values
  const modeAnimation = useRef(new Animated.Value(1)).current
  const filterScrollX = useRef(new Animated.Value(0)).current
  const headerOpacity = useRef(new Animated.Value(1)).current
  const fabScale = useRef(new Animated.Value(1)).current
  
  // Pulse animation for discover modes button
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(fabScale, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(fabScale, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    )
    pulseAnimation.start()
    return () => pulseAnimation.stop()
  }, [])

  const switchMode = (mode: 'grid' | 'story' | 'ai') => {
    if (mode === currentMode) {
      setShowModeSelector(false)
      return
    }
    
    Animated.parallel([
      Animated.timing(modeAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(headerOpacity, {
        toValue: mode === 'story' ? 0 : 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentMode(mode)
      setShowModeSelector(false)
      Animated.timing(modeAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    })
  }

  const handleConsultantPress = (consultantId: string) => {
    // For native navigation, we need to use the navigation prop
    // This will be handled by the navigation stack
    router.push(`/consultant-profile?consultantId=${consultantId}`)
  }

  const renderHeader = () => (
    <Animated.View
      style={{
        opacity: headerOpacity,
        transform: [{
          translateY: headerOpacity.interpolate({
            inputRange: [0, 1],
            outputRange: [-50, 0],
          }),
        }],
      }}
    >
      {/* Search Bar */}
      <View style={{
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 15,
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          borderRadius: 16,
          paddingHorizontal: 16,
          height: 48,
          borderWidth: 1,
          borderColor: colors.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        }}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            placeholder="Search by name, school, or service..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 16,
              color: colors.text,
              fontFamily: Platform.OS === 'ios' ? 'System' : undefined,
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
        style={{ marginBottom: 16 }}
      >
        {filterCategories.map((filter) => {
          const isSelected = selectedFilter === filter.id
          return (
            <TouchableOpacity
              key={filter.id}
              onPress={() => setSelectedFilter(filter.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: isSelected
                  ? colors.primary
                  : colors.isDark
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.05)',
                borderWidth: 1,
                borderColor: isSelected
                  ? colors.primary
                  : colors.isDark
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.1)',
              }}
            >
              <Ionicons
                name={filter.icon}
                size={16}
                color={isSelected ? '#FFFFFF' : colors.textSecondary}
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: isSelected ? '#FFFFFF' : colors.text,
                }}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </Animated.View>
  )

  const renderGridMode = () => (
    <Animated.View
      style={{
        flex: 1,
        opacity: modeAnimation,
        transform: [{
          scale: modeAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0.9, 1],
          }),
        }],
      }}
    >
      {loading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 16, color: colors.textSecondary }}>
            Loading consultants...
          </Text>
        </View>
      )}
      
      {error && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Ionicons name="alert-circle" size={48} color={colors.error} />
          <Text style={{ marginTop: 16, color: colors.text, textAlign: 'center' }}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={refetch}
            style={{
              marginTop: 16,
              paddingHorizontal: 24,
              paddingVertical: 12,
              backgroundColor: colors.primary,
              borderRadius: 24,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      {!loading && !error && displayConsultants.length === 0 && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Ionicons name="search" size={48} color={colors.textSecondary} />
          <Text style={{ marginTop: 16, color: colors.text, textAlign: 'center' }}>
            No consultants found matching your criteria
          </Text>
          <Text style={{ marginTop: 8, color: colors.textSecondary, textAlign: 'center' }}>
            Try adjusting your filters or search terms
          </Text>
        </View>
      )}
      
      {!loading && !error && displayConsultants.length > 0 && (
        <FlatList
          data={displayConsultants}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ paddingHorizontal: 20, gap: 12 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <ConsultantGridCard 
              consultant={item} 
              onPress={() => handleConsultantPress(item.id)}
            />
          )}
        />
      )}
    </Animated.View>
  )

  const renderModeSelector = () => (
    <Modal
      visible={showModeSelector}
      transparent
      animationType="fade"
      onRequestClose={() => setShowModeSelector(false)}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end',
        }}
        onPress={() => setShowModeSelector(false)}
      >
        <View
          style={{
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            overflow: 'hidden',
            backgroundColor: colors.isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)',
          }}
        >
          <View style={{
            backgroundColor: colors.isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)',
            paddingTop: 8,
          }}>
            {/* Handle */}
            <View style={{
              width: 40,
              height: 4,
              backgroundColor: colors.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              borderRadius: 2,
              alignSelf: 'center',
              marginVertical: 12,
            }} />

            <Text style={{
              fontSize: 20,
              fontWeight: '700',
              color: colors.text,
              textAlign: 'center',
              marginBottom: 24,
            }}>
              Discover Consultants
            </Text>

            {/* Mode Options */}
            <View style={{ paddingHorizontal: 20, paddingBottom: 40 }}>
              {/* Grid Mode */}
              <TouchableOpacity
                onPress={() => switchMode('grid')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 20,
                  backgroundColor: currentMode === 'grid'
                    ? colors.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                    : 'transparent',
                  borderRadius: 16,
                  marginBottom: 12,
                }}
              >
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 16,
                }}>
                  <Ionicons name="grid" size={24} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 17,
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: 4,
                  }}>
                    Browse Grid
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                  }}>
                    Classic view with filters and search
                  </Text>
                </View>
                {currentMode === 'grid' && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                )}
              </TouchableOpacity>

              {/* Story Mode */}
              <TouchableOpacity
                onPress={() => switchMode('story')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 20,
                  backgroundColor: currentMode === 'story'
                    ? colors.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                    : 'transparent',
                  borderRadius: 16,
                  marginBottom: 12,
                }}
              >
                <LinearGradient
                  colors={['#F58529', '#DD2A7B', '#8134AF', '#515BD4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 16,
                  }}
                >
                  <Ionicons name="play" size={24} color="#FFFFFF" />
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 17,
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: 4,
                  }}>
                    Story Mode
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                  }}>
                    Swipe through consultant stories
                  </Text>
                </View>
                {currentMode === 'story' && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                )}
              </TouchableOpacity>

              {/* AI Match Mode */}
              <TouchableOpacity
                onPress={() => switchMode('ai')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 20,
                  backgroundColor: currentMode === 'ai'
                    ? colors.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                    : 'transparent',
                  borderRadius: 16,
                }}
              >
                <LinearGradient
                  colors={['#00D2FF', '#3A7BD5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 16,
                  }}
                >
                  <Ionicons name="sparkles" size={24} color="#FFFFFF" />
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 17,
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: 4,
                  }}>
                    AI Match
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                  }}>
                    Get personalized consultant matches
                  </Text>
                </View>
                {currentMode === 'ai' && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={colors.isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 10 : 0,
        paddingBottom: 10,
      }}>
        <Text style={{
          fontSize: 28,
          fontWeight: '700',
          color: colors.text,
          flex: 1,
        }}>
          Consultants
        </Text>
        <TouchableOpacity
          onPress={() => setShowModeSelector(!showModeSelector)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons 
            name={currentMode === 'grid' ? 'grid' : currentMode === 'story' ? 'play' : 'sparkles'}
            size={20} 
            color={colors.primary} 
          />
        </TouchableOpacity>
      </View>

      {/* Search and Filters (only in grid mode) */}
      {currentMode === 'grid' && renderHeader()}

      {/* Content */}
      <View style={{ flex: 1 }}>
        {currentMode === 'grid' && renderGridMode()}
        {currentMode === 'story' && (
          <ConsultantStoryMode 
            consultants={displayConsultants} 
            onConsultantPress={handleConsultantPress}
          />
        )}
        {currentMode === 'ai' && (
          <AIMatchMode 
            consultants={displayConsultants}
            onConsultantPress={handleConsultantPress}
          />
        )}
      </View>

      {/* Floating Action Button for Mode Selection */}
      <Animated.View
        style={{
          position: 'absolute',
          bottom: 30,
          right: 20,
          transform: [{ scale: fabScale }],
        }}
      >
        <TouchableOpacity
          onPress={() => setShowModeSelector(true)}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}
        >
          <Ionicons name="apps" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

      {/* Mode Selector Modal */}
      {renderModeSelector()}
    </SafeAreaView>
  )
}