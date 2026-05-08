# Diagrama 1 — Arquitectura Geral

```
┌─────────────────────────────────────────────────────────────────────┐
│  FRONTEND (Next.js 15 + TypeScript + Tailwind)                     │
│                                                                     │
│  ┌──────────┐  ┌────────────┐  ┌───────────┐  ┌────────────────┐  │
│  │ Chat IA  │  │ Simulador  │  │ Progresso │  │  Legislacao    │  │
│  │          │  │ (3 ecras)  │  │ (graficos)│  │  (accordion)   │  │
│  └──────────┘  └────────────┘  └───────────┘  └────────────────┘  │
│                                                                     │
│  Zustand (estado) · Axios (HTTP) · Recharts (graficos)             │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ REST/JSON + JWT
┌──────────────────────────▼──────────────────────────────────────────┐
│  BACKEND (Spring Boot 4.0.2 · Java 17)                             │
│                                                                     │
│  ┌──────────────┐  ┌─────────────────┐  ┌──────────────────────┐  │
│  │ Controllers  │→ │    Services     │→ │     Repositories     │  │
│  │ Auth/Chat/   │  │ Chat/Simulador/ │  │  JPA · 11 entidades  │  │
│  │ Simulador/   │  │ Progresso/Auth  │  │  Flyway migrations   │  │
│  │ Progresso/   │  └─────────────────┘  └──────────────────────┘  │
│  │ Lei/Artigo   │                                                   │
│  └──────────────┘  Spring Security · JWT · BCrypt · MapStruct      │
└──────────┬───────────────────────────────────────────┬─────────────┘
           │ HTTP (Groq API)                            │ JDBC
┌──────────▼──────────────┐              ┌─────────────▼─────────────┐
│  IA EXTERNA (Groq/Llama)│              │  PostgreSQL (prod)         │
│                         │              │  H2 em memoria (dev)       │
│  Prompt BD-only:        │              │                            │
│  - Artigos relevantes   │              │  11 tabelas:               │
│    injectados no        │              │  usuario, lei, artigo,     │
│    contexto ANTES da    │              │  categoria_crime,          │
│    resposta             │              │  caso_gerado_chat (NOVA),  │
│  - Nunca inventa        │              │  resultado_simulacao (NOVA)│
│    informacao           │              │  + 5 tabelas existentes    │
└─────────────────────────┘              └────────────────────────────┘
```
