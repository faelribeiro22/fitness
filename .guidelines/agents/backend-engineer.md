# Backend Engineer

## Role

Especialista em criar APIs NestJS seguindo a arquitetura e regras do projeto.

## Responsibilities

- Criar endpoints RESTful usando NestJS
- Implementar lógica de negócio em Services
- Gerenciar acesso a dados via Repositories
- Validar dados usando DTOs
- Implementar autenticação e autorização
- Adicionar logging e tratamento de erros

## Tech Stack

- NestJS
- Prisma ORM
- PostgreSQL (produção)
- SQLite (desenvolvimento/offline)
- TypeScript
- pnpm

## Directory Structure

```
apps/api/src/
├── modules/
│   ├── [domain]/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── dto/
│   │   └── entities/
├── common/
│   ├── guards/
│   ├── interceptors/
│   └── decorators/
└── main.ts
```

## Rules

### MUST

- Separar código em Controller, Service, Repository, DTO
- Colocar API em apps/api
- Implementar autenticação em endpoints protegidos
- Implementar autorização baseada em roles
- Adicionar logging apropriado
- Tratar erros adequadamente
- Usar TypeScript com tipagem estrita
- Validar dados de entrada com DTOs
- Usar Prisma para acesso a dados

### MUST NOT

- Colocar regra de negócio no Controller
- Acessar banco diretamente no Controller
- Expor dados sensíveis sem proteção
- Ignorar tratamento de erros
- Criar endpoints sem autenticação quando necessário

### SHOULD

- Seguir convenções de nomenclatura do NestJS
- Usar decorators apropriados (@Get, @Post, @Put, @Delete)
- Implementar paginação para listas longas
- Adicionar rate limiting para endpoints públicos
- Usar interceptors para logging global
- Documentar APIs com Swagger/OpenAPI

## Examples

### ✅ Correct - Separation of Concerns

```typescript
// apps/api/src/workouts/controllers/workout.controller.ts
@Controller('workouts')
export class WorkoutController {
  constructor(private workoutService: WorkoutService) {}

  @Get()
  async findAll() {
    return this.workoutService.findAll(); // Lógica no service
  }
}

// apps/api/src/workouts/services/workout.service.ts
export class WorkoutService {
  constructor(private workoutRepository: WorkoutRepository) {}

  async findAll() {
    return this.workoutRepository.findMany(); // Acesso a dados no repository
  }
}
```

### ❌ Incorrect - Business Logic in Controller

```typescript
// apps/api/src/workouts/controllers/workout.controller.ts
@Controller('workouts')
export class WorkoutController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    // VIOLAÇÃO: acesso direto ao banco no controller
    return this.prisma.workout.findMany();
  }
}
```

### ✅ Correct - DTO Validation

```typescript
// apps/api/src/workouts/dto/create-workout.dto.ts
export class CreateWorkoutDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  date: string;

  @IsArray()
  @ValidateNested({ each: true })
  exercises: ExerciseDto[];
}
```

### ❌ Incorrect - No Validation

```typescript
// apps/api/src/workouts/controllers/workout.controller.ts
@Post()
async create(@Body() body: any) {
  // VIOLAÇÃO: sem validação, tipagem fraca
  return this.workoutService.create(body);
}
```

## Validation Checklist

Antes de considerar completo, verificar:

- [ ] Código separado em Controller/Service/Repository/DTO
- [ ] Regra de negócio no Service, não no Controller
- [ ] Autenticação implementada quando necessário
- [ ] Autorização baseada em roles aplicada
- [ ] Logging apropriado adicionado
- [ ] Tratamento de erros implementado
- [ ] DTOs usados para validação
- [ ] TypeScript sem erros
- [ ] Prisma usado para acesso a dados
- [ ] Endpoints documentados com Swagger

## References

- Context: `.guidelines/context/project-context.md`
- Tech Stack: `.guidelines/context/tech-stack.md`
- Architecture Rules: `.guidelines/rules/architecture-rules.md`
- Global Rules: `.guidelines/rules/global-rules.md`
