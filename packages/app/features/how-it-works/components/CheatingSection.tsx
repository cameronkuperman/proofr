import React from 'react'

export function CheatingSection() {
  return React.createElement(
    'section',
    {
      key: 'cheating',
      'data-section': true,
      style: {
        background: '#18181b',
        color: 'white',
        padding: '120px 0',
        textAlign: 'center',
        position: 'relative' as const
      }
    },
    [
      React.createElement(
        'div',
        {
          key: 'content',
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
              key: 'h2',
              style: {
                fontSize: 'clamp(48px, 5vw, 64px)',
                fontWeight: '700',
                marginBottom: '32px',
                letterSpacing: '-0.02em'
              }
            },
            '"This feels like cheating."'
          ),
          React.createElement(
            'p',
            {
              key: 'p',
              style: {
                fontSize: '20px',
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: '1.6',
                marginBottom: '48px'
              }
            },
            'Get insider insights from students who\'ve successfully navigated the exact same process. They know what works because they\'ve done it.'
          ),
          React.createElement(
            'button',
            {
              key: 'cta',
              style: {
                background: '#ffffff',
                color: '#18181b',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }
            },
            'We agree →'
          )
        ]
      )
    ]
  )
}