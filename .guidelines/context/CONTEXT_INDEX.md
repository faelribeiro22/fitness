# Context Index

This document maps all context files and their relationships to help code agents understand the complete picture of the project.

## Context Files Overview

### Core Context Files

- **project-context.md** - Project goals, users, domains, and principles
- **tech-stack.md** - Technology stack for frontend, backend, and monorepo

### Relationships Between Context Files

```
PROJECT_GUIDE.md (root)
    ↓
    ├── .guidelines/README.md (Engineering guide)
    │
    ├── context/
    │   ├── project-context.md ← START HERE for domain understanding
    │   ├── tech-stack.md ← READ AFTER project-context
    │   └── CONTEXT_INDEX.md ← This file
    │
    ├── rules/
    │   ├── architecture-rules.md ← DEPENDS ON: project-context, tech-stack
    │   ├── global-rules.md ← DEPENDS ON: project-context
    │   └── CHECKLISTS.md ← DEPENDS ON: All rules and agents
    │
    ├── agents/
    │   ├── architect.md ← DEPENDS ON: architecture-rules, global-rules
    │   ├── backend-engineer.md ← DEPENDS ON: tech-stack, architecture-rules
    │   ├── frontend-engineer.md ← DEPENDS ON: tech-stack, architecture-rules
    │   ├── design-system-engineer.md ← DEPENDS ON: tech-stack, global-rules
    │   └── orchestrator.md ← DEPENDS ON: All agents and rules
    │
    ├── workflows/
    │   ├── feature-development.md ← DEPENDS ON: All context, rules, agents
    │   └── COMMAND_PATTERNS.md ← DEPENDS ON: tech-stack, workflows
    │
    └── templates/
        ├── adr.md ← DEPENDS ON: architecture-rules
        └── feature-spec.md ← DEPENDS ON: project-context
```

## Reading Order by Task Type

### For New Feature Development

1. PROJECT_GUIDE.md
2. .guidelines/context/project-context.md
3. .guidelines/context/tech-stack.md
4. .guidelines/rules/architecture-rules.md
5. .guidelines/rules/global-rules.md
6. .guidelines/workflows/feature-development.md
7. Relevant agent file (based on task)
8. .guidelines/templates/feature-spec.md

### For Bug Fixes

1. PROJECT_GUIDE.md
2. .guidelines/context/project-context.md
3. .guidelines/context/tech-stack.md
4. .guidelines/rules/global-rules.md
5. Relevant agent file (based on affected area)
6. .guidelines/rules/CHECKLISTS.md

### For Architecture Changes

1. PROJECT_GUIDE.md
2. .guidelines/context/project-context.md
3. .guidelines/context/tech-stack.md
4. .guidelines/rules/architecture-rules.md
5. .guidelines/agents/architect.md
6. .guidelines/templates/adr.md

### For UI/Design Changes

1. PROJECT_GUIDE.md
2. .guidelines/context/tech-stack.md
3. .guidelines/agents/design-system-engineer.md
4. .guidelines/rules/global-rules.md
5. .guidelines/rules/CHECKLISTS.md

## Domain-Specific Context Mapping

### Planning Domain

- **Context**: project-context.md (Planning section)
- **Rules**: architecture-rules.md (domain isolation)
- **Agents**: architect.md, frontend-engineer.md, backend-engineer.md
- **Workflow**: feature-development.md

### Exercises Domain

- **Context**: project-context.md (Exercises section)
- **Rules**: architecture-rules.md (domain isolation)
- **Agents**: architect.md, frontend-engineer.md, backend-engineer.md
- **Workflow**: feature-development.md

### Progress/Evolution Domain

- **Context**: project-context.md (Evolution section)
- **Rules**: architecture-rules.md (domain isolation)
- **Agents**: architect.md, frontend-engineer.md, backend-engineer.md
- **Workflow**: feature-development.md

### Watch Data Domain

- **Context**: project-context.md (Watch Data section)
- **Rules**: architecture-rules.md (domain isolation)
- **Agents**: architect.md, frontend-engineer.md, backend-engineer.md
- **Tech**: tech-stack.md (Health Connect, Native Modules)
- **Workflow**: feature-development.md

### AI Domain

- **Context**: project-context.md (AI section)
- **Rules**: architecture-rules.md (domain isolation)
- **Agents**: architect.md, backend-engineer.md
- **Workflow**: feature-development.md

## Cross-References

### Architecture Rules

- Referenced by: All agent files
- Depends on: project-context.md (domains), tech-stack.md (monorepo structure)
- Related to: templates/adr.md

### Global Rules

- Referenced by: All agent files
- Depends on: project-context.md (principles)
- Related to: rules/CHECKLISTS.md

### Agent Files

- All agents reference: context files, rules files
- Architect specifically references: architecture-rules.md
- Backend Engineer specifically references: tech-stack.md
- Frontend Engineer specifically references: tech-stack.md, design-system-engineer.md
- Design System Engineer specifically references: global-rules.md
- Orchestrator references: All agents and rules

### Workflow Files

- feature-development.md references: All context, rules, agents
- COMMAND_PATTERNS.md references: tech-stack.md, workflows

## Quick Reference

### When you need to know...

- **What the project is about**: project-context.md
- **What technologies we use**: tech-stack.md
- **How to structure code**: architecture-rules.md
- **General coding standards**: global-rules.md
- **How to implement features**: feature-development.md
- **What your role requires**: Your specific agent file
- **How to validate work**: CHECKLISTS.md
- **What commands to run**: COMMAND_PATTERNS.md
- **How to document decisions**: templates/adr.md
- **How to specify features**: templates/feature-spec.md

## Context Dependencies Summary

| File                      | Depends On                                                                       | Referenced By                         |
| ------------------------- | -------------------------------------------------------------------------------- | ------------------------------------- |
| project-context.md        | None                                                                             | All agents, workflows, templates      |
| tech-stack.md             | project-context.md                                                               | All agents, workflows                 |
| architecture-rules.md     | project-context.md, tech-stack.md                                                | All agents, templates/adr.md          |
| global-rules.md           | project-context.md                                                               | All agents, CHECKLISTS.md             |
| architect.md              | architecture-rules.md, global-rules.md                                           | orchestrator.md                       |
| backend-engineer.md       | tech-stack.md, architecture-rules.md, global-rules.md                            | orchestrator.md                       |
| frontend-engineer.md      | tech-stack.md, architecture-rules.md, global-rules.md, design-system-engineer.md | orchestrator.md                       |
| design-system-engineer.md | tech-stack.md, global-rules.md                                                   | orchestrator.md, frontend-engineer.md |
| orchestrator.md           | All agents, all rules                                                            | -                                     |
| feature-development.md    | All context, all rules, all agents                                               | PROJECT_GUIDE.md                      |
| CHECKLISTS.md             | All rules, all agents                                                            | PROJECT_GUIDE.md, all agents          |
| COMMAND_PATTERNS.md       | tech-stack.md, workflows                                                         | PROJECT_GUIDE.md                      |
| adr.md                    | architecture-rules.md                                                            | PROJECT_GUIDE.md, architect.md        |
| feature-spec.md           | project-context.md                                                               | PROJECT_GUIDE.md, workflows           |

## Maintenance Notes

When adding new context files:

1. Add to the appropriate section in this index
2. Update the reading order if applicable
3. Add cross-references to related files
4. Update the dependencies table
5. Consider which agents/tasks need to reference the new file
