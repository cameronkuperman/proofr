import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { getCurrentUser } from '../auth-helpers'

interface ConsultantProfile {
  id: string
  name: string
  bio: string
  long_bio: string
  current_college: string
  major: string
  graduation_year: number
  verification_status: string
  is_available: boolean
  vacation_mode: boolean
  rating: number
  total_reviews: number
  total_bookings: number
  total_earnings: number
  profile_image_url?: string
}

interface ConsultantStats {
  todayEarnings: number
  monthlyEarnings: number
  activeClients: number
  pendingBookings: number
  completedBookings: number
  averageRating: number
  responseTime: number
}

interface UseConsultantDataReturn {
  profile: ConsultantProfile | null
  stats: ConsultantStats | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useConsultantData(): UseConsultantDataReturn {
  const [profile, setProfile] = useState<ConsultantProfile | null>(null)
  const [stats, setStats] = useState<ConsultantStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchConsultantData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current user
      const user = await getCurrentUser()
      if (!user || user.userType !== 'consultant') {
        throw new Error('Not authenticated as consultant')
      }

      // Fetch consultant profile with user data
      const { data: consultantData, error: consultantError } = await supabase
        .from('consultants')
        .select(`
          *,
          users!inner(
            email,
            profile_image_url
          )
        `)
        .eq('id', user.id)
        .single()

      if (consultantError) throw consultantError

      // Set profile data
      setProfile({
        ...consultantData,
        profile_image_url: consultantData.users?.profile_image_url
      })

      // Fetch statistics in parallel for performance
      const today = new Date()
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())

      const [
        { data: todayBookings },
        { data: monthlyBookings },
        { data: activeBookings },
        { data: recentBookings }
      ] = await Promise.all([
        // Today's earnings
        supabase
          .from('bookings')
          .select('final_price')
          .eq('consultant_id', user.id)
          .eq('status', 'completed')
          .gte('completed_at', startOfDay.toISOString()),
        
        // Monthly earnings
        supabase
          .from('bookings')
          .select('final_price')
          .eq('consultant_id', user.id)
          .eq('status', 'completed')
          .gte('completed_at', startOfMonth.toISOString()),
        
        // Active bookings
        supabase
          .from('bookings')
          .select('id, student_id')
          .eq('consultant_id', user.id)
          .in('status', ['pending', 'confirmed', 'in_progress']),
        
        // Recent bookings for response time
        supabase
          .from('bookings')
          .select('created_at, status, updated_at')
          .eq('consultant_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20)
      ])

      // Calculate statistics
      const todayEarnings = todayBookings?.reduce((sum, b) => sum + (b.final_price || 0), 0) || 0
      const monthlyEarnings = monthlyBookings?.reduce((sum, b) => sum + (b.final_price || 0), 0) || 0
      const activeClients = new Set(activeBookings?.map(b => b.student_id) || []).size
      const pendingBookings = activeBookings?.filter(b => b.status === 'pending').length || 0
      const completedBookings = consultantData.total_bookings || 0

      // Calculate average response time
      let avgResponseTime = 24 // Default 24 hours
      if (recentBookings && recentBookings.length > 0) {
        const responseTimes = recentBookings
          .filter(b => b.status !== 'pending' && b.updated_at)
          .map(b => {
            const created = new Date(b.created_at).getTime()
            const updated = new Date(b.updated_at).getTime()
            return (updated - created) / (1000 * 60 * 60) // Convert to hours
          })
          .filter(time => time > 0 && time < 168) // Filter out unrealistic times

        if (responseTimes.length > 0) {
          avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        }
      }

      setStats({
        todayEarnings,
        monthlyEarnings,
        activeClients,
        pendingBookings,
        completedBookings,
        averageRating: consultantData.rating || 0,
        responseTime: Math.round(avgResponseTime)
      })

    } catch (err) {
      console.error('Error fetching consultant data:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConsultantData()

    // Set up real-time subscription for bookings
    const subscription = supabase
      .channel('consultant-bookings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `consultant_id=eq.${profile?.id}`
        },
        () => {
          // Refetch data when bookings change
          fetchConsultantData()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    profile,
    stats,
    loading,
    error,
    refetch: fetchConsultantData
  }
}