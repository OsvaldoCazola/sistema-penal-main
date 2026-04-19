-- Tabela para armazenar explicações geradas pela IA
-- Mapeia palavras-chave para artigos sugeridos
CREATE TABLE ai_explanations (
    id UUID PRIMARY KEY,
    termo_busca VARCHAR(1000) NOT NULL,
    artigo_id UUID,
    artigo_titulo VARCHAR(500),
    palavra_chave VARCHAR(255),
    tipo_palavra VARCHAR(50),
    relevancia DOUBLE PRECISION,
    justificativa VARCHAR(2000),
    created_at TIMESTAMP,
    usuario_id UUID
);

-- Índices para melhorar performance nas buscas
CREATE INDEX idx_ai_explanations_termo_busca ON ai_explanations(termo_busca);
CREATE INDEX idx_ai_explanations_artigo_id ON ai_explanations(artigo_id);
CREATE INDEX idx_ai_explanations_palavra_chave ON ai_explanations(palavra_chave);
CREATE INDEX idx_ai_explanations_usuario_id ON ai_explanations(usuario_id);
CREATE INDEX idx_ai_explanations_tipo_palavra ON ai_explanations(tipo_palavra);
