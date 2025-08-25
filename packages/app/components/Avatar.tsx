import React from 'react'
import { getInitials, getAvatarStyle, getAvatarSizeClasses } from '../utils/avatarUtils'

interface AvatarProps {
  name?: string
  imageUrl?: string | null
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  rounded?: 'full' | 'lg' | 'md' | 'sm' | 'none'
  verified?: boolean
  online?: boolean
  className?: string
  onClick?: () => void
  useGradient?: boolean
}

export function Avatar({
  name = 'Unknown User',
  imageUrl,
  size = 'md',
  rounded = 'full',
  verified = false,
  online = false,
  className = '',
  onClick,
  useGradient = false,
}: AvatarProps) {
  const initials = getInitials(name)
  const avatarStyle = getAvatarStyle(name, useGradient)
  const sizeClasses = getAvatarSizeClasses(size)
  
  const roundedClasses = {
    full: 'rounded-full',
    lg: 'rounded-lg',
    md: 'rounded-md',
    sm: 'rounded-sm',
    none: 'rounded-none',
  }
  
  const containerClasses = `relative inline-block ${className}`
  const baseClasses = `${sizeClasses} ${roundedClasses[rounded]} flex items-center justify-center font-semibold select-none`
  const clickableClasses = onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
  
  return (
    <div className={containerClasses} onClick={onClick}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className={`${baseClasses} ${clickableClasses} object-cover`}
          onError={(e) => {
            // Fallback to initials if image fails to load
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            const fallback = target.nextElementSibling as HTMLElement
            if (fallback) fallback.style.display = 'flex'
          }}
        />
      ) : null}
      
      {/* Fallback initials avatar */}
      <div
        className={`${baseClasses} ${clickableClasses} ${avatarStyle.textColorClass} ${imageUrl ? 'hidden' : ''}`}
        style={{
          backgroundColor: avatarStyle.backgroundColor,
          background: avatarStyle.background,
        }}
      >
        {initials}
      </div>
      
      {/* Verified badge */}
      {verified && (
        <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5">
          <div className="bg-blue-500 rounded-full p-0.5">
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      )}
      
      {/* Online indicator */}
      {online && (
        <div className="absolute -bottom-0.5 -right-0.5">
          <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
        </div>
      )}
    </div>
  )
}

// Export a memoized version for performance
export const MemoizedAvatar = React.memo(Avatar)