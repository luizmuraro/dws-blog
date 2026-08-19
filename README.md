# DWS Blog

<p>
  <a href="README.md"><img src="https://flagcdn.com/64x48/us.png" width="32" height="24" alt="English" title="English"></a>
  &nbsp;
  <a href="README.pt-BR.md"><img src="https://flagcdn.com/64x48/br.png" width="32" height="24" alt="Português (Brasil)" title="Português (Brasil)"></a>
</p>

A blog front end built for the DWS technical test: a post listing with search, filtering and
sorting, a post detail page, and favorites that survive a reload.

**Live:** https://dws-blog-omega.vercel.app

**Storybook:** https://dws-blog-storybook.vercel.app

## Screens

### Mobile

| Listing                                                                                                                | Post detail                                                                                                 | Latest articles                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| <img src="docs/screenshots/home-mobile.jpg" alt="Mobile listing with the scope tabs and filter chips above the cards"> | <img src="docs/screenshots/detail-top-mobile.jpg" alt="Mobile post detail with the back button and byline"> | <img src="docs/screenshots/detail-bottom-mobile.jpg" alt="Mobile latest articles section stacked in one column"> |

### Desktop

| Listing                                                                                                      | Post detail                                                                                                     | Latest articles                                                                                                     |
| ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| <img src="docs/screenshots/home-desktop.jpg" alt="Post listing with the filter sidebar and a grid of cards"> | <img src="docs/screenshots/detail-top-desktop.jpg" alt="Top of a post, with the title, byline and cover image"> | <img src="docs/screenshots/detail-bottom-desktop.jpg" alt="End of a post, followed by the latest articles section"> |

## Stack

| Concern           | Choice                                           |
| ----------------- | ------------------------------------------------ |
| Framework         | React 19 + TypeScript, built with Vite           |
| Routing           | React Router 7 (`createBrowserRouter`)           |
| Global state      | Redux Toolkit + React Redux                      |
| Styling           | SCSS modules over a token layer, no UI framework |
| Testing           | Vitest + Testing Library (jsdom)                 |
| Component catalog | Storybook 10                                     |

## Getting started

Requires Node 20.19+ (or 22.12+) and npm.

```bash
npm install
cp .env.example .env
npm start
```

The app runs at http://localhost:5173.

### Environment

| Variable            | Default                                  | Purpose                    |
| ------------------- | ---------------------------------------- | -------------------------- |
| `VITE_API_BASE_URL` | `https://tech-test-backend.dwsbrazil.io` | Base URL for the posts API |

The default is baked into the API client, so the app also runs without a `.env`.

## Scripts

| Script                    | What it does                                         |
| ------------------------- | ---------------------------------------------------- |
| `npm run dev`             | Vite dev server with HMR                             |
| `npm run build`           | Type-checks the project, then builds to `dist/`      |
| `npm run preview`         | Serves the production build locally                  |
| `npm test`                | Runs the test suite once                             |
| `npm run test:watch`      | Reruns tests on change                               |
| `npm run test:coverage`   | Runs the suite with a coverage report and thresholds |
| `npm run storybook`       | Component catalog at http://localhost:6006           |
| `npm run build-storybook` | Static catalog in `storybook-static/`                |
| `npm run lint`            | ESLint over the whole project                        |
| `npm run format`          | Prettier write; `format:check` to verify only        |

## API

| Endpoint      | Used for                                                              |
| ------------- | --------------------------------------------------------------------- |
| `/posts`      | The listing, the search index and "Latest articles"                   |
| `/posts/{id}` | The detail page — a 404 resolves to `null`, every other status throws |
| `/categories` | The category chips the search panel offers before a query exists      |

Responses are mapped into domain shapes at the edge (`src/api/mappers.ts`), so no component reads an
API payload directly.

## Beyond the brief

The test asks for two views, some form of state management for user interactions, and offers unit
tests as a bonus. These were added on top of that scope:

**Favorites.** A star on every card and on the article, a favorites-only filter carrying its count,
and a "Favorites" tab on mobile. The list is written from the listing and from the detail route and
survives a reload through `localStorage`. This is the interaction the store exists for.

**A search that remembers.** Beyond matching, the panel opens before anything is typed with the last
five searches and the full category list, so an empty field still offers somewhere to go. Recent
terms persist across sessions, a repeated term moves back to the top instead of piling up, and the
matched fragments are highlighted in the results.

**Shareable state.** The search term and a category chip commit to the URL (`?q=`, `?category=`), so
a filtered listing can be linked and the back button behaves.

**Every state of the screen, not just the happy one.** Per-component loading skeletons, an error
state with retry, empty states worded for what emptied the list (no results, no favorites yet,
favorites filtered out), a "Post not found" kept separate from a failed request, a 404 route and a
router error boundary.

**Accessibility.** Landmarks and headings over generic containers, accessible names on every icon
button, `aria-busy` and a live region while results load, focus and keyboard handling on the
dropdowns and the search panel, and `prefers-reduced-motion` honoured by the skeletons. Tests assert
through roles and accessible names, and the `a11y` addon runs axe against every story.

**Tooling.** Storybook as a published catalog, a CI pipeline running lint, formatting, coverage
thresholds and both builds, and a preview deploy per pull request.

## Testing

458 tests across 58 files, covering the utilities, the API layer, the store, every hook, every
component and both pages.

| Metric     | Coverage |
| ---------- | -------- |
| Statements | 99.57%   |
| Branches   | 97.38%   |
| Functions  | 100%     |
| Lines      | 100%     |

`npm run test:coverage` enforces 95% statements, lines and functions, and 90% branches.

Tests sit next to the code they cover (`src/utils/date.ts` → `src/utils/date.test.ts`). Shared
helpers live in `src/test/`:

- `factories.ts` — builders for the domain and API shapes, with fixed dates so formatting and
  sorting assertions stay deterministic. Stories reuse these too.
- `renderWithProviders.tsx` — renders inside a fresh store and a memory router, and accepts
  `preloadedState`, `initialEntries` and a route `path` for components that read route params.
- `mockFetch.ts` — `fetch` stubs for the API layer. There is no mock server; nothing in the suite
  touches the network.

Assertions go through roles and accessible names rather than CSS module classes, which resolve to
`undefined` under Vitest.

## Storybook

The published catalog lives at https://dws-blog-storybook.vercel.app, redeployed from CI on every
push to `main`.

`npm run storybook` opens a catalog of 80 stories across 22 files. Global decorators supply a
per-story Redux store and a memory router, so store-connected components work without per-story
setup; `parameters.preloadedState` and `parameters.route` seed either one. The `a11y` addon runs axe
against every story.

The canvas defaults to the real page background (`--color-neutral-lightest`), with white and the
brand blue available from the toolbar.

## Project structure

```
src/
├── api/          Fetch client, endpoints and API→domain mappers
├── components/
│   ├── features/ Components owned by one feature (search, filters, article, latest)
│   ├── icons/    SVG components
│   ├── layout/   Root layout, header, background decoration
│   └── ui/       Building blocks shared across features (card, tags, states)
├── constants/    Closed option sets (sort order, variants)
├── hooks/        Data fetching, filtering, search and DOM measurement
├── pages/        Route components
├── store/        Redux slices, selectors and the store factory
├── styles/       Tokens, reset, typography, mixins
├── test/         Test-only helpers
├── types/        API and domain types
└── utils/        Pure functions
```

## Architecture decisions

**Filter options are derived from the posts, not from their own endpoints.** `/posts` already embeds
the author and the categories, so the category and author filters are extracted from the loaded
listing. That saves two requests and guarantees a filter never offers a value that would return
nothing. `/authors` is therefore never called, and its client was deleted rather than left as an
unused surface. `/categories` stays, because it fills the chips in the search panel: those are
needed before anything has been typed, and deferring a whole `/posts` fetch to fill six chips is
the more expensive trade.

**Search matches in memory.** The API has no query parameter, so the listing is fetched once on the
first query and every later keystroke is matched locally against the title, the author name and the
category names. The request is deferred until the reader actually types, so the header adds no call
to a page load. A 300 ms debounce sits between the typed term and the matched one — with the data
already in memory, what it saves is a re-filter per keystroke rather than a request. Accents are
folded when matching but not when highlighting, where folding would shift the segment offsets away
from the original text.

**The URL owns what is worth sharing.** The search term lives in `?q=` and a category chip commits
`?category=<name>`. Both are read by `usePostFilters` as seeds, not bindings: once the listing is
open the filter bar and sidebar own the selection, and nothing rewrites the URL behind the reader.

**Favorites are global, filters are not.** Favorites are written from the listing and from the
detail route, read from both plus the filter layer, and they outlive the page — that is what the
store is for. Recent searches are global for the same reason: written from the header, read back
across routes and sessions. Category, author and sort selections are consumed by one page and two of
its direct children, so they stay local in `usePostFilters`, where a slice would buy indirection and
nothing else.

**Persistence sits beside the reducer, not inside it.** Favorites and recent searches survive a
reload through `localStorage`: hydration goes through `preloadedState`, writes go through a listener
middleware. The reducers stay pure and storage access stays out of the render path. Reads and writes
are wrapped in `try/catch`, so private browsing or a full quota degrades to a session-only list
rather than breaking the listing.

**Complementary sections hide themselves.** "Latest articles" has no endpoint of its own, so it
reuses `/posts`, drops the post being read and takes the three most recent; a failed or empty
listing hides the section entirely rather than stacking an error on top of an article that loaded
fine. The category chips in the search panel behave the same way.

**The posts listing is fetched once per session.** Three consumers need the whole list — the posts
page, the header search and "Latest articles" — so `getPosts` memoises its promise in the API layer
instead of each caller fetching its own copy. The shared promise is created without an abort signal
on purpose: one consumer unmounting must not cancel the request the others are waiting on, and each
caller already drops its own result when its signal aborts. A rejection clears the cache so the
error state's retry still reaches the network. A data-fetching library would do this and more, but
for three endpoints the dependency does not pay for itself.

**`ui/` and `features/` split on ownership, not on coupling.** A component lives in `features/`
when it belongs to exactly one feature, and in `ui/` when more than one reaches for it. `PostCard`
is in `ui/` because both the listing and "Latest articles" render it; `FilterBar` and
`PostScopeTabs` take nothing but primitives and still sit in `features/`, because they exist only
for the posts page. Splitting on store access instead would scatter one-off UI into `ui/` and drag
a single button up next to whole features.

## Known limitations

- **Sorting has no visible effect against the real API.** Every post comes back with an identical
  `createdAt`, so newest and oldest produce the same order. The control was built because it is a
  requirement, with no invented secondary ordering as a fallback. `sortPosts` is tested against
  synthetic dates.
