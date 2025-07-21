# Navigation Fixes Needed

## 1. Update Navigation Types

The navigation system needs to know about the new screens. Add these to your navigation types:

```typescript
// In your navigation types file (might be in app/navigation/types.ts or similar)
export type RootStackParamList = {
  // ... existing routes
  MyGuides: undefined
  CreateGuide: undefined
}
```

## 2. Fix Import Paths

If you get import errors, update these paths in the components:

### In GuideEditor.tsx, GuideViewer.tsx, GuideBrowser.tsx, CommentSection.tsx:
```typescript
// Change this:
import { supabase } from '../../../../../lib/supabase'

// To match your actual path, might be:
import { supabase } from 'lib/supabase'
// or
import { supabase } from '@/lib/supabase'
```

### In MyGuidesScreen.tsx:
```typescript
// Update the supabase import path to match your project structure
```

## 3. Fix Profile Navigation

In ProfileScreen.native.tsx, the navigation to MyGuides needs the proper type:

```typescript
// Add type assertion if needed
navigation.navigate('MyGuides' as any)
// or update your navigation types to include MyGuides
```

## 4. Create Missing Hooks (if needed)

If `useThemedColors` doesn't exist in your guides components, you can either:

Option A: Import from existing location
```typescript
import { useThemedColors } from 'app/hooks/useThemedColors'
```

Option B: Create a simple version
```typescript
const colors = {
  primary: '#059669',
  background: '#FFFFFF',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
  },
  border: '#E5E7EB',
  surface: '#F9FAFB'
}
```