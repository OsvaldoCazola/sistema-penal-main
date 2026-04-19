package com.api.sistema_penal.api.dto.processo;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record ProcessoRequest(
        @NotBlank(message = "Número do processo é obrigatório")
        String numero,

        UUID tribunalId,

        UUID tipoCrimeId,

        @NotNull(message = "Data de abertura é obrigatória")
        LocalDate dataAbertura,

        LocalDate dataFato,

        String descricaoFatos,

        String localFato,

        String provincia,

        String fase,

        List<ParteRequest> partes,

        Map<String, Object> metadata
) {
    public record ParteRequest(
            @NotBlank(message = "Tipo da parte é obrigatório")
            String tipo,
            @NotBlank(message = "Nome da parte é obrigatório")
            String nome,
            String documento,
            String tipoDocumento,
            String endereco,
            String telefone,
            String advogadoNome,
            String advogadoOab
    ) {}
}
