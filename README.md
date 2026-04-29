# TVDash

A small TV dashboard built with Vue 3 + TypeScript, powered by the [TVMaze API](https://www.tvmaze.com/api).

---

## What it does

- Browse TV shows grouped by genre in horizontal, scrollable rows
- Shows sorted by rating within each genre
- Show detail page with full metadata
- Search shows by name — 300 ms debounce, AbortController cancels stale requests, results cached per query
- Search query synced to the URL (`/?search=breaking bad`) — shareable and browser-history aware
- Favorites — heart button on every card, persisted to `localStorage`, "My Favorites" row at the top of the dashboard
- Skeleton loading states on dashboard and detail page
- Error states with a "Try again" retry button
- Empty state when search returns no results
- Mobile-first responsive layout
- Accessible — keyboard navigation on cards, `aria-label` on all interactive elements, `role="alert"` on errors, focus rings

---

## Getting started

### Requirements

| Tool | Version used |
| ---- | ------------ |
| Node.js | v24.15.0 |
| npm | 11.12.1 |
| pnpm | 10.30.3 |

> pnpm is used as the package manager. Install it with `npm i -g pnpm` if needed.

### Install

```bash
pnpm install
```

### Run development server

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

### Run tests

```bash
pnpm test          # watch mode
pnpm test run      # single run
pnpm test:coverage # coverage report
```

### Build for production

```bash
pnpm build
pnpm preview
```

---

## Architecture

### Framework — Vue 3 + Composition API

Vue 3 with the Composition API was chosen as required by ABN AMRO. The Composition API was preferred over the Options API because it enables logic reuse through composables, keeps related code co-located, and gives full TypeScript inference without decorators.

### Tooling

| Tool | Role |
| ---- | ---- |
| Vite | Dev server and bundler — fast HMR, native ESM |
| TypeScript | Full type safety across API layer, composables, and components |
| Vue Router 4 | Client-side navigation (hash-free history mode) |
| Vitest | Unit testing — shares the Vite config, no extra setup |
| @vue/test-utils | Component mounting in tests |
| jsdom | Browser-like environment for Vitest |

Scaffolding was kept minimal: the project was initialised with `npm create vite` and all dependencies were chosen deliberately. No UI component libraries, no CSS frameworks, no Pinia.

### State management — no Pinia

I kept state intentionally simple:

All reactive state lives in composables using `ref` and `computed`. Two composables use module-level refs for shared state:

- **`useShows`** — the fetched show list is cached in a module-level ref so the API is called once per session regardless of how many components call the composable.
- **`useFavorites`** — the favorites array is a module-level ref backed by `localStorage`, so all components share the same reactive source.

Everything else is local to the calling component.

### Project structure

```text
src/
  api/
    tvmaze.ts            # Typed fetch wrappers (fetchAllShows, fetchShow, searchShows)
  composables/
    useShows.ts          # Fetches & caches all shows; useShow for the detail page
    useGenres.ts         # Groups shows by genre, sorts by rating descending
    useSearch.ts         # Debounced search with AbortController and per-query cache
    useFavorites.ts      # localStorage-backed favorites with shared reactive state
  components/
    ShowCard.vue         # Poster card — image, rating badge, heart button, initials fallback
    HorizontalList.vue   # Horizontally scrollable row of ShowCards
    GenreSection.vue     # Genre heading + HorizontalList
    SearchBar.vue        # Controlled search input (v-model) with clear button
    Skeleton.vue         # Animated loading placeholder (rectangular, circle, text variants)
    ErrorState.vue       # Error UI with message, optional detail, and retry button
    icons/               # SVG icon components (Star, Heart, Search, Cross, ArrowLeft, …)
  views/
    DashboardView.vue    # Genre rows or search results; favorites section; URL-synced query
    ShowDetailView.vue   # Full show detail — two-column layout, collapses on mobile
  router/
    index.ts             # Two routes: / and /show/:id
  types/
    index.ts             # Show, GenreGroup, and related interfaces
  __tests__/
    api/                 # tvmaze.ts — fetch mocking, URL encoding, AbortSignal
    composables/         # useGenres, useSearch, useShows (cache), useFavorites
    components/          # ShowCard, SearchBar, ErrorState, GenreSection
    fixtures.ts          # makeShow() factory shared across all tests
```

### Genre grouping

The TVMaze `/shows` endpoint returns a flat list. `useGenres` groups shows into a `Map<string, Show[]>` in a single pass, sorts each group by `rating.average` descending (null treated as 0), then sorts the genre keys alphabetically. Three pages (~750 shows) are fetched in parallel; a failed page is silently dropped so a single network hiccup doesn't break the whole dashboard.

### Search

`useSearch` watches a `query` ref passed in by the parent. Requests are fired after a 300 ms debounce. Each new request aborts the previous one via `AbortController` so stale responses never overwrite fresh results. Successful responses are cached in a `Map<string, Show[]>` so repeated queries skip the network. The query is synced to `/?search=…` via `router.replace`, making searches shareable and back/forward navigable.

### Favorites

`useFavorites` stores an array of show IDs in `localStorage`. A module-level `ref` makes the state reactive and shared across all component instances. The toggle function reads and writes in a `try/catch` to handle storage quota or private-mode restrictions gracefully.

### Routing

Vue Router 4 in `createWebHistory` mode. `scrollBehavior` resets the page to the top on every navigation. The detail route uses a dynamic `:id` segment parsed to a number before being passed to `useShow`.

### Styling

Plain scoped CSS — no preprocessor, no utility framework. `style.css` defines a complete design-token layer of CSS custom properties:

- **Colours** — `--color-bg`, `--color-surface`, `--color-text`, `--color-accent`, `--color-heart`, `--color-rating`, overlays, and more
- **Font sizes** — `--font-size-xs` through `--font-size-3xl` (8 steps)
- **Spacing** — `--space-1` through `--space-10` (4 px base unit)
- **Border radius** — `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-pill`

All scoped styles reference these tokens — no hardcoded hex values in components. The palette is a dark cinema theme. Cards scale on hover and reveal the heart button. Horizontal rows use native scroll with thin custom scrollbars. The detail page is a two-column poster-and-info grid that collapses to a single column below 640 px.

### Testing

62 tests across 10 files. Key patterns used:

- `vi.mock` / `vi.mocked` for API modules
- `vi.doMock` + `vi.resetModules()` + dynamic imports to isolate module-level state between tests
- `vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })` with `flushPromises` for debounce tests
- `@vue/test-utils` `mount` with a `createMemoryHistory` router for component tests
- `localStorage.clear()` + `vi.resetModules()` in `beforeEach` for `useFavorites` isolation

### Notes / trade-offs

- No global state library — didn’t feel necessary for this scope
- No UI framework — everything is custom but lightweight
- Some UI edge cases (like poster overlays covering text) are accepted as trade-offs for consistency — similar to how streaming apps handle it
  