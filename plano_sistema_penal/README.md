# Sistema Penal Angola — Plano de Implementacao v2.0

## Conteudo deste pacote

```
plano_sistema_penal/
├── Plano_Sistema_Penal_Angola.docx   ← Documento Word completo (10 seccoes)
├── sql/
│   ├── V2__add_chat_simulador_tables.sql  ← Migracao Flyway (2 novas tabelas)
│   └── dados_iniciais.sql                 ← Categorias CPA + artigos fundamentais
├── diagramas/
│   ├── 01_arquitectura_geral.md
│   ├── 02_fluxo_chat_deteccao_caso.md
│   └── 03_logica_simulador_pontuacao.md
└── README.md                              ← Este ficheiro
```

---

## Resumo Executivo

O sistema passa de uma aplicacao de consulta juridica basica para uma
**plataforma de aprendizagem activa** com tres camadas integradas:

1. **Chat IA** — responde exclusivamente com artigos do CPA e detecta
   automaticamente quando o estudante descreve uma situacao penal concreta,
   guardando-a como caso de estudo.

2. **Simulador** — quiz com alternativas multiplas, seleccao por tipo de
   crime do CPA, pontuacao proporcional e feedback imediato com artigo correcto.

3. **Progresso** — graficos de evolucao temporal e por tipo de crime,
   historico detalhado de cada simulacao.

---

## O que e NOVO vs o que JA EXISTE

### Ja existe (manter)
- Autenticacao JWT (login/logout)
- CRUD de leis e artigos (admin)
- Tabelas: usuario, lei, artigo, categoria_crime, caso_simulado, pergunta_caso,
  progresso_estudante, resposta_estudante, simulacao

### Novo (criar)
- Tabela `caso_gerado_chat` — casos detectados no chat
- Tabela `resultado_simulacao` — resultados do quiz
- `ChatService` — logica de deteccao heuristica + prompt BD-only
- `SimuladorController` + `SimuladorService` — quiz completo
- `ProgressoController` refactored — metricas agregadas para graficos
- 4 paginas frontend reescritas: chat, simulador (3 ecras), progresso, legislacao

---

## Como Aplicar a Migracao

1. Copiar `sql/V2__add_chat_simulador_tables.sql` para:
   `src/main/resources/db/migration/`

2. O Flyway aplica automaticamente ao iniciar a aplicacao.

3. Executar `sql/dados_iniciais.sql` manualmente ou via DataInitializer.java
   (apenas uma vez, verificar que a tabela categoria_crime esta vazia primeiro).

---

## Prioridade de Implementacao

| Fase | O que fazer                              | Dias |
|------|------------------------------------------|------|
| 0    | Setup BD + Flyway V2                     | 1    |
| 1    | Entidades JPA + repositorios             | 1    |
| 2    | Autenticacao JWT                         | 1    |
| 3    | Legislacao (accordion + pesquisa)        | 2    |
| 4    | Chat (prompt BD-only + deteccao caso)    | 3    |
| 5    | Simulador (3 ecras + pontuacao)          | 4    |
| 6    | Progresso (graficos Recharts)            | 2    |
| 7    | Integracao Chat → Simulador              | 1    |
| 8    | Testes + deploy                          | 1    |
|      | **Total**                                | **14** |

---

## Dependencias Frontend (adicionar ao package.json)

```json
"recharts": "^2.12.0"
```

As restantes (axios, zustand, react-hook-form, zod) ja devem estar instaladas.

---

## Notas Importantes

- A IA nunca responde com informacao da internet. O prompt inclui
  SEMPRE os artigos relevantes da BD como contexto.
- O modo "Meus casos do Chat" no simulador so aparece se o estudante
  tiver pelo menos 1 caso guardado na tabela `caso_gerado_chat`.
- A pontuacao e calculada por alternativa correcta, nao por questao inteira
  (ex: 2 de 3 correctas = 66.67%, nao 0% nem 100%).
- O campo `simulacao_id` em `resultado_simulacao` e gerado no frontend
  (UUID v4) ao iniciar cada rodada e enviado com cada resposta.

---

*Gerado automaticamente — Sistema Penal Angola v2.0*
