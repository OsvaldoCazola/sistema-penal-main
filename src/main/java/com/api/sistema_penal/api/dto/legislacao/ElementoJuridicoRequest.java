package com.api.sistema_penal.api.dto.legislacao;

import com.api.sistema_penal.domain.entity.ElementoJuridico;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ElementoJuridicoRequest(
        @NotNull(message = "Tipo de elemento é obrigatório")
        ElementoJuridico.TipoElemento tipo,

        @NotBlank(message = "Conteúdo é obrigatório")
        String conteudo,

        Integer ordem,

        String descricao
) {}
