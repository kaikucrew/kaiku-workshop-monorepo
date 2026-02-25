# Implementation Plan — GitHub Issues

## Issue #1: Allow users to add new suppliers

**Goal:** Add `POST /api/suppliers` endpoint + UI form for creating suppliers.

1. **API — Add `create` method to `SupplierRepository`**
   - File: `api/src/repositories/SupplierRepository.ts`
   - Add `create(data): Supplier` that generates an ID via `uuidv4()`, sets `createdAt`, stores in the map, and returns the supplier

2. **API — Add `CreateSupplierSchema` and `CreateSupplierDTO` to types**
   - File: `api/src/types.ts`
   - Zod schema: `name` (string, 1–200), `email` (string, email), `phone` (optional string)

3. **API — Add `createSupplier` to `SupplierService`**
   - File: `api/src/services/SupplierService.ts`
   - Calls `supplierRepository.create(data)`, returns the created supplier

4. **API — Add `POST /api/suppliers` route**
   - File: `api/src/routes/suppliers.ts`
   - Uses `validateRequest(CreateSupplierSchema)` middleware, returns `201` with created supplier

5. **UI — Add `create` method to `SupplierService`**
   - File: `ui/src/services/SupplierService.ts`
   - Calls `apiPost<Supplier>('/api/suppliers', data)`

6. **UI — Add `useCreateSupplier` hook**
   - File: `ui/src/hooks/useCreateSupplier.ts`
   - Follow `useCreateOffer` pattern; invalidate `queryKeys.suppliers` on success
   - Export from `ui/src/hooks/index.ts`

7. **UI — Add `SupplierForm` component**
   - File: `ui/src/components/SupplierForm.tsx` (+ CSS)
   - Follow `OfferForm.tsx` pattern with fields: name, email, phone (optional)
   - Export from `ui/src/components/index.ts`

8. **UI — Add "Create Supplier" button and form toggle to `OffersManagementView`**
   - File: `ui/src/views/OffersManagementView.tsx`
   - Add a "Create Supplier" button near the supplier list/filter area
   - Toggle a `SupplierForm` modal, refresh supplier list on success

---

## Issue #2: Add shared key for Frontend/Backend authentication

**Goal:** Simple API key auth via `API_AUTH_KEY` env var on backend, `VITE_AUTH_KEY` on frontend.

1. **API — Create auth middleware**
   - File: `api/src/middleware/auth.ts`
   - Read `API_AUTH_KEY` from `process.env`; compare against `x-api-key` header
   - Return `401` if missing/mismatched; call `next()` if valid
   - Export from `api/src/middleware/index.ts`

2. **API — Apply auth middleware to all `/api/*` routes**
   - File: `api/src/server.ts`
   - Add `app.use('/api', authMiddleware)` before route registration

3. **UI — Include auth key in all API requests**
   - File: `ui/src/services/httpClient.ts`
   - Read `import.meta.env.VITE_AUTH_KEY` and add it as `x-api-key` header in `apiGet`, `apiPost`, `apiPut`, `apiDelete`

4. **Environment configuration & documentation**
   - Add `.env.example` files in both `api/` and `ui/` with the key placeholders
   - Update `README.md` with auth key configuration instructions

---

## Issue #3: Add Docker Support with Docker Compose

**Goal:** Dockerize both services, orchestrate with docker-compose. No hot-reloading needed.

1. **Create `api/Dockerfile`**
   - Multi-stage build: install deps → build TypeScript → run with `node` on a slim image
   - Expose port 3001

2. **Create `ui/Dockerfile`**
   - Multi-stage build: install deps → `vite build` → serve with `nginx`
   - Expose port 3000

3. **Create `docker-compose.yml` at repo root**
   - Two services: `api` and `ui`
   - Pass environment variables (`API_AUTH_KEY`, `VITE_AUTH_KEY`, `VITE_API_URL`, `PORT`)
   - UI depends on API
   - Map ports 3000 and 3001

4. **Add `.dockerignore` files** in `api/` and `ui/` (exclude `node_modules`, `dist`, etc.)

5. **Document Docker usage in `README.md`**
   - `docker compose up --build` to start
   - Environment variable configuration

---

## Recommended execution order

1. **Issue #1** (Suppliers) — pure feature addition, no cross-cutting concerns
2. **Issue #2** (Auth) — touches httpClient and server middleware; easier after #1 so the new supplier endpoint is also covered
3. **Issue #3** (Docker) — best done last since it wraps the final state of both services, including auth env vars
