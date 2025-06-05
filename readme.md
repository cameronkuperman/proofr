# Proofr - Fiverr for College Admissions 🎓

A platform connecting students with elite college consultants for personalized admissions guidance.

## 🎯 About Proofr

Proofr is a revolutionary platform that democratizes access to top-tier college admissions consulting. Students can connect with current students and recent graduates from prestigious universities like Harvard, Stanford, MIT, and more to receive personalized essay reviews, application guidance, and admissions insights.

### Key Features
- **Essay Reviews**: Get your personal statements and supplemental essays reviewed by students who got accepted
- **Application Consulting**: One-on-one guidance through the entire application process
- **Interview Prep**: Mock interviews with students from your target schools
- **Profile Building**: Strategic advice on extracurriculars, coursework, and standardization testing

## 📦 Included packages

- `solito` for cross-platform navigation
- `moti` for animations
- Expo SDK 53
- Next.js 15
- React Navigation 7
- React 19
- React Compiler

## 🗂 Folder layout

- `apps` entry points for each app
  - `expo` - React Native mobile app
  - `next` - Next.js web app

- `packages` shared packages across apps
  - `app` shared components and features
    - `features` organized by feature (authentication, messaging, payments, etc.)
    - `provider` app providers and web no-ops
    - `navigation` navigation-related code

## 🏁 Start the app

- Install dependencies: `yarn`
- Next.js local dev: `yarn web`
- Expo local dev: 
  - Build dev client: `cd apps/expo && expo run:ios`
  - Start metro: `yarn native`

## 🆕 Add new dependencies

### Pure JS dependencies
Install in `packages/app`:
```sh
cd packages/app
yarn add date-fns
cd ../..
yarn
```

### Native dependencies
Install in `apps/expo`:
```sh
cd apps/expo
yarn add react-native-reanimated
cd ../..
yarn
```

## 🚀 Tech Stack

- **Frontend**: React Native (mobile) + Next.js (web)
- **Styling**: Moti animations + Solito navigation
- **State Management**: React Context + hooks
- **Backend**: Next.js API routes
- **Database**: TBD (PostgreSQL recommended)
- **Authentication**: TBD (Clerk/Auth0 recommended)
- **Payments**: Stripe integration

## 🎯 Target Users

- **Students**: High school juniors/seniors applying to competitive colleges
- **Consultants**: Current students and recent graduates from top universities
- **Parents**: Seeking expert guidance for their children's applications

---

*Connecting ambitious students with the insights they need to succeed.*