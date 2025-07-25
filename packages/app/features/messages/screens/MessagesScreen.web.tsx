'use client'

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MoreHorizontal, Archive, CheckCircle, Trash2 } from 'lucide-react'
import { useConversations } from '../hooks/useConversations'
import { formatDistanceToNow } from 'date-fns'

export function MessagesScreen() {
  const router = useRouter()
  const { conversations, loading, error, archiveConversation, markAsRead } = useConversations()
  const [searchQuery, setSearchQuery] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedMessages, setSelectedMessages] = useState<string[]>([])

  const toggleMessageSelection = (conversationId: string) => {
    setSelectedMessages((prev) =>
      prev.includes(conversationId)
        ? prev.filter((id) => id !== conversationId)
        : [...prev, conversationId]
    )
  }

  const handleArchive = async () => {
    try {
      await Promise.all(selectedMessages.map(id => archiveConversation(id)))
      setIsEditMode(false)
      setSelectedMessages([])
    } catch (err) {
      console.error('Error archiving conversations:', err)
    }
  }

  const handleMarkAsRead = async () => {
    try {
      await Promise.all(selectedMessages.map(id => markAsRead(id)))
      setIsEditMode(false)
      setSelectedMessages([])
    } catch (err) {
      console.error('Error marking as read:', err)
    }
  }

  const handleDelete = async () => {
    try {
      await Promise.all(selectedMessages.map(id => archiveConversation(id)))
      setIsEditMode(false)
      setSelectedMessages([])
    } catch (err) {
      console.error('Error deleting conversations:', err)
    }
  }

  const filteredConversations = conversations.filter((conv) => {
    const otherUser = conv.student || conv.consultant
    const searchLower = searchQuery.toLowerCase()
    return (
      otherUser?.name?.toLowerCase().includes(searchLower) ||
      conv.last_message_preview?.toLowerCase().includes(searchLower) ||
      conv.booking?.service?.title?.toLowerCase().includes(searchLower)
    )
  })

  const handleConversationClick = (conv: any) => {
    if (isEditMode) {
      toggleMessageSelection(conv.id)
    } else {
      router.push(`/messages/${conv.id}`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          {isEditMode ? (
            <>
              <button
                onClick={() => {
                  setIsEditMode(false)
                  setSelectedMessages([])
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Cancel
              </button>
              <h1 className="text-xl font-semibold">
                {selectedMessages.length} Selected
              </h1>
              <button className="text-gray-500 hover:text-gray-700">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditMode(true)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Edit
              </button>
              <h1 className="text-2xl font-bold">Messages</h1>
              <button className="text-gray-500 hover:text-gray-700">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Search Bar */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No messages yet</p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const otherUser = conv.student || conv.consultant
            const unreadCount = conv.student ? conv.student_unread_count : conv.consultant_unread_count
            const isSelected = selectedMessages.includes(conv.id)

            return (
              <div
                key={conv.id}
                onClick={() => handleConversationClick(conv)}
                className={`flex items-center px-6 py-4 hover:bg-gray-50 cursor-pointer border-b ${
                  isSelected ? 'bg-blue-50' : ''
                }`}
              >
                {isEditMode && (
                  <div className="mr-4">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                )}

                <div className="relative mr-4">
                  {otherUser?.profile_image_url ? (
                    <img
                      src={otherUser.profile_image_url}
                      alt={otherUser.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {otherUser?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {unreadCount > 0 && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {unreadCount}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {otherUser?.name || 'Unknown User'}
                      </h3>
                      {conv.consultant?.verification_status === 'approved' && (
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: true })}
                    </span>
                  </div>
                  
                  {conv.booking?.service && (
                    <p className="text-sm text-gray-600 mb-1">
                      Re: {conv.booking.service.title}
                    </p>
                  )}
                  
                  <p className="text-sm text-gray-600 truncate">
                    {conv.last_message_preview || 'Start a conversation'}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Bottom Action Bar for Edit Mode */}
      {isEditMode && selectedMessages.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
          <div className="flex justify-around py-4">
            <button
              onClick={handleArchive}
              className="flex flex-col items-center gap-1 text-blue-600 hover:text-blue-700"
            >
              <Archive className="w-5 h-5" />
              <span className="text-sm font-medium">Archive</span>
            </button>
            <button
              onClick={handleMarkAsRead}
              className="flex flex-col items-center gap-1 text-blue-600 hover:text-blue-700"
            >
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Read</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex flex-col items-center gap-1 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
              <span className="text-sm font-medium">Delete</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}