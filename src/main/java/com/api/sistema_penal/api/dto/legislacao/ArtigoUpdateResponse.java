package com.api.sistema_penal.api.dto.legislacao;

import com.api.sistema_penal.domain.entity.ArtigoUpdate;

import java.time.LocalDateTime;
import java.util.UUID;

public record ArtigoUpdateResponse(
    UUID id,
    String titulo,
    String conteudo,
    Integer numeroArtigo,
    String nomeSecao,
    Integer ordemSecao,
    UUID leiId,
    String leiIdentificacao,
    String fonteUrl,
    String fonteOrigem,
    String status,
    LocalDateTime dataDescoberta,
    LocalDateTime dataAprovacao,
    String aprovadoPor,
    String motivoRejeicao,
    String artigoId
) {
    public static ArtigoUpdateResponse from(ArtigoUpdate update) {
        return new ArtigoUpdateResponse(
            update.getId(),
            update.getTitulo(),
            update.getConteudo(),
            update.getNumeroArtigo(),
            update.getNomeSecao(),
            update.getOrdemSecao(),
            update.getLei() != null ? update.getLei().getId() : null,
            update.getLeiIdentificacao(),
            update.getFonteUrl(),
            update.getFonteOrigem(),
            update.getStatus().name(),
            update.getDataDescoberta(),
            update.getDataAprovacao(),
            update.getAprovadoPor(),
            update.getMotivoRejeicao(),
            update.getMetadata() != null ? (String) update.getMetadata().get("artigoId") : null
        );
    }
}
