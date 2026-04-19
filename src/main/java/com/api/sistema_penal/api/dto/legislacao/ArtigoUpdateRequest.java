package com.api.sistema_penal.api.dto.legislacao;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ArtigoUpdateRequest(
    @NotBlank(message = "Título é obrigatório")
    String titulo,
    
    @NotBlank(message = "Conteúdo é obrigatório")
    String conteudo,
    
    Integer numeroArtigo,
    String nomeSecao,
    Integer ordemSecao,
    
    UUID leiId,
    String leiIdentificacao,
    String fonteUrl,
    String fonteOrigem
) {}
