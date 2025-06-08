import * as React from 'react'
import { useState } from 'react'

interface FormData {
  // Common fields
  email: string
  password: string
  confirmPassword: string
  
  // Student fields
  name?: string
  currentSchool?: string
  schoolType?: 'high-school' | 'college'
  interests?: string
  preferredCollege?: string
  
  // Consultant fields
  fullName?: string
  university?: string
  graduationYear?: string
  major?: string
  specialties?: string[]
  hourlyRate?: string
}

export function OnboardingScreen() {
  const [step, setStep] = useState<'role-selection' | 'student-form' | 'consultant-form'>('role-selection')
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isAnimating, setIsAnimating] = useState(false)

  const handleRoleSelection = (role: 'student' | 'consultant') => {
    setIsAnimating(true)
    setTimeout(() => {
      setStep(role === 'student' ? 'student-form' : 'consultant-form')
      setIsAnimating(false)
    }, 300)
  }

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleBack = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setStep('role-selection')
      setIsAnimating(false)
    }, 300)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle form submission here
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffffff 0%, #f0fdff 100%)',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* Navigation Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
        zIndex: 50,
        WebkitBackdropFilter: 'blur(16px)'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 16px',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              background: '#2c3e50',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(44, 62, 80, 0.25)'
            }}>
              <span style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: '600'
              }}>📝</span>
            </div>
            <span style={{
              fontSize: '32px',
              fontWeight: '800',
              color: '#2c3e50',
              letterSpacing: '-0.02em'
            }}>proofr</span>
          </div>

          {/* Back Button */}
          {step !== 'role-selection' && (
            <button 
              onClick={handleBack}
              style={{
                background: 'none',
                border: '1px solid #e2e8f0',
                color: '#64748b',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.borderColor = '#3b82f6'
                ;(e.target as HTMLElement).style.color = '#3b82f6'
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.borderColor = '#e2e8f0'
                ;(e.target as HTMLElement).style.color = '#64748b'
              }}
            >
              ← Back
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div style={{
        width: '100%',
        maxWidth: step === 'role-selection' ? '800px' : '500px',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isAnimating ? 'scale(0.95) translateY(20px)' : 'scale(1) translateY(0)',
        opacity: isAnimating ? 0 : 1,
        marginTop: '72px'
      }}>
        
        {/* Role Selection */}
        {step === 'role-selection' && (
          <div style={{
            textAlign: 'center'
          }}>
            {/* Header */}
            <div style={{ marginBottom: '48px' }}>
              <h1 style={{
                fontSize: '48px',
                fontWeight: '900',
                margin: '0 0 16px 0',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em'
              }}>
                Welcome to Proofr
              </h1>
              <p style={{
                fontSize: '18px',
                color: '#64748b',
                margin: '0',
                fontWeight: '400'
              }}>
                Choose your path to get started
              </p>
            </div>

            {/* Role Selection Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px'
            }}>
              {/* Student Card */}
              <div
                onClick={() => handleRoleSelection('student')}
                style={{
                  background: 'white',
                  borderRadius: '24px',
                  padding: '40px 32px',
                  border: '2px solid rgba(226, 232, 240, 0.8)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)'
                  ;(e.currentTarget as HTMLElement).style.borderColor = '#3b82f6'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.15)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(226, 232, 240, 0.8)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.06)'
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px auto',
                  boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)'
                }}>
                  <span style={{ fontSize: '32px' }}>🎓</span>
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '800',
                  color: '#0f172a',
                  margin: '0 0 12px 0',
                  letterSpacing: '-0.01em'
                }}>
                  I'm a Student
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#64748b',
                  margin: '0',
                  lineHeight: '1.5',
                  fontWeight: '400'
                }}>
                  Get personalized guidance from current students at your dream schools
                </p>
              </div>

              {/* Consultant Card */}
              <div
                onClick={() => handleRoleSelection('consultant')}
                style={{
                  background: 'white',
                  borderRadius: '24px',
                  padding: '40px 32px',
                  border: '2px solid rgba(226, 232, 240, 0.8)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)'
                  ;(e.currentTarget as HTMLElement).style.borderColor = '#3b82f6'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.15)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                  ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(226, 232, 240, 0.8)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.06)'
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px auto',
                  boxShadow: '0 8px 24px rgba(29, 78, 216, 0.3)'
                }}>
                  <span style={{ fontSize: '32px' }}>👨‍🏫</span>
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '800',
                  color: '#0f172a',
                  margin: '0 0 12px 0',
                  letterSpacing: '-0.01em'
                }}>
                  I'm a Consultant
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#64748b',
                  margin: '0',
                  lineHeight: '1.5',
                  fontWeight: '400'
                }}>
                  Share your experience and help students get into their dream schools
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Student Form */}
        {step === 'student-form' && (
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '48px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)'
              }}>
                <span style={{ fontSize: '24px' }}>🎓</span>
              </div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#0f172a',
                margin: '0 0 8px 0',
                letterSpacing: '-0.02em'
              }}>
                Student Registration
              </h2>
              <p style={{
                fontSize: '16px',
                color: '#64748b',
                margin: '0',
                fontWeight: '400'
              }}>
                Tell us about yourself to get started
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '20px' }}>
                {/* Name */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => (e.target as HTMLElement).style.borderColor = '#3b82f6'}
                    onBlur={(e) => (e.target as HTMLElement).style.borderColor = '#e2e8f0'}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* Current School */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Current School *
                  </label>
                  <input
                    type="text"
                    value={formData.currentSchool || ''}
                    onChange={(e) => handleInputChange('currentSchool', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => (e.target as HTMLElement).style.borderColor = '#3b82f6'}
                    onBlur={(e) => (e.target as HTMLElement).style.borderColor = '#e2e8f0'}
                    placeholder="Your high school or college"
                    required
                  />
                </div>

                {/* School Type */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    I am currently in *
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {['high-school', 'college'].map((type) => (
                      <label key={type} style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        padding: '12px 16px',
                        border: `1px solid ${formData.schoolType === type ? '#3b82f6' : '#e2e8f0'}`,
                        borderRadius: '12px',
                        transition: 'all 0.2s ease',
                        flex: 1,
                        justifyContent: 'center',
                        background: formData.schoolType === type ? 'rgba(59, 130, 246, 0.05)' : 'white'
                      }}>
                        <input
                          type="radio"
                          name="schoolType"
                          value={type}
                          checked={formData.schoolType === type}
                          onChange={(e) => handleInputChange('schoolType', e.target.value)}
                          style={{ display: 'none' }}
                        />
                        <span style={{
                          fontSize: '16px',
                          fontWeight: '500',
                          color: formData.schoolType === type ? '#3b82f6' : '#64748b'
                        }}>
                          {type === 'high-school' ? 'High School' : 'College'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Academic Interests *
                  </label>
                  <input
                    type="text"
                    value={formData.interests || ''}
                    onChange={(e) => handleInputChange('interests', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => (e.target as HTMLElement).style.borderColor = '#3b82f6'}
                    onBlur={(e) => (e.target as HTMLElement).style.borderColor = '#e2e8f0'}
                    placeholder="e.g., Computer Science, Pre-Med, Business"
                    required
                  />
                </div>

                {/* Preferred Colleges */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Dream Schools *
                  </label>
                  <input
                    type="text"
                    value={formData.preferredCollege || ''}
                    onChange={(e) => handleInputChange('preferredCollege', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => (e.target as HTMLElement).style.borderColor = '#3b82f6'}
                    onBlur={(e) => (e.target as HTMLElement).style.borderColor = '#e2e8f0'}
                    placeholder="e.g., Harvard, Stanford, MIT"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => (e.target as HTMLElement).style.borderColor = '#3b82f6'}
                    onBlur={(e) => (e.target as HTMLElement).style.borderColor = '#e2e8f0'}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Password *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => (e.target as HTMLElement).style.borderColor = '#3b82f6'}
                    onBlur={(e) => (e.target as HTMLElement).style.borderColor = '#e2e8f0'}
                    placeholder="Create a secure password"
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => (e.target as HTMLElement).style.borderColor = '#3b82f6'}
                    onBlur={(e) => (e.target as HTMLElement).style.borderColor = '#e2e8f0'}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginTop: '24px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.transform = 'translateY(-2px)'
                  ;(e.target as HTMLElement).style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.35)'
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.transform = 'translateY(0)'
                  ;(e.target as HTMLElement).style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.25)'
                }}
              >
                Create Student Account
              </button>
            </form>
          </div>
        )}

        {/* Consultant Form */}
        {step === 'consultant-form' && (
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '48px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                boxShadow: '0 8px 24px rgba(29, 78, 216, 0.3)'
              }}>
                <span style={{ fontSize: '24px' }}>👨‍🏫</span>
              </div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#0f172a',
                margin: '0 0 8px 0',
                letterSpacing: '-0.02em'
              }}>
                Consultant Application
              </h2>
              <p style={{
                fontSize: '16px',
                color: '#64748b',
                margin: '0',
                fontWeight: '400'
              }}>
                Join our community of expert consultants
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '20px' }}>
                {/* Full Name */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName || ''}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => (e.target as HTMLElement).style.borderColor = '#3b82f6'}
                    onBlur={(e) => (e.target as HTMLElement).style.borderColor = '#e2e8f0'}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                {/* University */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    University *
                  </label>
                  <input
                    type="text"
                    value={formData.university || ''}
                    onChange={(e) => handleInputChange('university', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => (e.target as HTMLElement).style.borderColor = '#3b82f6'}
                    onBlur={(e) => (e.target as HTMLElement).style.borderColor = '#e2e8f0'}
                    placeholder="e.g., Harvard University, Stanford"
                    required
                  />
                </div>

                {/* Graduation Year */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Graduation Year *
                  </label>
                  <input
                    type="text"
                    value={formData.graduationYear || ''}
                    onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => (e.target as HTMLElement).style.borderColor = '#3b82f6'}
                    onBlur={(e) => (e.target as HTMLElement).style.borderColor = '#e2e8f0'}
                    placeholder="e.g., 2024, 2025"
                    required
                  />
                </div>

                {/* Major */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Major/Field of Study *
                  </label>
                  <input
                    type="text"
                    value={formData.major || ''}
                    onChange={(e) => handleInputChange('major', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => (e.target as HTMLElement).style.borderColor = '#3b82f6'}
                    onBlur={(e) => (e.target as HTMLElement).style.borderColor = '#e2e8f0'}
                    placeholder="e.g., Computer Science, Economics"
                    required
                  />
                </div>

                {/* Specialties */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Consulting Specialties
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {['Essay Reviews', 'Mock Interviews', 'Application Strategy', 'Resume Building', 'Scholarship Guidance', 'School-Specific Advice'].map((specialty) => (
                      <label key={specialty} style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        padding: '8px 12px',
                        border: `1px solid ${(formData.specialties || []).includes(specialty) ? '#3b82f6' : '#e2e8f0'}`,
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                        background: (formData.specialties || []).includes(specialty) ? 'rgba(59, 130, 246, 0.05)' : 'white',
                        fontSize: '14px'
                      }}>
                        <input
                          type="checkbox"
                          checked={(formData.specialties || []).includes(specialty)}
                          onChange={(e) => {
                            const current = formData.specialties || []
                            const updated = e.target.checked 
                              ? [...current, specialty]
                              : current.filter(s => s !== specialty)
                            handleInputChange('specialties', updated)
                          }}
                          style={{ marginRight: '8px' }}
                        />
                        <span style={{
                          color: (formData.specialties || []).includes(specialty) ? '#3b82f6' : '#64748b',
                          fontWeight: '500'
                        }}>
                          {specialty}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Hourly Rate */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Desired Hourly Rate *
                  </label>
                  <input
                    type="text"
                    value={formData.hourlyRate || ''}
                    onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => (e.target as HTMLElement).style.borderColor = '#3b82f6'}
                    onBlur={(e) => (e.target as HTMLElement).style.borderColor = '#e2e8f0'}
                    placeholder="e.g., $40, $60"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => (e.target as HTMLElement).style.borderColor = '#3b82f6'}
                    onBlur={(e) => (e.target as HTMLElement).style.borderColor = '#e2e8f0'}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Password *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => (e.target as HTMLElement).style.borderColor = '#3b82f6'}
                    onBlur={(e) => (e.target as HTMLElement).style.borderColor = '#e2e8f0'}
                    placeholder="Create a secure password"
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => (e.target as HTMLElement).style.borderColor = '#3b82f6'}
                    onBlur={(e) => (e.target as HTMLElement).style.borderColor = '#e2e8f0'}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginTop: '24px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 12px rgba(29, 78, 216, 0.25)'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.transform = 'translateY(-2px)'
                  ;(e.target as HTMLElement).style.boxShadow = '0 8px 20px rgba(29, 78, 216, 0.35)'
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.transform = 'translateY(0)'
                  ;(e.target as HTMLElement).style.boxShadow = '0 4px 12px rgba(29, 78, 216, 0.25)'
                }}
              >
                Submit Application
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
} 