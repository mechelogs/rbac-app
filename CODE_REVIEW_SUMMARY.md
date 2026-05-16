# Code Review Summary

## Overview
This review covers the full repository, with a focus on backend RBAC flow, TypeScript configuration, and frontend authentication/API patterns.

## Key Findings

### Backend

1. **TypeScript configuration issue**
   - `backend/tsconfig.json` had `rootDir` set to `./src` but included files outside that directory (e.g. `backend/prisma/seed.ts`).
   - Result: `File '.../backend/prisma/seed.ts' is not under 'rootDir' './src'`.

2. **Unsafe JWT handling**
   - `backend/src/middleware/auth.middleware.ts` used `process.env.JWT_SECRET!` with a non-null assertion.
   - `req.user` was typed as `any`, then assigned from `jwt.verify()` without payload validation.

3. **Authorization safety gap**
   - `backend/src/middleware/role.middleware.ts` accessed `req.user.permissions` without verifying that `req.user` exists or that permissions are an array.

4. **Content route validation issues**
   - `backend/src/routes/content.routes.ts` accepted `req.body` directly in `prisma.content.create()` and `prisma.content.update()`.
   - Update/delete operations did not verify that the authenticated user owned the content item.

5. **Hard-coded backend config**
   - `backend/src/app.ts` hardcoded CORS origin to `http://localhost:5173`.

### Frontend

1. **Hard-coded API base URL**
   - `frontend/src/services/api.ts` used `http://127.0.0.1:8000/api` directly.

2. **Auth state persistence gap**
   - `frontend/src/store/auth.store.ts` saved the token to `localStorage`, but did not initialize state from it.

3. **Login UX improvement**
   - `frontend/src/pages/LoginPage.tsx` used `alert()` for invalid credentials instead of inline error display.

4. **React hook structure**
   - `frontend/src/pages/ContentPage.tsx` defined `fetchContent()` outside the effect and disabled an ESLint rule.

## Fixes Applied

### Backend

- `backend/tsconfig.json`
  - Added `include: ["src"]`
  - Added `exclude: ["node_modules", "dist", "prisma"]`

- `backend/src/middleware/auth.middleware.ts`
  - Added typed `UserJwtPayload` interface.
  - Added runtime check for `JWT_SECRET`.
  - Added payload shape validation for decoded JWT values.
  - Removed unsafe `any` type on `req.user`.

- `backend/src/middleware/role.middleware.ts`
  - Verified `req.user?.permissions` is an array before authorization logic.

- `backend/src/routes/content.routes.ts`
  - Added request body validation for `title` and `body` on create.
  - Added validation for update content id and payload shape.
  - Added ownership checks on update and delete operations.
  - Added 400/403/404 responses for invalid or missing resource conditions.

### Frontend

- `frontend/src/services/api.ts`
  - Switched base URL to `import.meta.env.VITE_API_URL` with fallback to `http://127.0.0.1:8000/api`.

- `frontend/src/store/auth.store.ts`
  - Initialized `token` from `localStorage`.
  - Added `clearToken()` helper.

- `frontend/src/pages/LoginPage.tsx`
  - Replaced `alert()` with inline error messaging.

- `frontend/src/pages/ContentPage.tsx`
  - Moved `fetchContent()` inside `useEffect`.
  - Used `clearToken()` on logout instead of manual `localStorage.removeItem()`.

## Validation

- `npx tsc --noEmit` run successfully in both `frontend` and `backend` directories.
- No diagnostics reported by VS Code after the fixes.

## Notes

- The repo also contains a `.claude/skills/code-review-excellence` folder, but this report is specific to the actual app files and their issues.
- Further improvements could include env-driven CORS configuration and stronger request validation via a schema library like `zod` or `Joi`.
