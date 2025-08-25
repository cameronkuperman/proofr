'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ConsultantReviewsWeb } from './ConsultantReviews.web'
import type { ConsultantWithServices } from '../types/consultant.types'
import { Avatar } from '../../../components/Avatar'

interface ConsultantProfileProps {
  consultant: ConsultantWithServices
  initialBookingOpen?: boolean
}

export function ConsultantProfile({ consultant, initialBookingOpen = false }: ConsultantProfileProps) {
  const router = useRouter()
  // Removed unused booking modal state since we redirect to appointments page
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'reviews'>('services')

  // Auto-redirect to appointments if requested
  React.useEffect(() => {
    if (initialBookingOpen && consultant.services?.length > 0) {
      // Redirect to appointments with first service
      router.push(`/appointments?consultant=${consultant.id}&service=${consultant.services[0].id}`)
    }
  }, [initialBookingOpen, consultant.services, consultant.id, router])

  // Removed getInitials and getAvatarStyle - now using Avatar component

  return (
    <>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/browse" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Browse
            </a>
            <button className="text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <Avatar
                    name={consultant.name}
                    imageUrl={consultant.profile_image_url}
                    size="2xl"
                    rounded="lg"
                    verified={consultant.verification_status === 'approved'}
                    className="w-32 h-32"
                    useGradient={true}
                  />
                  {consultant.is_available && (
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-green-600">Available Now</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900">{consultant.name}</h1>
                      <p className="text-lg text-gray-600 mt-1">{consultant.current_college}</p>
                      {consultant.major && (
                        <p className="text-gray-500 mt-1">Major: {consultant.major}</p>
                      )}
                    </div>
                    {consultant.verification_status === 'approved' && (
                      <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium">Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Stats Bar */}
                  <div className="flex items-center gap-6 mt-4 text-sm">
                    {consultant.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500 text-lg">★</span>
                        <span className="font-semibold">{consultant.rating.toFixed(1)}</span>
                        <span className="text-gray-500">({consultant.total_reviews} reviews)</span>
                      </div>
                    )}
                    {consultant.total_bookings > 0 && (
                      <div className="text-gray-600">
                        <span className="font-semibold">{consultant.total_bookings}</span> students helped
                      </div>
                    )}
                    {consultant.response_time_hours && (
                      <div className="text-gray-600">
                        Responds in <span className="font-semibold">{consultant.response_time_hours}h</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-3 mt-4">
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                      Message
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                      Share Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="border-b">
                <div className="flex">
                  {(['about', 'services', 'reviews'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-4 px-6 text-sm font-medium capitalize transition-colors ${
                        activeTab === tab
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'about' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">About Me</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {consultant.long_bio || consultant.bio || 'No bio provided yet.'}
                      </p>
                    </div>

                    {consultant.colleges_attended && consultant.colleges_attended.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Education</h3>
                        <div className="space-y-3">
                          {(consultant.colleges_attended as any[]).map((edu, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                              <div>
                                <p className="font-medium">{edu.name}</p>
                                <p className="text-sm text-gray-600">
                                  {edu.degree} in {edu.major} • Class of {edu.graduation_year}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'services' && (
                  <div className="grid gap-4">
                    {consultant.services?.map((service) => (
                      <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg text-gray-900">{service.title}</h4>
                            <p className="text-gray-600 mt-1">{service.description}</p>
                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                              <span>Delivery: {service.delivery_type}</span>
                              <span>Duration: {service.duration_minutes} min</span>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-2xl font-bold text-gray-900">${Math.min(...service.prices)}</p>
                            <button 
                              onClick={() => {
                                router.push(`/appointments?consultant=${consultant.id}&service=${service.id}`)
                              }}
                              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <ConsultantReviewsWeb 
                    consultantId={consultant.id}
                    rating={consultant.rating}
                    totalReviews={consultant.total_reviews}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Book a Service</h3>
              
              {consultant.services && consultant.services.length > 0 ? (
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <p className="text-sm text-gray-600 mb-2">Starting at</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ${Math.min(...consultant.services.flatMap(s => s.prices))}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Quick Book Options:</p>
                    {consultant.services.slice(0, 3).map((service) => (
                      <button
                        key={service.id}
                        onClick={() => {
                          router.push(`/appointments?consultant=${consultant.id}&service=${service.id}`)
                        }}
                        className="w-full text-left p-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                      >
                        <p className="font-medium text-sm text-gray-900">{service.title}</p>
                        <p className="text-sm text-gray-600">${Math.min(...service.prices)}</p>
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => {
                      // If only one service, go directly to appointments
                      if (consultant.services.length === 1) {
                        router.push(`/appointments?consultant=${consultant.id}&service=${consultant.services[0].id}`)
                      } else {
                        setActiveTab('services')
                      }
                    }}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    {consultant.services.length === 1 ? 'Book Now' : `View All Services (${consultant.services.length})`}
                  </button>

                  <div className="text-center text-sm text-gray-500 pt-2">
                    <p>💡 2% cashback on all bookings</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No services available yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Booking now handled via appointments page */}
    </>
  )
}