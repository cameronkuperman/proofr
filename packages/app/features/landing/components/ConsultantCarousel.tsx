import * as React from 'react'
import { HomeConsultantCard } from './HomeConsultantCard'

interface Consultant {
  initials: string
  name: string
  university: string
  year: string
  specialty: string
  bio: string
  price: string
  avatar: string
  verified: boolean
  responseTime: string
  badge: string
  rating: number
  reviews: number
}

interface ConsultantCarouselProps {
  consultants: Consultant[]
}

export function ConsultantCarousel({ consultants }: ConsultantCarouselProps) {
  const [currentPosition, setCurrentPosition] = React.useState(0)
  
  // Calculate positioning - 8 total cards, show 4 (2x2) + partial previews
  // Positions: 0 (cards 0-3 visible), 1 (cards 2-5 visible), 2 (cards 4-7 visible)
  const maxPosition = Math.max(0, Math.floor(consultants.length / 2) - 2) // Should be 2 for 8 cards
  
  const handlePrevious = () => {
    setCurrentPosition(prev => Math.max(0, prev - 1))
  }
  
  const handleNext = () => {
    setCurrentPosition(prev => Math.min(maxPosition, prev + 1))
  }
  
  // Calculate which cards should be blurred based on position
  const getCardBlurState = (cardIndex: number) => {
    const visibleStart = currentPosition * 2
    const visibleEnd = visibleStart + 3 // Show 4 cards (indices 0-3 relative to start)
    
    // Cards outside the main 4 visible cards should be blurred (for edge preview effect)
    return cardIndex < visibleStart || cardIndex > visibleEnd
  }
  
  // Calculate transform based on position (move 2 cards = 316px per card * 2 = 632px per click)
  const translateX = -currentPosition * 316
  
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      overflow: 'hidden',
      height: '700px'
    }}>
      <div 
        id="cardSlider"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 300px)', // 4 columns for 8 cards total
          gridTemplateRows: 'repeat(2, 320px)', // 2 rows
          gap: '16px',
          width: 'calc(1200px + 100px)', // Width for all cards + overflow
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `translateX(${translateX}px)`,
          touchAction: 'pan-x'
        }}
      >
        {consultants.map((consultant, index) => (
          <HomeConsultantCard
            key={consultant.name}
            consultant={consultant}
            index={index}
            isBlurred={getCardBlurState(index)}
            onCardClick={() => console.log('Card clicked:', consultant.name)}
          />
        ))}
      </div>
      
      {/* Left Navigation Arrow - Only show if not at start */}
      {currentPosition > 0 && (
        <button 
          style={{
            position: 'absolute',
            left: '-10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '44px',
            height: '44px',
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F9FAFB'
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white'
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.08)'
          }}
          onClick={handlePrevious}
        >
          <span style={{
            fontSize: '18px',
            color: '#6B7280',
            fontWeight: '700'
          }}>←</span>
        </button>
      )}

      {/* Right Navigation Arrow - Only show if not at end */}
      {currentPosition < maxPosition && (
        <button 
          style={{
            position: 'absolute',
            right: '-10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '44px',
            height: '44px',
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F9FAFB'
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white'
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.08)'
          }}
          onClick={handleNext}
        >
          <span style={{
            fontSize: '18px',
            color: '#6B7280',
            fontWeight: '700'
          }}>→</span>
        </button>
      )}
      
      {/* Position Indicator Dots */}
      <div style={{
        position: 'absolute',
        bottom: '-40px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        alignItems: 'center'
      }}>
        {Array.from({ length: maxPosition + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPosition(index)}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              border: 'none',
              background: currentPosition === index ? '#3B82F6' : '#E5E7EB',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          />
        ))}
      </div>
    </div>
  )
}