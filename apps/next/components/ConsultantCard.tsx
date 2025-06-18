"use client"

import { useState } from 'react'

interface Consultant {
  id: number
  name: string
  university: string
  universityType: string
  verified: boolean
  major: string
  rating: number
  reviews: number
  price: number
  image: string
  tags: string[]
  description: string
  available: boolean
  services: string[]
}

interface ConsultantCardProps {
  consultant: Consultant
  onClick?: () => void
}

export default function ConsultantCard({ consultant, onClick }: ConsultantCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 8,
        border: '1px solid #e4e7ec',
        boxShadow: isHovered 
          ? '0 8px 25px rgba(0, 0, 0, 0.12)' 
          : '0 2px 8px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        height: 360,
        display: 'flex',
        flexDirection: 'column'
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Favorite button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsFavorited(!isFavorited)
        }}
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          background: 'white',
          border: '1px solid #e4e7ec',
          borderRadius: '50%',
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 2,
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
        }}
      >
        <span style={{ 
          fontSize: 14, 
          color: isFavorited ? '#ef4444' : '#9ca3af',
          transition: 'color 0.2s ease'
        }}>
          {isFavorited ? '♥' : '♡'}
        </span>
      </button>

      {/* Profile image */}
      <div style={{ 
        padding: '20px 20px 0 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        <img
          src={consultant.image}
          alt={consultant.name}
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            objectFit: 'cover',
            background: '#f3f4f6',
            border: '2px solid #f9fafb',
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 6, 
            marginBottom: 2
          }}>
            <h3 style={{ 
              fontSize: 16, 
              fontWeight: 600, 
              color: '#111827',
              margin: 0,
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {consultant.name}
            </h3>
            {consultant.verified && (
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: '#1d9bf0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 9,
                  fontWeight: 700,
                  flexShrink: 0
                }}
              >
                ✓
              </div>
            )}
          </div>
          
          <p style={{ 
            color: '#6b7280', 
            fontSize: 13,
            fontWeight: 500,
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {consultant.university}
          </p>
        </div>
        
        {/* Online status */}
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: consultant.available ? '#10b981' : '#d1d5db',
            border: '2px solid white',
            boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.05)',
            flexShrink: 0
          }}
        />
      </div>

      {/* Service description */}
      <div style={{ 
        padding: '0 20px',
        marginTop: 12
      }}>
        <p style={{ 
          color: '#374151', 
          fontSize: 14,
          lineHeight: 1.4,
          margin: 0,
          fontWeight: 400,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          height: '2.8em'
        }}>
          {consultant.description}
        </p>
      </div>

      {/* Service tags */}
      <div style={{ 
        padding: '0 20px',
        marginTop: 12,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6
      }}>
        {consultant.services.slice(0, 2).map((service) => (
          <span 
            key={service}
            style={{
              background: '#f3f4f6',
              color: '#6b7280',
              fontSize: 11,
              fontWeight: 500,
              borderRadius: 4,
              padding: '4px 8px',
              textTransform: 'capitalize',
            }}
          >
            {service}
          </span>
        ))}
        {consultant.services.length > 2 && (
          <span style={{
            color: '#9ca3af',
            fontSize: 11,
            fontWeight: 500,
          }}>
            +{consultant.services.length - 2} more
          </span>
        )}
      </div>

      {/* Rating and reviews */}
      <div style={{ 
        padding: '0 20px',
        marginTop: 12,
        display: 'flex', 
        alignItems: 'center', 
        gap: 6
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <span style={{ color: '#fbbf24', fontSize: 14 }}>★</span>
          <span style={{ 
            fontWeight: 600, 
            color: '#111827', 
            fontSize: 14
          }}>
            {consultant.rating}
          </span>
        </div>
        <span style={{ 
          color: '#9ca3af', 
          fontSize: 13,
          fontWeight: 500
        }}>
          ({consultant.reviews} reviews)
        </span>
      </div>

      {/* Bottom section with price and CTA */}
      <div style={{ 
        padding: '16px 20px',
        borderTop: '1px solid #f3f4f6',
        marginTop: 'auto',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between'
      }}>
        <div>
          <span style={{ 
            color: '#111827', 
            fontWeight: 700, 
            fontSize: 18,
            lineHeight: 1
          }}>
            ${consultant.price}
            <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>/hr</span>
          </span>
        </div>
        
        <button
          style={{
            background: consultant.available ? '#1f2937' : '#d1d5db',
            color: consultant.available ? 'white' : '#9ca3af',
            border: 'none',
            borderRadius: 4,
            padding: '8px 16px',
            fontWeight: 600,
            fontSize: 13,
            cursor: consultant.available ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
          }}
          disabled={!consultant.available}
          onMouseEnter={(e) => {
            if (consultant.available) {
              e.currentTarget.style.background = '#111827'
            }
          }}
          onMouseLeave={(e) => {
            if (consultant.available) {
              e.currentTarget.style.background = '#1f2937'
            }
          }}
        >
          {consultant.available ? 'Contact' : 'Unavailable'}
        </button>
      </div>
    </div>
  )
}