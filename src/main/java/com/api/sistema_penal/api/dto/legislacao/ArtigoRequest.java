package com.api.sistema_penal.api.dto.legislacao;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record ArtigoRequest(
        @NotBlank(message = "Número do artigo é obrigatório")
        String numero,

        String titulo,

        @NotBlank(message = "Conteúdo é obrigatório")
        String conteudo,

        String tipoPenal,

        Integer penaMinAnos,

        Integer penaMaxAnos,

        Integer ordem,

        List<SubdivisaoRequest> subdivisoes,

        List<ElementoJuridicoRequest> elementosJuridicos,

        List<PenalidadeRequest> penalidades,

        List<String> categorias
) {
    public record SubdivisaoRequest(
            String tipo,
            String numero,
            String conteudo,
            List<SubdivisaoRequest> filhos
    ) {}
}
