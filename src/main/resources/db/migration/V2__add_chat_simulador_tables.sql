-- ============================================================
-- MIGRACAO FLYWAY V2
-- Sistema Web de Apoio ao Estudo do Direito Penal Angolano
-- Novas tabelas: caso_gerado_chat e resultado_simulacao
-- ============================================================

-- 10. CASO_GERADO_CHAT
-- Guarda casos penais detectados automaticamente no chat.
-- Cada linha = uma situacao real descrita pelo estudante,
-- com pergunta de quiz e resposta correcta gerada pela IA.

CREATE TABLE caso_gerado_chat (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id      UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    tema            VARCHAR(255),
    descricao       TEXT NOT NULL,
    pergunta_quiz   TEXT NOT NULL,
    resposta_correta TEXT NOT NULL,
    artigos_usados  TEXT,
    ativo           BOOLEAN DEFAULT TRUE,
    criado_em       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_caso_chat_usuario  ON caso_gerado_chat(usuario_id);
CREATE INDEX idx_caso_chat_ativo    ON caso_gerado_chat(usuario_id, ativo);
CREATE INDEX idx_caso_chat_criado   ON caso_gerado_chat(criado_em DESC);


-- 11. RESULTADO_SIMULACAO
-- Regista cada resposta dada numa simulacao.
-- simulacao_id agrupa todas as respostas de uma mesma rodada.
-- Permite calcular pontuacao por simulacao, por caso e por tipo de crime.

CREATE TABLE resultado_simulacao (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id              UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    simulacao_id            UUID NOT NULL,
    caso_id                 UUID REFERENCES caso_gerado_chat(id),
    respostas_dadas         TEXT,
    alternativas_corretas   INTEGER,
    acertos                 INTEGER,
    pontuacao               DECIMAL(5,2),
    tipo_crime              VARCHAR(100),
    origem                  VARCHAR(20) CHECK (origem IN ('CHAT','ALEATORIO')),
    concluido_em            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_res_sim_usuario    ON resultado_simulacao(usuario_id);
CREATE INDEX idx_res_sim_rodada     ON resultado_simulacao(simulacao_id);
CREATE INDEX idx_res_sim_tipo       ON resultado_simulacao(usuario_id, tipo_crime);
CREATE INDEX idx_res_sim_data       ON resultado_simulacao(concluido_em DESC);
