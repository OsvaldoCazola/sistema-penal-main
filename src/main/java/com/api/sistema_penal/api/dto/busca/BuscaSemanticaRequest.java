package com.api.sistema_penal.api.dto.busca;

import com.api.sistema_penal.domain.entity.CategoriaJuridica;
import jakarta.validation.constraints.NotBlank;

/**
 * Request para busca semântica
 */
public record BuscaSemanticaRequest(
    
    @NotBlank(message = "Termo de busca é obrigatório")
    String termo,
    
    CategoriaJuridica categoria,
    
    Integer limite,
    
    Double threshold
) {
    public BuscaSemanticaRequest {
        if (limite == null || limite <= 0) {
            limite = 10;
        }
        if (threshold == null || threshold < 0) {
            threshold = 0.1;
        }
    }
    
    public BuscaSemanticaRequest(@NotBlank String termo) {
        this(termo, null, 10, 0.1);
    }
    
    public BuscaSemanticaRequest(@NotBlank String termo, CategoriaJuridica categoria) {
        this(termo, categoria, 10, 0.1);
    }
}
