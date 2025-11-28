# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start development server (port 8080)
npm run build        # Production build
npm run build:dev    # Development build
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite with SWC
- **Styling:** Tailwind CSS + shadcn/ui (Radix primitives)
- **State:** TanStack React Query for server state, Context API for cart
- **Backend:** Firebase (Auth, Firestore, Storage) + Supabase
- **Forms:** react-hook-form with zod validation
- **Animations:** framer-motion

## Architecture Overview

### Routing
React Router v6 with these main areas:
- `/` - Marketing site (home, shop, blog, about, contact)
- `/vault/*` - SaaS product (dashboard, equipment, sessions, videos, analytics)
- `/vault/admin/*` - Admin dashboard (user insights, revenue, moderation, system health)
- `/shop`, `/cart`, `/checkout` - E-commerce with Printful integration

### Key Directories

- `src/pages/` - Route components (54 pages)
- `src/components/ui/` - shadcn/ui components (do not modify directly, regenerate via CLI)
- `src/components/` - Feature components organized by domain (vault/, admin/, blog/)
- `src/services/` - Business logic layer (Firebase operations, analytics, moderation)
- `src/hooks/` - Custom hooks for auth, data fetching, subscriptions
- `src/types/` - TypeScript interfaces (admin.ts, vault.ts)
- `src/utils/` - Utilities including firebase.ts initialization
- `src/integrations/` - Third-party APIs (printful/, supabase/)

### Service Layer Pattern
Business logic is separated into service files that export pure functions. Firebase operations are abstracted in:
- `adminService.ts` - Admin operations and user management
- `analyticsService.ts` - DAU/WAU/MAU metrics
- `revenueService.ts` - MRR/ARR tracking
- `videoManagementService.ts` - Video CRUD operations

### Authentication
Firebase Auth with email/password and phone number methods. Admin routes use separate auth via `useAdminAuth` hook.

## Path Alias
`@/*` maps to `./src/*` - use `@/components/...` for imports.

## Environment Variables
Firebase config requires `VITE_FIREBASE_*` environment variables (API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID, MEASUREMENT_ID).

## Firestore Collections
Main collections: users, sessions, equipment, videos, reports, promoCodes, notificationHistory, errorLogs

## No Testing Framework
Tests are not currently configured. If adding tests, Vitest is recommended for Vite projects.
