-- =====================================================
-- SISTEMA DE PERMISSIONS
-- Migration V4: Adiciona sistema de permissões granular
-- =====================================================

-- 1. Criar tabela de permissões
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    resource VARCHAR(50),
    action VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Criar tabela de junção usuario_permissions
CREATE TABLE usuario_permissions (
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (usuario_id, permission_id)
);

-- 3. Criar índices para melhor performance
CREATE INDEX idx_usuario_permissions_usuario ON usuario_permissions(usuario_id);
CREATE INDEX idx_usuario_permissions_permission ON usuario_permissions(permission_id);
CREATE INDEX idx_permissions_name ON permissions(name);
CREATE INDEX idx_permissions_resource_action ON permissions(resource, action);

-- 4. Atualizar role padrão na tabela usuarios (antes CIDADAO, agora ESTUDANTE)
ALTER TABLE usuarios ALTER COLUMN role SET DEFAULT 'ESTUDANTE';

-- 5. Inserir permissões padrão do sistema
INSERT INTO permissions (name, description, resource, action) VALUES
-- Permissões ADMIN
('ADMIN_USUARIO_CREATE', 'Criar utilizadores', 'USUARIO', 'CREATE'),
('ADMIN_USUARIO_READ', 'Listar/utilizadores', 'USUARIO', 'READ'),
('ADMIN_USUARIO_UPDATE', 'Atualizar utilizadores', 'USUARIO', 'UPDATE'),
('ADMIN_USUARIO_DELETE', 'Excluir utilizadores', 'USUARIO', 'DELETE'),
('ADMIN_LEI_CREATE', 'Criar leis', 'LEI', 'CREATE'),
('ADMIN_LEI_READ', 'Listar leis', 'LEI', 'READ'),
('ADMIN_LEI_UPDATE', 'Atualizar leis', 'LEI', 'UPDATE'),
('ADMIN_LEI_DELETE', 'Excluir leis', 'LEI', 'DELETE'),
('ADMIN_ARTIGO_CREATE', 'Criar artigos', 'ARTIGO', 'CREATE'),
('ADMIN_ARTIGO_READ', 'Listar artigos', 'ARTIGO', 'READ'),
('ADMIN_ARTIGO_UPDATE', 'Atualizar artigos', 'ARTIGO', 'UPDATE'),
('ADMIN_ARTIGO_DELETE', 'Excluir artigos', 'ARTIGO', 'DELETE'),
('ADMIN_PROCESSO_READ', 'Ver processos (técnico)', 'PROCESSO', 'READ'),
('ADMIN_SENTENCA_READ', 'Ver sentenças', 'SENTENCA', 'READ'),
('ADMIN_DASHBOARD_READ', 'Ver dashboard', 'DASHBOARD', 'READ'),
('ADMIN_DASHBOARD_RELATORIO', 'Gerar relatórios', 'DASHBOARD', 'READ'),
('ADMIN_BLOCKCHAIN_REGISTER', 'Registrar no blockchain', 'BLOCKCHAIN', 'CREATE'),
('ADMIN_BLOCKCHAIN_VERIFY', 'Verificar blockchain', 'BLOCKCHAIN', 'READ'),
('ADMIN_MONITORAMENTO_CREATE', 'Criar monitoramento', 'MONITORAMENTO', 'CREATE'),
('ADMIN_MONITORAMENTO_READ', 'Ver monitoramento', 'MONITORAMENTO', 'READ'),
('ADMIN_PERMISSION_ALL', 'Gerenciar permissões', 'PERMISSION', 'READ'),

-- Permissões JUIZ
('JUIZ_PROCESSO_READ', 'Ver processos', 'PROCESSO', 'READ'),
('JUIZ_PROCESSO_UPDATE', 'Atualizar processos', 'PROCESSO', 'UPDATE'),
('JUIZ_SENTENCA_CREATE', 'Criar sentenças', 'SENTENCA', 'CREATE'),
('JUIZ_SENTENCA_READ', 'Ver sentenças', 'SENTENCA', 'READ'),
('JUIZ_SENTENCA_UPDATE', 'Atualizar sentenças', 'SENTENCA', 'UPDATE'),
('JUIZ_LEI_READ', 'Ver leis', 'LEI', 'READ'),
('JUIZ_ARTIGO_READ', 'Ver artigos', 'ARTIGO', 'READ'),
('JUIZ_JURISPRUDENCIA_READ', 'Ver jurisprudência', 'JURISPRUDENCIA', 'READ'),
('JUIZ_DASHBOARD_READ', 'Ver dashboard', 'DASHBOARD', 'READ'),

-- Permissões PROCURADOR
('PROCURADOR_PROCESSO_CREATE', 'Criar processos', 'PROCESSO', 'CREATE'),
('PROCURADOR_PROCESSO_READ', 'Ver processos', 'PROCESSO', 'READ'),
('PROCURADOR_LEI_READ', 'Ver leis', 'LEI', 'READ'),
('PROCURADOR_ARTIGO_READ', 'Ver artigos', 'ARTIGO', 'READ'),
('PROCURADOR_JURISPRUDENCIA_READ', 'Ver jurisprudência', 'JURISPRUDENCIA', 'READ'),
('PROCURADOR_DASHBOARD_READ', 'Ver dashboard', 'DASHBOARD', 'READ'),

-- Permissões ADVOGADO
('ADVOGADO_PROCESSO_READ', 'Ver processos', 'PROCESSO', 'READ'),
('ADVOGADO_LEI_READ', 'Ver leis', 'LEI', 'READ'),
('ADVOGADO_ARTIGO_READ', 'Ver artigos', 'ARTIGO', 'READ'),
('ADVOGADO_JURISPRUDENCIA_READ', 'Ver jurisprudência', 'JURISPRUDENCIA', 'READ'),

-- Permissões ESTUDANTE
('ESTUDANTE_LEI_READ', 'Ver leis', 'LEI', 'READ'),
('ESTUDANTE_ARTIGO_READ', 'Ver artigos', 'ARTIGO', 'READ'),
('ESTUDANTE_JURISPRUDENCIA_READ', 'Ver jurisprudência', 'JURISPRUDENCIA', 'READ'),
('ESTUDANTE_BUSCA_EXECUTE', 'Executar buscas', 'BUSCA', 'EXECUTE');

-- 6. Atualizar enum no Hibernate (isso é feito automaticamente pelo Hibernate na próxima inicialização)
-- A tabela está pronta para uso com o novo sistema de permissões
