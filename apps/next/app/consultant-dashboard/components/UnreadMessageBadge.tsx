// UnreadMessageBadge.tsx - Real-time unread message count for sidebar
"use client"

import { useState, useEffect } from 'react'

interface UnreadMessageBadgeProps {
  currentUserId: string
  isActive: boolean
}

export default function UnreadMessageBadge({ currentUserId, isActive }: UnreadMessageBadgeProps) {
  const [unreadCount, setUnreadCount] = useState(0)

  // SUPABASE TODO: Get real-time unread message count
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
  //           .eq('consultant_id', currentUserId)
  //       )
  //     
  //     if (data) setUnreadCount(data.length)
  //   }

  //   fetchUnreadCount()

  //   // Set up real-time subscription
  //   const channel = supabase
  //     .channel(`unread-messages-${currentUserId}`)
  //     .on('postgres_changes', {
  //       event: '*',
  //       schema: 'public',
  //       table: 'messages'
  //     }, () => {
  //       fetchUnreadCount() // Refetch count on any message change
  //     })
  //     .subscribe()

  //   return () => supabase.removeChannel(channel)
  // }, [currentUserId])

  // Simulate some unread messages for demo
  useEffect(() => {
    setUnreadCount(3)
  }, [])

  if (unreadCount === 0) return null

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${
      isActive 
        ? 'bg-white/20 text-white' 
        : 'bg-red-500 text-white'
    }`}>
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  )
} 