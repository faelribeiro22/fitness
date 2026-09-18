# Fitness App

Monorepo gerenciado com pnpm workspaces e Turborepo.

## Estrutura

- `apps/app`: aplicativo mobile e web em Expo (React Native).
- `apps/web`: aplicação web em Next.js.
- `apps/docs`: documentação em Next.js.
- `apps/api`: reservado para o futuro backend NestJS.
- `packages/*`: código compartilhado entre aplicações.

## Pré-requisitos

- Node.js 22.13 ou superior
- pnpm 9

## Comandos

```bash
pnpm install
pnpm dev                 # inicia todos os apps que possuírem o script dev
pnpm dev:mobile          # inicia apenas o Expo
pnpm --filter @fitness/mobile android
pnpm --filter @fitness/mobile ios
pnpm --filter @fitness/mobile web
pnpm build
pnpm lint
pnpm check-types
```

O Expo SDK 57 reconhece automaticamente os workspaces do pnpm; não há uma configuração Metro manual no repositório. Para adicionar o backend, crie-o em `apps/api` com um `package.json` e os scripts `dev`, `build`, `lint` e `check-types`. O Turbo o incluirá automaticamente.

## Development build

O app mobile usa `expo-dev-client` e já contém perfis EAS em `apps/app/eas.json`.

```bash
# Build instalável para Android, via EAS
pnpm --filter @fitness/mobile build:development:android

# Após instalar a build no dispositivo, iniciar o bundler para ela
pnpm --filter @fitness/mobile dev:client
```

No primeiro build, o EAS pedirá o login na conta Expo e a definição dos identificadores nativos do aplicativo. Eles não são gravados automaticamente por este repositório.

Ao desenvolver pelo WSL, use o túnel para que o dispositivo físico consiga alcançar o Metro:

```bash
pnpm --filter @fitness/mobile dev:tunnel
```

## For Code Agents

If you are an AI agent (Claude, Devin, Copilot, etc.) working on this project, please start by reading the **PROJECT_GUIDE.md** file at the project root. This document provides universal guidance for any code agent working on this codebase.

The project uses a centralized `.guidelines/` directory (formerly `.ai/`) that contains:

- **Agent definitions** - Specialized roles with standardized formats
- **Context files** - Project context, tech stack, and relationships
- **Rules** - Architecture rules, global rules, and validation checklists
- **Workflows** - Feature development workflow and command patterns
- **Templates** - ADR and feature specification templates

All guidelines are designed to be tool-agnostic and can be followed by any AI agent.

**Quick Start for Code Agents:**

1. Read `PROJECT_GUIDE.md` (project root)
2. Explore `.guidelines/` directory structure
3. Follow the reading order in `.guidelines/context/CONTEXT_INDEX.md`
4. Apply the appropriate agent rules for your task
5. Follow the development workflow in `.guidelines/workflows/feature-development.md`

This ensures consistency, quality, and architectural integrity regardless of which AI tool is used.
