import React from 'react'
import { NavigationBar } from '../../landing/components/NavigationBar/NavigationBar'

type Section = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  visual: React.ReactElement;
};

export function HowItWorksScreen(): JSX.Element {
  const [activeSection, setActiveSection] = React.useState(0)
  
  React.useEffect(() => {
    const handleScroll = () => {
      const studentSections = document.querySelectorAll('[data-student-section]')
      const consultantSections = document.querySelectorAll('[data-consultant-section]')
      const scrollPosition = window.scrollY + window.innerHeight / 2
      
      // Handle student sections
      studentSections.forEach((section, index) => {
        const element = section as HTMLElement
        const sectionTop = element.offsetTop
        const sectionHeight = element.offsetHeight
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(index)
        }
      })

      // Handle consultant sections  
      consultantSections.forEach((section, index) => {
        const element = section as HTMLElement
        const sectionTop = element.offsetTop
        const sectionHeight = element.offsetHeight
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          // Consultant sections are tracked after student sections
          setActiveSection(studentSections.length + index)
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const studentSections: Section[] = [
    {
      id: 'ai-matching',
      title: 'AI-powered matching',
      subtitle: 'Your personalized For You feed',
      description: 'Our algorithms analyze your profile, application needs, and past student success to surface the perfect consultants. No searching needed - we bring the best matches to you.',
      visual: (
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '2px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          maxWidth: '480px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            {/* Twitter-style tabs */}
            <div style={{
              background: '#ffffff',
              padding: '16px 20px 0 20px',
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
            }}>
              <div style={{
                display: 'flex',
                gap: '24px'
              }}>
                <button style={{
                  background: 'none',
                  border: 'none',
                  padding: '12px 0',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#111827',
                  borderBottom: '3px solid #4f46e5',
                  marginBottom: '-1px'
                }}>
                  For You
                </button>
                <button style={{
                  background: 'none',
                  border: 'none',
                  padding: '12px 0',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#6b7280',
                  borderBottom: '3px solid transparent',
                  marginBottom: '-1px'
                }}>
                  All Gigs
                </button>
              </div>
            </div>
            
            {/* Futuristic AI-matched consultants */}
            <div style={{
              padding: '24px'
            }}>
              {/* Linear-style AI indicator */}
              <div style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                border: '1px solid rgba(14, 165, 233, 0.1)'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: '#0ea5e9',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }}></div>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#0f172a' 
                }}>
                  AI-matched consultants based on your needs
                </div>
              </div>
              
              {/* Futuristic consultant card */}
              <div style={{
                background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid rgba(14, 165, 233, 0.2)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '16px',
                position: 'relative',
                boxShadow: '0 4px 24px rgba(14, 165, 233, 0.08)',
                transition: 'all 0.2s ease'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(14, 165, 233, 0.2)'
                }}>98% MATCH</div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>SL</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#111827' }}>Sarah Liu</div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>Harvard '25 • Essay Expert</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>$45</div>
                    <div style={{ fontSize: '11px', color: '#f59e0b' }}>⭐ 4.9</div>
                  </div>
                </div>
                
                <div style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  marginBottom: '12px',
                  lineHeight: '1.4'
                }}>
                  Helped 12 students with leadership essays get into Ivies this year
                </div>
                
                <button style={{
                  background: '#111827',
                  color: 'white',
                  border: 'none',
                  padding: '8px 0',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  width: '100%'
                }}>
                  View Profile →
                </button>
              </div>
              
              {/* Secondary match */}
              <div style={{
                background: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#e5e7eb',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b7280',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>MC</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>Mike Chen • MIT '24</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>Technical Essays • $35</div>
                </div>
                <div style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: '600' }}>92% match</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'browse-connect',
      title: 'Browse & Connect',
      subtitle: 'Find your perfect consultant',
      description: 'View consultant profiles, read reviews, check response times, and choose who feels right for your goals.',
      visual: (
        <div style={{
          display: 'grid',
          gap: '16px',
          maxWidth: '500px'
        }}>
          {[
            { name: 'Sarah K.', school: 'Harvard \'25', specialty: 'Essay Reviews', price: '$35', rating: '4.9', reviews: '67' },
            { name: 'David L.', school: 'Stanford \'24', specialty: 'Mock Interviews', price: '$50', rating: '4.8', reviews: '89' },
            { name: 'Maya R.', school: 'MIT \'25', specialty: 'STEM Apps', price: 'Free', rating: '5.0', reviews: '34' }
          ].map((consultant, i) => (
            <div key={i} style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(229, 231, 235, 0.3)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.04)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#18181B', margin: '0 0 4px 0' }}>{consultant.name}</h4>
                  <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>{consultant.school}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#18181B' }}>{consultant.price}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>⭐ {consultant.rating} ({consultant.reviews})</div>
                </div>
              </div>
              <div style={{
                background: 'rgba(37, 99, 235, 0.1)',
                color: '#2563EB',
                padding: '6px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                display: 'inline-block'
              }}>{consultant.specialty}</div>
            </div>
          ))}
        </div>
      )
    },
    {
      id: 'collaborate',
      title: 'Collaborate Flexibly',
      subtitle: 'Work however suits you best',
      description: 'Share documents securely, get feedback at your pace, message for updates when needed, schedule calls if desired.',
      visual: (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid rgba(229, 231, 235, 0.3)',
          boxShadow: '0 20px 40px rgba(37, 99, 235, 0.1)',
          backdropFilter: 'blur(10px)',
          maxWidth: '450px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: '#2563EB',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600'
              }}>SK</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#18181B' }}>Sarah K.</div>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>Harvard \'25</div>
              </div>
            </div>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              margin: '0 0 12px 0',
              background: 'rgba(255, 255, 255, 0.8)',
              padding: '12px',
              borderRadius: '8px'
            }}>
              "Great essay! I've added comments throughout. Focus on strengthening your conclusion - it needs more personal reflection. Overall structure is solid though! 👍"
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#059669',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600'
              }}>📎 Essay_v2_reviewed.docx</span>
              <span style={{
                background: 'rgba(245, 158, 11, 0.1)',
                color: '#D97706',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600'
              }}>🎯 Action items</span>
            </div>
          </div>
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            background: 'rgba(0, 0, 0, 0.02)',
            padding: '12px',
            borderRadius: '8px'
          }}>
            <input style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '14px',
              color: '#6B7280'
            }} placeholder="Thanks! Quick question about..." />
            <button style={{
              background: '#2563EB',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600'
            }}>Send</button>
          </div>
        </div>
      )
    },
    {
      id: 'pay-fair',
      title: 'Pay What\'s Fair',
      subtitle: 'Save 90-95% vs traditional consultants',
      description: 'Consultants set their own prices. Many offer sliding scale pricing. Some provide free initial reviews.',
      visual: (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(229, 231, 235, 0.3)',
          boxShadow: '0 20px 40px rgba(16, 185, 129, 0.1)',
          backdropFilter: 'blur(10px)',
          maxWidth: '400px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#18181B',
              margin: '0 0 8px 0'
            }}>Your Investment</h4>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              margin: 0
            }}>vs Traditional Consultants</p>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            <div style={{
              flex: 1,
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#059669' }}>$35</div>
              <div style={{ fontSize: '12px', color: '#059669', fontWeight: '600' }}>Proofr</div>
            </div>
            <div style={{
              flex: 1,
              background: 'rgba(239, 68, 68, 0.1)',
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#DC2626' }}>$500+</div>
              <div style={{ fontSize: '12px', color: '#DC2626', fontWeight: '600' }}>Traditional</div>
            </div>
          </div>
          
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            padding: '12px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#059669' }}>93% Savings</div>
            <div style={{ fontSize: '12px', color: '#059669' }}>You save $465</div>
          </div>
        </div>
      )
    }
  ];

  const consultantSections: Section[] = [
    {
      id: 'create-profile',
      title: 'Create Your Profile',
      subtitle: 'Showcase your expertise',
      description: 'Add your university, experiences, and specialties. Verification is optional but builds trust and gets you highlighted.',
      visual: (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(229, 231, 235, 0.3)',
          boxShadow: '0 20px 40px rgba(139, 115, 85, 0.1)',
          backdropFilter: 'blur(10px)',
          maxWidth: '400px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #8B7355 0%, #6B7280 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              color: 'white',
              fontSize: '20px',
              fontWeight: '700'
            }}>JD</div>
            <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#18181B', margin: '0 0 4px 0' }}>Jordan Davis</h4>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 8px 0' }}>Harvard University '24</p>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#059669',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600',
              display: 'inline-block'
            }}>✓ Verified</div>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#18181B', margin: '0 0 8px 0' }}>Specialties</h5>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Essay Reviews', 'Mock Interviews', 'Application Strategy'].map((specialty, i) => (
                <span key={i} style={{
                  background: 'rgba(37, 99, 235, 0.1)',
                  color: '#2563EB',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>{specialty}</span>
              ))}
            </div>
          </div>
          
          <div style={{
            background: 'rgba(37, 99, 235, 0.05)',
            padding: '12px',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>Profile Strength</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                flex: 1,
                height: '6px',
                background: 'rgba(229, 231, 235, 0.3)',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: '85%',
                  height: '100%',
                  background: '#2563EB'
                }} />
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#2563EB' }}>85%</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'set-services',
      title: 'Set your services & prices',
      subtitle: 'You control everything',
      description: 'Define what you offer and set your own prices. Choose to offer free initial consultations to build reviews, or charge premium rates for specialized expertise.',
      visual: (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid rgba(229, 231, 235, 0.3)',
          boxShadow: '0 20px 40px rgba(37, 99, 235, 0.1)',
          backdropFilter: 'blur(10px)',
          maxWidth: '450px'
        }}>
          <h4 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#18181B',
            margin: '0 0 16px 0'
          }}>Your Services & Pricing</h4>
          
          {[
            { service: 'Essay Review', description: 'Comprehensive feedback on personal statements', price: '$35', duration: '2-3 days' },
            { service: 'Mock Interview', description: 'Practice interview with detailed feedback', price: '$50', duration: '1 hour' },
            { service: 'Quick Question', description: 'Answer specific admissions questions', price: 'Free', duration: 'Same day' }
          ].map((item, i) => (
            <div key={i} style={{
              background: 'rgba(37, 99, 235, 0.05)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#18181B', margin: '0 0 4px 0' }}>{item.service}</h5>
                  <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>{item.description}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#2563EB' }}>{item.price}</div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>{item.duration}</div>
                </div>
              </div>
              <div style={{
                background: item.price === 'Free' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                color: item.price === 'Free' ? '#059669' : '#2563EB',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600',
                display: 'inline-block'
              }}>
                {item.price === 'Free' ? 'Reputation Builder' : `You earn ${item.price === '$35' ? '$28' : '$40'}`}
              </div>
            </div>
          ))}
          
          <button style={{
            background: '#18181B',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            width: '100%',
            marginTop: '8px'
          }}>+ Add New Service</button>
        </div>
      )
    },
    {
      id: 'help-students',
      title: 'Help Students',
      subtitle: 'Share your authentic experiences',
      description: 'Respond to requests, share your insights, and help students achieve their dreams while building meaningful relationships.',
      visual: (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid rgba(229, 231, 235, 0.3)',
          boxShadow: '0 20px 40px rgba(16, 185, 129, 0.1)',
          backdropFilter: 'blur(10px)',
          maxWidth: '500px'
        }}>
          <h4 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#18181B',
            margin: '0 0 16px 0'
          }}>Recent Student Requests</h4>
          
          {[
            { 
              student: 'Alex M.', 
              request: 'Need help with Stanford supplemental essays', 
              budget: '$40-60', 
              urgent: false,
              match: 95 
            },
            { 
              student: 'Maria S.', 
              request: 'Mock interview for Harvard alumni interview', 
              budget: '$50', 
              urgent: true,
              match: 88 
            },
            { 
              student: 'David K.', 
              request: 'Quick feedback on Common App activities section', 
              budget: 'Free-$20', 
              urgent: false,
              match: 92 
            }
          ].map((request, i) => (
            <div key={i} style={{
              background: 'rgba(37, 99, 235, 0.05)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '12px',
              border: request.urgent ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid transparent'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#18181B', margin: '0 0 4px 0' }}>{request.student}</h5>
                  <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 8px 0' }}>{request.request}</p>
                </div>
                <div style={{
                  background: request.match >= 90 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: request.match >= 90 ? '#059669' : '#D97706',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  {request.match}% match
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{
                  background: '#2563EB',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>{request.budget}</span>
                {request.urgent && (
                  <span style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#EF4444',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>🚨 Urgent</span>
                )}
              </div>
            </div>
          ))}
          
          <button style={{
            background: '#059669',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            width: '100%'
          }}>View All Requests</button>
        </div>
      )
    },
    {
      id: 'earn-flexibly',
      title: 'Earn Flexibly',
      subtitle: 'Work when you want, help who you want',
      description: 'Work around your class schedule, choose projects that interest you, and build something meaningful while earning.',
      visual: (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(229, 231, 235, 0.3)',
          boxShadow: '0 20px 40px rgba(16, 185, 129, 0.1)',
          backdropFilter: 'blur(10px)',
          maxWidth: '400px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#18181B',
              margin: '0 0 8px 0'
            }}>This Month's Impact</h4>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#059669' }}>12</div>
              <div style={{ fontSize: '12px', color: '#059669', fontWeight: '600' }}>Students Helped</div>
            </div>
            <div style={{
              background: 'rgba(37, 99, 235, 0.1)',
              padding: '16px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#2563EB' }}>$420</div>
              <div style={{ fontSize: '12px', color: '#2563EB', fontWeight: '600' }}>Earned</div>
            </div>
          </div>
          
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#18181B' }}>Average Rating</span>
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#D97706' }}>4.9 ⭐</span>
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280' }}>Based on 47 reviews</div>
          </div>
          
          <div style={{
            background: 'rgba(139, 115, 85, 0.1)',
            padding: '12px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '12px', color: '#8B7355', fontWeight: '600', marginBottom: '4px' }}>Next Goal</div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#18181B' }}>Help 15 students this month</div>
            <div style={{
              width: '100%',
              height: '6px',
              background: 'rgba(139, 115, 85, 0.2)',
              borderRadius: '3px',
              marginTop: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '80%',
                height: '100%',
                background: '#8B7355'
              }} />
            </div>
          </div>
        </div>
      )
    }
  ];

  // Render component
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif'
    }}>
      <NavigationBar />
      
      {/* Full-Screen Hero Section - Cluely Gradient Style */}
      <section style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, #e0f2fe 0%, #f0f9ff 40%, #ffffff 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Center gradient glow - like a screen emanating light */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '120%',
          height: '120%',
          background: 'radial-gradient(circle at center, rgba(14, 165, 233, 0.08) 0%, transparent 50%)',
          filter: 'blur(100px)'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '80%',
          background: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.06) 0%, transparent 60%)',
          filter: 'blur(60px)'
        }}></div>

        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 40px',
          textAlign: 'center',
          zIndex: 2
        }}>
          <div style={{ marginBottom: '120px' }}>
            <h1 style={{
              fontSize: 'clamp(48px, 6vw, 72px)',
              fontWeight: '600',
              color: '#0f172a',
              margin: '0 0 24px 0',
              letterSpacing: '-0.03em',
              lineHeight: '1.0'
            }}>
              Perfect your application with
              <br />
              elite university students.
            </h1>
            
            <p style={{
              fontSize: '20px',
              color: '#64748b',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.5',
              fontWeight: '400'
            }}>
              Get personalized help from students at top schools who've been where you're going.
            </p>
          </div>


          {/* Modern App Interface - Like Soshi */}
          <div style={{
            maxWidth: '800px',
            margin: '-20px auto 0 auto',
            perspective: '1500px'
          }}>
            <div style={{
              background: '#0f172a',
              borderRadius: '16px',
              padding: '4px',
              boxShadow: '0 50px 100px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              transform: 'rotateX(5deg)',
              transformOrigin: 'center bottom'
            }}>
              <div style={{
                background: '#1e293b',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                {/* App Header Bar */}
                <div style={{
                  background: '#0f172a',
                  padding: '16px 24px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: 'white'
                    }}>P</div>
                    <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>Proofr Dashboard</span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      color: 'white',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}>Sign In</button>
                    <button style={{
                      background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      color: 'white',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>Get Started</button>
                  </div>
                </div>

                {/* Main App Content */}
                <div style={{
                  padding: '32px',
                  background: '#1e293b'
                }}>
                  {/* AI Match Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '24px'
                  }}>
                    <div>
                      <h3 style={{ color: 'white', fontSize: '20px', fontWeight: '600', margin: '0 0 4px 0' }}>
                        AI-Matched Consultants
                      </h3>
                      <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
                        Based on your Common App essay needs
                      </p>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'rgba(14, 165, 233, 0.1)',
                      padding: '6px 12px',
                      borderRadius: '20px'
                    }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        background: '#0ea5e9',
                        borderRadius: '50%',
                        animation: 'pulse 2s infinite'
                      }}></div>
                      <span style={{ color: '#0ea5e9', fontSize: '12px', fontWeight: '500' }}>Live Matching</span>
                    </div>
                  </div>

                  {/* Consultant Cards Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px'
                  }}>
                    {[
                      { name: 'Sarah Liu', school: 'Harvard \'25', specialty: 'Essay Review', price: '$45', match: '98%', rating: '4.9', admitted: '47' },
                      { name: 'Mike Chen', school: 'MIT \'24', specialty: 'STEM Apps', price: '$35', match: '94%', rating: '4.8', admitted: '31' }
                    ].map((consultant, i) => (
                      <div key={i} style={{
                        background: i === 0 ? 'rgba(14, 165, 233, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px',
                          background: i === 0 ? '#0ea5e9' : 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '4px 8px',
                          borderRadius: '6px'
                        }}>{consultant.match}</div>
                        
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            background: i === 0 
                              ? 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' 
                              : 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '18px',
                            fontWeight: '600'
                          }}>{consultant.name.split(' ').map(n => n[0]).join('')}</div>
                          
                          <div style={{ flex: 1 }}>
                            <h4 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>
                              {consultant.name}
                            </h4>
                            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 12px 0' }}>
                              {consultant.school} • {consultant.specialty}
                            </p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                              <div>
                                <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '2px' }}>Rate</div>
                                <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>{consultant.price}</div>
                              </div>
                              <div>
                                <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '2px' }}>Rating</div>
                                <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>⭐ {consultant.rating}</div>
                              </div>
                              <div>
                                <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '2px' }}>Admitted</div>
                                <div style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>{consultant.admitted}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intermediate Section - Cluely Style */}
      <section style={{
        padding: '160px 0',
        background: '#ffffff',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 40px'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '24px'
          }}>
            THE FUTURE OF COLLEGE ADMISSIONS
          </div>
          
          <h2 style={{
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: '600',
            color: '#0f172a',
            margin: '0 0 32px 0',
            letterSpacing: '-0.03em',
            lineHeight: '1.1'
          }}>
            Proofr matches you with
            <br />
            consultants who get results.
          </h2>
          
          <p style={{
            fontSize: '20px',
            color: '#64748b',
            lineHeight: '1.6',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Our AI analyzes thousands of successful applications to find consultants whose students consistently get into your dream schools.
          </p>
        </div>
      </section>

      {/* For Students - Sophisticated split scroll */}
      <section style={{
        background: '#ffffff',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1600px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          minHeight: '400vh',
          alignItems: 'start',
          gap: '0'
        }}>
          {/* Left side - Sticky content */}
          <div style={{
            position: 'sticky',
            top: '0',
            padding: '120px 80px',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
          }}>
            <div style={{
              maxWidth: '480px'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e40af',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '16px'
              }}>
                FOR STUDENTS
              </div>
              
              <h2 style={{
                fontSize: '56px',
                fontWeight: '700',
                color: '#0f172a',
                margin: '0 0 32px 0',
                letterSpacing: '-0.04em',
                lineHeight: '1.0'
              }}>
                Find your perfect
                <br />
                consultant match.
              </h2>
              
              {/* Twitter-style tabs */}
              <div style={{
                display: 'flex',
                gap: '0',
                marginBottom: '32px',
                borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                width: 'fit-content',
                margin: '0 auto 32px auto'
              }}>
                <button style={{
                  background: 'none',
                  border: 'none',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: activeSection === 0 ? '#1e40af' : '#6b7280',
                  borderBottom: activeSection === 0 ? '3px solid #1e40af' : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                  For You ✨
                </button>
                <button style={{
                  background: 'none',
                  border: 'none',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: activeSection !== 0 ? '#1e40af' : '#6b7280',
                  borderBottom: activeSection !== 0 ? '3px solid #1e40af' : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                  All Gigs
                </button>
              </div>
              
              {/* Dynamic content based on scroll position */}
              <div style={{
                minHeight: '160px',
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#0f172a',
                  margin: '0 0 12px 0',
                  letterSpacing: '-0.01em'
                }}>
                  {studentSections[activeSection]?.title || (studentSections.length > 0 ? studentSections[0].title : '')}
                </h3>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#1e40af',
                  margin: '0 0 16px 0'
                }}>
                  {studentSections[activeSection]?.subtitle || (studentSections.length > 0 ? studentSections[0].subtitle : '')}
                </div>
                <p style={{
                  fontSize: '18px',
                  color: '#64748b',
                  lineHeight: '1.7',
                  fontWeight: '400'
                }}>
                  {studentSections[activeSection]?.description || (studentSections.length > 0 ? studentSections[0].description : '')}
                </p>
              </div>
              
              <div style={{
                display: 'flex',
                gap: '4px',
                marginTop: '40px'
              }}>
                {studentSections.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      width: index === activeSection ? '32px' : '8px',
                      height: '4px',
                      background: index === activeSection ? '#1e40af' : 'rgba(30, 64, 175, 0.2)',
                      borderRadius: '2px',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Scrolling visuals */}
          <div style={{
            padding: '120px 80px 120px 40px',
            background: '#ffffff'
          }}>
            {studentSections.map((section) => (
              <div
                key={section.id}
                data-student-section
                style={{
                  minHeight: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  padding: '60px 0'
                }}
              >
                {section.visual}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Consultants - Same split scroll pattern */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(139, 115, 85, 0.02) 0%, rgba(139, 115, 85, 0.05) 100%)',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          minHeight: '400vh',
          alignItems: 'start'
        }}>
          {/* Left side - Scrolling visuals for consultants */}
          <div style={{
            padding: '80px 40px 80px 20px'
          }}>
            {consultantSections.map((section) => (
              <div
                key={section.id}
                data-consultant-section
                style={{
                  minHeight: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '40px 0'
                }}
              >
                {section.visual}
              </div>
            ))}
          </div>

          {/* Right side - Sticky content for consultants */}
          <div style={{
            position: 'sticky',
            top: '120px',
            padding: '80px 40px',
            height: 'fit-content'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '24px',
              padding: '48px',
              border: '1px solid rgba(229, 231, 235, 0.3)',
              boxShadow: '0 20px 40px rgba(139, 115, 85, 0.1)',
              backdropFilter: 'blur(20px)'
            }}>
              <h2 style={{
                fontSize: '48px',
                fontWeight: '700',
                color: '#18181B',
                margin: '0 0 24px 0',
                letterSpacing: '-0.02em'
              }}>
                For Consultants
              </h2>
              <p style={{
                fontSize: '20px',
                color: '#6B7280',
                lineHeight: '1.6',
                marginBottom: '32px'
              }}>
                Share your knowledge, help others succeed, and earn flexibly while building something meaningful.
              </p>
              
              {/* Dynamic content for consultants */}
              <div style={{
                minHeight: '200px',
                transition: 'all 0.6s ease'
              }}>
                <h3 style={{
                  fontSize: '28px',
                  fontWeight: '600',
                  color: '#8B7355',
                  margin: '0 0 16px 0'
                }}>
                  {consultantSections[Math.max(0, activeSection - studentSections.length)]?.title || (consultantSections.length > 0 ? consultantSections[0].title : '')}
                </h3>
                <h4 style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  color: '#18181B',
                  margin: '0 0 16px 0'
                }}>
                  {consultantSections[Math.max(0, activeSection - studentSections.length)]?.subtitle || (consultantSections.length > 0 ? consultantSections[0].subtitle : '')}
                </h4>
                <p style={{
                  fontSize: '16px',
                  color: '#6B7280',
                  lineHeight: '1.6'
                }}>
                  {consultantSections[Math.max(0, activeSection - studentSections.length)]?.description || (consultantSections.length > 0 ? consultantSections[0].description : '')}
                </p>
              </div>
              
              <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '32px'
              }}>
                {consultantSections.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      width: '40px',
                      height: '4px',
                      background: index === Math.max(0, activeSection - studentSections.length) ? '#8B7355' : 'rgba(139, 115, 85, 0.2)',
                      borderRadius: '2px',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        padding: '120px 0',
        background: '#18181B',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'radial-gradient(circle at 30% 40%, rgba(37, 99, 235, 0.15) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />
        
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 20px',
          position: 'relative',
          zIndex: 1
        }}>
          <h2 style={{
            fontSize: '48px',
            fontWeight: '700',
            color: 'white',
            margin: '0 0 24px 0',
            letterSpacing: '-0.02em'
          }}>
            Ready to join the marketplace?
          </h2>
          <p style={{
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.8)',
            margin: '0 0 48px 0',
            lineHeight: '1.6'
          }}>
            Whether you need help or want to help others, there's a place for you here.
          </p>
          
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button style={{
              background: '#2563EB',
              color: 'white',
              border: 'none',
              padding: '20px 40px',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(-2px)'
              ;(e.target as HTMLElement).style.boxShadow = '0 12px 30px rgba(37, 99, 235, 0.4)'
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(0)'
              ;(e.target as HTMLElement).style.boxShadow = 'none'
            }}>
              Find Help as Student
            </button>
            
            <button style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              padding: '18px 40px',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
              ;(e.target as HTMLElement).style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = 'transparent'
              ;(e.target as HTMLElement).style.transform = 'translateY(0)'
            }}>
              Start Helping as Consultant
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}