'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '../../../utils/supabase/useSupabase'
import { useCurrentUser } from '../../../utils/useCurrentUser'
import { RequestCard } from '../components/RequestCard.web'
import { Avatar } from '../../../components/Avatar'
import type { BookingRequest } from '../types/booking-request.types'

export function StudentRequestsScreen() {
  const router = useRouter()
  const supabase = useSupabase()
  const { user } = useCurrentUser()
  
  const [requests, setRequests] = useState<BookingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'draft' | 'pending' | 'active' | 'completed'>('all')

  useEffect(() => {
    if (user) {
      fetchRequests()
    }
  }, [user, filter])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('booking_requests')
        .select(`
          *,
          consultants!inner(
            id,
            name,
            university,
            users!inner(
              avatar_url
            )
          ),
          services!inner(
            id,
            title,
            service_type
          )
        `)
        .eq('student_id', user?.id)
        .order('created_at', { ascending: false })
      
      if (filter !== 'all') {
        if (filter === 'draft') {
          query = query.eq('status', 'draft')
        } else if (filter === 'pending') {
          query = query.in('status', ['pending_review', 'in_discussion'])
        } else if (filter === 'active') {
          query = query.in('status', ['accepted', 'paid'])
        } else if (filter === 'completed') {
          query = query.in('status', ['completed', 'cancelled', 'rejected'])
        }
      }
      
      const { data, error } = await query
      
      if (error) throw error
      setRequests(data || [])
    } catch (error) {
      // Show error state to user
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: BookingRequest['status']) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      pending_review: 'bg-yellow-100 text-yellow-800',
      in_discussion: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      paid: 'bg-purple-100 text-purple-800',
      expired: 'bg-orange-100 text-orange-800',
      cancelled: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: BookingRequest['status']) => {
    const labels = {
      draft: 'Draft',
      pending_review: 'Pending Review',
      in_discussion: 'In Discussion',
      accepted: 'Accepted - Awaiting Payment',
      rejected: 'Rejected',
      paid: 'Paid - In Progress',
      expired: 'Expired',
      cancelled: 'Cancelled'
    }
    return labels[status] || status
  }

  const handleRequestClick = useCallback((request: BookingRequest) => {
    if (request.status === 'draft') {
      router.push(`/appointments?consultant=${request.consultant_id}&service=${request.service_id}&draft=${request.id}`)
    } else {
      // For now, just show the request details in the same page
      // TODO: Create detailed request view page
      router.push(`/student-dashboard/requests?id=${request.id}`)
    }
  }, [router])

  const stats = {
    total: requests.length,
    draft: requests.filter(r => r.status === 'draft').length,
    pending: requests.filter(r => ['pending_review', 'in_discussion'].includes(r.status)).length,
    active: requests.filter(r => ['accepted', 'paid'].includes(r.status)).length,
    completed: requests.filter(r => ['completed', 'cancelled', 'rejected'].includes(r.status)).length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 rounded mt-2 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-white rounded-lg p-4">
                <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mx-auto"></div>
                <div className="h-3 w-16 bg-gray-200 rounded mt-2 animate-pulse mx-auto"></div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg p-6 shadow">
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-1/2 bg-gray-200 rounded mt-2 animate-pulse"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded mt-3 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
          <p className="text-gray-600 mt-2">Manage your booking requests and track their status</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
            <p className="text-sm text-gray-600">Drafts</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            <p className="text-sm text-gray-600">Active</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex space-x-2">
            {['all', 'draft', 'pending', 'active', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  filter === f
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {f === 'all' ? 'All Requests' : f}
              </button>
            ))}
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-4 text-gray-500">No requests found</p>
            <button
              onClick={() => router.push('/browse')}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Browse Consultants
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                onClick={() => handleRequestClick(request)}
                className="bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {(request as any).services?.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                        {getStatusLabel(request.status)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar
                        name={(request as any).consultants?.name || 'Consultant'}
                        imageUrl={(request as any).consultants?.users?.avatar_url}
                        size="sm"
                        rounded="full"
                        verified={(request as any).consultants?.verification_status === 'approved'}
                      />
                      <p className="text-gray-600">
                        {(request as any).consultants?.name} • {(request as any).consultants?.university || (request as any).consultants?.current_college}
                      </p>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">
                      {request.purpose_of_service}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Created {new Date(request.created_at).toLocaleDateString()}</span>
                      {request.deadline_date && (
                        <span>Due {new Date(request.deadline_date).toLocaleDateString()}</span>
                      )}
                      {request.expires_at && request.status === 'accepted' && (
                        <span className="text-orange-600">
                          Expires {new Date(request.expires_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    {request.status === 'accepted' && request.quoted_price && (
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          ${request.quoted_price}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            // Navigate to payment
                          }}
                          className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                        >
                          Pay Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}