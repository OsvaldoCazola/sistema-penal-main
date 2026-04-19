package com.api.sistema_penal.api.dto.busca;

import com.api.sistema_penal.domain.entity.CategoriaJuridica;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Response para análise de caso jurídico
 */
public record AnaliseCasoResponse(
    String descricaoAnalisada,
    String tipoCrime,
    CategoriaJuridica categoria,
    List<LeiAplicavel> leisAplicaveis,
    String analise,
    List<String> recomendacoes,
    List<PalavraDetectada> palavrasDetectadas,
    Map<String, List<PalavraArtigoMapping>> mapeamentoPalavrasArtigos
) {
    /**
     * Lei aplicável com explicação detalhada
     */
    public record LeiAplicavel(
        UUID id,
        String titulo,
        String referenciaLegal,
        CategoriaJuridica categoria,
        Double relevancia,
        String explicacao,
        String jurisprudencia,
        List<String> palavrasRelacionadas
    ) {}
    
    /**
     * Palavra-chave detectada na descrição do caso
     */
    public record PalavraDetectada(
        String palavra,
        String tipo,
        Double relevancia
    ) {}
    
    /**
     * Mapeamento de palavra-chave para artigo
     * Exemplo: "roubo" → Artigo 157
     */
    public record PalavraArtigoMapping(
        String palavra,
        String tipo,
        UUID artigoId,
        String artigoTitulo,
        String justificativa
    ) {}
    
    /**
     * Construtor builder
     */
    public static Builder builder() {
        return new Builder();
    }
    
    public static class Builder {
        private String descricaoAnalisada;
        private String tipoCrime;
        private CategoriaJuridica categoria;
        private List<LeiAplicavel> leisAplicaveis;
        private String analise;
        private List<String> recomendacoes;
        private List<PalavraDetectada> palavrasDetectadas;
        private Map<String, List<PalavraArtigoMapping>> mapeamentoPalavrasArtigos;
        
        public Builder descricaoAnalisada(String descricaoAnalisada) {
            this.descricaoAnalisada = descricaoAnalisada;
            return this;
        }
        
        public Builder tipoCrime(String tipoCrime) {
            this.tipoCrime = tipoCrime;
            return this;
        }
        
        public Builder categoria(CategoriaJuridica categoria) {
            this.categoria = categoria;
            return this;
        }
        
        public Builder leisAplicaveis(List<LeiAplicavel> leisAplicaveis) {
            this.leisAplicaveis = leisAplicaveis;
            return this;
        }
        
        public Builder analise(String analise) {
            this.analise = analise;
            return this;
        }
        
        public Builder recomendacoes(List<String> recomendacoes) {
            this.recomendacoes = recomendacoes;
            return this;
        }
        
        public Builder palavrasDetectadas(List<PalavraDetectada> palavrasDetectadas) {
            this.palavrasDetectadas = palavrasDetectadas;
            return this;
        }
        
        public Builder mapeamentoPalavrasArtigos(Map<String, List<PalavraArtigoMapping>> mapeamentoPalavrasArtigos) {
            this.mapeamentoPalavrasArtigos = mapeamentoPalavrasArtigos;
            return this;
        }
        
        public AnaliseCasoResponse build() {
            return new AnaliseCasoResponse(
                descricaoAnalisada,
                tipoCrime,
                categoria,
                leisAplicaveis,
                analise,
                recomendacoes,
                palavrasDetectadas,
                mapeamentoPalavrasArtigos
            );
        }
    }
}
