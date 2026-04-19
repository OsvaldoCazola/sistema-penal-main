package com.api.sistema_penal.api.controller;

import com.api.sistema_penal.api.dto.relatorio.RelatorioRequest;
import com.api.sistema_penal.domain.entity.Usuario;
import com.api.sistema_penal.service.relatorio.RelatorioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/relatorios")
@RequiredArgsConstructor
@Tag(name = "Relatórios", description = "API para geração de relatórios")
public class RelatorioController {

    private final RelatorioService relatorioService;

    @GetMapping("/estatisticas")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Estatísticas gerais", description = "Retorna estatísticas gerais do sistema")
    public ResponseEntity<Map<String, Object>> getEstatisticasGerais() {
        return ResponseEntity.ok(relatorioService.gerarEstatisticasGerais());
    }

    @GetMapping("/estatisticas-prazos")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Estatísticas de prazos", description = "Retorna estatísticas de prazos")
    public ResponseEntity<Map<String, Object>> getEstatisticasPrazos() {
        return ResponseEntity.ok(relatorioService.gerarEstatisticasPrazos());
    }

    @GetMapping("/processos/pdf")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Gerar relatório de processos em PDF", description = "Gera um relatório de processos em formato PDF")
    public ResponseEntity<byte[]> gerarRelatorioProcessosPdf(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim,
            @RequestParam(required = false) String provincia) {
        
        byte[] pdf = relatorioService.gerarRelatorioProcessosPdf(dataInicio, dataFim, provincia);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio_processos.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/processos/csv")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Gerar relatório de processos em CSV", description = "Gera um relatório de processos em formato CSV")
    public ResponseEntity<String> gerarRelatorioProcessosCsv(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim,
            @RequestParam(required = false) String provincia) {
        
        String csv = relatorioService.gerarRelatorioProcessosCsv(dataInicio, dataFim, provincia);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio_processos.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }

    @GetMapping("/prazos/pdf")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Gerar relatório de prazos em PDF", description = "Gera um relatório de prazos em formato PDF")
    public ResponseEntity<byte[]> gerarRelatorioPrazosPdf(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {
        
        byte[] pdf = relatorioService.gerarRelatorioPrazosPdf(dataInicio, dataFim);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio_prazos.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/prazos/csv")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Gerar relatório de prazos em CSV", description = "Gera um relatório de prazos em formato CSV")
    public ResponseEntity<String> gerarRelatorioPrazosCsv(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim) {
        
        String csv = relatorioService.gerarRelatorioPrazosCsv(dataInicio, dataFim);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio_prazos.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}
