# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server at http://localhost:8080
npm run build        # Production build
npm run build:dev    # Development build
npm run lint         # ESLint
npm run test         # Run tests once (Vitest)
npm run test:watch   # Run tests in watch mode
npm run preview      # Preview production build
```

## Architecture Overview

**Get-Matchly** is a two-sided marketplace matching brands/advertisers with Instagram creators. Built with React 18 + TypeScript + Vite.

### Routing & Role-Based Pages

`src/App.tsx` defines all routes via React Router v6. Pages are split by user role under `src/pages/`:
- `advertiser/` — campaign creation, proposal management, payments, reviews
- `creator/` — campaign browsing, proposal submission, content delivery, earnings
- `dashboard/` — shared dashboard views
- `onboarding/` — role-selection and profile setup flows

The active user role (advertiser vs. creator) is tracked in `src/context/UserContext.tsx` and drives which UI surfaces are shown.

### Authentication

Auth is currently **demo-only** via `src/hooks/useDemoAuth.tsx` using `localStorage`. Supabase auth types and client are configured in `src/lib/supabase.ts` but real auth is not wired up yet. The `.env.example` shows the required `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

### Data Layer

- **Mock data**: `src/data/creators.ts` and `src/data/mockApp.ts` power most UI currently.
- **Supabase**: Schema defined in `src/lib/schema.sql`; TypeScript types in `src/lib/supabase.ts`. DB seeding via `seed_creators.sql` at root.
- **Matching algorithm**: `src/lib/matching.ts` contains the core creator-campaign matching logic.
- **Server state**: TanStack React Query v5 is the pattern for any real API calls.

### UI & Styling

- **shadcn/ui** components live in `src/components/ui/` (~64 files). Add new ones with `npx shadcn-ui@latest add <component>`.
- Tailwind CSS with CSS variables for theming; dark mode via `class` strategy (`next-themes`).
- Framer Motion (`src/components/motion/`) for animations.
- Layout wrapper: `src/layouts/AppLayout.tsx` — contains sidebar, mobile nav, and responsive shell.
- Path alias `@/` maps to `src/`.

### Forms & Validation

React Hook Form + Zod throughout. Define a Zod schema, pass it to `useForm` via `zodResolver`, use shadcn `Form` components.

### Key Dependencies

| Purpose | Library |
|---|---|
| Routing | React Router DOM v6 |
| Server state | TanStack React Query v5 |
| Forms | React Hook Form + Zod |
| UI components | shadcn/ui (Radix UI) |
| Icons | Lucide React |
| Charts | Recharts |
| Animations | Framer Motion |
| Notifications | Sonner + Radix Toast |
| Date utils | date-fns |
| Backend | Supabase |

## Deployment

- **Vercel**: `vercel.json` rewrites all routes to `/index.html` (SPA).
- **Netlify**: `.netlify/` config present as alternative.
- This project was scaffolded via [Lovable](https://lovable.dev) (see `.lovable/`).
