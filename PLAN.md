# Stremur Refactoring Plan

## Overview
Converting Stremur from a server-side rendered Next.js app to a fully client-side static app that deploys to Cloudflare Pages with Convex as the backend for user data.

## Current Problem
- App uses server-side rendering with API routes and SQLite
- Cloudflare Pages only supports static hosting
- Build creates .next/ but needs out/ for static export
- Dynamic routes prevent static export

## Solution
1. Replace SQLite + API routes with Convex (serverless database)
2. Convert all pages to client-side rendering
3. Add multi-user profile system with optional PIN protection
4. Enable static export for Cloudflare Pages

---

## Convex Credentials
- Deployment URL: https://laudable-jackal-942.convex.cloud
- HTTP Actions URL: https://laudable-jackal-942.convex.site
- Deploy Key: stored in Cloudflare env vars

---

## User System Design

### Features
- Multi-user profiles (like Netflix)
- Optional PIN protection per profile
- Admin user can create/delete profiles
- Each user has their own watchlist and watch history
- First-time visitors see setup screen to create admin profile

### User Flow
First Visit -> Setup Screen (create admin) -> Home
Return Visit -> Profile Select -> PIN (if set) -> Home

---

## Database Schema (Convex)

### users
- name: string (Display name)
- pin: string? (Optional 4-digit PIN)
- isAdmin: boolean (Can manage other users)
- color: string (Avatar color hex)
- createdAt: number (Timestamp)

### watchHistory
- userId: Id<users> (Owner)
- mediaId: number (TMDB ID)
- mediaType: movie | tv
- title: string
- posterPath: string?
- progress: number (Seconds watched)
- duration: number (Total duration)
- season: number? (For TV)
- episode: number? (For TV)
- updatedAt: number

### watchlist
- userId: Id<users> (Owner)
- mediaId: number (TMDB ID)
- mediaType: movie | tv
- title: string
- posterPath: string?
- addedAt: number

---

## Implementation Phases

### Phase 1: Convex Backend Setup
- [ ] 1.1 Install Convex (bun add convex)
- [ ] 1.2 Create convex/schema.ts
- [ ] 1.3 Create convex/users.ts
- [ ] 1.4 Create convex/watchlist.ts
- [ ] 1.5 Create convex/watchHistory.ts
- [ ] 1.6 Deploy schema to Convex

### Phase 2: User/Profile UI
- [ ] 2.1 Create src/contexts/UserContext.tsx
- [ ] 2.2 Create src/app/setup/page.tsx
- [ ] 2.3 Create src/app/profiles/page.tsx
- [ ] 2.4 Create src/components/auth/ProfileCard.tsx
- [ ] 2.5 Create src/components/auth/PinModal.tsx
- [ ] 2.6 Create src/app/admin/page.tsx

### Phase 3: Client-Side Infrastructure
- [ ] 3.1 Create src/lib/tmdb-client.ts
- [ ] 3.2 Update .env.local
- [ ] 3.3 Update src/app/layout.tsx (add providers)

### Phase 4: Convert Pages to Client-Side
- [ ] 4.1 Convert src/app/page.tsx (home)
- [ ] 4.2 Convert src/app/movie/[id]/page.tsx
- [ ] 4.3 Convert src/app/tv/[id]/page.tsx
- [ ] 4.4 Convert src/app/search/page.tsx
- [ ] 4.5 Convert movie player pages
- [ ] 4.6 Convert TV player pages

### Phase 5: Update Components for Multi-User
- [ ] 5.1 Update WatchlistButton.tsx
- [ ] 5.2 Update ContinueWatchingRow.tsx
- [ ] 5.3 Update watchlist/page.tsx
- [ ] 5.4 Update Header.tsx (add profile switcher)

### Phase 6: Cleanup
- [ ] 6.1 Delete src/app/api/ directory
- [ ] 6.2 Delete src/lib/db.ts
- [ ] 6.3 Delete src/app/test/page.tsx
- [ ] 6.4 Update package.json (remove better-sqlite3)
- [ ] 6.5 Run bun install

### Phase 7: Build and Verify
- [ ] 7.1 Run bun run build
- [ ] 7.2 Verify out/ directory created
- [ ] 7.3 Test locally
- [ ] 7.4 Git commit and push

---

## Environment Variables

### .env.local
NEXT_PUBLIC_CONVEX_URL=https://laudable-jackal-942.convex.cloud
NEXT_PUBLIC_TMDB_API_KEY=d7abe2eab0efe162ebe78893d460e1e9

### Cloudflare Pages
Same as above

---

## Files to Create
1. convex/schema.ts
2. convex/users.ts
3. convex/watchlist.ts
4. convex/watchHistory.ts
5. src/lib/tmdb-client.ts
6. src/contexts/UserContext.tsx
7. src/app/setup/page.tsx
8. src/app/profiles/page.tsx
9. src/app/admin/page.tsx
10. src/components/auth/ProfileCard.tsx
11. src/components/auth/PinModal.tsx

## Files to Modify
1. src/app/layout.tsx
2. src/app/page.tsx
3. src/app/movie/[id]/page.tsx
4. src/app/tv/[id]/page.tsx
5. src/app/search/page.tsx
6. src/app/watch/movie/[id]/page.tsx
7. src/app/watch/movie/[id]/MoviePlayer.tsx
8. src/app/watch/tv/[id]/[season]/[episode]/page.tsx
9. src/app/watch/tv/[id]/[season]/[episode]/TVPlayer.tsx
10. src/components/media/WatchlistButton.tsx
11. src/components/media/ContinueWatchingRow.tsx
12. src/app/watchlist/page.tsx
13. src/components/layout/Header.tsx
14. package.json
15. .env.local

## Files to Delete
1. src/app/api/ (entire directory)
2. src/lib/db.ts
3. src/app/test/page.tsx

---

## Cloudflare Pages Config
- Build command: bun run build
- Build output directory: out
- Root directory: /

---

## Progress Tracking
Last updated: 2026-01-17
Current phase: Starting Phase 1
Status: Not started
