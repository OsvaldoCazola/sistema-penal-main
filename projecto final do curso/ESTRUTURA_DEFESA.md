# SISTEMA INTELIGENTE DE APOIO À APLICAÇÃO DO DIREITO PENAL ANGOLANO

## Versão para Defesa de Final de Curso

---

# 1. INTRODUÇÃO

## 1.1 Contextualização
A evolução tecnológica tem impactado diversas profissões, incluindo o Direito. Com o aumento da complexidade legislativa e do número de processos judiciais, torna-se difícil para os operadores jurídicos consultarem rapidamente toda a informação legal relevante. Esta dificuldade é mais acentuada em Angola, onde o acesso a bases de dados jurídicas estruturadas é limitado.

## 1.2 Problema de Pesquisa
**Como a Inteligência Artificial pode auxiliar juristas na correta aplicação do Direito Penal Angolano com base nos fatos apresentados?**

## 1.3 Objetivos

**Geral:**
Desenvolver um sistema inteligente de apoio jurídico capaz de identificar, com base em leis e jurisprudência angolanas, os enquadramentos legais e decisões semelhantes aplicáveis a casos concretos.

**Específicos:**
- Estruturar a legislação penal angolana em formato digital
- Implementar técnicas de PLN para análise de casos
- Desenvolver um assistente virtual jurídico
- Criar sistema de explicabilidade das sugestões

---

# 2. FUNDAMENTAÇÃO TEÓRICA

## 2.1 Inteligência Artificial no Direito
- Ashley (2017) - Artificial Intelligence and Legal Analytics
- Bench-Capon & Sartor (2003) - Model of Legal Reasoning
- Russell & Norvig (2021) - Inteligência Artificial

## 2.2 Processamento de Linguagem Natural
- TF-IDF (Term Frequency-Inverse Document Frequency)
- Similaridade Cosseno
- Busca Semântica

## 2.3 Direito Penal Angolano
- Código Penal de Angola (Lei 38/2020)
- Lei 3/99 - Tráfico de Drogas
- Lei 25/11 - Violência Doméstica

---

# 3. METODOLOGIA

## 3.1 Abordagem
- Pesquisa aplicada
- Desenvolvimento de protótipo
- Avaliação qualitativa

## 3.2 Tecnologias
- **Backend:** Java + Spring Boot
- **Frontend:** React + Next.js
- **Banco de Dados:** PostgreSQL
- **IA:** PLN (TF-IDF, Similaridade Semântica)

---

# 4. DESENVOLVIMENTO

## 4.1 Arquitetura do Sistema

```
┌────────────────────────────────────────────────────┐
│                  FRONTEND (Next.js)                │
│   Interface Web Responsiva                         │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────┐
│                  BACKEND (Spring Boot)            │
│   API RESTful | Segurança JWT | Serviços           │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────┐
│              BASE DE DADOS (PostgreSQL)           │
│   Leis | Artigos | Casos | Sentenças             │
└────────────────────────────────────────────────────┘
```

## 4.2 Módulos Principais

### 🔹 Módulo 1: Repositório de Leis
- Armazenamento do Código Penal Angolano
- Busca por palavras-chave
- Versionamento de leis
- Pesquisa por artigo

### 🔹 Módulo 2: Analisador Automático de Casos (NLP)
**Entrada:** Texto livre com fatos do caso

**Saída:**
- Artigos sugeridos
- Faixa de pena
- Justificativa textual

**Exemplo Demonstrável:**
```
Entrada: "Roubo com uso de arma branca"

Saída:
- Artigo 404 CP (Roubo Qualificado)
- Pena: 2 a 8 anos
- Justificativa: "Detectado termo 'arma branca' 
  associado a agravante de violência"
```

### 🔹 Módulo 3: Chat Jurídico Inteligente
- Responde perguntas sobre artigos
- Explica penas em linguagem simples
-Cita artigos automaticamente

### 🔹 Módulo 4: Explicabilidade da IA
Todas as sugestões mostram:
- Palavras que ativaram a decisão
- Artigo associado
- Regra aplicada

### 🔹 Módulo 5: Modo Estudo
- Casos simulados
- Estudante escolhe artigo
- Sistema compara com sugestão da IA
- Feedback explicativo

---

# 5. CASOS DE ESTUDO IMPLEMENTADOS

| # | Caso | Tipo Crime |
|---|------|------------|
| 1 | Homicídio Simples - Luanda | Art. 349 CP |
| 2 | Roubo com Arma - Benguela | Art. 404 CP |
| 3 | Tráfico de Droga - Porto de Luanda | Lei 3/99 |
| 4 | Peculato - Hospital Público | Art. 360 CP |
| 5 | Violência Doméstica - Huambo | Lei 25/11 |
| 6 | Abuso Sexual - Escola | Art. 393 CP |
| 7 | Burla - Investimento | Art. 409 CP |
| 8 | Furto - Shopping | Art. 399 CP |

---

# 6. RESULTADOS ESPERADOS

## 6.1 Funcionalidades Demonstráveis
✅ Busca de leis por palavras-chave
✅ Análise automática de casos com IA
✅ Sugestão de artigos aplicáveis
✅ Cálculo de faixa de pena
✅ Justificativa automática
✅ Chat jurídico interativo
✅ Sistema de estudo com casos

## 6.2 Inovações
- Primeira base de dados jurídica estruturada para Angola
- Aplicação de PLN para análise de casos penais
- Sistema de explicabilidade para decisões de IA

---

# 7. CONCLUSÕES

## 7.1 Contribuições
- Protótipo funcional de sistema de apoio jurídico
- Base de dados de legislação angolana
- Metodologia replicável para outros países

## 7.2 Limitações
- Modelo de IA básico (TF-IDF)
- Base de jurisprudência limitada
- Não substitui o julgamento humano

## 7.3 Trabalhos Futuros
- Integração com LLMs
- Expansão para outras áreas do direito
- Maior base de jurisprudência

---

# REFERÊNCIAS

Ashley, K. D. (2017). Artificial Intelligence and Legal Analytics. Cambridge University Press.

Bench-Capon, T. J. M., & Sartor, G. (2003). A model of legal reasoning with cases incorporating theories and values. Artificial Intelligence, 150(1-2), 97-143.

Russell, S. J., & Norvig, P. (2021). Inteligência Artificial (4.ª ed.). Pearson.

Jurafsky, D., & Martin, J. H. (2020). Speech and Language Processing (3rd ed.). Stanford University.

Silva, A. C., & Ribeiro, R. (2021). Inteligência artificial e Direito: A era dos julgamentos automatizados. Revista Brasileira de Políticas Públicas, 11(2), 47-66.

Lemos, M. M., & Cruz, F. J. (2020). Sistemas inteligentes e decisões judiciais. Revista de Direito e Tecnologia, 12(1), 89-108.

---

# RESUMO

**Título:** Sistema Inteligente de Apoio à Aplicação do Direito Penal Angolano

**Problema:** Como a IA pode auxiliar juristas na aplicação correta do Direito Penal Angolano?

**Solução:** Sistema web com:
- Repositório de leis com busca semântica
- Analisador automático de casos (NLP)
- Chat jurídico inteligente
- Explicabilidade das decisões de IA
- Modo estudo pedagógico

**Tecnologias:** Java, Spring Boot, React, Next.js, PostgreSQL, TF-IDF

**Valor:** Apoio à decisão jurídica, não substituição do julgamento humano

---

*Trabalho de Conclusão de Curso - Engenharia Informática*
*Universidade Agostinho Neto - Luanda, 2025*
