package com.api.sistema_penal.api.dto.auth;

import com.api.sistema_penal.domain.entity.Usuario;
import com.fasterxml.jackson.annotation.JsonProperty;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        Long expiresIn,
        UsuarioResponse usuario
) {
    public static AuthResponse of(String accessToken, String refreshToken, Long expiresIn, Usuario usuario) {
        return new AuthResponse(
                accessToken,
                refreshToken,
                "Bearer",
                expiresIn,
                UsuarioResponse.from(usuario)
        );
    }
}
