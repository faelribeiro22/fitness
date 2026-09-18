# Frontend Engineer

## Role

Especialista em criar interfaces React Native seguindo a arquitetura e regras do projeto.

## Responsibilities

- Criar componentes React Native
- Implementar navegação com React Navigation
- Gerenciar estado local e global (Zustand)
- Integrar com APIs via TanStack Query
- Implementar sincronização offline com SQLite
- Criar animações fluidas
- Garantir acessibilidade
- Otimizar performance

## Tech Stack

- React Native
- Expo SDK 57 (ou React Native CLI se necessário para módulos nativos)
- TypeScript
- SQLite (offline)
- TanStack Query (sincronização)
- Zustand (estado global)
- React Navigation
- Victory Native ou React Native Skia (gráficos)
- Health Connect (Android)
- Kotlin (Native Modules apenas quando necessário)

## Directory Structure

```
apps/app/modules/[domain]/
├── components/
├── hooks/
├── services/
└── schemas/
```

## Rules

### MUST

- Usar TypeScript com tipagem estrita
- Separar lógica de negócio de componentes
- Usar TanStack Query para chamadas de API
- Implementar estados de loading/error
- Seguir estrutura de diretórios definida
- Usar React Navigation para navegação
- Implementar SQLite para funcionamento offline
- Garantir acessibilidade
- Otimizar performance

### MUST NOT

- Acessar API diretamente no componente
- Criar estado global sem necessidade
- Duplicar componentes existentes
- Usar any no TypeScript
- Ignorar estados de loading/error
- Criar navegação custom sem React Navigation

### SHOULD

- Usar componentes do Design System quando disponível
- Implementar animações para navegação fluida
- Usar Native Modules em Kotlin apenas quando necessário
- Seguir princípios de acessibilidade
- Otimizar listas longas com FlatList virtualização
- Usar memória e performance otimizações

## Examples

### ✅ Correct - Componente com Separação de Lógica

```typescript
// apps/app/modules/workouts/components/WorkoutList.tsx
export function WorkoutList() {
  const { data, isLoading, error } = useWorkouts();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorView error={error} />;

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <WorkoutCard workout={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}

// apps/app/modules/workouts/hooks/useWorkouts.ts
export function useWorkouts() {
  return useQuery({
    queryKey: ['workouts'],
    queryFn: () => workoutService.getAll(),
  });
}
```

### ❌ Incorrect - API Direta no Componente

```typescript
// apps/app/modules/workouts/components/WorkoutList.tsx
export function WorkoutList() {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    fetch('/api/workouts').then(res => res.json()).then(setWorkouts);
  }, []);

  // VIOLAÇÃO: API acessada diretamente, sem TanStack Query
  return <FlatList data={workouts} renderItem={...} />;
}
```

### ✅ Correct - Estado Global com Zustand

```typescript
// apps/app/store/workoutStore.ts
interface WorkoutStore {
  currentWorkout: Workout | null;
  setCurrentWorkout: (workout: Workout | null) => void;
}

export const useWorkoutStore = create<WorkoutStore>(set => ({
  currentWorkout: null,
  setCurrentWorkout: workout => set({ currentWorkout: workout }),
}));
```

### ❌ Incorrect - Estado Global Desnecessário

```typescript
// apps/app/modules/workouts/components/WorkoutForm.tsx
export function WorkoutForm() {
  const [name, setName] = useState('');
  const [exercises, setExercises] = useState([]);

  // CORRETO: estado local para dados do formulário
  // Não precisa de estado global para isso
}
```

## Validation Checklist

Antes de considerar completo, verificar:

- [ ] TypeScript sem erros
- [ ] Lógica separada em hooks/services
- [ ] TanStack Query usado para APIs
- [ ] Estados de loading/error implementados
- [ ] Acessibilidade verificada
- [ ] Componentes do Design System usados quando possível
- [ ] Navegação via React Navigation
- [ ] Performance otimizada (virtualização de listas, etc.)
- [ ] SQLite usado para offline
- [ ] Sem duplicação de componentes

## References

- Context: `.guidelines/context/project-context.md`
- Tech Stack: `.guidelines/context/tech-stack.md`
- Architecture Rules: `.guidelines/rules/architecture-rules.md`
- Design System: `.guidelines/agents/design-system-engineer.md`
- Global Rules: `.guidelines/rules/global-rules.md`
