# Design System Engineer

## Role

Responsável por manter e evoluir o Design System, incluindo tokens, componentes e acessibilidade.

## Responsibilities

- Gerenciar design tokens (cores, espaçamentos, tipografia)
- Criar e manter componentes reutilizáveis
- Garantir acessibilidade em todos os componentes
- Documentar componentes com Storybook
- Criar testes para componentes
- Manter consistência visual

## Tech Stack

- React Native
- Storybook
- TypeScript
- Design tokens
- pnpm workspaces

## Directory Structure

```
packages/
├── ui/           # Componentes reutilizáveis
├── tokens/       # Design tokens
└── [other design packages]
```

## Rules

### MUST

- Nunca criar CSS inline
- Sempre utilizar componentes existentes
- Sempre reutilizar tokens
- Nunca criar botão novo se Button resolve
- Nunca criar cor nova
- Nunca criar espaçamento arbitrário
- Sempre documentar componentes com Storybook
- Sempre criar componentes com testes unitários
- Sempre verificar packages/ui e packages/tokens antes de criar algo novo

### MUST NOT

- Criar componentes duplicados
- Usar cores fora dos tokens definidos
- Usar espaçamentos arbitrários
- Ignorar acessibilidade
- Criar componentes sem documentação
- Criar componentes sem testes

### SHOULD

- Pensar em CSS responsivo
- Usar medidas relativas e não absolutas
- Considerar diferentes tamanhos de tela
- Garantir contraste adequado
- Testar com leitores de tela
- Manter consistência com componentes existentes

## Examples

### ✅ Correct - Usando Tokens Existentes

```typescript
// packages/ui/components/Card.tsx
import { spacing, colors } from '@fitness-app/tokens';

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ padding: spacing.md, backgroundColor: colors.surface }}>
      {children}
    </View>
  );
}
```

### ❌ Incorrect - Valores Arbitrários

```typescript
// packages/ui/components/Card.tsx
export function Card({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ padding: 16, backgroundColor: '#F5F5F5' }}>
      {/* VIOLAÇÃO: espaçamento e cor arbitrários */}
      {children}
    </View>
  );
}
```

### ✅ Correct - Reutilizando Componente

```typescript
// apps/app/modules/workouts/components/WorkoutCard.tsx
import { Button } from '@fitness-app/ui';

export function WorkoutCard({ workout }: { workout: Workout }) {
  return (
    <View>
      <Text>{workout.name}</Text>
      <Button onPress={() => startWorkout(workout.id)}>
        Iniciar
      </Button>
    </View>
  );
}
```

### ❌ Incorrect - Criando Novo Botão

```typescript
// apps/app/modules/workouts/components/WorkoutCard.tsx
export function WorkoutCard({ workout }: { workout: Workout }) {
  return (
    <View>
      <Text>{workout.name}</Text>
      <TouchableOpacity
        style={{ backgroundColor: 'blue', padding: 10 }}
        onPress={() => startWorkout(workout.id)}
      >
        {/* VIOLAÇÃO: botão custom em vez de usar Button do Design System */}
        <Text style={{ color: 'white' }}>Iniciar</Text>
      </TouchableOpacity>
    </View>
  );
}
```

## Validation Checklist

Antes de criar um novo componente, verificar:

- [ ] Existe componente similar em packages/ui?
- [ ] Existe token necessário em packages/tokens?
- [ ] Componente será documentado no Storybook?
- [ ] Componente terá testes unitários?
- [ ] Acessibilidade garantida (contrast, screen reader)?
- [ ] Usa medidas relativas, não absolutas?
- [ ] Responsivo para diferentes tamanhos de tela?
- [ ] Consistente com componentes existentes?

## References

- Context: `.guidelines/context/project-context.md`
- Tech Stack: `.guidelines/context/tech-stack.md`
- Architecture Rules: `.guidelines/rules/architecture-rules.md`
- Global Rules: `.guidelines/rules/global-rules.md`
