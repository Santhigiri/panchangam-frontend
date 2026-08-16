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

Routes live in `src/routes/` and are auto-generated into `src/routeTree.gen.ts` by the TanStack Router Vite plugin — **never edit `routeTree.gen.ts` manually**. Route files are thin: each just imports its page component from the matching feature and renders it. Current routes:

- `/` → `features/day-details` (`DayDetailsPage`, daily panchangam view)
- `/calendar` → `features/calendar` (monthly calendar view)
- `/starfinder` → `features/starfinder` (panchangam at an arbitrary instant/location)
- `/data` → `features/data-admin` (admin data table + generation UI)
- `/settings` → `features/settings`

The root layout (`src/routes/__root.tsx`) wraps everything with `QueryClientProvider`, `AuthProvider` (`features/auth`), `MobileSidebarProvider`, and `Sidebar`. The `shellComponent` (`RootDocument`) handles the HTML shell and PWA `RefreshPrompt`.

### Feature-based architecture

Code is organized by feature under `src/features/<name>/`, each with its own `api/`, `schemas/`, `hooks/`, and `components/` subfolders (only the ones a feature needs). A feature owns everything only it uses; anything genuinely shared across 3+ features lives in `src/features/panchangam/` (the core domain) or in the top-level `src/lib/` / `src/components/` (see below). Features may import from other features' modules (e.g. `data-admin` importing `panchangam`'s reference hooks) — that's expected; just don't reach past a feature's public files into internals that look accidental.

- **`features/panchangam/`** — the core shared domain. Owns `PanchangamDayData`/`CompactPanchangamData` schemas, the month/year fetch API, `enrichPanchangamDay`, reference-data hooks (nakshatra/thithi/masa/santhigiri-events lists), and the `DateHeader` card. Consumed by `calendar`, `day-details`, `starfinder`, and `data-admin`.
- **`features/day-details/`** — the `/` route: `DayDetailsPage` plus its day-view cards (SunriseSunsetCard, ThithiTransitionCard, NakshatraTransitionCard, UpcomingEventsCard, GuruvaniCard), `useHomePanchangam`, and the sunrise/sunset + IP-geolocation API (only consumer of that domain).
- **`features/calendar/`** — the `/calendar` monthly grid: `calendar.tsx`, `CalendarGridSkeleton`, `useCalendarPanchangam`.
- **`features/starfinder/`** — the `/starfinder` route: panchangam-at-an-instant API, `useStarfinder`, result panel components.
- **`features/guruvani/`** — "word of the day" API/cache/schema/hooks, used by both `day-details` (`GuruvaniCard`) and `data-admin` (CRUD tab).
- **`features/santhigiri-events/`** — ashram event CRUD API/schema/hooks, used by `data-admin`'s event tab and composed into `panchangam`'s reference list.
- **`features/data-admin/`** — the `/data` route: admin table page, per-entity tabs, columns, and CRUD dialogs.
- **`features/settings/`** — the `/settings` route and its app-settings API/hooks.
- **`features/auth/`** — `useAuth`/`AuthProvider`, `LoginDialog`, login API. `LoginDialog` is rendered by the shared `Sidebar`.

### Shared, non-feature code

- **`src/lib/`** — generic, feature-agnostic infra: `constants.ts`, `utils.ts`, `date.ts` (`dateToKey`), `query-client.ts`, and `lib/http/` (`conditionalFetch` — the ETag-aware fetch wrapper, `etagCache` — IndexedDB-backed cache, `httpErrors` — shared `UnauthorizedError`/`ForbiddenError`).
- **`src/components/ui/`** — shadcn/ui primitives, unowned by any feature.
- **`src/components/shared/`** — cross-feature layout chrome: `Sidebar`, `TopAppBar`, `RefreshPrompt`, `ThemeToggle`.
- **`src/hooks/useMobileSidebar.tsx`** — app-shell state shared by `Sidebar`/`TopAppBar`/root layout; not feature-owned.

### Key Types (from `src/features/panchangam/schemas/panchangamData.ts`)

- `PanchangamDayData` — one day's full panchangam record
- `ThithiTransition` / `NakshatraTransition` — time-bounded transitions within a day
- `KollavarshamDate` — Malayalam calendar date
- `SanthigiriSignificance` — ashram significant event name + description

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
