package com.api.sistema_penal.api.dto.blockchain;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificarIntegridadeResponse {

    private boolean integridade;
    private String mensagem;
    private String hashRegistrado;
    private String hashAtual;
    private UUID analysisId;
    private LocalDateTime dataRegistro;
}
