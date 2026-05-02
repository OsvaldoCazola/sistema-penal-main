package com.api.sistema_penal.api.dto.educacional;

import java.util.UUID;

public record RespostaPerguntaResponse(
        UUID perguntaId,
        String respostaRegistrada,
        boolean correta,
        Integer pontosObtidos,
        Integer pontuacaoMaxima,
        String feedbackProfessor,
        String respostaEsperada
) {
}
