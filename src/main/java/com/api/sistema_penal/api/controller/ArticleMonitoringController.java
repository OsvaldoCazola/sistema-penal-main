package com.api.sistema_penal.api.controller;

import com.api.sistema_penal.api.dto.legislacao.ArtigoUpdateRequest;
import com.api.sistema_penal.api.dto.legislacao.ArtigoUpdateResponse;
import com.api.sistema_penal.service.ArticleMonitoringService;
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
 * Controller para gerenciamento de monitoramento de artigos
 */
@RestController
@RequestMapping("/article-monitoring")
@RequiredArgsConstructor
@Tag(name = "Monitoramento de Artigos", description = "APIs para monitoramento automático de artigos")
@SecurityRequirement(name = "bearerAuth")
public class ArticleMonitoringController {

    private final ArticleMonitoringService articleMonitoringService;

    @GetMapping("/pendentes")
    @Operation(summary = "Listar artigos pendentes de aprovação")
    public ResponseEntity<Page<ArtigoUpdateResponse>> listarPendentes(Pageable pageable) {
        return ResponseEntity.ok(articleMonitoringService.listarPendentes(pageable));
    }

    @GetMapping("/todas")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar todas as atualizações de artigos (histórico)")
    public ResponseEntity<Page<ArtigoUpdateResponse>> listarTodas(Pageable pageable) {
        return ResponseEntity.ok(articleMonitoringService.listarTodas(pageable));
    }

    @GetMapping("/pendentes/contagem")
    @Operation(summary = "Contar artigos pendentes")
    public ResponseEntity<Map<String, Long>> contarPendentes() {
        return ResponseEntity.ok(Map.of("pendentes", articleMonitoringService.contarPendentes()));
    }

    @PostMapping("/adicionar")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Adicionar artigo pendente (manual)")
    public ResponseEntity<ArtigoUpdateResponse> adicionarArtigoPendente(
            @Valid @RequestBody ArtigoUpdateRequest request) {
        ArtigoUpdateResponse response = articleMonitoringService.adicionarArtigoPendente(request);
        if (response == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.status(201).body(response);
    }

    @PostMapping("/aprovar/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Aprovar artigo pendente")
    public ResponseEntity<ArtigoUpdateResponse> aprobarArtigo(
            @PathVariable UUID id,
            @RequestParam(required = false) String aprovadoPor) {
        return ResponseEntity.ok(articleMonitoringService.aprobarArtigo(id, aprovadoPor));
    }

    @PostMapping("/rejeitar/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Rejeitar artigo pendente")
    public ResponseEntity<ArtigoUpdateResponse> rejeitarArtigo(
            @PathVariable UUID id,
            @RequestBody Map<String, String> request) {
        String motivo = request.get("motivo");
        return ResponseEntity.ok(articleMonitoringService.rejeitarArtigo(id, motivo));
    }

    @PostMapping("/executar")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Forçar execução do monitoramento de artigos")
    public ResponseEntity<Map<String, String>> forcarMonitoramento() {
        articleMonitoringService.executarMonitoramentoDiario();
        return ResponseEntity.ok(Map.of("mensagem", "Monitoramento de artigos executado com sucesso"));
    }
}
