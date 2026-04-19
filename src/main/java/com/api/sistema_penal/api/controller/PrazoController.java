package com.api.sistema_penal.api.controller;

import com.api.sistema_penal.api.dto.prazo.PrazoRequest;
import com.api.sistema_penal.api.dto.prazo.PrazoResponse;
import com.api.sistema_penal.domain.entity.Prazo.StatusPrazo;
import com.api.sistema_penal.domain.entity.Prazo.TipoPrazo;
import com.api.sistema_penal.domain.entity.Usuario;
import com.api.sistema_penal.service.GestaoPrazosService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/prazos")
@RequiredArgsConstructor
@Tag(name = "Gestão de Prazos", description = "API para gestão de prazos processuais")
public class PrazoController {

    private final GestaoPrazosService gestaoPrazosService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Criar prazo", description = "Cria um novo prazo processual")
    public ResponseEntity<PrazoResponse> criar(
            @Valid @RequestBody PrazoRequest request,
            @AuthenticationPrincipal Usuario usuario) {
        PrazoResponse response = gestaoPrazosService.criar(request, usuario.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR', 'ADVOGADO', 'ESTUDANTE')")
    @Operation(summary = "Buscar prazo por ID", description = "Retorna um prazo específico")
    public ResponseEntity<PrazoResponse> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(gestaoPrazosService.buscarPorId(id));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR', 'ADVOGADO', 'ESTUDANTE')")
    @Operation(summary = "Listar prazos", description = "Lista todos os prazos com paginação")
    public ResponseEntity<Page<PrazoResponse>> listar(Pageable pageable) {
        return ResponseEntity.ok(gestaoPrazosService.listar(pageable));
    }

    @GetMapping("/processo/{processoId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR', 'ADVOGADO')")
    @Operation(summary = "Listar prazos por processo", description = "Lista prazos de um processo específico")
    public ResponseEntity<List<PrazoResponse>> listarPorProcesso(@PathVariable UUID processoId) {
        return ResponseEntity.ok(gestaoPrazosService.listarPorProcesso(processoId));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Listar prazos por status", description = "Lista prazos por status específico")
    public ResponseEntity<Page<PrazoResponse>> listarPorStatus(
            @PathVariable StatusPrazo status,
            Pageable pageable) {
        return ResponseEntity.ok(gestaoPrazosService.listarPorStatus(status, pageable));
    }

    @GetMapping("/tipo/{tipo}")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Listar prazos por tipo", description = "Lista prazos por tipo específico")
    public ResponseEntity<Page<PrazoResponse>> listarPorTipo(
            @PathVariable TipoPrazo tipo,
            Pageable pageable) {
        return ResponseEntity.ok(gestaoPrazosService.listarPorTipo(tipo, pageable));
    }

    @GetMapping("/vencidos")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Listar prazos vencidos", description = "Lista prazos que já venceram")
    public ResponseEntity<Page<PrazoResponse>> listarVencidos(Pageable pageable) {
        return ResponseEntity.ok(gestaoPrazosService.listarVencidos(pageable));
    }

    @GetMapping("/a-vencer")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Listar prazos a vencer", description = "Lista prazos que vencerão em breve")
    public ResponseEntity<List<PrazoResponse>> listarAVencer(
            @RequestParam(defaultValue = "7") int diasAntecedencia) {
        LocalDate dataLimite = LocalDate.now().plusDays(diasAntecedencia);
        return ResponseEntity.ok(gestaoPrazosService.listarAVencer(dataLimite));
    }

    @GetMapping("/filtros")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR', 'ADVOGADO')")
    @Operation(summary = "Listar prazos com filtros", description = "Lista prazos com filtros avançados")
    public ResponseEntity<Page<PrazoResponse>> listarPorFiltros(
            @RequestParam(required = false) TipoPrazo tipo,
            @RequestParam(required = false) StatusPrazo status,
            @RequestParam(required = false) UUID processoId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim,
            Pageable pageable) {
        return ResponseEntity.ok(gestaoPrazosService.listarPorFiltros(tipo, status, processoId, inicio, fim, pageable));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ')")
    @Operation(summary = "Atualizar prazo", description = "Atualiza um prazo existente")
    public ResponseEntity<PrazoResponse> atualizar(
            @PathVariable UUID id,
            @Valid @RequestBody PrazoRequest request) {
        return ResponseEntity.ok(gestaoPrazosService.atualizar(id, request));
    }

    @PostMapping("/{id}/concluir")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ')")
    @Operation(summary = "Concluir prazo", description = "Marca um prazo como cumprido")
    public ResponseEntity<PrazoResponse> concluir(@PathVariable UUID id) {
        return ResponseEntity.ok(gestaoPrazosService.concluir(id));
    }

    @PostMapping("/{id}/prorrogar")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ')")
    @Operation(summary = "Prorrogar prazo", description = "Prorroga a data de fim de um prazo")
    public ResponseEntity<PrazoResponse> prorrogar(
            @PathVariable UUID id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate novaDataFim,
            @RequestParam String justificativa) {
        return ResponseEntity.ok(gestaoPrazosService.prorrogar(id, novaDataFim, justificativa));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Cancelar prazo", description = "Cancela um prazo")
    public ResponseEntity<Void> cancelar(@PathVariable UUID id) {
        gestaoPrazosService.cancelar(id);
        return ResponseEntity.noContent().build();
    }
}
