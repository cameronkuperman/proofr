"use client"

import { useState, useEffect } from 'react'
import ConversationsList from '../../../components/ConversationsList'
import ServiceChatRoom from '../../../components/ServiceChatRoom'

export default function Messages() {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  
  // TODO: Get from your auth system
  const currentUserId = 'consultant-123' // Replace with actual consultant ID
  const currentUserType = 'consultant' as const

  useEffect(() => {
    // Detect mobile for responsive behavior
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleConversationClick = (conversationId: string) => {
    setSelectedServiceId(conversationId)
  }

  const handleBackToConversations = () => {
    setSelectedServiceId(null)
  }

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900">
      {/* Mobile View - Stack conversations and chat */}
      {isMobile ? (
        <div className="h-full">
          {selectedServiceId ? (
            <div className="h-full flex flex-col">
              {/* Back button for mobile */}
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
                <button
                  onClick={handleBackToConversations}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Conversations
                </button>
              </div>
              <div className="flex-1">
                <ServiceChatRoom
                  serviceId={selectedServiceId}
                  currentUserId={currentUserId}
                  currentUserType={currentUserType}
                />
              </div>
            </div>
          ) : (
            <div className="h-full p-4">
              <ConversationsList
                currentUserId={currentUserId}
                currentUserType={currentUserType}
                onConversationClick={handleConversationClick}
              />
            </div>
          )}
        </div>
      ) : (
        /* Desktop View - Side by side layout */
        <div className="h-full flex">
          {/* Conversations List */}
          <div className="w-96 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Student Conversations
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your client communications
              </p>
            </div>
            <div className="flex-1 overflow-hidden">
              <ConversationsList
                currentUserId={currentUserId}
                currentUserType={currentUserType}
                onConversationClick={handleConversationClick}
              />
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedServiceId ? (
              <ServiceChatRoom
                serviceId={selectedServiceId}
                currentUserId={currentUserId}
                currentUserType={currentUserType}
              />
            ) : (
              /* Empty state when no conversation selected */
              <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-800">
                <div className="text-center max-w-md">
                  <div className="text-6xl mb-6">💬</div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Select a conversation
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    Choose a student conversation from the sidebar to start providing guidance and support.
                  </p>
                  <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                      💡 Your conversations are organized by service type for easy management
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 