/**
 * Avatar utility functions for generating consistent default avatars
 */

// Generate initials from a full name
export function getInitials(name: string): string {
  if (!name) return '??'
  
  const words = name.trim().split(/\s+/)
  
  if (words.length === 1) {
    // Single word - take first two letters
    return words[0].substring(0, 2).toUpperCase()
  }
  
  // Multiple words - take first letter of first and last word
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

// Generate a consistent color based on a string (name or id)
export function getAvatarColor(seed: string): string {
  if (!seed) return '#6B7280' // Default gray
  
  // Modern, vibrant color palette
  const colors = [
    '#EF4444', // red-500
    '#F97316', // orange-500
    '#F59E0B', // amber-500
    '#EAB308', // yellow-500
    '#84CC16', // lime-500
    '#22C55E', // green-500
    '#10B981', // emerald-500
    '#14B8A6', // teal-500
    '#06B6D4', // cyan-500
    '#0EA5E9', // sky-500
    '#3B82F6', // blue-500
    '#6366F1', // indigo-500
    '#8B5CF6', // violet-500
    '#A855F7', // purple-500
    '#D946EF', // fuchsia-500
    '#EC4899', // pink-500
    '#F43F5E', // rose-500
  ]
  
  // Generate a hash from the seed string
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  // Use the hash to select a color
  const index = Math.abs(hash) % colors.length
  return colors[index]
}

// Get gradient background for avatar
export function getAvatarGradient(seed: string): string {
  const baseColor = getAvatarColor(seed)
  const gradients = [
    `linear-gradient(135deg, ${baseColor}DD 0%, ${baseColor}AA 100%)`,
    `linear-gradient(45deg, ${baseColor}DD 0%, ${baseColor}99 100%)`,
    `radial-gradient(circle, ${baseColor}DD 0%, ${baseColor}AA 100%)`,
  ]
  
  // Use seed to pick a gradient style
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 3) - hash)
  }
  
  const index = Math.abs(hash) % gradients.length
  return gradients[index]
}

// Determine if text should be white or dark based on background color
export function getContrastTextColor(hexColor: string): 'text-white' | 'text-gray-900' {
  // Convert hex to RGB
  const hex = hexColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  
  // Return white text for dark backgrounds, dark text for light backgrounds
  return luminance > 0.5 ? 'text-gray-900' : 'text-white'
}

// Generate avatar style object
export function getAvatarStyle(name: string, useGradient: boolean = false) {
  const color = getAvatarColor(name)
  const textColor = getContrastTextColor(color)
  
  return {
    backgroundColor: useGradient ? undefined : color,
    background: useGradient ? getAvatarGradient(name) : undefined,
    color: textColor === 'text-white' ? '#FFFFFF' : '#111827',
    textColorClass: textColor,
  }
}

// Generate size classes for different avatar sizes
export function getAvatarSizeClasses(size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'md') {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
  }
  
  return sizes[size] || sizes.md
}