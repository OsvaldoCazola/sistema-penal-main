package com.api.sistema_penal.api.dto.legislacao;

import com.api.sistema_penal.domain.entity.CategoriaCrime;

import java.time.LocalDateTime;
import java.util.UUID;

public record CategoriaCrimeResponse(
        UUID id,
        String nome,
        String descricao,
        String codigo,
        Integer quantidadeArtigos,
        LocalDateTime createdAt
) {
    public static CategoriaCrimeResponse from(CategoriaCrime categoria) {
        return new CategoriaCrimeResponse(
                categoria.getId(),
                categoria.getNome(),
                categoria.getDescricao(),
                categoria.getCodigo(),
                categoria.getArtigos() != null ? categoria.getArtigos().size() : 0,
                categoria.getCreatedAt()
        );
    }
}
