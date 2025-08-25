'use client'

import React from 'react'
import type { BookingRequest } from '../types/booking-request.types'

interface RequestCardProps {
  request: BookingRequest & {
    consultants?: any
    services?: any
  }
  onClick: () => void
}

export function RequestCard({ request, onClick }: RequestCardProps) {
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

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {request.services?.title || 'Service Request'}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
              {getStatusLabel(request.status)}
            </span>
          </div>
          
          <p className="text-gray-600 mb-2">
            {request.consultants?.name && (
              <>with {request.consultants.name} • {request.consultants.university}</>
            )}
          </p>
          
          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
            {request.purpose_of_service}
          </p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Created {new Date(request.created_at).toLocaleDateString()}</span>
            {request.deadline_date && (
              <span>Due {new Date(request.deadline_date).toLocaleDateString()}</span>
            )}
          </div>
        </div>
        
        {request.quoted_price && (
          <div className="ml-4 text-right">
            <p className="text-xl font-bold text-gray-900">
              ${request.quoted_price}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}