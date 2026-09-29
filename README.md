# partypulse

A Next.js 14 (App Router) app backed by MySQL, with email/password auth (custom JWT + bcrypt) and Google/Spotify OAuth via next-auth.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill in real values (DB credentials, `TOKEN_KEY`, `NEXTAUTH_SECRET`, OAuth client IDs/secrets, SMTP credentials, etc).
3. Point `D_HOST`/`D_NAME`/`D_USER`/`D_PASS` at a MySQL database with the app's schema already created (there is currently no migration tooling in this repo — the schema has to be created by hand from the queries in `src/app/api/_lib/models/*.ts`).
4. Run the dev server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start the Next.js dev server
- `npm run build` / `npm run start` — production build and start
- `npm run lint` — ESLint
- `npm test` / `npm run test:watch` — Jest

## Project layout

- `src/app/api/` — all backend route handlers (App Router `route.ts` files)
- `src/app/api/_lib/models/` — DB access layer (raw SQL via `mysql2`, no ORM)
- `src/app/api/_lib/token.ts` — the app's own JWT session token (separate from next-auth's session, used by every API route for auth)
- `src/app/dash/` — the authenticated dashboard area
- `src/app/components/` — shared UI components

## Learn more about Next.js

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
