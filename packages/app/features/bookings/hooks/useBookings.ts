import { useEffect, useState } from 'react'
import { supabase } from '../../../../../lib/supabase'
import type { Booking, BookingStats, BookingFilters } from '../types/bookings.types'

export function useBookings(userId: string, filters?: BookingFilters) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<BookingStats>({
    totalSessions: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    totalSpent: 0,
    totalCreditsEarned: 0,
    averageRating: 0,
    unratedSessions: 0,
  })

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    fetchBookings()
    
    // Set up real-time subscription
    const channel = supabase
      .channel(`student-bookings-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `student_id=eq.${userId}`,
        },
        (payload) => {
          handleBookingChange(payload)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, filters])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('bookings')
        .select(`
          *,
          consultant:consultants!consultant_id(*),
          service:services!service_id(*),
          participants:group_session_participants(
            id, student_id, joined_at,
            student:students!student_id(*)
          )
        `)
        .eq('student_id', userId)
        .order('scheduled_at', { ascending: false })

      // Apply filters
      if (filters?.status && filters.status.length > 0) {
        query = query.in('status', filters.status)
      }
      // Note: service_type filtering would need to be done via the services table join
      // For now, skip this filter as it requires a more complex query
      if (filters?.dateRange) {
        query = query
          .gte('scheduled_at', filters.dateRange.start)
          .lte('scheduled_at', filters.dateRange.end)
      }
      if (filters?.priceRange) {
        query = query
          .gte('final_price', filters.priceRange.min)
          .lte('final_price', filters.priceRange.max)
      }
      if (filters?.hasRating !== undefined) {
        query = filters.hasRating
          ? query.not('rating', 'is', null)
          : query.is('rating', null)
      }
      if (filters?.isGroupSession !== undefined) {
        query = query.eq('is_group_session', filters.isGroupSession)
      }

      const { data, error } = await query

      if (error) throw error

      setBookings(data || [])
      calculateStats(data || [])
    } catch (err: any) {
      console.error('Error fetching bookings:', err)
      setError(err?.message || 'Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (bookingData: Booking[]) => {
    const now = new Date()
    const stats: BookingStats = {
      totalSessions: bookingData.length,
      completedSessions: 0,
      upcomingSessions: 0,
      totalSpent: 0,
      totalCreditsEarned: 0,
      averageRating: 0,
      unratedSessions: 0,
    }

    let totalRating = 0
    let ratedCount = 0

    bookingData.forEach((booking) => {
      if (booking.status === 'completed') {
        stats.completedSessions++
        stats.totalSpent += booking.final_price || 0
        stats.totalCreditsEarned += booking.credits_earned || 0
        
        if (booking.rating) {
          totalRating += booking.rating
          ratedCount++
        } else {
          stats.unratedSessions++
        }
      }

      if (
        booking.status === 'confirmed' &&
        new Date(booking.scheduled_at) > now
      ) {
        stats.upcomingSessions++
      }
    })

    stats.averageRating = ratedCount > 0 ? totalRating / ratedCount : 0

    setStats(stats)
  }

  const handleBookingChange = (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload

    switch (eventType) {
      case 'INSERT':
        setBookings((prev) => [newRecord, ...prev])
        break
      case 'UPDATE':
        setBookings((prev) =>
          prev.map((booking) =>
            booking.id === newRecord.id ? newRecord : booking
          )
        )
        break
      case 'DELETE':
        setBookings((prev) =>
          prev.filter((booking) => booking.id !== oldRecord.id)
        )
        break
    }

    // Recalculate stats
    fetchBookings()
  }

  const submitRating = async (bookingId: string, rating: number, reviewText?: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          rating,
          review_text: reviewText,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', bookingId)

      if (error) throw error

      // Optimistically update local state
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId
            ? { ...booking, rating, review_text: reviewText, reviewed_at: new Date().toISOString() }
            : booking
        )
      )

      return { success: true }
    } catch (err: any) {
      console.error('Error submitting rating:', err)
      return { success: false, error: err?.message || 'Failed to submit rating' }
    }
  }

  return {
    bookings,
    loading,
    error,
    stats,
    refetch: fetchBookings,
    submitRating,
  }
}