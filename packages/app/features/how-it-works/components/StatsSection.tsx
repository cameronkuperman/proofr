import React from 'react'

export function StatsSection() {
  const stats = [
    { value: '15,000+', label: 'Active Gigs', sublabel: 'From 2,000+ consultants', color: '#3b82f6' },
    { value: '$15-500', label: 'Price Range', sublabel: 'You set your budget', color: '#10b981' },
    { value: '< 2hr', label: 'Avg Response', sublabel: 'Get help fast', color: '#f59e0b' },
    { value: '4.8/5', label: 'Avg Rating', sublabel: 'Quality guaranteed', color: '#8b5cf6' }
  ]

  return React.createElement(
    'section',
    {
      key: 'stats',
      style: {
        background: 'linear-gradient(180deg, #18181b 0%, #27272a 100%)',
        padding: '80px 0',
        position: 'relative' as const,
        overflow: 'hidden'
      }
    },
    [
      // Gradient glow effect
      React.createElement('div', {
        key: 'glow',
        style: {
          position: 'absolute' as const,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, transparent 60%)',
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
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '48px',
            textAlign: 'center',
            position: 'relative' as const,
            zIndex: 1
          }
        },
        stats.map((stat, i) =>
          React.createElement(
            'div',
            { key: i },
            [
              React.createElement(
                'div',
                {
                  key: 'value',
                  style: {
                    fontSize: '42px',
                    fontWeight: '700',
                    color: stat.color || '#ffffff',
                    marginBottom: '8px',
                    letterSpacing: '-0.02em',
                    textShadow: `0 0 30px ${stat.color}40`
                  }
                },
                stat.value
              ),
              React.createElement(
                'div',
                {
                  key: 'label',
                  style: {
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#ffffff',
                    marginBottom: '4px'
                  }
                },
                stat.label
              ),
              React.createElement(
                'div',
                {
                  key: 'sublabel',
                  style: {
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.6)'
                  }
                },
                stat.sublabel
              )
            ]
          )
        )
      )
    ]
  )
}