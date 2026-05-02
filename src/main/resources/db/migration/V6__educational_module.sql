-- =====================================================
-- MÓDULO EDUCACIONAL - CASOS SIMULADOS
-- =====================================================

CREATE TABLE casos_simulados (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao_facto TEXT NOT NULL,
    nivel INTEGER NOT NULL,
    categoria VARCHAR(150) NOT NULL,
    artigos_relacionados VARCHAR(255) NOT NULL,
    gabarito_explicacao TEXT,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE perguntas_caso (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    caso_id BIGINT NOT NULL REFERENCES casos_simulados(id) ON DELETE CASCADE,
    ordem INTEGER NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    enunciado TEXT NOT NULL,
    resposta_esperada TEXT NOT NULL,
    pontuacao_maxima INTEGER NOT NULL DEFAULT 1,
    ativa BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_perguntas_caso_caso ON perguntas_caso(caso_id);
CREATE INDEX idx_perguntas_caso_ordem ON perguntas_caso(caso_id, ordem);

CREATE TABLE progresso_estudante (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    caso_id BIGINT NOT NULL REFERENCES casos_simulados(id) ON DELETE CASCADE,
    total_perguntas INTEGER NOT NULL DEFAULT 0,
    perguntas_respondidas INTEGER NOT NULL DEFAULT 0,
    perguntas_corretas INTEGER NOT NULL DEFAULT 0,
    pontuacao_obtida INTEGER NOT NULL DEFAULT 0,
    pontuacao_maxima INTEGER NOT NULL DEFAULT 0,
    percentual_conclusao NUMERIC(5,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'NAO_INICIADO',
    iniciado_em TIMESTAMP,
    atualizado_em TIMESTAMP,
    concluido_em TIMESTAMP,
    UNIQUE(usuario_id, caso_id)
);

CREATE INDEX idx_progresso_usuario ON progresso_estudante(usuario_id);
CREATE INDEX idx_progresso_caso ON progresso_estudante(caso_id);

CREATE TABLE respostas_estudante (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    caso_id BIGINT NOT NULL REFERENCES casos_simulados(id) ON DELETE CASCADE,
    pergunta_id UUID NOT NULL REFERENCES perguntas_caso(id) ON DELETE CASCADE,
    resposta_dada TEXT NOT NULL,
    feedback_professor TEXT,
    correta BOOLEAN,
    pontos_obtidos INTEGER,
    respondido_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(usuario_id, pergunta_id)
);

CREATE INDEX idx_respostas_usuario_caso ON respostas_estudante(usuario_id, caso_id);
CREATE INDEX idx_respostas_pergunta ON respostas_estudante(pergunta_id);
