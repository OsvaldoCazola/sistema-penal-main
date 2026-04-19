package com.api.sistema_penal.api.dto.processo;

import com.api.sistema_penal.domain.entity.Movimentacao;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record MovimentacaoResponse(
        UUID id,
        String tipo,
        String descricao,
        LocalDateTime dataEvento,
        String usuarioNome,
        List<Movimentacao.Anexo> anexos,
        LocalDateTime createdAt
) {
    public static MovimentacaoResponse from(Movimentacao m) {
        return new MovimentacaoResponse(
                m.getId(),
                m.getTipo(),
                m.getDescricao(),
                m.getDataEvento(),
                m.getUsuario() != null ? m.getUsuario().getNome() : null,
                m.getAnexos(),
                m.getCreatedAt()
        );
    }
}
