-- =====================================================
-- MÓDULO DE NOTIFICAÇÕES
-- =====================================================

CREATE TABLE notificacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    mensagem TEXT,
    link_acao VARCHAR(500),
    lida BOOLEAN DEFAULT FALSE,
    data_leitura TIMESTAMP,
    dados JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para notificações
CREATE INDEX idx_notificacoes_usuario ON notificacoes(usuario_id);
CREATE INDEX idx_notificacoes_usuario_lida ON notificacoes(usuario_id, lida);
CREATE INDEX idx_notificacoes_created_at ON notificacoes(created_at DESC);

-- =====================================================
-- ÍNDICES ADICIONAIS PARA PERFORMANCE
-- =====================================================

-- Índice para busca de documentos por processo
CREATE INDEX IF NOT EXISTS idx_documentos_processo ON documentos(processo_id);
CREATE INDEX IF NOT EXISTS idx_documentos_hash ON documentos(hash_sha256);

-- Índice para cache de IA
CREATE INDEX IF NOT EXISTS idx_ia_cache_hash ON ia_cache(hash_input);
CREATE INDEX IF NOT EXISTS idx_ia_cache_expira ON ia_cache(expira_em) WHERE expira_em IS NOT NULL;
