import * as React from 'react'
import { TextLink } from 'solito/link'
import { NavigationBar } from '../NavigationBar'

export function Hero() {
  const [showBanner, setShowBanner] = React.useState(true)
  const [currentPosition, setCurrentPosition] = React.useState(0)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])
  
  const consultants = [
    {
      initials: 'AH',
      name: 'Ashley H.',
      university: 'Stanford University',
      year: "'26",
      specialty: 'Essay Reviews',
      bio: 'CS major who pivoted from pre-med. Helped 127+ students craft compelling narratives.',
      price: '$55',
      avatar: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)',
      verified: true,
      responseTime: 'Online now',
      badge: 'Top Rated',
      rating: 4.9,
      reviews: 127
    },
    {
      initials: 'IA', 
      name: 'Imane A.',
      university: 'MIT',
      year: "'25",
      specialty: 'STEM Applications',
      bio: 'Published AI/ML researcher. Specialized in technical essay positioning.',
      price: '$68',
      avatar: 'linear-gradient(135deg, #18181B 0%, #71717A 100%)',
      verified: true,
      responseTime: 'Online now',
      badge: 'Rising Star',
      rating: 5.0,
      reviews: 89
    },
    {
      initials: 'CK',
      name: 'Cameron K.',
      university: 'Harvard University',
      year: "'24", 
      specialty: 'Leadership Essays',
      bio: 'Former McKinsey intern. Expert in leadership positioning and scholarships.',
      price: '$72',
      avatar: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      verified: true,
      responseTime: 'Online now',
      badge: 'Pro',
      rating: 4.8,
      reviews: 203
    },
    {
      initials: 'MR',
      name: 'Maya R.',
      university: 'Yale University',
      year: "'25",
      specialty: 'Liberal Arts', 
      bio: 'Philosophy & Economics double major. Specializes in interdisciplinary narratives.',
      price: '$62',
      avatar: 'linear-gradient(135deg, #71717A 0%, #18181B 100%)',
      verified: true,
      responseTime: 'Online now',
      badge: 'Choice',
      rating: 4.9,
      reviews: 156
    },
    {
      initials: 'DL',
      name: 'David L.',
      university: 'Princeton University',
      year: "'24",
      specialty: 'Mock Interviews',
      bio: 'Economics major. Former Goldman Sachs intern specializing in finance school prep.',
      price: '$65',
      avatar: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
      verified: true,
      responseTime: 'Online now',
      badge: 'Pro',
      rating: 4.8,
      reviews: 94
    },
    {
      initials: 'SK',
      name: 'Sarah K.',
      university: 'Columbia University',
      year: "'25",
      specialty: 'Pre-Med Guidance',
      bio: 'Biology & Chemistry double major. Expert in medical school application strategies.',
      price: '$59',
      avatar: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
      verified: true,
      responseTime: 'Online now',
      badge: 'Rising Star',
      rating: 4.9,
      reviews: 73
    },
    {
      initials: 'JH',
      name: 'Jordan H.',
      university: 'University of Pennsylvania',
      year: "'24",
      specialty: 'Business Applications',
      bio: 'Wharton graduate with expertise in finance and consulting application strategies.',
      price: '$70',
      avatar: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
      verified: true,
      responseTime: 'Online now',
      badge: 'Pro',
      rating: 4.8,
      reviews: 118
    },
    {
      initials: 'AL',
      name: 'Alex L.',
      university: 'Caltech',
      year: "'26",
      specialty: 'STEM Research',
      bio: 'Physics major specializing in research applications and graduate school prep.',
      price: '$63',
      avatar: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
      verified: true,
      responseTime: 'Online now',
      badge: 'Choice',
      rating: 4.9,
      reviews: 85
    }
  ]

  const categories = [
    { name: 'Essay Reviews', count: '2.1k', popular: true },
    { name: 'Mock Interviews', count: '890' },
    { name: 'Application Strategy', count: '1.5k' },
    { name: 'STEM Guidance', count: '756' },
    { name: 'Resume Building', count: '1.2k' },
    { name: 'Scholarship Help', count: '634' }
  ]

  // Navigation handlers for 8 cards in 2x2 grid (back to original)
  const handlePrevious = () => {
    setCurrentPosition(prev => Math.max(0, prev - 1))
  }
  
  const handleNext = () => {
    const maxPosition = Math.floor(consultants.length / 2) - 2  // Should be 2 for 8 cards
    setCurrentPosition(prev => Math.min(maxPosition, prev + 1))
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FFFAF6', // Keep the warm cream background you loved
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle warm abstract elements */}
      <div style={{
        position: 'absolute',
        top: '0',
        right: '0',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.04) 0%, transparent 70%)', // subtle blue
        borderRadius: '50%',
        transform: 'translate(30%, -30%)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(24, 24, 27, 0.03) 0%, transparent 70%)', // subtle black
        borderRadius: '50%',
        transform: 'translate(-30%, 30%)'
      }} />

      <NavigationBar />
      
      {/* Header - balanced approach */}
      <header style={{
        backgroundColor: 'rgba(255, 250, 246, 0.95)', // warm cream with transparency
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(229, 231, 235, 0.3)', // subtle border
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 clamp(12px, 3vw, 20px)',
          height: 'clamp(56px, 10vw, 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'nowrap'
        }}>
          {/* Logo - strong black for impact */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: '#18181B', // strong black
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: '700'
              }}>p</span>
            </div>
            <span style={{
              fontSize: '24px',
              fontWeight: '800',
              color: '#18181B', // strong black
              letterSpacing: '-0.02em'
            }}>proofr</span>
          </div>

          {/* Navigation */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'clamp(16px, 3vw, 32px)',
            flexWrap: 'wrap'
          }}>
            {['Browse', 'How it works', 'Join as consultant'].map((item) => (
              <a key={item} href="#" style={{
                color: '#6B7280', // warm muted
                textDecoration: 'none',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                fontWeight: '500',
                transition: 'color 0.2s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#18181B'} // strong black
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#6B7280'}
              >{item}</a>
            ))}
          </nav>

          {/* Auth */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <button style={{
              background: 'none',
              border: 'none',
              color: '#6B7280', // warm muted
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}>Sign in</button>
            <button style={{
              background: '#18181B', // strong black for impact
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.background = '#374151' // warm black hover
              ;(e.target as HTMLElement).style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.background = '#18181B'
              ;(e.target as HTMLElement).style.transform = 'translateY(0)'
            }}>Get started</button>
          </div>
        </div>
      </header>

      {/* Live Activity Banner - with warm blue accent */}
      {showBanner && (
        <div style={{
          backgroundColor: 'rgba(37, 99, 235, 0.05)', // subtle blue tint
          borderBottom: '1px solid rgba(229, 231, 235, 0.3)',
          padding: '8px 0',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            position: 'relative'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#2563EB', // warm blue
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }} />
            <span style={{
              fontSize: '13px',
              color: '#2563EB', // warm blue
              fontWeight: '600'
            }}>🔥 127 students got help in the last 24 hours</span>
            
            <button
              onClick={() => setShowBanner(false)}
              style={{
                position: 'absolute',
                right: '20px',
                background: 'none',
                border: 'none',
                color: '#6B7280',
                cursor: 'pointer',
                fontSize: '16px',
                lineHeight: '1',
                padding: '4px',
                borderRadius: '4px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor = 'rgba(37, 99, 235, 0.1)'
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = 'transparent'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Hero Section - bringing back the powerful original layout */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'clamp(40px, 8vw, 80px) clamp(12px, 3vw, 20px) clamp(30px, 6vw, 60px)',
        position: 'relative',
        zIndex: 5
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))',
          gap: '60px',
          alignItems: 'start'
        }}>
          {/* Left Column - bringing back the powerful tagline */}
          <div style={{ paddingTop: '20px' }}>
            {/* Trust Badge - with warm blue */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(37, 99, 235, 0.08)', // subtle blue tint
              border: '1px solid rgba(37, 99, 235, 0.2)',
              padding: '6px 12px',
              borderRadius: '20px',
              marginBottom: '24px'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                backgroundColor: '#2563EB', // warm blue
                borderRadius: '50%'
              }} />
              <span style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#2563EB', // warm blue
                letterSpacing: '0.3px'
              }}>TRUSTED BY 12,000+ STUDENTS</span>
            </div>

            {/* BRINGING BACK THE POWERFUL TAGLINE */}
            <h1 style={{
              fontSize: 'clamp(32px, 6vw, 52px)',
              fontWeight: '800',
              lineHeight: '1.1',
              margin: '0 0 20px 0',
              letterSpacing: '-0.04em',
              color: '#18181B' // strong black for maximum impact
            }}>
              Real students.
              <br />
              <span style={{ color: '#2563EB' }}>Real schools.</span> {/* warm blue accent */}
              <br />
              Real results.
            </h1>

            <p style={{
              fontSize: '18px',
              color: '#6B7280', // warm muted
              lineHeight: '1.6',
              margin: '0 0 32px 0',
              maxWidth: '420px',
              fontWeight: '400'
            }}>
              Get insider guidance from current students at Harvard, Stanford, MIT & elite universities. 
              <strong style={{ color: '#18181B' }}> Save 70% vs traditional consultants.</strong>
            </p>

            {/* Categories - with warm styling */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '32px'
            }}>
              {categories.slice(0, 4).map((cat) => (
                <button key={cat.name} style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid #E5E7EB',
                  color: '#6B7280',
                  padding: '8px 12px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: '500',
                  position: 'relative',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.borderColor = '#2563EB' // warm blue
                  ;(e.target as HTMLElement).style.color = '#2563EB'
                  ;(e.target as HTMLElement).style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.borderColor = '#E5E7EB'
                  ;(e.target as HTMLElement).style.color = '#6B7280'
                  ;(e.target as HTMLElement).style.transform = 'translateY(0)'
                }}>
                  {cat.name}
                  {cat.popular && (
                    <span style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#EF4444',
                      borderRadius: '50%'
                    }} />
                  )}
                </button>
              ))}
            </div>

            {/* CTA - strong black for impact */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '40px'
            }}>
              <button style={{
                background: '#18181B', // strong black
                color: 'white',
                border: 'none',
                padding: '14px 24px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(-2px)'
                ;(e.target as HTMLElement).style.boxShadow = '0 8px 20px rgba(24, 24, 27, 0.2)'
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(0)'
                ;(e.target as HTMLElement).style.boxShadow = 'none'
              }}>
                Find consultant
              </button>
              
              <button style={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                color: '#6B7280',
                border: '1px solid #E5E7EB',
                padding: '14px 24px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.borderColor = '#9CA3AF'
                ;(e.target as HTMLElement).style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.borderColor = '#E5E7EB'
                ;(e.target as HTMLElement).style.transform = 'translateY(0)'
              }}>
                How it works
              </button>
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex',
              gap: '32px'
            }}>
              {[
                { number: '96%', label: 'Success rate' },
                { number: '$58', label: 'Avg. price' },
                { number: '2.4hr', label: 'Avg. response' }
              ].map((stat, index) => (
                <div key={index}>
                  <div style={{ 
                    fontSize: '24px', 
                    fontWeight: '800', 
                    color: '#18181B', // strong black
                    letterSpacing: '-0.02em'
                  }}>{stat.number}</div>
                  <div style={{ 
                    fontSize: '13px',
                    color: '#6B7280', // warm muted
                    fontWeight: '500'
                  }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* BRINGING BACK THE ORIGINAL 2x2 CAROUSEL */}
          <div style={{
            position: 'relative',
            width: '660px',
            overflow: 'hidden',
            height: '700px'
          }}>
            <div 
              id="cardSlider"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 300px)', // 2x2 layout
                gridTemplateRows: 'repeat(2, 320px)',
                gap: '16px',
                width: 'calc(1200px + 100px)',
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: `translateX(${-currentPosition * 316}px)`,
                touchAction: 'pan-x'
              }}
            >
              {consultants.map((consultant, index) => (
                <div 
                  key={consultant.name} 
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', // warm white
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(229, 231, 235, 0.3)', // subtle border
                    height: '320px',
                    width: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  {/* Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: consultant.badge === 'Top Rated' ? '#EF4444' : 
                                consultant.badge === 'Rising Star' ? '#10B981' :
                                consultant.badge === 'Pro' ? '#8B5CF6' : '#F59E0B',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: '700',
                    letterSpacing: '0.3px',
                    textTransform: 'uppercase'
                  }}>
                    {consultant.badge}
                  </div>

                  {/* Avatar & Info */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '18px'
                  }}>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: consultant.avatar,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '14px',
                      position: 'relative',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                    }}>
                      <span style={{
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: '700'
                      }}>
                        {consultant.initials}
                      </span>
                      <div style={{
                        position: 'absolute',
                        bottom: '-3px',
                        right: '-3px',
                        width: '16px',
                        height: '16px',
                        background: '#10B981',
                        borderRadius: '50%',
                        border: '3px solid white'
                      }} />
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: '17px',
                        fontWeight: '700',
                        color: '#18181B', // strong black
                        margin: '0 0 4px 0'
                      }}>
                        {consultant.name}
                      </h3>
                      <p style={{
                        fontSize: '13px',
                        color: '#6B7280', // warm muted
                        margin: '0 0 6px 0',
                        fontWeight: '500'
                      }}>
                        {consultant.university} {consultant.year}
                      </p>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <span style={{ color: '#FCD34D', fontSize: '11px' }}>★</span>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#18181B' // strong black
                        }}>
                          {consultant.rating}
                        </span>
                        <span style={{
                          fontSize: '11px',
                          color: '#9CA3AF'
                        }}>
                          ({consultant.reviews})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Specialty */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: '#E5E7EB',
                    color: '#374151',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '11px',
                    fontWeight: '600',
                    marginBottom: '14px',
                    alignSelf: 'flex-start'
                  }}>
                    {consultant.specialty}
                  </div>

                  {/* Bio */}
                  <p style={{
                    fontSize: '14px',
                    color: '#6B7280', // warm muted
                    lineHeight: '1.5',
                    margin: '0 0 auto 0',
                    fontWeight: '400'
                  }}>
                    {consultant.bio}
                  </p>

                  {/* Footer */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(229, 231, 235, 0.3)',
                    marginTop: '16px'
                  }}>
                    <div>
                      <span style={{
                        fontSize: '11px',
                        color: '#9CA3AF',
                        display: 'block',
                        fontWeight: '500',
                        marginBottom: '2px'
                      }}>FROM</span>
                      <span style={{
                        fontSize: '20px',
                        fontWeight: '800',
                        color: '#18181B' // strong black
                      }}>
                        {consultant.price}
                      </span>
                    </div>
                    
                    <button style={{
                      background: '#18181B', // strong black
                      color: 'white',
                      border: 'none',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.background = '#374151' // warm black hover
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.background = '#18181B'
                    }}
                    onClick={(e) => e.stopPropagation()}>
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Left Navigation Arrow */}
            {currentPosition > 0 && (
              <button 
                style={{
                  position: 'absolute',
                  left: '-10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '44px',
                  height: '44px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(229, 231, 235, 0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.2s ease',
                  zIndex: 10,
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)'
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)'
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.08)'
                }}
                onClick={handlePrevious}
              >
                <span style={{
                  fontSize: '18px',
                  color: '#6B7280',
                  fontWeight: '700'
                }}>←</span>
              </button>
            )}

            {/* Right Navigation Arrow */}
            {currentPosition < Math.floor(consultants.length / 2) - 2 && (
              <button 
                style={{
                  position: 'absolute',
                  right: '-10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '44px',
                  height: '44px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(229, 231, 235, 0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.2s ease',
                  zIndex: 10,
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)'
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)'
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.08)'
                }}
                onClick={handleNext}
              >
                <span style={{
                  fontSize: '18px',
                  color: '#6B7280',
                  fontWeight: '700'
                }}>→</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Popular Services Section - Refined with warm blue accents */}
      <section style={{
        backgroundColor: 'rgba(37, 99, 235, 0.02)', // very subtle blue tint
        borderTop: '1px solid rgba(229, 231, 235, 0.3)',
        padding: '80px 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '60px'
          }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#18181B',
              margin: '0 0 16px 0',
              letterSpacing: '-0.02em'
            }}>
              Popular services
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#6B7280',
              fontWeight: '400'
            }}>
              Browse by category or search for specific help
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '20px'
          }}>
            {categories.map((category, index) => (
              <div key={category.name} style={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '20px',
                padding: '28px 24px',
                border: '1px solid rgba(229, 231, 235, 0.3)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.15)'
                e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.2)'
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.95)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.04)'
                e.currentTarget.style.borderColor = 'rgba(229, 231, 235, 0.3)'
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'
              }}>
                {category.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: '#2563EB',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '9px',
                    fontWeight: '700'
                  }}>HOT</div>
                )}
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#18181B',
                  margin: '0 0 8px 0'
                }}>
                  {category.name}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#9CA3AF',
                  margin: '0',
                  fontWeight: '500'
                }}>
                  {category.count} services
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works - Clean Anthropic style */}
      <section style={{
        padding: '120px 0',
        backgroundColor: '#FFFAF6' // keep warm background
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '80px'
          }}>
            <h2 style={{
              fontSize: '42px',
              fontWeight: '700',
              color: '#18181B',
              margin: '0 0 24px 0',
              letterSpacing: '-0.02em'
            }}>
              How Proofr works
            </h2>
            <p style={{
              fontSize: '20px',
              color: '#6B7280',
              maxWidth: '500px',
              margin: '0 auto',
              fontWeight: '400',
              lineHeight: '1.6'
            }}>
              Get expert guidance in three simple steps
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '60px'
          }}>
            {[
              {
                step: '01',
                title: 'Browse & Choose',
                desc: 'Find the perfect consultant based on their university, specialty, and reviews.',
                icon: '🔍'
              },
              {
                step: '02', 
                title: 'Book & Connect',
                desc: 'Schedule a session and connect directly with your chosen consultant.',
                icon: '📅'
              },
              {
                step: '03',
                title: 'Get Results',
                desc: 'Receive personalized feedback and guidance to strengthen your application.',
                icon: '🎯'
              }
            ].map((item, index) => (
              <div key={index} style={{
                textAlign: 'center',
                position: 'relative'
              }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: 'rgba(37, 99, 235, 0.08)',
                  borderRadius: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 32px auto',
                  fontSize: '36px',
                  border: '1px solid rgba(37, 99, 235, 0.1)',
                  position: 'relative'
                }}>
                  {item.icon}
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '-12px',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#2563EB',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    padding: '8px 12px',
                    borderRadius: '20px',
                    border: '1px solid rgba(37, 99, 235, 0.2)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    {item.step}
                  </div>
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#18181B',
                  margin: '0 0 16px 0'
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#6B7280',
                  margin: '0',
                  lineHeight: '1.6',
                  fontWeight: '400'
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof - Anthropic inspired */}
      <section style={{
        backgroundColor: 'rgba(37, 99, 235, 0.02)',
        padding: '100px 0',
        borderTop: '1px solid rgba(229, 231, 235, 0.3)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '60px'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '600',
              color: '#18181B',
              margin: '0 0 16px 0'
            }}>
              Trusted by students at top universities
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#6B7280',
              fontWeight: '400'
            }}>
              Join thousands who've successfully navigated admissions
            </p>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '60px',
            flexWrap: 'wrap',
            opacity: 0.8,
            marginBottom: '80px'
          }}>
            {['Harvard', 'Stanford', 'MIT', 'Yale', 'Princeton', 'Columbia'].map((school) => (
              <div key={school} style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#6B7280',
                letterSpacing: '0.5px'
              }}>
                {school}
              </div>
            ))}
          </div>

          {/* Stats - Anthropic style cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
            padding: '40px 32px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '24px',
            border: '1px solid rgba(229, 231, 235, 0.3)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.04)',
            backdropFilter: 'blur(10px)'
          }}>
            {[
              { number: '12,000+', label: 'Students helped' },
              { number: '96%', label: 'Success rate' },
              { number: '500+', label: 'Expert consultants' },
              { number: '4.9/5', label: 'Average rating' }
            ].map((stat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '28px',
                  fontWeight: '800',
                  color: '#18181B',
                  marginBottom: '8px'
                }}>
                  {stat.number}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  fontWeight: '500'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Strong but warm */}
      <section style={{
        backgroundColor: '#18181B',
        padding: '120px 0',
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
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          textAlign: 'center',
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
            Ready to get started?
          </h2>
          <p style={{
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.8)',
            margin: '0 0 48px 0',
            maxWidth: '500px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.6'
          }}>
            Join thousands of students who've transformed their applications with expert guidance.
          </p>
          
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button style={{
              background: '#2563EB', // warm blue
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
              Browse consultants
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
              Become a consultant
            </button>
          </div>
        </div>
      </section>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        @media (max-width: 768px) {
          #cardSlider {
            overflow-x: auto !important;
            scroll-snap-type: x mandatory;
          }
          #cardSlider > div {
            scroll-snap-align: start;
            flex-shrink: 0;
          }
        }
      `}</style>
    </div>
  )
}