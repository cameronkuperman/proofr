import { useEffect, useState } from 'react'
import { supabase } from '../../../../../lib/supabase'
import type { SavedConsultant, ConsultantWaitlist } from '../types/bookings.types'

export function useSavedConsultants(userId: string) {
  const [savedConsultants, setSavedConsultants] = useState<SavedConsultant[]>([])
  const [waitlists, setWaitlists] = useState<ConsultantWaitlist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    fetchSavedData()
    
    // Set up real-time subscriptions
    const savedChannel = supabase
      .channel(`saved-consultants-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'saved_consultants',
          filter: `student_id=eq.${userId}`,
        },
        (payload) => {
          handleSavedChange(payload)
        }
      )
      .subscribe()

    const waitlistChannel = supabase
      .channel(`consultant-waitlist-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'consultant_waitlist',
          filter: `student_id=eq.${userId}`,
        },
        (payload) => {
          handleWaitlistChange(payload)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(savedChannel)
      supabase.removeChannel(waitlistChannel)
    }
  }, [userId])

  const fetchSavedData = async () => {
    try {
      setLoading(true)
      
      // Fetch saved consultants
      const { data: savedData, error: savedError } = await supabase
        .from('saved_consultants')
        .select(`
          *,
          consultant:consultants!consultant_id(
            *,
            services(*)
          )
        `)
        .eq('student_id', userId)
        .order('saved_at', { ascending: false })

      if (savedError) throw savedError

      // Fetch waitlists
      const { data: waitlistData, error: waitlistError } = await supabase
        .from('consultant_waitlist')
        .select(`
          *,
          consultant:consultants!consultant_id(*)
        `)
        .eq('student_id', userId)
        .order('position', { ascending: true })

      if (waitlistError) throw waitlistError

      setSavedConsultants(savedData || [])
      setWaitlists(waitlistData || [])
    } catch (err: any) {
      console.error('Error fetching saved data:', err)
      setError(err?.message || 'Failed to fetch saved data')
    } finally {
      setLoading(false)
    }
  }

  const handleSavedChange = (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload

    switch (eventType) {
      case 'INSERT':
        // Fetch full consultant data for new saved item
        fetchSavedData()
        break
      case 'DELETE':
        setSavedConsultants((prev) =>
          prev.filter((item) => item.id !== oldRecord.id)
        )
        break
    }
  }

  const handleWaitlistChange = (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload

    switch (eventType) {
      case 'INSERT':
      case 'UPDATE':
        // Refetch to get updated positions
        fetchSavedData()
        break
      case 'DELETE':
        setWaitlists((prev) =>
          prev.filter((item) => item.id !== oldRecord.id)
        )
        break
    }
  }

  const toggleSaveConsultant = async (consultantId: string) => {
    try {
      // Check if already saved
      const existing = savedConsultants.find(
        (item) => item.consultant_id === consultantId
      )

      if (existing) {
        // Unsave
        const { error } = await supabase
          .from('saved_consultants')
          .delete()
          .eq('id', existing.id)

        if (error) throw error
      } else {
        // Save
        const { error } = await supabase
          .from('saved_consultants')
          .insert({
            student_id: userId,
            consultant_id: consultantId,
          })

        if (error) throw error
      }

      return { success: true }
    } catch (err: any) {
      console.error('Error toggling save:', err)
      return { success: false, error: err?.message || 'Failed to toggle save' }
    }
  }

  const joinWaitlist = async (consultantId: string, serviceId?: string) => {
    try {
      const { error } = await supabase
        .from('consultant_waitlist')
        .insert({
          student_id: userId,
          consultant_id: consultantId,
          service_id: serviceId,
        })

      if (error) throw error

      return { success: true }
    } catch (err: any) {
      console.error('Error joining waitlist:', err)
      return { success: false, error: err?.message || 'Failed to join waitlist' }
    }
  }

  const leaveWaitlist = async (waitlistId: string) => {
    try {
      const { error } = await supabase
        .from('consultant_waitlist')
        .delete()
        .eq('id', waitlistId)

      if (error) throw error

      return { success: true }
    } catch (err: any) {
      console.error('Error leaving waitlist:', err)
      return { success: false, error: err?.message || 'Failed to leave waitlist' }
    }
  }

  return {
    savedConsultants,
    waitlists,
    loading,
    error,
    refetch: fetchSavedData,
    toggleSaveConsultant,
    joinWaitlist,
    leaveWaitlist,
  }
}