# Modern Ivy Supreme Theme System Usage Guide

## Quick Start

### 1. Wrap your app with ThemeProvider

```tsx
// apps/expo/App.tsx or apps/next/_app.tsx
import { ThemeProvider } from '@proofr/app/contexts/ThemeContext'

export default function App() {
  return (
    <ThemeProvider>
      {/* Your app */}
    </ThemeProvider>
  )
}
```

### 2. Use theme colors in components

```tsx
// React Native
import { useTheme, useThemedColors } from '@proofr/app/contexts/ThemeContext'

export function MyComponent() {
  const { isDark } = useTheme()
  const colors = useThemedColors()
  
  return (
    <View style={{ backgroundColor: colors.background.default }}>
      <Text style={{ color: colors.text.primary }}>
        Hello, {isDark ? 'Dark' : 'Light'} Mode!
      </Text>
    </View>
  )
}

// Next.js
export function MyComponent() {
  return (
    <div className="bg-background dark:bg-background-dark">
      <h1 className="text-primary-700 dark:text-primary-500">
        Beautiful Theme System
      </h1>
    </div>
  )
}
```

### 3. Add theme switcher

```tsx
import { ThemeSwitcher } from '@proofr/app/components/ThemeSwitcher'

// In your settings or nav
<ThemeSwitcher />
```

## Color System

### Primary Colors (Emerald)
- Hero buttons, success states, primary actions
- Light mode: Use 700-900 for text, 500-600 for backgrounds
- Dark mode: Use 300-500 for text, 600-800 for backgrounds

### Accent Colors (Crimson)
- Critical actions only (delete, urgent)
- Use sparingly for maximum impact

### Purple (Expert/Premium)
- Premium features, expert badges
- Verified consultant indicators

### Teal (Fresh/New)
- New content, updates, fresh consultants

## Common Patterns

### Buttons

```tsx
// Primary Button (React Native)
<TouchableOpacity
  style={{
    backgroundColor: isDark ? colors.primary[500] : colors.primary[700],
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  }}
>
  <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>
    Book Session
  </Text>
</TouchableOpacity>

// Primary Button (Next.js)
<button className="
  bg-primary-700 dark:bg-primary-500
  hover:bg-primary-800 dark:hover:bg-primary-400
  text-white font-semibold
  px-6 py-3 rounded-xl
  transition-colors duration-200
">
  Book Session
</button>
```

### Cards

```tsx
// Card with glow on hover (Next.js)
<div className="
  bg-white dark:bg-surface-dark
  border border-gray-200 dark:border-gray-800
  rounded-xl p-6
  hover:shadow-glow-sm dark:hover:shadow-glow-md
  transition-all duration-200
">
  {/* Card content */}
</div>
```

### Status Indicators

```tsx
// Online status
<View style={{
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: colors.primary[500],
  // Pulse animation for online status
}} />

// University badge
<View style={{
  backgroundColor: colors.university.harvard,
  paddingHorizontal: 12,
  paddingVertical: 4,
  borderRadius: 16,
}}>
  <Text style={{ color: '#FFFFFF', fontSize: 12 }}>
    Harvard
  </Text>
</View>
```

## Animations

### Microinteractions (under 300ms)

```tsx
// React Native with Reanimated
const scale = useSharedValue(1)

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: scale.value }]
}))

const handlePress = () => {
  scale.value = withSpring(0.98, {}, () => {
    scale.value = withSpring(1)
  })
}

// Next.js with Tailwind
<button className="
  transform transition-all duration-200
  hover:scale-105 active:scale-95
">
```

### Page Transitions

```tsx
// Slide up animation
<div className="animate-slide-up">
  {/* Content */}
</div>

// Fade in with scale
<div className="animate-scale-in">
  {/* Content */}
</div>
```

## Dark Mode Best Practices

1. **Don't just invert colors** - Dark mode needs lighter/brighter versions
2. **Reduce contrast slightly** - Pure white on black is harsh
3. **Add glows instead of shadows** - Shadows don't work on black
4. **Test on OLED screens** - True black (#000000) saves battery

## Accessibility

- All color combinations meet WCAG AAA standards
- Use `high_contrast` mode for users who need it
- Respect `reduce_motion` preferences
- Test with color blind modes

## Performance Tips

1. Use CSS variables for instant theme switching
2. Lazy load theme preferences from Supabase
3. Cache theme locally for instant loads
4. Use the platform-specific ThemeContext (.web.tsx vs .tsx)

## Need Help?

- Colors defined in: `packages/app/constants/colors.ts`
- Theme context: `packages/app/contexts/ThemeContext.tsx`
- Tailwind config: `apps/next/tailwind.config.js`
- SQL schema: `supabase/migrations/20250109_theme_preferences.sql`