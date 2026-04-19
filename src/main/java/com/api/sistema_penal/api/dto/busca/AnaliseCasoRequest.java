package com.api.sistema_penal.api.dto.busca;

import jakarta.validation.constraints.NotBlank;

/**
 * Request para análise de caso jurídico
 */
public record AnaliseCasoRequest(
    
    @NotBlank(message = "Descrição do caso é obrigatória")
    String descricao,
    
    String tipoCrime,
    
    String categoria,
    
    Integer limite
) {
    public AnaliseCasoRequest {
        if (limite == null || limite <= 0) {
            limite = 10;
        }
    }
    
    public AnaliseCasoRequest(@NotBlank String descricao) {
        this(descricao, null, null, 10);
    }
    
    public AnaliseCasoRequest(@NotBlank String descricao, String tipoCrime) {
        this(descricao, tipoCrime, null, 10);
    }
}
