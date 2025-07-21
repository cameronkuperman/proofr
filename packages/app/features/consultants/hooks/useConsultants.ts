import { useEffect, useState } from 'react'
import { supabase } from '../../../../../lib/supabase'
import type { ConsultantWithServices, ConsultantFilters } from '../types/consultant.types'

export function useConsultants(filters?: ConsultantFilters) {
  const [consultants, setConsultants] = useState<ConsultantWithServices[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchConsultants()
  }, [filters])

  const fetchConsultants = async () => {
    try {
      setLoading(true)
      setError(null)

      // Start with base query using the active_consultants view
      let query = supabase
        .from('active_consultants')
        .select(`
          *,
          services (*)
        `)

      // Apply filters
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,bio.ilike.%${filters.search}%,current_college.ilike.%${filters.search}%`)
      }

      if (filters?.university) {
        query = query.ilike('current_college', `%${filters.university}%`)
      }

      if (filters?.min_rating) {
        query = query.gte('rating', filters.min_rating)
      }

      if (filters?.verified_only) {
        query = query.eq('verification_status', 'approved')
      }

      // Sorting
      switch (filters?.sort_by) {
        case 'rating':
          query = query.order('rating', { ascending: false })
          break
        case 'bookings':
          query = query.order('total_bookings', { ascending: false })
          break
        case 'newest':
          query = query.order('created_at', { ascending: false })
          break
        default:
          query = query.order('rating', { ascending: false })
      }

      const { data, error } = await query

      if (error) throw error

      // Transform and filter by service type and price if needed
      let transformedData = (data || []) as ConsultantWithServices[]

      if (filters?.service_type) {
        transformedData = transformedData.filter(consultant => 
          consultant.services?.some(s => s.service_type === filters.service_type)
        )
      }

      if (filters?.min_price !== undefined || filters?.max_price !== undefined) {
        transformedData = transformedData.filter(consultant => {
          const prices = consultant.services?.flatMap(s => s.prices) || []
          const minPrice = Math.min(...prices)
          const maxPrice = Math.max(...prices)
          
          if (filters.min_price !== undefined && maxPrice < filters.min_price) return false
          if (filters.max_price !== undefined && minPrice > filters.max_price) return false
          return true
        })
      }

      // Sort by price if requested
      if (filters?.sort_by === 'price_low' || filters?.sort_by === 'price_high') {
        transformedData.sort((a, b) => {
          const aPrices = a.services?.flatMap(s => s.prices) || []
          const bPrices = b.services?.flatMap(s => s.prices) || []
          const aMin = Math.min(...aPrices)
          const bMin = Math.min(...bPrices)
          
          return filters.sort_by === 'price_low' ? aMin - bMin : bMin - aMin
        })
      }

      setConsultants(transformedData)
    } catch (err) {
      console.error('Error fetching consultants:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch consultants')
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchConsultants()
  }

  return { consultants, loading, error, refetch }
}