# UI Components Demo

This document describes how to run and test the newly implemented UI components.

## Components Implemented

### 1. Notification Component
- **Location**: `src/components/Notification.tsx`
- **Features**:
  - Success, error, and info notification types
  - Auto-dismiss functionality (configurable duration)
  - Manual close button
  - Smooth animations
  - Responsive design
  - Accessible (ARIA attributes)

### 2. ConfirmDialog Component
- **Location**: `src/components/ConfirmDialog.tsx`
- **Features**:
  - Modal dialog with backdrop
  - Confirm and cancel buttons
  - Loading state with spinner
  - Backdrop click to close
  - Escape key to close
  - Focus management
  - Responsive design
  - Accessible (ARIA attributes)

## Running the Demo

1. **Start the development server**:
   ```bash
   cd ui
   npm run dev
   ```

2. **Open your browser** to `http://localhost:3000`

3. **Test the components**:
   - Click the notification buttons to see different notification types
   - Click "Show Custom Duration" to see a notification that stays for 10 seconds
   - Click "Open Confirm Dialog" to test the confirmation dialog
   - Try clicking the backdrop or pressing Escape to close the dialog
   - Click "Confirm" to see the loading state

## Running Tests

```bash
cd ui
npm test
```

All tests should pass, including the existing useNotification hook tests.

## Type Checking

```bash
cd ui
npm run type-check
```

Should complete without errors.

## Architecture

The demo integrates with the existing application structure:

```
App.tsx
├── QueryClientProvider (TanStack React Query)
└── NotificationProvider (Notification Context)
    └── ComponentsDemo
        ├── NotificationContainer (displays notifications)
        └── ConfirmDialog (modal dialog)
```

## Next Steps

These components are ready to be integrated into the main Offers Management UI:
- Use `NotificationContainer` with `useNotification` hook for user feedback
- Use `ConfirmDialog` for delete confirmations and other destructive actions
- Both components follow the design specifications and requirements
