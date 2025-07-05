import { ProtectedRoute } from '../../../../lib/components/ProtectedRoute'
import StudentDashboard from './components/StudentDashboard'

export default function StudentDashboardPage() {
  return (
    <ProtectedRoute allowedUserTypes={['student']}>
      <StudentDashboard />
    </ProtectedRoute>
  )
}