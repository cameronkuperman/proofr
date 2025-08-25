import React from 'react'
import { Avatar } from './Avatar'

interface AvatarGroupProps {
  users: Array<{
    name: string
    imageUrl?: string | null
    verified?: boolean
  }>
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

export function AvatarGroup({
  users,
  max = 3,
  size = 'md',
  className = ''
}: AvatarGroupProps) {
  const displayUsers = users.slice(0, max)
  const remainingCount = Math.max(0, users.length - max)
  
  const overlapClasses = {
    xs: '-ml-2',
    sm: '-ml-2.5',
    md: '-ml-3',
    lg: '-ml-4',
  }
  
  return (
    <div className={`flex items-center ${className}`}>
      {displayUsers.map((user, index) => (
        <div
          key={index}
          className={`${index > 0 ? overlapClasses[size] : ''} ring-2 ring-white rounded-full`}
          style={{ zIndex: displayUsers.length - index }}
        >
          <Avatar
            name={user.name}
            imageUrl={user.imageUrl}
            size={size}
            verified={user.verified}
            rounded="full"
          />
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div
          className={`${overlapClasses[size]} ring-2 ring-white rounded-full bg-gray-200 text-gray-600 font-medium flex items-center justify-center`}
          style={{ 
            zIndex: 0,
            width: size === 'xs' ? '1.5rem' : size === 'sm' ? '2rem' : size === 'md' ? '2.5rem' : '3rem',
            height: size === 'xs' ? '1.5rem' : size === 'sm' ? '2rem' : size === 'md' ? '2.5rem' : '3rem',
            fontSize: size === 'xs' ? '0.625rem' : size === 'sm' ? '0.75rem' : size === 'md' ? '0.875rem' : '1rem',
          }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  )
}