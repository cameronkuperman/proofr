import React, { useState } from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'
import { useTheme, useThemedColors, usePrimaryColors } from '../../../contexts/ThemeContext'
import { colors } from '../../../constants/colors'
import { MotiView } from 'moti'

interface DocumentsModalProps {
  visible: boolean
  onClose: () => void
}

interface Document {
  id: string
  name: string
  type: 'essay' | 'recommendation' | 'transcript' | 'resume' | 'other'
  college?: string
  lastModified: string
  status: 'draft' | 'review' | 'submitted'
  size: string
  wordCount?: number
  consultant?: string
}

export function DocumentsModal({ visible, onClose }: DocumentsModalProps) {
  const { isDark } = useTheme()
  const themedColors = useThemedColors()
  const primaryColors = usePrimaryColors()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  
  // Mock documents data
  const mockDocuments: Document[] = [
    {
      id: '1',
      name: 'Common App Personal Essay',
      type: 'essay',
      lastModified: '2 hours ago',
      status: 'review',
      size: '2.1 KB',
      wordCount: 648,
      consultant: 'Sarah Chen',
    },
    {
      id: '2',
      name: 'MIT Supplemental - Innovation',
      type: 'essay',
      college: 'MIT',
      lastModified: '1 day ago',
      status: 'draft',
      size: '1.8 KB',
      wordCount: 250,
    },
    {
      id: '3',
      name: 'Harvard Supplemental - Leadership',
      type: 'essay',
      college: 'Harvard',
      lastModified: '3 days ago',
      status: 'submitted',
      size: '2.3 KB',
      wordCount: 300,
    },
    {
      id: '4',
      name: 'Academic Resume',
      type: 'resume',
      lastModified: '1 week ago',
      status: 'submitted',
      size: '156 KB',
    },
    {
      id: '5',
      name: 'Official Transcript',
      type: 'transcript',
      lastModified: '2 weeks ago',
      status: 'submitted',
      size: '2.4 MB',
    },
  ]
  
  const filters = [
    { id: 'all', label: 'All', count: mockDocuments.length },
    { id: 'essay', label: 'Essays', count: mockDocuments.filter(d => d.type === 'essay').length },
    { id: 'draft', label: 'Drafts', count: mockDocuments.filter(d => d.status === 'draft').length },
    { id: 'review', label: 'In Review', count: mockDocuments.filter(d => d.status === 'review').length },
    { id: 'submitted', label: 'Submitted', count: mockDocuments.filter(d => d.status === 'submitted').length },
  ]
  
  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === 'all' ||
      doc.type === selectedFilter ||
      doc.status === selectedFilter
    return matchesSearch && matchesFilter
  })
  
  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'essay': return 'file-text'
      case 'recommendation': return 'award'
      case 'transcript': return 'book'
      case 'resume': return 'briefcase'
      default: return 'file'
    }
  }
  
  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'draft': return themedColors.text.secondary
      case 'review': return colors.warning.main
      case 'submitted': return primaryColors.primary
    }
  }
  
  const getStatusBgColor = (status: Document['status']) => {
    switch (status) {
      case 'draft': return isDark ? colors.gray[800] : colors.gray[100]
      case 'review': return isDark ? colors.warning.dark : colors.warning.light
      case 'submitted': return isDark ? colors.primary[800] : colors.primary[100]
    }
  }
  
  const renderDocument = ({ item }: { item: Document }) => (
    <TouchableOpacity
      style={{
        backgroundColor: themedColors.surface.raised,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: themedColors.border.default,
      }}
      onPress={() => Alert.alert(item.name, 'Opens document editor/viewer')}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: isDark ? colors.primary[800] : colors.primary[50],
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}
        >
          <Feather
            name={getDocumentIcon(item.type)}
            size={24}
            color={primaryColors.primary}
          />
        </View>
        
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: themedColors.text.primary,
                flex: 1,
              }}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            {item.college && (
              <View
                style={{
                  backgroundColor: colors.university[item.college.toLowerCase()] || colors.gray[600],
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 10,
                  marginLeft: 8,
                }}
              >
                <Text style={{ fontSize: 11, color: '#FFFFFF', fontWeight: '600' }}>
                  {item.college}
                </Text>
              </View>
            )}
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 14, color: themedColors.text.secondary }}>
              {item.lastModified}
            </Text>
            <Text style={{ fontSize: 14, color: themedColors.text.tertiary, marginHorizontal: 8 }}>
              •
            </Text>
            <Text style={{ fontSize: 14, color: themedColors.text.secondary }}>
              {item.size}
            </Text>
            {item.wordCount && (
              <>
                <Text style={{ fontSize: 14, color: themedColors.text.tertiary, marginHorizontal: 8 }}>
                  •
                </Text>
                <Text style={{ fontSize: 14, color: themedColors.text.secondary }}>
                  {item.wordCount} words
                </Text>
              </>
            )}
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 12,
                backgroundColor: getStatusBgColor(item.status),
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: getStatusColor(item.status),
                  textTransform: 'capitalize',
                }}
              >
                {item.status}
              </Text>
            </View>
            
            {item.consultant && (
              <Text style={{ fontSize: 12, color: themedColors.text.secondary }}>
                Reviewed by {item.consultant}
              </Text>
            )}
          </View>
        </View>
        
        <TouchableOpacity
          style={{
            width: 36,
            height: 36,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 8,
          }}
          onPress={() => Alert.alert('Options', 'Share, Download, Delete')}
        >
          <Feather name="more-vertical" size={20} color={themedColors.text.secondary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: themedColors.background.default }}>
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          {/* Header */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 8,
              borderBottomWidth: 1,
              borderBottomColor: themedColors.border.default,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: '700',
                  color: themedColors.text.primary,
                }}
              >
                Documents
              </Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: primaryColors.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...(isDark && {
                      shadowColor: colors.primary[500],
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                    }),
                  }}
                  onPress={() => Alert.alert('Upload', 'Opens document picker')}
                >
                  <Feather name="plus" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: themedColors.surface.raised,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: themedColors.border.default,
                  }}
                >
                  <Feather name="x" size={20} color={themedColors.text.secondary} />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Search Bar */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: themedColors.surface.sunken,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderWidth: 1,
                borderColor: themedColors.border.light,
                marginBottom: 16,
              }}
            >
              <Feather name="search" size={20} color={themedColors.text.secondary} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search documents..."
                placeholderTextColor={themedColors.text.tertiary}
                style={{
                  flex: 1,
                  marginLeft: 12,
                  fontSize: 16,
                  color: themedColors.text.primary,
                }}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Feather name="x-circle" size={20} color={themedColors.text.secondary} />
                </TouchableOpacity>
              )}
            </View>
            
            {/* Filters */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -20 }}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
            >
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  onPress={() => setSelectedFilter(filter.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: selectedFilter === filter.id
                      ? primaryColors.primary
                      : themedColors.surface.raised,
                    borderWidth: 1,
                    borderColor: selectedFilter === filter.id
                      ? primaryColors.primary
                      : themedColors.border.default,
                    marginRight: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: selectedFilter === filter.id
                        ? '#FFFFFF'
                        : themedColors.text.primary,
                      marginRight: 6,
                    }}
                  >
                    {filter.label}
                  </Text>
                  <View
                    style={{
                      backgroundColor: selectedFilter === filter.id
                        ? 'rgba(255, 255, 255, 0.2)'
                        : isDark ? colors.gray[700] : colors.gray[200],
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '600',
                        color: selectedFilter === filter.id
                          ? '#FFFFFF'
                          : themedColors.text.secondary,
                      }}
                    >
                      {filter.count}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          {/* Documents List */}
          <FlatList
            data={filteredDocuments}
            renderItem={renderDocument}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 32,
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', paddingTop: 48 }}>
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: isDark ? colors.gray[800] : colors.gray[100],
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Feather name="file-text" size={32} color={themedColors.text.tertiary} />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '600', color: themedColors.text.primary, marginBottom: 8 }}>
                  No documents found
                </Text>
                <Text style={{ fontSize: 14, color: themedColors.text.secondary, textAlign: 'center', paddingHorizontal: 32 }}>
                  {searchQuery ? `No results for "${searchQuery}"` : 'Upload your first document to get started'}
                </Text>
              </View>
            }
          />
          
          {/* Storage Info Bar */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 16,
              borderTopWidth: 1,
              borderTopColor: themedColors.border.default,
              backgroundColor: themedColors.surface.raised,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: themedColors.text.secondary }}>
                Storage Used
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: themedColors.text.primary }}>
                12.4 MB / 100 MB
              </Text>
            </View>
            <View
              style={{
                height: 4,
                backgroundColor: isDark ? colors.gray[800] : colors.gray[200],
                borderRadius: 2,
                marginTop: 8,
                overflow: 'hidden',
              }}
            >
              <MotiView
                style={{
                  height: '100%',
                  backgroundColor: primaryColors.primary,
                  borderRadius: 2,
                }}
                from={{ width: '0%' }}
                animate={{ width: '12.4%' }}
                transition={{ type: 'timing', duration: 1000 }}
              />
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  )
}