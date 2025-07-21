import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Share, Alert } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { StudentGuide, GuideInteraction } from '../types'
import { CommentSection } from './CommentSection'
import { supabase } from '../../../../../lib/supabase'

interface GuideViewerProps {
  guide: StudentGuide
  interaction?: GuideInteraction
  onBack: () => void
  currentUserId: string
}

export function GuideViewer({ guide, interaction: initialInteraction, onBack, currentUserId }: GuideViewerProps) {
  const [interaction, setInteraction] = useState<GuideInteraction | undefined>(initialInteraction)
  const [readProgress, setReadProgress] = useState(0)
  const [showComments, setShowComments] = useState(false)

  useEffect(() => {
    // Track view
    trackView()
  }, [])

  const trackView = async () => {
    try {
      await supabase.rpc('increment_guide_view', {
        p_guide_id: guide.id,
        p_user_id: currentUserId
      })
    } catch (error) {
      console.error('Error tracking view:', error)
    }
  }

  const toggleBookmark = async () => {
    try {
      const newBookmarked = !interaction?.bookmarked
      
      const { error } = await supabase
        .from('guide_interactions')
        .upsert({
          guide_id: guide.id,
          user_id: currentUserId,
          bookmarked: newBookmarked,
          bookmarked_at: newBookmarked ? new Date().toISOString() : null
        })

      if (!error) {
        setInteraction(prev => ({
          ...prev!,
          bookmarked: newBookmarked,
          bookmarked_at: newBookmarked ? new Date().toISOString() : undefined
        }))
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update bookmark')
    }
  }

  const markHelpful = async (helpful: boolean) => {
    try {
      const { error } = await supabase
        .from('guide_interactions')
        .upsert({
          guide_id: guide.id,
          user_id: currentUserId,
          found_helpful: helpful
        })

      if (!error) {
        setInteraction(prev => ({
          ...prev!,
          found_helpful: helpful
        }))
        Alert.alert('Thanks!', 'Your feedback helps improve our guides.')
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit feedback')
    }
  }

  const shareGuide = async () => {
    try {
      await Share.share({
        message: `Check out this guide: ${guide.title}\n\n${guide.description}`,
        url: `https://proofr.com/guides/${guide.slug}`
      })
      
      // Track share
      await supabase
        .from('guide_interactions')
        .upsert({
          guide_id: guide.id,
          user_id: currentUserId,
          shared: true,
          shared_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  const renderContent = () => {
    // Simple markdown-like rendering
    const content = guide.content.sections[0]?.content || ''
    const lines = content.split('\n')
    
    return lines.map((line, index) => {
      // Headers
      if (line.startsWith('# ')) {
        return (
          <Text key={index} style={{ fontSize: 24, fontWeight: '700', color: '#111827', marginVertical: 12 }}>
            {line.substring(2)}
          </Text>
        )
      }
      if (line.startsWith('## ')) {
        return (
          <Text key={index} style={{ fontSize: 20, fontWeight: '600', color: '#111827', marginVertical: 10 }}>
            {line.substring(3)}
          </Text>
        )
      }
      
      // Lists
      if (line.startsWith('- ')) {
        return (
          <View key={index} style={{ flexDirection: 'row', marginVertical: 4 }}>
            <Text style={{ color: '#6B7280', marginRight: 8 }}>•</Text>
            <Text style={{ flex: 1, fontSize: 16, color: '#374151', lineHeight: 24 }}>
              {line.substring(2)}
            </Text>
          </View>
        )
      }
      
      // Regular paragraphs
      if (line.trim()) {
        return (
          <Text key={index} style={{ fontSize: 16, color: '#374151', lineHeight: 24, marginVertical: 8 }}>
            {line}
          </Text>
        )
      }
      
      return <View key={index} style={{ height: 8 }} />
    })
  }

  const categoryColors: Record<string, string> = {
    essays: '#3B82F6',
    interviews: '#8B5CF6',
    test_prep: '#F59E0B',
    applications: '#10B981',
    financial_aid: '#EF4444',
    extracurriculars: '#EC4899',
    research: '#6366F1',
    international: '#14B8A6',
    transfer: '#F97316',
    gap_year: '#84CC16',
    other: '#6B7280'
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        backgroundColor: '#FFFFFF'
      }}>
        <TouchableOpacity onPress={onBack} style={{ marginRight: 16 }}>
          <Feather name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }} numberOfLines={1}>
            {guide.title}
          </Text>
        </View>
        <TouchableOpacity onPress={toggleBookmark} style={{ marginLeft: 12 }}>
          <Feather 
            name={interaction?.bookmarked ? 'bookmark' : 'bookmark'} 
            size={24} 
            color={interaction?.bookmarked ? '#059669' : '#6B7280'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={shareGuide} style={{ marginLeft: 12 }}>
          <Feather name="share-2" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        onScroll={(e) => {
          const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent
          const progress = (contentOffset.y + layoutMeasurement.height) / contentSize.height
          setReadProgress(Math.min(progress * 100, 100))
        }}
        scrollEventThrottle={16}
      >
        {/* Guide Header */}
        <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <View style={{
              paddingHorizontal: 12,
              paddingVertical: 4,
              backgroundColor: categoryColors[guide.category] + '20',
              borderRadius: 12,
              marginRight: 8
            }}>
              <Text style={{ 
                fontSize: 12, 
                fontWeight: '600', 
                color: categoryColors[guide.category],
                textTransform: 'capitalize'
              }}>
                {guide.category.replace('_', ' ')}
              </Text>
            </View>
            <View style={{
              paddingHorizontal: 12,
              paddingVertical: 4,
              backgroundColor: '#F3F4F6',
              borderRadius: 12
            }}>
              <Text style={{ fontSize: 12, fontWeight: '500', color: '#6B7280' }}>
                {guide.difficulty}
              </Text>
            </View>
          </View>

          <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 8 }}>
            {guide.title}
          </Text>
          
          <Text style={{ fontSize: 16, color: '#6B7280', marginBottom: 16, lineHeight: 22 }}>
            {guide.description}
          </Text>

          {/* Author Info */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#E5E7EB',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12
            }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#6B7280' }}>
                {guide.author?.name?.charAt(0) || 'A'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>
                {guide.author?.name || 'Anonymous'}
              </Text>
              <Text style={{ fontSize: 12, color: '#6B7280' }}>
                {new Date(guide.published_at || guide.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* Stats */}
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="clock" size={16} color="#6B7280" />
              <Text style={{ fontSize: 14, color: '#6B7280', marginLeft: 4 }}>
                {guide.read_time} min read
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="eye" size={16} color="#6B7280" />
              <Text style={{ fontSize: 14, color: '#6B7280', marginLeft: 4 }}>
                {guide.view_count} views
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="thumbs-up" size={16} color="#6B7280" />
              <Text style={{ fontSize: 14, color: '#6B7280', marginLeft: 4 }}>
                {guide.helpful_count} helpful
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={{ padding: 20 }}>
          {renderContent()}
        </View>

        {/* Helpful Section */}
        <View style={{ 
          margin: 20, 
          padding: 20, 
          backgroundColor: '#F9FAFB', 
          borderRadius: 12,
          alignItems: 'center'
        }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 12 }}>
            Was this guide helpful?
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              onPress={() => markHelpful(true)}
              disabled={interaction?.found_helpful !== undefined}
              style={{
                paddingHorizontal: 24,
                paddingVertical: 12,
                backgroundColor: interaction?.found_helpful === true ? '#059669' : '#FFFFFF',
                borderWidth: 1,
                borderColor: interaction?.found_helpful === true ? '#059669' : '#E5E7EB',
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8
              }}
            >
              <Feather 
                name="thumbs-up" 
                size={20} 
                color={interaction?.found_helpful === true ? '#FFFFFF' : '#6B7280'} 
              />
              <Text style={{ 
                color: interaction?.found_helpful === true ? '#FFFFFF' : '#6B7280',
                fontWeight: '600'
              }}>
                Yes
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => markHelpful(false)}
              disabled={interaction?.found_helpful !== undefined}
              style={{
                paddingHorizontal: 24,
                paddingVertical: 12,
                backgroundColor: interaction?.found_helpful === false ? '#DC2626' : '#FFFFFF',
                borderWidth: 1,
                borderColor: interaction?.found_helpful === false ? '#DC2626' : '#E5E7EB',
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8
              }}
            >
              <Feather 
                name="thumbs-down" 
                size={20} 
                color={interaction?.found_helpful === false ? '#FFFFFF' : '#6B7280'} 
              />
              <Text style={{ 
                color: interaction?.found_helpful === false ? '#FFFFFF' : '#6B7280',
                fontWeight: '600'
              }}>
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tags */}
        {guide.tags.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#6B7280', marginBottom: 8 }}>
              Tags
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {guide.tags.map(tag => (
                <View
                  key={tag}
                  style={{
                    backgroundColor: '#F3F4F6',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16
                  }}
                >
                  <Text style={{ color: '#374151', fontSize: 14 }}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Comments Toggle */}
        <TouchableOpacity
          onPress={() => setShowComments(!showComments)}
          style={{
            marginHorizontal: 20,
            marginBottom: 20,
            padding: 16,
            backgroundColor: '#F9FAFB',
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="message-circle" size={20} color="#6B7280" />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#374151', marginLeft: 8 }}>
              Comments
            </Text>
          </View>
          <Feather 
            name={showComments ? 'chevron-up' : 'chevron-down'} 
            size={20} 
            color="#6B7280" 
          />
        </TouchableOpacity>

        {/* Comments Section */}
        {showComments && (
          <CommentSection
            guideId={guide.id}
            currentUserId={currentUserId}
          />
        )}
      </ScrollView>

      {/* Progress Bar */}
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: '#E5E7EB'
      }}>
        <View style={{
          width: `${readProgress}%`,
          height: '100%',
          backgroundColor: '#059669'
        }} />
      </View>
    </View>
  )
}