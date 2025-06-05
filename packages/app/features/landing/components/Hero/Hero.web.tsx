import * as React from 'react'
import { TextLink } from 'solito/link'
import { NavigationBar } from '../NavigationBar'

export function Hero() {
  return (
    <>
      <NavigationBar />
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.3
        }} />

        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '4rem',
          alignItems: 'center',
          padding: '0 3rem',
          paddingTop: '120px',
          paddingBottom: '60px',
          position: 'relative',
          zIndex: 2
        }}>
          {/* Content Column */}
          <div>
            {/* Trust Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50px',
              padding: '0.5rem 1.5rem',
              marginBottom: '2rem',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              <span style={{ marginRight: '0.5rem' }}>🏆</span>
              Trusted by 10,000+ students from top universities
            </div>

            {/* Main Headline */}
            <h1 style={{
              fontSize: '4.5rem',
              fontWeight: '800',
              color: 'white',
              lineHeight: '1.1',
              margin: '0 0 1.5rem 0',
              letterSpacing: '-0.02em'
            }}>
              Get Into Your{' '}
              <span style={{
                background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent'
              }}>
                Dream School
              </span>
            </h1>

            <p style={{
              fontSize: '1.4rem',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: '1.6',
              margin: '0 0 3rem 0',
              maxWidth: '600px'
            }}>
              Connect with current students at Harvard, Stanford, MIT & top universities. 
              Get personalized admissions guidance at affordable prices.
            </p>

            {/* Search Bar */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '0.75rem',
              marginBottom: '2rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                color: '#64748b',
                padding: '0 0.5rem'
              }}>
                🔍
              </div>
              <input
                type="text"
                placeholder="What service do you need? Essay review, mock interview..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '1.1rem',
                  padding: '0.75rem 0',
                  color: '#1e293b'
                }}
              />
              <button style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}>
                Search
              </button>
            </div>

            {/* Popular Services */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '3rem',
              flexWrap: 'wrap'
            }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.95rem' }}>Popular:</span>
              {['Essay Review', 'Mock Interview', 'App Strategy', 'Resume Review'].map((service) => (
                <button key={service} style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '25px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  {service}
                </button>
              ))}
            </div>

            {/* CTAs */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <TextLink href="/browse">
                <button style={{
                  background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                  color: '#1e293b',
                  border: 'none',
                  padding: '1.2rem 2.5rem',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(252, 182, 159, 0.4)',
                  transition: 'all 0.3s ease'
                }}>
                  Find a Consultant
                </button>
              </TextLink>
              
              <TextLink href="/become-consultant">
                <button style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  padding: '1.2rem 2.5rem',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}>
                  Become a Consultant
                </button>
              </TextLink>
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex',
              gap: '3rem',
              color: 'rgba(255, 255, 255, 0.9)'
            }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem' }}>94%</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Success Rate</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem' }}>500+</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Expert Consultants</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.25rem' }}>10K+</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Students Helped</div>
              </div>
            </div>
          </div>

          {/* Consultant Cards Column */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1.5rem',
            height: 'fit-content'
          }}>
            {/* Consultant Card 1 */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              transform: 'translateY(-20px)',
              animation: 'fadeInUp 0.8s ease-out'
            }}>
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: '#10b981',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                Online
              </div>
              
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #dc2626, #fca5a5)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                border: '4px solid #f1f5f9'
              }}>
                AH
              </div>
              
              <h4 style={{
                fontSize: '1.3rem',
                fontWeight: '700',
                color: '#1e293b',
                margin: '0 0 0.5rem 0'
              }}>
                Ashley H.
              </h4>
              
              <p style={{
                fontSize: '1rem',
                color: '#64748b',
                margin: '0 0 0.25rem 0',
                fontWeight: '500'
              }}>
                Stanford University &apos;26
              </p>
              
              <p style={{
                fontSize: '0.9rem',
                color: '#64748b',
                margin: '0 0 1rem 0'
              }}>
                Essay Reviews • Personal Statements
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{ color: '#fbbf24', marginRight: '0.5rem' }}>⭐⭐⭐⭐⭐</div>
                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>4.9 (127 reviews)</span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Starting at</span>
                  <span style={{
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    color: '#16a34a'
                  }}>
                    $45
                  </span>
                </div>
                <button style={{
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  View Profile
                </button>
              </div>
            </div>

            {/* Consultant Card 2 */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              marginTop: '3rem',
              animation: 'fadeInUp 0.8s ease-out 0.2s both'
            }}>
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: '#f59e0b',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                Busy
              </div>
              
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #7c3aed, #c4b5fd)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                border: '4px solid #f1f5f9'
              }}>
                MK
              </div>
              
              <h4 style={{
                fontSize: '1.3rem',
                fontWeight: '700',
                color: '#1e293b',
                margin: '0 0 0.5rem 0'
              }}>
                Marcus K.
              </h4>
              
              <p style={{
                fontSize: '1rem',
                color: '#64748b',
                margin: '0 0 0.25rem 0',
                fontWeight: '500'
              }}>
                MIT &apos;25
              </p>
              
              <p style={{
                fontSize: '0.9rem',
                color: '#64748b',
                margin: '0 0 1rem 0'
              }}>
                Mock Interviews • Application Strategy
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{ color: '#fbbf24', marginRight: '0.5rem' }}>⭐⭐⭐⭐⭐</div>
                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>5.0 (89 reviews)</span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Starting at</span>
                  <span style={{
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    color: '#16a34a'
                  }}>
                    $65
                  </span>
                </div>
                <button style={{
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  View Profile
                </button>
              </div>
            </div>

            {/* Consultant Card 3 */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              animation: 'fadeInUp 0.8s ease-out 0.4s both'
            }}>
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: '#10b981',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                Online
              </div>
              
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #0ea5e9, #7dd3fc)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                border: '4px solid #f1f5f9'
              }}>
                ER
              </div>
              
              <h4 style={{
                fontSize: '1.3rem',
                fontWeight: '700',
                color: '#1e293b',
                margin: '0 0 0.5rem 0'
              }}>
                Emily R.
              </h4>
              
              <p style={{
                fontSize: '1rem',
                color: '#64748b',
                margin: '0 0 0.25rem 0',
                fontWeight: '500'
              }}>
                Harvard &apos;25
              </p>
              
              <p style={{
                fontSize: '0.9rem',
                color: '#64748b',
                margin: '0 0 1rem 0'
              }}>
                Personal Statements • Supplements
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{ color: '#fbbf24', marginRight: '0.5rem' }}>⭐⭐⭐⭐⭐</div>
                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>4.8 (203 reviews)</span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Starting at</span>
                  <span style={{
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    color: '#16a34a'
                  }}>
                    $55
                  </span>
                </div>
                <button style={{
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  View Profile
                </button>
              </div>
            </div>

            {/* Consultant Card 4 */}
            <div style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              marginTop: '3rem',
              animation: 'fadeInUp 0.8s ease-out 0.6s both'
            }}>
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: '#10b981',
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                Online
              </div>
              
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #00356b, #4682b4)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
                border: '4px solid #f1f5f9'
              }}>
                JL
              </div>
              
              <h4 style={{
                fontSize: '1.3rem',
                fontWeight: '700',
                color: '#1e293b',
                margin: '0 0 0.5rem 0'
              }}>
                James L.
              </h4>
              
              <p style={{
                fontSize: '1rem',
                color: '#64748b',
                margin: '0 0 0.25rem 0',
                fontWeight: '500'
              }}>
                Yale &apos;24
              </p>
              
              <p style={{
                fontSize: '0.9rem',
                color: '#64748b',
                margin: '0 0 1rem 0'
              }}>
                All Services • Premium Package
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{ color: '#fbbf24', marginRight: '0.5rem' }}>⭐⭐⭐⭐⭐</div>
                <span style={{ fontSize: '0.9rem', color: '#64748b' }}>4.9 (156 reviews)</span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block' }}>Starting at</span>
                  <span style={{
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    color: '#16a34a'
                  }}>
                    $75
                  </span>
                </div>
                <button style={{
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}>
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom floating indicator */}
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '0.9rem',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '0.5rem' }}>Scroll to explore more</div>
          <div style={{ fontSize: '1.5rem', animation: 'bounce 2s infinite' }}>↓</div>
        </div>
      </div>
    </>
  )
}