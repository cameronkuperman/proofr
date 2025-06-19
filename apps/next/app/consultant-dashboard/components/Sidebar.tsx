"use client"

import { useState } from 'react'
import { useTheme } from './ThemeProvider'

/*
SUPABASE INTEGRATION TODO:
=====================================

1. CONSULTANT PROFILE TABLE:
   - Table: consultant_profiles
   - Fields: id, user_id, name, university, avatar_url, verification_status
   - Query: SELECT * FROM consultant_profiles WHERE user_id = $1

2. MESSAGE COUNT SUBSCRIPTION:
   - Table: messages  
   - Fields: id, consultant_id, client_id, content, read_status, created_at
   - Real-time count: SELECT COUNT(*) FROM messages WHERE consultant_id = $1 AND read_status = false
   - Subscription: supabase.channel('messages').on('postgres_changes', {event: 'INSERT'})

3. VERIFICATION STATUS:
   - Table: consultant_verifications
   - Fields: consultant_id, status ('pending', 'approved', 'rejected'), submitted_at, approved_at
   - Query: SELECT status FROM consultant_verifications WHERE consultant_id = $1 ORDER BY submitted_at DESC LIMIT 1

4. API FUNCTIONS TO CREATE:
   - fetchConsultantProfile(userId): Promise<ConsultantProfile>
   - fetchUnreadMessageCount(consultantId): Promise<number>
   - subscribeToMessageUpdates(consultantId, callback): RealtimeSubscription
*/

// Modern Theme Toggle Component
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-proofr-cyan focus:ring-offset-2 dark:focus:ring-offset-gray-800"
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-200 transition-transform duration-300 ${
          theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
      <span className="absolute left-1.5 top-1">
        {theme === 'light' ? (
          <svg className="h-3 w-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="h-3 w-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </span>
    </button>
  )
}

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

// Professional Navigation Icons
const NavigationIcon = ({ type, isActive }: { type: string, isActive: boolean }) => {
  const className = `w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`
  
  switch (type) {
    case 'dashboard':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    case 'gigs':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    case 'profile':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    case 'messages':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    case 'analytics':
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    default:
      return null
  }
}

const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Overview & analytics'
  },
  {
    id: 'gigs',
    label: 'Projects',
    description: 'Active & pipeline'
  },
  {
    id: 'profile',
    label: 'Profile',
    description: 'Settings & preferences'
  },
  {
    id: 'messages',
    label: 'Messages',
    description: 'Client communications',
    badge: '3' // TODO: Replace with real-time unread message count from Supabase
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Performance insights'
  }
]

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  // TODO: Replace with actual consultant data from Supabase
  // const { data: consultant } = useSupabaseQuery('consultant_profiles', userId)
  // const { data: unreadCount } = useSupabaseSubscription('messages', { consultant_id: consultantId, read_status: false })

  return (
    <div 
      className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out flex flex-col backdrop-blur-xl ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-proofr-navy dark:text-white">Proofr</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Consultant Portal</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isCollapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Theme Toggle */}
        {!isCollapsed && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Dark Mode</span>
            <ThemeToggle />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full text-left p-3 rounded-xl transition-all duration-200 group relative ${
              activeTab === item.id
                ? 'bg-gradient-to-r from-proofr-navy to-proofr-cyan text-white shadow-lg shadow-proofr-navy/25'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:text-proofr-navy dark:hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <NavigationIcon type={item.id} isActive={activeTab === item.id} />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold truncate">{item.label}</p>
                    {item.badge && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        activeTab === item.id 
                          ? 'bg-white/20 text-white' 
                          : 'bg-proofr-coral text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm truncate ${
                    activeTab === item.id ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {item.description}
                  </p>
                </div>
              )}
            </div>
            
            {/* Active indicator */}
            {activeTab === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-proofr-cyan rounded-r-full" />
            )}
          </button>
        ))}
      </nav>

      {/* Bottom section - Consultant Profile */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
        {!isCollapsed && (
          <div className="bg-gradient-to-r from-proofr-cyan/10 to-proofr-coral/10 dark:from-proofr-cyan/20 dark:to-proofr-coral/20 p-4 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-proofr-navy to-proofr-cyan flex items-center justify-center shadow-lg">
                {/* TODO: Replace with actual consultant avatar from Supabase */}
                <span className="text-white text-sm font-bold">JD</span>
              </div>
              <div>
                {/* TODO: Replace with actual consultant data from Supabase */}
                <p className="font-semibold text-gray-900 dark:text-white">John Doe</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Harvard University</p>
              </div>
            </div>
            
            {/* Verification Status - TODO: Connect to Supabase verification table */}
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-2 rounded-lg border border-white/20 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Verification</span>
                <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full shadow-sm">
                  Pending
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 