package com.api.sistema_penal.config;

import com.api.sistema_penal.domain.entity.Permission;
import com.api.sistema_penal.domain.entity.Usuario;
import com.api.sistema_penal.domain.repository.PermissionRepository;
import com.api.sistema_penal.domain.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * Inicializador de dados padrão do sistema.
 * Cria usuários de teste e permissões na primeira execução.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PermissionRepository permissionRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        inicializarPermissoes();
        criarUsuariosDeTeste();
    }

    private void inicializarPermissoes() {
        // Cria permissões padrão se não existirem
        List<String> existingNames = permissionRepository.findAll().stream()
            .map(Permission::getName)
            .toList();
        
        List<Permission> novas = new ArrayList<>();
        
        // Permissões por role
        String[][] perms = {
            // ADMIN - gestão técnica (sem decisões jurídicas)
            {"ADMIN", "USUARIO_CREATE"}, {"ADMIN", "USUARIO_READ"}, {"ADMIN", "USUARIO_UPDATE"}, {"ADMIN", "USUARIO_DELETE"},
            {"ADMIN", "LEI_CREATE"}, {"ADMIN", "LEI_READ"}, {"ADMIN", "LEI_UPDATE"}, {"ADMIN", "LEI_DELETE"},
            {"ADMIN", "ARTIGO_CREATE"}, {"ADMIN", "ARTIGO_READ"}, {"ADMIN", "ARTIGO_UPDATE"}, {"ADMIN", "ARTIGO_DELETE"},
            {"ADMIN", "PROCESSO_READ"},  // apenas visualização técnica
            {"ADMIN", "SENTENCA_READ"},  // apenas visualização
            {"ADMIN", "DASHBOARD_READ"}, {"ADMIN", "DASHBOARD_RELATORIO"},
            {"ADMIN", "BLOCKCHAIN_REGISTER"}, {"ADMIN", "BLOCKCHAIN_VERIFY"},
            {"ADMIN", "MONITORAMENTO_CREATE"}, {"ADMIN", "MONITORAMENTO_READ"},
            {"ADMIN", "PERMISSION_ALL"},
            // JUIZ
            {"JUIZ", "PROCESSO_READ"}, {"JUIZ", "PROCESSO_UPDATE"}, {"JUIZ", "SENTENCA_CREATE"}, 
            {"JUIZ", "SENTENCA_READ"}, {"JUIZ", "SENTENCA_UPDATE"}, {"JUIZ", "LEI_READ"}, 
            {"JUIZ", "ARTIGO_READ"}, {"JUIZ", "JURISPRUDENCIA_READ"}, {"JUIZ", "DASHBOARD_READ"},
            // PROCURADOR
            {"PROCURADOR", "PROCESSO_CREATE"}, {"PROCURADOR", "PROCESSO_READ"}, 
            {"PROCURADOR", "LEI_READ"}, {"PROCURADOR", "ARTIGO_READ"},
            {"PROCURADOR", "JURISPRUDENCIA_READ"}, {"PROCURADOR", "DASHBOARD_READ"},
            // ADVOGADO
            {"ADVOGADO", "PROCESSO_READ"}, {"ADVOGADO", "LEI_READ"}, 
            {"ADVOGADO", "ARTIGO_READ"}, {"ADVOGADO", "JURISPRUDENCIA_READ"},
            // ESTUDANTE
            {"ESTUDANTE", "LEI_READ"}, {"ESTUDANTE", "ARTIGO_READ"}, 
            {"ESTUDANTE", "JURISPRUDENCIA_READ"}, {"ESTUDANTE", "BUSCA_EXECUTE"}
        };
        
        Map<String, List<String>> rolePerms = new HashMap<>();
        for (String[] p : perms) {
            rolePerms.computeIfAbsent(p[0], k -> new ArrayList<>()).add(p[1]);
        }
        
        // Criar permissões
        for (Map.Entry<String, List<String>> entry : rolePerms.entrySet()) {
            String role = entry.getKey();
            for (String perm : entry.getValue()) {
                String name = role + "_" + perm;
                if (!existingNames.contains(name)) {
                    Permission p = Permission.builder()
                        .name(name)
                        .description("Permissão " + perm + " para role " + role)
                        .build();
                    novas.add(p);
                }
            }
        }
        
        if (!novas.isEmpty()) {
            permissionRepository.saveAll(novas);
            log.info("{} permissões de roles criadas", novas.size());
        }
    }

    private void criarUsuariosDeTeste() {
        log.info("=== CRIANDO USUÁRIOS DE TESTE ===");
        
        // Credenciais via variáveis de ambiente (fallback para dev local)
        String adminEmail = System.getenv("ADMIN_EMAIL") != null ? System.getenv("ADMIN_EMAIL") : "admin@sistema.gov.ao";
        String adminSenha = System.getenv("ADMIN_PASSWORD") != null ? System.getenv("ADMIN_PASSWORD") : "admin123";
        String adminNome = System.getenv("ADMIN_NAME") != null ? System.getenv("ADMIN_NAME") : "Administrador";
        
        // Admin - usuário principal
        criarUsuarioComPermissoes(
            adminEmail, 
            adminSenha, 
            adminNome, 
            Usuario.Role.ADMIN,
            List.of(
                // Gestão de Utilizadores
                "ADMIN_USUARIO_CREATE", "ADMIN_USUARIO_READ", "ADMIN_USUARIO_UPDATE", "ADMIN_USUARIO_DELETE",
                // Gestão da Base Jurídica
                "ADMIN_LEI_CREATE", "ADMIN_LEI_READ", "ADMIN_LEI_UPDATE", "ADMIN_LEI_DELETE",
                "ADMIN_ARTIGO_CREATE", "ADMIN_ARTIGO_READ", "ADMIN_ARTIGO_UPDATE", "ADMIN_ARTIGO_DELETE",
                // Gestão de Processos (apenas visualização técnica)
                "ADMIN_PROCESSO_READ",
                // Gestão de Sentenças (apenas visualização)
                "ADMIN_SENTENCA_READ",
                // Dashboard e Estatísticas
                "ADMIN_DASHBOARD_READ", "ADMIN_DASHBOARD_RELATORIO",
                // Blockchain
                "ADMIN_BLOCKCHAIN_REGISTER", "ADMIN_BLOCKCHAIN_VERIFY",
                // Monitoramento
                "ADMIN_MONITORAMENTO_CREATE", "ADMIN_MONITORAMENTO_READ",
                // Permissões
                "ADMIN_PERMISSION_ALL"
            )
        );
        
        // Juiz - usuário de teste
        criarUsuarioComPermissoes(
            "juiz@tribunal.gov.ao", 
            "juiz123", 
            "Dr. João Manuel", 
            Usuario.Role.JUIZ,
            List.of(
                "JUIZ_PROCESSO_READ", "JUIZ_PROCESSO_UPDATE", "JUIZ_SENTENCA_CREATE",
                "JUIZ_SENTENCA_READ", "JUIZ_SENTENCA_UPDATE", "JUIZ_LEI_READ",
                "JUIZ_ARTIGO_READ", "JUIZ_JURISPRUDENCIA_READ", "JUIZ_DASHBOARD_READ"
            )
        );
        
        // Procurador - usuário de teste
        criarUsuarioComPermissoes(
            "procurador@ministeriopublico.gov.ao", 
            "procurador123", 
            "Dr. Maria Sousa", 
            Usuario.Role.PROCURADOR,
            List.of(
                "PROCURADOR_PROCESSO_CREATE", "PROCURADOR_PROCESSO_READ",
                "PROCURADOR_LEI_READ", "PROCURADOR_ARTIGO_READ",
                "PROCURADOR_JURISPRUDENCIA_READ", "PROCURADOR_DASHBOARD_READ"
            )
        );
        
        // Advogado - usuário de teste
        criarUsuarioComPermissoes(
            "advogado@oab.ao", 
            "advogado123", 
            "Dr. Carlos Alberto", 
            Usuario.Role.ADVOGADO,
            List.of(
                "ADVOGADO_PROCESSO_READ", "ADVOGADO_LEI_READ", 
                "ADVOGADO_ARTIGO_READ", "ADVOGADO_JURISPRUDENCIA_READ"
            )
        );
        
        // Estudante - usuário de teste
        criarUsuarioComPermissoes(
            "estudante@universidade.ao", 
            "estudante123", 
            "Pedro Silva", 
            Usuario.Role.ESTUDANTE,
            List.of(
                "ESTUDANTE_LEI_READ", "ESTUDANTE_ARTIGO_READ", 
                "ESTUDANTE_JURISPRUDENCIA_READ", "ESTUDANTE_BUSCA_EXECUTE"
            )
        );
        
        log.info("==============================================");
        log.info("| Role          | Email                             |");
        log.info("|---------------|-----------------------------------|");
        log.info("| ADMIN        | {}            |", adminEmail);
        log.info("| JUIZ         | juiz@tribunal.gov.ao            |");
        log.info("| PROCURADOR   | prosecutor@ministeriopublico.gov.ao|");
        log.info("| ADVOGADO     | advogado@oab.ao                 |");
        log.info("| ESTUDANTE    | estudante@universidade.ao        |");
        log.info("==============================================");
        log.info("=> Credenciais disponíveis no primeiro login");
    }

    private void criarUsuarioComPermissoes(String email, String senha, String nome, 
                                            Usuario.Role role, List<String> permNames) {
        Optional<Usuario> existente = usuarioRepository.findByEmail(email);
        
        if (existente.isEmpty()) {
            // Busca as permissões
            List<Permission> perms = permissionRepository.findByNameIn(permNames);
            
            Usuario usuario = Usuario.builder()
                    .email(email)
                    .senhaHash(passwordEncoder.encode(senha))
                    .nome(nome)
                    .role(role)
                    .ativo(true)
                    .permissions(new HashSet<>(perms))
                    .build();
            
            usuarioRepository.save(usuario);
            log.info("Criado: {} ({}) - {} permissões", email, role, perms.size());
        }
    }
}
