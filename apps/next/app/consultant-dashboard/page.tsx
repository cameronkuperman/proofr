'use client'

import ConsultantDashboard from './components/ConsultantDashboard'
import { ProtectedRoute } from '../../../../lib/components/ProtectedRoute'

export default function ConsultantDashboardPage() {
  return (
    <ProtectedRoute allowedUserTypes={['consultant']}>
      <ConsultantDashboard />
    </ProtectedRoute>
  )
}