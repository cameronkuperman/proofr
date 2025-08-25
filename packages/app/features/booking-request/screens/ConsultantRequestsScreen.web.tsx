'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '../../../utils/supabase/useSupabase'
import { useCurrentUser } from '../../../utils/useCurrentUser'
import { ConsultantRequestModal } from '../components/ConsultantRequestModal.web'
import { Avatar } from '../../../components/Avatar'
import type { BookingRequest } from '../types/booking-request.types'

export function ConsultantRequestsScreen() {
  const router = useRouter()
  const supabase = useSupabase()
  const { user } = useCurrentUser()
  
  const [requests, setRequests] = useState<BookingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_discussion' | 'accepted' | 'completed'>('pending')
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null)
  const [showRequestModal, setShowRequestModal] = useState(false)

  useEffect(() => {
    if (user) {
      fetchConsultantId()
    }
  }, [user, filter])

  const fetchConsultantId = async () => {
    try {
      const { data: consultant, error } = await supabase
        .from('consultants')
        .select('id')
        .eq('user_id', user?.id)
        .single()
      
      if (error) throw error
      if (consultant) {
        fetchRequests(consultant.id)
      }
    } catch (error) {
      // Error handled by UI state
    }
  }

  const fetchRequests = async (consultantId: string) => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('booking_requests')
        .select(`
          *,
          students!inner(
            id,
            name,
            school,
            users!inner(
              avatar_url
            )
          ),
          services!inner(
            id,
            title,
            service_type
          ),
          booking_text_inputs(
            id,
            input_type,
            title,
            content,
            display_order
          ),
          booking_file_uploads(
            id,
            file_name,
            file_type,
            file_size,
            storage_path,
            upload_status
          ),
          booking_doc_links(
            id,
            doc_url,
            doc_title,
            doc_type,
            description
          )
        `)
        .eq('consultant_id', consultantId)
        .order('created_at', { ascending: false })
      
      if (filter !== 'all') {
        if (filter === 'pending') {
          query = query.in('status', ['pending_review', 'in_discussion'])
        } else if (filter === 'in_discussion') {
          query = query.eq('status', 'in_discussion')
        } else if (filter === 'accepted') {
          query = query.in('status', ['accepted', 'paid'])
        } else if (filter === 'completed') {
          query = query.in('status', ['completed', 'cancelled', 'rejected'])
        }
      }
      
      const { data, error } = await query
      
      if (error) throw error
      setRequests(data || [])
    } catch (error) {
      // Error handled by UI state
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptRequest = async (requestId: string, quotedPrice: number, estimatedDelivery: string) => {
    try {
      const { error } = await supabase
        .from('booking_requests')
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString(),
          quoted_price: quotedPrice,
          estimated_delivery_time: estimatedDelivery
        })
        .eq('id', requestId)
      
      if (error) throw error
      
      setShowRequestModal(false)
      setSelectedRequest(null)
      fetchConsultantId()
    } catch (error) {
      alert('Failed to accept request. Please try again.')
    }
  }

  const handleRejectRequest = async (requestId: string, reason: string) => {
    try {
      const { error } = await supabase
        .from('booking_requests')
        .update({
          status: 'rejected',
          rejected_at: new Date().toISOString(),
          rejection_reason: reason
        })
        .eq('id', requestId)
      
      if (error) throw error
      
      setShowRequestModal(false)
      setSelectedRequest(null)
      fetchConsultantId()
    } catch (error) {
      alert('Failed to reject request. Please try again.')
    }
  }

  const handleStartDiscussion = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('booking_requests')
        .update({
          status: 'in_discussion',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', requestId)
      
      if (error) throw error
      
      fetchConsultantId()
    } catch (error) {
      alert('Failed to update request. Please try again.')
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
      accepted: 'Accepted',
      rejected: 'Rejected',
      paid: 'Paid',
      expired: 'Expired',
      cancelled: 'Cancelled'
    }
    return labels[status] || status
  }

  const stats = {
    total: requests.length,
    pending: requests.filter(r => ['pending_review', 'in_discussion'].includes(r.status)).length,
    accepted: requests.filter(r => ['accepted', 'paid'].includes(r.status)).length,
    completed: requests.filter(r => ['completed'].includes(r.status)).length,
    revenue: requests
      .filter(r => r.status === 'paid' || r.status === 'completed')
      .reduce((sum, r) => sum + (r.quoted_price || 0), 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Booking Requests</h1>
          <p className="text-gray-600 mt-2">Review and manage incoming service requests</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Requests</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-gray-600">Pending Review</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
            <p className="text-sm text-gray-600">Active</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">${stats.revenue}</p>
            <p className="text-sm text-gray-600">Revenue</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex space-x-2">
            {['all', 'pending', 'in_discussion', 'accepted', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  filter === f
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {f === 'all' ? 'All Requests' : f.replace('_', ' ')}
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
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow"
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
                      {request.urgency_level === 'urgent' && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          URGENT
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar
                        name={(request as any).students?.name || 'Student'}
                        imageUrl={(request as any).students?.users?.avatar_url}
                        size="sm"
                        rounded="full"
                      />
                      <p className="text-gray-600">
                        {(request as any).students?.name} • {(request as any).students?.school || 'School'}
                      </p>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">
                      {request.purpose_of_service}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Submitted {new Date(request.created_at).toLocaleDateString()}</span>
                      {request.deadline_date && (
                        <span className="text-orange-600">
                          Due {new Date(request.deadline_date).toLocaleDateString()}
                        </span>
                      )}
                      <span>
                        {(request as any).booking_text_inputs?.length || 0} texts,
                        {' '}{(request as any).booking_file_uploads?.length || 0} files,
                        {' '}{(request as any).booking_doc_links?.length || 0} links
                      </span>
                    </div>
                  </div>
                  
                  <div className="ml-4 space-y-2">
                    {request.status === 'pending_review' && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedRequest(request)
                            setShowRequestModal(true)
                          }}
                          className="block w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                        >
                          Review Request
                        </button>
                        <button
                          onClick={() => handleStartDiscussion(request.id)}
                          className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Start Discussion
                        </button>
                      </>
                    )}
                    
                    {request.status === 'in_discussion' && (
                      <button
                        onClick={() => {
                          setSelectedRequest(request)
                          setShowRequestModal(true)
                        }}
                        className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Continue Discussion
                      </button>
                    )}
                    
                    {request.status === 'accepted' && !request.paid_at && (
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">Awaiting Payment</p>
                        <p className="text-lg font-bold text-gray-900">${request.quoted_price}</p>
                      </div>
                    )}
                    
                    {request.status === 'paid' && (
                      <button
                        onClick={() => router.push(`/consultant-dashboard/bookings/${request.booking_id}`)}
                        className="block w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                      >
                        View Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedRequest && (
        <ConsultantRequestModal
          isOpen={showRequestModal}
          onClose={() => {
            setShowRequestModal(false)
            setSelectedRequest(null)
          }}
          request={selectedRequest}
          onAccept={handleAcceptRequest}
          onReject={handleRejectRequest}
          onStartDiscussion={handleStartDiscussion}
        />
      )}
    </div>
  )
}