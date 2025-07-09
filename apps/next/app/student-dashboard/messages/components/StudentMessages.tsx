"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../../../../lib/supabase'
import { useRouter } from 'next/navigation'

// Helper functions
const getTimeAgo = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

const getCategoryIcon = (category: string) => {
  const icons = {
    essay: '📝',
    sat: '📊',
    act: '📈',
    interview: '🎤',
    strategy: '🎯',
    scholarship: '💰',
    other: '📚'
  }
  return icons[category as keyof typeof icons] || '📚'
}

const getCategoryColor = (category: string) => {
  const colors = {
    essay: 'bg-blue-500',
    sat: 'bg-green-500',
    act: 'bg-purple-500',
    interview: 'bg-orange-500',
    strategy: 'bg-cyan-500',
    scholarship: 'bg-yellow-500',
    other: 'bg-gray-500'
  }
  return colors[category as keyof typeof colors] || 'bg-gray-500'
}

// Types
interface Conversation {
  id: string
  consultant_id: string
  consultant_name: string
  consultant_avatar?: string
  is_verified: boolean
  service_type: string
  service_category: string
  last_message: string
  last_message_time: Date
  unread_count: number
  status: 'active' | 'archived'
  university?: string
}

interface Message {
  id: string
  conversation_id: string
  sender_id: string
  sender_type: 'student' | 'consultant'
  content: string
  created_at: Date
  is_read: boolean
  attachments?: any[]
}

// Components
const ConversationCard = ({ 
  conversation, 
  isSelected, 
  onClick 
}: { 
  conversation: Conversation
  isSelected: boolean
  onClick: () => void
}) => {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      onClick={onClick}
      className={`relative p-4 cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'bg-gradient-to-r from-proofr-cyan/10 to-blue-500/10 border-l-4 border-proofr-cyan' 
          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-proofr-cyan to-blue-500 flex items-center justify-center text-white font-semibold">
            {conversation.consultant_avatar || conversation.consultant_name.charAt(0).toUpperCase()}
          </div>
          {/* Verified badge */}
          {conversation.is_verified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {conversation.consultant_name}
              </h3>
              {conversation.university && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {conversation.university}
                </p>
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
              {getTimeAgo(conversation.last_message_time)}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-white rounded-full ${getCategoryColor(conversation.service_category)}`}>
              <span>{getCategoryIcon(conversation.service_category)}</span>
              {conversation.service_type}
            </span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {conversation.last_message}
          </p>

          {/* Unread badge */}
          {conversation.unread_count > 0 && (
            <div className="mt-2">
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-proofr-cyan rounded-full">
                {conversation.unread_count}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

const MessageBubble = ({ message, isOwn }: { message: Message, isOwn: boolean }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
        <div className={`px-4 py-3 rounded-2xl ${
          isOwn 
            ? 'bg-gradient-to-r from-proofr-cyan to-blue-500 text-white' 
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className={`mt-2 space-y-2`}>
              {message.attachments.map((attachment: any, index: number) => (
                <div key={index} className={`p-2 rounded-lg ${
                  isOwn ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-medium truncate">
                      {attachment.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className={`flex items-center gap-2 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isOwn && message.is_read && (
            <span className="text-xs text-proofr-cyan">✓✓</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function StudentMessages() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  
  const router = useRouter()

  // Load user and conversations
  useEffect(() => {
    loadConversations()
    
    // Set up real-time subscriptions
    const conversationChannel = supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `student_id=eq.${currentUser?.id}`
        },
        () => {
          loadConversations()
        }
      )
      .subscribe()

    return () => {
      conversationChannel.unsubscribe()
    }
  }, [currentUser])

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation)
      
      // Set up real-time subscription for messages
      const messageChannel = supabase
        .channel(`messages:${selectedConversation}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${selectedConversation}`
          },
          (payload) => {
            setMessages(prev => [...prev, payload.new as Message])
          }
        )
        .subscribe()

      return () => {
        messageChannel.unsubscribe()
      }
    }
  }, [selectedConversation])

  const loadConversations = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setCurrentUser(user)

      // Mock data for now - replace with actual Supabase query
      const mockConversations: Conversation[] = [
        {
          id: '1',
          consultant_id: 'consultant-1',
          consultant_name: 'Sarah Chen',
          is_verified: true,
          service_type: 'Common App Essay Review',
          service_category: 'essay',
          last_message: 'I\'ve reviewed your essay draft and left detailed feedback...',
          last_message_time: new Date(Date.now() - 30 * 60 * 1000),
          unread_count: 2,
          status: 'active',
          university: 'Harvard University'
        },
        {
          id: '2',
          consultant_id: 'consultant-2',
          consultant_name: 'Michael Park',
          is_verified: true,
          service_type: 'SAT Math Tutoring',
          service_category: 'sat',
          last_message: 'Great job on the practice problems! Let\'s review...',
          last_message_time: new Date(Date.now() - 2 * 60 * 60 * 1000),
          unread_count: 0,
          status: 'active',
          university: 'MIT'
        },
        {
          id: '3',
          consultant_id: 'consultant-3',
          consultant_name: 'Emily Rodriguez',
          is_verified: false,
          service_type: 'Interview Preparation',
          service_category: 'interview',
          last_message: 'Here are some common interview questions we should practice',
          last_message_time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          unread_count: 1,
          status: 'active',
          university: 'Stanford University'
        }
      ]

      setConversations(mockConversations)
      setLoading(false)
    } catch (error) {
      console.error('Error loading conversations:', error)
      setLoading(false)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      // Mock data for now - replace with actual Supabase query
      const mockMessages: Message[] = [
        {
          id: '1',
          conversation_id: conversationId,
          sender_id: 'consultant-1',
          sender_type: 'consultant',
          content: 'Hi! I\'ve received your essay draft. Let me take a look and provide feedback.',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
          is_read: true
        },
        {
          id: '2',
          conversation_id: conversationId,
          sender_id: currentUser?.id || '',
          sender_type: 'student',
          content: 'Thank you so much! I\'m particularly worried about the introduction - does it grab attention?',
          created_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
          is_read: true
        },
        {
          id: '3',
          conversation_id: conversationId,
          sender_id: 'consultant-1',
          sender_type: 'consultant',
          content: 'I\'ve reviewed your essay draft and left detailed feedback. Your introduction is good but could be stronger. I suggest starting with a more vivid scene that shows your passion for computer science rather than telling it.',
          created_at: new Date(Date.now() - 30 * 60 * 1000),
          is_read: false,
          attachments: [{ name: 'Essay_Feedback_v1.docx', type: 'document' }]
        }
      ]

      setMessages(mockMessages)
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !currentUser) return

    try {
      const tempMessage: Message = {
        id: Date.now().toString(),
        conversation_id: selectedConversation,
        sender_id: currentUser.id,
        sender_type: 'student',
        content: newMessage,
        created_at: new Date(),
        is_read: false
      }

      // Optimistically add message
      setMessages(prev => [...prev, tempMessage])
      setNewMessage('')

      // TODO: Send to Supabase
      // const { error } = await supabase
      //   .from('messages')
      //   .insert({
      //     conversation_id: selectedConversation,
      //     sender_id: currentUser.id,
      //     content: newMessage
      //   })
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const selectedConv = conversations.find(c => c.id === selectedConversation)

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Conversations Sidebar */}
      <div className="w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Messages
            </h1>
            <button 
              onClick={() => router.push('/student-dashboard')}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-proofr-cyan"
            />
            <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-proofr-cyan mx-auto"></div>
            </div>
          ) : (
            <AnimatePresence>
              {conversations.map((conversation) => (
                <ConversationCard
                  key={conversation.id}
                  conversation={conversation}
                  isSelected={selectedConversation === conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                />
              ))}
            </AnimatePresence>
          )}
          
          {!loading && conversations.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-lg font-medium mb-2">No conversations yet</p>
              <p className="text-sm">Start browsing consultants to begin your journey!</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-proofr-cyan to-blue-500 flex items-center justify-center text-white font-semibold">
                      {selectedConv.consultant_avatar || selectedConv.consultant_name.charAt(0).toUpperCase()}
                    </div>
                    {selectedConv.is_verified && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      {selectedConv.consultant_name}
                      {selectedConv.is_verified && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">Verified</span>
                      )}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedConv.university} • {selectedConv.service_type}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
              <div className="max-w-4xl mx-auto">
                {/* Service info banner */}
                <div className="mb-6 p-4 bg-gradient-to-r from-proofr-cyan/10 to-blue-500/10 rounded-xl border border-proofr-cyan/20">
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${getCategoryColor(selectedConv.service_category)} text-white`}>
                      {getCategoryIcon(selectedConv.service_category)}
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {selectedConv.service_type}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Active service with {selectedConv.consultant_name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.sender_id === currentUser?.id}
                  />
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span>{selectedConv.consultant_name} is typing...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-end gap-3">
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-proofr-cyan text-gray-900 dark:text-white placeholder-gray-500"
                    rows={1}
                  />
                </div>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`p-3 rounded-xl transition-all ${
                    newMessage.trim()
                      ? 'bg-gradient-to-r from-proofr-cyan to-blue-500 text-white shadow-lg shadow-proofr-cyan/25'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-800">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-proofr-cyan/20 to-blue-500/20 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-proofr-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Your Messages
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Select a conversation from the sidebar to continue chatting with your consultants.
              </p>
              
              {/* Quick actions */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/student-dashboard')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-proofr-cyan to-blue-500 text-white rounded-xl font-medium shadow-lg shadow-proofr-cyan/25"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse Consultants
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}