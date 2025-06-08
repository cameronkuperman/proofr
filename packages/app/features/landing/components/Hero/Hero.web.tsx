import * as React from 'react'
import { TextLink } from 'solito/link'

export function Hero() {
  const consultants = [
    {
      initials: 'AH',
      name: 'Ashley H.',
      university: 'Stanford University',
      year: "'26",
      specialty: 'Essay Reviews',
      bio: 'Specialized in personal statements and supplemental essays. Helped 50+ students get into top schools.',
      price: '$45',
      avatar: 'linear-gradient(135deg, #ef9a9a 0%, #e57373 100%)'
    },
    {
      initials: 'IA', 
      name: 'Imane A.',
      university: 'MIT',
      year: "'25",
      specialty: 'Application Strategy',
      bio: 'Expert in STEM applications and research positioning. Published researcher with proven results.',
      price: '$60',
      avatar: 'linear-gradient(135deg, #9c88ff 0%, #8c7ae6 100%)'
    },
    {
      initials: 'CK',
      name: 'Cameron K.',
      university: 'Duke University',
      year: "'24", 
      specialty: 'Essay Reviews',
      bio: 'Founder & consultant. Specializes in leadership essays and scholarship applications.',
      price: '$40',
      avatar: 'linear-gradient(135deg, #70a1ff 0%, #5352ed 100%)'
    },
    {
      initials: 'SD',
      name: 'Sean D.',
      university: 'Yale University',
      year: "'26",
      specialty: 'Essay Reviews', 
      bio: 'English major with expertise in storytelling and narrative structure for college essays.',
      price: '$50',
      avatar: 'linear-gradient(135deg, #70a1ff 0%, #5352ed 100%)'
    }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8f9fa',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      {/* Navigation Header */}
      <header style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
        position: 'sticky',
        top: 0,
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

          {/* Navigation Links */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '40px'
          }}>
            {['Browse Consultants', 'How It Works', 'Become a Consultant', 'About'].map((item) => (
              <a key={item} href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} style={{
                color: '#64748b',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#2c3e50'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#64748b'}
              >{item}</a>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <button style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#2c3e50'}
            onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#64748b'}
            >Sign In</button>
            <button style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(-1px)'
              ;(e.target as HTMLElement).style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.35)'
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(0)'
              ;(e.target as HTMLElement).style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.25)'
            }}
            >Get Started</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '60px 16px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.1fr',
          gap: '48px',
          alignItems: 'start'
        }}>
          {/* Left Column - Text Content & Search */}
          <div style={{ paddingTop: '20px' }}>
            <h1 style={{
              fontSize: '68px',
              fontWeight: '900',
              lineHeight: '0.95',
              margin: '0 0 28px 0',
              letterSpacing: '-0.04em',
              background: 'linear-gradient(135deg, #3b82f6 0%,rgb(0, 0, 0) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Get Into Your{' '}
              <br />
              Dream School
            </h1>

            <p style={{
              fontSize: '20px',
              color: '#64748b',
              lineHeight: '1.5',
              margin: '0 0 40px 0',
              maxWidth: '520px',
              fontWeight: '400'
            }}>
              Connect with current students at Harvard, Stanford, MIT & top universities. Get personalized admissions guidance at affordable prices.
            </p>

            {/* Search Bar */}
            <div style={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '8px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              outline: 'none'
            }}
            >
              <div style={{
                padding: '0 18px',
                color: '#64748b',
                fontSize: '18px'
              }}>
                🔍
              </div>
              <input
                type="text"
                placeholder="Search for essay reviews, mock interviews, application strategy..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '17px',
                  padding: '18px 14px',
                  color: '#0f172a',
                  backgroundColor: 'transparent',
                  fontWeight: '400',
                  boxShadow: 'none'
                }}
              />
              <button style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                padding: '14px 24px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(-1px)'
                ;(e.target as HTMLElement).style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(0)'
                ;(e.target as HTMLElement).style.boxShadow = 'none'
              }}
              >
                Search
              </button>
            </div>

            {/* Popular Services */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '40px',
              flexWrap: 'wrap'
            }}>
              <span style={{ 
                color: '#64748b', 
                fontSize: '17px',
                fontWeight: '500'
              }}>Popular:</span>
              {['essay reviews', 'mock interviews', 'application strategy', 'resume help'].map((service) => (
                <button key={service} style={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  color: '#374151',
                  padding: '10px 18px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = 'linear-gradient(135deg, #3b82f6 0%, rgb(27, 36, 109) 100%)'
                  ;(e.target as HTMLElement).style.color = 'white'
                  ;(e.target as HTMLElement).style.borderColor = '#3b82f6'
                  ;(e.target as HTMLElement).style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = 'white'
                  ;(e.target as HTMLElement).style.color = '#374151'
                  ;(e.target as HTMLElement).style.borderColor = '#e2e8f0'
                  ;(e.target as HTMLElement).style.transform = 'translateY(0)'
                }}
                >
                  {service}
                </button>
              ))}
            </div>

            <div style={{
              display: 'flex',
              gap: '18px',
              marginBottom: '56px'
            }}>
              <button style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, rgb(27, 36, 109) 100%)',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(-2px)'
                ;(e.target as HTMLElement).style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.35)'
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(0)'
                ;(e.target as HTMLElement).style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.25)'
              }}
              >Find a Consultant</button>
              
              <button style={{
                backgroundColor: 'white',
                color: '#374151',
                border: '1px solid #e2e8f0',
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.borderColor = '#3b82f6'
                ;(e.target as HTMLElement).style.color = '#3b82f6'
                ;(e.target as HTMLElement).style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.borderColor = '#e2e8f0'
                ;(e.target as HTMLElement).style.color = '#374151'
                ;(e.target as HTMLElement).style.transform = 'translateY(0)'
              }}
              >Become a Consultant</button>
            </div>

            <div style={{
              display: 'flex',
              gap: '44px'
            }}>
              {[
                { number: '94%', label: 'Success Rate' },
                { number: '500+', label: 'Expert Consultants' },
                { number: '10K+', label: 'Students Helped' }
              ].map((stat, index) => (
                <div key={index}>
                  <div style={{ 
                    fontSize: '32px', 
                    fontWeight: '900', 
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.02em'
                  }}>{stat.number}</div>
                  <div style={{ 
                    fontSize: '15px',
                    color: '#64748b',
                    fontWeight: '600'
                  }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Consultant Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            width: '100%'
          }}>
            {consultants.map((consultant, index) => (
              <div key={consultant.name} style={{
                backgroundColor: 'white',
                borderRadius: '24px',
                padding: '28px 24px',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                position: 'relative',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer',
                minHeight: '340px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 20px rgba(0, 0, 0, 0.04)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(250, 251, 252, 0.8) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                overflow: 'hidden'
              }}
                              onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 8px 40px rgba(0, 0, 0, 0.12), 0 2px 16px rgba(59, 130, 246, 0.08)'
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'
                }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 20px rgba(0, 0, 0, 0.04)'
                e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.8)'
              }}
              >
                {/* Modern Gradient Background */}
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  height: '4px',
                  background: 'linear-gradient(90deg, #3b82f6, #1d4ed8, #3b82f6)',
                  borderRadius: '24px 24px 0 0',
                  zIndex: 1
                }} />

                {/* Online Status */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  backdropFilter: 'blur(8px)',
                  color: '#059669',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '10px',
                  fontWeight: '600',
                  letterSpacing: '0.5px',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  zIndex: 2
                }}>
                  ● ONLINE
                </div>

                {/* Avatar and Name Section */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '20px',
                  marginTop: '8px'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    background: consultant.avatar,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    border: '3px solid white',
                    position: 'relative'
                  }}>
                    <span style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: '700'
                    }}>
                      {consultant.initials}
                    </span>
                    <div style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      width: '20px',
                      height: '20px',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      borderRadius: '50%',
                      border: '3px solid white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        background: 'white',
                        borderRadius: '50%'
                      }} />
                    </div>
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#0f172a',
                      margin: '0 0 4px 0',
                      letterSpacing: '-0.02em'
                    }}>
                      {consultant.name}
                    </h3>
                    <p style={{
                      fontSize: '13px',
                      color: '#64748b',
                      margin: '0 0 4px 0',
                      fontWeight: '500'
                    }}>
                      {consultant.university} {consultant.year}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <span style={{ 
                        color: '#fbbf24', 
                        fontSize: '12px' 
                      }}>★★★★★</span>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#0f172a'
                      }}>
                        4.9
                      </span>
                      <span style={{
                        fontSize: '11px',
                        color: '#64748b',
                        fontWeight: '500'
                      }}>
                        (127 reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Specialty Badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(59, 130, 246, 0.08)',
                  color: '#3b82f6',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600',
                  marginBottom: '16px',
                  border: '1px solid rgba(59, 130, 246, 0.15)',
                  alignSelf: 'flex-start',
                  letterSpacing: '0.3px'
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#3b82f6'
                  }} />
                  {consultant.specialty.toUpperCase()}
                </div>

                {/* Bio */}
                <p style={{
                  fontSize: '14px',
                  color: '#64748b',
                  lineHeight: '1.5',
                  margin: '0 0 20px 0',
                  flex: 1,
                  fontWeight: '400'
                }}>
                  {consultant.bio}
                </p>

                {/* Price and Button */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(226, 232, 240, 0.8)'
                }}>
                  <div>
                    <span style={{
                      fontSize: '11px',
                      color: '#64748b',
                      display: 'block',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '2px',
                      fontWeight: '500'
                    }}>From</span>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: '800',
                      color: '#2c3e50',
                      letterSpacing: '-0.02em'
                    }}>
                      {consultant.price}
                    </span>
                  </div>
                  
                  <button style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%,rgb(27, 36, 109) 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.25)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px) scale(1.02)'
                    e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)'
                    e.stopPropagation()
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)'
                    e.target.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.25)'
                  }}
                  onClick={(e) => e.stopPropagation()}
                  >
                    <span style={{ position: 'relative', zIndex: 1 }}>View Profile</span>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                      transition: 'left 0.5s'
                    }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.6) 0%, rgba(241, 245, 249, 0.8) 100%)',
        borderTop: '1px solid rgba(148, 163, 184, 0.08)',
        padding: '80px 0'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 16px',
          textAlign: 'center'
        }}>
          {/* Header */}
          <div style={{
            marginBottom: '24px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto',
              boxShadow: '0 12px 30px rgba(59, 130, 246, 0.3)'
            }}>
              <span style={{
                color: 'white',
                fontSize: '32px'
              }}>🎓</span>
            </div>
            <h2 style={{
              fontSize: '44px',
              fontWeight: '900',
              color: '#0f172a',
              margin: '0',
              letterSpacing: '-0.02em'
            }}>
              Services Our Consultants Offer
            </h2>
          </div>

          {/* Services Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
            marginBottom: '80px',
            marginTop: '64px'
          }}>
            {[
              { icon: '📝', title: 'Essay Reviews', desc: 'Personal statements, supplements, and application essays' },
              { icon: '💬', title: 'Mock Interviews', desc: 'Practice with students who aced their interviews' },
              { icon: '🎯', title: 'Application Strategy', desc: 'School selection, timeline planning, and positioning' },
              { icon: '📋', title: 'Resume Building', desc: 'Activities section and resume optimization' },
              { icon: '🏆', title: 'Scholarship Guidance', desc: 'Find and apply for merit-based awards' },
              { icon: '📚', title: 'School-Specific Advice', desc: 'Insider tips from current students' }
            ].map((service, index) => (
              <div key={index} style={{
                padding: '36px 28px',
                backgroundColor: 'white',
                              borderRadius: '16px',
              border: '1px solid rgba(148, 163, 184, 0.08)',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(0, 0, 0, 0.04)'
              }}
              >
                <div style={{ fontSize: '44px', marginBottom: '20px' }}>{service.icon}</div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  color: '#0f172a',
                  margin: '0 0 12px 0',
                  letterSpacing: '-0.01em'
                }}>
                  {service.title}
                </h3>
                <p style={{
                  fontSize: '15px',
                  color: '#64748b',
                  margin: '0',
                  lineHeight: '1.6',
                  fontWeight: '400'
                }}>
                  {service.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%,rgb(35, 35, 241) 100%)',
            color: 'white',
            padding: '60px',
            borderRadius: '28px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background pattern */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
              pointerEvents: 'none'
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px',
                marginBottom: '24px'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '28px' }}>🚀</span>
                </div>
                <h3 style={{
                  fontSize: '38px',
                  fontWeight: '900',
                  margin: '0',
                  letterSpacing: '-0.02em'
                }}>
                  Ready to get started?
                </h3>
              </div>
              <p style={{
                fontSize: '18px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: '0 0 36px 0',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto',
                fontWeight: '400'
              }}>
                Join thousands of students who have successfully navigated admissions with our consultants.
              </p>
              <div style={{
                display: 'flex',
                gap: '18px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '18px 36px',
                  borderRadius: '14px',
                  fontSize: '17px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 12px 30px rgba(255, 255, 255, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = 'none'
                }}
                >
                  Browse Consultants
                </button>
                <button style={{
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.8)',
                  padding: '16px 36px',
                  borderRadius: '14px',
                  fontSize: '17px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                  e.target.style.borderColor = 'white'
                  e.target.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.8)'
                  e.target.style.transform = 'translateY(0)'
                }}
                >
                  Become a Consultant
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}