# Offers Management System

A full-stack TypeScript application for managing offers and suppliers. Built as a monorepo with a React frontend and Express API backend, this system provides a complete CRUD interface for creating, viewing, updating, and deleting offers with supplier associations.

## Purpose

This application demonstrates a modern, type-safe approach to building full-stack applications with:
- Property-based testing for correctness validation
- Clean architecture with separation of concerns
- Comprehensive error handling and validation
- Real-time UI updates with optimistic mutations


## Getting Started

### Prerequisites
- Node.js (version specified in `.nvmrc` files)
- npm or yarn

### Installation

Install dependencies for all workspaces:
```bash
npm install
```

### Development

Run both UI and API in development mode:
```bash
npm run dev
```

Or run them separately:
```bash
npm run dev:ui   # UI on http://localhost:3000
npm run dev:api  # API on http://localhost:3001
```

The UI will be available at `http://localhost:3000` and will proxy API requests to `http://localhost:3001`.

### Testing

Run tests for all workspaces:
```bash
npm run test
```

Run tests for individual components:
```bash
cd api && npm test          # API tests
cd ui && npm test           # UI tests
```

Run tests in watch mode:
```bash
cd api && npm run test:watch
cd ui && npm run test:watch
```

### Type Checking

```bash
npm run type-check        # Check all workspaces
npm run type-check:ui     # Check UI only
npm run type-check:api    # Check API only
```

### Building

Build all workspaces for production:
```bash
npm run build             # Build all workspaces
```

Build individual components:
```bash
cd api && npm run build   # Build API
cd ui && npm run build    # Build UI
```