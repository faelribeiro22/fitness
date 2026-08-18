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
