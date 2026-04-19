package com.api.sistema_penal.api.dto.legislacao;

import com.api.sistema_penal.domain.entity.Penalidade;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record PenalidadeResponse(
        UUID id,
        String tipoPena,
        Integer penaMinAnos,
        Integer penaMinMeses,
        Integer penaMinDias,
        Integer penaMaxAnos,
        Integer penaMaxMeses,
        Integer penaMaxDias,
        BigDecimal multaMin,
        BigDecimal multaMax,
        String descricao,
        String regime,
        Boolean flagrante,
        Boolean detencao,
        Boolean reclusao,
        UUID artigoId,
        LocalDateTime createdAt
) {
    public static PenalidadeResponse from(Penalidade penalidade) {
        return new PenalidadeResponse(
                penalidade.getId(),
                penalidade.getTipoPena().name(),
                penalidade.getPenaMinAnos(),
                penalidade.getPenaMinMeses(),
                penalidade.getPenaMinDias(),
                penalidade.getPenaMaxAnos(),
                penalidade.getPenaMaxMeses(),
                penalidade.getPenaMaxDias(),
                penalidade.getMultaMin(),
                penalidade.getMultaMax(),
                penalidade.getDescricao(),
                penalidade.getRegime(),
                penalidade.getFlagrante(),
                penalidade.getDetencao(),
                penalidade.getReclusao(),
                penalidade.getArtigo().getId(),
                penalidade.getCreatedAt()
        );
    }

    public String getPenaMinFormatada() {
        StringBuilder sb = new StringBuilder();
        if (penaMinAnos != null && penaMinAnos > 0) sb.append(penaMinAnos).append(" ano(s)");
        if (penaMinMeses != null && penaMinMeses > 0) {
            if (sb.length() > 0) sb.append(" e ");
            sb.append(penaMinMeses).append(" mes(es)");
        }
        if (penaMinDias != null && penaMinDias > 0) {
            if (sb.length() > 0) sb.append(" e ");
            sb.append(penaMinDias).append(" dia(s)");
        }
        return sb.length() > 0 ? sb.toString() : "Não especificada";
    }

    public String getPenaMaxFormatada() {
        StringBuilder sb = new StringBuilder();
        if (penaMaxAnos != null && penaMaxAnos > 0) sb.append(penaMaxAnos).append(" ano(s)");
        if (penaMaxMeses != null && penaMaxMeses > 0) {
            if (sb.length() > 0) sb.append(" e ");
            sb.append(penaMaxMeses).append(" mes(es)");
        }
        if (penaMaxDias != null && penaMaxDias > 0) {
            if (sb.length() > 0) sb.append(" e ");
            sb.append(penaMaxDias).append(" dia(s)");
        }
        return sb.length() > 0 ? sb.toString() : "Não especificada";
    }
}
