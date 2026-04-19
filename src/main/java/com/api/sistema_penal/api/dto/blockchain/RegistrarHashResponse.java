package com.api.sistema_penal.api.dto.blockchain;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrarHashResponse {

    private UUID id;
    private UUID analysisId;
    private String hash;
    private String contentType;
    private LocalDateTime createdAt;
    private String mensagem;
}
