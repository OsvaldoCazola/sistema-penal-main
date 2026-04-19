package com.api.sistema_penal.api.dto.coerencia;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record RelatorioCoerenciaResponse(
        LocalDate periodoInicio,
        LocalDate periodoFim,
        int totalSentencasAnalisadas,
        int totalDesviosDetectados,
        double percentualCoerencia,
        List<PadraoDecisorio> padroes,
        List<DesvioResponse> desviosSignificativos,
        Map<String, Object> recomendacoes
) {}
