# Issue #1 Changes: Allow users to add new suppliers

## Summary
Added full-stack support for creating new suppliers — a `POST /api/suppliers` endpoint on the backend and a "Create Supplier" form on the frontend.

---

## API Changes

### `api/src/types.ts`
- Added `CreateSupplierSchema` (Zod): validates `name` (string, 1–200), `email` (valid email), `phone` (optional string)
- Added `CreateSupplierDTO` type inferred from the schema

### `api/src/repositories/SupplierRepository.ts`
- Added `create(data)` method: generates UUID, sets `createdAt`, stores in the in-memory map, returns the new supplier

### `api/src/services/SupplierService.ts`
- Added `createSupplier(data: CreateSupplierDTO)` method that delegates to `supplierRepository.create(data)`
- Updated import to include `CreateSupplierDTO`

### `api/src/routes/suppliers.ts`
- Added `POST /suppliers` route with `validateRequest(CreateSupplierSchema)` middleware
- Returns `201` with the created supplier JSON
- Imported `CreateSupplierSchema` and `validateRequest`

---

## UI Changes

### `ui/src/types/index.ts`
- Added `CreateSupplierData` interface: `name` (string), `email` (string), `phone` (optional string)

### `ui/src/services/SupplierService.ts`
- Added `create(data: CreateSupplierData)` method using `apiPost<Supplier>('/api/suppliers', data)`
- Added `apiPost` import

### `ui/src/hooks/useCreateSupplier.ts` *(new file)*
- TanStack Query mutation hook following `useCreateOffer` pattern
- Invalidates `queryKeys.suppliers` on success

### `ui/src/hooks/index.ts`
- Added `useCreateSupplier` export

### `ui/src/components/SupplierForm.tsx` *(new file)*
- Form component using `react-hook-form` with fields: name (required), email (required, validated), phone (optional)
- Reuses `OfferForm.css` class names for consistent styling
- Props: `onSubmit`, `onCancel`, `loading`

### `ui/src/components/SupplierForm.css` *(new file)*
- Minimal file — reuses existing OfferForm styles

### `ui/src/components/index.ts`
- Added `SupplierForm` export

### `ui/src/views/OffersManagementView.tsx`
- Added `'create-supplier'` to `ViewMode` type
- Added `useCreateSupplier` hook and `createSupplierMutation`
- Added `handleCreateSupplier` handler with success notification and error handling
- Added "+ Create Supplier" button in the header next to "+ Create Offer"
- Added `SupplierForm` modal rendering when in `create-supplier` mode
