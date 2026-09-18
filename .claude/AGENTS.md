# Claude Agent Configuration

This file serves as a bridge for Claude AI to access the project's centralized development guidelines.

## Project Guidelines Location

All development guidelines are located in the `.guidelines/` directory. This provides a single source of truth for all AI agents.

## Quick Start for Claude

When working on this project, Claude should:

1. **Start by reading**: `PROJECT_GUIDE.md` (universal entry point)
2. **Follow the reading order** specified in `.guidelines/context/CONTEXT_INDEX.md`
3. **Apply the appropriate agent rules** from `.guidelines/agents/`
4. **Follow the development workflow** in `.guidelines/workflows/feature-development.md`

## Agent Mappings

Claude should map its capabilities to the following agent definitions:

| Claude Role              | Project Agent File          | Location                                       |
| ------------------------ | --------------------------- | ---------------------------------------------- |
| Architecture Specialist  | `architect.md`              | `.guidelines/agents/architect.md`              |
| Backend Developer        | `backend-engineer.md`       | `.guidelines/agents/backend-engineer.md`       |
| Frontend Developer       | `frontend-engineer.md`      | `.guidelines/agents/frontend-engineer.md`      |
| UI/UX Specialist         | `design-system-engineer.md` | `.guidelines/agents/design-system-engineer.md` |
| Coordinator/Orchestrator | `orchestrator.md`           | `.guidelines/agents/orchestrator.md`           |

## Context Files

Claude should read these context files before making changes:

- **Project Context**: `.guidelines/context/project-context.md`
- **Tech Stack**: `.guidelines/context/tech-stack.md`
- **Context Index**: `.guidelines/context/CONTEXT_INDEX.md` (for relationships)

## Rules and Standards

Claude must follow:

- **Architecture Rules**: `.guidelines/rules/architecture-rules.md`
- **Global Rules**: `.guidelines/rules/global-rules.md`
- **Validation Checklists**: `.guidelines/rules/CHECKLISTS.md`

## Workflows

Claude should follow the defined workflows:

- **Feature Development**: `.guidelines/workflows/feature-development.md`
- **Command Patterns**: `.guidelines/workflows/COMMAND_PATTERNS.md`

## Templates

When creating specifications or documentation:

- **Feature Spec**: `.guidelines/templates/feature-spec.md`
- **ADR**: `.guidelines/templates/adr.md`

## Reading Order

Claude should read files in this order when starting work:

1. `PROJECT_GUIDE.md`
2. `.guidelines/README.md`
3. `.guidelines/context/project-context.md`
4. `.guidelines/context/tech-stack.md`
5. `.guidelines/rules/architecture-rules.md`
6. `.guidelines/rules/global-rules.md`
7. `.guidelines/workflows/feature-development.md`
8. Relevant agent file based on task
9. `.guidelines/context/CONTEXT_INDEX.md` for additional context

## Key Principles

- **Agnostic Design**: The `.guidelines/` structure is designed to be tool-agnostic
- **Single Source of Truth**: All guidelines are centralized in `.guidelines/`
- **Consistent Format**: All agent files follow the same standardized format
- **Validation**: Use checklists before completing tasks
- **Architecture First**: Always consult architectural rules before implementing

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

## Notes

- This file is a bridge - the actual content is in `.guidelines/`
- Always refer to `.guidelines/` files for the most up-to-date information
- The standardized format ensures Claude can parse and understand all agent files
- Examples in agent files show correct vs incorrect implementations
