import { useEffect, useState } from 'react'
import { supabase } from '../../../../../lib/supabase'
import type { ConsultantWithServices, ConsultantStats } from '../types/consultant.types'

export function useConsultant(consultantId: string) {
  const [consultant, setConsultant] = useState<ConsultantWithServices | null>(null)
  const [stats, setStats] = useState<ConsultantStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (consultantId) {
      fetchConsultant()
    }
  }, [consultantId])

  const fetchConsultant = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch consultant with services and user data
      const { data: consultantData, error: consultantError } = await supabase
        .from('consultants')
        .select(`
          *,
          user:users (*),
          services (*)
        `)
        .eq('id', consultantId)
        .single()

      if (consultantError) throw consultantError

      // Fetch recent bookings for stats
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('created_at')
        .eq('consultant_id', consultantId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1)

      // Calculate stats
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

      // Increment view count
      await supabase
        .from('consultants')
        .update({ profile_views: (consultantData.profile_views || 0) + 1 })
        .eq('id', consultantId)

      // Calculate display stats
      const memberSince = new Date(consultantData.created_at)
      const monthsDiff = (now.getFullYear() - memberSince.getFullYear()) * 12 + 
                        (now.getMonth() - memberSince.getMonth())

      const stats: ConsultantStats = {
        views_today: Math.floor(Math.random() * 20) + 5, // Simulated for now
        views_week: Math.floor(Math.random() * 100) + 50, // Simulated for now
        last_booking_time: bookingsData?.[0]?.created_at,
        spots_remaining_week: Math.floor(Math.random() * 5) + 1, // Simulated for now
        response_time_display: consultantData.response_time_hours < 1 
          ? '< 1 hour' 
          : consultantData.response_time_hours < 24 
          ? `~${Math.round(consultantData.response_time_hours)} hours`
          : `~${Math.round(consultantData.response_time_hours / 24)} days`,
        member_since_display: monthsDiff < 1 
          ? 'This month'
          : monthsDiff < 12 
          ? `${monthsDiff} ${monthsDiff === 1 ? 'month' : 'months'} ago`
          : `${Math.floor(monthsDiff / 12)} ${Math.floor(monthsDiff / 12) === 1 ? 'year' : 'years'} ago`
      }

      setConsultant(consultantData as ConsultantWithServices)
      setStats(stats)
    } catch (err) {
      console.error('Error fetching consultant:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch consultant')
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchConsultant()
  }

  return { consultant, stats, loading, error, refetch }
}