'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '../auth-helpers'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedUserTypes?: ('student' | 'consultant')[]
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  allowedUserTypes,
  redirectTo = '/sign-in' 
}: ProtectedRouteProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const user = await getCurrentUser()
      
      if (!user) {
        router.push(redirectTo)
        return
      }

      // Check if user type is allowed
      if (allowedUserTypes && !allowedUserTypes.includes(user.userType)) {
        // Redirect to appropriate dashboard
        if (user.userType === 'consultant') {
          router.push('/consultant-dashboard')
        } else {
          router.push('/student-dashboard')
        }
        return
      }

      // Check if onboarding is completed
      if (!user.profile?.onboarding_completed) {
        router.push('/onboarding')
        return
      }

      setIsAuthenticated(true)
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push(redirectTo)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-proofr-cyan mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}