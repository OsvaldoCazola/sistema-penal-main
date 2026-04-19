package com.api.sistema_penal.api.dto.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public record RefreshTokenRequest(
        @NotBlank(message = "Refresh token é obrigatório")
        @JsonProperty("refresh_token")
        String refreshToken
) {}
