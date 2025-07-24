import { useEffect, useState } from 'react'
import { supabase } from '../../../../../lib/supabase'
import { useAuthContext } from '../../../contexts/AuthContext'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export interface Conversation {
  id: string
  student_id: string
  consultant_id: string
  booking_id?: string
  last_message_at: Date
  last_message_preview?: string
  student_unread_count: number
  consultant_unread_count: number
  is_archived: boolean
  created_at: Date
  student?: {
    id: string
    name: string
    profile_image_url?: string
  }
  consultant?: {
    id: string
    name: string
    profile_image_url?: string
    current_college: string
    verification_status: string
  }
  booking?: {
    id: string
    service?: {
      title: string
    }
  }
}

export function useConversations() {
  const { user, userType } = useAuthContext()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    const fetchConversations = async () => {
      try {
        const isStudent = userType === 'student'
        
        let query = supabase
          .from('conversations')
          .select(`
            *,
            student:students!student_id (
              id,
              name,
              profile_image_url
            ),
            consultant:consultants!consultant_id (
              id,
              name,
              profile_image_url,
              current_college,
              verification_status
            ),
            booking:bookings!booking_id (
              id,
              service:services!service_id (
                title
              )
            )
          `)
          .eq(isStudent ? 'student_id' : 'consultant_id', user.id)
          .eq('is_archived', false)
          .order('last_message_at', { ascending: false })

        const { data, error } = await query

        if (error) throw error

        // Transform the data to handle dates and nested relationships
        const transformedData = data?.map(conv => ({
          ...conv,
          last_message_at: new Date(conv.last_message_at),
          created_at: new Date(conv.created_at),
          student: conv.student ? conv.student[0] : undefined,
          consultant: conv.consultant ? conv.consultant[0] : undefined,
          booking: conv.booking ? conv.booking[0] : undefined
        })) || []

        setConversations(transformedData)
      } catch (err) {
        console.error('Error fetching conversations:', err)
        setError(err.message || 'Failed to load conversations')
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()

    // Set up real-time subscription
    const channel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: userType === 'student' 
            ? `student_id=eq.${user.id}`
            : `consultant_id=eq.${user.id}`
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          fetchConversations() // Refetch for simplicity
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id, userType])

  const archiveConversation = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ 
          is_archived: true,
          archived_by: user?.id,
          archived_at: new Date().toISOString()
        })
        .eq('id', conversationId)

      if (error) throw error

      // Update local state
      setConversations(prev => prev.filter(c => c.id !== conversationId))
    } catch (err) {
      console.error('Error archiving conversation:', err)
      throw err
    }
  }

  const markAsRead = async (conversationId: string) => {
    try {
      const isStudent = userType === 'student'
      
      const { error } = await supabase
        .from('conversations')
        .update({ 
          [isStudent ? 'student_unread_count' : 'consultant_unread_count']: 0 
        })
        .eq('id', conversationId)

      if (error) throw error

      // Update local state
      setConversations(prev => 
        prev.map(c => 
          c.id === conversationId 
            ? { ...c, [isStudent ? 'student_unread_count' : 'consultant_unread_count']: 0 }
            : c
        )
      )
    } catch (err) {
      console.error('Error marking as read:', err)
      throw err
    }
  }

  const getOrCreateConversation = async (consultantId: string, bookingId?: string) => {
    try {
      // First check if conversation exists
      const { data: existing, error: checkError } = await supabase
        .from('conversations')
        .select('*')
        .eq('student_id', user?.id)
        .eq('consultant_id', consultantId)
        .single()

      if (existing) return existing

      // Create new conversation
      const { data: newConv, error: createError } = await supabase
        .from('conversations')
        .insert({
          student_id: user?.id,
          consultant_id: consultantId,
          booking_id: bookingId
        })
        .select()
        .single()

      if (createError) throw createError

      return newConv
    } catch (err) {
      console.error('Error getting/creating conversation:', err)
      throw err
    }
  }

  return {
    conversations,
    loading,
    error,
    archiveConversation,
    markAsRead,
    getOrCreateConversation
  }
}