package com.api.sistema_penal.api.dto.legislacao;

import com.api.sistema_penal.domain.entity.LeiIntegridade;

import java.time.LocalDateTime;
import java.util.UUID;

public record LeiIntegridadeResponse(
        UUID id,
        UUID leiId,
        String hash,
        String hashConteudo,
        LocalDateTime dataVerificacao,
        String statusVerificacao,
        Integer versaoLei,
        String observacoes,
        LocalDateTime createdAt
) {
    public static LeiIntegridadeResponse from(LeiIntegridade integridade) {
        return new LeiIntegridadeResponse(
                integridade.getId(),
                integridade.getLei().getId(),
                integridade.getHash(),
                integridade.getHashConteudo(),
                integridade.getDataVerificacao(),
                integridade.getStatusVerificacao(),
                integridade.getVersaoLei(),
                integridade.getObservacoes(),
                integridade.getCreatedAt()
        );
    }
}
