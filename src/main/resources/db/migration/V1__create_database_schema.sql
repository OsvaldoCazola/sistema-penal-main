-- =====================================================
-- SISTEMA DE DIREITO PENAL ANGOLANO
-- Schema Profissional - PostgreSQL
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- CORE: AUTENTICAÇÃO E USUÁRIOS
-- =====================================================

CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'CIDADAO',
    ativo BOOLEAN DEFAULT TRUE,
    ultimo_login TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    expira_em TIMESTAMP NOT NULL,
    revogado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id),
    acao VARCHAR(100) NOT NULL,
    entidade VARCHAR(100),
    entidade_id UUID,
    dados JSONB,
    ip VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- LEGISLAÇÃO
-- =====================================================

CREATE TABLE leis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo VARCHAR(50) NOT NULL,
    numero VARCHAR(50) NOT NULL,
    ano INTEGER NOT NULL,
    titulo VARCHAR(500) NOT NULL,
    ementa TEXT,
    conteudo TEXT,
    data_publicacao DATE,
    data_vigencia DATE,
    status VARCHAR(20) DEFAULT 'VIGENTE',
    fonte_url VARCHAR(500),
    metadata JSONB DEFAULT '{}',
    search_vector TSVECTOR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tipo, numero, ano)
);

CREATE TABLE artigos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lei_id UUID NOT NULL REFERENCES leis(id) ON DELETE CASCADE,
    numero VARCHAR(20) NOT NULL,
    conteudo TEXT NOT NULL,
    subdivisoes JSONB DEFAULT '[]',
    ordem INTEGER,
    search_vector TSVECTOR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ESTRUTURA JUDICIAL
-- =====================================================

CREATE TABLE tribunais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    provincia VARCHAR(100) NOT NULL,
    municipio VARCHAR(100),
    coordenadas GEOMETRY(POINT, 4326),
    contato JSONB DEFAULT '{}',
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tipos_crime (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    pena_minima_meses INTEGER,
    pena_maxima_meses INTEGER,
    artigo_referencia VARCHAR(50),
    descricao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PROCESSOS JUDICIAIS
-- =====================================================

CREATE TABLE processos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero VARCHAR(100) NOT NULL UNIQUE,
    tribunal_id UUID REFERENCES tribunais(id),
    tipo_crime_id UUID REFERENCES tipos_crime(id),
    status VARCHAR(50) DEFAULT 'EM_ANDAMENTO',
    fase VARCHAR(100),
    data_abertura DATE NOT NULL,
    data_fato DATE,
    data_encerramento DATE,
    descricao_fatos TEXT,
    local_fato VARCHAR(255),
    provincia VARCHAR(100),
    coordenadas GEOMETRY(POINT, 4326),
    partes JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movimentacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    processo_id UUID NOT NULL REFERENCES processos(id) ON DELETE CASCADE,
    tipo VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    data_evento TIMESTAMP NOT NULL,
    usuario_id UUID REFERENCES usuarios(id),
    anexos JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE documentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    processo_id UUID REFERENCES processos(id) ON DELETE CASCADE,
    tipo VARCHAR(100) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    arquivo_url VARCHAR(500),
    hash_sha256 VARCHAR(64),
    tamanho_bytes BIGINT,
    uploaded_by UUID REFERENCES usuarios(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- SENTENÇAS E JURISPRUDÊNCIA
-- =====================================================

CREATE TABLE sentencas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    processo_id UUID REFERENCES processos(id),
    tipo_decisao VARCHAR(50) NOT NULL,
    pena_meses INTEGER,
    tipo_pena VARCHAR(50),
    regime VARCHAR(50),
    data_sentenca DATE NOT NULL,
    ementa TEXT,
    fundamentacao TEXT,
    dispositivo TEXT,
    juiz_nome VARCHAR(255),
    circunstancias JSONB DEFAULT '{}',
    transitado_julgado BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    search_vector TSVECTOR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INTELIGÊNCIA ARTIFICIAL
-- =====================================================

CREATE TABLE chat_sessoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(255),
    contexto JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'ATIVA',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_mensagens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sessao_id UUID NOT NULL REFERENCES chat_sessoes(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,
    conteudo TEXT NOT NULL,
    tokens INTEGER,
    fontes JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ia_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hash_input VARCHAR(64) NOT NULL UNIQUE,
    tipo_operacao VARCHAR(50) NOT NULL,
    input TEXT,
    output JSONB NOT NULL,
    modelo VARCHAR(100),
    tokens_total INTEGER,
    expira_em TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE previsoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    processo_id UUID REFERENCES processos(id),
    usuario_id UUID REFERENCES usuarios(id),
    tipo_crime_id UUID REFERENCES tipos_crime(id),
    input_features JSONB NOT NULL,
    pena_prevista_meses INTEGER,
    confianca DECIMAL(5,4),
    explicacao JSONB,
    sentenca_real_meses INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- GEODADOS E ESTATÍSTICAS
-- =====================================================

CREATE TABLE ocorrencias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    processo_id UUID REFERENCES processos(id),
    tipo_crime_id UUID REFERENCES tipos_crime(id),
    data_ocorrencia DATE NOT NULL,
    provincia VARCHAR(100) NOT NULL,
    municipio VARCHAR(100),
    coordenadas GEOMETRY(POINT, 4326),
    dados JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE estatisticas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo VARCHAR(50) NOT NULL,
    periodo DATE NOT NULL,
    dimensao VARCHAR(100),
    dimensao_valor VARCHAR(255),
    metricas JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tipo, periodo, dimensao, dimensao_valor)
);

-- =====================================================
-- DENÚNCIAS
-- =====================================================

CREATE TABLE denuncias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    protocolo VARCHAR(50) NOT NULL UNIQUE,
    tipo_crime_id UUID REFERENCES tipos_crime(id),
    descricao TEXT NOT NULL,
    data_fato DATE,
    local_fato VARCHAR(255),
    provincia VARCHAR(100),
    coordenadas GEOMETRY(POINT, 4326),
    anonima BOOLEAN DEFAULT TRUE,
    contato_criptografado TEXT,
    status VARCHAR(50) DEFAULT 'RECEBIDA',
    classificacao_ia JSONB,
    historico JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CONTEÚDO E PORTAL DO CIDADÃO
-- =====================================================

CREATE TABLE conteudos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo VARCHAR(50) NOT NULL,
    categoria VARCHAR(100),
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    conteudo TEXT NOT NULL,
    resumo TEXT,
    autor_id UUID REFERENCES usuarios(id),
    publicado BOOLEAN DEFAULT FALSE,
    visualizacoes INTEGER DEFAULT 0,
    tags TEXT[],
    search_vector TSVECTOR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CONFIGURAÇÕES E SISTEMA
-- =====================================================

CREATE TABLE configuracoes (
    chave VARCHAR(100) PRIMARY KEY,
    valor TEXT,
    tipo VARCHAR(20) DEFAULT 'STRING',
    descricao TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) NOT NULL UNIQUE,
    tipo VARCHAR(50) NOT NULL,
    cron VARCHAR(50),
    ultimo_sucesso TIMESTAMP,
    ultima_execucao TIMESTAMP,
    status VARCHAR(20) DEFAULT 'ATIVO',
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE job_execucoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    inicio TIMESTAMP NOT NULL,
    fim TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    resultado JSONB,
    erro TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ÍNDICES
-- =====================================================

-- Full-Text Search
CREATE INDEX idx_leis_search ON leis USING GIN(search_vector);
CREATE INDEX idx_artigos_search ON artigos USING GIN(search_vector);
CREATE INDEX idx_sentencas_search ON sentencas USING GIN(search_vector);
CREATE INDEX idx_conteudos_search ON conteudos USING GIN(search_vector);

-- Geoespaciais
CREATE INDEX idx_ocorrencias_geo ON ocorrencias USING GIST(coordenadas);
CREATE INDEX idx_processos_geo ON processos USING GIST(coordenadas);
CREATE INDEX idx_denuncias_geo ON denuncias USING GIST(coordenadas);

-- Lookups frequentes
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_processos_numero ON processos(numero);
CREATE INDEX idx_processos_status ON processos(status);
CREATE INDEX idx_processos_tribunal ON processos(tribunal_id);
CREATE INDEX idx_leis_tipo_numero ON leis(tipo, numero, ano);
CREATE INDEX idx_movimentacoes_processo ON movimentacoes(processo_id, data_evento);
CREATE INDEX idx_chat_sessoes_usuario ON chat_sessoes(usuario_id);
CREATE INDEX idx_audit_log_usuario ON audit_log(usuario_id, created_at);
CREATE INDEX idx_ocorrencias_data ON ocorrencias(data_ocorrencia);
CREATE INDEX idx_estatisticas_lookup ON estatisticas(tipo, periodo);

-- Trigram para busca fuzzy
CREATE INDEX idx_leis_titulo_trgm ON leis USING GIN(titulo gin_trgm_ops);

-- JSONB
CREATE INDEX idx_processos_partes ON processos USING GIN(partes);
CREATE INDEX idx_sentencas_circunstancias ON sentencas USING GIN(circunstancias);

-- =====================================================
-- TRIGGERS PARA SEARCH VECTORS
-- =====================================================

CREATE OR REPLACE FUNCTION update_search_vector() RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'leis' THEN
        NEW.search_vector := to_tsvector('portuguese', COALESCE(NEW.titulo, '') || ' ' || COALESCE(NEW.ementa, '') || ' ' || COALESCE(NEW.conteudo, ''));
    ELSIF TG_TABLE_NAME = 'artigos' THEN
        NEW.search_vector := to_tsvector('portuguese', COALESCE(NEW.conteudo, ''));
    ELSIF TG_TABLE_NAME = 'sentencas' THEN
        NEW.search_vector := to_tsvector('portuguese', COALESCE(NEW.ementa, '') || ' ' || COALESCE(NEW.fundamentacao, ''));
    ELSIF TG_TABLE_NAME = 'conteudos' THEN
        NEW.search_vector := to_tsvector('portuguese', COALESCE(NEW.titulo, '') || ' ' || COALESCE(NEW.conteudo, ''));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leis_search_trigger BEFORE INSERT OR UPDATE ON leis
FOR EACH ROW EXECUTE FUNCTION update_search_vector();

CREATE TRIGGER artigos_search_trigger BEFORE INSERT OR UPDATE ON artigos
FOR EACH ROW EXECUTE FUNCTION update_search_vector();

CREATE TRIGGER sentencas_search_trigger BEFORE INSERT OR UPDATE ON sentencas
FOR EACH ROW EXECUTE FUNCTION update_search_vector();

CREATE TRIGGER conteudos_search_trigger BEFORE INSERT OR UPDATE ON conteudos
FOR EACH ROW EXECUTE FUNCTION update_search_vector();

-- =====================================================
-- DADOS INICIAIS
-- =====================================================

-- Configurações
INSERT INTO configuracoes (chave, valor, tipo, descricao) VALUES
('app.nome', 'Sistema de Direito Penal Angolano', 'STRING', 'Nome do sistema'),
('app.versao', '1.0.0', 'STRING', 'Versão atual'),
('jwt.expiracao_minutos', '30', 'INTEGER', 'Expiração do token JWT'),
('ia.limite_diario', '100', 'INTEGER', 'Limite diário de consultas IA'),
('ia.modelo_padrao', 'gpt-4', 'STRING', 'Modelo de IA padrão');

-- Tipos de Crime Principais
INSERT INTO tipos_crime (codigo, nome, categoria, pena_minima_meses, pena_maxima_meses, artigo_referencia) VALUES
('HOM_SIMPLES', 'Homicídio Simples', 'CRIMES_CONTRA_VIDA', 96, 192, 'Art. 349'),
('HOM_QUALIF', 'Homicídio Qualificado', 'CRIMES_CONTRA_VIDA', 192, 300, 'Art. 350'),
('ROUBO', 'Roubo', 'CRIMES_PATRIMONIO', 24, 96, 'Art. 404'),
('FURTO', 'Furto', 'CRIMES_PATRIMONIO', 6, 36, 'Art. 399'),
('TRAFICO_DROGAS', 'Tráfico de Drogas', 'CRIMES_SAUDE_PUBLICA', 48, 180, 'Lei 3/99'),
('CORRUPCAO', 'Corrupção', 'CRIMES_ADM_PUBLICA', 24, 120, 'Art. 362'),
('PECULATO', 'Peculato', 'CRIMES_ADM_PUBLICA', 24, 96, 'Art. 360'),
('VIOLENCIA_DOM', 'Violência Doméstica', 'CRIMES_CONTRA_PESSOA', 12, 60, 'Lei 25/11'),
('ABUSO_SEXUAL', 'Abuso Sexual', 'CRIMES_SEXUAIS', 36, 144, 'Art. 393'),
('BURLA', 'Burla', 'CRIMES_PATRIMONIO', 6, 60, 'Art. 409');

-- Tribunais
INSERT INTO tribunais (nome, tipo, provincia, municipio) VALUES
('Tribunal Supremo', 'SUPREMO', 'Luanda', 'Luanda'),
('Tribunal Provincial de Luanda', 'PROVINCIAL', 'Luanda', 'Luanda'),
('Tribunal Provincial de Benguela', 'PROVINCIAL', 'Benguela', 'Benguela'),
('Tribunal Provincial do Huambo', 'PROVINCIAL', 'Huambo', 'Huambo'),
('Tribunal Provincial de Cabinda', 'PROVINCIAL', 'Cabinda', 'Cabinda');
