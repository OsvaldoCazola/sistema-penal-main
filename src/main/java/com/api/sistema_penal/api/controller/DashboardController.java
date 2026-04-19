package com.api.sistema_penal.api.controller;

import com.api.sistema_penal.api.dto.dashboard.CrimeEstatisticasResponse;
import com.api.sistema_penal.api.dto.dashboard.DashboardResponse;
import com.api.sistema_penal.domain.entity.AnalyticsReport;
import com.api.sistema_penal.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.validation.annotation.Validated;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Validated
@Tag(name = "Dashboard", description = "Estatísticas e métricas do sistema")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    private final DashboardService service;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR', 'ESTUDANTE', 'ADVOGADO')")
    @Operation(summary = "Dashboard principal com todas as métricas")
    public ResponseEntity<DashboardResponse> getDashboard() {
        return ResponseEntity.ok(service.getDashboard());
    }

    /**
     * Atividades recentes - simulações e verificações
     */
    @GetMapping("/atividades-recentes")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR', 'ESTUDANTE', 'ADVOGADO')")
    @Operation(summary = "Atividades recentes do sistema")
    public ResponseEntity<Map<String, Object>> getAtividadesRecentes(
            @Parameter(description = "Número da página (começa em 0)") @RequestParam(defaultValue = "0") @Min(0) int page,
            @Parameter(description = "Tamanho da página (máximo 20)") @RequestParam(defaultValue = "10") @Min(1) @Max(20) int size) {
        return ResponseEntity.ok(service.getAtividadesRecentes(page, size));
    }

    /**
     * Alertas do sistema
     */
    @GetMapping("/alertas")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Alertas do sistema (penas inválidas, conflitos, etc)")
    public ResponseEntity<Map<String, Object>> getAlertas() {
        return ResponseEntity.ok(service.getAlertas());
    }

    @GetMapping("/tipos-crime")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Estatísticas por tipo de crime")
    public ResponseEntity<Map<String, Object>> getEstatisticasTipoCrime() {
        return ResponseEntity.ok(service.getEstatisticasTipoCrime());
    }

    @GetMapping("/crimes-mais-frequentes")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Crimes mais frequentes")
    public ResponseEntity<Map<String, Object>> getCrimesMaisFrequentes(
            @Parameter(description = "Número da página (começa em 0)") @RequestParam(defaultValue = "0") @Min(0) int page,
            @Parameter(description = "Tamanho da página (máximo 100)") @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size) {
        return ResponseEntity.ok(service.getCrimesMaisFrequentes(page, size));
    }

    /**
     * Estatísticas completas de crimes para gráficos
     */
    @GetMapping("/estatisticas-crimes")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR', 'ESTUDANTE', 'ADVOGADO')")
    @Operation(summary = "Estatísticas de crimes: por região e mais simulados")
    public ResponseEntity<CrimeEstatisticasResponse> getCrimeEstatisticas() {
        return ResponseEntity.ok(service.getCrimeEstatisticas());
    }

    @GetMapping("/artigos-mais-aplicados")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Artigos mais aplicados")
    public ResponseEntity<Map<String, Object>> getArtigosMaisAplicados(
            @Parameter(description = "Número da página (começa em 0)") @RequestParam(defaultValue = "0") @Min(0) int page,
            @Parameter(description = "Tamanho da página (máximo 100)") @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size) {
        return ResponseEntity.ok(service.getArtigosMaisAplicados(page, size));
    }

    @GetMapping("/tempo-medio-julgamento")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Tempo médio de julgamento")
    public ResponseEntity<Map<String, Object>> getTempoMedioJulgamento() {
        return ResponseEntity.ok(service.getTempoMedioJulgamento());
    }

    @PostMapping("/gerar-relatorio")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Gera relatório analítico completo")
    public ResponseEntity<Map<String, Object>> gerarRelatorio(
            @RequestParam @NotBlank @Size(min = 3, max = 100, message = "Nome do relatório deve ter entre 3 e 100 caracteres") String reportName,
            @RequestParam(required = false) @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres") String description) {
        
        AnalyticsReport report = service.generateFullReport(reportName, description);
        
        Map<String, Object> response = Map.of(
                "id", report.getId(),
                "reportName", report.getReportName(),
                "reportType", report.getReportType(),
                "generatedAt", report.getGeneratedAt().toString(),
                "mensagem", "Relatório gerado com sucesso!"
        );
        
        return ResponseEntity.ok(response);
    }
}
