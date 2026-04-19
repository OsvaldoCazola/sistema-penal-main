package com.api.sistema_penal.api.dto.legislacao;

import com.api.sistema_penal.domain.entity.ElementoJuridico;

import java.time.LocalDateTime;
import java.util.UUID;

public record ElementoJuridicoResponse(
        UUID id,
        String tipo,
        String conteudo,
        Integer ordem,
        String descricao,
        UUID artigoId,
        LocalDateTime createdAt
) {
    public static ElementoJuridicoResponse from(ElementoJuridico elemento) {
        return new ElementoJuridicoResponse(
                elemento.getId(),
                elemento.getTipo().name(),
                elemento.getConteudo(),
                elemento.getOrdem(),
                elemento.getDescricao(),
                elemento.getArtigo().getId(),
                elemento.getCreatedAt()
        );
    }
}
