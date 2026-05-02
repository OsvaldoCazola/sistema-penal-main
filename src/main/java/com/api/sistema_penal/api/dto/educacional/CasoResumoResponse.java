package com.api.sistema_penal.api.dto.educacional;

import java.util.UUID;

public record CasoResumoResponse(
        Long id,
        String titulo,
        Integer nivel,
        String categoria,
        Integer totalPerguntas,
        Double percentualConclusao,
        String status
) {
}
