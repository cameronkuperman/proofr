# Proofr Onboarding Flow 🚀

## The Perfect UX Flow

### Flow Overview

```
App Launch
    ↓
Auth Check (AsyncStorage)
    ↓
┌─────────────────────────────────┐
│ Not Authenticated?              │
│   → Welcome Screen              │
│      → Get Started → Onboarding │
│      → Login → Login Screen     │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ From Sign Up?                   │
│   → Skip Welcome                │
│   → Start at Splash Animation   │
└─────────────────────────────────┘
```

### Screen Flow

1. **Welcome Screen** (if not from sign-up)
   - Beautiful gradient with floating animations
   - "Get Started" → Onboarding
   - "I already have an account" → Login

2. **Splash Animation** (3 seconds)
   - Graduation cap transforms to acceptance letter
   - Sets the aspirational tone

3. **Role Selection**
   - Student vs Consultant split
   - Real photography for trust
   - Shows earnings/success stats

4. **Student Path:**
   - Dream Schools → Year → Pain Points → Success Story → Account Creation

5. **Consultant Path:** (TODO)
   - Verify Email → Success Story → Services → Earnings Preview → Account Creation

### How to Test

1. **Fresh Install Experience:**
   ```bash
   # Clear app data first
   yarn expo start --clear
   ```

2. **Sign-Up Flow:**
   - From login screen, tap "Sign Up"
   - This triggers onboarding with `skipWelcome: true`

3. **Direct Onboarding:**
   - Launch app without auth token
   - See Welcome → Get Started flow

### Key Features Implemented

✅ **Phantom-style Animations**
- Floating gradient shapes
- Spring physics on cards
- Smooth transitions with Moti

✅ **Airbnb-style UI**
- Real photography
- Warm, human design
- Trust badges and social proof

✅ **Fiverr-style Value Display**
- Show consultants before sign-up
- Transparent pricing
- Success stories upfront

✅ **Smart Navigation**
- Auth state persistence
- Skip welcome from sign-up
- Smooth screen transitions

### Navigation Logic

The app checks auth state on launch:
- No token → Show onboarding
- Token but no onboarding complete → Continue onboarding
- Token + onboarding complete → Home screen

### Customization

To modify the flow:
1. Edit screens in `/screens/` folder
2. Update navigation in `OnboardingNavigator.native.tsx`
3. Adjust animations in individual screen files

### Design Tokens

- Primary: `#0055FE` (Trust Blue)
- Secondary: `#FFB800` (Success Gold)
- Gradient: Oxford Blue → Harvard Crimson → Gold
- Dark backgrounds for premium feel