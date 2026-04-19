package com.api.sistema_penal.api.controller;

import com.api.sistema_penal.api.dto.processo.*;
import com.api.sistema_penal.domain.entity.Processo.StatusProcesso;
import com.api.sistema_penal.domain.entity.Usuario;
import com.api.sistema_penal.service.ProcessoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/processos")
@RequiredArgsConstructor
@Tag(name = "Processos", description = "Gestão de processos judiciais")
@SecurityRequirement(name = "bearerAuth")
public class ProcessoController {

    private final ProcessoService service;

    @GetMapping
    @Operation(summary = "Listar processos")
    public ResponseEntity<Page<ProcessoSummaryResponse>> listar(
            @RequestParam(required = false) StatusProcesso status,
            @RequestParam(required = false) UUID tribunalId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim,
            @PageableDefault(size = 20, sort = "dataAbertura", direction = Sort.Direction.DESC) Pageable pageable,
            @AuthenticationPrincipal Usuario usuario
    ) {
        Page<ProcessoSummaryResponse> result;
        
        // Se for admin, pode filtrar por qualquer critério
        if (usuario.getRole() == Usuario.Role.ADMIN) {
            if (status != null) {
                result = service.listarPorStatus(status, pageable);
            } else if (tribunalId != null) {
                result = service.listarPorTribunal(tribunalId, pageable);
            } else if (inicio != null && fim != null) {
                result = service.listarPorPeriodo(inicio, fim, pageable);
            } else {
                result = service.listar(pageable, usuario);
            }
        } else {
            // Usuários normais veem apenas processos do seu tribunal
            result = service.listar(pageable, usuario);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar processo por ID")
    public ResponseEntity<ProcessoResponse> buscarPorId(
            @PathVariable UUID id,
            @AuthenticationPrincipal Usuario usuario
    ) {
        ProcessoResponse processo = service.buscarPorId(id, usuario);
        return ResponseEntity.ok(processo);
    }

    @GetMapping("/numero/{numero}")
    @Operation(summary = "Buscar processo por número")
    public ResponseEntity<ProcessoResponse> buscarPorNumero(
            @PathVariable String numero,
            @AuthenticationPrincipal Usuario usuario
    ) {
        ProcessoResponse processo = service.buscarPorNumero(numero, usuario);
        return ResponseEntity.ok(processo);
    }

    @GetMapping("/estatisticas")
    @Operation(summary = "Estatísticas de processos por status")
    public ResponseEntity<Map<String, Long>> estatisticas() {
        return ResponseEntity.ok(service.estatisticasPorStatus());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Criar processo")
    public ResponseEntity<ProcessoResponse> criar(@Valid @RequestBody ProcessoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ')")
    @Operation(summary = "Atualizar processo")
    public ResponseEntity<ProcessoResponse> atualizar(
            @PathVariable UUID id,
            @Valid @RequestBody ProcessoRequest request
    ) {
        return ResponseEntity.ok(service.atualizar(id, request));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ')")
    @Operation(summary = "Alterar status do processo")
    public ResponseEntity<Map<String, String>> alterarStatus(
            @PathVariable UUID id,
            @RequestParam StatusProcesso status
    ) {
        service.alterarStatus(id, status);
        return ResponseEntity.ok(Map.of("message", "Status alterado para " + status));
    }

    @GetMapping("/{id}/movimentacoes")
    @Operation(summary = "Listar movimentações do processo")
    public ResponseEntity<Page<MovimentacaoResponse>> listarMovimentacoes(
            @PathVariable UUID id,
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal Usuario usuario
    ) {
        // Primeiro verifica acesso ao processo
        service.verificarAcesso(service.buscarProcessoPorId(id), usuario);
        return ResponseEntity.ok(service.listarMovimentacoes(id, pageable));
    }

    @PostMapping("/{id}/movimentacoes")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Adicionar movimentação ao processo")
    public ResponseEntity<MovimentacaoResponse> adicionarMovimentacao(
            @PathVariable UUID id,
            @Valid @RequestBody MovimentacaoRequest request,
            @AuthenticationPrincipal Usuario usuario
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.adicionarMovimentacao(id, request, usuario));
    }
}
