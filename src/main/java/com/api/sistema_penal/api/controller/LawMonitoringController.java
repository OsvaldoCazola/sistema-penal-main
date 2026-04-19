package com.api.sistema_penal.api.controller;

import com.api.sistema_penal.api.dto.legislacao.LawUpdateRequest;
import com.api.sistema_penal.api.dto.legislacao.LawUpdateResponse;
import com.api.sistema_penal.service.LawMonitoringService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

/**
 * Controller para gerenciamento de monitoramento legislativo
 */
@RestController
@RequestMapping("/law-monitoring")
@RequiredArgsConstructor
@Tag(name = "Monitoramento Legislativo", description = "APIs para monitoramento automático de leis")
@SecurityRequirement(name = "bearerAuth")
public class LawMonitoringController {

    private final LawMonitoringService lawMonitoringService;

    @GetMapping("/pendentes")
    @Operation(summary = "Listar leis pendentes de aprovação")
    public ResponseEntity<Page<LawUpdateResponse>> listarPendentes(Pageable pageable) {
        return ResponseEntity.ok(lawMonitoringService.listarPendentes(pageable));
    }

    @GetMapping("/todas")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar todas as atualizações de leis (histórico)")
    public ResponseEntity<Page<LawUpdateResponse>> listarTodas(Pageable pageable) {
        return ResponseEntity.ok(lawMonitoringService.listarTodas(pageable));
    }

    @GetMapping("/pendentes/contagem")
    @Operation(summary = "Contar leis pendentes")
    public ResponseEntity<Map<String, Long>> contarPendentes() {
        return ResponseEntity.ok(Map.of("pendentes", lawMonitoringService.contarPendentes()));
    }

    @PostMapping("/adicionar")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Adicionar lei pendente (manual)")
    public ResponseEntity<LawUpdateResponse> adicionarLeiPendente(
            @Valid @RequestBody LawUpdateRequest request) {
        LawUpdateResponse response = lawMonitoringService.adicionarLeiPendente(request);
        if (response == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.status(201).body(response);
    }

    @PostMapping("/aprovar/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Aprovar lei pendente")
    public ResponseEntity<LawUpdateResponse> aprovarLei(
            @PathVariable UUID id,
            @RequestParam(required = false) String aprovadoPor) {
        return ResponseEntity.ok(lawMonitoringService.aprovarLei(id, aprovadoPor));
    }

    @PostMapping("/rejeitar/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Rejeitar lei pendente")
    public ResponseEntity<LawUpdateResponse> rejeitarLei(
            @PathVariable UUID id,
            @RequestBody Map<String, String> request) {
        String motivo = request.get("motivo");
        return ResponseEntity.ok(lawMonitoringService.rejeitarLei(id, motivo));
    }

    @PostMapping("/executar")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Forçar execução do monitoramento")
    public ResponseEntity<Map<String, String>> forcarMonitoramento() {
        String resultado = lawMonitoringService.forcarMonitoramento();
        return ResponseEntity.ok(Map.of("mensagem", resultado));
    }
}
