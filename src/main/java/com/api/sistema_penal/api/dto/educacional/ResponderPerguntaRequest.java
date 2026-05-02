package com.api.sistema_penal.api.dto.educacional;

import jakarta.validation.constraints.NotBlank;

public record ResponderPerguntaRequest(
        @NotBlank(message = "A resposta não pode estar vazia")
        String resposta
) {
}
