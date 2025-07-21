import React, { useState, useEffect } from 'react'
import { View, Text, Pressable } from 'react-native'
import { useConsultant } from '../hooks/useConsultant'
import { ConsultantProfileHeader } from './ConsultantProfileHeader'
import { ConsultantServices } from './ConsultantServices'
import { ConsultantStats } from './ConsultantStats'
import { ConsultantBio } from './ConsultantBio'
import { ConsultantReviews } from './ConsultantReviews'
import { BookingModal } from './BookingModal'
import type { ConsultantWithServices, Service } from '../types/consultant.types'

interface ConsultantProfileProps {
  consultant?: ConsultantWithServices // For server-side rendering
  consultantId?: string // For client-side fetching
}

export function ConsultantProfile({ consultant: initialConsultant, consultantId }: ConsultantProfileProps) {
  const { consultant: fetchedConsultant, stats, loading, error } = useConsultant(
    consultantId || initialConsultant?.id || ''
  )
  
  const consultant = initialConsultant || fetchedConsultant
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setShowBookingModal(true)
  }

  const handleBookingClose = () => {
    setShowBookingModal(false)
    setSelectedService(null)
  }

  const handleBookingSuccess = (bookingId: string) => {
    // Handle successful booking (e.g., show success message, navigate to booking details)
    console.log('Booking created:', bookingId)
    handleBookingClose()
  }

  if (!consultantId && !initialConsultant) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No consultant data available</Text>
      </View>
    )
  }

  if (loading && !consultant) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading consultant profile...</Text>
      </View>
    )
  }

  if (error || !consultant) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error loading consultant profile</Text>
        <Text style={{ marginTop: 8, opacity: 0.7 }}>{error}</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Profile Content */}
      <View style={{ flex: 1 }}>
        <ConsultantProfileHeader consultant={consultant} />
        
        {stats && (
          <ConsultantStats 
            consultant={consultant} 
            stats={stats}
          />
        )}
        
        <ConsultantBio 
          bio={consultant.long_bio || consultant.bio}
          achievements={consultant.colleges_attended}
        />
        
        <ConsultantServices 
          services={consultant.services || []}
          onServiceSelect={handleServiceSelect}
        />
        
        <ConsultantReviews 
          consultantId={consultant.id}
          rating={consultant.rating}
          totalReviews={consultant.total_reviews}
        />
      </View>

      {/* Booking Modal */}
      {showBookingModal && selectedService && (
        <BookingModal
          consultant={consultant}
          service={selectedService}
          visible={showBookingModal}
          onClose={handleBookingClose}
          onSuccess={handleBookingSuccess}
        />
      )}
    </View>
  )
}