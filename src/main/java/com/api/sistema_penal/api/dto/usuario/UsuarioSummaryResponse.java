package com.api.sistema_penal.api.dto.usuario;

import com.api.sistema_penal.domain.entity.Usuario;
import com.api.sistema_penal.domain.entity.Usuario.Role;

import java.time.LocalDateTime;
import java.util.UUID;

public record UsuarioSummaryResponse(
        UUID id,
        String nome,
        String email,
        Role role,
        Boolean ativo,
        LocalDateTime ultimoLogin,
        LocalDateTime createdAt
) {
    public static UsuarioSummaryResponse from(Usuario usuario) {
        return new UsuarioSummaryResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getRole(),
                usuario.getAtivo(),
                usuario.getUltimoLogin(),
                usuario.getCreatedAt()
        );
    }
}
