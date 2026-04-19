package com.api.sistema_penal.api.dto.verificador;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Response da verificação de pena
 * Inclui a pena calculada com base legal e justificação passo a passo
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerificarPenaResponse {

    private UUID id;
    private ArtigoInfo artigo;
    private PenaCalculada penaBase;
    private List<AjustePena> ajustes;
    private PenaCalculada penaFinal;
    private String regimeRecomendado;
    private List<PassoJustificativo> justificacao;
    private BaseLegal baseLegal;
    private Boolean houveFlagrante;
    private Boolean houveReincidencia;
    private LocalDateTime dataVerificacao;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ArtigoInfo {
        private UUID id;
        private String numero;
        private String titulo;
        private String tipoPenal;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PenaCalculada {
        private Integer anos;
        private Integer meses;
        private Integer dias;
        private BigDecimal multa;
        private String descricao;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AjustePena {
        private String tipo; // AGRAVANTE, ATENUANTE, FLAGRANTE, etc.
        private String descricao;
        private Integer percentual;
        private String baseLegal;
        private Boolean aplicado;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PassoJustificativo {
        private Integer ordem;
        private String titulo;
        private String descricao;
        private String artigoReferencia;
        private Boolean favoravel; // true =利于被告人, false =不利于
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BaseLegal {
        private String artigoPrincipal;
        private String artigoAgregador;
        private List<String> artigosRelevantes;
    }
}
