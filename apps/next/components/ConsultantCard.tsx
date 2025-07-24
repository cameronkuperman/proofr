'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookingModalWeb } from '../../../packages/app/features/consultants/components/BookingModal.web'
import ServiceSelectionModal from './ServiceSelectionModal'
import type { ConsultantWithServices, Service } from '../../../packages/app/features/consultants/types/consultant.types'
import { getUniversityColor, getContrastTextColor } from '../../../packages/app/utils/colorUtils'

interface ConsultantCardProps {
  consultant: {
    id: string
    name: string
    current_college: string
    bio: string
    rating?: number
    total_reviews?: number
    total_bookings?: number
    response_time_hours?: number
    is_available?: boolean
    verification_status?: string
    profile_image_url?: string
    services?: Array<{
      id: string
      service_type: string
      title: string
      prices: number[]
    }>
  }
}

export default function ConsultantCard({ consultant }: ConsultantCardProps) {
  const router = useRouter()
  const [isFavorited, setIsFavorited] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showServiceSelection, setShowServiceSelection] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Get avatar text color based on background
  const getAvatarStyle = (college: string) => {
    const bgColor = getUniversityColor(college)
    const textColorClass = getContrastTextColor(bgColor)
    return { backgroundColor: bgColor, textColorClass }
  }

  // Calculate min price
  const minPrice = consultant.services?.length 
    ? Math.min(...consultant.services.flatMap(s => s.prices))
    : 0

  // Format response time
  const formatResponseTime = (hours?: number) => {
    if (!hours) return 'Usually responds quickly'
    if (hours < 1) return 'Responds in < 1 hour'
    if (hours < 24) return `Responds in ${Math.round(hours)}h`
    return `Responds in ${Math.round(hours / 24)}d`
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group cursor-pointer"
           onClick={() => router.push(`/consultants/${consultant.id}`)}>
      {/* Header with Status and Actions */}
      <div className="px-6 pt-5 pb-3">
        <div className="flex items-start gap-4">
          {/* Left: Avatar */}
          <div className="relative flex-shrink-0">
            {consultant.profile_image_url ? (
              <img 
                src={consultant.profile_image_url}
                alt={consultant.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div 
                className={`w-16 h-16 rounded-lg flex items-center justify-center text-lg font-bold ${getAvatarStyle(consultant.current_college).textColorClass}`}
                style={{ backgroundColor: getAvatarStyle(consultant.current_college).backgroundColor }}
              >
                {getInitials(consultant.name)}
              </div>
            )}
            {consultant.verification_status === 'approved' && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <div className="bg-blue-500 rounded-full p-1">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Middle: Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                  {consultant.name}
                </h3>
                <p className="text-sm text-gray-600">{consultant.current_college}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsFavorited(!isFavorited)
                }}
                className="text-gray-400 hover:text-red-500 transition-colors ml-2"
              >
                <svg className="w-5 h-5" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Rating and Online Status */}
            <div className="flex items-center gap-3 text-sm">
              {consultant.rating && consultant.rating > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="font-medium">{consultant.rating.toFixed(1)}</span>
                  <span className="text-gray-500">({consultant.total_reviews || 0})</span>
                </div>
              )}
              {consultant.is_available && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-green-600 text-xs font-medium">Online</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-700 line-clamp-2 mt-3 mb-3">
          {consultant.bio}
        </p>

        {/* Services Tags */}
        {consultant.services && consultant.services.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {consultant.services.slice(0, 3).map((service, index) => (
              <span 
                key={service.id || index}
                className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium"
              >
                {service.title.split(' ').slice(0, 2).join(' ')}
              </span>
            ))}
            {consultant.services.length > 3 && (
              <span className="px-2 py-0.5 text-gray-500 text-xs">
                +{consultant.services.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatResponseTime(consultant.response_time_hours)}</span>
          </div>
          {consultant.total_bookings && consultant.total_bookings > 0 && (
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>{consultant.total_bookings} students</span>
            </div>
          )}
        </div>
      </div>

      {/* Price and Actions */}
      <div className="border-t bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-600">Starting at</span>
            <p className="text-xl font-bold text-gray-900">${minPrice}</p>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (consultant.services && consultant.services.length > 0) {
                if (consultant.services.length === 1) {
                  // Single service - go directly to booking
                  setSelectedService(consultant.services[0] as Service)
                  setShowBookingModal(true)
                } else {
                  // Multiple services - show selection modal
                  setShowServiceSelection(true)
                }
              } else {
                router.push(`/consultants/${consultant.id}`)
              }
            }}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>

      {/* Service Selection Modal */}
      {showServiceSelection && consultant.services && (
        <ServiceSelectionModal
          services={consultant.services as Service[]}
          visible={showServiceSelection}
          consultantName={consultant.name}
          onClose={() => setShowServiceSelection(false)}
          onSelectService={(service) => {
            setSelectedService(service)
            setShowServiceSelection(false)
            setShowBookingModal(true)
          }}
        />
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedService && (
        <BookingModalWeb
          consultant={consultant as ConsultantWithServices}
          service={selectedService}
          visible={showBookingModal}
          onClose={() => {
            setShowBookingModal(false)
            setSelectedService(null)
          }}
          onSuccess={(bookingId) => {
            setShowBookingModal(false)
            setSelectedService(null)
            router.push(`/bookings/${bookingId}`)
          }}
        />
      )}
    </>
  )
}