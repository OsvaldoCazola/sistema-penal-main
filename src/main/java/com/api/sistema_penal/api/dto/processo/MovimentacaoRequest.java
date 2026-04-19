package com.api.sistema_penal.api.dto.processo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.List;

public record MovimentacaoRequest(
        @NotBlank(message = "Tipo é obrigatório")
        String tipo,

        @NotBlank(message = "Descrição é obrigatória")
        String descricao,

        @NotNull(message = "Data do evento é obrigatória")
        LocalDateTime dataEvento,

        List<AnexoRequest> anexos
) {
    public record AnexoRequest(
            String nome,
            String url,
            String tipo,
            Long tamanhoBytes
    ) {}
}
