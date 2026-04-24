package com.api.sistema_penal.security;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    @Value("${security.cors.allowed-origins:http://localhost:3000,http://localhost:3001}")
    private String[] allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Necessário para o console H2 no perfil de desenvolvimento
            .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin))
            .authorizeHttpRequests(auth -> auth
                // ── Preflight OPTIONS ────────────────────────────────────
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // ── Autenticação (pública) ───────────────────────────────
                .requestMatchers("/auth/login").permitAll()
                .requestMatchers("/auth/register").permitAll()
                .requestMatchers("/auth/refresh").permitAll()
                .requestMatchers("/auth/logout").permitAll()
                .requestMatchers("/auth/esqueci-senha").permitAll()
                .requestMatchers("/auth/redefinir-senha").permitAll()

                // CORRIGIDO: /auth/register-admin só acessível para ADMIN autenticado
                // (não deve ser endpoint público em produção)
                .requestMatchers("/auth/register-admin").hasRole("ADMIN")

                // ── Swagger / OpenAPI ────────────────────────────────────
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                .requestMatchers("/api-docs/**").permitAll()

                // ── Actuator (health e info são públicos) ─────────────────
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                .requestMatchers("/actuator/**").hasRole("ADMIN")

                // ── Console H2 (apenas em dev, bloqueado via perfil) ──────
                .requestMatchers("/h2-console/**").permitAll()

                // ── Leitura pública de legislação ─────────────────────────
                .requestMatchers(HttpMethod.GET, "/leis/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/artigos/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/sentencas/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/busca/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/tipos-crime/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/noticias/**").permitAll()

                // ── Chat público ──────────────────────────────────────────
                .requestMatchers(HttpMethod.POST, "/chat").permitAll()

                // ── Denúncias (envio público, consulta por protocolo) ─────
                .requestMatchers(HttpMethod.POST, "/denuncias").permitAll()
                .requestMatchers(HttpMethod.GET, "/denuncias/consulta/**").permitAll()

                // ── Escrita em legislação — apenas ADMIN ──────────────────
                .requestMatchers(HttpMethod.POST, "/leis/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/leis/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PATCH, "/leis/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/leis/**").hasRole("ADMIN")

                // ── Admin geral ────────────────────────────────────────────
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/permissions/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/permissions/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/permissions/**").hasRole("ADMIN")
                .requestMatchers("/api/permissions").hasRole("ADMIN")
                .requestMatchers("/api/permissions/usuario/*").hasRole("ADMIN")

                // ── Tudo o resto requer autenticação ──────────────────────
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("Authorization", "Content-Type", "X-Total-Count"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12); // CORRIGIDO: strength 12 para produção (padrão 10)
    }
}
