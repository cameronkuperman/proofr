// MessagingTrigger.tsx - Global messaging trigger for dashboard navigation
"use client"

import { useState, useEffect } from 'react'
import MessagingModal from './MessagingModal'

interface MessagingTriggerProps {
  currentUserId: string
  currentUserType: 'student' | 'consultant'
  variant?: 'nav' | 'floating' | 'button'
  showUnreadCount?: boolean
}

export default function MessagingTrigger({
  currentUserId,
  currentUserType,
  variant = 'nav',
  showUnreadCount = true
}: MessagingTriggerProps) {
  const [showMessagingModal, setShowMessagingModal] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // SUPABASE TODO: Get unread message count
  // useEffect(() => {
  //   const fetchUnreadCount = async () => {
  //     const { data, error } = await supabase
  //       .from('messages')
  //       .select('id', { count: 'exact' })
  //       .eq('is_read', false)
  //       .in('service_id', 
  //         supabase
  //           .from('services')
  //           .select('id')
  //           .eq(currentUserType === 'consultant' ? 'consultant_id' : 'student_id', currentUserId)
  //       )
  //     
  //     if (data) setUnreadCount(data.length)
  //   }
  //   fetchUnreadCount()
  // }, [currentUserId, currentUserType])

  const triggerStyles = {
    nav: {
      background: 'none',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#6b7280',
      fontSize: '14px',
      fontWeight: '500'
    },
    floating: {
      position: 'fixed' as const,
      bottom: '20px',
      right: '20px',
      width: '56px',
      height: '56px',
      borderRadius: '28px',
      background: '#3b82f6',
      color: 'white',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
      transition: 'all 0.2s ease',
      zIndex: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    button: {
      background: '#f3f4f6',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '10px 16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#374151',
      fontSize: '14px',
      fontWeight: '500'
    }
  }

  const buttonStyle = triggerStyles[variant]

  return (
    <>
      <button
        onClick={() => setShowMessagingModal(true)}
        style={buttonStyle}
        onMouseEnter={(e) => {
          if (variant === 'nav') {
            e.currentTarget.style.background = '#f3f4f6'
            e.currentTarget.style.color = '#374151'
          } else if (variant === 'floating') {
            e.currentTarget.style.transform = 'scale(1.1)'
          } else if (variant === 'button') {
            e.currentTarget.style.background = '#e5e7eb'
          }
        }}
        onMouseLeave={(e) => {
          if (variant === 'nav') {
            e.currentTarget.style.background = 'none'
            e.currentTarget.style.color = '#6b7280'
          } else if (variant === 'floating') {
            e.currentTarget.style.transform = 'scale(1)'
          } else if (variant === 'button') {
            e.currentTarget.style.background = '#f3f4f6'
          }
        }}
      >
        <div style={{ position: 'relative' }}>
          {variant === 'floating' ? '💬' : (
            <span style={{ fontSize: variant === 'nav' ? '16px' : '18px' }}>
              💬
            </span>
          )}
          
          {showUnreadCount && unreadCount > 0 && (
            <div style={{
              position: 'absolute',
              top: variant === 'floating' ? '-8px' : '-6px',
              right: variant === 'floating' ? '-8px' : '-6px',
              background: '#ef4444',
              color: 'white',
              borderRadius: '10px',
              padding: '2px 6px',
              fontSize: '10px',
              fontWeight: '600',
              minWidth: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid white'
            }}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
          )}
        </div>
        
        {variant !== 'floating' && (
          <span>
            {variant === 'nav' ? 'Messages' : 'Open Messages'}
          </span>
        )}
      </button>

      <MessagingModal
        isOpen={showMessagingModal}
        onClose={() => setShowMessagingModal(false)}
        currentUserId={currentUserId}
        currentUserType={currentUserType}
        mode="existing_conversations"
      />
    </>
  )
}

// SUPABASE TODO: Real-time unread count updates
/*
// Add this to your main layout or messaging trigger
useEffect(() => {
  const channel = supabase
    .channel(`unread-count-${currentUserId}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'messages',
      filter: `service_id=in.(${userServiceIds.join(',')})`
    }, () => {
      fetchUnreadCount() // Refetch count on any message change
    })
    .subscribe()

  return () => supabase.removeChannel(channel)
}, [currentUserId])
*/ 