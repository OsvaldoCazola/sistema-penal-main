package com.api.sistema_penal.api.dto.busca;

import com.api.sistema_penal.domain.entity.CategoriaJuridica;

import java.util.List;
import java.util.UUID;

/**
 * Response para resultado de busca semântica
 */
public record BuscaSemanticaResponse(
    UUID id,
    String titulo,
    String conteudo,
    String resumo,
    CategoriaJuridica categoria,
    String tags,
    String palavrasChave,
    String fonteOrigem,
    String referenciaLegal,
    Double score,
    String leiReferencia,
    String artigoReferencia
) {
    /**
     * Response simplificado para lista
     */
    public record ResultadoSimples(
        UUID id,
        String titulo,
        String resumo,
        CategoriaJuridica categoria,
        Double score,
        String referenciaLegal
    ) {}
    
    /**
     * Converte para formato simplificado
     */
    public ResultadoSimples toSimples() {
        return new ResultadoSimples(id, titulo, resumo, categoria, score, referenciaLegal);
    }
    
    /**
     * Response para lista de resultados
     */
    public record ListaResultados(
        List<ResultadoSimples> resultados,
        Integer total,
        String termoBuscado,
        CategoriaJuridica categoria,
        Double threshold
    ) {}
}
