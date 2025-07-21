import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { StudentGuide, GuideStatus } from '../types'
import { supabase } from '../../../../../lib/supabase'
import { GuideEditor } from '../components/GuideEditor'
import { GuideViewer } from '../components/GuideViewer'

export function MyGuidesScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const [userId, setUserId] = useState<string>('')
  const [guides, setGuides] = useState<StudentGuide[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [currentView, setCurrentView] = useState<'list' | 'editor' | 'viewer'>('list')
  const [selectedGuide, setSelectedGuide] = useState<StudentGuide | null>(null)
  const [editingGuide, setEditingGuide] = useState<StudentGuide | null>(null)

  useEffect(() => {
    getCurrentUser()
  }, [])

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUserId(user.id)
      loadMyGuides(user.id)
    }
  }

  const loadMyGuides = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('student_guides')
        .select('*')
        .eq('author_id', uid)
        .order('created_at', { ascending: false })

      if (error) throw error
      setGuides(data || [])
    } catch (error) {
      console.error('Error loading guides:', error)
      Alert.alert('Error', 'Failed to load your guides')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const createGuide = async (data: any) => {
    try {
      const { data: guide, error } = await supabase
        .from('student_guides')
        .insert({
          author_id: userId,
          ...data,
          status: GuideStatus.PendingReview
        })
        .select()
        .single()

      if (error) throw error

      Alert.alert('Success', 'Your guide has been submitted for review!')
      loadMyGuides(userId)
      setCurrentView('list')
    } catch (error) {
      console.error('Error creating guide:', error)
      throw error
    }
  }

  const updateGuide = async (data: any) => {
    if (!editingGuide) return

    try {
      const { error } = await supabase
        .from('student_guides')
        .update({
          ...data,
          version: editingGuide.version + 1,
          last_major_update: new Date().toISOString()
        })
        .eq('id', editingGuide.id)

      if (error) throw error

      Alert.alert('Success', 'Your guide has been updated!')
      loadMyGuides(userId)
      setCurrentView('list')
      setEditingGuide(null)
    } catch (error) {
      console.error('Error updating guide:', error)
      throw error
    }
  }

  const deleteGuide = async (guideId: string) => {
    Alert.alert(
      'Delete Guide',
      'Are you sure you want to delete this guide? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('student_guides')
                .delete()
                .eq('id', guideId)

              if (error) throw error

              Alert.alert('Success', 'Guide deleted successfully')
              loadMyGuides(userId)
            } catch (error) {
              Alert.alert('Error', 'Failed to delete guide')
            }
          }
        }
      ]
    )
  }

  const getStatusColor = (status: GuideStatus) => {
    switch (status) {
      case GuideStatus.Draft:
        return '#6B7280'
      case GuideStatus.PendingReview:
        return '#F59E0B'
      case GuideStatus.Published:
        return '#10B981'
      case GuideStatus.Flagged:
        return '#EF4444'
      case GuideStatus.Archived:
        return '#9CA3AF'
      default:
        return '#6B7280'
    }
  }

  const GuideCard = ({ guide }: { guide: StudentGuide }) => (
    <TouchableOpacity
      onPress={() => {
        if (guide.status === GuideStatus.Published) {
          setSelectedGuide(guide)
          setCurrentView('viewer')
        } else {
          Alert.alert('Not Published', 'This guide is not yet published.')
        }
      }}
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#111827',
            marginBottom: 4
          }}>
            {guide.title}
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8
          }}>
            <View style={{
              paddingHorizontal: 10,
              paddingVertical: 3,
              backgroundColor: getStatusColor(guide.status) + '20',
              borderRadius: 10
            }}>
              <Text style={{
                fontSize: 11,
                fontWeight: '600',
                color: getStatusColor(guide.status),
                textTransform: 'capitalize'
              }}>
                {guide.status.replace('_', ' ')}
              </Text>
            </View>
            <Text style={{ fontSize: 12, color: '#6B7280' }}>
              v{guide.version}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Guide Actions',
              'What would you like to do?',
              [
                {
                  text: 'Edit',
                  onPress: () => {
                    setEditingGuide(guide)
                    setCurrentView('editor')
                  }
                },
                {
                  text: 'View Analytics',
                  onPress: () => Alert.alert('Coming Soon', 'Analytics will be available soon!')
                },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => deleteGuide(guide.id)
                },
                { text: 'Cancel', style: 'cancel' }
              ]
            )
          }}
        >
          <Feather name="more-vertical" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <Text style={{
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 12
      }} numberOfLines={2}>
        {guide.description}
      </Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="eye" size={14} color="#9CA3AF" />
            <Text style={{ fontSize: 12, color: '#9CA3AF', marginLeft: 4 }}>
              {guide.view_count}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="thumbs-up" size={14} color="#9CA3AF" />
            <Text style={{ fontSize: 12, color: '#9CA3AF', marginLeft: 4 }}>
              {guide.helpful_count}
            </Text>
          </View>
          {guide.avg_rating && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="star" size={14} color="#F59E0B" />
              <Text style={{ fontSize: 12, color: '#9CA3AF', marginLeft: 4 }}>
                {guide.avg_rating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
        <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
          {new Date(guide.created_at).toLocaleDateString()}
        </Text>
      </View>

      {guide.moderation_notes && (
        <View style={{
          marginTop: 12,
          padding: 12,
          backgroundColor: '#FEF3C7',
          borderRadius: 8
        }}>
          <Text style={{ fontSize: 12, color: '#92400E' }}>
            <Text style={{ fontWeight: '600' }}>Review Note:</Text> {guide.moderation_notes}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )

  if (currentView === 'editor') {
    return (
      <View style={{ flex: 1 }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
          backgroundColor: '#FFFFFF'
        }}>
          <TouchableOpacity 
            onPress={() => {
              setCurrentView('list')
              setEditingGuide(null)
            }}
            style={{ marginRight: 16 }}
          >
            <Feather name="x" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }}>
            {editingGuide ? 'Edit Guide' : 'Create New Guide'}
          </Text>
        </View>
        <GuideEditor
          initialData={editingGuide || undefined}
          onSave={editingGuide ? updateGuide : createGuide}
          onCancel={() => {
            setCurrentView('list')
            setEditingGuide(null)
          }}
          isEdit={!!editingGuide}
        />
      </View>
    )
  }

  if (currentView === 'viewer' && selectedGuide) {
    return (
      <GuideViewer
        guide={selectedGuide}
        onBack={() => {
          setCurrentView('list')
          setSelectedGuide(null)
        }}
        currentUserId={userId}
      />
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        backgroundColor: '#FFFFFF'
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 16 }}>
            <Feather name="arrow-left" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: '600', color: '#111827' }}>
            My Guides
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => setCurrentView('editor')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: '#059669',
            borderRadius: 20
          }}
        >
          <Feather name="plus" size={16} color="#FFFFFF" />
          <Text style={{
            marginLeft: 4,
            fontSize: 14,
            fontWeight: '600',
            color: '#FFFFFF'
          }}>
            New Guide
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats Summary */}
      <View style={{
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB'
      }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>
            {guides.filter(g => g.status === GuideStatus.Published).length}
          </Text>
          <Text style={{ fontSize: 12, color: '#6B7280' }}>Published</Text>
        </View>
        <View style={{ width: 1, backgroundColor: '#E5E7EB' }} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>
            {guides.reduce((sum, g) => sum + g.view_count, 0)}
          </Text>
          <Text style={{ fontSize: 12, color: '#6B7280' }}>Total Views</Text>
        </View>
        <View style={{ width: 1, backgroundColor: '#E5E7EB' }} />
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>
            {guides.reduce((sum, g) => sum + g.helpful_count, 0)}
          </Text>
          <Text style={{ fontSize: 12, color: '#6B7280' }}>Helpful</Text>
        </View>
      </View>

      {/* Guides List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true)
              loadMyGuides(userId)
            }}
          />
        }
      >
        {loading ? (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={{ color: '#6B7280' }}>Loading your guides...</Text>
          </View>
        ) : guides.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Feather name="book-open" size={48} color="#E5E7EB" />
            <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 12 }}>
              No guides yet
            </Text>
            <Text style={{ fontSize: 14, color: '#9CA3AF', marginTop: 4, textAlign: 'center' }}>
              Start sharing your knowledge by creating your first guide!
            </Text>
            <TouchableOpacity
              onPress={() => setCurrentView('editor')}
              style={{
                marginTop: 20,
                paddingHorizontal: 24,
                paddingVertical: 12,
                backgroundColor: '#059669',
                borderRadius: 8
              }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>
                Create Your First Guide
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          guides.map(guide => <GuideCard key={guide.id} guide={guide} />)
        )}
      </ScrollView>
    </View>
  )
}