'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '../supabase'

interface LogoutButtonProps {
  className?: string
  children?: React.ReactNode
}

export function LogoutButton({ className, children }: LogoutButtonProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/sign-in')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className={className || "px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"}
    >
      {children || 'Log Out'}
    </button>
  )
}