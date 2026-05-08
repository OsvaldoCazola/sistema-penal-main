# Diagrama 2 — Fluxo de Deteccao de Caso no Chat

```
Estudante envia mensagem
        │
        ▼
┌────────────────────────────────────────┐
│  ANALISE HEURISTICA (ChatService)     │
│                                        │
│  Critérios:                           │
│  ✓ Mensagem tem mais de 10 palavras?  │
│  ✓ Contem palavras-chave penais?      │
│    (agredido, ameacado, furtaram,     │
│     violencia, crime, acusado,        │
│     detido, preso, ofendido...)       │
└──────────────┬─────────────┬──────────┘
               │ Sim         │ Nao
               ▼             ▼
    ┌──────────────────┐  ┌────────────────────────┐
    │  Candidato a     │  │  Resposta simples       │
    │  caso penal      │  │  Envia a IA sem         │
    │  → adiciona      │  │  instrucao extra        │
    │  instrucao JSON  │  │  Nao guarda nada        │
    └────────┬─────────┘  └────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────┐
│  PROMPT ENVIADO A GROQ/LLAMA                      │
│                                                    │
│  [SISTEMA]                                        │
│  "Es um assistente juridico do CPA 2021.          │
│  Responde APENAS com base nos artigos abaixo.     │
│  Nunca inventes informacao."                      │
│                                                    │
│  [ARTIGOS RELEVANTES DA BD]                       │
│  Art. 170.o — Ameaca: ...                        │
│  Art. 174.o — Injuria: ...                       │
│                                                    │
│  [INSTRUCAO EXTRA]                                │
│  "Apos responder, devolve numa linha separada:    │
│   {'novo_caso': true/false, 'tema': '....',       │
│    'artigos': ['170', '174']}"                    │
│                                                    │
│  [MENSAGEM DO ESTUDANTE]                          │
│  "Fui ameacado pelo meu vizinho com uma faca."    │
└────────────────────┬───────────────────────────────┘
                     │
                     ▼
        IA devolve resposta + JSON
                     │
             ┌───────▼────────┐
             │ Parse do JSON  │
             │ novo_caso?     │
             └───┬─────┬──────┘
              true     false
               │         │
               ▼         ▼
    ┌──────────────┐  ┌───────────────────┐
    │ Guardar em   │  │ Resposta devolvida │
    │ caso_gerado_ │  │ ao frontend sem   │
    │ chat:        │  │ guardar nada      │
    │ - tema       │  └───────────────────┘
    │ - descricao  │
    │ - pergunta   │
    │ - resposta   │
    │ - artigos    │
    └──────┬───────┘
           │
           ▼
  Frontend mostra:
  ┌──────────────────────────────────┐
  │ Resposta da IA com badge:        │
  │ [BD · Art. 170.o CPA] [Novo caso│
  │                         guardado]│
  └──────────────────────────────────┘
```
