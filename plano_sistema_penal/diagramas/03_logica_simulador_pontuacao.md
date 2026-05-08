# Diagrama 3 — Logica do Simulador e Pontuacao Proporcional

## Ecra 1 — Configuracao

```
┌──────────────────────────────────────────────────────┐
│  SIMULADOR PENAL                                     │
│                                                      │
│  Origem dos casos:                                   │
│  ● Meus casos do Chat (3 casos guardados)           │
│  ○ Casos aleatorios da Base de Dados                │
│                                                      │
│  Tipo de crime (so para modo aleatorio):            │
│  [x] Crimes contra a Vida                           │
│  [ ] Crimes contra a Integridade Fisica             │
│  [x] Crimes contra o Patrimonio                     │
│  [ ] Crimes contra a Honra                          │
│  [ ] Crimes contra a Familia                        │
│                                                      │
│  Quantidade:  [2]  [5]  [10]  [15]                  │
│                                                      │
│               [ Iniciar Simulacao ]                  │
└──────────────────────────────────────────────────────┘
```

## Ecra 2 — Quiz (por caso)

```
Caso 2 de 5   ████████░░░░░░░░  40%
─────────────────────────────────────────────────────

SITUACAO:
"Maria foi ameacada verbalmente pelo vizinho Joao
 durante uma discussao no corredor do predio."

PERGUNTA: Qual a qualificacao juridica correcta?

  ☐  A) Injuria — Art. 174.o CPA
  ☑  B) Ameaca — Art. 170.o CPA       ← seleccionado
  ☐  C) Difamacao — Art. 177.o CPA
  ☐  D) Violencia domestica — Art. 175.o CPA

  (Seleccione uma ou mais alternativas)

                    [ Validar Resposta ]
```

## Apos Validar — Feedback

```
CASO: Correctas eram B e C

Estudante marcou: B (correcto) + D (errado)

Calculo:
  alternativas_corretas = 2  (B e C)
  acertos = 1               (so B estava correcto)
  falsos_positivos = 1      (D estava errado)
  pontuacao = (1/2) * 100 = 50%

Painel de feedback:
┌──────────────────────────────────────────────┐
│ ⚠ Parcialmente correcto — 50%               │
│                                              │
│ Acertou: B) Ameaca (Art. 170.o)             │
│ Errou:   D) Violencia domestica             │
│ Faltou:  C) Difamacao agravada              │
│                                              │
│ Resposta completa:                          │
│ A situacao configura AMEACA (Art. 170.o)    │
│ E DIFAMACAO AGRAVADA (Art. 177.o n.o 2)    │
│ por ter sido feita na presenca de terceiro. │
│                                              │
│            [ Proximo Caso ]                 │
└──────────────────────────────────────────────┘
```

## Ecra 3 — Resultado Final

```
┌──────────────────────────────────────────────────────┐
│  RESULTADO DA SIMULACAO                             │
│                                                      │
│              73%                                     │
│         (media geral)                               │
│                                                      │
│  Acertos por caso:                                  │
│  Caso 1 — Homicidio:     ████████████░░░  80%      │
│  Caso 2 — Ameaca:        ██████░░░░░░░░░  50%      │
│  Caso 3 — Furto:         ████████████████ 100%     │
│  Caso 4 — Injuria:       ████████░░░░░░░  60%      │
│  Caso 5 — Viol.dom.:     ████████████░░░  80%      │
│                                                      │
│  ┌─────┬──────────────┬──────────┬────────┬──────┐ │
│  │  #  │ Tema         │ Marcou   │Correcta│  %   │ │
│  ├─────┼──────────────┼──────────┼────────┼──────┤ │
│  │  1  │ Homicidio    │ A,C      │ A,B,C  │  67% │ │
│  │  2  │ Ameaca       │ B,D      │ B,C    │  50% │ │
│  │  3  │ Furto        │ A,B      │ A,B    │ 100% │ │
│  └─────┴──────────────┴──────────┴────────┴──────┘ │
│                                                      │
│  [ Nova Simulacao ]    [ Ver Progresso ]             │
└──────────────────────────────────────────────────────┘
```

## Formula de Pontuacao

```
Para cada questao:
  pontuacao = (num_acertos / total_alternativas_corretas) * 100

Para a simulacao:
  pontuacao_final = media(pontuacoes de todos os casos)

Exemplos:
  3 correctas, acertou 3 → 100%
  3 correctas, acertou 2 →  67%
  3 correctas, acertou 1 →  33%
  2 correctas, acertou 2 → 100%
  2 correctas, acertou 1 →  50%
  1 correcta,  acertou 1 → 100%
  Qualquer caso, acertou 0 →  0%
```
