'use client'

import React, { useState } from 'react'
import { TextLink } from 'solito/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signUpWithEmail, signUpWithGoogle, UserType } from '../../../../../lib/auth-helpers'

export function SignUpScreen() {
  const router = useRouter()
  const [userType, setUserType] = useState<UserType | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userType) {
      setError('Please select whether you are a student or consultant')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!')
      return
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const { user, error: signUpError } = await signUpWithEmail({
        email: formData.email,
        password: formData.password,
        userType,
        firstName: formData.firstName,
        lastName: formData.lastName,
      })
      
      if (signUpError) {
        throw signUpError
      }
      
      if (user) {
        // Redirect to onboarding
        router.push('/onboarding')
      }
    } catch (err: any) {
      console.error('Sign up error:', err)
      setError(err.message || 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    if (!userType) {
      setError('Please select whether you are a student or consultant')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      if (provider === 'google') {
        await signUpWithGoogle(userType)
        // OAuth will redirect automatically
      } else {
        setError(`${provider} login is not yet implemented`)
      }
    } catch (err: any) {
      console.error('Social login error:', err)
      setError(err.message || 'Failed to sign in. Please try again.')
    } finally {
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
          <p className="text-xl font-semibold text-white mb-1">Get Started</p>
          <p className="text-blue-200 italic">Your journey to your dream school begins here</p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/10 animate-slide-up">
          {/* User Type Selection */}
          {!userType && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-white mb-4 text-center">I want to:</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setUserType('student')}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-4 transition-all duration-200 group"
                >
                  <div className="text-3xl mb-2">🎓</div>
                  <div className="text-white font-semibold">Get Help</div>
                  <div className="text-xs text-white/60 mt-1">I'm a student</div>
                </button>
                <button
                  onClick={() => setUserType('consultant')}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-4 transition-all duration-200 group"
                >
                  <div className="text-3xl mb-2">💼</div>
                  <div className="text-white font-semibold">Give Help</div>
                  <div className="text-xs text-white/60 mt-1">I'm a consultant</div>
                </button>
              </div>
            </div>
          )}
          
          {/* Show selected user type */}
          {userType && (
            <div className="mb-4 flex items-center justify-between bg-white/10 rounded-lg px-4 py-2">
              <span className="text-white/80 text-sm">
                Signing up as a <strong>{userType}</strong>
              </span>
              <button
                onClick={() => setUserType(null)}
                className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold"
              >
                Change
              </button>
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-3">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}
          
          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialLogin('google')}
              className="w-full flex items-center justify-center gap-4 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
              className="w-full flex items-center justify-center gap-4 bg-black hover:bg-gray-900 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
              className="w-full flex items-center justify-center gap-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="First Name"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
                required
              />
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Last Name"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Email Address"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Password"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-16 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-400 font-semibold text-sm hover:text-cyan-300 transition-colors duration-200"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm Password"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-16 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-400 font-semibold text-sm hover:text-cyan-300 transition-colors duration-200"
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="text-xs text-white/60 space-y-1">
              <p>Password must contain:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>At least 8 characters</li>
                <li>One uppercase letter</li>
                <li>One lowercase letter</li>
                <li>One number</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading || !userType}
              className={`w-full font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg ${
                loading || !userType
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 hover:shadow-xl transform hover:-translate-y-0.5'
              } text-white`}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6 pt-6 border-t border-white/10">
            <p className="text-white/70">
              Already have an account?{' '}
              <TextLink href="/sign-in">
                <span className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors duration-200">
                  Sign in
                </span>
              </TextLink>
            </p>
          </div>

          {/* Terms and Privacy */}
          <div className="text-center mt-4">
            <p className="text-xs text-white/50">
              By creating an account, you agree to our{' '}
              <TextLink href="/terms">
                <span className="text-cyan-400 hover:text-cyan-300">Terms of Service</span>
              </TextLink>
              {' '}and{' '}
              <TextLink href="/privacy">
                <span className="text-cyan-400 hover:text-cyan-300">Privacy Policy</span>
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