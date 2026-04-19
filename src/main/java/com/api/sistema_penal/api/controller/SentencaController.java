package com.api.sistema_penal.api.controller;

import com.api.sistema_penal.api.dto.sentenca.*;
import com.api.sistema_penal.domain.entity.Sentenca.TipoDecisao;
import com.api.sistema_penal.service.SentencaService;
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
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/sentencas")
@RequiredArgsConstructor
@Tag(name = "Sentenças", description = "Gestão de sentenças e jurisprudência")
@SecurityRequirement(name = "bearerAuth")
public class SentencaController {

    private final SentencaService service;

    @GetMapping
    @Operation(summary = "Listar sentenças")
    public ResponseEntity<Page<SentencaSummaryResponse>> listar(
            @RequestParam(required = false) TipoDecisao tipoDecisao,
            @RequestParam(required = false) UUID tipoCrimeId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim,
            @PageableDefault(size = 20, sort = "dataSentenca", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<SentencaSummaryResponse> result;
        if (tipoDecisao != null) {
            result = service.listarPorTipoDecisao(tipoDecisao, pageable);
        } else if (tipoCrimeId != null) {
            result = service.listarPorTipoCrime(tipoCrimeId, pageable);
        } else if (inicio != null && fim != null) {
            result = service.listarPorPeriodo(inicio, fim, pageable);
        } else {
            result = service.listar(pageable);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/jurisprudencia")
    @Operation(summary = "Buscar jurisprudência por texto")
    public ResponseEntity<Page<SentencaSummaryResponse>> buscarJurisprudencia(
            @RequestParam String q,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return ResponseEntity.ok(service.buscarJurisprudencia(q, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar sentença por ID")
    public ResponseEntity<SentencaResponse> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping("/processo/{processoId}")
    @Operation(summary = "Buscar sentença por processo")
    public ResponseEntity<SentencaResponse> buscarPorProcesso(@PathVariable UUID processoId) {
        return ResponseEntity.ok(service.buscarPorProcesso(processoId));
    }

    @GetMapping("/estatisticas")
    @Operation(summary = "Estatísticas de sentenças")
    public ResponseEntity<Map<String, Object>> estatisticas() {
        return ResponseEntity.ok(service.estatisticas());
    }

    @GetMapping("/media-pena/{tipoCrimeId}")
    @Operation(summary = "Média de pena por tipo de crime")
    public ResponseEntity<Map<String, Object>> mediaPena(@PathVariable UUID tipoCrimeId) {
        Double media = service.mediaPenaPorTipoCrime(tipoCrimeId);
        return ResponseEntity.ok(Map.of(
                "tipoCrimeId", tipoCrimeId,
                "mediaPenaMeses", media != null ? media : 0
        ));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ')")
    @Operation(summary = "Registrar sentença")
    public ResponseEntity<SentencaResponse> criar(@Valid @RequestBody SentencaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ')")
    @Operation(summary = "Atualizar sentença")
    public ResponseEntity<SentencaResponse> atualizar(
            @PathVariable UUID id,
            @Valid @RequestBody SentencaRequest request
    ) {
        return ResponseEntity.ok(service.atualizar(id, request));
    }

    @PatchMapping("/{id}/transito-julgado")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ')")
    @Operation(summary = "Marcar sentença como transitada em julgado")
    public ResponseEntity<Map<String, String>> transitarJulgado(@PathVariable UUID id) {
        service.marcarTransitadoJulgado(id);
        return ResponseEntity.ok(Map.of("message", "Sentença transitada em julgado"));
    }
}
