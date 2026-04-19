-- =====================================================
-- SISTEMA DE DIREITO PENAL ANGOLANO
-- V5: Gestão de Prazos Processuais
-- =====================================================

-- Tabela de Prazos
CREATE TABLE prazos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    tipo VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ATIVO',
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    dias_prazo INTEGER,
    data_conclusao DATE,
    notificado BOOLEAN DEFAULT FALSE,
    notificado_vencimento BOOLEAN DEFAULT FALSE,
    processo_id UUID REFERENCES processos(id) ON DELETE SET NULL,
    criado_por_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para Prazos
CREATE INDEX idx_prazos_processo ON prazos(processo_id);
CREATE INDEX idx_prazos_status ON prazos(status);
CREATE INDEX idx_prazos_tipo ON prazos(tipo);
CREATE INDEX idx_prazos_data_fim ON prazos(data_fim);
CREATE INDEX idx_prazos_criado_por ON prazos(criado_por_id);

-- Comentário da tabela
COMMENT ON TABLE prazos IS 'Tabela para gestão de prazos processuais - investigação, instrução, julgamento, recursos, etc.';
COMMENT ON COLUMN prazos.tipo IS 'Tipo de prazo: INVESTIGACAO, INSTRUCAO, JULGAMENTO, RECURSO, CUMPRIMENTO_PENA, etc.';
COMMENT ON COLUMN prazos.status IS 'Status: ATIVO, EM_ANDAMENTO, CUMPRIDO, VENCIDO, SUSPENSO, PRORROGADO, CANCELADO';
