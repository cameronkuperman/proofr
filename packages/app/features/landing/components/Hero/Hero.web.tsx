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
      avatar: '#e74c3c'
    },
    {
      initials: 'IA', 
      name: 'Imane A.',
      university: 'MIT',
      year: "'25",
      specialty: 'Application Strategy',
      bio: 'Expert in STEM applications and research positioning. Published researcher with proven results.',
      price: '$60',
      avatar: '#16a085'
    },
    {
      initials: 'CK',
      name: 'Cameron K.',
      university: 'Duke University',
      year: "'24", 
      specialty: 'Essay Reviews',
      bio: 'Founder & consultant. Specializes in leadership essays and scholarship applications.',
      price: '$40',
      avatar: '#1a1a2e'
    },
    {
      initials: 'SD',
      name: 'Sean D.',
      university: 'Yale University',
      year: "'26",
      specialty: 'Essay Reviews', 
      bio: 'English major with expertise in storytelling and narrative structure for college essays.',
      price: '$50',
      avatar: '#16a085'
    }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fafafa',
      fontFamily: 'Georgia, "Times New Roman", Times, serif'
    }}>
      {/* Navigation Header */}
      <header style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(26, 26, 46, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 40px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <img 
              src="/images/proofr-logo.png" 
              alt="Proofr Logo"
              style={{
                height: '95px',
                width: 'auto',
                filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.2))'
              }}
            />
            <span style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#1a1a2e',
              fontFamily: 'Georgia, serif',
              letterSpacing: '-1px'
            }}>proofr</span>
          </div>

          {/* Navigation Links */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '40px'
          }}>
            <a href="/browse" style={{
              color: '#4a5568',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500',
              fontFamily: 'Georgia, serif',
              transition: 'color 0.3s ease'
            }}>Browse Consultants</a>
            <a href="/how-it-works" style={{
              color: '#4a5568', 
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500',
              fontFamily: 'Georgia, serif',
              transition: 'color 0.3s ease'
            }}>How It Works</a>
            <a href="/become-consultant" style={{
              color: '#4a5568',
              textDecoration: 'none', 
              fontSize: '16px',
              fontWeight: '500',
              fontFamily: 'Georgia, serif',
              transition: 'color 0.3s ease'
            }}>Become a Consultant</a>
            <a href="/about" style={{
              color: '#4a5568',
              textDecoration: 'none',
              fontSize: '16px', 
              fontWeight: '500',
              fontFamily: 'Georgia, serif',
              transition: 'color 0.3s ease'
            }}>About</a>
          </nav>

          {/* Auth Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px'
          }}>
            <button style={{
              background: 'none',
              border: 'none',
              color: '#4a5568',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              fontFamily: 'Georgia, serif',
              transition: 'color 0.3s ease'
            }}>Sign In</button>
            <button style={{
              backgroundColor: '#1a1a2e',
              color: 'white',
              border: 'none',
              padding: '14px 28px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'Georgia, serif',
              transition: 'all 0.3s ease',
              boxShadow: '0 6px 20px rgba(26, 26, 46, 0.25)'
            }}>Get Started</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '80px 40px 60px 40px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: '80px',
          alignItems: 'start'
        }}>
          {/* Left Column - Text Content & Search */}
          <div style={{ paddingTop: '20px' }}>
            {/* Large Logo Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '14px',
              backgroundColor: '#16a085',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '28px',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '32px',
              fontFamily: 'Georgia, serif',
              letterSpacing: '0.5px',
              boxShadow: '0 8px 25px rgba(22, 160, 133, 0.3)'
            }}>
              <img 
                src="/images/proofr-logo.png" 
                alt="Proofr"
                style={{
                  height: '50px',
                  width: 'auto',
                  filter: 'brightness(0) invert(1)'
                }}
              />
              The College Admissions Marketplace
            </div>

            <h1 style={{
              fontSize: '64px',
              fontWeight: '600',
              lineHeight: '1.1',
              color: '#1a1a2e',
              margin: '0 0 28px 0',
              letterSpacing: '-1.2px',
              fontFamily: 'Georgia, serif'
            }}>
              Get Into Your{' '}
              <span style={{
                color: '#16a085',
                fontWeight: '700'
              }}>Dream School</span>
            </h1>

            <p style={{
              fontSize: '20px',
              color: '#4a5568',
              lineHeight: '1.5',
              margin: '0 0 44px 0',
              maxWidth: '520px',
              fontFamily: 'Georgia, serif',
              fontWeight: '300'
            }}>
              Connect with current students at Harvard, Stanford, MIT & top universities. Get personalized admissions guidance at affordable rates.
            </p>

            {/* Search Bar */}
            <div style={{
              backgroundColor: 'white',
              border: '1px solid rgba(26, 26, 46, 0.12)',
              borderRadius: '16px',
              padding: '6px',
              marginBottom: '44px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08), 0 3px 10px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                padding: '0 18px',
                color: '#16a085',
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
                  fontSize: '16px',
                  padding: '16px 10px',
                  color: '#1a1a2e',
                  backgroundColor: 'transparent',
                  fontFamily: 'Georgia, serif'
                }}
              />
              <button style={{
                backgroundColor: '#1a1a2e',
                color: 'white',
                border: 'none',
                padding: '14px 24px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Georgia, serif',
                transition: 'all 0.3s ease'
              }}>
                Search
              </button>
            </div>

            {/* Popular Services */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '52px',
              flexWrap: 'wrap'
            }}>
              <span style={{ 
                color: '#4a5568', 
                fontSize: '16px',
                fontFamily: 'Georgia, serif'
              }}>Popular:</span>
              {['Essay Reviews', 'Mock Interviews', 'Application Strategy', 'Resume Help'].map((service) => (
                <button key={service} style={{
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(22, 160, 133, 0.3)',
                  color: '#16a085',
                  padding: '8px 16px',
                  borderRadius: '24px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'Georgia, serif',
                  transition: 'all 0.3s ease',
                  fontWeight: '500'
                }}>
                  {service}
                </button>
              ))}
            </div>

            <div style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '60px'
            }}>
              <button style={{
                backgroundColor: '#1a1a2e',
                color: 'white',
                border: 'none',
                padding: '18px 36px',
                borderRadius: '14px',
                fontSize: '17px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Georgia, serif',
                boxShadow: '0 10px 30px rgba(26, 26, 46, 0.25)',
                transition: 'all 0.3s ease'
              }}>Find a Consultant</button>
              
              <button style={{
                backgroundColor: 'transparent',
                color: '#1a1a2e',
                border: '2px solid #1a1a2e',
                padding: '16px 36px',
                borderRadius: '14px',
                fontSize: '17px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Georgia, serif',
                transition: 'all 0.3s ease'
              }}>Become a Consultant</button>
            </div>

            <div style={{
              display: 'flex',
              gap: '50px',
              color: '#4a5568'
            }}>
              <div>
                <div style={{ 
                  fontSize: '28px', 
                  fontWeight: '700', 
                  color: '#1a1a2e',
                  fontFamily: 'Georgia, serif'
                }}>94%</div>
                <div style={{ 
                  fontSize: '14px',
                  fontFamily: 'Georgia, serif'
                }}>Success Rate</div>
              </div>
              <div>
                <div style={{ 
                  fontSize: '28px', 
                  fontWeight: '700', 
                  color: '#1a1a2e',
                  fontFamily: 'Georgia, serif'
                }}>500+</div>
                <div style={{ 
                  fontSize: '14px',
                  fontFamily: 'Georgia, serif'
                }}>Expert Consultants</div>
              </div>
              <div>
                <div style={{ 
                  fontSize: '28px', 
                  fontWeight: '700', 
                  color: '#1a1a2e',
                  fontFamily: 'Georgia, serif'
                }}>10K+</div>
                <div style={{ 
                  fontSize: '14px',
                  fontFamily: 'Georgia, serif'
                }}>Students Helped</div>
              </div>
            </div>
          </div>

          {/* Right Column - Consultant Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            width: '100%'
          }}>
            {consultants.map((consultant, index) => (
              <div key={consultant.name} style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '32px 28px',
                boxShadow: `
                  0 1px 3px rgba(0,0,0,0.12),
                  0 4px 8px rgba(0,0,0,0.05),
                  0 8px 16px rgba(0,0,0,0.04),
                  0 2px 6px rgba(26,26,46,0.06),
                  inset 0 1px 0 rgba(255,255,255,0.8)
                `,
                border: '1px solid rgba(26, 26, 46, 0.08)',
                position: 'relative',
                transition: 'all 0.4s ease',
                cursor: 'pointer',
                background: `
                  linear-gradient(145deg, #ffffff 0%, #fefefe 50%, #fdfdfd 100%),
                  linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(250,250,250,0.3) 100%)
                `,
                minHeight: '320px',
                display: 'flex',
                flexDirection: 'column',
                animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
                transformOrigin: 'bottom'
              }}>
                <style jsx>{`
                  @keyframes slideInUp {
                    0% {
                      opacity: 0;
                      transform: translateY(30px) scale(0.95);
                    }
                    100% {
                      opacity: 1;
                      transform: translateY(0) scale(1);
                    }
                  }
                `}</style>
                
                {/* Online Status */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  backgroundColor: '#16a085',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600',
                  fontFamily: 'Georgia, serif',
                  letterSpacing: '0.5px',
                  boxShadow: '0 2px 8px rgba(22, 160, 133, 0.3)'
                }}>
                  Online
                </div>

                {/* Avatar and Name Section */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: consultant.avatar,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
                    border: '3px solid #ffffff'
                  }}>
                    <span style={{
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: '700',
                      fontFamily: 'Georgia, serif'
                    }}>
                      {consultant.initials}
                    </span>
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#1a1a2e',
                      margin: '0 0 4px 0',
                      fontFamily: 'Georgia, serif'
                    }}>
                      {consultant.name}
                    </h3>
                    <p style={{
                      fontSize: '15px',
                      color: '#4a5568',
                      margin: '0',
                      fontFamily: 'Georgia, serif'
                    }}>
                      {consultant.university} {consultant.year}
                    </p>
                  </div>
                </div>

                {/* Specialty Badge */}
                <div style={{
                  backgroundColor: 'rgba(22, 160, 133, 0.1)',
                  color: '#16a085',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'inline-block',
                  marginBottom: '18px',
                  fontFamily: 'Georgia, serif',
                  alignSelf: 'flex-start',
                  border: '1px solid rgba(22, 160, 133, 0.15)'
                }}>
                  {consultant.specialty}
                </div>

                {/* Bio */}
                <p style={{
                  fontSize: '14px',
                  color: '#4a5568',
                  lineHeight: '1.6',
                  margin: '0 0 20px 0',
                  fontFamily: 'Georgia, serif',
                  flex: 1
                }}>
                  {consultant.bio}
                </p>

                {/* Rating */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <span style={{ 
                    color: '#fbbf24', 
                    marginRight: '8px', 
                    fontSize: '16px' 
                  }}>★★★★★</span>
                  <span style={{
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#1a1a2e',
                    marginRight: '8px',
                    fontFamily: 'Georgia, serif'
                  }}>
                    4.9
                  </span>
                  <span style={{
                    fontSize: '14px',
                    color: '#4a5568',
                    fontFamily: 'Georgia, serif'
                  }}>
                    (127 reviews)
                  </span>
                </div>

                {/* Price and Button */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(26, 26, 46, 0.08)'
                }}>
                  <div>
                    <span style={{
                      fontSize: '12px',
                      color: '#4a5568',
                      display: 'block',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '4px',
                      fontFamily: 'Georgia, serif'
                    }}>Starting at</span>
                    <span style={{
                      fontSize: '26px',
                      fontWeight: '700',
                      color: '#1a1a2e',
                      fontFamily: 'Georgia, serif'
                    }}>
                      {consultant.price}
                    </span>
                  </div>
                  
                  <button style={{
                    backgroundColor: '#1a1a2e',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'Georgia, serif',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(26, 26, 46, 0.25)'
                  }}>
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid rgba(26, 26, 46, 0.08)',
        padding: '100px 0'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 40px',
          textAlign: 'center'
        }}>
          {/* Large Logo Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            marginBottom: '20px'
          }}>
            <img 
              src="/images/proofr-logo.png" 
              alt="Proofr"
              style={{
                height: '80px',
                width: 'auto',
                filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.15))'
              }}
            />
            <h2 style={{
              fontSize: '42px',
              fontWeight: '600',
              color: '#1a1a2e',
              margin: '0',
              fontFamily: 'Georgia, serif'
            }}>
              Services Our Consultants Offer
            </h2>
          </div>

          {/* Services Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            marginBottom: '80px',
            marginTop: '60px'
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
                borderRadius: '18px',
                border: '1px solid rgba(26, 26, 46, 0.06)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '18px' }}>{service.icon}</div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1a1a2e',
                  margin: '0 0 10px 0',
                  fontFamily: 'Georgia, serif'
                }}>
                  {service.title}
                </h3>
                <p style={{
                  fontSize: '15px',
                  color: '#4a5568',
                  margin: '0',
                  fontFamily: 'Georgia, serif',
                  lineHeight: '1.5'
                }}>
                  {service.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            backgroundColor: '#1a1a2e',
            color: 'white',
            padding: '50px',
            borderRadius: '24px',
            textAlign: 'center'
          }}>
            {/* Large Logo in CTA */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              marginBottom: '24px'
            }}>
              <img 
                src="/images/proofr-logo.png" 
                alt="Proofr"
                style={{
                  height: '70px',
                  width: 'auto',
                  filter: 'brightness(0) invert(1)'
                }}
              />
              <h3 style={{
                fontSize: '32px',
                fontWeight: '600',
                margin: '0',
                fontFamily: 'Georgia, serif'
              }}>
                Ready to get started?
              </h3>
            </div>
            <p style={{
              fontSize: '17px',
              color: '#cbd5e0',
              margin: '0 0 36px 0',
              fontFamily: 'Georgia, serif'
            }}>
              Join thousands of students who have successfully navigated admissions with our consultants.
            </p>
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button style={{
                backgroundColor: '#16a085',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '17px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Georgia, serif',
                transition: 'all 0.3s ease'
              }}>
                Browse Consultants
              </button>
              <button style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid white',
                padding: '14px 32px',
                borderRadius: '12px',
                fontSize: '17px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Georgia, serif',
                transition: 'all 0.3s ease'
              }}>
                Become a Consultant
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}