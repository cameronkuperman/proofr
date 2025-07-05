'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../../../../lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userType = searchParams.get('type') as 'student' | 'consultant' | null

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the user from the current session
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) throw userError
        if (!user) {
          router.push('/sign-up')
          return
        }

        // Check if user already exists in our database
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (existingUser) {
          // User already exists, redirect based on their type
          if (existingUser.user_type === 'consultant') {
            router.push('/consultant-dashboard')
          } else {
            router.push('/student-dashboard')
          }
          return
        }

        // New user - create profile
        if (!userType) {
          // If no user type specified, redirect to signup
          router.push('/sign-up')
          return
        }

        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email!,
            user_type: userType,
            auth_provider: ['google'],
          })

        if (profileError) throw profileError

        // Create type-specific profile
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
        
        const { error: typeError } = await supabase
          .from(userType === 'student' ? 'students' : 'consultants')
          .insert({
            id: user.id,
            name,
            ...(userType === 'consultant' && { verification_status: 'pending' })
          })

        if (typeError) throw typeError

        // Redirect to onboarding
        router.push('/onboarding')
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/sign-up?error=auth_failed')
      }
    }

    handleCallback()
  }, [router, userType])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">Setting up your account...</p>
      </div>
    </div>
  )
}