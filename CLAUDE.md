# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

- `npm run dev` - Start Vite dev server (requires backend at port 3333 or uses proxy)
- `npm run build` - TypeScript compilation + Vite production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Architecture

**Stack:** React 18 + Vite + TypeScript + Tailwind CSS 4 + React Query + React Router 7

**Shared Types:** The `@scottglz/trivia2025-shared` package provides types shared with the backend.

### Key Files

- `src/main.tsx` - Entry point, sets up React Query client and SSE connection for real-time updates
- `src/appview.tsx` - Root router with routes: `/` (main), `/scores/*` (scores), `*` (404)
- `src/mainstreamview.tsx` - Main dashboard showing questions, grades, leaderboard
- `src/ajax.ts` - Axios instance with auth interceptors and DAO class for all API calls
- `src/datahooks.ts` - React Query hooks for data fetching and mutations

### Data Flow

1. **API Layer** (`ajax.ts`): DAO class wraps all `/api/*` endpoints
2. **Data Hooks** (`datahooks.ts`): React Query hooks consume DAO methods
3. **SSE Updates**: Real-time question updates via `/api/sse` invalidate query cache

### Key Hooks

- `useWhoAmI()` - Current authenticated user
- `useQuestionsPlus()` - Questions with processed guesses
- `useGuessMutation()` - Submit answers
- `useGradeMutation()` - Admin grading

## Development Notes

- Vite proxies `/api` requests to `https://trivia.thatpagethere.com` by default
- Dark theme uses green-950 background; light-area class for content sections
- Custom Tailwind utilities: `w-stream` (800px), `dark-area`, `light-area`
- Deploys automatically to Railway on GitHub push
