package com.api.sistema_penal.service;

import com.api.sistema_penal.domain.entity.Permission;
import com.api.sistema_penal.domain.entity.Permission.Action;
import com.api.sistema_penal.domain.entity.Permission.Resource;
import com.api.sistema_penal.domain.entity.Usuario;
import com.api.sistema_penal.domain.repository.PermissionRepository;
import com.api.sistema_penal.domain.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PermissionService {

    private final PermissionRepository permissionRepository;
    private final UsuarioRepository usuarioRepository;

    /**
     * Inicializa as permissões padrão do sistema
     */
    @Transactional
    public void initializeDefaultPermissions() {
        // Busca todas as permissões existentes em uma única query para evitar N+1
        List<String> existingPermissionNames = permissionRepository.findAll().stream()
                .map(Permission::getName)
                .toList();
        
        List<Permission> defaultPermissions = new ArrayList<>();
        
        // Permissões de Processo
        addIfNotExists(defaultPermissions, existingPermissionNames, "PROCESSO_CREATE", "Criar processos", "PROCESSO", "CREATE");
        addIfNotExists(defaultPermissions, existingPermissionNames, "PROCESSO_READ", "Visualizar processos", "PROCESSO", "READ");
        addIfNotExists(defaultPermissions, existingPermissionNames, "PROCESSO_UPDATE", "Atualizar processos", "PROCESSO", "UPDATE");
        addIfNotExists(defaultPermissions, existingPermissionNames, "PROCESSO_DELETE", "Excluir processos", "PROCESSO", "DELETE");
        
        // Permissões de Sentença
        addIfNotExists(defaultPermissions, existingPermissionNames, "SENTENCA_CREATE", "Criar sentenças", "SENTENCA", "CREATE");
        addIfNotExists(defaultPermissions, existingPermissionNames, "SENTENCA_READ", "Visualizar sentenças", "SENTENCA", "READ");
        addIfNotExists(defaultPermissions, existingPermissionNames, "SENTENCA_UPDATE", "Atualizar sentenças", "SENTENCA", "UPDATE");
        
        // Permissões de Lei
        addIfNotExists(defaultPermissions, existingPermissionNames, "LEI_CREATE", "Criar leis", "LEI", "CREATE");
        addIfNotExists(defaultPermissions, existingPermissionNames, "LEI_READ", "Visualizar leis", "LEI", "READ");
        addIfNotExists(defaultPermissions, existingPermissionNames, "LEI_UPDATE", "Atualizar leis", "LEI", "UPDATE");
        addIfNotExists(defaultPermissions, existingPermissionNames, "LEI_DELETE", "Excluir leis", "LEI", "DELETE");
        
        // Permissões de Artigo
        addIfNotExists(defaultPermissions, existingPermissionNames, "ARTIGO_CREATE", "Criar artigos", "ARTIGO", "CREATE");
        addIfNotExists(defaultPermissions, existingPermissionNames, "ARTIGO_READ", "Visualizar artigos", "ARTIGO", "READ");
        addIfNotExists(defaultPermissions, existingPermissionNames, "ARTIGO_UPDATE", "Atualizar artigos", "ARTIGO", "UPDATE");
        addIfNotExists(defaultPermissions, existingPermissionNames, "ARTIGO_DELETE", "Excluir artigos", "ARTIGO", "DELETE");
        
        // Permissões de Usuário
        addIfNotExists(defaultPermissions, existingPermissionNames, "USUARIO_CREATE", "Criar usuários", "USUARIO", "CREATE");
        addIfNotExists(defaultPermissions, existingPermissionNames, "USUARIO_READ", "Visualizar usuários", "USUARIO", "READ");
        addIfNotExists(defaultPermissions, existingPermissionNames, "USUARIO_UPDATE", "Atualizar usuários", "USUARIO", "UPDATE");
        addIfNotExists(defaultPermissions, existingPermissionNames, "USUARIO_DELETE", "Excluir usuários", "USUARIO", "DELETE");
        
        // Permissões de Dashboard
        addIfNotExists(defaultPermissions, existingPermissionNames, "DASHBOARD_READ", "Visualizar dashboard", "DASHBOARD", "READ");
        addIfNotExists(defaultPermissions, existingPermissionNames, "DASHBOARD_RELATORIO", "Gerar relatórios", "DASHBOARD", "EXECUTE");
        
        // Permissões de Blockchain
        addIfNotExists(defaultPermissions, existingPermissionNames, "BLOCKCHAIN_REGISTER", "Registrar hash", "BLOCKCHAIN", "CREATE");
        addIfNotExists(defaultPermissions, existingPermissionNames, "BLOCKCHAIN_VERIFY", "Verificar integridade", "BLOCKCHAIN", "READ");
        
        // Permissões de Monitoramento
        addIfNotExists(defaultPermissions, existingPermissionNames, "MONITORAMENTO_CREATE", "Criar monitoramento", "MONITORAMENTO", "CREATE");
        addIfNotExists(defaultPermissions, existingPermissionNames, "MONITORAMENTO_READ", "Visualizar monitoramento", "MONITORAMENTO", "READ");
        
        // Permissões de Jurisprudência
        addIfNotExists(defaultPermissions, existingPermissionNames, "JURISPRUDENCIA_READ", "Visualizar jurisprudência", "JURISPRUDENCIA", "READ");
        
        // Permissões de Busca
        addIfNotExists(defaultPermissions, existingPermissionNames, "BUSCA_EXECUTE", "Executar buscas", "BUSCA", "EXECUTE");
        
        if (!defaultPermissions.isEmpty()) {
            permissionRepository.saveAll(defaultPermissions);
            log.info("{} permissões padrão inicializadas", defaultPermissions.size());
        }
    }

    private void addIfNotExists(List<Permission> list, List<String> existingNames, String name, String description, String resource, String action) {
        if (!existingNames.contains(name)) {
            list.add(createPermission(name, description, resource, action));
        }
    }

    private Permission createPermission(String name, String description, String resource, String action) {
        Resource res;
        Action act;
        try {
            res = Resource.valueOf(resource);
            act = Action.valueOf(action);
        } catch (IllegalArgumentException e) {
            log.error("Resource ou Action inválido(s): resource={}, action={}", resource, action);
            throw new IllegalArgumentException("Resource ou Action inválido(s): " + resource + "/" + action);
        }
        return Permission.builder()
                .name(name)
                .description(description)
                .resource(res)
                .action(act)
                .build();
    }

    /**
     * Associa permissões a um usuário
     */
    @Transactional
    public Usuario addPermissionsToUsuario(UUID usuarioId, List<String> permissionNames) {
        // Busca usuário com permissões já inicializadas (evita N+1)
        Usuario usuario = usuarioRepository.findByIdWithPermissions(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        // Busca todas as permissões de uma vez usando findByNameIn (apenas 1 query)
        List<Permission> permissions = permissionRepository.findByNameIn(permissionNames);
        
        // Verifica se todas as permissões foram encontradas
        if (permissions.size() != permissionNames.size()) {
            List<String> found = permissions.stream().map(Permission::getName).toList();
            List<String> missing = permissionNames.stream()
                    .filter(name -> !found.contains(name))
                    .toList();
            throw new IllegalArgumentException("Permissão(ões) não encontrada(s): " + String.join(", ", missing));
        }
        
        usuario.getPermissions().addAll(permissions);
        return usuarioRepository.save(usuario);
    }

    /**
     * Remove permissões de um usuário
     */
    @Transactional
    public Usuario removePermissionsFromUsuario(UUID usuarioId, List<String> permissionNames) {
        // Busca usuário com permissões já inicializadas (evita N+1)
        Usuario usuario = usuarioRepository.findByIdWithPermissions(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        usuario.getPermissions().removeIf(p -> permissionNames.contains(p.getName()));
        return usuarioRepository.save(usuario);
    }

    /**
     * Obtém todas as permissões de um usuário
     */
    @Transactional(readOnly = true)
    public Set<Permission> getUsuarioPermissions(UUID usuarioId) {
        // Busca usuário com permissões já inicializadas para evitar LazyInitializationException
        return usuarioRepository.findByIdWithPermissions(usuarioId)
                .map(Usuario::getPermissions)
                .orElse(Collections.emptySet());
    }
}
