package com.api.sistema_penal.api.dto.legislacao;

import com.api.sistema_penal.domain.entity.Lei;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public record LeiResponse(
        UUID id,
        String tipo,
        String numero,
        Integer ano,
        String titulo,
        String ementa,
        String conteudo,
        LocalDate dataPublicacao,
        LocalDate dataVigencia,
        String status,
        String fonteUrl,
        Map<String, Object> metadata,
        List<ArtigoResponse> artigos,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static LeiResponse from(Lei lei) {
        return new LeiResponse(
                lei.getId(),
                lei.getTipo(),
                lei.getNumero(),
                lei.getAno(),
                lei.getTitulo(),
                lei.getEmenta(),
                lei.getConteudo(),
                lei.getDataPublicacao(),
                lei.getDataVigencia(),
                lei.getStatus().name(),
                lei.getFonteUrl(),
                lei.getMetadata(),
                lei.getArtigos().stream().map(ArtigoResponse::from).toList(),
                lei.getCreatedAt(),
                lei.getUpdatedAt()
        );
    }

    public static LeiResponse fromSemArtigos(Lei lei) {
        return new LeiResponse(
                lei.getId(),
                lei.getTipo(),
                lei.getNumero(),
                lei.getAno(),
                lei.getTitulo(),
                lei.getEmenta(),
                null,
                lei.getDataPublicacao(),
                lei.getDataVigencia(),
                lei.getStatus().name(),
                lei.getFonteUrl(),
                lei.getMetadata(),
                null,
                lei.getCreatedAt(),
                lei.getUpdatedAt()
        );
    }
}
