package com.api.sistema_penal.api.dto.processo;

import com.api.sistema_penal.domain.entity.Processo;

import java.time.LocalDate;
import java.util.UUID;

public record ProcessoSummaryResponse(
        UUID id,
        String numero,
        String status,
        String fase,
        LocalDate dataAbertura,
        String provincia
) {
    public static ProcessoSummaryResponse from(Processo p) {
        return new ProcessoSummaryResponse(
                p.getId(),
                p.getNumero(),
                p.getStatus().name(),
                p.getFase(),
                p.getDataAbertura(),
                p.getProvincia()
        );
    }
}
