const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  PageBreak, LevelFormat, TabStopType, TabStopPosition
} = require('docx');
const fs = require('fs');

const BLUE_DARK = "1F3864";
const BLUE_MED  = "2E5FAA";
const BLUE_LIGHT= "D5E8F0";
const GRAY_LIGHT = "F5F5F5";
const GREEN_LIGHT = "E8F5E9";
const ORANGE_LIGHT = "FFF3E0";
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text, bold: true, size: 36, color: BLUE_DARK, font: "Arial" })]
  });
}
function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, bold: true, size: 28, color: BLUE_MED, font: "Arial" })]
  });
}
function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, size: 24, color: BLUE_MED, font: "Arial" })]
  });
}
function p(text, options = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, size: 22, font: "Arial", ...options })]
  });
}
function bullet(text, bold = false) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, size: 22, font: "Arial", bold })]
  });
}
function subbullet(text) {
  return new Paragraph({
    numbering: { reference: "subbullets", level: 1 },
    spacing: { before: 20, after: 20 },
    children: [new TextRun({ text, size: 20, font: "Arial" })]
  });
}
function spacer() {
  return new Paragraph({ spacing: { before: 60, after: 60 }, children: [new TextRun("")] });
}
function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}
function infoBox(title, lines, fillColor = BLUE_LIGHT) {
  const rows = [
    new TableRow({
      children: [new TableCell({
        borders,
        width: { size: 9360, type: WidthType.DXA },
        shading: { fill: "2E5FAA", type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 160, right: 160 },
        children: [new Paragraph({ children: [new TextRun({ text: title, bold: true, size: 22, color: "FFFFFF", font: "Arial" })] })]
      })]
    }),
    ...lines.map(line => new TableRow({
      children: [new TableCell({
        borders,
        width: { size: 9360, type: WidthType.DXA },
        shading: { fill: fillColor, type: ShadingType.CLEAR },
        margins: { top: 60, bottom: 60, left: 160, right: 160 },
        children: [new Paragraph({ spacing: { before: 30, after: 30 }, children: [new TextRun({ text: line, size: 20, font: "Arial" })] })]
      })]
    }))
  ];
  return new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: [9360], rows });
}

function simpleTable(headers, rows, colWidths) {
  const totalW = colWidths.reduce((a,b) => a+b, 0);
  const headerRow = new TableRow({
    children: headers.map((h, i) => new TableCell({
      borders,
      width: { size: colWidths[i], type: WidthType.DXA },
      shading: { fill: "2E5FAA", type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 120, right: 120 },
      children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 20, color: "FFFFFF", font: "Arial" })] })]
    }))
  });
  const dataRows = rows.map((row, ri) => new TableRow({
    children: row.map((cell, i) => new TableCell({
      borders,
      width: { size: colWidths[i], type: WidthType.DXA },
      shading: { fill: ri % 2 === 0 ? GRAY_LIGHT : "FFFFFF", type: ShadingType.CLEAR },
      margins: { top: 60, bottom: 60, left: 120, right: 120 },
      children: [new Paragraph({ spacing: { before: 20, after: 20 }, children: [new TextRun({ text: cell, size: 20, font: "Arial" })] })]
    }))
  }));
  return new Table({ width: { size: totalW, type: WidthType.DXA }, columnWidths: colWidths, rows: [headerRow, ...dataRows] });
}

function codeBlock(lines) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({
      children: [new TableCell({
        borders,
        width: { size: 9360, type: WidthType.DXA },
        shading: { fill: "1E1E1E", type: ShadingType.CLEAR },
        margins: { top: 120, bottom: 120, left: 200, right: 200 },
        children: lines.map(l => new Paragraph({
          spacing: { before: 20, after: 20 },
          children: [new TextRun({ text: l, size: 18, font: "Courier New", color: "D4D4D4" })]
        }))
      })]
    })]
  });
}

const doc = new Document({
  numbering: {
    config: [
      { reference: "bullets", levels: [
        { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }
      ]},
      { reference: "subbullets", levels: [
        { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        { level: 1, format: LevelFormat.BULLET, text: "–", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1080, hanging: 360 } } } }
      ]},
      { reference: "numbers", levels: [
        { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }
      ]}
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: BLUE_DARK },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: BLUE_MED },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: BLUE_MED },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [

      // === CAPA ===
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 1200, after: 200 },
        children: [new TextRun({ text: "SISTEMA WEB DE APOIO AO ESTUDO", bold: true, size: 52, color: BLUE_DARK, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 100 },
        children: [new TextRun({ text: "DO DIREITO PENAL ANGOLANO", bold: true, size: 52, color: BLUE_DARK, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 200 },
        children: [new TextRun({ text: "Plano Completo de Implementacao", bold: true, size: 32, color: BLUE_MED, font: "Arial" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 600 },
        children: [new TextRun({ text: "Versao Final — Backend · Frontend · Base de Dados · Telas", size: 24, color: "666666", font: "Arial" })]
      }),
      new Table({
        width: { size: 9026, type: WidthType.DXA },
        columnWidths: [9026],
        rows: [new TableRow({ children: [new TableCell({
          borders: noBorders,
          shading: { fill: BLUE_LIGHT, type: ShadingType.CLEAR },
          margins: { top: 200, bottom: 200, left: 300, right: 300 },
          children: [
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Tecnologias: Next.js 15 + Spring Boot 4.0.2 + PostgreSQL + Groq IA", size: 22, font: "Arial", color: BLUE_DARK })] }),
            spacer(),
            new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Foco exclusivo: Codigo Penal Angolano (CPA 2021)", size: 22, font: "Arial", bold: true, color: BLUE_DARK })] }),
          ]
        })] })]
      }),
      pageBreak(),

      // === 1. VISAO GERAL ===
      h1("1. Visao Geral do Sistema"),
      p("O sistema e uma plataforma web de apoio ao estudo do Direito Penal Angolano, composta por quatro modulos principais interligados. O objetivo e que o estudante aprenda de forma activa: conversa com a IA no chat, e testado no simulador, acompanha o progresso com graficos e consulta a legislacao organizada."),
      spacer(),
      infoBox("Quatro modulos principais", [
        "1. Chat IA — Assistente juridico baseado exclusivamente no CPA. Detecta novos casos e guarda-os automaticamente.",
        "2. Simulador — Quiz com casos do chat ou aleatorios da BD. Selecao por tipo de crime. Pontuacao proporcional.",
        "3. Progresso — Graficos de evolucao temporal e desempenho por tipo de crime. Historico detalhado.",
        "4. Legislacao — Todos os artigos do CPA organizados por tipo de crime. Apenas visualizacao para o estudante.",
      ]),
      spacer(),
      h2("1.1 Fluxo de Utilizacao"),
      p("O estudante usa o chat para descrever uma situacao real (ex: 'Fui ameacado por um vizinho'). O sistema detecta que e um novo caso penal, a IA responde com base nos artigos do CPA, e o caso e guardado automaticamente na base de dados associado ao estudante."),
      p("Depois no simulador, o estudante pode escolher 'Meus casos do Chat' para ser avaliado exactamente sobre os cenarios que descreveu, ou escolher casos aleatorios filtrados por tipo de crime. O progresso de todas as simulacoes e registado e apresentado com graficos."),

      pageBreak(),

      // === 2. ARQUITECTURA ===
      h1("2. Arquitectura Tecnica"),
      h2("2.1 Stack Tecnologica"),
      simpleTable(
        ["Camada", "Tecnologia", "Versao", "Finalidade"],
        [
          ["Frontend", "Next.js + TypeScript", "15.x", "Interface web"],
          ["Frontend", "Tailwind CSS", "3.4", "Estilizacao"],
          ["Frontend", "Zustand", "4.5", "Estado global"],
          ["Frontend", "Recharts", "2.12", "Graficos de progresso"],
          ["Frontend", "Axios", "1.7", "Chamadas HTTP"],
          ["Frontend", "React Hook Form + Zod", "Latest", "Formularios e validacao"],
          ["Backend", "Spring Boot", "4.0.2", "Framework Java"],
          ["Backend", "Java", "17", "Linguagem"],
          ["Backend", "Spring Security + JWT", "Latest", "Autenticacao"],
          ["Backend", "Spring Data JPA", "Latest", "Persistencia"],
          ["Backend", "Flyway", "Latest", "Migracoes BD"],
          ["Backend", "MapStruct + Lombok", "Latest", "Reducao boilerplate"],
          ["BD Dev", "H2 (em memoria)", "Latest", "Desenvolvimento/testes"],
          ["BD Prod", "PostgreSQL", "15+", "Producao"],
          ["IA", "Groq API (Llama)", "Latest", "Chat juridico"],
        ],
        [2400, 2400, 1560, 2800]
      ),
      spacer(),
      h2("2.2 Comunicacao entre Camadas"),
      bullet("Frontend → Backend: REST/JSON com autenticacao JWT no header Authorization"),
      bullet("Backend → BD: JPA/Hibernate com migracoes Flyway versionadas"),
      bullet("Backend → IA: chamada HTTP para Groq API com prompt contendo artigos relevantes da BD"),
      bullet("Seguranca: BCrypt para passwords, CORS configurado por origens, JWT com expiracao"),

      pageBreak(),

      // === 3. BASE DE DADOS ===
      h1("3. Base de Dados — 11 Tabelas"),
      p("A base de dados e gerida pelo Flyway. Em desenvolvimento usa H2 em memoria. Em producao usa PostgreSQL. As duas tabelas marcadas como NOVAS sao adicionadas ao schema existente via nova migracao Flyway."),
      spacer(),
      h2("3.1 Tabelas Existentes (a manter/ajustar)"),
      simpleTable(
        ["Tabela", "Descricao", "Ajuste necessario"],
        [
          ["usuario", "Utilizadores com role ADMIN ou ESTUDANTE", "Nenhum — manter como esta"],
          ["lei", "Leis cadastradas (CPA 2021)", "Nenhum"],
          ["artigo", "Artigos da lei com pena e categoria", "Adicionar campo busca_texto para pesquisa full-text"],
          ["categoria_crime", "Tipos de crime do CPA", "Popular com categorias corretas do CPA"],
          ["caso_simulado", "Casos pre-definidos pelo admin", "Opcional — pode coexistir"],
          ["pergunta_caso", "Perguntas dos casos pre-definidos", "Opcional"],
          ["progresso_estudante", "Progresso em casos pre-definidos", "Opcional"],
          ["resposta_estudante", "Respostas dadas em casos pre-definidos", "Opcional"],
          ["simulacao", "Historico antigo de simulacao livre", "Manter por compatibilidade"],
        ],
        [2200, 3600, 3560]
      ),
      spacer(),
      h2("3.2 Novas Tabelas (migracao Flyway V2)"),
      spacer(),
      h3("Tabela: caso_gerado_chat"),
      p("Guarda cada caso penal identificado automaticamente no chat. Cada linha representa uma situacao real descrita pelo estudante, com a pergunta de quiz gerada e a resposta correcta com artigo."),
      spacer(),
      codeBlock([
        "CREATE TABLE caso_gerado_chat (",
        "    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),",
        "    usuario_id      UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,",
        "    tema            VARCHAR(255),        -- ex: 'Ameaca', 'Violencia domestica'",
        "    descricao       TEXT NOT NULL,        -- o que o estudante escreveu no chat",
        "    pergunta_quiz   TEXT NOT NULL,        -- pergunta gerada pela IA",
        "    resposta_correta TEXT NOT NULL,       -- resposta completa com artigo CPA",
        "    artigos_usados  TEXT,                 -- lista: '170,175,176'",
        "    ativo           BOOLEAN DEFAULT TRUE,",
        "    criado_em       TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        ");",
        "",
        "CREATE INDEX idx_caso_chat_usuario ON caso_gerado_chat(usuario_id);",
        "CREATE INDEX idx_caso_chat_ativo ON caso_gerado_chat(usuario_id, ativo);",
      ]),
      spacer(),
      h3("Tabela: resultado_simulacao"),
      p("Regista cada resposta dada numa simulacao. O campo simulacao_id agrupa todas as respostas de uma mesma rodada (sessao). Permite calcular pontuacoes por simulacao, por caso e por tipo de crime."),
      spacer(),
      codeBlock([
        "CREATE TABLE resultado_simulacao (",
        "    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),",
        "    usuario_id           UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,",
        "    simulacao_id         UUID NOT NULL,   -- UUID gerado no inicio de cada rodada",
        "    caso_id              UUID REFERENCES caso_gerado_chat(id),",
        "    respostas_dadas      TEXT,            -- JSON: ['A','C']",
        "    alternativas_corretas INTEGER,        -- total de alternativas certas na questao",
        "    acertos              INTEGER,         -- quantas o estudante acertou",
        "    pontuacao            DECIMAL(5,2),    -- percentual 0.00 a 100.00",
        "    tipo_crime           VARCHAR(100),    -- ex: 'Crimes contra a Vida'",
        "    origem               VARCHAR(20),     -- 'CHAT' ou 'ALEATORIO'",
        "    concluido_em         TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
        ");",
        "",
        "CREATE INDEX idx_res_sim_usuario ON resultado_simulacao(usuario_id);",
        "CREATE INDEX idx_res_sim_rodada ON resultado_simulacao(simulacao_id);",
        "CREATE INDEX idx_res_sim_tipo ON resultado_simulacao(usuario_id, tipo_crime);",
      ]),
      spacer(),
      h2("3.3 Dados Iniciais (DataInitializer.java)"),
      p("O DataInitializer deve criar os seguintes dados de base ao iniciar a aplicacao pela primeira vez:"),
      bullet("2 utilizadores: admin@sistema.ao / Admin@2024! (ADMIN) e estudante@univ.ao / Est@2024! (ESTUDANTE)"),
      bullet("6 categorias de crime: Crimes contra a Vida, Crimes contra a Integridade Fisica, Crimes contra a Honra, Crimes contra o Património, Crimes contra a Familia, Crimes contra a Saude Publica"),
      bullet("1 lei: Codigo Penal Angolano, ano 2021, status VIGENTE"),
      bullet("Minimo 30 artigos fundamentais do CPA, cada um com categoria_id e pena_min/max"),

      pageBreak(),

      // === 4. BACKEND ===
      h1("4. Backend — Spring Boot"),
      h2("4.1 Estrutura de Pacotes"),
      codeBlock([
        "src/main/java/ao/sistema/penal/",
        "├── config/",
        "│   ├── SecurityConfig.java",
        "│   ├── JwtConfig.java",
        "│   ├── CorsConfig.java",
        "│   └── DataInitializer.java",
        "├── controller/",
        "│   ├── AuthController.java",
        "│   ├── ChatController.java          ← MODIFICAR",
        "│   ├── SimuladorController.java     ← CRIAR",
        "│   ├── ProgressoController.java     ← MODIFICAR",
        "│   ├── LeiController.java",
        "│   ├── ArtigoController.java",
        "│   └── UsuarioController.java",
        "├── service/",
        "│   ├── ChatService.java             ← MODIFICAR (deteccao de caso + prompt BD)",
        "│   ├── SimuladorService.java        ← CRIAR",
        "│   ├── ProgressoService.java        ← MODIFICAR",
        "│   └── AuthService.java",
        "├── domain/",
        "│   ├── entity/",
        "│   │   ├── CasoGeradoChat.java      ← CRIAR",
        "│   │   ├── ResultadoSimulacao.java  ← CRIAR",
        "│   │   └── ... (entidades existentes)",
        "│   └── repository/",
        "│       ├── CasoGeradoChatRepository.java  ← CRIAR",
        "│       ├── ResultadoSimulacaoRepository.java ← CRIAR",
        "│       └── ... (repos existentes)",
        "└── dto/",
        "    ├── ChatRequestDTO.java",
        "    ├── ChatResponseDTO.java         ← adicionar campo novoCaso",
        "    ├── SimuladorIniciarDTO.java     ← CRIAR",
        "    ├── SimuladorRespostaDTO.java    ← CRIAR",
        "    └── ProgressoDashboardDTO.java  ← CRIAR",
      ]),
      spacer(),
      h2("4.2 Endpoints da API"),
      simpleTable(
        ["Metodo", "Rota", "Descricao", "Role"],
        [
          ["POST", "/api/auth/login", "Login — devolve JWT", "Publico"],
          ["POST", "/api/auth/register", "Registo de estudante", "Publico"],
          ["POST", "/api/chat", "Envia mensagem — devolve resposta + novo_caso", "ESTUDANTE"],
          ["GET",  "/api/chat/casos", "Lista casos gerados pelo chat do estudante", "ESTUDANTE"],
          ["POST", "/api/simulador/iniciar", "Gera rodada com casos e alternativas", "ESTUDANTE"],
          ["POST", "/api/simulador/validar", "Valida resposta e devolve feedback", "ESTUDANTE"],
          ["GET",  "/api/simulador/resultado/{id}", "Resultado consolidado de uma rodada", "ESTUDANTE"],
          ["GET",  "/api/progresso/dashboard", "Metricas, graficos, historico", "ESTUDANTE"],
          ["GET",  "/api/progresso/simulacoes", "Historico de simulacoes realizadas", "ESTUDANTE"],
          ["GET",  "/api/leis", "Listar leis (filtro tipo, ano, status)", "TODOS"],
          ["GET",  "/api/leis/{id}", "Detalhes da lei com artigos", "TODOS"],
          ["POST", "/api/leis", "Criar lei", "ADMIN"],
          ["PUT",  "/api/leis/{id}", "Actualizar lei", "ADMIN"],
          ["DELETE", "/api/leis/{id}", "Remover lei", "ADMIN"],
          ["GET",  "/api/artigos", "Listar artigos (filtro lei, categoria)", "TODOS"],
          ["POST", "/api/artigos", "Criar artigo", "ADMIN"],
          ["PUT",  "/api/artigos/{id}", "Actualizar artigo", "ADMIN"],
          ["DELETE","/api/artigos/{id}", "Remover artigo", "ADMIN"],
          ["GET",  "/api/categorias", "Listar tipos de crime", "TODOS"],
          ["GET",  "/api/usuarios", "Listar utilizadores", "ADMIN"],
          ["PATCH","/api/usuarios/{id}/ativar", "Activar/desactivar utilizador", "ADMIN"],
        ],
        [700, 2400, 3500, 1760]
      ),
      spacer(),
      h2("4.3 Logica de Deteccao de Novo Caso (ChatService)"),
      p("Quando o estudante envia uma mensagem no chat, o backend executa dois passos antes de enviar para a IA:"),
      bullet("Passo 1 — Analise heuristica: verifica se a mensagem tem mais de 10 palavras E contem palavras-chave penais (agredido, ameacado, furtaram, violencia, crime, processo, acusado, detido, preso, etc.)"),
      bullet("Passo 2 — Se for candidato a caso, adiciona ao prompt enviado a Groq a instrucao para devolver um JSON no final:"),
      spacer(),
      codeBlock([
        "// Instrucao extra no prompt quando e candidato a caso:",
        "\"Apos a resposta juridica, numa linha separada, devolve APENAS o JSON:\"",
        "\"{\\\"novo_caso\\\": true, \\\"tema\\\": \\\"Ameaca\\\", \\\"artigos\\\": [\\\"170\\\"]}\"",
        "\"Se nao for caso penal concreto, devolve: {\\\"novo_caso\\\": false}\"",
      ]),
      spacer(),
      bullet("Passo 3 — O backend faz parse do JSON devolvido pela IA. Se novo_caso == true, extrai tema e artigos, gera uma pergunta_quiz e guarda em caso_gerado_chat."),
      spacer(),
      h2("4.4 Logica de Pontuacao Proporcional (SimuladorService)"),
      p("Cada questao do quiz tem entre 1 e 3 alternativas correctas definidas na base de dados. A pontuacao e calculada da seguinte forma:"),
      codeBlock([
        "// Exemplo: 3 alternativas correctas (A, B, C)",
        "// Estudante marca: A e D",
        "",
        "int total_corretas = 3;           // total de alternativas certas na questao",
        "int acertos = intersecao(selecionadas, corretas).size();  // = 1 (so A)",
        "int falsos_positivos = selecionadas.stream()",
        "                        .filter(r -> !corretas.contains(r)).count(); // = 1 (D)",
        "",
        "// Pontuacao bruta: acertos / total_corretas * 100",
        "double pontuacao = (acertos / (double) total_corretas) * 100;  // = 33.33%",
        "",
        "// Penalizacao por falsos positivos (opcional — configuravel):",
        "// pontuacao = max(0, pontuacao - (falsos_positivos * penalidade))",
      ]),
      spacer(),
      p("A pontuacao final da simulacao e a media das pontuacoes de todos os casos respondidos na rodada."),

      pageBreak(),

      // === 5. FRONTEND ===
      h1("5. Frontend — Next.js"),
      h2("5.1 Estrutura de Ficheiros"),
      codeBlock([
        "src/",
        "├── app/",
        "│   ├── (auth)/",
        "│   │   ├── login/page.tsx",
        "│   │   └── register/page.tsx",
        "│   └── (dashboard)/",
        "│       ├── layout.tsx           ← sidebar + navbar comuns",
        "│       ├── chat/page.tsx        ← REESCREVER",
        "│       ├── simulador/page.tsx   ← REESCREVER (3 ecras)",
        "│       ├── progresso/page.tsx   ← REESCREVER (graficos)",
        "│       ├── legislacao/page.tsx  ← MODIFICAR (accordion)",
        "│       └── admin/",
        "│           ├── utilizadores/page.tsx",
        "│           └── legislacao/page.tsx",
        "├── services/",
        "│   ├── auth.service.ts",
        "│   ├── chat.service.ts          ← MODIFICAR",
        "│   ├── simulador.service.ts     ← CRIAR",
        "│   └── progresso.service.ts     ← MODIFICAR",
        "├── store/",
        "│   ├── authStore.ts",
        "│   └── simuladorStore.ts        ← CRIAR",
        "└── components/",
        "    ├── ChatMessage.tsx",
        "    ├── QuizCard.tsx             ← CRIAR",
        "    ├── FeedbackPanel.tsx        ← CRIAR",
        "    ├── ProgressChart.tsx        ← CRIAR",
        "    └── LegislacaoAccordion.tsx  ← CRIAR",
      ]),
      spacer(),
      h2("5.2 Pagina: Chat (/chat)"),
      p("Layout: duas colunas em ecra largo. Esquerda: lista de casos guardados do chat. Direita: interface de conversa."),
      spacer(),
      bullet("Componente de mensagens: bolhas azuis para o estudante, bolhas brancas com borda para a IA"),
      bullet("Cada resposta da IA mostra badge 'Baseado na BD · Art. Xoo.o CPA' em verde"),
      bullet("Quando a IA detecta novo caso: badge laranja 'Novo caso guardado' aparece abaixo da resposta"),
      bullet("Campo de texto em baixo com botao Enviar e indicador de loading (tres pontos animados)"),
      bullet("Exemplos de situacoes clicaveis no inicio: 'Fui ameacado', 'Fui agredido fisicamente', 'O meu carro foi furtado'"),
      spacer(),
      infoBox("Servico chat.service.ts — metodos", [
        "enviarMensagem(mensagem: string): Promise<ChatResponseDTO>",
        "  — POST /api/chat — envia mensagem e recebe resposta + indicador novo_caso",
        "",
        "listarCasosDoChat(): Promise<CasoGeradoChat[]>",
        "  — GET /api/chat/casos — lista casos guardados do estudante",
      ], ORANGE_LIGHT),
      spacer(),
      h2("5.3 Pagina: Simulador (/simulador) — 3 Ecras"),
      h3("Ecra 1: Configuracao"),
      bullet("Radio group: 'Meus casos do Chat' (mostra contagem de casos disponiveis) OU 'Casos aleatorios da BD'"),
      bullet("Checkboxes de tipo de crime (apenas visivel em modo aleatorio): Crimes contra a Vida, Integridade Fisica, Honra, Património, Familia, Saude Publica"),
      bullet("Seletor de quantidade: botoes [2] [5] [10] [15] — destacado o seleccionado"),
      bullet("Botao 'Iniciar Simulacao' — chama POST /api/simulador/iniciar e avanca para Ecra 2"),
      spacer(),
      h3("Ecra 2: Quiz (por cada caso)"),
      bullet("Cabecalho: 'Caso X de Y' + barra de progresso"),
      bullet("Caixa de cenario: fundo cinzento suave, texto descritivo da situacao"),
      bullet("Pergunta em negrito: 'Qual a qualificacao juridica correcta?'"),
      bullet("4 ou 5 alternativas com checkbox — borda azul ao seleccionar"),
      bullet("Nota discreta: '(Seleccione uma ou mais alternativas)'"),
      bullet("Botao 'Validar Resposta' — chama POST /api/simulador/validar"),
      bullet("Apos validar: painel de feedback desliza para baixo"),
      subbullet("Verde: 'Correcto! 100%' — com artigo utilizado"),
      subbullet("Laranja: 'Parcialmente correcto — X%' — com explicacao e resposta esperada"),
      subbullet("Vermelho: 'Errado — 0%' — com resposta correcta completa e artigo"),
      bullet("Botao 'Proximo Caso' — avanca para o caso seguinte"),
      spacer(),
      h3("Ecra 3: Resultado Final"),
      bullet("Pontuacao total em destaque: circulo com percentagem grande ao centro"),
      bullet("Grafico de barras horizontais: uma barra por caso com percentagem"),
      bullet("Tabela detalhada: # | Tema | Resposta dada | Correcta | Artigo | Pontuacao"),
      bullet("Botao 'Guardar no Progresso' — POST /api/simulador/resultado (guardado automaticamente)"),
      bullet("Botoes: 'Repetir esta Simulacao' e 'Nova Simulacao'"),
      spacer(),
      h2("5.4 Pagina: Progresso (/progresso)"),
      p("Usa Recharts para graficos. Todos os dados vem de GET /api/progresso/dashboard."),
      spacer(),
      bullet("Secao 1 — 4 cards de metricas: Total de Simulacoes | Media de Acerto | Casos Unicos | Ultima Simulacao"),
      bullet("Secao 2 — Grafico de linha (Recharts LineChart): eixo X = datas, eixo Y = percentagem. Mostra evolucao ao longo do tempo."),
      bullet("Secao 3 — Grafico de barras (BarChart): eixo X = tipos de crime, eixo Y = percentagem de acerto. Cor vermelha para abaixo de 60%, laranja para 60-79%, verde para 80%+."),
      bullet("Secao 4 — Sugestao automatica: destaca o tipo de crime com menor percentagem e sugere artigos para rever."),
      bullet("Secao 5 — Tabela de historico: Data | Origem (Chat/Aleatório) | Qtd Casos | Acertos | % | Expandir. Ao clicar 'Expandir' mostra detalhes de cada caso dentro da rodada."),
      spacer(),
      h2("5.5 Pagina: Legislacao (/legislacao)"),
      bullet("Barra de pesquisa no topo: pesquisa em tempo real por numero de artigo, titulo ou texto"),
      bullet("Organizacao em accordion por tipo de crime: cada secao tem o nome do tipo + numero de artigos"),
      bullet("Ao expandir: lista de artigos com numero, titulo e pena (minima e maxima)"),
      bullet("Ao clicar num artigo: modal ou painel lateral com o texto completo do artigo"),
      bullet("Estudante apenas visualiza — sem opcoes de edicao"),
      spacer(),
      h2("5.6 Paginas Admin"),
      bullet("/admin/utilizadores: tabela com todos os utilizadores, filtro por role, botoes Activar/Desactivar, botao Resetar Senha"),
      bullet("/admin/legislacao: CRUD completo de leis e artigos. Formulario de adicionar artigo inclui campo de seleccao de categoria_crime."),

      pageBreak(),

      // === 6. INTEGRACAO CHAT → SIMULADOR ===
      h1("6. Integracao Chat → Simulador"),
      p("Este e o principal diferencial do sistema. O chat serve como fonte de conhecimento personalizada para o simulador."),
      spacer(),
      infoBox("Fluxo completo de integracao", [
        "1. Estudante conversa no chat e descreve situacoes penais reais",
        "2. O sistema detecta automaticamente cada nova situacao como um caso",
        "3. A IA responde com base nos artigos do CPA e gera pergunta_quiz + resposta_correta",
        "4. O caso e guardado em caso_gerado_chat associado ao estudante",
        "5. No simulador, ao escolher 'Meus casos do Chat', o sistema carrega esses casos",
        "6. O quiz apresenta exactamente o mesmo cenario que o estudante descreveu",
        "7. O sistema avalia se o estudante reteve o que aprendeu na conversa",
        "8. O resultado e guardado e aparece no progresso com origem = 'CHAT'",
      ]),
      spacer(),
      h2("6.1 Geracao de Alternativas"),
      p("Quando o simulador carrega um caso (do chat ou aleatorio), o SimuladorService precisa de gerar alternativas de resposta. As alternativas correctas vem da resposta_correta guardada. Os distratores (respostas erradas) sao gerados com base em artigos proximos da mesma categoria ou de categorias adjacentes."),
      bullet("Alternativas correctas: extraidas dos artigos_usados do caso"),
      bullet("Distratores: artigos da mesma categoria com numeros proximos (ex: se o caso usa Art. 170, os distratores podem ser Art. 174, 175, 177)"),
      bullet("Total de alternativas por questao: 4 ou 5"),
      bullet("Numero de alternativas correctas por questao: 1, 2 ou 3 (variavel)"),

      pageBreak(),

      // === 7. PLANO DE IMPLEMENTACAO ===
      h1("7. Plano de Implementacao (14 Dias)"),
      simpleTable(
        ["Fase", "O que fazer", "Ficheiros afectados", "Dias"],
        [
          ["0", "Setup: configurar BD, variaveis de ambiente, Flyway", "application.properties, V1 migration", "1"],
          ["1", "Criar entidades e repos das 2 novas tabelas", "CasoGeradoChat.java, ResultadoSimulacao.java + repos", "1"],
          ["2", "Autenticacao JWT: login, logout, guards frontend", "AuthController, SecurityConfig, authStore.ts", "1"],
          ["3", "Legislacao: CRUD backend + pagina com accordion", "LeiController, legislacao/page.tsx", "2"],
          ["4", "Chat: prompt BD-only + deteccao de caso + guardar", "ChatController, ChatService, chat/page.tsx", "3"],
          ["5", "Simulador: 3 ecras + pontuacao proporcional + feedback", "SimuladorController, Service, simulador/page.tsx", "4"],
          ["6", "Progresso: graficos Recharts + cards + historico", "ProgressoController, Service, progresso/page.tsx", "2"],
          ["7", "Integracao Chat → Simulador (modo meus casos)", "SimuladorService, simuladorStore.ts", "1"],
          ["8", "Testes, ajustes, documentacao, deploy", "Todos", "1"],
        ],
        [500, 3000, 3200, 660]
      ),
      spacer(),
      infoBox("Prioridades criticas (nao alterar ordem)", [
        "Fase 4 (Chat) deve vir antes da Fase 5 (Simulador) — o simulador depende dos casos gerados no chat",
        "Fase 1 (entidades) deve vir antes de Fase 4 e 5 — os services dependem dos repositorios",
        "Fase 2 (autenticacao) deve vir antes de qualquer pagina protegida",
      ], ORANGE_LIGHT),

      pageBreak(),

      // === 8. CATEGORIAS CPA ===
      h1("8. Categorias de Crime (CPA 2021)"),
      p("As seguintes categorias devem ser criadas na tabela categoria_crime e usadas para classificar cada artigo. Sao as mesmas categorias que aparecem nos filtros do simulador."),
      simpleTable(
        ["Categoria", "Artigos CPA", "Exemplos de crimes"],
        [
          ["Crimes contra a Vida", "Art. 148-154", "Homicidio simples, qualificado, privilegiado, aborto"],
          ["Crimes contra a Integridade Fisica", "Art. 155-165", "Ofensas corporais simples, graves, violencia de genero"],
          ["Crimes contra a Liberdade", "Art. 166-173", "Sequestro, rapto, coaccao, violacao de domicilio"],
          ["Crimes contra a Honra", "Art. 174-179", "Injuria, difamacao, caluna, ameaca"],
          ["Crimes contra a Familia", "Art. 175-182", "Violencia domestica, abandono de familia"],
          ["Crimes contra o Patrimonio", "Art. 226-248", "Furto simples, qualificado, roubo, extorsao, burla"],
          ["Crimes contra a Saude Publica", "Art. 283-295", "Trafico, consumo, conducao sob efeito"],
        ],
        [2800, 1800, 4760]
      ),

      pageBreak(),

      // === 9. RESUMO FICHEIROS ===
      h1("9. Resumo de Todos os Ficheiros a Criar/Modificar"),
      h2("9.1 Backend (Java)"),
      simpleTable(
        ["Ficheiro", "Accao", "Prioridade"],
        [
          ["CasoGeradoChat.java", "CRIAR — entidade JPA com 9 campos", "Alta"],
          ["ResultadoSimulacao.java", "CRIAR — entidade JPA com 10 campos", "Alta"],
          ["CasoGeradoChatRepository.java", "CRIAR — findByUsuarioIdAndAtivo, etc.", "Alta"],
          ["ResultadoSimulacaoRepository.java", "CRIAR — findBySimulacaoId, groupBy tipo_crime", "Alta"],
          ["ChatController.java", "MODIFICAR — novo endpoint POST /api/chat/casos", "Alta"],
          ["ChatService.java", "MODIFICAR — deteccao heuristica + prompt BD-only + guardar caso", "Alta"],
          ["SimuladorController.java", "CRIAR — 3 endpoints: iniciar, validar, resultado", "Alta"],
          ["SimuladorService.java", "CRIAR — geracao de alternativas, pontuacao proporcional", "Alta"],
          ["ProgressoController.java", "MODIFICAR — endpoint /dashboard com metricas agregadas", "Media"],
          ["ProgressoService.java", "MODIFICAR — calculos de evolucao, media por tipo crime", "Media"],
          ["DataInitializer.java", "MODIFICAR — adicionar categorias CPA e artigos iniciais", "Media"],
          ["V2__add_chat_simulador_tables.sql", "CRIAR — migracao Flyway para 2 novas tabelas", "Alta"],
        ],
        [3200, 3400, 1760]
      ),
      spacer(),
      h2("9.2 Frontend (Next.js)"),
      simpleTable(
        ["Ficheiro", "Accao", "Prioridade"],
        [
          ["chat/page.tsx", "REESCREVER — novo layout, badges BD, indicador novo caso", "Alta"],
          ["simulador/page.tsx", "REESCREVER — 3 ecras (config, quiz, resultado)", "Alta"],
          ["progresso/page.tsx", "REESCREVER — cards + Recharts + tabela historico", "Media"],
          ["legislacao/page.tsx", "MODIFICAR — accordion por tipo de crime + pesquisa", "Media"],
          ["services/chat.service.ts", "MODIFICAR — metodo listarCasosDoChat()", "Alta"],
          ["services/simulador.service.ts", "CRIAR — iniciarSimulacao, validarResposta, obterResultado", "Alta"],
          ["services/progresso.service.ts", "MODIFICAR — metodo getDashboardCompleto()", "Media"],
          ["store/simuladorStore.ts", "CRIAR — estado dos 3 ecras do simulador", "Alta"],
          ["components/QuizCard.tsx", "CRIAR — componente de questao com alternativas", "Alta"],
          ["components/FeedbackPanel.tsx", "CRIAR — painel de feedback apos validar", "Alta"],
          ["components/ProgressChart.tsx", "CRIAR — wrapper Recharts para graficos de progresso", "Media"],
          ["components/LegislacaoAccordion.tsx", "CRIAR — accordion expandivel por tipo de crime", "Media"],
        ],
        [3200, 3400, 1760]
      ),

      pageBreak(),

      // === 10. OBSERVACOES FINAIS ===
      h1("10. Observacoes Tecnicas Finais"),
      h2("10.1 Sobre a IA e a Base de Dados"),
      bullet("A IA (Groq/Llama) nunca deve responder com informacao da internet. O prompt do sistema deve comecar sempre com: 'Es um assistente juridico especializado no Codigo Penal Angolano de 2021. Responde APENAS com base nos artigos que te serao fornecidos abaixo. Nunca inventes informacao. Se nao houver artigo correspondente, diz que nao encontras base legal.'"),
      bullet("Antes de cada chamada a IA, o ChatService deve pesquisar artigos relevantes na BD usando palavras-chave da mensagem do estudante. Esses artigos sao incluidos no prompt como contexto."),
      bullet("O formato da resposta da IA deve sempre citar: 'Nos termos do Art. Xoo.o do CPA 2021...'"),
      spacer(),
      h2("10.2 Seguranca"),
      bullet("Todas as rotas excepto /api/auth/* devem exigir JWT valido no header Authorization: Bearer {token}"),
      bullet("As rotas /api/admin/* devem verificar role == ADMIN alem do JWT"),
      bullet("Passwords armazenadas com BCrypt (forca 12)"),
      bullet("CORS: configurar para aceitar apenas as origens do frontend (localhost:3000 em dev, dominio em prod)"),
      spacer(),
      h2("10.3 Escalabilidade"),
      bullet("Flyway garante que migraciones sao aplicadas em ordem e nunca repetidas"),
      bullet("A arquitectura REST permite escalar frontend e backend de forma independente"),
      bullet("Os indices criados nas tabelas garantem performance das consultas mais frequentes"),
      bullet("O campo simulacao_id em resultado_simulacao permite agrupar resultados por rodada sem tabela extra"),
      spacer(),
      infoBox("Estimativa final de tempo", [
        "Total estimado: 14 dias de trabalho focado",
        "Backend (Java): ~7 dias — entidades, services, controllers, migracao",
        "Frontend (Next.js): ~6 dias — 4 paginas reescritas + componentes novos",
        "Integracao e testes: ~1 dia",
        "",
        "Nota: As fases 0-3 (setup + auth + legislacao) podem ser feitas em paralelo com a fase 1 (entidades).",
      ], GREEN_LIGHT),

      spacer(),
      spacer(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 400 },
        children: [new TextRun({ text: "Fim do Documento — Sistema Penal Angola v2.0", size: 20, color: "999999", font: "Arial" })]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/claude/plano_sistema_penal/Plano_Sistema_Penal_Angola.docx", buffer);
  console.log("OK");
});
