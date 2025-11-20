# Offers Management UI - Source Structure

## Directory Structure

```
src/
├── components/       # React components
├── hooks/           # Custom React hooks
├── services/        # API services and business logic
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── test/            # Test setup and utilities
└── __tests__/       # Test files
    ├── unit/        # Unit tests
    ├── properties/  # Property-based tests
    └── integration/ # Integration tests
```

## Path Aliases

The following path aliases are configured for clean imports:

- `@/*` - src root
- `@components/*` - src/components
- `@hooks/*` - src/hooks
- `@services/*` - src/services
- `@types/*` - src/types
- `@utils/*` - src/utils

## Testing

- **Unit Tests**: Vitest + React Testing Library
- **Property-Based Tests**: fast-check
- **Test Commands**:
  - `npm test` - Run all tests once
  - `npm run test:watch` - Run tests in watch mode
  - `npm run test:ui` - Run tests with UI

## Code Quality

- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier
- **Type Checking**: TypeScript strict mode
