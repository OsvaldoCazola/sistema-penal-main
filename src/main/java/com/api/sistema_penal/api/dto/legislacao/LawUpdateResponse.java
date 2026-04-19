package com.api.sistema_penal.api.dto.legislacao;

import com.api.sistema_penal.domain.entity.LawUpdate;

import java.time.LocalDateTime;
import java.util.UUID;

public record LawUpdateResponse(
    UUID id,
    String tipo,
    String numero,
    Integer ano,
    String titulo,
    String ementa,
    String conteudo,
    String dataPublicacao,
    String dataVigencia,
    String fonteUrl,
    String status,
    String fonteOrigem,
    LocalDateTime dataDescoberta,
    LocalDateTime dataAprovacao,
    String aprovadoPor,
    String motivoRejeicao,
    LocalDateTime createdAt
) {
    public static LawUpdateResponse from(LawUpdate update) {
        return new LawUpdateResponse(
            update.getId(),
            update.getTipo(),
            update.getNumero(),
            update.getAno(),
            update.getTitulo(),
            update.getEmenta(),
            update.getConteudo(),
            update.getDataPublicacao(),
            update.getDataVigencia(),
            update.getFonteUrl(),
            update.getStatus().name(),
            update.getFonteOrigem(),
            update.getDataDescoberta(),
            update.getDataAprovacao(),
            update.getAprovadoPor(),
            update.getMotivoRejeicao(),
            update.getCreatedAt()
        );
    }
}
