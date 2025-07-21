import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, RefreshControl } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { StudentGuide, GuideCategory, GuideDifficulty, GuideFilters } from '../types'
import { supabase } from '../../../../../lib/supabase'

interface GuideBrowserProps {
  onSelectGuide: (guide: StudentGuide) => void
  onCreateGuide: () => void
  currentUserId: string
}

export function GuideBrowser({ onSelectGuide, onCreateGuide, currentUserId }: GuideBrowserProps) {
  const [guides, setGuides] = useState<StudentGuide[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<GuideCategory | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<GuideDifficulty | null>(null)
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'highest_rated'>('popular')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadGuides()
  }, [selectedCategory, selectedDifficulty, sortBy])

  const loadGuides = async () => {
    try {
      let query = supabase
        .from('student_guides')
        .select(`
          *,
          author:author_id(id, name, current_school),
          interactions:guide_interactions(
            bookmarked,
            found_helpful,
            rating
          )
        `)
        .eq('status', 'published')

      // Apply filters
      if (selectedCategory) {
        query = query.eq('category', selectedCategory)
      }
      if (selectedDifficulty) {
        query = query.eq('difficulty', selectedDifficulty)
      }

      // Apply sorting
      switch (sortBy) {
        case 'popular':
          query = query.order('view_count', { ascending: false })
          break
        case 'recent':
          query = query.order('published_at', { ascending: false })
          break
        case 'highest_rated':
          query = query.order('avg_rating', { ascending: false })
          break
      }

      const { data, error } = await query.limit(50)

      if (error) throw error

      // Filter by search query on client side for now
      let filteredData = data || []
      if (searchQuery) {
        filteredData = filteredData.filter(guide =>
          guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          guide.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      }

      setGuides(filteredData)
    } catch (error) {
      console.error('Error loading guides:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const categories = [
    { value: GuideCategory.Essays, label: 'Essays', icon: 'edit-3', color: '#3B82F6' },
    { value: GuideCategory.Interviews, label: 'Interviews', icon: 'mic', color: '#8B5CF6' },
    { value: GuideCategory.TestPrep, label: 'Test Prep', icon: 'book', color: '#F59E0B' },
    { value: GuideCategory.Applications, label: 'Applications', icon: 'file-text', color: '#10B981' },
    { value: GuideCategory.FinancialAid, label: 'Financial Aid', icon: 'dollar-sign', color: '#EF4444' },
    { value: GuideCategory.Extracurriculars, label: 'Activities', icon: 'activity', color: '#EC4899' },
  ]

  const GuideCard = ({ guide }: { guide: StudentGuide }) => {
    const isBookmarked = guide.interactions?.[0]?.bookmarked || false
    
    return (
      <TouchableOpacity
        onPress={() => onSelectGuide(guide)}
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
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <View style={{
                paddingHorizontal: 10,
                paddingVertical: 3,
                backgroundColor: getCategoryColor(guide.category) + '20',
                borderRadius: 10,
                marginRight: 8
              }}>
                <Text style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color: getCategoryColor(guide.category),
                  textTransform: 'capitalize'
                }}>
                  {guide.category.replace('_', ' ')}
                </Text>
              </View>
              <View style={{
                paddingHorizontal: 8,
                paddingVertical: 2,
                backgroundColor: getDifficultyColor(guide.difficulty) + '20',
                borderRadius: 8
              }}>
                <Text style={{
                  fontSize: 11,
                  fontWeight: '500',
                  color: getDifficultyColor(guide.difficulty)
                }}>
                  {guide.difficulty}
                </Text>
              </View>
            </View>
            
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#111827',
              marginBottom: 4
            }} numberOfLines={2}>
              {guide.title}
            </Text>
          </View>
          
          {isBookmarked && (
            <Feather name="bookmark" size={20} color="#059669" />
          )}
        </View>

        <Text style={{
          fontSize: 14,
          color: '#6B7280',
          marginBottom: 12,
          lineHeight: 20
        }} numberOfLines={2}>
          {guide.description}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: '#6B7280' }}>
              by {guide.author?.name || 'Anonymous'}
            </Text>
            {guide.author?.current_school && (
              <Text style={{ fontSize: 12, color: '#9CA3AF', marginLeft: 4 }}>
                • {guide.author.current_school}
              </Text>
            )}
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Feather name="clock" size={14} color="#9CA3AF" />
            <Text style={{ fontSize: 12, color: '#9CA3AF', marginLeft: 4 }}>
              {guide.read_time} min
            </Text>
          </View>
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

        {guide.tags.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, gap: 6 }}>
            {guide.tags.slice(0, 3).map(tag => (
              <View
                key={tag}
                style={{
                  backgroundColor: '#F3F4F6',
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 12
                }}
              >
                <Text style={{ fontSize: 11, color: '#6B7280' }}>{tag}</Text>
              </View>
            ))}
            {guide.tags.length > 3 && (
              <Text style={{ fontSize: 11, color: '#9CA3AF' }}>+{guide.tags.length - 3}</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    )
  }

  const getCategoryColor = (category: GuideCategory): string => {
    const colors: Record<string, string> = {
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
    return colors[category] || '#6B7280'
  }

  const getDifficultyColor = (difficulty: GuideDifficulty): string => {
    switch (difficulty) {
      case GuideDifficulty.Beginner:
        return '#10B981'
      case GuideDifficulty.Intermediate:
        return '#F59E0B'
      case GuideDifficulty.Advanced:
        return '#EF4444'
      default:
        return '#6B7280'
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header */}
      <View style={{
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB'
      }}>
        {/* Search Bar */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F3F4F6',
          borderRadius: 8,
          paddingHorizontal: 12,
          marginBottom: 12
        }}>
          <Feather name="search" size={20} color="#6B7280" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search guides..."
            placeholderTextColor="#9CA3AF"
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 8,
              fontSize: 16,
              color: '#111827'
            }}
            onSubmitEditing={loadGuides}
            returnKeyType="search"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={20} color="#6B7280" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor: showFilters ? '#059669' : '#F3F4F6',
              borderRadius: 16,
              marginRight: 8
            }}
          >
            <Feather 
              name="sliders" 
              size={14} 
              color={showFilters ? '#FFFFFF' : '#6B7280'} 
            />
            <Text style={{
              marginLeft: 4,
              fontSize: 14,
              fontWeight: '500',
              color: showFilters ? '#FFFFFF' : '#6B7280'
            }}>
              Filters
            </Text>
          </TouchableOpacity>

          {selectedCategory && (
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
                paddingVertical: 6,
                backgroundColor: getCategoryColor(selectedCategory) + '20',
                borderRadius: 16,
                marginRight: 8
              }}
            >
              <Text style={{
                fontSize: 14,
                fontWeight: '500',
                color: getCategoryColor(selectedCategory),
                textTransform: 'capitalize'
              }}>
                {selectedCategory.replace('_', ' ')}
              </Text>
              <Feather 
                name="x" 
                size={14} 
                color={getCategoryColor(selectedCategory)} 
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          )}

          {selectedDifficulty && (
            <TouchableOpacity
              onPress={() => setSelectedDifficulty(null)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
                paddingVertical: 6,
                backgroundColor: getDifficultyColor(selectedDifficulty) + '20',
                borderRadius: 16,
                marginRight: 8
              }}
            >
              <Text style={{
                fontSize: 14,
                fontWeight: '500',
                color: getDifficultyColor(selectedDifficulty)
              }}>
                {selectedDifficulty}
              </Text>
              <Feather 
                name="x" 
                size={14} 
                color={getDifficultyColor(selectedDifficulty)} 
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <View style={{
          backgroundColor: '#FFFFFF',
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB'
        }}>
          {/* Categories */}
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
            Category
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat.value}
                  onPress={() => setSelectedCategory(
                    selectedCategory === cat.value ? null : cat.value
                  )}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: selectedCategory === cat.value ? cat.color : '#F3F4F6'
                  }}
                >
                  <Text style={{
                    fontSize: 13,
                    fontWeight: '500',
                    color: selectedCategory === cat.value ? '#FFFFFF' : '#6B7280'
                  }}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Difficulty */}
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
            Difficulty
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            {[GuideDifficulty.Beginner, GuideDifficulty.Intermediate, GuideDifficulty.Advanced].map(diff => (
              <TouchableOpacity
                key={diff}
                onPress={() => setSelectedDifficulty(
                  selectedDifficulty === diff ? null : diff
                )}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: selectedDifficulty === diff ? getDifficultyColor(diff) : '#F3F4F6',
                  alignItems: 'center'
                }}
              >
                <Text style={{
                  fontSize: 13,
                  fontWeight: '500',
                  color: selectedDifficulty === diff ? '#FFFFFF' : '#6B7280'
                }}>
                  {diff}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sort By */}
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
            Sort By
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[
              { value: 'popular', label: 'Most Popular' },
              { value: 'recent', label: 'Most Recent' },
              { value: 'highest_rated', label: 'Highest Rated' }
            ].map(sort => (
              <TouchableOpacity
                key={sort.value}
                onPress={() => setSortBy(sort.value as any)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: sortBy === sort.value ? '#059669' : '#F3F4F6'
                }}
              >
                <Text style={{
                  fontSize: 13,
                  fontWeight: '500',
                  color: sortBy === sort.value ? '#FFFFFF' : '#6B7280'
                }}>
                  {sort.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Results Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#F9FAFB'
      }}>
        <Text style={{ fontSize: 14, color: '#6B7280' }}>
          {guides.length} guides found
        </Text>
        <TouchableOpacity
          onPress={onCreateGuide}
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
            Create Guide
          </Text>
        </TouchableOpacity>
      </View>

      {/* Guides List */}
      <FlatList
        data={guides}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GuideCard guide={item} />}
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true)
              loadGuides()
            }}
          />
        }
        ListEmptyComponent={
          loading ? (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Text style={{ color: '#6B7280' }}>Loading guides...</Text>
            </View>
          ) : (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Feather name="book-open" size={48} color="#E5E7EB" />
              <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 12 }}>
                No guides found
              </Text>
              <Text style={{ fontSize: 14, color: '#9CA3AF', marginTop: 4 }}>
                Try adjusting your filters or search
              </Text>
            </View>
          )
        }
      />
    </View>
  )
}