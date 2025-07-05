# Proofr Development Guide

## What is Proofr?
Proofr is a marketplace connecting students with college consultants from elite universities. Think "Fiverr for College Admissions" where consultants offer services like:
- Essay reviews and editing
- Interview preparation
- SAT/ACT tutoring
- Application strategy
- School selection guidance
- an important note is it is like fiverr consultants do not pick the students students browse choose adn select consultants for their services

**Business Model**: Consultants set their own prices (can even offer free services). Proofr takes a 20% commission on paid transactions.

## Core Development Principles

### 1. Monorepo Structure
- Built with Solito (React Native + Next.js code sharing)
- Turborepo + Yarn workspaces
- Shared code in `packages/app/`
- Platform-specific code in `apps/next/` or `apps/expo/`
- Use `.web.tsx` and `.native.tsx` for platform splits

### 2. Always Ask First
- Clarify vague requirements before implementing
- Present multiple approaches for complex features
- Get approval before major changes
- Use TodoWrite to plan multi-step tasks

### 3. Error Prevention
- Check for existing implementations before creating new files
- Prefer editing existing files over creating new ones
- Run `yarn typecheck` and `yarn lint` after changes
- Test on both platforms before considering done
- Handle all errors gracefully

### 4. No Assumptions
- Don't assume libraries are available - check package.json first
- Don't assume file locations - verify paths
- Don't assume features exist - search the codebase
- Don't create files unless absolutely necessary

## Things to Avoid (CRITICAL)

### Never Do These:
- **No hardcoded API keys** - use environment variables
- **No console.logs with user data** in production code
- **No files over 500 lines** - break into smaller components
- **No 'any' types** - use proper TypeScript
- **No class components** - functional only
- **No creating files without checking if similar exists**
- **No committing without user asking**
- **No assumptions about test commands** - ask user
- bad or incorrect file imports ie to many .. remember the directories actively keep in mind the file structure be thoughtful and mindful of this

### Common Pitfalls:
- React Native Reanimated conflicts
- Platform-specific imports in shared code
- Forgetting to clean up subscriptions
- Not handling Supabase errors
- Creating duplicate functionality
- Over-engineering simple features
- ERROR:  42P01: missing FROM-clause entry for table "old" AVOID THIS!!




## Code Organization

### Feature Structure:
```
packages/app/features/[feature-name]/
├── components/       # UI components
├── screens/         # Full screens
├── hooks/           # Custom hooks
├── types/           # TypeScript types
└── utils/           # Helper functions
```

### File Naming:
- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Types: `feature.types.ts`
- Utils: `feature.utils.ts`
- Platform-specific: `Component.web.tsx` or `Component.native.tsx`

## Styling Guidelines

### Web (Tailwind CSS):
```tsx
<div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md">
```

### Native (Dripsy + inline styles):
```tsx
<View sx={{ flex: 1, padding: 24 }}>
```

### Shared Colors:
Use the color constants from `packages/app/constants/colors.ts`

## Supabase Patterns

### Always Use Try-Catch:
```typescript
try {
  const { data, error } = await supabase
    .from('table')
    .select()
  
  if (error) throw new Error('Failed to load data')
  return data
} catch (error) {
  // Handle error appropriately
  throw error
}
```

### Clean Up Subscriptions:
```typescript
useEffect(() => {
  const subscription = supabase
    .channel('channel-name')
    .on('event', callback)
    .subscribe()
  
  return () => subscription.unsubscribe()
}, [])
```

## Quick Reference

### Essential Commands:
```bash
yarn dev          # Start both platforms
yarn web          # Web only
yarn native       # Mobile only
yarn typecheck    # Check types
yarn lint         # Run linter
yarn build        # Build all
```

### Project Structure:
```
proofr/
├── apps/
│   ├── expo/     # Mobile app
│   └── next/     # Web app
├── packages/
│   └── app/      # Shared code
├── lib/          # Utilities
└── supabase/     # Database
```

### Key Features Already Built:
- Authentication (sign up/in)
- Onboarding flows
- Consultant dashboard
- Browse/discovery interface
- Basic messaging architecture
- Verification system

## Development Workflow

1. **Before Starting Any Task:**
   - Use TodoWrite to plan steps
   - Search for existing implementations
   - Check if similar components exist

2. **While Coding:**
   - Keep files under 500 lines
   - Extract reusable logic to hooks
   - Handle all error cases
   - Add proper TypeScript types

3. **Before Finishing:**
   - Run typecheck and lint
   - Test on both platforms
   - Clean up any console.logs
   - Ask if user wants to commit

## Remember

- **Proofr is a premium marketplace** - every interaction should feel polished
- **Consultants control their business** - they set prices, availability, services
- **Two-sided marketplace** - consider both student and consultant perspectives
- **Mobile-first** - but must work beautifully on web too
- **Real-time features** - leverage Supabase subscriptions

When in doubt:
1. Check existing code patterns
2. Ask for clarification
3. Keep it simple
4. Focus on user experience