package com.api.sistema_penal.security;

import com.api.sistema_penal.domain.entity.Usuario;
import com.api.sistema_penal.domain.repository.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);

        try {
            final String userEmail = jwtService.extractUsername(jwt);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                Usuario usuario = null;
                
                // Tentar buscar por ID primeiro (mais eficiente)
                try {
                    String userIdStr = jwtService.extractUserId(jwt);
                    if (userIdStr != null && !userIdStr.isEmpty()) {
                        usuario = usuarioRepository.findById(UUID.fromString(userIdStr)).orElse(null);
                    }
                } catch (Exception e) {
                    log.debug("Token não contém userId, buscando por email");
                }
                
                // Fallback para tokens antigos
                if (usuario == null) {
                    usuario = usuarioRepository.findByEmail(userEmail).orElse(null);
                }

                if (usuario != null && jwtService.isTokenValid(jwt, usuario)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            usuario,
                            null,
                            usuario.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    log.warn("Token inválido ou usuário não encontrado para o email: " + userEmail);
                }
            }
        } catch (Exception e) {
            log.error("Erro ao processar token JWT: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
