import * as React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, updateStudentProfile, updateConsultantProfile, submitConsultantVerification } from '../../../../../lib/auth-helpers'

interface StudentFormData {
  current_school: string
  school_type: 'high-school' | 'college'
  interests: string[]
  preferred_colleges: string[]
  grade_level?: string
  bio?: string
}

interface ConsultantFormData {
  current_college: string
  graduation_year: string
  major: string
  bio: string
  long_bio: string
  edu_email: string
  specializations: string[]
}

export function OnboardingScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userType, setUserType] = useState<'student' | 'consultant' | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  
  const [studentData, setStudentData] = useState<StudentFormData>({
    current_school: '',
    school_type: 'high-school',
    interests: [],
    preferred_colleges: [],
    grade_level: '',
    bio: ''
  })
  
  // Temporary string states for comma-separated inputs
  const [interestsInput, setInterestsInput] = useState('')
  const [collegesInput, setCollegesInput] = useState('')
  
  const [consultantData, setConsultantData] = useState<ConsultantFormData>({
    current_college: '',
    graduation_year: '',
    major: '',
    bio: '',
    long_bio: '',
    edu_email: '',
    specializations: []
  })

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const user = await getCurrentUser()
      if (!user) {
        router.push('/sign-up')
        return
      }
      
      setUserId(user.id)
      setUserType(user.userType)
      
      // Check if onboarding is already completed
      if (user.profile?.onboarding_completed) {
        if (user.userType === 'consultant') {
          router.push('/consultant-dashboard')
        } else {
          router.push('/student-dashboard')
        }
        return
      }
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/sign-up')
    } finally {
      setLoading(false)
    }
  }

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    
    // Process comma-separated values before submission
    const interests = interestsInput.split(',').map(i => i.trim()).filter(i => i)
    const colleges = collegesInput.split(',').map(c => c.trim()).filter(c => c)
    
    try {
      await updateStudentProfile(userId!, {
        ...studentData,
        interests,
        preferred_colleges: colleges,
        onboarding_completed: true
      })
      
      router.push('/student-dashboard')
    } catch (error: any) {
      console.error('Error updating profile:', error)
      setError(error.message || 'Failed to update profile')
    } finally {
      setSubmitting(false)
    }
  }

  const handleConsultantSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    
    try {
      // Update consultant profile
      await updateConsultantProfile(userId!, {
        current_college: consultantData.current_college,
        graduation_year: parseInt(consultantData.graduation_year),
        major: consultantData.major,
        bio: consultantData.bio,
        long_bio: consultantData.long_bio
      })
      
      // Submit for verification
      const { autoVerified } = await submitConsultantVerification(userId!, {
        edu_email: consultantData.edu_email,
        university_name: consultantData.current_college
      })
      
      if (autoVerified) {
        router.push('/consultant-dashboard')
      } else {
        router.push('/consultant-dashboard?status=pending-verification')
      }
    } catch (error: any) {
      console.error('Error updating profile:', error)
      setError(error.message || 'Failed to update profile')
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box' as const,
    backgroundColor: '#f8fafb',
    color: '#374151'
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdff 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #e2e8f0',
            borderTopColor: '#3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#64748b', fontSize: '16px' }}>Loading your profile...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
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
      {/* Header */}
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
        </div>
      </header>

      {/* Main Content */}
      <div style={{
        width: '100%',
        maxWidth: '500px',
        marginTop: '72px'
      }}>
        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '16px',
            color: '#dc2626',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Student Form */}
        {userType === 'student' && (
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
                Complete Your Profile
              </h2>
              <p style={{
                fontSize: '16px',
                color: '#64748b',
                margin: '0',
                fontWeight: '400'
              }}>
                Tell us about yourself to get personalized help
              </p>
            </div>

            <form onSubmit={handleStudentSubmit}>
              <div style={{ display: 'grid', gap: '20px' }}>
                {/* Bio */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Short Bio
                  </label>
                  <textarea
                    value={studentData.bio}
                    onChange={(e) => setStudentData({...studentData, bio: e.target.value})}
                    style={{...inputStyle, minHeight: '80px', resize: 'vertical'}}
                    placeholder="Tell us a bit about yourself and your goals"
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
                    value={studentData.current_school}
                    onChange={(e) => setStudentData({...studentData, current_school: e.target.value})}
                    style={inputStyle}
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
                    {(['high-school', 'college'] as const).map((type) => (
                      <label key={type} style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        padding: '12px 16px',
                        border: `1px solid ${studentData.school_type === type ? '#3b82f6' : '#e2e8f0'}`,
                        borderRadius: '12px',
                        transition: 'all 0.2s ease',
                        flex: 1,
                        justifyContent: 'center',
                        background: studentData.school_type === type ? 'rgba(59, 130, 246, 0.05)' : '#f8fafb'
                      }}>
                        <input
                          type="radio"
                          name="schoolType"
                          value={type}
                          checked={studentData.school_type === type}
                          onChange={(e) => setStudentData({...studentData, school_type: type})}
                          style={{ display: 'none' }}
                        />
                        <span style={{
                          fontSize: '16px',
                          fontWeight: '500',
                          color: studentData.school_type === type ? '#3b82f6' : '#64748b'
                        }}>
                          {type === 'high-school' ? 'High School' : 'College'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Grade Level */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Grade Level
                  </label>
                  <select
                    value={studentData.grade_level}
                    onChange={(e) => setStudentData({...studentData, grade_level: e.target.value})}
                    style={inputStyle}
                  >
                    <option value="">Select grade level</option>
                    <option value="freshman">Freshman</option>
                    <option value="sophomore">Sophomore</option>
                    <option value="junior">Junior</option>
                    <option value="senior">Senior</option>
                    <option value="transfer">Transfer Student</option>
                  </select>
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
                    value={interestsInput}
                    onChange={(e) => setInterestsInput(e.target.value)}
                    onBlur={(e) => {
                      const interests = e.target.value.split(',').map(i => i.trim()).filter(i => i)
                      setStudentData({...studentData, interests})
                    }}
                    style={inputStyle}
                    placeholder="e.g., Computer Science, Pre-Med, Business"
                    required
                  />
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Separate multiple interests with commas
                  </p>
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
                    value={collegesInput}
                    onChange={(e) => setCollegesInput(e.target.value)}
                    onBlur={(e) => {
                      const colleges = e.target.value.split(',').map(c => c.trim()).filter(c => c)
                      setStudentData({...studentData, preferred_colleges: colleges})
                    }}
                    style={inputStyle}
                    placeholder="e.g., Harvard, Stanford, MIT"
                    required
                  />
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    List your top choice schools separated by commas
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  marginTop: '24px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: submitting ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.25)'
                }}
              >
                {submitting ? 'Saving...' : 'Complete Profile'}
              </button>
            </form>
          </div>
        )}

        {/* Consultant Form */}
        {userType === 'consultant' && (
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
                Complete Your Profile
              </h2>
              <p style={{
                fontSize: '16px',
                color: '#64748b',
                margin: '0',
                fontWeight: '400'
              }}>
                Set up your consultant profile for verification
              </p>
            </div>

            <form onSubmit={handleConsultantSubmit}>
              <div style={{ display: 'grid', gap: '20px' }}>
                {/* University */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Current University *
                  </label>
                  <input
                    type="text"
                    value={consultantData.current_college}
                    onChange={(e) => setConsultantData({...consultantData, current_college: e.target.value})}
                    style={inputStyle}
                    placeholder="e.g., Harvard University, Stanford"
                    required
                  />
                </div>

                {/* University Email */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    University Email (.edu) *
                  </label>
                  <input
                    type="email"
                    value={consultantData.edu_email}
                    onChange={(e) => setConsultantData({...consultantData, edu_email: e.target.value})}
                    style={inputStyle}
                    placeholder="your.name@university.edu"
                    pattern=".*\.edu$"
                    title="Please enter a valid .edu email address"
                    required
                  />
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    Used for instant verification if it matches your university
                  </p>
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
                    value={consultantData.graduation_year}
                    onChange={(e) => setConsultantData({...consultantData, graduation_year: e.target.value})}
                    style={inputStyle}
                    placeholder="e.g., 2024, 2025"
                    pattern="[0-9]{4}"
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
                    value={consultantData.major}
                    onChange={(e) => setConsultantData({...consultantData, major: e.target.value})}
                    style={inputStyle}
                    placeholder="e.g., Computer Science, Economics"
                    required
                  />
                </div>

                {/* Short Bio */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Short Bio (for profile cards) *
                  </label>
                  <textarea
                    value={consultantData.bio}
                    onChange={(e) => setConsultantData({...consultantData, bio: e.target.value})}
                    style={{...inputStyle, minHeight: '60px', resize: 'vertical'}}
                    placeholder="Brief introduction (appears on browse page)"
                    maxLength={150}
                    required
                  />
                  <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                    {consultantData.bio.length}/150 characters
                  </p>
                </div>

                {/* Long Bio */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Detailed Bio (for full profile) *
                  </label>
                  <textarea
                    value={consultantData.long_bio}
                    onChange={(e) => setConsultantData({...consultantData, long_bio: e.target.value})}
                    style={{...inputStyle, minHeight: '120px', resize: 'vertical'}}
                    placeholder="Tell students about your experience, achievements, and how you can help them"
                    required
                  />
                </div>

                {/* Specializations */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Areas of Expertise
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {['Essay Reviews', 'Mock Interviews', 'Application Strategy', 'Resume Building', 'Scholarship Guidance', 'Test Prep'].map((specialty) => (
                      <label key={specialty} style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        padding: '8px 12px',
                        border: `1px solid ${consultantData.specializations.includes(specialty) ? '#3b82f6' : '#e2e8f0'}`,
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                        background: consultantData.specializations.includes(specialty) ? 'rgba(59, 130, 246, 0.05)' : '#f8fafb',
                        fontSize: '14px'
                      }}>
                        <input
                          type="checkbox"
                          checked={consultantData.specializations.includes(specialty)}
                          onChange={(e) => {
                            const updated = e.target.checked 
                              ? [...consultantData.specializations, specialty]
                              : consultantData.specializations.filter(s => s !== specialty)
                            setConsultantData({...consultantData, specializations: updated})
                          }}
                          style={{ marginRight: '8px' }}
                        />
                        <span style={{
                          color: consultantData.specializations.includes(specialty) ? '#3b82f6' : '#64748b',
                          fontWeight: '500'
                        }}>
                          {specialty}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  background: submitting ? '#94a3b8' : 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '16px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  marginTop: '24px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: submitting ? 'none' : '0 4px 12px rgba(29, 78, 216, 0.25)'
                }}
              >
                {submitting ? 'Submitting...' : 'Submit for Verification'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}