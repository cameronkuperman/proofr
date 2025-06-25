import React from 'react'

export interface Gig {
  id: number
  consultant: string
  school: string
  title: string
  price: number
  rating: number
  reviews: number
  responseTime: string
  tags: string[]
  avatar: string
}

interface GigCardProps {
  gig: Gig
  index: number
  hoveredGig: number | null
  setHoveredGig: (id: number | null) => void
}

export function GigCard({ gig, index, hoveredGig, setHoveredGig }: GigCardProps) {
  return React.createElement(
    'div',
    {
      key: gig.id,
      onMouseEnter: () => setHoveredGig(gig.id),
      onMouseLeave: () => setHoveredGig(null),
      style: {
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '20px',
        cursor: 'pointer',
        transform: hoveredGig === gig.id ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hoveredGig === gig.id 
          ? '0 20px 40px rgba(0, 0, 0, 0.1)' 
          : '0 1px 3px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s ease'
      }
    },
    [
      // Header
      React.createElement(
        'div',
        {
          key: 'header',
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }
        },
        [
          React.createElement(
            'div',
            {
              key: 'avatar',
              style: {
                width: '40px',
                height: '40px',
                background: `linear-gradient(135deg, ${
                  index === 0 ? '#3b82f6' : index === 1 ? '#10b981' : '#f59e0b'
                } 0%, ${
                  index === 0 ? '#2563eb' : index === 1 ? '#059669' : '#d97706'
                } 100%)`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600'
              }
            },
            gig.avatar
          ),
          React.createElement(
            'div',
            { key: 'info', style: { flex: 1 } },
            [
              React.createElement(
                'div',
                {
                  key: 'name',
                  style: {
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#111827'
                  }
                },
                gig.consultant
              ),
              React.createElement(
                'div',
                {
                  key: 'school',
                  style: {
                    fontSize: '12px',
                    color: '#6b7280'
                  }
                },
                gig.school
              )
            ]
          )
        ]
      ),
      
      // Title
      React.createElement(
        'h3',
        {
          key: 'title',
          style: {
            fontSize: '15px',
            fontWeight: '500',
            color: '#111827',
            marginBottom: '12px',
            lineHeight: '1.4'
          }
        },
        gig.title
      ),
      
      // Tags
      React.createElement(
        'div',
        {
          key: 'tags',
          style: {
            display: 'flex',
            gap: '8px',
            marginBottom: '16px'
          }
        },
        gig.tags.map((tag, i) =>
          React.createElement(
            'span',
            {
              key: i,
              style: {
                background: '#f3f4f6',
                color: '#4b5563',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '500'
              }
            },
            tag
          )
        )
      ),
      
      // Footer
      React.createElement(
        'div',
        {
          key: 'footer',
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '12px',
            borderTop: '1px solid #f3f4f6'
          }
        },
        [
          React.createElement(
            'div',
            {
              key: 'rating',
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '13px',
                color: '#6b7280'
              }
            },
            [
              React.createElement('span', { key: 'star' }, '⭐'),
              React.createElement('span', { key: 'score', style: { fontWeight: '600' } }, gig.rating),
              React.createElement('span', { key: 'reviews' }, `(${gig.reviews})`)
            ]
          ),
          React.createElement(
            'div',
            {
              key: 'price',
              style: {
                fontSize: '18px',
                fontWeight: '700',
                color: '#111827'
              }
            },
            `$${gig.price}`
          )
        ]
      )
    ]
  )
}