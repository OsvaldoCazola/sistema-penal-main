package com.api.sistema_penal.api.dto.auth;

import com.api.sistema_penal.domain.entity.Usuario.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record RegisterRequest(
        @NotBlank(message = "Nome é obrigatório")
        @Size(min = 3, max = 255, message = "Nome deve ter entre 3 e 255 caracteres")
        String nome,

        @NotBlank(message = "Email é obrigatório")
        @Email(message = "Email inválido")
        String email,

        @NotBlank(message = "Senha é obrigatória")
        @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres")
        String senha,
        
        @NotNull(message = "Role é obrigatório")
        Role role,
        
        UUID tribunalId
) {}
