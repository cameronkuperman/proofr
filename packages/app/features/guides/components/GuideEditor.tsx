import React, { useState, useRef, useEffect } from 'react'
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native'
import { GuideCategory, GuideDifficulty, CreateGuideInput } from '../types'

interface GuideEditorProps {
  initialData?: Partial<CreateGuideInput>
  onSave: (data: CreateGuideInput) => Promise<void>
  onCancel: () => void
  isEdit?: boolean
}

export function GuideEditor({ initialData, onSave, onCancel, isEdit = false }: GuideEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [category, setCategory] = useState<GuideCategory>(initialData?.category || GuideCategory.Other)
  const [difficulty, setDifficulty] = useState<GuideDifficulty>(initialData?.difficulty || GuideDifficulty.Beginner)
  const [content, setContent] = useState(initialData?.content?.sections?.[0]?.content || '')
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || !content.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      const guideData: CreateGuideInput = {
        title: title.trim(),
        description: description.trim(),
        category,
        difficulty,
        content: {
          sections: [{
            id: '1',
            type: 'text',
            content: content.trim(),
            order: 0
          }],
          summary: description.trim(),
          prerequisites: [],
          learning_objectives: [],
          estimated_time: Math.ceil(content.split(' ').length / 200) // Rough estimate
        },
        tags,
        meta_description: description.trim().substring(0, 160)
      }

      await onSave(guideData)
    } catch (error) {
      Alert.alert('Error', 'Failed to save guide. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const categoryOptions = [
    { value: GuideCategory.Essays, label: 'Essays' },
    { value: GuideCategory.Interviews, label: 'Interviews' },
    { value: GuideCategory.TestPrep, label: 'Test Prep' },
    { value: GuideCategory.Applications, label: 'Applications' },
    { value: GuideCategory.FinancialAid, label: 'Financial Aid' },
    { value: GuideCategory.Extracurriculars, label: 'Extracurriculars' },
    { value: GuideCategory.Research, label: 'Research' },
    { value: GuideCategory.International, label: 'International' },
    { value: GuideCategory.Transfer, label: 'Transfer' },
    { value: GuideCategory.GapYear, label: 'Gap Year' },
    { value: GuideCategory.Other, label: 'Other' }
  ]

  const difficultyOptions = [
    { value: GuideDifficulty.Beginner, label: 'Beginner', color: '#10B981' },
    { value: GuideDifficulty.Intermediate, label: 'Intermediate', color: '#F59E0B' },
    { value: GuideDifficulty.Advanced, label: 'Advanced', color: '#EF4444' }
  ]

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={{ padding: 20 }}>
        {/* Title */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
            Guide Title *
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., How to Write a Compelling Personal Statement"
            placeholderTextColor="#9CA3AF"
            style={{
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              color: '#111827'
            }}
            maxLength={200}
          />
          <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
            {title.length}/200 characters
          </Text>
        </View>

        {/* Description */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
            Description *
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Brief summary of what students will learn"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
            style={{
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
              color: '#111827',
              minHeight: 80,
              textAlignVertical: 'top'
            }}
          />
        </View>

        {/* Category */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
            Category *
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {categoryOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setCategory(option.value)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: category === option.value ? '#059669' : '#E5E7EB',
                    backgroundColor: category === option.value ? '#ECFDF5' : '#FFFFFF'
                  }}
                >
                  <Text style={{
                    color: category === option.value ? '#059669' : '#6B7280',
                    fontWeight: category === option.value ? '600' : '400'
                  }}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Difficulty */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
            Difficulty Level *
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {difficultyOptions.map(option => (
              <TouchableOpacity
                key={option.value}
                onPress={() => setDifficulty(option.value)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: difficulty === option.value ? option.color : '#E5E7EB',
                  backgroundColor: difficulty === option.value ? option.color + '10' : '#FFFFFF',
                  alignItems: 'center'
                }}
              >
                <Text style={{
                  color: difficulty === option.value ? option.color : '#6B7280',
                  fontWeight: difficulty === option.value ? '600' : '400'
                }}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Content */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
            Guide Content *
          </Text>
          <View style={{
            borderWidth: 1,
            borderColor: '#E5E7EB',
            borderRadius: 8,
            backgroundColor: '#FAFAFA'
          }}>
            <View style={{
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderBottomColor: '#E5E7EB',
              padding: 8
            }}>
              <Text style={{ fontSize: 12, color: '#6B7280' }}>
                Markdown supported: **bold**, *italic*, # Headers, - Lists
              </Text>
            </View>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Write your guide content here..."
              placeholderTextColor="#9CA3AF"
              multiline
              style={{
                padding: 12,
                fontSize: 16,
                color: '#111827',
                minHeight: 300,
                textAlignVertical: 'top'
              }}
            />
          </View>
          <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
            ~{Math.ceil(content.split(' ').length / 200)} min read
          </Text>
        </View>

        {/* Tags */}
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 }}>
            Tags
          </Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#E5E7EB',
            borderRadius: 8,
            padding: 4
          }}>
            <TextInput
              value={tagInput}
              onChangeText={setTagInput}
              placeholder="Add tags..."
              placeholderTextColor="#9CA3AF"
              style={{
                flex: 1,
                padding: 8,
                fontSize: 16,
                color: '#111827'
              }}
              onSubmitEditing={addTag}
              returnKeyType="done"
            />
            <TouchableOpacity
              onPress={addTag}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: '#059669',
                borderRadius: 6,
                marginRight: 4
              }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Add</Text>
            </TouchableOpacity>
          </View>
          {tags.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
              {tags.map(tag => (
                <TouchableOpacity
                  key={tag}
                  onPress={() => removeTag(tag)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#F3F4F6',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                    gap: 4
                  }}
                >
                  <Text style={{ color: '#374151', fontSize: 14 }}>{tag}</Text>
                  <Text style={{ color: '#9CA3AF', fontSize: 12 }}>×</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 32 }}>
          <TouchableOpacity
            onPress={onCancel}
            style={{
              flex: 1,
              paddingVertical: 16,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#E5E7EB',
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#6B7280', fontSize: 16, fontWeight: '600' }}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            style={{
              flex: 1,
              paddingVertical: 16,
              borderRadius: 8,
              backgroundColor: saving ? '#9CA3AF' : '#059669',
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
              {saving ? 'Saving...' : (isEdit ? 'Update' : 'Publish')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}