'use client'

import ConsultantDashboardOriginal from '../consultant-dashboard/components/ConsultantDashboardOriginal'
import { ProtectedRoute } from '../../../../lib/components/ProtectedRoute'

export default function ConsultantDashboardV1Page() {
  return (
    <ProtectedRoute allowedUserTypes={['consultant']}>
      <ConsultantDashboardOriginal />
    </ProtectedRoute>
  )
}