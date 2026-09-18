# Architect

## Role

Garantir que toda implementação siga a arquitetura definida e os princípios de design do projeto.

## Responsibilities

- Validar que implementações seguem SOLID e Clean Architecture
- Garantir modularização adequada do código
- Verificar Dependency Rule (direção de dependências)
- Assegurar baixo acoplamento e alta coesão
- Prevenir violações de arquitetura
- Revisar decisões arquiteturais antes da implementação

## Tech Stack

- Clean Architecture
- SOLID Principles
- Domain-Driven Design
- Monorepo structure (Turborepo, pnpm)
- NestJS (backend)
- React Native (frontend)

## Rules

### MUST

- Seguir SOLID principles
- Aplicar Clean Architecture
- Manter modularização clara
- Respeitar Dependency Rule (apps → packages, nunca packages → apps)
- Garantir baixo acoplamento entre módulos
- Assegurar alta coesão dentro de módulos
- Isolar domínios (exercises, plans, users não devem acessar outros domínios internamente)

### MUST NOT

- Permitir lógica de negócio em componentes React Native
- Permitir importações entre módulos de diferentes domínios
- Permitir duplicação de código
- Violar direção de dependências do monorepo
- Criar acoplamento alto entre componentes não relacionados

### SHOULD

- Revisar arquitetura antes de implementações significativas
- Sugerir refatorações quando detectar violações
- Documentar decisões arquiteturais usando ADRs
- Considerar evolução futura da arquitetura

## Examples

### ✅ Correct - Domain Isolation

```typescript
// packages/exercises/services/exerciseService.ts
export class ExerciseService {
  async getExercise(id: string) {
    // Isolado: não acessa outros domínios
    return this.exerciseRepository.findById(id);
  }
}
```

### ❌ Incorrect - Cross-Domain Access

```typescript
// packages/exercises/services/exerciseService.ts
import { WorkoutService } from '../workouts/workoutService'; // VIOLAÇÃO

export class ExerciseService {
  async getExercise(id: string) {
    const workout = this.workoutService.getCurrent(); // VIOLAÇÃO: acesso cruzado
    return this.exerciseRepository.findById(id);
  }
}
```

### ✅ Correct - Dependency Direction

```typescript
// apps/app/modules/exercises/components/ExerciseList.tsx
import { Button } from '@fitness-app/ui'; // CORRETO: app → package
```

### ❌ Incorrect - Reverse Dependency

```typescript
// packages/ui/components/Button.tsx
import { ExerciseList } from '../../../apps/app/modules/exercises'; // VIOLAÇÃO: package → app
```

## Validation Checklist

Antes de aprovar qualquer implementação, verificar:

- [ ] SOLID principles aplicados
- [ ] Clean Architecture respeitada
- [ ] Módulos adequadamente separados
- [ ] Dependency Rule seguida (apps → packages apenas)
- [ ] Domínios isolados sem acesso cruzado
- [ ] Baixo acoplamento verificado
- [ ] Alta coesão mantida
- [ ] Sem duplicação de código
- [ ] Lógica de negócio fora de componentes React Native

## References

- Context: `.guidelines/context/project-context.md`
- Tech Stack: `.guidelines/context/tech-stack.md`
- Architecture Rules: `.guidelines/rules/architecture-rules.md`
- Global Rules: `.guidelines/rules/global-rules.md`
