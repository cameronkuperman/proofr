// PASTE THIS ENTIRE BLOCK INTO THE FILE
import * as React from 'react';
import { NavigationBar } from '../../landing/components/NavigationBar/NavigationBar'
import { HeroSection, StatsSection, CheatingSection, type Gig } from '../components'

export function HowItWorksScreen() {
  const [activeSection, setActiveSection] = React.useState(0)
  const [hoveredGig, setHoveredGig] = React.useState<number | null>(null)
  
  React.useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]')
      const scrollPosition = window.scrollY + window.innerHeight / 2
      
      sections.forEach((section, index) => {
        const element = section as HTMLElement
        const sectionTop = element.offsetTop
        const sectionHeight = element.offsetHeight
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(index)
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const featuredGigs = [
    {
      id: 1,
      consultant: 'Sarah Chen',
      school: 'Harvard \'25',
      title: 'I will review your Common App essay and provide detailed feedback',
      price: 35,
      rating: 4.9,
      reviews: 127,
      responseTime: '2 hours',
      tags: ['Essay Review', 'Quick Turnaround'],
      avatar: 'SC'
    },
    {
      id: 2,
      consultant: 'Michael Park',
      school: 'Stanford \'24',
      title: 'I will conduct a mock interview and help you ace your alumni interview',
      price: 55,
      rating: 5.0,
      reviews: 89,
      responseTime: '1 hour',
      tags: ['Mock Interview', 'Top Rated'],
      avatar: 'MP'
    },
    {
      id: 3,
      consultant: 'Emma Rodriguez',
      school: 'MIT \'26',
      title: 'I will help you craft compelling STEM extracurricular descriptions',
      price: 25,
      rating: 4.8,
      reviews: 156,
      responseTime: '30 min',
      tags: ['STEM Apps', 'Best Value'],
      avatar: 'ER'
    }
  ]

  const stats = [
    { value: '15,000+', label: 'Students Helped' },
    { value: '98%', label: 'Success Rate' },
    { value: '$35', label: 'Average Price' },
    { value: '2hr', label: 'Avg Response Time' }
  ]

  return React.createElement(
    'div',
    {
      style: {
        minHeight: '100vh',
        background: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif'
      }
    },
    [
      React.createElement(NavigationBar, { key: 'nav' }),
      React.createElement(HeroSection, {
        key: 'hero',
        featuredGigs,
        hoveredGig,
        setHoveredGig
      }),
      React.createElement(StatsSection, { key: 'stats' }),
      React.createElement(CheatingSection, { key: 'cheating' }),
      React.createElement(
        'section',
        {
          key: 'browse-feature',
          style: {
            background: '#0f172a',
            color: 'white',
            padding: '120px 0',
            position: 'relative' as const,
            overflow: 'hidden'
          }
        },
        [
          React.createElement('div', {
            key: 'glow',
            style: {
              position: 'absolute' as const,
              top: '50%',
              left: '20%',
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
              filter: 'blur(100px)',
              transform: 'translate(-50%, -50%)'
            }
          }),
          React.createElement(
            'div',
            {
              key: 'content',
              style: {
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 40px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '80px',
                alignItems: 'center'
              }
            },
            [
              React.createElement(
                'div',
                { key: 'left' },
                [
                  React.createElement(
                    'div',
                    {
                      key: 'label',
                      style: {
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#60a5fa',
                        textTransform: 'uppercase' as const,
                        letterSpacing: '0.1em',
                        marginBottom: '16px'
                      }
                    },
                    'BROWSE BY YOUR NEEDS'
                  ),
                  React.createElement(
                    'h2',
                    {
                      key: 'h2',
                      style: {
                        fontSize: '48px',
                        fontWeight: '700',
                        marginBottom: '24px',
                        letterSpacing: '-0.02em',
                        lineHeight: '1.1'
                      }
                    },
                    'Find exactly what you need.'
                  ),
                  React.createElement(
                    'p',
                    {
                      key: 'p',
                      style: {
                        fontSize: '18px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        marginBottom: '32px',
                        lineHeight: '1.6'
                      }
                    },
                    "Filter by school, major, essay type, interview prep, or specific application components. Our consultants specialize in exactly what you're working on."
                  ),
                  React.createElement(
                    'div',
                    {
                      key: 'categories',
                      style: {
                        display: 'flex',
                        flexWrap: 'wrap' as const,
                        gap: '12px'
                      }
                    },
                    [
                      'Common App Essays',
                      'Supplementals',
                      'UC PIQs',
                      'Interview Prep',
                      'Activities List',
                      'STEM Apps',
                      'Liberal Arts',
                      'Ivy League'
                    ].map((cat, i) =>
                      React.createElement(
                        'span',
                        {
                          key: i,
                          style: {
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            padding: '8px 16px',
                            borderRadius: '24px',
                            fontSize: '14px',
                            fontWeight: '500'
                          }
                        },
                        cat
                      )
                    )
                  )
                ]
              ),
              React.createElement(
                'div',
                {
                  key: 'right',
                  style: {
                    position: 'relative' as const
                  }
                },
                React.createElement(
                  'div',
                  {
                    style: {
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '32px',
                      transform: 'perspective(1000px) rotateY(-5deg)'
                    }
                  },
                  [
                    React.createElement(
                      'div',
                      {
                        key: 'search',
                        style: {
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          padding: '16px',
                          marginBottom: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }
                      },
                      [
                        React.createElement('span', { key: 'icon' }, '🔍'),
                        React.createElement(
                          'span',
                          {
                            key: 'text',
                            style: { color: 'rgba(255, 255, 255, 0.6)' }
                          },
                          'Harvard supplemental essay help'
                        )
                      ]
                    ),
                    React.createElement(
                      'div',
                      {
                        key: 'filters',
                        style: {
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '16px'
                        }
                      },
                      [
                        { label: 'School', value: 'Harvard' },
                        { label: 'Service', value: 'Essay Review' },
                        { label: 'Price', value: '$25-50' },
                        { label: 'Delivery', value: '< 48 hours' }
                      ].map((filter, i) =>
                        React.createElement(
                          'div',
                          {
                            key: i,
                            style: {
                              background: 'rgba(255, 255, 255, 0.05)',
                              borderRadius: '8px',
                              padding: '12px',
                              border: '1px solid rgba(255, 255, 255, 0.1)'
                            }
                          },
                          [
                            React.createElement(
                              'div',
                              {
                                key: 'label',
                                style: {
                                  fontSize: '12px',
                                  color: 'rgba(255, 255, 255, 0.5)',
                                  marginBottom: '4px'
                                }
                              },
                              filter.label
                            ),
                            React.createElement(
                              'div',
                              {
                                key: 'value',
                                style: {
                                  fontSize: '14px',
                                  fontWeight: '600'
                                }
                              },
                              filter.value
                            )
                          ]
                        )
                      )
                    )
                  ]
                )
              )
            ]
          )
        ]
      ),
      React.createElement(
        'section',
        {
          key: 'pricing',
          style: {
            background: 'linear-gradient(180deg, #1e293b 0%, #334155 100%)',
            padding: '120px 0',
            position: 'relative' as const,
            overflow: 'hidden'
          }
        },
        [
          React.createElement('div', {
            key: 'glow',
            style: {
              position: 'absolute' as const,
              top: '30%',
              right: '-20%',
              width: '800px',
              height: '800px',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
              filter: 'blur(120px)',
              pointerEvents: 'none' as const
            }
          }),
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
                zIndex: 1
              }
            },
            [
              React.createElement(
                'div',
                {
                  key: 'header',
                  style: {
                    maxWidth: '800px',
                    margin: '0 auto 80px auto'
                  }
                },
                [
                  React.createElement(
                    'div',
                    {
                      key: 'label',
                      style: {
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#60a5fa',
                        textTransform: 'uppercase' as const,
                        letterSpacing: '0.1em',
                        marginBottom: '16px'
                      }
                    },
                    'TRANSPARENT PRICING'
                  ),
                  React.createElement(
                    'h2',
                    {
                      key: 'h2',
                      style: {
                        fontSize: '48px',
                        fontWeight: '700',
                        color: '#ffffff',
                        marginBottom: '24px',
                        letterSpacing: '-0.02em'
                      }
                    },
                    'Pay what works for you.'
                  ),
                  React.createElement(
                    'p',
                    {
                      key: 'p',
                      style: {
                        fontSize: '20px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        lineHeight: '1.6'
                      }
                    },
                    'No hidden fees. No subscriptions. Just simple, one-time payments for the help you need.'
                  )
                ]
              ),
              React.createElement(
                'div',
                {
                  key: 'examples',
                  style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '32px',
                    marginBottom: '64px'
                  }
                },
                [
                  {
                    title: 'Quick Review',
                    price: '$15-35',
                    features: ['Grammar and structure check', 'Basic feedback', '24-hour delivery', 'Great for final polish']
                  },
                  {
                    title: 'Deep Dive',
                    price: '$50-100',
                    features: ['Comprehensive essay analysis', 'Strategic recommendations', 'Multiple revisions', 'Consultant from target school'],
                    popular: true
                  },
                  {
                    title: 'Full Package',
                    price: '$200-500',
                    features: ['Complete application review', 'All essays and supplements', 'Interview prep included', 'Ongoing support']
                  }
                ].map((tier, i) =>
                  React.createElement(
                    'div',
                    {
                      key: i,
                      style: {
                        background: tier.popular ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'rgba(255, 255, 255, 0.05)',
                        color: tier.popular ? 'white' : '#ffffff',
                        borderRadius: '16px',
                        padding: '40px 32px',
                        border: tier.popular ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                        position: 'relative' as const,
                        transform: tier.popular ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: tier.popular ? '0 20px 40px rgba(0, 0, 0, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.05)'
                      }
                    },
                    [
                      tier.popular && React.createElement(
                        'div',
                        {
                          key: 'badge',
                          style: {
                            position: 'absolute' as const,
                            top: '-12px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: '#ffffff',
                            color: '#3b82f6',
                            padding: '4px 16px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }
                        },
                        'MOST POPULAR'
                      ),
                      React.createElement('h3', { key: 'title', style: { fontSize: '24px', fontWeight: '600', marginBottom: '8px' } }, tier.title),
                      React.createElement('div', { key: 'price', style: { fontSize: '36px', fontWeight: '700', marginBottom: '24px' } }, tier.price),
                      React.createElement(
                        'ul',
                        { key: 'features', style: { listStyle: 'none', padding: 0, margin: 0 } },
                        tier.features.map((feature, j) =>
                          React.createElement(
                            'li',
                            {
                              key: j,
                              style: {
                                padding: '8px 0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '15px',
                                color: tier.popular ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.7)'
                              }
                            },
                            ['✓', feature]
                          )
                        )
                      )
                    ]
                  )
                )
              ),
              React.createElement(
                'div',
                {
                  key: 'guarantee',
                  style: {
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '16px',
                    padding: '24px 32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    maxWidth: '600px',
                    margin: '0 auto'
                  }
                },
                [
                  React.createElement('span', { key: 'icon', style: { fontSize: '32px' } }, '💰'),
                  React.createElement(
                    'div',
                    { key: 'text', style: { textAlign: 'left' } },
                    [
                      React.createElement(
                        'div',
                        { key: 'title', style: { fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '4px' } },
                        '100% Money-Back Guarantee'
                      ),
                      React.createElement(
                        'div',
                        { key: 'desc', style: { fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' } },
                        'Not satisfied? Get a full refund within 7 days. No questions asked.'
                      )
                    ]
                  )
                ]
              )
            ]
          )
        ]
      ),
      React.createElement(
        'section',
        {
          key: 'verification',
          style: {
            background: '#1e293b',
            color: 'white',
            padding: '120px 0',
            position: 'relative' as const
          }
        },
        React.createElement(
          'div',
          {
            style: {
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 40px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '80px',
              alignItems: 'center'
            }
          },
          [
            React.createElement(
              'div',
              { key: 'left', style: { position: 'relative' as const } },
              React.createElement(
                'div',
                {
                  style: {
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    textAlign: 'center'
                  }
                },
                [
                  React.createElement(
                    'div',
                    {
                      key: 'badge',
                      style: {
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px auto',
                        fontSize: '32px'
                      }
                    },
                    '✓'
                  ),
                  React.createElement('h3', { key: 'h3', style: { fontSize: '24px', fontWeight: '600', marginBottom: '16px' } }, 'Verified Consultant'),
                  React.createElement(
                    'div',
                    { key: 'details', style: { display: 'grid', gap: '12px', textAlign: 'left', marginTop: '32px' } },
                    [
                      { icon: '🎓', text: "Harvard University '25" },
                      { icon: '📧', text: 'harvard.edu email verified' },
                      { icon: '📝', text: '127 successful applications' },
                      { icon: '⭐', text: '4.9/5 average rating' }
                    ].map((item, i) =>
                      React.createElement(
                        'div',
                        {
                          key: i,
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontSize: '15px',
                            color: 'rgba(255, 255, 255, 0.8)'
                          }
                        },
                        [item.icon, item.text]
                      )
                    )
                  )
                ]
              )
            ),
            React.createElement(
              'div',
              { key: 'right' },
              [
                React.createElement(
                  'div',
                  {
                    key: 'label',
                    style: {
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#10b981',
                      textTransform: 'uppercase' as const,
                      letterSpacing: '0.1em',
                      marginBottom: '16px'
                    }
                  },
                  'TRUST & SAFETY'
                ),
                React.createElement(
                  'h2',
                  {
                    key: 'h2',
                    style: {
                      fontSize: '48px',
                      fontWeight: '700',
                      marginBottom: '24px',
                      letterSpacing: '-0.02em',
                      lineHeight: '1.1'
                    }
                  },
                  'Work with verified students.'
                ),
                React.createElement(
                  'p',
                  {
                    key: 'p',
                    style: {
                      fontSize: '18px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginBottom: '32px',
                      lineHeight: '1.6'
                    }
                  },
                  'Every consultant can verify their university email, upload proof of admission, and showcase their credentials. Look for the green checkmark for verified consultants.'
                ),
                React.createElement(
                  'div',
                  { key: 'features', style: { display: 'grid', gap: '16px' } },
                  [
                    'University email verification',
                    'Admission letter upload',
                    'LinkedIn profile connection',
                    'Background checks available'
                  ].map((feature, i) =>
                    React.createElement(
                      'div',
                      {
                        key: i,
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          fontSize: '16px',
                          color: 'rgba(255, 255, 255, 0.9)'
                        }
                      },
                      ['✓', feature]
                    )
                  )
                )
              ]
            )
          ]
        )
      ),
      React.createElement(
        'section',
        {
          key: 'how-it-works',
          'data-section': true,
          style: {
            background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
            padding: '120px 0',
            position: 'relative' as const,
            overflow: 'hidden'
          }
        },
        [
          React.createElement('div', {
            key: 'glow',
            style: {
              position: 'absolute' as const,
              bottom: '-30%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '1000px',
              height: '600px',
              background: 'radial-gradient(ellipse at center, rgba(96, 165, 250, 0.15) 0%, transparent 50%)',
              filter: 'blur(100px)',
              pointerEvents: 'none' as const
            }
          }),
          React.createElement(
            'div',
            {
              key: 'content',
              style: {
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 40px',
                position: 'relative' as const,
                zIndex: 1
              }
            },
            [
              React.createElement(
                'div',
                { key: 'header', style: { textAlign: 'center', marginBottom: '80px' } },
                [
                  React.createElement(
                    'h2',
                    {
                      key: 'h2',
                      style: {
                        fontSize: 'clamp(36px, 4vw, 48px)',
                        fontWeight: '700',
                        color: '#ffffff',
                        marginBottom: '24px'
                      }
                    },
                    'Three steps to your dream school.'
                  ),
                  React.createElement(
                    'p',
                    {
                      key: 'p',
                      style: {
                        fontSize: '20px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        maxWidth: '600px',
                        margin: '0 auto'
                      }
                    },
                    'Simple, transparent, and designed to get results.'
                  )
                ]
              ),
              React.createElement(
                'div',
                {
                  key: 'steps',
                  style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '48px'
                  }
                },
                [
                  {
                    number: '01',
                    title: 'Browse consultant gigs',
                    description: 'Filter by school, specialty, price, and reviews. Find consultants who match your specific needs.',
                    icon: '🔍'
                  },
                  {
                    number: '02',
                    title: 'Book and collaborate',
                    description: 'Message consultants, share documents securely, and work together on your timeline.',
                    icon: '💬'
                  },
                  {
                    number: '03',
                    title: 'Submit with confidence',
                    description: "Get expert feedback, revise until perfect, and submit applications you're proud of.",
                    icon: '🎯'
                  }
                ].map((step, index) =>
                  React.createElement(
                    'div',
                    { key: index, style: { textAlign: 'center' } },
                    [
                      React.createElement('div', { key: 'icon', style: { fontSize: '48px', marginBottom: '24px' } }, step.icon),
                      React.createElement(
                        'div',
                        { key: 'number', style: { fontSize: '14px', fontWeight: '600', color: '#60a5fa', marginBottom: '12px' } },
                        step.number
                      ),
                      React.createElement('h3', { key: 'title', style: { fontSize: '24px', fontWeight: '600', color: '#ffffff', marginBottom: '16px' } }, step.title),
                      React.createElement(
                        'p',
                        { key: 'desc', style: { fontSize: '16px', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6' } },
                        step.description
                      )
                    ]
                  )
                )
              )
            ]
          )
        ]
      ),
      React.createElement(
        'section',
        {
          key: 'trust',
          'data-section': true,
          style: {
            background: '#ffffff',
            padding: '120px 0'
          }
        },
        React.createElement(
          'div',
          {
            style: {
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 40px'
            }
          },
          [
            React.createElement(
              'div',
              {
                key: 'stats',
                style: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '48px',
                  marginBottom: '80px'
                }
              },
              stats.map((stat, index) =>
                React.createElement(
                  'div',
                  { key: index, style: { textAlign: 'center' } },
                  [
                    React.createElement(
                      'div',
                      {
                        key: 'value',
                        style: {
                          fontSize: 'clamp(36px, 4vw, 48px)',
                          fontWeight: '700',
                          color: '#111827',
                          marginBottom: '8px'
                        }
                      },
                      stat.value
                    ),
                    React.createElement(
                      'div',
                      { key: 'label', style: { fontSize: '16px', color: '#6b7280', fontWeight: '500' } },
                      stat.label
                    )
                  ]
                )
              )
            ),
            React.createElement(
              'div',
              {
                key: 'features',
                style: {
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '32px'
                }
              },
              [
                {
                  title: 'Secure document sharing',
                  description: 'Share essays and documents with end-to-end encryption. Your work stays private.',
                  icon: '🔒'
                },
                {
                  title: 'Built-in messaging',
                  description: 'Chat directly with consultants. Get quick answers without sharing personal contact info.',
                  icon: '💬'
                },
                {
                  title: 'Money-back guarantee',
                  description: 'Not satisfied? Get a full refund within 7 days. We stand behind our consultants.',
                  icon: '✅'
                }
              ].map((feature, index) =>
                React.createElement(
                  'div',
                  {
                    key: index,
                    style: {
                      background: '#f9fafb',
                      borderRadius: '16px',
                      padding: '32px',
                      textAlign: 'center'
                    }
                  },
                  [
                    React.createElement('div', { key: 'icon', style: { fontSize: '32px', marginBottom: '16px' } }, feature.icon),
                    React.createElement('h3', { key: 'title', style: { fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '12px' } }, feature.title),
                    React.createElement('p', { key: 'desc', style: { fontSize: '15px', color: '#6b7280', lineHeight: '1.6' } }, feature.description)
                  ]
                )
              )
            )
          ]
        )
      ),
      React.createElement(
        'section',
        {
          key: 'final-cta',
          style: {
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: 'white',
            padding: '160px 0',
            textAlign: 'center',
            position: 'relative' as const,
            overflow: 'hidden'
          }
        },
        [
          React.createElement('div', {
            key: 'bg-glow',
            style: {
              position: 'absolute' as const,
              top: '0',
              right: '-20%',
              width: '60%',
              height: '100%',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 60%)',
              filter: 'blur(100px)',
              pointerEvents: 'none' as const
            }
          }),
          React.createElement(
            'div',
            {
              key: 'content',
              style: {
                maxWidth: '800px',
                margin: '0 auto',
                padding: '0 40px',
                position: 'relative' as const,
                zIndex: 1
              }
            },
            [
              React.createElement(
                'h2',
                {
                  key: 'h2',
                  style: {
                    fontSize: 'clamp(48px, 6vw, 72px)',
                    fontWeight: '700',
                    marginBottom: '32px',
                    letterSpacing: '-0.02em'
                  }
                },
                ['Your future starts', React.createElement('br', { key: 'br' }), 'with one click.']
              ),
              React.createElement(
                'p',
                {
                  key: 'p',
                  style: {
                    fontSize: '22px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '48px',
                    lineHeight: '1.6'
                  }
                },
                'Join thousands of students who got into their dream schools with help from Proofr consultants.'
              ),
              React.createElement(
                'div',
                {
                  key: 'buttons',
                  style: {
                    display: 'flex',
                    gap: '16px',
                    justifyContent: 'center',
                    flexWrap: 'wrap' as const
                  }
                },
                [
                  React.createElement(
                    'button',
                    {
                      key: 'student',
                      style: {
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        padding: '20px 40px',
                        borderRadius: '12px',
                        fontSize: '18px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)'
                      }
                    },
                    'Browse Gigs →'
                  ),
                  React.createElement(
                    'button',
                    {
                      key: 'consultant',
                      style: {
                        background: 'transparent',
                        color: 'white',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        padding: '18px 40px',
                        borderRadius: '12px',
                        fontSize: '18px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }
                    },
                    'Start Earning'
                  )
                ]
              )
            ]
          )
        ]
      )
    ]
  )
}