import * as React from 'react'
import { NavigationBar } from '../../landing/components/NavigationBar/NavigationBar'
import { useState, useEffect, useRef } from 'react'

export function HowItWorksScreen() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState(0)
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({})
  const [studentSlideIndex, setStudentSlideIndex] = useState(0)
  const [consultantSlideIndex, setConsultantSlideIndex] = useState(0)
  
  // Debug: log when state changes
  useEffect(() => {
    console.log('STATE UPDATED - Student slide:', studentSlideIndex, 'Consultant slide:', consultantSlideIndex)
  }, [studentSlideIndex, consultantSlideIndex])
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const studentSectionRef = useRef<HTMLElement | null>(null)
  const consultantSectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop
      console.log('SCROLL EVENT FIRED - scrollY:', scrollY, 'window.scrollY:', window.scrollY, 'documentElement.scrollTop:', document.documentElement.scrollTop)
      
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const currentProgress = scrollY / scrollHeight
      setScrollProgress(currentProgress)

      // Check which elements are visible
      Object.entries(sectionRefs.current).forEach(([key, element]) => {
        if (element) {
          const rect = element.getBoundingClientRect()
          const isInView = rect.top < window.innerHeight * 1.2 && rect.bottom > -200
          setIsVisible(prev => ({ ...prev, [key]: isInView }))
        }
      })

      // Simple scroll-based slide detection
      
      // FIXED: Account for the fact that we can't scroll past the last viewport
      if (studentSectionRef.current) {
        const rect = studentSectionRef.current.getBoundingClientRect()
        
        if (rect.top <= 0 && rect.bottom > 0) {
          // Maximum scrollable distance is section height minus viewport height
          const maxScroll = rect.height - window.innerHeight
          const currentScroll = Math.abs(rect.top)
          const progress = Math.min(1, currentScroll / maxScroll)
          
          // Map progress to slides: 0-0.25 = slide 0, 0.25-0.5 = slide 1, etc
          const rawSlide = Math.floor(progress * 4)
          const slide = Math.min(3, rawSlide) // Clamp to max slide 3
          
          console.log('STUDENT - rect.height:', rect.height, 'maxScroll:', maxScroll, 'currentScroll:', currentScroll, 'progress:', progress, 'slide:', slide)
          
          // React will automatically prevent a re-render if the state is the same
          setStudentSlideIndex(slide)
        }
      }
      
      if (consultantSectionRef.current) {
        const rect = consultantSectionRef.current.getBoundingClientRect()
        
        if (rect.top <= 0 && rect.bottom > 0) {
          // Maximum scrollable distance is section height minus viewport height
          const maxScroll = rect.height - window.innerHeight
          const currentScroll = Math.abs(rect.top)
          const progress = Math.min(1, currentScroll / maxScroll)
          
          // Map progress to slides: 0-0.25 = slide 0, 0.25-0.5 = slide 1, etc
          const rawSlide = Math.floor(progress * 4)
          const slide = Math.min(3, rawSlide) // Clamp to max slide 3
          
          console.log('CONSULTANT - rect.height:', rect.height, 'maxScroll:', maxScroll, 'currentScroll:', currentScroll, 'progress:', progress, 'slide:', slide)
          
          // React will automatically prevent a re-render if the state is the same
          setConsultantSlideIndex(slide)
        }
      }
    }

    console.log('ADDING SCROLL LISTENER')
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => {
      console.log('REMOVING SCROLL LISTENER')
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const setSectionRef = (key: string) => (el: HTMLElement | null) => {
    sectionRefs.current[key] = el
  }

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
      
      // Hero Section - Centered like Cluely
      React.createElement(
        'section',
        {
          key: 'hero',
          style: {
            background: `linear-gradient(180deg, #E6F0FF 0%, #C8DCFF 100%)`,
            minHeight: '100vh',
            position: 'relative' as const,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }
        },
        [
          // Floating background elements
          React.createElement('div', {
            key: 'bg-blur-1',
            style: {
              position: 'absolute' as const,
              top: '10%',
              left: '-10%',
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(96, 165, 250, 0.3) 0%, transparent 70%)',
              filter: 'blur(80px)',
              transform: `translateY(${scrollProgress * 100}px)`
            }
          }),
          React.createElement('div', {
            key: 'bg-blur-2',
            style: {
              position: 'absolute' as const,
              bottom: '10%',
              right: '-10%',
              width: '500px',
              height: '500px',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
              filter: 'blur(100px)',
              transform: `translateY(${scrollProgress * -150}px)`
            }
          }),
          
          // Animated School Icons with Authentic Logos
          ...[
            { 
              name: 'Harvard', 
              color: '#A51C30', 
              x: '12%', 
              y: '25%', 
              delay: 0,
              logoImage: '/images/schools/harvard.jpg',
              fallbackLogo: React.createElement('text', {
                key: 'text',
                x: '22.5',
                y: '32',
                textAnchor: 'middle',
                fontSize: '28',
                fontWeight: 'bold',
                fontFamily: 'Georgia, serif',
                fill: 'white'
              }, 'H')
            },
            { 
              name: 'MIT', 
              color: '#750014', 
              x: '78%', 
              y: '20%', 
              delay: 0.2,
              logoImage: '/images/schools/mit.png',
              fallbackLogo: React.createElement('text', {
                key: 'text',
                x: '22.5',
                y: '28',
                textAnchor: 'middle',
                fontSize: '16',
                fontWeight: '900',
                fontFamily: 'Arial Black, sans-serif',
                letterSpacing: '-1',
                fill: 'white'
              }, 'MIT')
            },
            { 
              name: 'Stanford', 
              color: '#8C1515', 
              x: '85%', 
              y: '68%', 
              delay: 0.4,
              logoImage: '/images/schools/stanford.png',
              fallbackLogo: React.createElement('path', {
                key: 'tree',
                d: 'M22.5 8 C22.5 8, 20 10, 20 14 C18 14, 16 16, 16 18 C14 18, 12 20, 12 23 C12 26, 14 28, 17 28 L20 28 L20 35 L25 35 L25 28 L28 28 C31 28, 33 26, 33 23 C33 20, 31 18, 29 18 C29 16, 27 14, 25 14 C25 10, 22.5 8, 22.5 8',
                fill: 'white',
                stroke: 'none'
              })
            },
            { 
              name: 'Yale', 
              color: '#00356B', 
              x: '8%', 
              y: '65%', 
              delay: 0.6,
              logoImage: '/images/schools/yale.png',
              fallbackLogo: React.createElement('text', {
                key: 'text',
                x: '22.5',
                y: '32',
                textAnchor: 'middle',
                fontSize: '28',
                fontWeight: 'bold',
                fontFamily: 'Georgia, serif',
                fill: 'white'
              }, 'Y')
            },
            { 
              name: 'Princeton', 
              color: '#FF6900', 
              x: '20%', 
              y: '45%', 
              delay: 0.8,
              logoImage: '/images/schools/princeton.png',
              fallbackLogo: React.createElement('text', {
                key: 'text',
                x: '22.5',
                y: '32',
                textAnchor: 'middle',
                fontSize: '28',
                fontWeight: 'bold',
                fontFamily: 'Georgia, serif',
                fill: 'white'
              }, 'P')
            },
            { 
              name: 'Columbia', 
              color: '#003DA5', 
              x: '75%', 
              y: '42%', 
              delay: 1,
              logoImage: '/images/schools/columbia.png',
              fallbackLogo: React.createElement('text', {
                key: 'text',
                x: '22.5',
                y: '32',
                textAnchor: 'middle',
                fontSize: '28',
                fontWeight: 'bold',
                fontFamily: 'Georgia, serif',
                fill: 'white'
              }, 'C')
            },
          ].map((school, index) => 
            React.createElement(
              'div',
              {
                key: `school-icon-${index}`,
                style: {
                  position: 'absolute' as const,
                  left: school.x,
                  top: school.y,
                  width: '80px',
                  height: '80px',
                  background: school.color,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
                  animation: `schoolFloat ${6 + index}s ease-in-out ${school.delay}s infinite, schoolFadeIn 1s ease-out ${school.delay}s forwards, schoolBreath ${2.5 + index * 0.5}s ease-in-out ${school.delay + 1}s infinite`,
                  opacity: 0,
                  transform: 'scale(0)',
                  zIndex: 1,
                  overflow: 'hidden'
                }
              },
              school.logoImage ? 
                React.createElement('img', {
                  src: school.logoImage,
                  alt: school.name,
                  style: {
                    width: '55px',
                    height: '55px',
                    objectFit: 'contain'
                  }
                }) :
                React.createElement('svg', {
                  width: '45',
                  height: '45',
                  viewBox: '0 0 45 45',
                  fill: 'white'
                }, school.fallbackLogo)
            )
          ),
          
          // Add keyframes for school animations
          React.createElement('style', {
            key: 'school-animation-style',
            dangerouslySetInnerHTML: {
              __html: `
                @keyframes schoolFadeIn {
                  0% {
                    transform: scale(0) rotate(0deg);
                    opacity: 0;
                  }
                  50% {
                    transform: scale(1.1) rotate(10deg);
                    opacity: 0.5;
                  }
                  100% {
                    transform: scale(1) rotate(0deg);
                    opacity: 0.8;
                  }
                }
                
                @keyframes schoolFloat {
                  0%, 100% {
                    transform: translateY(0px) translateX(0px);
                  }
                  25% {
                    transform: translateY(-15px) translateX(10px);
                  }
                  50% {
                    transform: translateY(0px) translateX(-10px);
                  }
                  75% {
                    transform: translateY(15px) translateX(5px);
                  }
                }
                
                @keyframes schoolBreath {
                  0%, 100% {
                    transform: scale(1);
                  }
                  50% {
                    transform: scale(1.15);
                  }
                }
                
                @media (max-width: 768px) {
                  .school-icon {
                    width: 60px !important;
                    height: 60px !important;
                  }
                }
              `
            }
          }),
          
          React.createElement(
            'div',
            {
              style: {
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 40px',
                position: 'relative' as const,
                zIndex: 1,
                textAlign: 'center'
              }
            },
            [
              React.createElement(
                'h1',
                {
                  key: 'h1',
                  style: {
                    fontSize: 'clamp(48px, 8vw, 72px)',
                    fontWeight: '800',
                    letterSpacing: '-0.03em',
                    marginBottom: '32px',
                    color: '#000000',
                    lineHeight: '1.1'
                  }
                },
                "Your dream school awaits."
              ),
              React.createElement(
                'p',
                {
                  key: 'subtitle',
                  style: {
                    fontSize: '24px',
                    color: '#6B7280',
                    marginBottom: '48px',
                    maxWidth: '600px',
                    margin: '0 auto 48px auto',
                    lineHeight: '1.4'
                  }
                },
                'Connect with verified students from your dream schools. Get personalized help that actually works.'
              ),
              React.createElement(
                'div',
                {
                  key: 'cta-buttons',
                  style: {
                    display: 'flex',
                    gap: '16px',
                    justifyContent: 'center'
                  }
                },
                [
                  React.createElement(
                    'button',
                    {
                      key: 'primary',
                      style: {
                        background: '#0055FE',
                        color: 'white',
                        border: 'none',
                        padding: '16px 32px',
                        borderRadius: '24px',
                        fontSize: '18px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 12px rgba(0, 85, 254, 0.3)'
                      },
                      onMouseEnter: (e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 85, 254, 0.4)'
                      },
                      onMouseLeave: (e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 85, 254, 0.3)'
                      }
                    },
                    'Browse Consultants'
                  ),
                  React.createElement(
                    'button',
                    {
                      key: 'secondary',
                      style: {
                        background: 'transparent',
                        color: '#0055FE',
                        border: '2px solid #0055FE',
                        padding: '14px 32px',
                        borderRadius: '24px',
                        fontSize: '18px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      },
                      onMouseEnter: (e) => {
                        e.currentTarget.style.background = 'rgba(0, 85, 254, 0.05)'
                      },
                      onMouseLeave: (e) => {
                        e.currentTarget.style.background = 'transparent'
                      }
                    },
                    'Become a Consultant'
                  )
                ]
              )
            ]
          )
        ]
      ),

      // Student Split-Screen Section with Sticky Left
      React.createElement(
        'section',
        {
          key: 'student-journey',
          ref: studentSectionRef,
          style: {
            position: 'relative' as const,
            display: 'flex',
            minHeight: '400vh',
            background: 'linear-gradient(180deg, #C8DCFF 0%, #ffffff 100%)'
          }
        },
        [
          // Left side - Sticky slideshow
          React.createElement(
            'div',
            {
              key: 'left',
              style: {
                width: '50%',
                position: 'sticky' as const,
                top: 0,
                height: '100vh',
                background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'flex-start'
              }
            },
              [
                // Debug heading to show active slide
                React.createElement(
                  'div',
                  {
                    key: 'slide-debug',
                    style: {
                      position: 'absolute' as const,
                      top: '20px',
                      left: '20px',
                      background: 'rgba(0, 0, 0, 0.8)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      zIndex: 1000
                    }
                  },
                  `Student Slide: ${studentSlideIndex + 1}/4`
                ),
                
                // Slide 1 - Search
                React.createElement(
                  'div',
                  {
                    key: 'slide-1',
                    style: {
                      position: 'absolute' as const,
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: studentSlideIndex === 0 ? 1 : 0,
                      transition: 'opacity 0.6s ease-in-out'
                    }
                  },
                  React.createElement(
                    'div',
                    {
                      style: {
                        width: '80%',
                        maxWidth: '500px',
                        background: 'white',
                        borderRadius: '24px',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                        padding: '40px',
                        transform: 'perspective(1000px) rotateY(5deg)'
                      }
                    },
                    [
                      React.createElement(
                        'div',
                        {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '32px'
                          }
                        },
                        [
                          React.createElement('div', { style: { width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' } }),
                          React.createElement('div', { style: { width: '8px', height: '8px', borderRadius: '50%', background: '#eab308' } }),
                          React.createElement('div', { style: { width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' } })
                        ]
                      ),
                      React.createElement('input', {
                        type: 'text',
                        placeholder: 'Search for consultants...',
                        style: {
                          width: '100%',
                          padding: '16px 20px',
                          fontSize: '16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '12px',
                          marginBottom: '24px',
                          background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)'
                        }
                      }),
                      React.createElement(
                        'div',
                        { style: { display: 'flex', flexWrap: 'wrap' as const, gap: '8px' } },
                        ['Harvard', 'Essay Help', 'Interview Prep', 'MIT'].map(tag =>
                          React.createElement(
                            'span',
                            {
                              key: tag,
                              style: {
                                padding: '6px 12px',
                                background: 'linear-gradient(135deg, #E6F0FF 0%, #C8DCFF 100%)',
                                borderRadius: '16px',
                                fontSize: '14px',
                                color: '#0055FE'
                              }
                            },
                            tag
                          )
                        )
                      )
                    ]
                  )
                ),
                
                // Slide 2 - Browse Results
                React.createElement(
                  'div',
                  {
                    key: 'slide-2',
                    style: {
                      position: 'absolute' as const,
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: studentSlideIndex === 1 ? 1 : 0,
                      transition: 'opacity 0.6s ease-in-out'
                    }
                  },
                  React.createElement(
                    'div',
                    {
                      style: {
                        width: '80%',
                        maxWidth: '500px'
                      }
                    },
                    [1, 2].map(i =>
                      React.createElement(
                        'div',
                        {
                          key: i,
                          style: {
                            background: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            marginBottom: '16px',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                            border: '1px solid rgba(0, 85, 254, 0.1)',
                            transform: `translateY(${i * 5}px)`
                          }
                        },
                        [
                          React.createElement(
                            'div',
                            { style: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' } },
                            [
                              React.createElement(
                                'div',
                                {
                                  style: {
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #0055FE 0%, #0040BE 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: '600'
                                  }
                                },
                                ['SC', 'MP'][i-1]
                              ),
                              React.createElement('div', {}, [
                                React.createElement('h4', { style: { fontWeight: '600', marginBottom: '4px' } }, `Harvard '2${5+i} Student`),
                                React.createElement('p', { style: { fontSize: '14px', color: '#6B7280' } }, '⭐ 4.9 • 127 reviews')
                              ])
                            ]
                          ),
                          React.createElement('p', { style: { fontSize: '14px', color: '#4B5563', marginBottom: '12px' } }, 
                            'Specialized in Common App essays and Harvard supplementals. Quick turnaround.'),
                          React.createElement(
                            'div',
                            { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                            [
                              React.createElement('span', { style: { fontWeight: '600', color: '#0055FE' } }, '$35/essay'),
                              React.createElement(
                                'button',
                                {
                                  style: {
                                    background: 'linear-gradient(135deg, #0055FE 0%, #0040BE 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                  }
                                },
                                'View Profile'
                              )
                            ]
                          )
                        ]
                      )
                    )
                  )
                ),
                
                // Slide 3 - Chat/Collaborate
                React.createElement(
                  'div',
                  {
                    key: 'slide-3',
                    style: {
                      position: 'absolute' as const,
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: studentSlideIndex === 2 ? 1 : 0,
                      transition: 'opacity 0.6s ease-in-out'
                    }
                  },
                  React.createElement(
                    'div',
                    {
                      style: {
                        width: '80%',
                        maxWidth: '500px',
                        background: 'white',
                        borderRadius: '24px',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                        overflow: 'hidden'
                      }
                    },
                    [
                      React.createElement(
                        'div',
                        {
                          style: {
                            background: 'linear-gradient(135deg, #0055FE 0%, #0040BE 100%)',
                            padding: '20px',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }
                        },
                        [
                          React.createElement(
                            'div',
                            {
                              style: {
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }
                            },
                            'SC'
                          ),
                          React.createElement('div', {}, [
                            React.createElement('div', { style: { fontWeight: '600' } }, 'Sarah Chen'),
                            React.createElement('div', { style: { fontSize: '14px', opacity: 0.8 } }, 'Online now')
                          ])
                        ]
                      ),
                      React.createElement(
                        'div',
                        { style: { padding: '24px', height: '300px', display: 'flex', flexDirection: 'column' as const } },
                        [
                          React.createElement(
                            'div',
                            { style: { flex: 1, display: 'flex', flexDirection: 'column' as const, gap: '16px' } },
                            [
                              React.createElement(
                                'div',
                                {
                                  style: {
                                    background: '#f3f4f6',
                                    padding: '12px 16px',
                                    borderRadius: '16px',
                                    alignSelf: 'flex-start',
                                    maxWidth: '80%'
                                  }
                                },
                                'Hi! I see you\'re working on Harvard essays. I\'d love to help!'
                              ),
                              React.createElement(
                                'div',
                                {
                                  style: {
                                    background: 'linear-gradient(135deg, #E6F0FF 0%, #C8DCFF 100%)',
                                    padding: '12px 16px',
                                    borderRadius: '16px',
                                    alignSelf: 'flex-end',
                                    maxWidth: '80%'
                                  }
                                },
                                'That would be great! I\'m struggling with the "why Harvard" prompt.'
                              )
                            ]
                          ),
                          React.createElement('input', {
                            type: 'text',
                            placeholder: 'Type a message...',
                            style: {
                              padding: '12px 16px',
                              border: '2px solid #e5e7eb',
                              borderRadius: '24px',
                              fontSize: '14px'
                            }
                          })
                        ]
                      )
                    ]
                  )
                ),
                
                // Slide 4 - Success
                React.createElement(
                  'div',
                  {
                    key: 'slide-4',
                    style: {
                      position: 'absolute' as const,
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: studentSlideIndex === 3 ? 1 : 0,
                      transition: 'opacity 0.6s ease-in-out'
                    }
                  },
                  React.createElement(
                    'div',
                    {
                      style: {
                        textAlign: 'center'
                      }
                    },
                    [
                      React.createElement(
                        'div',
                        {
                          style: {
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 32px auto',
                            fontSize: '48px',
                            color: 'white'
                          }
                        },
                        '✓'
                      ),
                      React.createElement(
                        'h3',
                        {
                          style: {
                            fontSize: '32px',
                            fontWeight: '700',
                            marginBottom: '16px',
                            background: 'linear-gradient(135deg, #0055FE 0%, #0040BE 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                          }
                        },
                        'Application Submitted!'
                      ),
                      React.createElement(
                        'p',
                        {
                          style: {
                            fontSize: '18px',
                            color: '#6B7280',
                            maxWidth: '300px',
                            margin: '0 auto'
                          }
                        },
                        'Your essays are polished and ready. Good luck with your application!'
                      )
                    ]
                  )
                )
              ]
            ),
            
          // Right side - Scrolling content
          React.createElement(
            'div',
            {
              key: 'right',
              style: {
                width: '50%',
                background: 'white',
                position: 'relative' as const,
                zIndex: 1
              }
            },
              React.createElement(
                'div',
                {
                  'data-scrolling-content': true,
                  style: {
                    padding: '80px'
                  }
                },
                [
                  // Panel 1
                  React.createElement(
                    'div',
                    {
                      'data-panel': true,
                      style: {
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column' as const,
                        justifyContent: 'center'
                      }
                    },
                    [
                      React.createElement('h2', { style: { fontSize: '48px', fontWeight: '700', marginBottom: '24px' } }, 
                        'Find Your Perfect Consultant'),
                      React.createElement('p', { style: { fontSize: '20px', color: '#6B7280', marginBottom: '32px' } }, 
                        'Search by school, specialty, price, and reviews. Our smart matching helps you find consultants who\'ve been exactly where you want to go.'),
                      React.createElement(
                        'ul',
                        { style: { listStyle: 'none', padding: 0 } },
                        ['Filter by dream schools', 'Read verified reviews', 'Compare prices instantly'].map(item =>
                          React.createElement('li', { 
                            key: item,
                            style: { 
                              padding: '12px 0', 
                              fontSize: '18px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px'
                            } 
                          }, ['✓', item])
                        )
                      )
                    ]
                  ),
                  
                  // Panel 2
                  React.createElement(
                    'div',
                    {
                      'data-panel': true,
                      style: {
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column' as const,
                        justifyContent: 'center'
                      }
                    },
                    [
                      React.createElement('h2', { style: { fontSize: '48px', fontWeight: '700', marginBottom: '24px' } }, 
                        'Browse & Compare'),
                      React.createElement('p', { style: { fontSize: '20px', color: '#6B7280', marginBottom: '32px' } }, 
                        'See detailed profiles, success rates, and sample work. Every consultant is verified with their university email.'),
                      React.createElement(
                        'div',
                        { style: { display: 'grid', gap: '16px' } },
                        [
                          { icon: '🎓', text: 'Verified university students' },
                          { icon: '⭐', text: 'Real reviews from applicants' },
                          { icon: '📊', text: 'Success rates and specialties' }
                        ].map(item =>
                          React.createElement(
                            'div',
                            {
                              key: item.text,
                              style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                padding: '16px',
                                background: '#f9fafb',
                                borderRadius: '12px'
                              }
                            },
                            [
                              React.createElement('span', { style: { fontSize: '24px' } }, item.icon),
                              React.createElement('span', { style: { fontSize: '16px' } }, item.text)
                            ]
                          )
                        )
                      )
                    ]
                  ),
                  
                  // Panel 3
                  React.createElement(
                    'div',
                    {
                      'data-panel': true,
                      style: {
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column' as const,
                        justifyContent: 'center'
                      }
                    },
                    [
                      React.createElement('h2', { style: { fontSize: '48px', fontWeight: '700', marginBottom: '24px' } }, 
                        'Collaborate Securely'),
                      React.createElement('p', { style: { fontSize: '20px', color: '#6B7280', marginBottom: '32px' } }, 
                        'Share documents, chat in real-time, and get feedback fast. Everything happens on our secure platform.'),
                      React.createElement(
                        'div',
                        {
                          style: {
                            background: 'linear-gradient(135deg, #E6F0FF 0%, #C8DCFF 100%)',
                            borderRadius: '16px',
                            padding: '32px'
                          }
                        },
                        [
                          React.createElement('h4', { style: { fontWeight: '600', marginBottom: '16px', color: '#1f2937' } }, 'Platform Features:'),
                          React.createElement(
                            'div',
                            { style: { display: 'grid', gap: '12px' } },
                            ['Encrypted document sharing', 'Built-in video calls', 'Track changes & comments', 'Mobile app access'].map(feature =>
                              React.createElement('div', { 
                                key: feature,
                                style: { 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '8px',
                                  fontSize: '16px',
                                  color: '#374151'
                                } 
                              }, ['•', feature])
                            )
                          )
                        ]
                      )
                    ]
                  ),
                  
                  // Panel 4
                  React.createElement(
                    'div',
                    {
                      'data-panel': true,
                      style: {
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column' as const,
                        justifyContent: 'center'
                      }
                    },
                    [
                      React.createElement('h2', { style: { fontSize: '48px', fontWeight: '700', marginBottom: '24px' } }, 
                        'Submit with Confidence'),
                      React.createElement('p', { style: { fontSize: '20px', color: '#6B7280', marginBottom: '32px' } }, 
                        'Get into your dream school with essays that stand out. Join thousands of successful applicants.'),
                      React.createElement(
                        'div',
                        { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '48px' } },
                        [
                          { value: '98%', label: 'Success Rate' },
                          { value: '15K+', label: 'Students Helped' },
                          { value: '4.9', label: 'Average Rating' },
                          { value: '48hr', label: 'Avg. Turnaround' }
                        ].map(stat =>
                          React.createElement(
                            'div',
                            {
                              key: stat.label,
                              style: {
                                textAlign: 'center',
                                padding: '24px',
                                background: '#f9fafb',
                                borderRadius: '12px'
                              }
                            },
                            [
                              React.createElement('div', { style: { fontSize: '36px', fontWeight: '700', color: '#0055FE' } }, stat.value),
                              React.createElement('div', { style: { fontSize: '14px', color: '#6B7280', marginTop: '8px' } }, stat.label)
                            ]
                          )
                        )
                      )
                    ]
                  )
                ]
              )
            )
        ]
      ),

      // Consultant Split-Screen Section with Sticky Right
      React.createElement(
        'section',
        {
          key: 'consultant-journey',
          ref: consultantSectionRef,
          style: {
            position: 'relative' as const,
            display: 'flex',
            minHeight: '400vh',
            background: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)'
          }
        },
        [
          // Left side - Scrolling content
          React.createElement(
            'div',
            {
              key: 'left',
              style: {
                width: '50%',
                background: 'white',
                position: 'relative' as const,
                zIndex: 1
              }
            },
              React.createElement(
                'div',
                {
                  'data-scrolling-content': true,
                  style: {
                    padding: '80px'
                  }
                },
                [
                  // Panel 1
                  React.createElement(
                    'div',
                    {
                      'data-panel': true,
                      style: {
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column' as const,
                        justifyContent: 'center'
                      }
                    },
                  [
                    React.createElement('h2', { style: { fontSize: '48px', fontWeight: '700', marginBottom: '24px' } }, 
                      'Create Your Profile'),
                    React.createElement('p', { style: { fontSize: '20px', color: '#6B7280', marginBottom: '32px' } }, 
                      'Set up your consultant profile in minutes. Showcase your achievements, set your rates, and start earning.'),
                    React.createElement(
                      'div',
                      { style: { display: 'grid', gap: '16px' } },
                      [
                        { step: '1', text: 'Verify your university email' },
                        { step: '2', text: 'Add your achievements & stats' },
                        { step: '3', text: 'Set your services & pricing' }
                      ].map(item =>
                        React.createElement(
                          'div',
                          {
                            key: item.step,
                            style: {
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px'
                            }
                          },
                          [
                            React.createElement(
                              'div',
                              {
                                style: {
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '50%',
                                  background: 'linear-gradient(135deg, #0055FE 0%, #0040BE 100%)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontWeight: '600'
                                }
                              },
                              item.step
                            ),
                            React.createElement('span', { style: { fontSize: '18px' } }, item.text)
                          ]
                        )
                      )
                    )
                    ]
                  ),
                  
                  // Panel 2
                  React.createElement(
                    'div',
                    {
                      'data-panel': true,
                      style: {
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column' as const,
                        justifyContent: 'center'
                      }
                    },
                  [
                    React.createElement('h2', { style: { fontSize: '48px', fontWeight: '700', marginBottom: '24px' } }, 
                      'Set Your Terms'),
                    React.createElement('p', { style: { fontSize: '20px', color: '#6B7280', marginBottom: '32px' } }, 
                      'You\'re in control. Choose what services to offer, set your own prices, and work on your schedule.'),
                    React.createElement(
                      'div',
                      {
                        style: {
                          background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                          borderRadius: '16px',
                          padding: '32px'
                        }
                      },
                      [
                        React.createElement('h4', { style: { fontWeight: '600', marginBottom: '24px' } }, 'Popular Services:'),
                        [
                          { service: 'Essay Review', price: '$35-75' },
                          { service: 'Full Application Review', price: '$200-500' },
                          { service: 'Interview Prep', price: '$50-100' },
                          { service: 'Strategy Session', price: '$75-150' }
                        ].map(item =>
                          React.createElement(
                            'div',
                            {
                              key: item.service,
                              style: {
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px 0',
                                borderBottom: '1px solid #e5e7eb'
                              }
                            },
                            [
                              React.createElement('span', {}, item.service),
                              React.createElement('span', { style: { fontWeight: '600', color: '#0055FE' } }, item.price)
                            ]
                          )
                        )
                      ]
                    )
                    ]
                  ),
                  
                  // Panel 3
                  React.createElement(
                    'div',
                    {
                      'data-panel': true,
                      style: {
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column' as const,
                        justifyContent: 'center'
                      }
                    },
                  [
                    React.createElement('h2', { style: { fontSize: '48px', fontWeight: '700', marginBottom: '24px' } }, 
                      'Help Students Succeed'),
                    React.createElement('p', { style: { fontSize: '20px', color: '#6B7280', marginBottom: '32px' } }, 
                      'Use your experience to guide the next generation. Make a real impact while earning money.'),
                    React.createElement(
                      'div',
                      { style: { display: 'grid', gap: '20px' } },
                      [
                        { icon: '💡', title: 'Share Your Insights', desc: 'Your unique perspective is valuable' },
                        { icon: '🎯', title: 'Make an Impact', desc: 'Help students achieve their dreams' },
                        { icon: '💰', title: 'Earn Flexibly', desc: 'Work as much or as little as you want' }
                      ].map(item =>
                        React.createElement(
                          'div',
                          {
                            key: item.title,
                            style: {
                              display: 'flex',
                              gap: '16px'
                            }
                          },
                          [
                            React.createElement('span', { style: { fontSize: '32px' } }, item.icon),
                            React.createElement('div', {}, [
                              React.createElement('h4', { style: { fontWeight: '600', marginBottom: '4px' } }, item.title),
                              React.createElement('p', { style: { fontSize: '14px', color: '#6B7280' } }, item.desc)
                            ])
                          ]
                        )
                      )
                    )
                    ]
                  ),
                  
                  // Panel 4
                  React.createElement(
                    'div',
                    {
                      'data-panel': true,
                      style: {
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column' as const,
                        justifyContent: 'center'
                      }
                    },
                  [
                    React.createElement('h2', { style: { fontSize: '48px', fontWeight: '700', marginBottom: '24px' } }, 
                      'Grow Your Business'),
                    React.createElement('p', { style: { fontSize: '20px', color: '#6B7280', marginBottom: '32px' } }, 
                      'Build your reputation, get great reviews, and watch your client base grow. Top consultants earn $2,000+ per month.'),
                    React.createElement(
                      'div',
                      {
                        style: {
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          borderRadius: '16px',
                          padding: '32px',
                          color: 'white'
                        }
                      },
                      [
                        React.createElement('h4', { style: { fontSize: '24px', fontWeight: '600', marginBottom: '24px' } }, 
                          'Success Story'),
                        React.createElement('p', { style: { fontSize: '16px', marginBottom: '16px', opacity: 0.9 } }, 
                          '"I started consulting in my sophomore year. Now I help 20+ students per month and earn enough to cover my expenses and save for grad school."'),
                        React.createElement('p', { style: { fontSize: '14px', fontStyle: 'italic' } }, 
                          '- Jessica L., Harvard \'25')
                      ]
                    )
                    ]
                  )
                ]
              )
            ),
            
          // Right side - Sticky slideshow
          React.createElement(
            'div',
            {
              key: 'right',
              style: {
                width: '50%',
                position: 'sticky' as const,
                top: 0,
                height: '100vh',
                background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'flex-start'
              }
            },
              [
                // Debug heading to show active slide
                React.createElement(
                  'div',
                  {
                    key: 'slide-debug-consultant',
                    style: {
                      position: 'absolute' as const,
                      top: '20px',
                      right: '20px',
                      background: 'rgba(0, 0, 0, 0.8)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      zIndex: 1000
                    }
                  },
                  `Consultant Slide: ${consultantSlideIndex + 1}/4`
                ),
                
                // Slide 1 - Profile Setup
                React.createElement(
                  'div',
                  {
                    key: 'slide-1',
                    style: {
                      position: 'absolute' as const,
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: consultantSlideIndex === 0 ? 1 : 0,
                      transition: 'opacity 0.6s ease-in-out'
                    }
                  },
                  React.createElement(
                    'div',
                    {
                      style: {
                        width: '80%',
                        maxWidth: '500px',
                        background: 'white',
                        borderRadius: '24px',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                        padding: '40px'
                      }
                    },
                    [
                      React.createElement('h3', { style: { fontSize: '24px', fontWeight: '600', marginBottom: '32px' } }, 
                        'Complete Your Profile'),
                      React.createElement(
                        'div',
                        { style: { display: 'grid', gap: '20px' } },
                        [
                          { label: 'University', value: 'Harvard University', verified: true },
                          { label: 'Year', value: 'Class of 2025' },
                          { label: 'Major', value: 'Computer Science' },
                          { label: 'GPA', value: '3.9/4.0' }
                        ].map(field =>
                          React.createElement(
                            'div',
                            { key: field.label },
                            [
                              React.createElement(
                                'label',
                                { style: { fontSize: '14px', color: '#6B7280', marginBottom: '8px', display: 'block' } },
                                field.label
                              ),
                              React.createElement(
                                'div',
                                {
                                  style: {
                                    padding: '12px 16px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                  }
                                },
                                [
                                  React.createElement('span', {}, field.value),
                                  field.verified && React.createElement(
                                    'span',
                                    { style: { color: '#10b981', fontSize: '14px' } },
                                    '✓ Verified'
                                  )
                                ]
                              )
                            ]
                          )
                        )
                      )
                    ]
                  )
                ),
                
                // Slide 2 - Services & Pricing
                React.createElement(
                  'div',
                  {
                    key: 'slide-2',
                    style: {
                      position: 'absolute' as const,
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: consultantSlideIndex === 1 ? 1 : 0,
                      transition: 'opacity 0.6s ease-in-out'
                    }
                  },
                  React.createElement(
                    'div',
                    {
                      style: {
                        width: '80%',
                        maxWidth: '500px',
                        background: 'white',
                        borderRadius: '24px',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                        padding: '40px'
                      }
                    },
                    [
                      React.createElement('h3', { style: { fontSize: '24px', fontWeight: '600', marginBottom: '32px' } }, 
                        'Your Services'),
                      React.createElement(
                        'div',
                        { style: { display: 'grid', gap: '16px' } },
                        [
                          { service: 'Essay Review', price: 50, time: '48 hours', active: true },
                          { service: 'Interview Prep', price: 75, time: '1 hour session', active: true },
                          { service: 'Full Application', price: 300, time: '1 week', active: false }
                        ].map(item =>
                          React.createElement(
                            'div',
                            {
                              key: item.service,
                              style: {
                                padding: '20px',
                                border: `2px solid ${item.active ? '#0055FE' : '#e5e7eb'}`,
                                borderRadius: '12px',
                                background: item.active ? 'linear-gradient(135deg, #E6F0FF 0%, #ffffff 100%)' : 'white'
                              }
                            },
                            [
                              React.createElement(
                                'div',
                                { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } },
                                [
                                  React.createElement('h4', { style: { fontWeight: '600' } }, item.service),
                                  React.createElement(
                                    'label',
                                    { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                                    [
                                      React.createElement('input', { 
                                        type: 'checkbox', 
                                        checked: item.active,
                                        style: { width: '20px', height: '20px' }
                                      }),
                                      React.createElement('span', { style: { fontSize: '14px' } }, 'Active')
                                    ]
                                  )
                                ]
                              ),
                              React.createElement(
                                'div',
                                { style: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6B7280' } },
                                [
                                  React.createElement('span', {}, `$${item.price}`),
                                  React.createElement('span', {}, item.time)
                                ]
                              )
                            ]
                          )
                        )
                      )
                    ]
                  )
                ),
                
                // Slide 3 - Active Requests
                React.createElement(
                  'div',
                  {
                    key: 'slide-3',
                    style: {
                      position: 'absolute' as const,
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: consultantSlideIndex === 2 ? 1 : 0,
                      transition: 'opacity 0.6s ease-in-out'
                    }
                  },
                  React.createElement(
                    'div',
                    {
                      style: {
                        width: '80%',
                        maxWidth: '500px'
                      }
                    },
                    [
                      React.createElement(
                        'div',
                        {
                          style: {
                            background: 'linear-gradient(135deg, #0055FE 0%, #0040BE 100%)',
                            color: 'white',
                            padding: '20px 24px',
                            borderRadius: '16px 16px 0 0',
                            fontSize: '18px',
                            fontWeight: '600'
                          }
                        },
                        '3 New Requests'
                      ),
                      React.createElement(
                        'div',
                        {
                          style: {
                            background: 'white',
                            borderRadius: '0 0 16px 16px',
                            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
                          }
                        },
                        [1, 2, 3].map(i =>
                          React.createElement(
                            'div',
                            {
                              key: i,
                              style: {
                                padding: '20px 24px',
                                borderBottom: i < 3 ? '1px solid #e5e7eb' : 'none'
                              }
                            },
                            [
                              React.createElement(
                                'div',
                                { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' } },
                                [
                                  React.createElement('span', { style: { fontWeight: '600' } }, 'Essay Review Request'),
                                  React.createElement('span', { style: { color: '#10b981', fontWeight: '500' } }, '$50')
                                ]
                              ),
                              React.createElement('p', { style: { fontSize: '14px', color: '#6B7280', marginBottom: '12px' } }, 
                                'Help with Harvard supplemental essay - 650 words'),
                              React.createElement(
                                'div',
                                { style: { display: 'flex', gap: '8px' } },
                                [
                                  React.createElement(
                                    'button',
                                    {
                                      style: {
                                        background: 'linear-gradient(135deg, #0055FE 0%, #0040BE 100%)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        cursor: 'pointer'
                                      }
                                    },
                                    'Accept'
                                  ),
                                  React.createElement(
                                    'button',
                                    {
                                      style: {
                                        background: 'transparent',
                                        color: '#6B7280',
                                        border: '1px solid #e5e7eb',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        cursor: 'pointer'
                                      }
                                    },
                                    'View Details'
                                  )
                                ]
                              )
                            ]
                          )
                        )
                      )
                    ]
                  )
                ),
                
                // Slide 4 - Earnings Dashboard
                React.createElement(
                  'div',
                  {
                    key: 'slide-4',
                    style: {
                      position: 'absolute' as const,
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: consultantSlideIndex === 3 ? 1 : 0,
                      transition: 'opacity 0.6s ease-in-out'
                    }
                  },
                  React.createElement(
                    'div',
                    {
                      style: {
                        width: '80%',
                        maxWidth: '500px',
                        background: 'white',
                        borderRadius: '24px',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                        padding: '40px',
                        textAlign: 'center'
                      }
                    },
                    [
                      React.createElement('h3', { style: { fontSize: '24px', fontWeight: '600', marginBottom: '32px' } }, 
                        'Your Earnings'),
                      React.createElement(
                        'div',
                        {
                          style: {
                            fontSize: '48px',
                            fontWeight: '700',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '8px'
                          }
                        },
                        '$1,847'
                      ),
                      React.createElement('p', { style: { fontSize: '16px', color: '#6B7280', marginBottom: '32px' } }, 
                        'This month'),
                      React.createElement(
                        'div',
                        { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px' } },
                        [
                          { label: 'Total Jobs', value: '47' },
                          { label: 'Avg Rating', value: '4.9' },
                          { label: 'Response Rate', value: '95%' }
                        ].map(stat =>
                          React.createElement(
                            'div',
                            {
                              key: stat.label,
                              style: {
                                padding: '16px',
                                background: '#f9fafb',
                                borderRadius: '12px'
                              }
                            },
                            [
                              React.createElement('div', { style: { fontSize: '24px', fontWeight: '600' } }, stat.value),
                              React.createElement('div', { style: { fontSize: '12px', color: '#6B7280', marginTop: '4px' } }, stat.label)
                            ]
                          )
                        )
                      ),
                      React.createElement(
                        'button',
                        {
                          style: {
                            width: '100%',
                            background: 'linear-gradient(135deg, #0055FE 0%, #0040BE 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '16px',
                            borderRadius: '12px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }
                        },
                        'Withdraw Earnings'
                      )
                    ]
                  )
                )
            ]
          )
        ]
      ),

      // Transition to darker sections - "This feels like cheating"
      React.createElement(
        'section',
        {
          key: 'cheating',
          style: {
            background: 'linear-gradient(180deg, #f9fafb 0%, #1e293b 100%)',
            padding: '200px 0',
            textAlign: 'center',
            position: 'relative' as const
          }
        },
        React.createElement(
          'div',
          {
            style: {
              maxWidth: '800px',
              margin: '0 auto',
              padding: '0 40px'
            }
          },
          [
            React.createElement(
              'h2',
              {
                style: {
                  fontSize: 'clamp(48px, 7vw, 64px)',
                  fontWeight: '700',
                  color: '#ffffff',
                  marginBottom: '48px',
                  letterSpacing: '-0.02em'
                }
              },
              '"This feels like cheating."'
            ),
            React.createElement(
              'button',
              {
                style: {
                  background: '#181B20',
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  padding: '16px 32px',
                  borderRadius: '24px',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              },
              ['We agree.', React.createElement('span', { key: 'arrow' }, '→')]
            )
          ]
        )
      ),

      // Dark powerful section - "Undetectable by design"
      React.createElement(
        'section',
        {
          key: 'undetectable',
          style: {
            background: '#181B20',
            color: 'white',
            padding: '120px 0',
            position: 'relative' as const
          }
        },
        [
          React.createElement('div', {
            key: 'glow',
            style: {
              position: 'absolute' as const,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '800px',
              height: '800px',
              background: 'radial-gradient(circle, rgba(0, 85, 254, 0.15) 0%, transparent 50%)',
              filter: 'blur(120px)'
            }
          }),
          React.createElement(
            'div',
            {
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
                {
                  style: {
                    textAlign: 'center',
                    marginBottom: '80px'
                  }
                },
                [
                  React.createElement(
                    'h2',
                    {
                      style: {
                        fontSize: 'clamp(48px, 6vw, 64px)',
                        fontWeight: '700',
                        marginBottom: '24px',
                        letterSpacing: '-0.02em'
                      }
                    },
                    'Built for results.'
                  ),
                  React.createElement(
                    'p',
                    {
                      style: {
                        fontSize: '20px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        maxWidth: '600px',
                        margin: '0 auto'
                      }
                    },
                    'Everything you need to succeed, nothing you don\'t.'
                  )
                ]
              ),
              
              // Features grid
              React.createElement(
                'div',
                {
                  style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '32px',
                    marginTop: '64px'
                  }
                },
                [
                  { icon: '🔒', title: 'Secure & Private', desc: 'Your documents and conversations are encrypted end-to-end' },
                  { icon: '✓', title: 'Verified Experts', desc: 'All consultants verify their university credentials' },
                  { icon: '💬', title: 'Real-time Chat', desc: 'Message consultants directly without sharing personal info' },
                  { icon: '💰', title: 'Money-back Guarantee', desc: 'Not satisfied? Get a full refund within 7 days' },
                  { icon: '⚡', title: 'Fast Turnaround', desc: 'Most reviews completed within 48 hours' },
                  { icon: '🎯', title: 'Success Rate', desc: '98% of students report improved applications' }
                ].map((feature, i) => 
                  React.createElement(
                    'div',
                    {
                      key: i,
                      ref: setSectionRef(`feature-${i}`),
                      style: {
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '32px',
                        textAlign: 'center',
                        transform: isVisible[`feature-${i}`] ? 'translateY(0)' : 'translateY(20px)',
                        opacity: isVisible[`feature-${i}`] ? 1 : 0,
                        transition: 'all 0.6s ease',
                        transitionDelay: `${i * 0.1}s`
                      }
                    },
                    [
                      React.createElement('div', { style: { fontSize: '32px', marginBottom: '16px' } }, feature.icon),
                      React.createElement('h3', { style: { fontSize: '20px', fontWeight: '600', marginBottom: '12px' } }, feature.title),
                      React.createElement('p', { style: { color: 'rgba(255, 255, 255, 0.7)', fontSize: '15px' } }, feature.desc)
                    ]
                  )
                )
              )
            ]
          )
        ]
      ),

      // Final CTA section
      React.createElement(
        'section',
        {
          key: 'final-cta',
          style: {
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: 'white',
            padding: '160px 0',
            textAlign: 'center',
            position: 'relative' as const
          }
        },
        [
          React.createElement('div', {
            key: 'bg-pattern',
            style: {
              position: 'absolute' as const,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
              transform: `translateY(${scrollProgress * -100}px)`
            }
          }),
          React.createElement(
            'div',
            {
              ref: setSectionRef('final-cta-content'),
              style: {
                maxWidth: '800px',
                margin: '0 auto',
                padding: '0 40px',
                position: 'relative' as const,
                zIndex: 1,
                transform: isVisible['final-cta-content'] ? 'translateY(0)' : 'translateY(40px)',
                opacity: isVisible['final-cta-content'] ? 1 : 0,
                transition: 'all 0.8s ease'
              }
            },
            [
              React.createElement(
                'h2',
                {
                  ref: setSectionRef('final-cta-title'),
                  style: {
                    fontSize: 'clamp(48px, 6vw, 72px)',
                    fontWeight: '700',
                    marginBottom: '32px',
                    letterSpacing: '-0.02em',
                    lineHeight: '1.1',
                    transform: isVisible['final-cta-title'] ? 'translateY(0)' : 'translateY(30px)',
                    opacity: isVisible['final-cta-title'] ? 1 : 0,
                    transition: 'all 0.8s ease 0.2s'
                  }
                },
                ['Your future starts', React.createElement('br', { key: 'br' }), 'with one click.']
              ),
              React.createElement(
                'p',
                {
                  ref: setSectionRef('final-cta-subtitle'),
                  style: {
                    fontSize: '22px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '48px',
                    lineHeight: '1.6',
                    transform: isVisible['final-cta-subtitle'] ? 'translateY(0)' : 'translateY(30px)',
                    opacity: isVisible['final-cta-subtitle'] ? 1 : 0,
                    transition: 'all 0.8s ease 0.4s'
                  }
                },
                'Join thousands of students who got into their dream schools with Proofr.'
              ),
              React.createElement(
                'div',
                {
                  ref: setSectionRef('final-cta-buttons'),
                  style: {
                    display: 'flex',
                    gap: '16px',
                    justifyContent: 'center',
                    flexWrap: 'wrap' as const,
                    transform: isVisible['final-cta-buttons'] ? 'translateY(0)' : 'translateY(30px)',
                    opacity: isVisible['final-cta-buttons'] ? 1 : 0,
                    transition: 'all 0.8s ease 0.6s'
                  }
                },
                [
                  React.createElement(
                    'button',
                    {
                      key: 'student',
                      style: {
                        background: '#0055FE',
                        color: 'white',
                        border: 'none',
                        padding: '20px 40px',
                        borderRadius: '24px',
                        fontSize: '18px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        boxShadow: '0 20px 40px rgba(0, 85, 254, 0.3)',
                        transition: 'all 0.2s ease'
                      },
                      onMouseEnter: (e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 24px 48px rgba(0, 85, 254, 0.4)'
                      },
                      onMouseLeave: (e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 85, 254, 0.3)'
                      }
                    },
                    'Find Your Consultant →'
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
                        borderRadius: '24px',
                        fontSize: '18px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      },
                      onMouseEnter: (e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                      },
                      onMouseLeave: (e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                        e.currentTarget.style.background = 'transparent'
                      }
                    },
                    'Start Earning Today'
                  )
                ]
              )
            ]
          )
        ]
      ),

      // Add CSS animation keyframes
      React.createElement('style', {
        key: 'styles',
        dangerouslySetInnerHTML: {
          __html: `
            @keyframes pulse {
              0%, 100% { opacity: 0.1; transform: scale(1); }
              50% { opacity: 0.2; transform: scale(1.1); }
            }
          `
        }
      })
    ]
  )
}
