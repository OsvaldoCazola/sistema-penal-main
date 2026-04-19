package com.api.sistema_penal.api.controller;

import com.api.sistema_penal.api.dto.processo.TimelineResponse;
import com.api.sistema_penal.service.TimelineService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/processos/{processoId}/timeline")
@RequiredArgsConstructor
@Tag(name = "Timeline do Processo", description = "Linha do tempo visual das etapas processuais")
@SecurityRequirement(name = "bearerAuth")
public class TimelineController {

    private final TimelineService timelineService;

    @GetMapping
    @Operation(summary = "Gerar linha do tempo do processo",
            description = "Retorna uma linha do tempo visual com todas as etapas do processo " +
                    "(denúncia → citação → defesa → instrução → alegações → julgamento → sentença → recurso → trânsito)")
    public ResponseEntity<TimelineResponse> getTimeline(@PathVariable UUID processoId) {
        return ResponseEntity.ok(timelineService.gerarTimeline(processoId));
    }

    @GetMapping("/estatisticas")
    @Operation(summary = "Estatísticas da timeline",
            description = "Retorna estatísticas sobre o andamento do processo: etapas concluídas, duração, etc.")
    public ResponseEntity<Map<String, Object>> getEstatisticas(@PathVariable UUID processoId) {
        return ResponseEntity.ok(timelineService.getEstatisticasTimeline(processoId));
    }
}
