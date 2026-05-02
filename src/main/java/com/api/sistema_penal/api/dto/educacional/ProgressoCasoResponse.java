package com.api.sistema_penal.api.dto.educacional;

import java.time.LocalDateTime;

public record ProgressoCasoResponse(
        Long casoId,
        String titulo,
        Integer totalPerguntas,
        Integer perguntasRespondidas,
        Integer perguntasCorretas,
        Integer pontuacaoObtida,
        Integer pontuacaoMaxima,
        Double percentualConclusao,
        String status,
        LocalDateTime atualizadoEm
) {
}
