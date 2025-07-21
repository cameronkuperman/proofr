import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { GuideComment } from '../types'
import { supabase } from '../../../../../lib/supabase'

interface CommentSectionProps {
  guideId: string
  currentUserId: string
}

export function CommentSection({ guideId, currentUserId }: CommentSectionProps) {
  const [comments, setComments] = useState<GuideComment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  useEffect(() => {
    loadComments()
  }, [guideId])

  const loadComments = async () => {
    try {
      const { data, error } = await supabase
        .from('guide_comments')
        .select(`
          *,
          author:user_id(id, email),
          replies:guide_comments!parent_comment_id(
            *,
            author:user_id(id, email)
          )
        `)
        .eq('guide_id', guideId)
        .is('parent_comment_id', null)
        .eq('hidden', false)
        .order('created_at', { ascending: false })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const submitComment = async (parentId?: string) => {
    const content = newComment.trim()
    if (!content) return

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('guide_comments')
        .insert({
          guide_id: guideId,
          user_id: currentUserId,
          content,
          parent_comment_id: parentId || null,
          is_question: content.includes('?')
        })

      if (error) throw error

      setNewComment('')
      setReplyingTo(null)
      loadComments()
      Alert.alert('Success', 'Comment posted!')
    } catch (error) {
      Alert.alert('Error', 'Failed to post comment')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleHelpful = async (commentId: string, currentCount: number) => {
    try {
      // In a real app, track who marked as helpful to prevent duplicates
      const { error } = await supabase
        .from('guide_comments')
        .update({ helpful_count: currentCount + 1 })
        .eq('id', commentId)

      if (!error) {
        loadComments()
      }
    } catch (error) {
      console.error('Error updating helpful count:', error)
    }
  }

  const renderComment = ({ item, isReply = false }: { item: GuideComment; isReply?: boolean }) => {
    const authorEmail = item.author?.email || 'Anonymous'
    const authorName = authorEmail.split('@')[0]
    
    return (
      <View style={{
        marginLeft: isReply ? 48 : 0,
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: isReply ? 0 : 1,
        borderBottomColor: '#E5E7EB'
      }}>
        {/* Comment Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <View style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: '#E5E7EB',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8
          }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#6B7280' }}>
              {authorName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827' }}>
              {authorName}
            </Text>
            <Text style={{ fontSize: 12, color: '#6B7280' }}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
          {item.is_question && (
            <View style={{
              backgroundColor: '#DBEAFE',
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 10
            }}>
              <Text style={{ fontSize: 11, color: '#1E40AF', fontWeight: '600' }}>
                Question
              </Text>
            </View>
          )}
        </View>

        {/* Comment Content */}
        <Text style={{ 
          fontSize: 15, 
          color: '#374151', 
          lineHeight: 22,
          marginBottom: 8,
          marginLeft: 40
        }}>
          {item.content}
        </Text>

        {/* Comment Actions */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 40, gap: 16 }}>
          <TouchableOpacity
            onPress={() => toggleHelpful(item.id, item.helpful_count)}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Feather name="thumbs-up" size={14} color="#6B7280" />
            <Text style={{ fontSize: 12, color: '#6B7280', marginLeft: 4 }}>
              {item.helpful_count > 0 ? `Helpful (${item.helpful_count})` : 'Helpful'}
            </Text>
          </TouchableOpacity>
          
          {!isReply && (
            <TouchableOpacity
              onPress={() => setReplyingTo(item.id)}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Feather name="message-circle" size={14} color="#6B7280" />
              <Text style={{ fontSize: 12, color: '#6B7280', marginLeft: 4 }}>
                Reply
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Replies */}
        {item.replies && item.replies.length > 0 && (
          <View style={{ marginTop: 12 }}>
            {item.replies.map(reply => (
              <View key={reply.id}>
                {renderComment({ item: reply, isReply: true })}
              </View>
            ))}
          </View>
        )}

        {/* Reply Input */}
        {replyingTo === item.id && (
          <View style={{ marginTop: 12, marginLeft: 40 }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 8,
              padding: 8,
              backgroundColor: '#F9FAFB'
            }}>
              <TextInput
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Write a reply..."
                placeholderTextColor="#9CA3AF"
                multiline
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: '#111827',
                  minHeight: 60,
                  textAlignVertical: 'top'
                }}
              />
              <TouchableOpacity
                onPress={() => submitComment(item.id)}
                disabled={submitting || !newComment.trim()}
                style={{
                  marginLeft: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  backgroundColor: submitting || !newComment.trim() ? '#9CA3AF' : '#059669',
                  borderRadius: 6
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }}>
                  Reply
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => {
                setReplyingTo(null)
                setNewComment('')
              }}
              style={{ marginTop: 4 }}
            >
              <Text style={{ fontSize: 12, color: '#6B7280' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }

  if (loading) {
    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <Text style={{ color: '#6B7280' }}>Loading comments...</Text>
      </View>
    )
  }

  return (
    <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
      {/* New Comment Input */}
      {!replyingTo && (
        <View style={{
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#E5E7EB',
          borderRadius: 8,
          padding: 12,
          backgroundColor: '#FFFFFF'
        }}>
          <TextInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Share your thoughts or ask a question..."
            placeholderTextColor="#9CA3AF"
            multiline
            style={{
              fontSize: 15,
              color: '#111827',
              minHeight: 80,
              textAlignVertical: 'top'
            }}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
            <TouchableOpacity
              onPress={() => submitComment()}
              disabled={submitting || !newComment.trim()}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                backgroundColor: submitting || !newComment.trim() ? '#9CA3AF' : '#059669',
                borderRadius: 6
              }}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '600' }}>
                {submitting ? 'Posting...' : 'Post Comment'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <View style={{ alignItems: 'center', paddingVertical: 32 }}>
          <Feather name="message-circle" size={48} color="#E5E7EB" />
          <Text style={{ fontSize: 16, color: '#6B7280', marginTop: 12 }}>
            No comments yet
          </Text>
          <Text style={{ fontSize: 14, color: '#9CA3AF', marginTop: 4 }}>
            Be the first to share your thoughts!
          </Text>
        </View>
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderComment({ item })}
          scrollEnabled={false}
        />
      )}
    </View>
  )
}