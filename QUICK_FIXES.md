# Quick Fixes for Common Issues

## 1. Fix Theme/Color Imports in Guide Components

If you get errors about `useThemedColors` in guide components, update the imports:

```typescript
// In all guide component files, change:
import { useThemedColors } from '../../hooks/useThemedColors'

// To:
import { useThemedColors } from '../../../contexts/ThemeContext'
```

## 2. Fix Supabase Import Paths

In all guide components, make sure the supabase import matches your project:

```typescript
// Change from:
import { supabase } from '../../../../../lib/supabase'

// To your actual path (check other working components):
import { supabase } from 'lib/supabase'
```

## 3. Add Missing Color Constants

If `colors` import is missing in guide components:

```typescript
// Add this import:
import { colors } from '../../../constants/colors'
```

## 4. Fix Navigation Type Errors

If TypeScript complains about navigation routes:

```typescript
// In app/navigation/native/index.tsx, the types are already added
// But if you have a separate types file, add:

export type RootStackParamList = {
  // ... existing routes
  MyGuides: undefined;
  CreateGuide: undefined;
};
```

## 5. Test the Guide System

1. **Check if tables exist:**
```sql
SELECT COUNT(*) FROM student_guides;
```

2. **Get a student ID for testing:**
```sql
SELECT id, name FROM students LIMIT 5;
```

3. **Update test data with real student ID:**
Replace 'YOUR_STUDENT_ID' in TEST_GUIDE_DATA.sql with an actual ID from step 2

4. **Run the test data SQL**

## 6. Missing useNavigation Hook

If components can't find navigation:

```typescript
// Make sure you're in a navigation context
// The component must be rendered within NavigationContainer

// Safe navigation usage:
const navigation = useNavigation<any>()

// Or with try-catch:
let navigation: any;
try {
  navigation = useNavigation();
} catch (e) {
  console.log('Navigation not available');
}
```