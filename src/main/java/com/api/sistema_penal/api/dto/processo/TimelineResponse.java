package com.api.sistema_penal.api.dto.processo;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record TimelineResponse(
        UUID processoId,
        String numeroProcesso,
        String statusAtual,
        List<EtapaTimeline> etapas,
        int etapaAtualIndex,
        double percentualConcluido
) {
    public record EtapaTimeline(
            int ordem,
            String codigo,
            String nome,
            String descricao,
            String status,
            LocalDateTime dataInicio,
            LocalDateTime dataConclusao,
            Integer duracaoDias,
            List<EventoTimeline> eventos
    ) {}

    public record EventoTimeline(
            UUID id,
            String tipo,
            String descricao,
            LocalDateTime data,
            String responsavel
    ) {}
}
