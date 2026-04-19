package com.api.sistema_penal.api.dto.coerencia;

import java.util.Map;
import java.util.UUID;

public record PadraoDecisorio(
        UUID tipoCrimeId,
        String tipoCrimeNome,
        String tribunalNome,
        int totalCasos,
        double penaMediaMeses,
        double penaMedianaMeses,
        double desvioPadrao,
        int penaMinima,
        int penaMaxima,
        Map<String, Object> distribuicaoPenas,
        double taxaCondenacao
) {}
