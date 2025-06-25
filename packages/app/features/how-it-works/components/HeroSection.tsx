import React from 'react'
import { GigCard, Gig } from './GigCard'

interface HeroSectionProps {
  featuredGigs: Gig[]
  hoveredGig: number | null
  setHoveredGig: (id: number | null) => void
}

export function HeroSection({ featuredGigs, hoveredGig, setHoveredGig }: HeroSectionProps) {
  // Styles
  const heroGradient = {
    background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 50%, #f8fafc 100%)'
  }

  const glowStyle = {
    position: 'absolute' as const,
    top: '20%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '600px',
    height: '300px',
    background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.15) 0%, transparent 60%)',
    filter: 'blur(60px)',
    pointerEvents: 'none' as const
  }

  return React.createElement(
    'section',
    {
      key: 'hero',
      'data-section': true,
      style: {
        ...heroGradient,
        minHeight: '100vh',
        position: 'relative' as const,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '80px'
      }
    },
    [
      // Gradient effects
      React.createElement('div', { key: 'glow', style: glowStyle }),
      
      // Content
      React.createElement(
        'div',
        {
          key: 'content',
          style: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 40px',
            textAlign: 'center',
            position: 'relative' as const,
            zIndex: 2
          }
        },
        [
          // Small label
          React.createElement(
            'div',
            {
              key: 'label',
              style: {
                fontSize: '14px',
                fontWeight: '600',
                color: '#3b82f6',
                textTransform: 'uppercase' as const,
                letterSpacing: '0.1em',
                marginBottom: '24px'
              }
            },
            'THE ADMISSIONS MARKETPLACE'
          ),
          
          // Main headline
          React.createElement(
            'h1',
            {
              key: 'h1',
              style: {
                fontSize: 'clamp(48px, 6vw, 80px)',
                fontWeight: '700',
                color: '#0f172a',
                margin: '0 0 32px 0',
                letterSpacing: '-0.03em',
                lineHeight: '1.1'
              }
            },
            ['Find Your Perfect', React.createElement('br', { key: 'br' }), 'Admissions Consultant.']
          ),
          
          // Subheadline
          React.createElement(
            'p',
            {
              key: 'subhead',
              style: {
                fontSize: '22px',
                color: '#64748b',
                maxWidth: '700px',
                margin: '0 auto 48px auto',
                lineHeight: '1.6'
              }
            },
            'Browse gigs from verified students at top universities. Get personalized help at prices that make sense.'
          ),
          
          // CTA Buttons
          React.createElement(
            'div',
            {
              key: 'ctas',
              style: {
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                marginBottom: '80px'
              }
            },
            [
              React.createElement(
                'button',
                {
                  key: 'browse',
                  style: {
                    background: '#18181b',
                    color: 'white',
                    border: 'none',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }
                },
                ['🔍 Browse Gigs']
              ),
              React.createElement(
                'button',
                {
                  key: 'consultant',
                  style: {
                    background: 'transparent',
                    color: '#18181b',
                    border: '2px solid #e5e7eb',
                    padding: '14px 32px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }
                },
                'Become a Consultant'
              )
            ]
          ),
          
          // Floating marketplace preview
          React.createElement(
            'div',
            {
              key: 'marketplace-preview',
              style: {
                maxWidth: '1000px',
                margin: '0 auto',
                perspective: '2000px'
              }
            },
            React.createElement(
              'div',
              {
                style: {
                  background: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.15), 0 30px 60px -30px rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  overflow: 'hidden',
                  transform: 'rotateX(3deg)',
                  transformOrigin: 'center bottom'
                }
              },
              [
                // Browser bar
                React.createElement(
                  'div',
                  {
                    key: 'browser-bar',
                    style: {
                      background: '#f9fafb',
                      borderBottom: '1px solid #e5e7eb',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }
                  },
                  [
                    React.createElement(
                      'div',
                      {
                        key: 'dots',
                        style: { display: 'flex', gap: '8px' }
                      },
                      ['#ef4444', '#f59e0b', '#10b981'].map((color, i) =>
                        React.createElement('div', {
                          key: i,
                          style: {
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: color
                          }
                        })
                      )
                    ),
                    React.createElement(
                      'div',
                      {
                        key: 'url',
                        style: {
                          flex: 1,
                          background: '#ffffff',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '13px',
                          color: '#6b7280',
                          marginLeft: '12px'
                        }
                      },
                      '🔒 proofr.com/marketplace'
                    )
                  ]
                ),
                
                // Marketplace content
                React.createElement(
                  'div',
                  {
                    key: 'content',
                    style: {
                      padding: '32px',
                      background: '#ffffff'
                    }
                  },
                  [
                    // Search bar
                    React.createElement(
                      'div',
                      {
                        key: 'search',
                        style: {
                          background: '#f3f4f6',
                          borderRadius: '12px',
                          padding: '16px 20px',
                          marginBottom: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }
                      },
                      [
                        React.createElement(
                          'span',
                          { key: 'icon', style: { fontSize: '20px' } },
                          '🔍'
                        ),
                        React.createElement(
                          'span',
                          {
                            key: 'text',
                            style: {
                              flex: 1,
                              fontSize: '15px',
                              color: '#9ca3af'
                            }
                          },
                          'Search for "Common App essay review"'
                        )
                      ]
                    ),
                    
                    // Gig cards
                    React.createElement(
                      'div',
                      {
                        key: 'gigs',
                        style: {
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                          gap: '20px'
                        }
                      },
                      featuredGigs.map((gig, index) =>
                        React.createElement(GigCard, {
                          key: gig.id,
                          gig,
                          index,
                          hoveredGig,
                          setHoveredGig
                        })
                      )
                    )
                  ]
                )
              ]
            )
          )
        ]
      )
    ]
  )
}