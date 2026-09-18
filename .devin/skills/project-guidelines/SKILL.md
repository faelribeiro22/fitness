# Project Guidelines Skill

This skill provides access to the centralized development guidelines for the fitness-app project.

## Purpose

Ensures that Devin follows the project's established development guidelines, architecture rules, and workflows when working on this codebase.

## Guidelines Location

All development guidelines are centralized in the `.guidelines/` directory at the project root.

## Quick Start

When starting work on this project, Devin should:

1. Read `PROJECT_GUIDE.md` (universal entry point at project root)
2. Follow the reading order in `.guidelines/context/CONTEXT_INDEX.md`
3. Apply the appropriate agent rules from `.guidelines/agents/`
4. Follow the development workflow in `.guidelines/workflows/feature-development.md`

## Agent Files

The project defines specialized agents with standardized formats:

- **Architect**: `.guidelines/agents/architect.md` - Architecture validation and design
- **Backend Engineer**: `.guidelines/agents/backend-engineer.md` - NestJS API development
- **Frontend Engineer**: `.guidelines/agents/frontend-engineer.md` - React Native interface development
- **Design System Engineer**: `.guidelines/agents/design-system-engineer.md` - UI components and tokens
- **Orchestrator**: `.guidelines/agents/orchestrator.md` - Coordinating multiple agents

## Context Files

Essential context files to read:

- **Project Context**: `.guidelines/context/project-context.md` - Project goals, domains, principles
- **Tech Stack**: `.guidelines/context/tech-stack.md` - Technology stack details
- **Context Index**: `.guidelines/context/CONTEXT_INDEX.md` - File relationships and reading order

## Rules and Standards

Devin must follow these rules:

- **Architecture Rules**: `.guidelines/rules/architecture-rules.md` - Monorepo structure, dependencies, domain isolation
- **Global Rules**: `.guidelines/rules/global-rules.md` - Coding standards, duplication, documentation
- **Validation Checklists**: `.guidelines/rules/CHECKLISTS.md` - Checklists for different task types

## Workflows

Follow the defined workflows:

- **Feature Development**: `.guidelines/workflows/feature-development.md` - 5-step feature development process
- **Command Patterns**: `.guidelines/workflows/COMMAND_PATTERNS.md` - Standard commands for project interaction

## Templates

Use these templates when creating specifications:

- **Feature Spec**: `.guidelines/templates/feature-spec.md` - Feature specification template
- **ADR**: `.guidelines/templates/adr.md` - Architecture Decision Record template

## Reading Order

When starting work, read files in this order:

1. `PROJECT_GUIDE.md` (project root)
2. `.guidelines/README.md`
3. `.guidelines/context/project-context.md`
4. `.guidelines/context/tech-stack.md`
5. `.guidelines/rules/architecture-rules.md`
6. `.guidelines/rules/global-rules.md`
7. `.guidelines/workflows/feature-development.md`
8. Relevant agent file based on task type
9. `.guidelines/context/CONTEXT_INDEX.md` for additional context

## Task-Specific Guidance

### For New Features

1. Read `PROJECT_GUIDE.md`
2. Read `.guidelines/workflows/feature-development.md`
3. Create specification using `.guidelines/templates/feature-spec.md`
4. Consult architect via `.guidelines/agents/architect.md`
5. Implement following relevant agent file
6. Validate using `.guidelines/rules/CHECKLISTS.md`

### For Bug Fixes

1. Read `PROJECT_GUIDE.md`
2. Read relevant context files
3. Read relevant agent file
4. Apply fix following rules
5. Validate using checklists

### For Architecture Changes

1. Read `PROJECT_GUIDE.md`
2. Read `.guidelines/agents/architect.md`
3. Read `.guidelines/rules/architecture-rules.md`
4. Create ADR using `.guidelines/templates/adr.md`
5. Implement following architect guidance

## Key Principles

- **Agnostic Design**: The `.guidelines/` structure is tool-agnostic and works with any AI agent
- **Single Source of Truth**: All guidelines are centralized in `.guidelines/`
- **Standardized Format**: All agent files follow consistent format with Role, Responsibilities, Tech Stack, Rules, Examples, and Validation Checklist
- **Validation First**: Always use checklists before completing tasks
- **Architecture First**: Always consult architectural rules before implementing changes

## Important Notes

- This skill is a bridge - the actual guidelines content is in `.guidelines/`
- Always refer to `.guidelines/` files for the most up-to-date information
- The standardized agent format includes concrete examples showing correct vs incorrect implementations
- Use `.guidelines/workflows/COMMAND_PATTERNS.md` for standard command patterns
- The `.guidelines/` directory was renamed from `.ai/` to be more universal and tool-agnostic
