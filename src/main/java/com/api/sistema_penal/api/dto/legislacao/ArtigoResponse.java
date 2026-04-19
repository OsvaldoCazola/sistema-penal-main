package com.api.sistema_penal.api.dto.legislacao;

import com.api.sistema_penal.domain.entity.Artigo;

import java.util.List;
import java.util.UUID;

public record ArtigoResponse(
        UUID id,
        String numero,
        String titulo,
        String conteudo,
        String tipoPenal,
        Integer penaMinAnos,
        Integer penaMaxAnos,
        Integer ordem,
        Integer versaoAtual,
        List<Artigo.Subdivisao> subdivisoes,
        List<ElementoJuridicoResponse> elementosJuridicos,
        List<PenalidadeResponse> penalidades,
        List<CategoriaCrimeResponse> categorias,
        UUID leiId,
        String leiTitulo
) {
    public static ArtigoResponse from(Artigo artigo) {
        return new ArtigoResponse(
                artigo.getId(),
                artigo.getNumero(),
                artigo.getTitulo(),
                artigo.getConteudo(),
                artigo.getTipoPenal(),
                artigo.getPenaMinAnos(),
                artigo.getPenaMaxAnos(),
                artigo.getOrdem(),
                artigo.getVersaoAtual(),
                artigo.getSubdivisoes(),
                artigo.getElementosJuridicos() != null ? 
                        artigo.getElementosJuridicos().stream().map(ElementoJuridicoResponse::from).toList() : null,
                artigo.getPenalidades() != null ? 
                        artigo.getPenalidades().stream().map(PenalidadeResponse::from).toList() : null,
                artigo.getCategorias() != null ? 
                        artigo.getCategorias().stream().map(CategoriaCrimeResponse::from).toList() : null,
                artigo.getLei().getId(),
                artigo.getLei().getTitulo()
        );
    }
}
