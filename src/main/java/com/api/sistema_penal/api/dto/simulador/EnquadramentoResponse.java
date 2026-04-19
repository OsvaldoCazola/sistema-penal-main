package com.api.sistema_penal.api.dto.simulador;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Response do Simulador de Enquadramento Penal
 * Inclui lista de crimes possíveis e explicação completa
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnquadramentoResponse {

    private UUID id;
    private String descricaoCasoOriginal;
    private List<CrimePossivel> crimesPossiveis;
    private Conclusao conclusao;
    private List<PassoExplicativo> passosExplicativos;
    private MapaElementos mapaElementos;
    private List<String> advertencias;
    private LocalDateTime dataAnalise;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CrimePossivel {
        private UUID artigoId;
        private String artigoNumero;
        private String artigoTitulo;
        private String tipoCrime;
        private Double probabilidade; // 0-100%
        private String penaMinima;
        private String penaMaxima;
        private String tipoPenal;
        private Boolean concurso; // indica se é concurso de crimes
        private String tipoConcurso; // REAL ou IDEAL
        private List<ElementoMatched> elementosEncontrados;
        private List<ElementoFaltante> elementosFaltantes;
        private String justificativa;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ElementoMatched {
        private String elemento;
        private String descricao;
        private String fatoCorrespondente;
        private Boolean verificado;
        private String artigoReferencia;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ElementoFaltante {
        private String elemento;
        private String descricao;
        private Boolean indispensavel;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Conclusao {
        private String recomendacao;
        private String artigoMaisProximo;
        private String nivelConfianca;
        private Boolean requerAnaliseJuridica;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PassoExplicativo {
        private Integer ordem;
        private String fase; // ANALISE, COMPARACAO, AVALIACAO, CONCLUSAO
        private String titulo;
        private String descricao;
        private String detalhes;
        private List<String> Referencias;
        private Boolean success; // true = elemento encontrado
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MapaElementos {
        private Map<String, Boolean> elementosObrigatorios;
        private Map<String, Boolean> elementosQualificadores;
        private List<String> palavrasChaveIdentificadas;
        private Map<String, String> mapeamentoFatos;
    }
}
