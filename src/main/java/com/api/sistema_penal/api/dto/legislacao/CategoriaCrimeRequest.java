package com.api.sistema_penal.api.dto.legislacao;

import jakarta.validation.constraints.NotBlank;

public record CategoriaCrimeRequest(
        @NotBlank(message = "Nome é obrigatório")
        String nome,

        String descricao,

        String codigo
) {}
