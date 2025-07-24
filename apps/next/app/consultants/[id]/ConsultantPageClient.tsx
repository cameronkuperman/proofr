'use client'

import React, { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ConsultantProfile } from '../../../../../packages/app/features/consultants/components/ConsultantProfile.web'
import type { ConsultantWithServices } from '../../../../../packages/app/features/consultants/types/consultant.types'

interface ConsultantPageClientProps {
  consultant: ConsultantWithServices
}

export default function ConsultantPageClient({ consultant }: ConsultantPageClientProps) {
  const searchParams = useSearchParams()
  const shouldOpenBooking = searchParams.get('book') === 'true'

  // We'll pass this info to ConsultantProfile component
  const [initialBookingOpen, setInitialBookingOpen] = React.useState(shouldOpenBooking)

  useEffect(() => {
    if (shouldOpenBooking) {
      // Clear the query parameter after using it
      const url = new URL(window.location.href)
      url.searchParams.delete('book')
      window.history.replaceState({}, '', url)
    }
  }, [shouldOpenBooking])

  return (
    <ConsultantProfile 
      consultant={consultant} 
      initialBookingOpen={initialBookingOpen}
    />
  )
}