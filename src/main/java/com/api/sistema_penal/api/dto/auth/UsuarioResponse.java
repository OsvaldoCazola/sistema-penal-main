package com.api.sistema_penal.api.dto.auth;

import com.api.sistema_penal.domain.entity.Usuario;

import java.time.LocalDateTime;
import java.util.UUID;

public record UsuarioResponse(
        UUID id,
        String nome,
        String email,
        String role,
        LocalDateTime ultimoLogin,
        LocalDateTime createdAt
) {
    public static UsuarioResponse from(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getRole().name(),
                usuario.getUltimoLogin(),
                usuario.getCreatedAt()
        );
    }
}
