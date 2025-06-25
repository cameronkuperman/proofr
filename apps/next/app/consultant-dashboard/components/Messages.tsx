"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Mock data for beautiful UI demonstration
const mockConversations = [
  {
    id: '1',
    studentName: 'Emma Chen',
    studentAvatar: '👩‍🎓',
    serviceType: 'Common App Essay',
    serviceCategory: 'essay',
    lastMessage: 'Thanks for the feedback! I\'ve revised the introduction...',
    lastMessageTime: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
    unreadCount: 2,
    isPremium: true,
    status: 'active',
    targetSchools: ['Harvard', 'Yale', 'Princeton']
  },
  {
    id: '2',
    studentName: 'Marcus Johnson',
    studentAvatar: '👨‍🎓',
    serviceType: 'SAT Math Prep',
    serviceCategory: 'sat',
    lastMessage: 'I completed the practice problems you sent',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    unreadCount: 0,
    isPremium: false,
    status: 'active',
    targetSchools: ['Stanford', 'MIT']
  },
  {
    id: '3',
    studentName: 'Sophia Williams',
    studentAvatar: '👩‍💻',
    serviceType: 'Interview Prep',
    serviceCategory: 'interview',
    lastMessage: 'My Harvard interview is tomorrow!',
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
    unreadCount: 5,
    isPremium: true,
    status: 'urgent',
    targetSchools: ['Harvard', 'MIT']
  },
  {
    id: '4',
    studentName: 'David Park',
    studentAvatar: '🧑‍🎓',
    serviceType: 'UC Essays',
    serviceCategory: 'essay',
    lastMessage: 'You: Great work on the personal insight questions!',
    lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    unreadCount: 0,
    isPremium: false,
    status: 'waiting',
    targetSchools: ['UC Berkeley', 'UCLA']
  }
]

const mockMessages = [
  {
    id: '1',
    senderId: 'student-123',
    senderName: 'Emma Chen',
    content: 'Hi! I\'ve been working on my Common App essay based on your feedback.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: true
  },
  {
    id: '2',
    senderId: 'consultant-123',
    senderName: 'You',
    content: 'That\'s great to hear! Feel free to share your revised draft when you\'re ready.',
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    isRead: true
  },
  {
    id: '3',
    senderId: 'student-123',
    senderName: 'Emma Chen',
    content: 'Thanks for the feedback! I\'ve revised the introduction to be more compelling and added specific examples like you suggested. The essay now focuses on my experience organizing the school\'s first hackathon.',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    isRead: true,
    attachment: { type: 'document', name: 'CommonApp_Essay_v2.docx' }
  },
  {
    id: '4',
    senderId: 'student-123',
    senderName: 'Emma Chen',
    content: 'Also, I have a question about the conclusion. Should I tie it back to my intended major?',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    isRead: false
  }
]

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

// Components
const ConversationCard = ({ 
  conversation, 
  isSelected, 
  onClick 
}: { 
  conversation: typeof mockConversations[0]
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
      {/* Premium indicator */}
      {conversation.isPremium && (
        <div className="absolute top-2 right-2">
          <span className="text-yellow-500 text-sm">⭐</span>
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-2xl">
            {conversation.studentAvatar}
          </div>
          {/* Status indicator */}
          {conversation.status === 'urgent' && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {conversation.studentName}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
              {getTimeAgo(conversation.lastMessageTime)}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-white rounded-full ${getCategoryColor(conversation.serviceCategory)}`}>
              <span>{getCategoryIcon(conversation.serviceCategory)}</span>
              {conversation.serviceType}
            </span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {conversation.lastMessage}
          </p>

          {/* Unread badge */}
          {conversation.unreadCount > 0 && (
            <div className="mt-2">
              <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-proofr-cyan rounded-full">
                {conversation.unreadCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

const MessageBubble = ({ message, isOwn }: { message: typeof mockMessages[0], isOwn: boolean }) => {
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
          <p className="text-sm">{message.content}</p>
          
          {/* Attachment */}
          {message.attachment && (
            <div className={`mt-2 p-2 rounded-lg ${
              isOwn ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'
            }`}>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-medium truncate">
                  {message.attachment.name}
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className={`flex items-center gap-2 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isOwn && message.isRead && (
            <span className="text-xs text-proofr-cyan">✓✓</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [conversations, setConversations] = useState(mockConversations)
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread' | 'premium'>('all')
  
  const currentUserId = 'consultant-123'
  
  const selectedConv = conversations.find(c => c.id === selectedConversation)

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    if (filter === 'unread') return conv.unreadCount > 0
    if (filter === 'premium') return conv.isPremium
    return true
  })

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const newMsg = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: 'You',
      content: newMessage,
      timestamp: new Date(),
      isRead: false
    }

    setMessages([...messages, newMsg])
    setNewMessage('')
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Conversations Sidebar */}
      <div className="w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
            Messages
          </h1>
          
          {/* Filter tabs */}
          <div className="flex gap-2">
            {(['all', 'unread', 'premium'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  filter === tab
                    ? 'bg-gradient-to-r from-proofr-cyan to-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'unread' && (
                  <span className="ml-1">
                    ({conversations.filter(c => c.unreadCount > 0).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {filteredConversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversation === conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
              />
            ))}
          </AnimatePresence>
          
          {filteredConversations.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <p>No conversations found</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
            </div>
            <div className="p-2">
              <p className="text-2xl font-bold text-proofr-cyan">3</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Urgent</p>
            </div>
            <div className="p-2">
              <p className="text-2xl font-bold text-yellow-500">5</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Premium</p>
            </div>
          </div>
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
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-xl">
                    {selectedConv.studentAvatar}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      {selectedConv.studentName}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedConv.serviceType}
                      </span>
                      {selectedConv.isPremium && (
                        <span className="text-yellow-500 text-sm">⭐ Premium</span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
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
                {/* Date separator */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Today
                  </span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                </div>

                {/* Messages */}
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwn={message.senderId === currentUserId}
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
                    <span>{selectedConv.studentName} is typing...</span>
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
                Select a conversation
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Choose a student from the sidebar to start chatting and providing guidance.
              </p>
              
              {/* Quick tips */}
              <div className="space-y-3 text-left bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-proofr-cyan mt-0.5">✓</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Premium conversations are marked with a star
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-proofr-cyan mt-0.5">✓</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Red dots indicate urgent messages
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-proofr-cyan mt-0.5">✓</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Use filters to organize your conversations
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}