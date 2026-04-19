package com.api.sistema_penal.api.dto.legislacao;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record LeiRequest(
        @NotBlank(message = "Tipo é obrigatório")
        String tipo,

        @NotBlank(message = "Número é obrigatório")
        String numero,

        @NotNull(message = "Ano é obrigatório")
        Integer ano,

        @NotBlank(message = "Título é obrigatório")
        String titulo,

        String ementa,

        String conteudo,

        LocalDate dataPublicacao,

        LocalDate dataVigencia,

        String fonteUrl,

        Map<String, Object> metadata,

        List<ArtigoRequest> artigos
) {}
