import { useEffect, useState } from 'react'
import { supabase } from '../../../../../lib/supabase'
import type { Booking } from '../types/bookings.types'

export function useGroupSessions(userId: string) {
  const [availableSessions, setAvailableSessions] = useState<Booking[]>([])
  const [enrolledSessions, setEnrolledSessions] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    fetchGroupSessions()
    
    // Set up real-time subscription for group sessions
    const channel = supabase
      .channel('group-sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: 'is_group_session=eq.true',
        },
        () => {
          // Refetch on any group session change
          fetchGroupSessions()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_session_participants',
        },
        () => {
          // Refetch on participant changes
          fetchGroupSessions()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const fetchGroupSessions = async () => {
    try {
      setLoading(true)
      const now = new Date().toISOString()
      
      // Fetch available group sessions (not full, upcoming)
      const { data: allGroupSessions, error: availableError } = await supabase
        .from('bookings')
        .select(`
          *,
          consultant:consultants!consultant_id(*),
          service:services!service_id(*),
          participants:group_session_participants(
            id, student_id,
            student:students!student_id(*)
          )
        `)
        .eq('is_group_session', true)
        .eq('status', 'confirmed')
        .gte('scheduled_at', now)
        .order('scheduled_at', { ascending: true })

      if (availableError) throw availableError

      // Filter sessions that are not full
      const available = allGroupSessions?.filter(
        session => (session.current_participants || 0) < (session.max_participants || 1)
      ) || []

      // Fetch enrolled sessions
      const { data: participantData, error: participantError } = await supabase
        .from('group_session_participants')
        .select(`
          booking_id,
          booking:bookings!booking_id(
            *,
            consultant:consultants!consultant_id(*),
            service:services!service_id(*),
            participants:group_session_participants(
              id, student_id,
              student:students!student_id(*)
            )
          )
        `)
        .eq('student_id', userId)

      if (participantError) throw participantError

      const enrolled = participantData
        ?.map((p) => p.booking)
        .filter((b) => b && new Date(b.scheduled_at) >= new Date()) || []

      // Filter out sessions where user is already enrolled
      const enrolledIds = enrolled.map((b) => b.id)
      const filteredAvailable = available?.filter(
        (session) => !enrolledIds.includes(session.id)
      ) || []

      setAvailableSessions(filteredAvailable)
      setEnrolledSessions(enrolled)
    } catch (err: any) {
      console.error('Error fetching group sessions:', err)
      setError(err?.message || 'Failed to fetch group sessions')
    } finally {
      setLoading(false)
    }
  }

  const joinGroupSession = async (bookingId: string) => {
    try {
      // Check if already joined
      const alreadyJoined = enrolledSessions.some((s) => s.id === bookingId)
      if (alreadyJoined) {
        return { success: false, error: 'Already enrolled in this session' }
      }

      // Join the session
      const { error } = await supabase
        .from('group_session_participants')
        .insert({
          booking_id: bookingId,
          student_id: userId,
        })

      if (error) throw error

      // Update participant count
      const session = availableSessions.find((s) => s.id === bookingId)
      if (session) {
        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            current_participants: (session.current_participants || 0) + 1,
          })
          .eq('id', bookingId)

        if (updateError) throw updateError
      }

      return { success: true }
    } catch (err: any) {
      console.error('Error joining group session:', err)
      return { success: false, error: err?.message || 'Failed to join group session' }
    }
  }

  const leaveGroupSession = async (bookingId: string) => {
    try {
      // Leave the session
      const { error } = await supabase
        .from('group_session_participants')
        .delete()
        .eq('booking_id', bookingId)
        .eq('student_id', userId)

      if (error) throw error

      // Update participant count
      const session = enrolledSessions.find((s) => s.id === bookingId)
      if (session) {
        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            current_participants: Math.max(0, (session.current_participants || 0) - 1),
          })
          .eq('id', bookingId)

        if (updateError) throw updateError
      }

      return { success: true }
    } catch (err: any) {
      console.error('Error leaving group session:', err)
      return { success: false, error: err?.message || 'Failed to leave group session' }
    }
  }

  return {
    availableSessions,
    enrolledSessions,
    loading,
    error,
    refetch: fetchGroupSessions,
    joinGroupSession,
    leaveGroupSession,
  }
}