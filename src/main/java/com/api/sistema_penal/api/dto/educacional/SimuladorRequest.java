package com.api.sistema_penal.api.dto.educacional;

import java.util.List;
import java.util.UUID;

public record SimuladorRequest(
    UUID simulacaoId,
    Long casoId,
    String tipoCrime,
    String origem
) {
    public SimuladorRequest {
        if (origem == null) {
            origem = "ALEATORIO";
        }
        if (!origem.equals("CHAT") && !origem.equals("ALEATORIO")) {
            origem = "ALEATORIO";
        }
    }
}