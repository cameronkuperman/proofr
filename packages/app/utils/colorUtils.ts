// Utility functions for color handling

export const isLightColor = (color: string): boolean => {
  // Remove # if present
  const hex = color.replace('#', '')
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  // Calculate brightness using standard formula
  const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000
  
  // Return true if light (threshold at 155)
  return brightness > 155
}

export const getContrastTextColor = (backgroundColor: string): string => {
  return isLightColor(backgroundColor) ? 'text-gray-900' : 'text-white'
}

export const getUniversityColor = (college: string): string => {
  const colors: Record<string, string> = {
    'Stanford University': '#8C1515',
    'Harvard University': '#A51C30',
    'MIT': '#A31F34',
    'Yale University': '#00356B',
    'Princeton University': '#FF6600',
    'Columbia University': '#003DA5',
    'Cornell University': '#B31B1B',
    'Brown University': '#4E3629',
    'University of Pennsylvania': '#990000',
    'Northwestern University': '#4E2A84',
    'Dartmouth College': '#00693E',
    'Duke University': '#00356B',
    'Vanderbilt University': '#866D4B',
    'Rice University': '#002D72',
    'Emory University': '#012169'
  }
  return colors[college] || '#6B7280'
}