# Feature Development Workflow

This workflow defines the 5-step process for developing features in this project. Follow these steps to ensure quality, consistency, and architectural integrity.

## Step 1 - Specification

### Objective

Define what needs to be built with clear requirements and acceptance criteria.

### Sub-steps

1. **Create feature specification**
   - Use `.guidelines/templates/feature-spec.md` template
   - Save as `specs/[feature-name].md`

2. **Define the following in specification:**
   - **Objective**: Clear statement of what the feature achieves
   - **Users**: Who will use this feature (admin, user, etc.)
   - **Business rules**: Constraints and requirements
   - **Screens/UI**: What screens/components are needed
   - **APIs**: What API endpoints are required
   - **Data model**: What data structures are needed
   - **Edge cases**: What scenarios need to be handled

3. **Identify impact areas:**
   - Which domains are affected? (Planning, Exercises, Evolution, Watch Data, AI)
   - Is there architectural impact?
   - Are database changes required?
   - Are API contract changes required?
   - Is Design System impact required?

4. **Create acceptance criteria:**
   - Define what "done" looks like
   - List measurable outcomes
   - Identify success metrics

### Completion Criteria

- [ ] Feature specification created using template
- [ ] All required sections filled (objective, users, rules, screens, APIs)
- [ ] Impact areas identified
- [ ] Acceptance criteria defined
- [ ] Specification reviewed and approved

### References

- Template: `.guidelines/templates/feature-spec.md`
- Context: `.guidelines/context/project-context.md`
- Context: `.guidelines/context/CONTEXT_INDEX.md`

---

## Step 2 - Architecture Review

### Objective

Validate that the proposed feature aligns with architectural principles and doesn't introduce violations.

### Sub-steps

1. **Consult Architect Agent**
   - Provide feature specification
   - Ask for architectural validation
   - Request identification of potential issues

2. **Review architectural concerns:**
   - **SOLID principles**: Does the design follow SOLID?
   - **Clean Architecture**: Is the layered approach maintained?
   - **Dependency Rule**: Will dependencies flow correctly (apps → packages)?
   - **Domain isolation**: Will domains remain isolated?
   - **Coupling/Cohesion**: Is coupling low and cohesion high?
   - **Modularity**: Is the feature appropriately modular?

3. **Identify required changes:**
   - New modules/packages needed?
   - Refactoring required?
   - Schema changes needed?
   - API contract changes?

4. **Create ADR if needed**
   - Use `.guidelines/templates/adr.md` template
   - Document significant architectural decisions
   - Include alternatives considered and rationale

### Completion Criteria

- [ ] Architect Agent consulted and review completed
- [ ] Architectural concerns addressed
- [ ] Dependency direction validated
- [ ] Domain isolation confirmed
- [ ] ADR created if architectural decision made
- [ ] Implementation plan approved by Architect

### References

- Architect: `.guidelines/agents/architect.md`
- Architecture Rules: `.guidelines/rules/architecture-rules.md`
- ADR Template: `.guidelines/templates/adr.md`

---

## Step 3 - Implementation

### Objective

Build the feature following the approved architecture and project rules.

### Sub-steps

#### 3.1 Backend Implementation (if applicable)

1. **Create database schema changes**
   - Update Prisma schema
   - Create migration: `pnpm --filter api prisma migrate dev --name [feature]`
   - Test migration locally

2. **Implement NestJS modules**
   - Generate module: `pnpm --filter api nest g module [domain]`
   - Generate service: `pnpm --filter api nest g service [domain]`
   - Generate controller: `pnpm --filter api nest g controller [domain]`
   - Generate DTOs: `pnpm --filter api nest g dto [domain]`

3. **Implement business logic**
   - Place logic in Services (not Controllers)
   - Use Repositories for data access
   - Validate inputs with DTOs
   - Implement authentication/authorization

4. **Add API documentation**
   - Document with Swagger decorators
   - Include request/response examples

#### 3.2 Frontend Implementation (if applicable)

1. **Create module structure**
   - Follow: `apps/app/modules/[domain]/components|hooks|services|schemas`
   - Create necessary directories

2. **Implement data layer**
   - Create services for API calls
   - Create hooks using TanStack Query
   - Implement loading/error states
   - Set up offline sync with SQLite

3. **Implement UI components**
   - Check Design System for existing components
   - Use Design System components when available
   - Create new components only if needed
   - Implement accessibility features

4. **Implement navigation**
   - Use React Navigation
   - Add screens to navigation structure
   - Implement deep linking if needed

#### 3.3 Design System Changes (if applicable)

1. **Check for existing components**
   - Search `packages/ui` for similar components
   - Check `packages/tokens` for needed tokens

2. **Create new components (if needed)**
   - Document with Storybook
   - Add unit tests
   - Ensure accessibility
   - Use existing tokens

3. **Update tokens (if needed)**
   - Follow token conventions
   - Document changes
   - Update Storybook

### Completion Criteria

- [ ] Backend implemented following Backend Engineer checklist
- [ ] Frontend implemented following Frontend Engineer checklist
- [ ] Design System changes follow Design System Engineer checklist
- [ ] All code follows global rules
- [ ] TypeScript compilation successful
- [ ] No architecture violations
- [ ] Components use Design System when available

### References

- Backend Engineer: `.guidelines/agents/backend-engineer.md`
- Frontend Engineer: `.guidelines/agents/frontend-engineer.md`
- Design System Engineer: `.guidelines/agents/design-system-engineer.md`
- Global Rules: `.guidelines/rules/global-rules.md`
- Command Patterns: `.guidelines/workflows/COMMAND_PATTERNS.md`

---

## Step 4 - Validation

### Objective

Ensure the implementation is correct, complete, and meets quality standards.

### Sub-steps

#### 4.1 Code Quality

1. **Run linting**
   - `pnpm lint`
   - Fix any linting issues: `pnpm lint:fix`

2. **Type checking**
   - `pnpm typecheck`
   - Ensure no TypeScript errors

3. **Code review**
   - Self-review against checklists
   - Verify architectural compliance
   - Check for code duplication

#### 4.2 Testing

1. **Unit tests**
   - Write unit tests for services
   - Write unit tests for components
   - Aim for >80% coverage on critical paths

2. **Integration tests**
   - Test API endpoints
   - Test data flow
   - Test offline sync

3. **E2E tests**
   - Test critical user flows
   - Test edge cases
   - Test error scenarios

4. **Run all tests**
   - `pnpm test`
   - Ensure all tests pass

#### 4.3 Manual Testing

1. **Test the feature manually**
   - Follow user acceptance criteria
   - Test on different screen sizes
   - Test offline scenarios
   - Test error scenarios

2. **Accessibility testing**
   - Test with screen reader
   - Check contrast ratios
   - Test keyboard navigation

3. **Performance testing**
   - Check bundle size impact
   - Test on low-end devices
   - Monitor memory usage

#### 4.4 Security Review

1. **Review security implications**
   - Check for exposed sensitive data
   - Verify authentication/authorization
   - Validate input sanitization
   - Check for SQL injection vulnerabilities

### Completion Criteria

- [ ] Linting passes with no errors
- [ ] Type checking passes with no errors
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] Manual testing completed successfully
- [ ] Accessibility verified
- [ ] Performance acceptable
- [ ] Security review completed
- [ ] Build successful: `pnpm build`

### References

- Checklists: `.guidelines/rules/CHECKLISTS.md`
- Command Patterns: `.guidelines/workflows/COMMAND_PATTERNS.md`

---

## Step 5 - Documentation

### Objective

Document the changes for future maintainability and user understanding.

### Sub-steps

#### 5.1 Code Documentation

1. **Add inline comments**
   - Document complex logic
   - Explain non-obvious decisions
   - Add JSDoc for public APIs

2. **Update README files**
   - Update component READMEs if needed
   - Update package READMEs if API changed

#### 5.2 API Documentation

1. **Update Swagger/OpenAPI**
   - Ensure all endpoints documented
   - Include request/response examples
   - Document authentication requirements

2. **Update API changelog**
   - Document breaking changes
   - Document new endpoints
   - Document deprecated endpoints

#### 5.3 Component Documentation

1. **Update Storybook**
   - Add new components to Storybook
   - Document all variants
   - Add usage examples

2. **Update component props**
   - Document all props
   - Document default values
   - Document usage examples

#### 5.4 Project Documentation

1. **Update project README**
   - If feature is user-facing
   - Add screenshots if applicable
   - Update setup instructions if needed

2. **Update CHANGELOG**
   - Add entry for new feature
   - Follow conventional changelog format
   - Include breaking changes

3. **Update ADR**
   - If architectural decisions were made
   - Link ADR to feature

### Completion Criteria

- [ ] Complex code documented with comments
- [ ] API documentation updated (Swagger)
- [ ] Component documentation updated (Storybook)
- [ ] Project README updated if user-facing
- [ ] CHANGELOG updated
- [ ] ADR referenced if applicable
- [ ] No TODO comments left in production code

### References

- ADR Template: `.guidelines/templates/adr.md`
- Context: `.guidelines/context/CONTEXT_INDEX.md`

---

## Pre-Commit Checklist

Before committing any feature work:

- [ ] All 5 workflow steps completed
- [ ] All completion criteria met
- [ ] Pre-commit validation: `pnpm validate`
- [ ] All tests pass: `pnpm test`
- [ ] Build successful: `pnpm build`
- [ ] No sensitive data in code
- [ ] Commit message follows conventional format
- [ ] Related issues referenced in commit message

## Commit Message Format

Use conventional commit format:

```
feat(scope): description

body (optional)

footer (optional)
```

Examples:

- `feat(workouts): add exercise video support`
- `fix(api): resolve workout loading issue`
- `feat(exercises): implement exercise search`

## Branch Naming

Use conventional branch names:

- `feature/[feature-name]` for new features
- `fix/[bug-description]` for bug fixes
- `hotfix/[critical-fix]` for urgent production fixes

## Workflow Summary

1. **Specification** → Define what to build
2. **Architecture Review** → Validate how to build it
3. **Implementation** → Build it correctly
4. **Validation** → Verify it works
5. **Documentation** → Document for maintainability

## Quick Reference

- Feature Spec Template: `.guidelines/templates/feature-spec.md`
- ADR Template: `.guidelines/templates/adr.md`
- Checklists: `.guidelines/rules/CHECKLISTS.md`
- Command Patterns: `.guidelines/workflows/COMMAND_PATTERNS.md`
- Context Index: `.guidelines/context/CONTEXT_INDEX.md`
