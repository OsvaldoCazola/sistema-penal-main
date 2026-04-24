package com.api.sistema_penal.api.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO para estatísticas de crimes
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CrimeEstatisticasResponse {

    /**
     * Crimes por região (provincia)
     */
    private List<RegiaoStat> crimesPorRegiao;

    /**
     * Crimes mais simulados
     */
    private List<TipoCrimeStat> crimesMaisSimulados;

    /**
     * Tipos de crime registados em processos
     */
    private List<TipoCrimeStat> tiposCrimeProcessos;

    /**
     * Total de crimes registrados
     */
    private Long totalCrimes;

    /**
     * Total de simulações realizadas
     */
    private Long totalSimulacoes;

    /**
     * Filtro actualmente aplicado para tipo de crime
     */
    private String filtroTipoCrime;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegiaoStat {
        private String regiao;
        private Long quantidade;
        private Double percentual;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TipoCrimeStat {
        private String tipoCrime;
        private Long quantidade;
        private Double percentual;
    }
}
