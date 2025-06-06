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
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(26, 26, 46, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 40px',
          height: '85px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16a085 50%, #e74c3c 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(26, 26, 46, 0.15)'
            }}>
              <span style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: '600'
              }}>🎓</span>
            </div>
            <span style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1a1a2e',
              fontFamily: 'Georgia, serif',
              letterSpacing: '-0.5px'
            }}>proofr</span>
          </div>

          {/* Navigation Links */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '48px'
          }}>
            <a href="/browse" style={{
              color: '#4a5568',
              textDecoration: 'none',
              fontSize: '17px',
              fontWeight: '400',
              fontFamily: 'Georgia, serif',
              transition: 'color 0.2s'
            }}>Browse Consultants</a>
            <a href="/how-it-works" style={{
              color: '#4a5568', 
              textDecoration: 'none',
              fontSize: '17px',
              fontWeight: '400',
              fontFamily: 'Georgia, serif'
            }}>How It Works</a>
            <a href="/become-consultant" style={{
              color: '#4a5568',
              textDecoration: 'none', 
              fontSize: '17px',
              fontWeight: '400',
              fontFamily: 'Georgia, serif'
            }}>Become a Consultant</a>
            <a href="/about" style={{
              color: '#4a5568',
              textDecoration: 'none',
              fontSize: '17px', 
              fontWeight: '400',
              fontFamily: 'Georgia, serif'
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
              fontSize: '17px',
              fontWeight: '400',
              cursor: 'pointer',
              fontFamily: 'Georgia, serif'
            }}>Sign In</button>
            <button style={{
              backgroundColor: '#1a1a2e',
              color: 'white',
              border: 'none',
              padding: '14px 28px',
              borderRadius: '12px',
              fontSize: '17px',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'Georgia, serif',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(26, 26, 46, 0.25)'
            }}>Get Started</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '120px 40px 80px 40px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: '80px',
          alignItems: 'start'
        }}>
          {/* Left Column - Text Content & Search */}
          <div style={{ paddingTop: '40px' }}>
            <div style={{
              display: 'inline-block',
              backgroundColor: '#16a085',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '25px',
              fontSize: '15px',
              fontWeight: '500',
              marginBottom: '32px',
              fontFamily: 'Georgia, serif',
              letterSpacing: '0.3px'
            }}>
              The College Admissions Marketplace
            </div>

            <h1 style={{
              fontSize: '72px',
              fontWeight: '300',
              lineHeight: '1.1',
              color: '#1a1a2e',
              margin: '0 0 28px 0',
              letterSpacing: '-1px',
              fontFamily: 'Georgia, serif'
            }}>
              Get Into Your{' '}
              <span style={{
                color: '#16a085',
                fontWeight: '400'
              }}>Dream School</span>
            </h1>

            <p style={{
              fontSize: '24px',
              color: '#4a5568',
              lineHeight: '1.5',
              margin: '0 0 50px 0',
              maxWidth: '520px',
              fontFamily: 'Georgia, serif',
              fontWeight: '300'
            }}>
              Connect with current students at Harvard, Stanford, MIT & top universities. Get personalized admissions guidance at affordable freelance rates.
            </p>

            {/* Search Bar */}
            <div style={{
              backgroundColor: 'white',
              border: '1px solid rgba(26, 26, 46, 0.12)',
              borderRadius: '16px',
              padding: '8px',
              marginBottom: '50px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 8px 25px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06)',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                padding: '0 20px',
                color: '#16a085',
                fontSize: '20px'
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
                  padding: '18px 12px',
                  color: '#1a1a2e',
                  backgroundColor: 'transparent',
                  fontFamily: 'Georgia, serif'
                }}
              />
              <button style={{
                backgroundColor: '#1a1a2e',
                color: 'white',
                border: 'none',
                padding: '16px 28px',
                borderRadius: '12px',
                fontSize: '17px',
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
              gap: '16px',
              marginBottom: '60px',
              flexWrap: 'wrap'
            }}>
              <span style={{ 
                color: '#4a5568', 
                fontSize: '17px',
                fontFamily: 'Georgia, serif'
              }}>Popular:</span>
              {['Essay Reviews', 'Mock Interviews', 'Application Strategy', 'Resume Help'].map((service) => (
                <button key={service} style={{
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(22, 160, 133, 0.3)',
                  color: '#16a085',
                  padding: '10px 18px',
                  borderRadius: '25px',
                  fontSize: '15px',
                  cursor: 'pointer',
                  fontFamily: 'Georgia, serif',
                  transition: 'all 0.3s ease',
                  fontWeight: '400'
                }}>
                  {service}
                </button>
              ))}
            </div>

            <div style={{
              display: 'flex',
              gap: '24px',
              marginBottom: '70px'
            }}>
              <button style={{
                backgroundColor: '#1a1a2e',
                color: 'white',
                border: 'none',
                padding: '20px 40px',
                borderRadius: '16px',
                fontSize: '19px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Georgia, serif',
                boxShadow: '0 8px 25px rgba(26, 26, 46, 0.25)',
                transition: 'all 0.3s ease'
              }}>Find a Consultant</button>
              
              <button style={{
                backgroundColor: 'transparent',
                color: '#1a1a2e',
                border: '2px solid #1a1a2e',
                padding: '18px 40px',
                borderRadius: '16px',
                fontSize: '19px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Georgia, serif',
                transition: 'all 0.3s ease'
              }}>Become a Consultant</button>
            </div>

            <div style={{
              display: 'flex',
              gap: '60px',
              color: '#4a5568'
            }}>
              <div>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  color: '#1a1a2e',
                  fontFamily: 'Georgia, serif'
                }}>94%</div>
                <div style={{ 
                  fontSize: '15px',
                  fontFamily: 'Georgia, serif'
                }}>Success Rate</div>
              </div>
              <div>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  color: '#1a1a2e',
                  fontFamily: 'Georgia, serif'
                }}>500+</div>
                <div style={{ 
                  fontSize: '15px',
                  fontFamily: 'Georgia, serif'
                }}>Expert Consultants</div>
              </div>
              <div>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  color: '#1a1a2e',
                  fontFamily: 'Georgia, serif'
                }}>10K+</div>
                <div style={{ 
                  fontSize: '15px',
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
                borderRadius: '20px',
                padding: '36px 32px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)',
                border: '1px solid rgba(26, 26, 46, 0.06)',
                position: 'relative',
                transition: 'all 0.4s ease',
                cursor: 'pointer',
                background: 'linear-gradient(145deg, #ffffff 0%, #fcfcfc 100%)',
                minHeight: '320px',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Online Status */}
                <div style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  backgroundColor: '#16a085',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '15px',
                  fontSize: '12px',
                  fontWeight: '600',
                  fontFamily: 'Georgia, serif',
                  letterSpacing: '0.5px'
                }}>
                  Online
                </div>

                {/* Avatar and Name Section */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: consultant.avatar,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '18px',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                    border: '3px solid #ffffff'
                  }}>
                    <span style={{
                      color: 'white',
                      fontSize: '20px',
                      fontWeight: '700',
                      fontFamily: 'Georgia, serif'
                    }}>
                      {consultant.initials}
                    </span>
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '22px',
                      fontWeight: '600',
                      color: '#1a1a2e',
                      margin: '0 0 6px 0',
                      fontFamily: 'Georgia, serif'
                    }}>
                      {consultant.name}
                    </h3>
                    <p style={{
                      fontSize: '16px',
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
                  padding: '8px 16px',
                  borderRadius: '25px',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'inline-block',
                  marginBottom: '20px',
                  fontFamily: 'Georgia, serif',
                  alignSelf: 'flex-start'
                }}>
                  {consultant.specialty}
                </div>

                {/* Bio */}
                <p style={{
                  fontSize: '15px',
                  color: '#4a5568',
                  lineHeight: '1.6',
                  margin: '0 0 24px 0',
                  fontFamily: 'Georgia, serif',
                  flex: 1
                }}>
                  {consultant.bio}
                </p>

                {/* Rating */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <span style={{ 
                    color: '#fbbf24', 
                    marginRight: '10px', 
                    fontSize: '18px' 
                  }}>★★★★★</span>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a2e',
                    marginRight: '10px',
                    fontFamily: 'Georgia, serif'
                  }}>
                    4.9
                  </span>
                  <span style={{
                    fontSize: '15px',
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
                  paddingTop: '24px',
                  borderTop: '1px solid rgba(26, 26, 46, 0.08)'
                }}>
                  <div>
                    <span style={{
                      fontSize: '13px',
                      color: '#4a5568',
                      display: 'block',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '6px',
                      fontFamily: 'Georgia, serif'
                    }}>Starting at</span>
                    <span style={{
                      fontSize: '28px',
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
                    padding: '14px 24px',
                    borderRadius: '12px',
                    fontSize: '15px',
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
          <h2 style={{
            fontSize: '48px',
            fontWeight: '300',
            color: '#1a1a2e',
            margin: '0 0 60px 0',
            fontFamily: 'Georgia, serif'
          }}>
            Services Our Consultants Offer
          </h2>

          {/* Services Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '48px',
            marginBottom: '80px'
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
                padding: '40px 32px',
                backgroundColor: 'white',
                borderRadius: '20px',
                border: '1px solid rgba(26, 26, 46, 0.06)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ fontSize: '36px', marginBottom: '20px' }}>{service.icon}</div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1a1a2e',
                  margin: '0 0 12px 0',
                  fontFamily: 'Georgia, serif'
                }}>
                  {service.title}
                </h3>
                <p style={{
                  fontSize: '16px',
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
            <h3 style={{
              fontSize: '36px',
              fontWeight: '300',
              margin: '0 0 20px 0',
              fontFamily: 'Georgia, serif'
            }}>
              Ready to get started?
            </h3>
            <p style={{
              fontSize: '18px',
              color: '#cbd5e0',
              margin: '0 0 40px 0',
              fontFamily: 'Georgia, serif'
            }}>
              Join thousands of students who have successfully navigated admissions with our peer consultants.
            </p>
            <div style={{
              display: 'flex',
              gap: '24px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button style={{
                backgroundColor: '#16a085',
                color: 'white',
                border: 'none',
                padding: '18px 36px',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Georgia, serif'
              }}>
                Browse Consultants
              </button>
              <button style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid white',
                padding: '16px 36px',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Georgia, serif'
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