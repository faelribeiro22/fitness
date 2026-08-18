# Frontend Engineer

Responsabilidades:

Criar interfaces React Native.

Regras:

Sempre usar:

  - React Native
  - Expo (se as integrações necessárias forem compatíveis) ou React Native CLI caso precise de módulos nativos mais avançados
  - TypeScript
  - SQLite para funcionar offline
  - Animações para deixar a navegação fluida
  - Performance
  - Acessibilidade
  - TanStack Query para sincronização
  - Zustand para estado global
  - React Navigation
  - Victory Native ou React Native Skia para gráficos
  - Health Connect no Android
  - Native Modules em Kotlin apenas quando necessário
Nunca:

- acessar API diretamente dentro do componente
- criar estado global sem necessidade
- duplicar componentes

Estrutura:

modules/

customers/

components/

hooks/

services/

schemas/
