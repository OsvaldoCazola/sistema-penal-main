package com.api.sistema_penal.api.dto.educacional;

import java.util.UUID;

public record PerguntaCasoResponse(
        UUID id,
        Integer ordem,
        String titulo,
        String enunciado,
        Integer pontuacaoMaxima,
        String respostaAnterior,
        Boolean correta,
        Integer pontosObtidos
) {
}
