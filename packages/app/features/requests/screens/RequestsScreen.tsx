import React, { useState, useRef, useCallback, useMemo } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, useThemedColors, usePrimaryColors } from 'app/contexts/ThemeContext'
import { colors } from 'app/constants/colors'
import { RequestCard } from '../components/RequestCard'
import { RequestsStats, ServiceRequest, RequestStatus } from '../types'
import { EmptyState } from '../components/EmptyState'
import { JourneyHeader } from '../components/JourneyHeader'
import { FilterPills } from '../components/FilterPills'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

// Mock data for development
const mockRequests: ServiceRequest[] = [
  {
    id: '1',
    serviceType: 'essay_review',
    title: 'Common App Essay Review',
    consultant: {
      id: 'c1',
      name: 'Sarah Chen',
      university: 'Harvard',
      graduationYear: '26',
      profileImage: 'https://avatar.iran.liara.run/public/girl',
      isVerified: true,
      isOnline: true,
      responseTime: '2 hours',
      rating: 4.9,
      totalReviews: 127,
    },
    status: 'active',
    urgencyLevel: 'standard',
    price: 150,
    progress: 75,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    startedAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    revisionDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    revisionsRemaining: 2,
    totalRevisions: 3,
    deliverables: [
      {
        id: 'd1',
        type: 'document',
        title: 'Edited Essay with Comments',
        commentsCount: 47,
        trackedChangesCount: 23,
        uploadedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
    ],
    revisions: [],
    lastActivity: new Date(Date.now() - 30 * 60 * 1000),
    description: 'Review and edit my Common App personal statement',
    isConsultantWorking: true,
    estimatedCompletionTime: '2 hours',
  },
  {
    id: '2',
    serviceType: 'interview_prep',
    title: 'MIT Interview Preparation',
    consultant: {
      id: 'c2',
      name: 'Michael Zhang',
      university: 'MIT',
      graduationYear: '25',
      profileImage: 'https://avatar.iran.liara.run/public/boy',
      isVerified: true,
      isOnline: false,
      responseTime: '4 hours',
      rating: 5.0,
      totalReviews: 89,
    },
    status: 'in_review',
    urgencyLevel: 'priority',
    price: 225,
    progress: 100,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    revisionsRemaining: 1,
    totalRevisions: 1,
    deliverables: [
      {
        id: 'd2',
        type: 'video',
        title: 'Mock Interview Recording',
        uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: 'd3',
        type: 'document',
        title: 'Interview Feedback Report',
        uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ],
    revisions: [],
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    description: 'Comprehensive MIT interview preparation session',
    isConsultantWorking: false,
    school: 'MIT',
  },
  {
    id: '3',
    serviceType: 'application_strategy',
    title: 'UC Application Strategy',
    consultant: {
      id: 'c3',
      name: 'Emily Rodriguez',
      university: 'UCLA',
      graduationYear: '24',
      profileImage: 'https://avatar.iran.liara.run/public/girl',
      isVerified: true,
      isOnline: true,
      responseTime: '1 hour',
      rating: 4.8,
      totalReviews: 203,
    },
    status: 'completed',
    urgencyLevel: 'express',
    price: 300,
    progress: 100,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    startedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    deadline: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    revisionsRemaining: 0,
    totalRevisions: 2,
    deliverables: [
      {
        id: 'd4',
        type: 'document',
        title: 'UC Application Strategy Guide',
        uploadedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'd5',
        type: 'document',
        title: 'Essay Topics Recommendations',
        uploadedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
    ],
    revisions: [
      {
        id: 'r1',
        requestedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        description: 'Please add more specific examples for UC Berkeley',
        status: 'completed',
        completedAt: new Date(Date.now() - 4.5 * 24 * 60 * 60 * 1000),
      },
    ],
    lastActivity: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    description: 'Complete UC application strategy for all campuses',
    isConsultantWorking: false,
  },
]

const mockStats: RequestsStats = {
  totalRequests: 12,
  activeRequests: 3,
  inReviewRequests: 2,
  completedRequests: 7,
  journeyProgress: 32,
}

export function RequestsScreen() {
  const insets = useSafeAreaInsets()
  const { theme, isDark } = useTheme()
  const themedColors = useThemedColors()
  const primaryColors = usePrimaryColors()
  // Removed scrollY to fix header visibility issues
  const [refreshing, setRefreshing] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<RequestStatus | 'all'>('all')

  const filteredRequests = useMemo(() => {
    if (selectedFilter === 'all') return mockRequests
    return mockRequests.filter((request) => request.status === selectedFilter)
  }, [selectedFilter])

  const filterCounts = useMemo(() => {
    return {
      all: mockRequests.length,
      active: mockRequests.filter((r) => r.status === 'active').length,
      in_review: mockRequests.filter((r) => r.status === 'in_review').length,
      completed: mockRequests.filter((r) => r.status === 'completed').length,
      pending: mockRequests.filter((r) => r.status === 'pending').length,
    }
  }, [])

  // Remove unused animations that were causing issues
  // const headerOpacity = scrollY.interpolate({
  //   inputRange: [0, 50],
  //   outputRange: [1, 0.8],
  //   extrapolate: 'clamp',
  // })

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }, [])

  const backgroundColor = themedColors.background.default

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top,
          backgroundColor: themedColors.surface.raised,
          borderBottomWidth: 1,
          borderBottomColor: themedColors.border.default,
          shadowColor: isDark ? colors.primary[500] : '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.2 : 0.1,
          shadowRadius: 3,
          elevation: 5,
        }}
      >
        <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: '800',
              color: themedColors.text.primary,
              marginBottom: 8,
              letterSpacing: -0.5,
            }}
          >
            My Requests
          </Text>
          
          <JourneyHeader stats={mockStats} />
        </View>

        <FilterPills
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          counts={filterCounts}
        />
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: insets.bottom + 100,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={primaryColors.primary} />
        }
        // Removed scroll animations to fix header visibility issues
      >
        {filteredRequests.length === 0 ? (
          <EmptyState filter={selectedFilter} />
        ) : (
          <View style={{ gap: 12 }}>
            {filteredRequests.map((request, index) => (
              <RequestCard 
                key={request.id} 
                request={request} 
                index={index}
                onDismiss={(requestId) => {
                  // In a real app, this would update the data
                  console.log(`Dismissed request: ${requestId}`)
                }}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}