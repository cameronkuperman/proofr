"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../../../../lib/supabase'
import { useRouter } from 'next/navigation'
import { LogoutButton } from '../../../../../../lib/components/LogoutButton'
import { useConversations } from '../../../../../../packages/app/features/messages/hooks/useConversations'
import { useMessages, type Message } from '../../../../../../packages/app/features/messages/hooks/useMessages'

// Helper functions
const getTimeAgo = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const getCategoryGradient = (category: string) => {
  const gradients = {
    essay: 'from-blue-400 to-blue-600',
    sat: 'from-emerald-400 to-emerald-600',
    act: 'from-purple-400 to-purple-600',
    interview: 'from-orange-400 to-orange-600',
    strategy: 'from-cyan-400 to-cyan-600',
    scholarship: 'from-yellow-400 to-yellow-600',
    other: 'from-gray-400 to-gray-600'
  }
  return gradients[category as keyof typeof gradients] || gradients.other
}

// Types  
type Conversation = {
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
  is_online?: boolean
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
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ x: 8, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`relative p-4 cursor-pointer transition-all duration-300 group ${
        isSelected 
          ? 'bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-700/30' 
          : 'hover:bg-gray-50/70 dark:hover:bg-gray-800/30'
      }`}
    >
      {/* Active indicator */}
      <motion.div 
        className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-proofr-cyan to-blue-500 ${
          isSelected ? 'opacity-100' : 'opacity-0'
        }`}
        initial={false}
        animate={{ opacity: isSelected ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      <div className="flex items-start gap-3.5">
        {/* Avatar with online status */}
        <div className="relative">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative w-12 h-12 rounded-2xl bg-gradient-to-br overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(conversation.service_category)} opacity-90`} />
            <div className="absolute inset-0 flex items-center justify-center text-white font-medium text-lg">
              {conversation.consultant_avatar || conversation.consultant_name.charAt(0).toUpperCase()}
            </div>
          </motion.div>
          
          {/* Online indicator */}
          {conversation.is_online && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-3 border-white dark:border-gray-900"
            >
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
            </motion.div>
          )}
          
          {/* Verified badge */}
          {conversation.is_verified && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-white dark:bg-gray-800 rounded-full shadow-sm flex items-center justify-center"
            >
              <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between mb-1">
            <h3 className={`font-semibold truncate transition-colors ${
              isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-100'
            }`}>
              {conversation.consultant_name}
            </h3>
            <span className={`text-xs ml-2 transition-opacity ${
              conversation.unread_count > 0 ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'
            }`}>
              {getTimeAgo(conversation.last_message_time)}
            </span>
          </div>

          {conversation.university && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 font-medium">
              {conversation.university}
            </p>
          )}

          <p className={`text-sm truncate mb-2 transition-all ${
            conversation.unread_count > 0 
              ? 'text-gray-800 dark:text-gray-100 font-medium' 
              : 'text-gray-600 dark:text-gray-400'
          }`}>
            {conversation.last_message}
          </p>

          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
              isSelected 
                ? 'bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}>
              {conversation.service_type}
            </span>

            {/* Unread badge */}
            {conversation.unread_count > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-gradient-to-r from-proofr-cyan to-blue-500 rounded-full shadow-sm"
              >
                {conversation.unread_count}
              </motion.span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const MessageBubble = ({ message, isOwn }: { message: Message, isOwn: boolean }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-6 group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className={`relative px-5 py-3.5 rounded-2xl shadow-sm transition-all ${
            isOwn 
              ? 'bg-gradient-to-br from-proofr-cyan to-blue-500 text-white rounded-br-sm' 
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-sm border border-gray-100 dark:border-gray-700'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.attachments.map((attachment: any, index: number) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    isOwn 
                      ? 'bg-white/20 hover:bg-white/30' 
                      : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isOwn ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'}`}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm5 2a1 1 0 00-1 1v6a1 1 0 102 0V7a1 1 0 00-1-1zm3 0a1 1 0 00-1 1v6a1 1 0 102 0V7a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{attachment.name}</p>
                      <p className={`text-xs mt-0.5 ${isOwn ? 'text-white/70' : 'text-gray-500'}`}>
                        {attachment.size || '2.4 MB'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
        
        {/* Message metadata */}
        <div className={`flex items-center gap-2 mt-1.5 px-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
          <AnimatePresence>
            {isHovered && (
              <motion.span 
                initial={{ opacity: 0, x: isOwn ? 10 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isOwn ? 10 : -10 }}
                className="text-xs text-gray-400 dark:text-gray-500"
              >
                {new Date(message.created_at).toLocaleTimeString([], { 
                  hour: 'numeric', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </motion.span>
            )}
          </AnimatePresence>
          
          {isOwn && (
            <motion.div className="flex items-center gap-0.5">
              <svg className={`w-4 h-4 transition-colors ${message.is_read ? 'text-blue-400' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {message.is_read && (
                <svg className="w-4 h-4 text-blue-400 -ml-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function StudentMessages() {
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Use real hooks for conversations
  const { conversations: dbConversations, loading: convLoading, error: convError } = useConversations()
  
  // Use real hook for messages when a conversation is selected
  const { messages, loading: msgLoading, sendMessage, sending } = useMessages({
    conversationId: selectedConversation || '',
    onNewMessage: () => scrollToBottom()
  })

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load user
  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setCurrentUser(user)
    } catch (error) {
      console.error('Error loading user:', error)
    }
  }

  // Helper function to get service category
  const getServiceCategory = (serviceType?: string): string => {
    if (!serviceType) return 'other'
    const type = serviceType.toLowerCase()
    if (type.includes('essay')) return 'essay'
    if (type.includes('sat')) return 'sat'
    if (type.includes('act')) return 'act'
    if (type.includes('interview')) return 'interview'
    if (type.includes('strategy')) return 'strategy'
    if (type.includes('scholarship')) return 'scholarship'
    return 'other'
  }

  // Transform database conversations to UI format
  const conversations: Conversation[] = dbConversations.map(conv => ({
    id: conv.id,
    consultant_id: conv.consultant_id,
    consultant_name: conv.consultant?.name || 'Consultant',
    consultant_avatar: conv.consultant?.profile_image_url,
    is_verified: conv.consultant?.verification_status === 'approved',
    service_type: conv.booking?.service?.title || 'Service',
    service_category: getServiceCategory(conv.booking?.service?.service_type),
    last_message: conv.last_message_preview || 'Start a conversation',
    last_message_time: conv.last_message_at,
    unread_count: conv.student_unread_count,
    status: conv.is_archived ? 'archived' : 'active',
    university: conv.consultant?.current_college,
    is_online: false // Would need to implement online status
  }))
  
  const unreadTotal = conversations.reduce((sum, conv) => sum + conv.unread_count, 0)
  const loading = convLoading

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !currentUser) return

    try {
      await sendMessage(newMessage.trim())
      setNewMessage('')
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const filteredConversations = conversations.filter(conv => 
    searchQuery === '' || 
    conv.consultant_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.service_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.university?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedConv = conversations.find(c => c.id === selectedConversation)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Back Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/student-dashboard')}
                className="p-2 -ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Messages
              </h1>
            </div>

            {/* Right Nav */}
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>
              <LogoutButton className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                Sign out
              </LogoutButton>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Conversations Sidebar */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col"
        >
          {/* Search and Stats */}
          <div className="p-6 space-y-4">
            {/* Search bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-proofr-cyan/50 focus:bg-white dark:focus:bg-gray-700 transition-all"
              />
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-3 rounded-xl text-center cursor-pointer"
              >
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{conversations.length}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">Active</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 p-3 rounded-xl text-center cursor-pointer"
              >
                <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{unreadTotal}</p>
                <p className="text-xs text-cyan-700 dark:text-cyan-300 font-medium">Unread</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-3 rounded-xl text-center cursor-pointer"
              >
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</p>
                <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">Online</p>
              </motion.div>
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-3 border-gray-300 border-t-proofr-cyan rounded-full"
                />
              </div>
            ) : (
              <AnimatePresence>
                {filteredConversations.map((conversation, index) => (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ConversationCard
                      conversation={conversation}
                      isSelected={selectedConversation === conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            
            {convError && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center"
              >
                <p className="text-red-500 text-sm mb-2">Error loading conversations</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">{convError}</p>
              </motion.div>
            )}
            
            {!loading && !convError && filteredConversations.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {searchQuery ? 'No conversations found' : 'No messages yet'}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getCategoryGradient(selectedConv.service_category)} flex items-center justify-center text-white font-medium text-lg`}>
                        {selectedConv.consultant_avatar || selectedConv.consultant_name.charAt(0).toUpperCase()}
                      </div>
                      {selectedConv.is_online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-3 border-white dark:border-gray-800" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-gray-900 dark:text-white">
                          {selectedConv.consultant_name}
                        </h2>
                        {selectedConv.is_verified && (
                          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedConv.university} • {selectedConv.is_online ? 'Active now' : `Active ${getTimeAgo(selectedConv.last_message_time)} ago`}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <div className="max-w-4xl mx-auto">
                  {msgLoading && (
                    <div className="flex items-center justify-center h-32">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-3 border-gray-300 border-t-proofr-cyan rounded-full"
                      />
                    </div>
                  )}
                  {/* Service context */}
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-8 p-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700/50 rounded-2xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getCategoryGradient(selectedConv.service_category)} flex items-center justify-center text-white`}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {selectedConv.service_type}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                          Service with {selectedConv.consultant_name} • Started 2 days ago
                        </p>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-700 rounded-xl shadow-sm hover:shadow transition-all"
                      >
                        View Details
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Messages */}
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <MessageBubble
                          message={message}
                          isOwn={message.sender_id === currentUser?.id}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing indicator */}
                  <AnimatePresence>
                    {isTyping && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center gap-3 text-gray-500 dark:text-gray-400"
                      >
                        <div className="flex items-center gap-1.5 bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm border border-gray-100 dark:border-gray-700">
                          <motion.span 
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                          <motion.span 
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                          <motion.span 
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4"
              >
                <div className="flex items-end gap-4">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </motion.button>
                  
                  <div className="flex-1 relative">
                    <textarea
                      ref={textareaRef}
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value)
                        // Auto-resize textarea
                        e.target.style.height = 'auto'
                        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      placeholder="Type your message..."
                      className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-700/50 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-proofr-cyan/50 focus:bg-white dark:focus:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 transition-all"
                      rows={1}
                      style={{ maxHeight: '120px' }}
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sending}
                    className={`p-3 rounded-2xl transition-all flex items-center justify-center ${
                      newMessage.trim()
                        ? 'bg-gradient-to-r from-proofr-cyan to-blue-500 text-white shadow-lg shadow-proofr-cyan/25 hover:shadow-xl'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            </>
          ) : (
            /* Empty state */
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex items-center justify-center"
            >
              <div className="text-center max-w-md">
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-3xl flex items-center justify-center"
                >
                  <svg className="w-16 h-16 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </motion.div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  Select a conversation
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                  Choose a consultant from the sidebar to continue your conversation
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/student-dashboard')}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-proofr-cyan to-blue-500 text-white rounded-xl font-medium shadow-lg shadow-proofr-cyan/25 hover:shadow-xl transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Browse Consultants
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}