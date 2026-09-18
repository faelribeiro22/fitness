# Validation Checklists

This document provides checklists for validating different types of work in the project. Use these checklists before considering any task complete.

## General Pre-Work Checklist

Before starting any task:

- [ ] Read PROJECT_GUIDE.md
- [ ] Read relevant context files (see CONTEXT_INDEX.md)
- [ ] Read relevant agent file for your role
- [ ] Read applicable rules (architecture-rules.md, global-rules.md)
- [ ] Understand the domain and impact
- [ ] Identify which specialists are needed (if orchestrating)

## Architecture Validation Checklist

Use this checklist when making architectural changes or before significant implementations:

- [ ] SOLID principles applied
- [ ] Clean Architecture respected
- [ ] Modules adequately separated
- [ ] Dependency Rule followed (apps → packages only)
- [ ] Domains isolated without cross-access
- [ ] Low coupling verified
- [ ] High cohesion maintained
- [ ] No code duplication
- [ ] Business logic not in React Native components
- [ ] ADR created if architectural decision made

## Backend Development Checklist

Use this checklist when creating or modifying backend code:

### Structure

- [ ] Code separated into Controller/Service/Repository/DTO
- [ ] API located in apps/api
- [ ] Module structure followed

### Code Quality

- [ ] Business logic in Service, not Controller
- [ ] Database access via Repository/Prisma, not direct in Controller
- [ ] TypeScript strict typing used
- [ ] DTOs used for input validation
- [ ] No exposed sensitive data without protection

### Security

- [ ] Authentication implemented when needed
- [ ] Authorization based on roles applied
- [ ] Input validation via DTOs
- [ ] Error handling doesn't leak sensitive info

### Operations

- [ ] Appropriate logging added
- [ ] Error handling implemented
- [ ] Prisma used for data access
- [ ] Endpoints documented with Swagger

### Testing

- [ ] Unit tests created for Services
- [ ] Integration tests for Controllers
- [ ] Edge cases covered

## Frontend Development Checklist

Use this checklist when creating or modifying frontend code:

### Structure

- [ ] TypeScript strict typing used
- [ ] Logic separated into hooks/services
- [ ] Directory structure followed (modules/[domain]/components|hooks|services|schemas)

### API Integration

- [ ] TanStack Query used for API calls
- [ ] No direct API access in components
- [ ] Loading states implemented
- [ ] Error states implemented
- [ ] Optimistic updates where appropriate

### State Management

- [ ] Local state used for component-specific data
- [ ] Global state (Zustand) only when truly needed
- [ ] No unnecessary global state

### UI/UX

- [ ] Design System components used when available
- [ ] Accessibility verified (contrast, screen reader)
- [ ] Responsive design considered
- [ ] Navigation via React Navigation
- [ ] No component duplication

### Performance

- [ ] Lists virtualized with FlatList
- [ ] Memoization used where appropriate
- [ ] Images optimized
- [ ] Bundle size considered

### Offline

- [ ] SQLite used for offline functionality
- [ ] Sync strategy defined
- [ ] Conflict resolution planned

## Design System Checklist

Use this checklist when creating or modifying UI components:

### Before Creating

- [ ] Checked packages/ui for similar components
- [ ] Checked packages/tokens for needed tokens
- [ ] Confirmed component doesn't already exist

### Implementation

- [ ] No inline CSS/styles
- [ ] Existing components reused
- [ ] Tokens reused (colors, spacing, typography)
- [ ] No new colors created
- [ ] No arbitrary spacing values
- [ ] Relative measurements used, not absolute

### Documentation

- [ ] Storybook documentation created
- [ ] All component variations documented
- [ ] Props documented
- [ ] Usage examples provided

### Testing

- [ ] Unit tests created
- [ ] Accessibility tested (contrast, screen reader)
- [ ] Different screen sizes tested
- [ ] Component variants tested

### Quality

- [ ] Consistent with existing components
- [ ] Responsive design implemented
- [ ] Accessibility standards met
- [ ] Performance considered

## Feature Development Checklist

Use this checklist when implementing new features:

### Planning

- [ ] Feature specification created (using feature-spec.md template)
- [ ] Architectural impact assessed
- [ ] Database changes identified
- [ ] API contract changes identified
- [ ] Design System impact identified

### Architecture

- [ ] Architecture review completed
- [ ] Domain isolation respected
- [ ] Dependency direction correct
- [ ] ADR created if architectural decision needed

### Implementation

- [ ] Backend implemented following backend checklist
- [ ] Frontend implemented following frontend checklist
- [ ] Design System changes follow design system checklist
- [ ] All agent-specific checklists completed

### Testing

- [ ] Unit tests written
- [ ] Integration tests written
- [ ] E2E tests for critical paths
- [ ] Manual testing completed
- [ ] Edge cases covered

### Documentation

- [ ] Code documented where complex
- [ ] API documentation updated (Swagger)
- [ ] Component documentation updated (Storybook)
- [ ] README updated if user-facing
- [ ] Changelog updated

### Validation

- [ ] TypeScript compilation successful
- [ ] Linting passes
- [ ] All tests pass
- [ ] Build successful
- [ ] No console errors
- [ ] Performance acceptable

## Bug Fix Checklist

Use this checklist when fixing bugs:

### Investigation

- [ ] Bug reproduced reliably
- [ ] Root cause identified
- [ ] Impact assessed (which domains/users affected)

### Fix

- [ ] Fix addresses root cause, not symptoms
- [ ] No regressions introduced
- [ ] Follows all architecture rules
- [ ] Follows all global rules

### Testing

- [ ] Test case added to prevent regression
- [ ] Related tests still pass
- [ ] Manual verification completed
- [ ] Edge cases considered

### Documentation

- [ ] Bug documented in issue tracker
- [ ] Fix documented if complex
- [ ] Related documentation updated

## Database Change Checklist

Use this checklist when making database changes:

### Planning

- [ ] Migration planned
- [ ] Backward compatibility considered
- [ ] Data migration strategy defined
- [ ] Rollback plan prepared

### Implementation

- [ ] Prisma schema updated
- [ ] Migration created
- [ ] Migration tested locally
- [ ] Migration tested on staging

### Validation

- [ ] Data integrity verified
- [ ] Performance impact assessed
- [ ] API changes updated accordingly
- [ ] Frontend changes updated accordingly

## Security Checklist

Use this checklist for security-related changes:

### Authentication

- [ ] Authentication flow correct
- [ ] Tokens handled securely
- [ ] Session management appropriate
- [ ] Password requirements met

### Authorization

- [ ] Role-based access control implemented
- [ ] Least privilege principle applied
- [ ] Admin endpoints protected
- [ ] User data isolated

### Data Protection

- [ ] Sensitive data encrypted at rest
- [ ] Sensitive data encrypted in transit
- [ ] No sensitive data in logs
- [ ] No sensitive data in error messages

### API Security

- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection where needed

## Performance Checklist

Use this checklist for performance-related work:

### Frontend

- [ ] Bundle size analyzed
- [ ] Lazy loading implemented where appropriate
- [ ] Images optimized
- [ ] Lists virtualized
- [ ] Memoization used appropriately
- [ ] Animations performant

### Backend

- [ ] Database queries optimized
- [ ] Indexes added where needed
- [ ] N+1 queries eliminated
- [ ] Caching strategy implemented
- [ ] Response times acceptable

### Monitoring

- [ ] Performance metrics added
- [ ] Error tracking configured
- [ ] Analytics implemented

## Pre-Commit Checklist

Before committing any changes:

- [ ] All validation checklists for the type of work completed
- [ ] TypeScript compilation successful
- [ ] Linting passes
- [ ] All tests pass
- [ ] No console errors
- [ ] No sensitive data committed
- [ ] Commit message clear and descriptive
- [ ] Related issues referenced

## Pre-Merge Checklist

Before merging to main branch:

- [ ] Code review completed
- [ ] All pre-commit checklist items passed
- [ ] Documentation updated
- [ ] Tests passing on CI
- [ ] Manual testing completed
- [ ] No breaking changes without version bump
- [ ] Database migrations run successfully
- [ ] Staging environment verified
