package com.api.sistema_penal.api.dto.legislacao;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record LawUpdateRequest(
    @NotBlank(message = "Tipo é obrigatório")
    String tipo,
    
    @NotBlank(message = "Número é obrigatório")
    String numero,
    
    @NotNull(message = "Ano é obrigatório")
    Integer ano,
    
    @NotBlank(message = "Título é obrigatório")
    String titulo,
    
    String ementa,
    String conteudo,
    String dataPublicacao,
    String dataVigencia,
    String fonteUrl,
    String fonteOrigem
) {}
