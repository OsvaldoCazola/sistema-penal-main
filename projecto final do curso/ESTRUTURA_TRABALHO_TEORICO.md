# ESTRUTURA DO TRABALHO DE CONCLUSÃO DE CURSO
## Sistema Web para Assistência na Aplicação do Direito Penal Angolano com Base em Fatos e Leis Vigentes

---

## 1. INTRODUÇÃO

### 1.1 Contextualização
A evolução tecnológica tem impactado diversas profissões, incluindo o Direito. Com o aumento da complexidade legislativa e do número de processos judiciais, torna-se difícil para os operadores jurídicos consultarem rapidamente toda a informação legal relevante. Esta dificuldade é mais acentuada em Angola, onde o acesso a bases de dados jurídicas estruturadas é limitado.

### 1.2 Problema
O aumento de processos judiciais e a complexidade das leis dificultam o trabalho jurídico em Angola, sobretudo devido ao acesso limitado à informação legal estruturada. A aplicação da inteligência artificial surge como uma possível solução, mas levanta dúvidas quanto à sua viabilidade e adequação à realidade angolana.

**Pergunta de Partida:** Será possível desenvolver um sistema inteligente que, treinado com as leis e jurisprudência angolanas, consiga fornecer orientações jurídicas fiáveis e relevantes para casos concretos?

### 1.3 Objetivos

**Objetivo Geral:**
Desenvolver um sistema inteligente de apoio jurídico capaz de identificar, com base em leis e jurisprudência angolanas, os enquadramentos legais e decisões semelhantes aplicáveis a casos concretos, contribuindo para a modernização e eficiência do sistema judicial em Angola.

**Objetivos Específicos:**
- Recolher, organizar e estruturar a legislação e jurisprudência angolana em formato digital
- Aplicar técnicas de Processamento de Linguagem Natural (PLN) para interpretar descrições de casos jurídicos
- Implementar um protótipo funcional capaz de sugerir leis e decisões judiciais semelhantes
- Implementar um simulador de penas com cálculo automático
- Desenvolver um módulo de jurisprudência para apoio à decisão
- Criar um sistema de gestão de processos judiciais

### 1.4 Justificativa
O sistema proposto justifica-se pela necessidade de:
- Modernizar o sistema judicial angolano
- Facilitrar o acesso à informação jurídica
- Apoiar a tomada de decisão pelos operadores jurídicos
- Reduzir o tempo de análise de casos
- Garantir maior consistência nas decisões judiciais

### 1.5 Delimitação
O estudo delimita-se ao:
- Direito Penal angolano (Código Penal, Lei 3/99, Lei 25/11, etc.)
- Legislação vigente até 2025
- Casos simples em linguagem natural
- Técnicas de PLN (TF-IDF, similaridade semântica)
- Protótipo funcional web

---

## 2. REVISÃO DA LITERATURA / FUNDAMENTAÇÃO TEÓRICA

### 2.1 Inteligência Artificial e Direito
(Ashley, 2017; Bench-Capon & Sartor, 2003; Russell & Norvig, 2021)

#### 2.1.1 Histórico da IA no Direito
- Sistemas baseados em regras (1970s-1980s)
- Sistemas baseados em casos (1990s)
- Machine Learning no Direito (2000s-presente)
- Large Language Models (atual)

#### 2.1.2 Aplicações da IA no Direito
- Legal analytics
- Predictive coding
- Chatbots jurídicos
- Assistentes de pesquisa
- Sistemas de suporte à decisão

### 2.2 Processamento de Linguagem Natural (PLN)
(Jurafsky & Martin, 2020)

#### 2.2.1 Conceitos Fundamentais
- Tokenização
- Stopwords
- TF-IDF (Term Frequency-Inverse Document Frequency)
- Similaridade cosseno
- Embeddings semânticos

#### 2.2.2 PLN no Contexto Jurídico
- Extração de informações legais
- Classificação de documentos
- Busca semântica
- Resumo automático

### 2.3 Sistema Jurídico Angolano

#### 2.3.1 Fontes do Direito Penal Angolano
- Constituição da República de Angola
- Código Penal de Angola (Lei 38/2020)
- Lei 3/99 (Tráfico de Drogas)
- Lei 25/11 (Violência Doméstica)
- Código de Processo Penal

#### 2.3.2 Estrutura Judiciária
- Tribunal Supremo
- Tribunais Superiores de Justiça
- Tribunais Provinciais
- Tribunais Municipais

### 2.4 Trabalhos Relacionados
- Sistemas de apoio à decisão judicial
- Bases de dados jurisprudenciais
- Sistemas de busca semântica jurídica

---

## 3. METODOLOGIA

### 3.1 Tipo de Pesquisa
- Pesquisa aplicada
- Abordagem qualitativa e tecnológica
- Desenvolvimento de protótipo

### 3.2 Fases da Pesquisa

#### Fase 1: Levantamento de Requisitos
- Análise do sistema judicial angolano
- Identificação de necessidades dos operadores jurídicos
- Levantamento de legislação aplicável

#### Fase 2: Análise e Modelação
- Modelagem de dados jurídicos
- Definição da arquitetura do sistema
- Projeto de banco de dados

#### Fase 3: Desenvolvimento
- Implementação do backend (Java/Spring Boot)
- Implementação do frontend (React/Next.js)
- Integração de módulos de IA

#### Fase 4: Testes e Validação
- Testes unitários
- Testes de integração
- Avaliação com casos de estudo

### 3.3 Tecnologias Utilizadas

#### Backend
- Java 17
- Spring Boot 3.x
- JPA/Hibernate
- PostgreSQL

#### Frontend
- React
- Next.js
- TypeScript
- Tailwind CSS

#### IA/PLN
- TF-IDF
- Similaridade cosseno
- Busca semântica

---

## 4. DESENVOLVIMENTO / RESULTADOS

### 4.1 Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                      │
├─────────────────────────────────────────────────────────────┤
│  Dashboard | Processos | Busca | Simulador | Jurisprudência│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Spring Boot)                    │
├─────────────────────────────────────────────────────────────┤
│  Controllers | Services | DTOs | Security                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BANCO DE DADOS                           │
├─────────────────────────────────────────────────────────────┤
│  Processo | Lei | Artigo | Sentença | TipoCrime | Usuario │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Módulos Implementados

#### 4.2.1 Módulo de Gestão de Processos
- Cadastro de processos judiciais
- Acompanhamento de andamentos
- Timeline de movimentações
- Gestão de usuários e permissões

#### 4.2.2 Módulo de Legislação
- Cadastro de leis e artigos
- Controle de versões
- Busca semântica
- Indexação automática

#### 4.2.3 Módulo de Busca Jurídica (IA)
- Busca por similaridade (TF-IDF)
- Análise de casos
- Sugestão de leis aplicáveis
- Categorização automática

#### 4.2.4 Módulo de Simulador de Penas
- Cálculo de pena base
- Aplicação de agravantes
- Aplicação de atenuantes
- Determinação de regime
- Geração de justificativa

#### 4.2.5 Módulo de Jurisprudência
- Base de decisões judiciais
- Busca por palavras-chave
- Estatísticas de decisões
- Média de penas por crime

#### 4.2.6 Módulo de Previsão de Sentenças
- Análise de tendências
- Predição de resultados
- Coerência decisória

#### 4.2.7 Módulo de Modo Estudo
- Casos práticos
- Questões de avaliação
- Correção automática

#### 4.2.8 Módulo de Chat IA
- Assistente virtual
- Dúvidas sobre legislação
- Suporte em tempo real

### 4.3 Casos de Estudo Implementados
1. Homicídio Simples - Caso Luanda
2. Roubo com Uso de Arma - Caso Benguela
3. Tráfico de Droga - Caso do Porto de Luanda
4. Peculato e Corrupção - Caso Hospital Público
5. Violência Doméstica - Caso do Huambo
6. Abuso Sexual de Menor - Caso da Escola
7. Burla Qualificada - Caso do Investimento
8. Furto em Estabelecimento Comercial - Caso Shopping

---

## 5. DISCUSSÃO DOS RESULTADOS

### 5.1 Avaliação do Sistema
- Correção na identificação de enquadramentos legais
- Eficiência na busca semântica
- Precisão do simulador de penas
- Usabilidade da interface

### 5.2 Limitações
- Base de dados jurisprudenciais limitada
- Modelo de IA básico (sem deep learning)
- Necessidade de expansão para outras áreas do direito

### 5.3 Contribuições
- Protótipo funcional de sistema de apoio jurídico
- Base de dados de legislação angolana
- Metodologia de implementação para contextos similares

---

## 6. CONCLUSÕES E TRABALHOS FUTUROS

### 6.1 Conclusões
O sistema desenvolvido demonstra a viabilidade de implementar um sistema de apoio à decisão jurídica em Angola, utilizando técnicas de PLN para busca semântica e análise de casos.

### 6.2 Trabalhos Futuros
- Integração com modelos de linguagem de grande escala (LLM)
- Expansão para outras áreas do direito
- Melhoria da base de jurisprudência
- Integração com sistemas judiciais existentes
- Implementação de aprendizagem contínua

---

## REFERÊNCIAS BIBLIOGRÁFICAS

Ashley, K. D. (2017). *Artificial Intelligence and Legal Analytics: New Tools for Law Practice in the Digital Age*. Cambridge University Press.

Bench-Capon, T. J. M., & Sartor, G. (2003). A model of legal reasoning with cases incorporating theories and values. *Artificial Intelligence*, 150(1-2), 97-143. https://doi.org/10.1016/S0004-3702(03)00103-4

Bench-Capon, T. J. M. (1991). *Knowledge-based systems and legal applications*. Academic Press.

Carreiro, P. (2019). A aplicação da inteligência artificial no Direito: Riscos e oportunidades. *Revista Jurídica Luso-Brasileira*, 5(3), 1223-1245.

Comissão da União Africana. (2020). *Estratégia de Transformação Digital para África (2020-2030)*. União Africana.

Feigenbaum, E. A., & Feldman, J. (1995). *The Handbook of Artificial Intelligence*. Morgan Kaufmann.

Hafner, C. D., & Berman, D. H. (2002). The role of context in case-based legal reasoning: teleological, temporal, and procedural. *Artificial Intelligence and Law*, 10(1-3), 19-64.

Jurafsky, D., & Martin, J. H. (2020). *Speech and Language Processing* (3rd ed.). Stanford University. https://web.stanford.edu/~jurafsky/slp3/

Lemos, M. M., & Cruz, F. J. (2020). Sistemas inteligentes e decisões judiciais: Uma análise da viabilidade de aplicação da IA no Direito brasileiro e africano. *Revista de Direito e Tecnologia*, 12(1), 89-108.

McCarty, L. T. (1977). Reflections on TAXMAN: An Experiment in Artificial Intelligence and Legal Reasoning. *Harvard Law Review*, 90(5), 837-893.

Russell, S. J., & Norvig, P. (2021). *Inteligência Artificial* (4.ª ed.). Pearson.

Sartor, G. (2009). *Legal Reasoning: A Cognitive Approach to the Law*. Springer.

Silva, A. C., & Ribeiro, R. (2021). Inteligência artificial e Direito: A era dos julgamentos automatizados. *Revista Brasileira de Políticas Públicas*, 11(2), 47-66. https://doi.org/10.5102/rbpp.v11i2.7008

Surden, H. (2014). Machine Learning and Law. *Washington Law Review*, 89(1), 87-115.

---

## ANEXOS

### Anexo A: Manual de Utilização do Sistema
### Anexo B: Diagramas de Arquitetura
### Anexo C: Código Fonte (em CD-ROM)
### Anexo D: Casos de Teste Utilizados

---

## RESUMO

**CAVUNGE, O. C.** Sistema Web para Assistência na Aplicação do Direito Penal Angolano com Base em Fatos e Leis Vigentes. 2025. Trabalho de Conclusão de Curso (Graduação em Engenharia Informática) - Faculdade de Engenharia, Universidade Agostinho Neto, Luanda.

**Palavras-chave:** Inteligência Artificial, Direito Penal, Angola, Processamento de Linguagem Natural, Sistemas de Apoio à Decisão.

---

**Nota:** Esta estrutura deve ser adaptada conforme as normas específicas da sua universidade e orientação do professor.