package com.api.sistema_penal.api.dto.processo;

import com.api.sistema_penal.domain.entity.Processo;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record ProcessoResponse(
        UUID id,
        String numero,
        String status,
        String fase,
        LocalDate dataAbertura,
        LocalDate dataFato,
        LocalDate dataEncerramento,
        String descricaoFatos,
        String localFato,
        String provincia,
        List<Processo.Parte> partes,
        Map<String, Object> metadata,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ProcessoResponse from(Processo p) {
        return new ProcessoResponse(
                p.getId(),
                p.getNumero(),
                p.getStatus().name(),
                p.getFase(),
                p.getDataAbertura(),
                p.getDataFato(),
                p.getDataEncerramento(),
                p.getDescricaoFatos(),
                p.getLocalFato(),
                p.getProvincia(),
                p.getPartes(),
                p.getMetadata(),
                p.getCreatedAt(),
                p.getUpdatedAt()
        );
    }
}
