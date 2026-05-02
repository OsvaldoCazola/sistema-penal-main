package com.api.sistema_penal.config;

import com.api.sistema_penal.domain.entity.Usuario;
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
    private final PasswordEncoder passwordEncoder;
    private final Environment env;

    @Override
    public void run(String... args) {
        validarAmbiente();
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

    private void criarUtilizadoresIniciais() {
        log.info("=== VERIFICANDO UTILIZADORES INICIAIS (ADMIN + ESTUDANTE) ===");

        criarUtilizador(
                env("ADMIN_EMAIL", "admin@sistema.gov.ao"),
                env("ADMIN_PASSWORD", "Admin@2024!"),
                env("ADMIN_NAME", "Administrador"),
                Usuario.Role.ADMIN
        );

        criarUtilizador(
                env("ESTUDANTE_EMAIL", "estudante@universidade.ao"),
                env("ESTUDANTE_PASSWORD", "Est@2024!"),
                env("ESTUDANTE_NAME", "Ana Silva"),
                Usuario.Role.ESTUDANTE
        );
    }

    private void criarUtilizador(String email, String senha, String nome, Usuario.Role role) {
        if (usuarioRepository.findByEmail(email).isPresent()) {
            log.debug("Utilizador já existe: {}", email);
            return;
        }

        if (isNullOrBlank(senha)) {
            log.error("Senha não definida para {}. Defina a variável de ambiente correspondente.", email);
            return;
        }

        Usuario usuario = Usuario.builder()
                .email(email)
                .senhaHash(passwordEncoder.encode(senha))
                .nome(nome)
                .role(role)
                .ativo(true)
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
