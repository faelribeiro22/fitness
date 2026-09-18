# Command Patterns

This document defines standard command patterns for interacting with the project. These patterns ensure consistency across different code agents and development tasks.

## Project Setup Commands

### Initial Setup

```bash
# Install dependencies
pnpm install

# Setup development environment
pnpm setup
```

### Development Server

```bash
# Start all applications
pnpm dev

# Start specific app
pnpm --filter app dev
pnpm --filter api dev
```

## Build Commands

### Full Build

```bash
# Build all packages and apps
pnpm build

# Build specific package
pnpm --filter @fitness-app/ui build
pnpm --filter @fitness-app/tokens build
```

### Type Checking

```bash
# Type check all packages
pnpm typecheck

# Type check specific app
pnpm --filter app typecheck
pnpm --filter api typecheck
```

## Testing Commands

### Run All Tests

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage
```

### Specific Tests

```bash
# Run tests for specific package
pnpm --filter @fitness-app/ui test

# Run specific test file
pnpm --filter app test -- WorkoutList.test.tsx
```

### Watch Mode

```bash
# Watch tests for changes
pnpm test:watch
```

## Linting Commands

### Lint All

```bash
# Lint all packages
pnpm lint

# Fix linting issues
pnpm lint:fix
```

### Specific Linting

```bash
# Lint specific package
pnpm --filter app lint

# Lint specific file
pnpm --filter app lint -- src/modules/workouts/components/WorkoutList.tsx
```

## Database Commands

### Prisma Commands

```bash
# Generate Prisma client
pnpm --filter api prisma generate

# Run database migrations
pnpm --filter api prisma migrate dev

# Create new migration
pnpm --filter api prisma migrate dev --name add_exercise_videos

# Reset database (development only)
pnpm --filter api prisma migrate reset

# Open Prisma Studio
pnpm --filter api prisma studio
```

### Seed Database

```bash
# Seed database with test data
pnpm --filter api seed
```

## Mobile Development Commands

### Expo Commands

```bash
# Start Expo development server
pnpm --filter app start

# Run on iOS simulator
pnpm --filter app ios

# Run on Android emulator
pnpm --filter app android

# Build for production
pnpm --filter app build:ios
pnpm --filter app build:android
```

### Native Modules

```bash
# Sync native dependencies
pnpm --filter app pod-install
```

## Backend Development Commands

### NestJS Commands

```bash
# Generate new module
pnpm --filter api nest g module workouts

# Generate new controller
pnpm --filter api nest g controller workouts

# Generate new service
pnpm --filter api nest g service workouts

# Generate new DTO
pnpm --filter api nest g dto workouts
```

## Monorepo Commands

### Turborepo Commands

```bash
# Run command across all packages
pnpm turbo test

# Run command for specific package
pnpm turbo test --filter=@fitness-app/ui

# See dependency graph
pnpm turbo graph
```

### Dependency Management

```bash
# Add dependency to specific package
pnpm --filter app add react-native-safe-area-context

# Add dev dependency to specific package
pnpm --filter app add -D @types/react

# Add dependency to workspace
pnpm add -w turbo
```

## Git Commands

### Commit Patterns

```bash
# Stage all changes
git add .

# Commit with conventional format
git commit -m "feat(workouts): add exercise video support"

# Commit with description
git commit -m "fix(api): resolve workout loading issue

- Added error handling for missing workout data
- Improved loading state management
- Fixed race condition in workout fetch"
```

### Branch Patterns

```bash
# Feature branch
git checkout -b feature/workout-videos

# Bugfix branch
git checkout -b fix/workout-loading-error

# Hotfix branch
git checkout -b hotfix/critical-security-fix
```

## Code Quality Commands

### Format Code

```bash
# Format all files
pnpm format

# Format specific file
pnpm --filter app format -- src/modules/workouts/components/WorkoutList.tsx
```

### Type Validation

```bash
# Validate TypeScript types
pnpm typecheck

# Validate with strict mode
pnpm typecheck --strict
```

## Validation Commands

### Pre-Commit Validation

```bash
# Run all validation checks
pnpm validate

# This runs: lint, typecheck, test
```

### Pre-Push Validation

```bash
# Run full validation including build
pnpm validate:full

# This runs: lint, typecheck, test, build
```

## Documentation Commands

### Generate Documentation

```bash
# Generate API documentation
pnpm --filter api docs

# Generate component documentation
pnpm --filter @fitness-app/ui storybook:build
```

### Storybook Commands

```bash
# Start Storybook
pnpm --filter @fitness-app/ui storybook

# Build Storybook
pnpm --filter @fitness-app/ui storybook:build
```

## Performance Commands

### Bundle Analysis

```bash
# Analyze bundle size
pnpm --filter app analyze

# Analyze specific package
pnpm --filter @fitness-app/ui analyze
```

### Performance Testing

```bash
# Run performance tests
pnpm test:performance
```

## Cleanup Commands

### Clean Build Artifacts

```bash
# Clean all build artifacts
pnpm clean

# Clean specific package
pnpm --filter app clean
```

### Reset Dependencies

```bash
# Remove node_modules and reinstall
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
pnpm install
```

## Task-Specific Command Sequences

### Adding a New Feature

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Read project guidelines
cat PROJECT_GUIDE.md
cat .guidelines/workflows/feature-development.md

# 3. Create feature specification
# (Edit .guidelines/templates/feature-spec.md)

# 4. If database changes needed
pnpm --filter api prisma migrate dev --name feature_changes

# 5. Implement backend (if needed)
pnpm --filter api nest g module feature
pnpm --filter api nest g service feature
pnpm --filter api nest g controller feature

# 6. Implement frontend
# (Create components following structure)

# 7. Run validation
pnpm validate

# 8. Run tests
pnpm test

# 9. Build
pnpm build

# 10. Commit changes
git add .
git commit -m "feat: add new feature"
```

### Fixing a Bug

```bash
# 1. Create bugfix branch
git checkout -b fix/bug-description

# 2. Reproduce and identify issue
# (Debug and analyze)

# 3. Implement fix
# (Edit relevant files)

# 4. Add regression test
# (Create test file)

# 5. Run validation
pnpm validate

# 6. Run tests
pnpm test

# 7. Commit changes
git add .
git commit -m "fix: resolve bug description"
```

### Updating Dependencies

```bash
# 1. Check for updates
pnpm outdated

# 2. Update specific dependency
pnpm --filter app update package-name

# 3. Update all dependencies
pnpm update

# 4. Run validation
pnpm validate

# 5. Run tests
pnpm test

# 6. Build
pnpm build

# 7. Commit if successful
git add .
git commit -m "chore: update dependencies"
```

## Environment-Specific Commands

### Development

```bash
# Use development environment
cp .env.development .env
pnpm dev
```

### Staging

```bash
# Use staging environment
cp .env.staging .env
pnpm build
```

### Production

```bash
# Use production environment
cp .env.production .env
pnpm build
```

## Troubleshooting Commands

### Clear Caches

```bash
# Clear Turborepo cache
pnpm turbo prune

# Clear Expo cache
pnpm --filter app start --clear

# Clear Node cache
rm -rf .turbo
rm -rf node_modules/.cache
```

### Reset Project

```bash
# Complete reset (use with caution)
pnpm clean
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
rm -rf .turbo
pnpm install
```

## Agent-Specific Command Patterns

### For Architect Agent

```bash
# Review architecture
cat .guidelines/rules/architecture-rules.md
cat .guidelines/agents/architect.md

# Check dependency graph
pnpm turbo graph

# Validate structure
find . -name "*.ts" -o -name "*.tsx" | head -20
```

### For Backend Engineer

```bash
# Generate NestJS resources
pnpm --filter api nest g module [domain]
pnpm --filter api nest g service [domain]
pnpm --filter api nest g controller [domain]

# Database operations
pnpm --filter api prisma migrate dev
pnpm --filter api prisma studio

# Run backend tests
pnpm --filter api test
```

### For Frontend Engineer

```bash
# Start development server
pnpm --filter app dev

# Run on device/emulator
pnpm --filter app ios
pnpm --filter app android

# Run frontend tests
pnpm --filter app test

# Check types
pnpm --filter app typecheck
```

### For Design System Engineer

```bash
# Start Storybook
pnpm --filter @fitness-app/ui storybook

# Build Storybook
pnpm --filter @fitness-app/ui storybook:build

# Run UI tests
pnpm --filter @fitness-app/ui test

# Check tokens
cat packages/tokens/src/index.ts
```

## Continuous Integration Commands

### CI Validation

```bash
# Run all CI checks
pnpm ci:validate

# This typically includes:
# - pnpm install
# - pnpm lint
# - pnpm typecheck
# - pnpm test
# - pnpm build
```

### Deployment Commands

```bash
# Deploy to staging
pnpm deploy:staging

# Deploy to production
pnpm deploy:production
```

## Notes

- Always use `pnpm` instead of `npm` for this monorepo
- Use `--filter` to target specific packages/apps
- Run validation commands before committing
- Test changes thoroughly before deploying
- Follow the command sequences for complex tasks
- Refer to agent-specific patterns for role-based tasks
