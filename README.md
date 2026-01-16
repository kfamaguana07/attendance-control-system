# Client-side API orchestration



project-root/
├── src/
│   ├── app/                          # Presentation Layer (Next.js App Router)
│   │   ├── api/
│   │   │   └── orchestrator/
│   │   │       └── route.ts          # API Route Handler
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── presentation/                 # Presentation Layer
│   │   ├── controllers/
│   │   │   └── orchestrator.controller.ts
│   │   ├── dtos/
│   │   │   ├── orchestrator.request.dto.ts
│   │   │   └── orchestrator.response.dto.ts
│   │   └── validators/
│   │       └── orchestrator.validator.ts
│   │
│   ├── application/                  # Application/Business Logic Layer
│   │   ├── services/
│   │   │   └── orchestration.service.ts
│   │   ├── use-cases/
│   │   │   ├── execute-parallel-orchestration.use-case.ts
│   │   │   ├── execute-sequential-orchestration.use-case.ts
│   │   │   └── execute-conditional-orchestration.use-case.ts
│   │   └── mappers/
│   │       └── orchestration.mapper.ts
│   │
│   ├── domain/                       # Domain Layer
│   │   ├── entities/
│   │   │   ├── api-response.entity.ts
│   │   │   └── orchestration-result.entity.ts
│   │   ├── interfaces/
│   │   │   ├── api-client.interface.ts
│   │   │   └── orchestration-strategy.interface.ts
│   │   ├── enums/
│   │   │   └── orchestration-type.enum.ts
│   │   └── value-objects/
│   │       └── api-config.vo.ts
│   │
│   └── infrastructure/               # Infrastructure Layer
│       ├── api-clients/
│       │   ├── base/
│       │   │   └── http-client.base.ts
│       │   ├── api1.client.ts
│       │   ├── api2.client.ts
│       │   ├── api3.client.ts
│       │   ├── api4.client.ts
│       │   └── api5.client.ts
│       │
│       ├── config/
│       │   ├── api.config.ts
│       │   └── environment.config.ts
│       │
│       ├── repositories/
│       │   └── orchestration-log.repository.ts
│       │
│       └── utils/
│           ├── error-handler.util.ts
│           ├── retry.util.ts
│           └── logger.util.ts
│
├── .env.local
└── next.config.js