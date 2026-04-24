package com.api.sistema_penal.config;

import com.api.sistema_penal.domain.entity.Permission;
import com.api.sistema_penal.domain.entity.Usuario;
import com.api.sistema_penal.domain.repository.PermissionRepository;
import com.api.sistema_penal.domain.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * Inicializador de dados padrão do sistema.
 * Cria utilizadores iniciais e permissões na primeira execução.
 *
 * ⚠️  SEGURANÇA: As senhas são obrigatoriamente lidas de variáveis de ambiente.
 *     Em desenvolvimento, defina-as no ficheiro .env.
 *     Em produção, NUNCA use valores padrão — a aplicação recusará iniciar
 *     se as variáveis obrigatórias não estiverem definidas.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PermissionRepository permissionRepository;
    private final PasswordEncoder passwordEncoder;
    private final Environment env;

    @Override
    public void run(String... args) {
        validarAmbiente();
        inicializarPermissoes();
        criarUtilizadoresIniciais();
    }

    /**
     * Valida que as variáveis de ambiente obrigatórias estão definidas.
     * Em produção (profile != h2/test), lança excepção se alguma estiver em falta.
     */
    private void validarAmbiente() {
        boolean isProd = !Arrays.asList(env.getActiveProfiles()).contains("h2")
                      && !Arrays.asList(env.getActiveProfiles()).contains("test");

        if (isProd) {
            List<String> ausentes = new ArrayList<>();
            if (isNullOrBlank(System.getenv("ADMIN_PASSWORD")))       ausentes.add("ADMIN_PASSWORD");
            if (isNullOrBlank(System.getenv("JUIZ_PASSWORD")))        ausentes.add("JUIZ_PASSWORD");
            if (isNullOrBlank(System.getenv("PROCURADOR_PASSWORD")))  ausentes.add("PROCURADOR_PASSWORD");
            if (isNullOrBlank(System.getenv("ADVOGADO_PASSWORD")))    ausentes.add("ADVOGADO_PASSWORD");
            if (isNullOrBlank(System.getenv("ESTUDANTE_PASSWORD")))   ausentes.add("ESTUDANTE_PASSWORD");

            if (!ausentes.isEmpty()) {
                throw new IllegalStateException(
                    "Variáveis de ambiente obrigatórias não definidas em produção: " + ausentes +
                    ". Defina-as antes de iniciar a aplicação."
                );
            }
        } else {
            log.warn("========================================================");
            log.warn("  AVISO: A aplicação está em modo de desenvolvimento.");
            log.warn("  As senhas de fallback APENAS funcionam no profile h2/test.");
            log.warn("  Em produção, todas as senhas devem vir de variáveis de ambiente.");
            log.warn("========================================================");
        }
    }

    private void inicializarPermissoes() {
        List<String> existingNames = permissionRepository.findAll().stream()
            .map(Permission::getName)
            .toList();

        List<Permission> novas = new ArrayList<>();

        String[][] perms = {
            // ADMIN
            {"ADMIN", "USUARIO_CREATE"}, {"ADMIN", "USUARIO_READ"}, {"ADMIN", "USUARIO_UPDATE"}, {"ADMIN", "USUARIO_DELETE"},
            {"ADMIN", "LEI_CREATE"}, {"ADMIN", "LEI_READ"}, {"ADMIN", "LEI_UPDATE"}, {"ADMIN", "LEI_DELETE"},
            {"ADMIN", "ARTIGO_CREATE"}, {"ADMIN", "ARTIGO_READ"}, {"ADMIN", "ARTIGO_UPDATE"}, {"ADMIN", "ARTIGO_DELETE"},
            {"ADMIN", "PROCESSO_READ"}, {"ADMIN", "SENTENCA_READ"},
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

        for (Map.Entry<String, List<String>> entry : rolePerms.entrySet()) {
            String role = entry.getKey();
            for (String perm : entry.getValue()) {
                String name = role + "_" + perm;
                if (!existingNames.contains(name)) {
                    novas.add(Permission.builder()
                        .name(name)
                        .description("Permissão " + perm + " para role " + role)
                        .build());
                }
            }
        }

        if (!novas.isEmpty()) {
            permissionRepository.saveAll(novas);
            log.info("{} permissões criadas", novas.size());
        }
    }

    private void criarUtilizadoresIniciais() {
        log.info("=== VERIFICANDO UTILIZADORES INICIAIS ===");

        // Senhas lidas de variáveis de ambiente.
        // Em produção (perfil != h2/test): são obrigatórias.
        // Em desenvolvimento (perfil h2/test): usa fallbacks fixos para facilitar testes.
        criarUtilizadorComPermissoes(
            env("ADMIN_EMAIL",      "admin@sistema.gov.ao"),
            env("ADMIN_PASSWORD",   "Admin@2024!"),   // fallback fixo para dev h2/test
            env("ADMIN_NAME",       "Administrador"),
            Usuario.Role.ADMIN,
            List.of(
                "ADMIN_USUARIO_CREATE", "ADMIN_USUARIO_READ", "ADMIN_USUARIO_UPDATE", "ADMIN_USUARIO_DELETE",
                "ADMIN_LEI_CREATE", "ADMIN_LEI_READ", "ADMIN_LEI_UPDATE", "ADMIN_LEI_DELETE",
                "ADMIN_ARTIGO_CREATE", "ADMIN_ARTIGO_READ", "ADMIN_ARTIGO_UPDATE", "ADMIN_ARTIGO_DELETE",
                "ADMIN_PROCESSO_READ", "ADMIN_SENTENCA_READ",
                "ADMIN_DASHBOARD_READ", "ADMIN_DASHBOARD_RELATORIO",
                "ADMIN_BLOCKCHAIN_REGISTER", "ADMIN_BLOCKCHAIN_VERIFY",
                "ADMIN_MONITORAMENTO_CREATE", "ADMIN_MONITORAMENTO_READ",
                "ADMIN_PERMISSION_ALL"
            )
        );

        criarUtilizadorComPermissoes(
            env("JUIZ_EMAIL",       "juiz@tribunal.gov.ao"),
            env("JUIZ_PASSWORD",    "Juiz@2024!"),    // fallback fixo para dev h2/test
            env("JUIZ_NAME",        "Dr. João Manuel"),
            Usuario.Role.JUIZ,
            List.of(
                "JUIZ_PROCESSO_READ", "JUIZ_PROCESSO_UPDATE", "JUIZ_SENTENCA_CREATE",
                "JUIZ_SENTENCA_READ", "JUIZ_SENTENCA_UPDATE", "JUIZ_LEI_READ",
                "JUIZ_ARTIGO_READ", "JUIZ_JURISPRUDENCIA_READ", "JUIZ_DASHBOARD_READ"
            )
        );

        criarUtilizadorComPermissoes(
            env("PROCURADOR_EMAIL",    "procurador@ministeriopublico.gov.ao"),
            env("PROCURADOR_PASSWORD", "Proc@2024!"),  // fallback fixo para dev h2/test
            env("PROCURADOR_NAME",     "Dra. Maria Sousa"),
            Usuario.Role.PROCURADOR,
            List.of(
                "PROCURADOR_PROCESSO_CREATE", "PROCURADOR_PROCESSO_READ",
                "PROCURADOR_LEI_READ", "PROCURADOR_ARTIGO_READ",
                "PROCURADOR_JURISPRUDENCIA_READ", "PROCURADOR_DASHBOARD_READ"
            )
        );

        criarUtilizadorComPermissoes(
            env("ADVOGADO_EMAIL",    "advogado@oab.ao"),
            env("ADVOGADO_PASSWORD", "Adv@2024!"),  // fallback fixo para dev h2/test
            env("ADVOGADO_NAME",     "Dr. Pedro Lopes"),
            Usuario.Role.ADVOGADO,
            List.of(
                "ADVOGADO_PROCESSO_READ", "ADVOGADO_LEI_READ",
                "ADVOGADO_ARTIGO_READ", "ADVOGADO_JURISPRUDENCIA_READ"
            )
        );

        criarUtilizadorComPermissoes(
            env("ESTUDANTE_EMAIL",    "estudante@universidade.ao"),
            env("ESTUDANTE_PASSWORD", "Est@2024!"),  // fallback fixo para dev h2/test
            env("ESTUDANTE_NAME",     "Ana Silva"),
            Usuario.Role.ESTUDANTE,
            List.of(
                "ESTUDANTE_LEI_READ", "ESTUDANTE_ARTIGO_READ",
                "ESTUDANTE_JURISPRUDENCIA_READ", "ESTUDANTE_BUSCA_EXECUTE"
            )
        );
    }

    private void criarUtilizadorComPermissoes(
            String email, String senha, String nome,
            Usuario.Role role, List<String> permissoes) {

        if (usuarioRepository.findByEmail(email).isPresent()) {
            log.debug("Utilizador já existe: {}", email);
            return;
        }

        if (isNullOrBlank(senha)) {
            log.error("Senha não definida para {}. Defina a variável de ambiente correspondente.", email);
            return;
        }

        List<Permission> perms = permissoes.stream()
            .map(name -> permissionRepository.findByName(name).orElse(null))
            .filter(Objects::nonNull)
            .toList();

        Usuario usuario = Usuario.builder()
            .email(email)
            .senhaHash(passwordEncoder.encode(senha))
            .nome(nome)
            .role(role)
            .ativo(true)
            .permissions(new HashSet<>(perms))
            .build();

        usuarioRepository.save(usuario);
        log.info("Utilizador criado: {} ({})", email, role);
    }

    /** Lê variável de ambiente; devolve fallback se em modo desenvolvimento. */
    private String env(String key, String fallbackParaDev) {
        String value = System.getenv(key);
        if (!isNullOrBlank(value)) return value;

        boolean isDev = Arrays.asList(env.getActiveProfiles()).contains("h2")
                     || Arrays.asList(env.getActiveProfiles()).contains("test");

        if (isDev && fallbackParaDev != null) {
            // Em dev, gera uma senha aleatória se o fallback for null (senhas de utilizadores)
            return fallbackParaDev;
        }

        // Gera senha aleatória segura como último recurso (conta ficará inacessível)
        if (fallbackParaDev == null) {
            String random = UUID.randomUUID().toString();
            log.warn("Variável {} não definida. Senha gerada aleatoriamente — utilizador ficará inacessível.", key);
            return random;
        }

        return fallbackParaDev;
    }

    private boolean isNullOrBlank(String s) {
        return s == null || s.isBlank();
    }
}
