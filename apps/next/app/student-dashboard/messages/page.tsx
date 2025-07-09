import { ProtectedRoute } from '../../../../../lib/components/ProtectedRoute'
import StudentMessages from './components/StudentMessages'

export default function StudentMessagesPage() {
  return (
    <ProtectedRoute allowedUserTypes={['student']}>
      <StudentMessages />
    </ProtectedRoute>
  )
}