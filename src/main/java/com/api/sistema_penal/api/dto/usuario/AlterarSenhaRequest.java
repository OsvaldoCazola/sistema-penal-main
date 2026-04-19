package com.api.sistema_penal.api.dto.usuario;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AlterarSenhaRequest(
        @NotBlank(message = "Senha atual é obrigatória")
        String senhaAtual,
        
        @NotBlank(message = "Nova senha é obrigatória")
        @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
        String novaSenha
) {}
