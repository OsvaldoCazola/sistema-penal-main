package com.api.sistema_penal.api.dto.legislacao;

import com.api.sistema_penal.domain.entity.Lei;

import java.time.LocalDate;
import java.util.UUID;

public record LeiSummaryResponse(
        UUID id,
        String tipo,
        String numero,
        Integer ano,
        String titulo,
        String ementa,
        LocalDate dataPublicacao,
        String status,
        int totalArtigos
) {
    public static LeiSummaryResponse from(Lei lei) {
        return new LeiSummaryResponse(
                lei.getId(),
                lei.getTipo(),
                lei.getNumero(),
                lei.getAno(),
                lei.getTitulo(),
                lei.getEmenta(),
                lei.getDataPublicacao(),
                lei.getStatus().name(),
                lei.getArtigos().size()
        );
    }
}
