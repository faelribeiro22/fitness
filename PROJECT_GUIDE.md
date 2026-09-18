# Project Guide for Code Agents

This document serves as the universal entry point for any code agent (Claude, Devin, Copilot, etc.) working on this project.

## Quick Start for Code Agents

**Before making any changes to this project, you MUST:**

1. Read this guide
2. Explore the `.guidelines/` directory structure
3. Understand the project context
4. Follow the development workflow
5. Apply the appropriate agent rules

## Project Overview

This is a fitness application for tracking workouts, exercises, and health data from Android Health Connect.

**Tech Stack:**

- **Frontend**: React Native, Expo, TypeScript, SQLite, TanStack Query, Zustand, React Navigation
- **Backend**: NestJS, Prisma, PostgreSQL, SQLite
- **Monorepo**: pnpm, Turborepo

**Main Domains:**

- Planning (workout plans, calendar, rest days, periodization)
- Exercises (library with hundreds of exercises, GIFs/videos, muscles, equipment)
- Progress (max load, weekly volume, rest time, personal records, charts)
- Watch Data (heart rate, calories, duration, steps, heart rate zones)
- AI (insights based on workout and health data)

## Project Structure

```
fitness-app/
├── .guidelines/              # Development guidelines, agents, rules, workflows
├── apps/                     # Applications (mobile app, API)
├── packages/                 # Shared packages (UI, tokens, utilities)
└── PROJECT_GUIDE.md          # This file - universal entry point
```

## Development Guidelines Location

All development guidelines are located in the `.guidelines/` directory:

- **`.guidelines/README.md`** - Engineering guide overview
- **`.guidelines/context/`** - Project context and tech stack
- **`.guidelines/agents/`** - Specialized agent definitions
- **`.guidelines/rules/`** - Architecture and global rules
- **`.guidelines/templates/`** - ADR and feature spec templates
- **`.guidelines/workflows/`** - Development workflows

## Reading Order for Code Agents

When starting work on this project, read in this order:

1. **PROJECT_GUIDE.md** (this file) - Overview and navigation
2. **`.guidelines/README.md`** - Engineering guide principles
3. **`.guidelines/context/project-context.md`** - Project goals and domains
4. **`.guidelines/context/tech-stack.md`** - Technology stack details
5. **`.guidelines/rules/architecture-rules.md`** - Architecture constraints
6. **`.guidelines/rules/global-rules.md`** - Global coding standards
7. **`.guidelines/workflows/feature-development.md`** - Development workflow
8. **Relevant agent file** - Based on your role (see below)

## Agent Roles

Choose the appropriate agent file based on your task:

- **Architect** - `.guidelines/agents/architect.md` - Architecture validation and design
- **Backend Engineer** - `.guidelines/agents/backend-engineer.md` - NestJS API development
- **Frontend Engineer** - `.guidelines/agents/frontend-engineer.md` - React Native interface development
- **Design System Engineer** - `.guidelines/agents/design-system-engineer.md` - UI components and tokens
- **Orchestrator** - `.guidelines/agents/orchestrator.md` - Coordinating multiple agents

## Development Workflow

Follow the 5-step workflow:

1. **Specification** - Define what to build
2. **Architecture Review** - Validate architectural impact
3. **Implementation** - Write the code
4. **Validation** - Test and verify
5. **Documentation** - Document changes

See `.guidelines/workflows/feature-development.md` for detailed steps.

## Key Principles

- **Code simplicity** over cleverness
- **High maintainability** over quick fixes
- **Low coupling** between modules
- **Evolutionary architecture** that can grow

## Rule Priority

When rules conflict, follow this priority:

1. Security
2. Architecture
3. Business rules
4. Quality
5. Performance
6. Implementation convenience

## Critical Rules

### Architecture Rules

- **Dependency direction**: apps → packages (never packages → apps)
- **Domain isolation**: Each domain must be isolated from others
- **No cross-domain access**: Domains cannot access each other internally

### Global Rules

- **Always check before creating**: Does a component/util/package already exist?
- **No code duplication**: Reuse existing code
- **No premature abstractions**: Keep it simple until needed
- **No giant files**: Split large files into smaller, focused ones
- **Document architectural decisions**: Create ADRs for significant changes

## Monorepo Structure

```
apps/
├── app/          # React Native mobile app
└── api/          # NestJS backend API

packages/
├── ui/           # Shared UI components
├── tokens/       # Design tokens
└── [other shared packages]
```

## Before You Start

Ask yourself:

- What domain am I working in?
- Is there architectural impact?
- Does this require database changes?
- Does this change API contracts?
- Does this affect the Design System?

## Getting Help

- Check `.guidelines/context/CONTEXT_INDEX.md` for context relationships
- Use `.guidelines/rules/CHECKLISTS.md` for validation checklists
- Reference `.guidelines/workflows/COMMAND_PATTERNS.md` for command patterns

## Tool-Specific Bridges

This project provides bridge files for specific AI tools:

- **Claude**: `.claude/AGENTS.md` - Points to `.guidelines/` structure
- **Devin**: `.devin/skills/` - Skills that reference `.guidelines/`

These bridges ensure all tools can access the same centralized guidelines.

## Next Steps

1. Read the relevant agent file for your role
2. Review the context files for your domain
3. Check the rules that apply to your task
4. Follow the development workflow
5. Use validation checklists before completing

---

**Remember**: No code should be created without understanding the architectural impact. Always consult the Architect agent when in doubt.
