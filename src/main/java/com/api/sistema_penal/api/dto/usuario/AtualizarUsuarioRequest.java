package com.api.sistema_penal.api.dto.usuario;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

import java.util.Map;

public record AtualizarUsuarioRequest(
        @Size(min = 3, max = 255, message = "Nome deve ter entre 3 e 255 caracteres")
        String nome,
        
        @Email(message = "Email inválido")
        String email,
        
        Map<String, Object> metadata
) {}
