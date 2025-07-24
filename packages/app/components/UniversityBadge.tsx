import React from 'react'
import { getUniversityColor, getContrastTextColor } from '../utils/colorUtils'

interface UniversityBadgeProps {
  university: string
  size?: 'xs' | 'sm' | 'md'
  className?: string
}

export function UniversityBadge({ university, size = 'xs', className = '' }: UniversityBadgeProps) {
  const bgColor = getUniversityColor(university)
  const textColorClass = getContrastTextColor(bgColor)
  
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-2.5 py-1.5 text-sm',
    md: 'px-3 py-2 text-base'
  }
  
  return (
    <span
      className={`${sizeClasses[size]} font-semibold rounded ${textColorClass} ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {university}
    </span>
  )
}