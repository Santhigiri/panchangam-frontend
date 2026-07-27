# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Progressive Web App (PWA) frontend for the **Panchangam API** — a Malayalam Hindu almanac (panchangam) service. It displays daily and monthly panchangam data including thithi (lunar day), nakshatra (star), sunrise/sunset, and Santhigiri Ashram significant dates.

The backend API (`panchangam-api`) is available locally at `http://localhost:8000` (configured via `VITE_APP_BASE_URL` in `.env`) and on GitHub at `https://github.com/santhigiri/panchangam-api`.

## Commands

```bash
npm run dev        # Start dev server on port 3000
npm run build      # Production build
npm run typecheck  # TypeScript check (no emit)
npm run lint       # ESLint
npm run format     # Prettier (writes in place)
npm run test       # Vitest (run once)
```

## Architecture

### Stack

- **React 19** with **TanStack Router** (file-based routing, SSR-capable via `shellComponent`)
- **TanStack Query** for API data fetching and caching
- **Tailwind CSS v4** + **shadcn/ui** (style: `radix-vega`, base color: `neutral`)
- **Zod** for API response validation
- **Vite** with PWA plugin (service worker via Workbox)

### Routing

Routes live in `src/routes/` and are auto-generated into `src/routeTree.gen.ts` by the TanStack Router Vite plugin — **never edit `routeTree.gen.ts` manually**. Current routes:

- `/` → `DayDetailsPage` (daily panchangam view)
- `/calendar` → monthly calendar view

The root layout (`src/routes/__root.tsx`) wraps everything with `QueryClientProvider` and `Sidebar`. The `shellComponent` (`RootDocument`) handles the HTML shell and PWA `RefreshPrompt`.

### Data Flow

```
API (panchangam-api)
  └─ src/api/panchangam.ts          # fetch + Zod parse
       └─ src/api/schemas/panchangamData.ts  # Zod schemas & TypeScript types
  └─ src/hooks/usePanchangam.ts     # TanStack Query wrapper (caches per month, prefetches ±1 month)
       └─ src/hooks/useDayDetails.ts        # activeDate state + day lookup from monthly cache
```

`usePanchangam` fetches monthly data keyed by `["panchangam", year, month]`. All day lookups are derived from that cached monthly response — there is no per-day API endpoint.

### Key Types (from `src/api/schemas/panchangamData.ts`)

- `PanchangamDayData` — one day's full panchangam record
- `ThithiTransition` / `NakshatraTransition` — time-bounded transitions within a day
- `KollavarshamDate` — Malayalam calendar date
- `SanthigiriSignificance` — ashram significant event name + description

### UI Components

- `src/components/ui/` — shadcn/ui primitives (Button, Card, Calendar, Popover, etc.)
- `src/components/shared/` — layout chrome: `Sidebar` (desktop fixed left / mobile bottom nav), `TopAppBar` (mobile-only header), `RefreshPrompt` (PWA update banner)
- `src/components/pages/calendar/` — calendar view cards (DateHeader, SunriseSunsetCard, ThithiTransitionCard, NakshatraTransitionCard, AshramSignificanceCard)
- `src/components/pages/day-details/` — `DayDetailsPage` composes the calendar cards into the daily view

### shadcn/ui Setup

shadcn is configured in `components.json` with aliases `@/components/ui`, `@/lib/utils`, `@/hooks`. To add new components:

```bash
npx shadcn@latest add <component>
```

The goal is to migrate all custom UI to shadcn primitives. Prefer shadcn components over `react-datepicker`, `react-calendar`, or hand-rolled UI.

### Styling

- Tailwind v4 (no `tailwind.config.js` — configured via CSS in `src/styles.css`)
- Background color `#F5F5DC` (beige/linen) used throughout
- Amber (`amber-700`, `amber-800`) as the primary accent for nav active states
- CSS variables for shadcn theming defined in `src/styles.css`

### Date Handling

- Calendar data is available from `2021-01-01` to `2030-12-31` (see `src/lib/constants.ts`)
- Default coordinates are Thiruvananthapuram, Kerala (lat: 8.6318, lon: 76.897)
- `date-fns` is used for date arithmetic; `dayjs` is also available but `date-fns` is preferred
