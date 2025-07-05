'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '../../../../lib/supabase'
import { LogoutButton } from '../../../../lib/components/LogoutButton'

export default function DevMenu() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [userType, setUserType] = useState<string>('')

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      
      // Get user type
      const { data } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', user.id)
        .single()
      
      if (data) {
        setUserType(data.user_type)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Developer Menu</h1>
        
        {/* User Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current User</h2>
          {user ? (
            <div className="space-y-2">
              <p className="text-gray-600">Email: {user.email}</p>
              <p className="text-gray-600">Type: <span className="font-medium">{userType || 'Not set'}</span></p>
              <p className="text-gray-600">ID: {user.id}</p>
              <div className="pt-4">
                <LogoutButton />
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">Not logged in</p>
              <button
                onClick={() => router.push('/sign-in')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Sign In
              </button>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Auth Pages */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Authentication</h3>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/sign-in')}
                  className="block w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => router.push('/sign-up')}
                  className="block w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Student Pages */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Student Views</h3>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/student-dashboard')}
                  className="block w-full text-left px-4 py-2 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                >
                  Student Dashboard (New)
                </button>
                <button
                  onClick={() => router.push('/browse')}
                  className="block w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Browse Consultants
                </button>
              </div>
            </div>

            {/* Consultant Pages */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Consultant Views</h3>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/consultant-dashboard')}
                  className="block w-full text-left px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                >
                  Consultant Dashboard (New Clean)
                </button>
                <button
                  onClick={() => router.push('/consultant-dashboard-v1')}
                  className="block w-full text-left px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
                >
                  Consultant Dashboard (Original)
                </button>
              </div>
            </div>

            {/* Other Pages */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Other</h3>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/')}
                  className="block w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Landing Page
                </button>
                <button
                  onClick={() => router.push('/onboarding')}
                  className="block w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Onboarding
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Pro tip:</span> You can switch between student and consultant views without logging out. 
            The system will check your actual user type for protected actions.
          </p>
        </div>
      </div>
    </div>
  )
}