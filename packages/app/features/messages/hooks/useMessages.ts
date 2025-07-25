import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../../../../lib/supabase'
import { getCurrentUser } from '../../../../../lib/auth-helpers'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  attachments?: any[]
  is_read: boolean
  read_at?: Date
  is_edited: boolean
  edited_at?: Date
  created_at: Date
  sender?: {
    id: string
    name: string
    profile_image_url?: string
    user_type: string
  }
}

interface UseMessagesParams {
  conversationId: string
  onNewMessage?: (message: Message) => void
}

export function useMessages({ conversationId, onNewMessage }: UseMessagesParams) {
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const channelRef = useRef<any>(null)

  useEffect(() => {
    getCurrentUser().then(userData => {
      if (userData) {
        setUser(userData)
      } else {
        setLoading(false)
      }
    })
  }, [])

  useEffect(() => {
    if (!conversationId || !user?.id) {
      return
    }

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            sender:users!sender_id (
              id,
              user_type
            )
          `)
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true })

        if (error) throw error

        // Get sender names based on user type
        const messagesWithSenders = await Promise.all(
          (data || []).map(async (msg) => {
            let senderData = { ...msg.sender[0] }
            
            if (msg.sender[0].user_type === 'student') {
              const { data: student } = await supabase
                .from('students')
                .select('name, profile_image_url')
                .eq('id', msg.sender_id)
                .single()
              senderData = { ...senderData, ...student }
            } else {
              const { data: consultant } = await supabase
                .from('consultants')
                .select('name, profile_image_url')
                .eq('id', msg.sender_id)
                .single()
              senderData = { ...senderData, ...consultant }
            }

            return {
              ...msg,
              created_at: new Date(msg.created_at),
              read_at: msg.read_at ? new Date(msg.read_at) : undefined,
              edited_at: msg.edited_at ? new Date(msg.edited_at) : undefined,
              sender: senderData
            }
          })
        )

        setMessages(messagesWithSenders)

        // Mark messages as read
        markMessagesAsRead(data || [])
      } catch (err) {
        console.error('Error fetching messages:', err)
        setError(err.message || 'Failed to load messages')
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()

    // Set up real-time subscription
    channelRef.current = supabase
      .channel(`messages-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        async (payload: RealtimePostgresChangesPayload<any>) => {
          // Fetch the complete message with sender info
          const { data: newMessage } = await supabase
            .from('messages')
            .select(`
              *,
              sender:users!sender_id (
                id,
                user_type
              )
            `)
            .eq('id', payload.new.id)
            .single()

          if (newMessage) {
            // Get sender name
            let senderData = { ...newMessage.sender[0] }
            
            if (newMessage.sender[0].user_type === 'student') {
              const { data: student } = await supabase
                .from('students')
                .select('name, profile_image_url')
                .eq('id', newMessage.sender_id)
                .single()
              senderData = { ...senderData, ...student }
            } else {
              const { data: consultant } = await supabase
                .from('consultants')
                .select('name, profile_image_url')
                .eq('id', newMessage.sender_id)
                .single()
              senderData = { ...senderData, ...consultant }
            }

            const completeMessage = {
              ...newMessage,
              created_at: new Date(newMessage.created_at),
              sender: senderData
            }

            setMessages(prev => [...prev, completeMessage])
            onNewMessage?.(completeMessage)

            // Mark as read if from other user
            if (newMessage.sender_id !== user?.id) {
              markMessagesAsRead([newMessage])
            }
          }
        }
      )
      .subscribe()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [conversationId, user?.id, onNewMessage])

  const markMessagesAsRead = async (messagesToMark: any[]) => {
    const unreadMessages = messagesToMark.filter(
      msg => !msg.is_read && msg.sender_id !== user?.id
    )

    if (unreadMessages.length === 0) return

    try {
      await supabase
        .from('messages')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .in('id', unreadMessages.map(m => m.id))

      // Update conversation unread count
      const { data: conversation } = await supabase
        .from('conversations')
        .select('student_id')
        .eq('id', conversationId)
        .single()

      if (conversation) {
        const isStudent = conversation.student_id === user?.id
        await supabase
          .from('conversations')
          .update({
            [isStudent ? 'student_unread_count' : 'consultant_unread_count']: 0
          })
          .eq('id', conversationId)
      }
    } catch (err) {
      console.error('Error marking messages as read:', err)
    }
  }

  const sendMessage = async (content: string, attachments?: any[]) => {
    if (!content.trim() || !user?.id) return

    setSending(true)
    try {
      // Insert message
      const { data: newMessage, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim(),
          attachments: attachments || []
        })
        .select()
        .single()

      if (error) throw error

      // Update conversation
      const { data: conversation } = await supabase
        .from('conversations')
        .select('student_id')
        .eq('id', conversationId)
        .single()

      if (conversation) {
        const isStudent = conversation.student_id === user.id
        
        // First fetch current unread count
        const { data: currentConv } = await supabase
          .from('conversations')
          .select(isStudent ? 'consultant_unread_count' : 'student_unread_count')
          .eq('id', conversationId)
          .single()
        
        const currentCount = currentConv?.[isStudent ? 'consultant_unread_count' : 'student_unread_count'] || 0
        
        await supabase
          .from('conversations')
          .update({
            last_message_at: new Date().toISOString(),
            last_message_preview: content.trim().substring(0, 100),
            [isStudent ? 'consultant_unread_count' : 'student_unread_count']: currentCount + 1
          })
          .eq('id', conversationId)
      }

      return newMessage
    } catch (err) {
      console.error('Error sending message:', err)
      throw err
    } finally {
      setSending(false)
    }
  }

  return {
    messages,
    loading,
    error,
    sending,
    sendMessage
  }
}