'use client'

import React, { useState, useEffect } from 'react'
import { TextLink } from 'solito/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signInWithEmail, signInWithGoogle, getCurrentUser } from '../../../../../lib/auth-helpers'

interface FormError {
  field?: string
  message: string
}

export function SignInScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(false)
  const [error, setError] = useState<FormError | null>(null)

  const validateForm = (): boolean => {
    if (!email || !email.includes('@')) {
      setError({ field: 'email', message: 'Please enter a valid email address' })
      return false
    }
    if (!password || password.length < 6) {
      setError({ field: 'password', message: 'Password must be at least 6 characters' })
      return false
    }
    return true
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    setError(null)

    try {
      const { user } = await signInWithEmail(email, password)
      
      if (!user) {
        throw new Error('Sign in failed')
      }

      // Check user type and redirect accordingly
      const currentUser = await getCurrentUser()
      if (currentUser) {
        if (currentUser.userType === 'consultant') {
          router.push('/consultant-dashboard')
        } else {
          router.push('/student-dashboard')
        }
      }
    } catch (err: any) {
      console.error('Sign in error:', err)
      
      // Handle specific error cases
      if (err.message?.includes('Invalid login credentials')) {
        setError({ message: 'Invalid email or password' })
      } else if (err.message?.includes('Email not confirmed')) {
        setError({ message: 'Please check your email to confirm your account' })
      } else if (err.message?.includes('Network')) {
        setError({ message: 'Network error. Please check your connection' })
      } else {
        setError({ message: 'Failed to sign in. Please try again' })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    if (provider !== 'google') {
      setError({ message: `${provider} login is not yet implemented` })
      return
    }

    setLoading(true)
    setError(null)

    try {
      // For OAuth, we need to know the user type
      // Since this is sign-in, we'll check after they come back
      await signInWithGoogle()
      // OAuth will redirect automatically
    } catch (err: any) {
      console.error('Social login error:', err)
      setError({ message: err.message || 'Failed to sign in with Google' })
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="relative w-24 h-24 mx-auto mb-4 animate-scale-in">
            <Image
              src="/images/proofr-logo.png"
              alt="Proofr Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">proofr</h1>
          <p className="text-xl font-semibold text-white mb-1">Welcome back</p>
          <p className="text-blue-200 italic">Your dream school awaits</p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/10 animate-slide-up">
          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-3 animate-fade-in">
              <p className="text-red-200 text-sm">{error.message}</p>
            </div>
          )}

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-4 ${
                loading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-white hover:bg-gray-50'
              } text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
            >
              <Image
                src="/images/google-logo.webp"
                alt="Google"
                width={24}
                height={24}
                className="object-contain"
              />
              Continue with Google
            </button>

            <button
              onClick={() => handleSocialLogin('apple')}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-4 ${
                loading 
                  ? 'bg-gray-800 cursor-not-allowed' 
                  : 'bg-black hover:bg-gray-900'
              } text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
            >
              <Image
                src="/images/apple logo.png"
                alt="Apple"
                width={20}
                height={24}
                className="object-contain"
              />
              Continue with Apple
            </button>

            <button
              onClick={() => handleSocialLogin('linkedin')}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-4 ${
                loading 
                  ? 'bg-blue-800 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
            >
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">in</span>
              </div>
              Continue with LinkedIn
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/60 font-medium">OR</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error?.field === 'email') setError(null)
                }}
                placeholder="Email Address"
                className={`w-full bg-white/10 border ${
                  error?.field === 'email' ? 'border-red-500' : 'border-white/20'
                } rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200`}
                required
                disabled={loading}
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (error?.field === 'password') setError(null)
                }}
                placeholder="Password"
                className={`w-full bg-white/10 border ${
                  error?.field === 'password' ? 'border-red-500' : 'border-white/20'
                } rounded-xl px-4 py-3 pr-16 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200`}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-400 font-semibold text-sm hover:text-cyan-300 transition-colors duration-200"
                tabIndex={-1}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="text-left">
              <TextLink href="/forgot-password">
                <span className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition-colors duration-200">
                  Forgot Password?
                </span>
              </TextLink>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400'
              } text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
            >
              {loading ? 'Signing in...' : 'Log in'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6 pt-6 border-t border-white/10">
            <p className="text-white/70">
              Don't have an account?{' '}
              <TextLink href="/sign-up">
                <span className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors duration-200">
                  Sign up
                </span>
              </TextLink>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <TextLink href="/">
            <span className="text-white/60 hover:text-white/80 text-sm transition-colors duration-200">
              ← Back to Home
            </span>
          </TextLink>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from { 
            opacity: 0; 
            transform: scale(0) rotate(0deg); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) rotate(360deg); 
          }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(50px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out 0.2s both;
        }
      `}</style>
    </div>
  )
}