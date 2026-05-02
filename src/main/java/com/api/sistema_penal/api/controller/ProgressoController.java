package com.api.sistema_penal.api.controller;

import com.api.sistema_penal.api.dto.educacional.ProgressoCasoResponse;
import com.api.sistema_penal.domain.entity.Usuario;
import com.api.sistema_penal.service.ProgressoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/progresso")
@RequiredArgsConstructor
@Tag(name = "Progresso Educacional", description = "Acompanhamento do desempenho do estudante")
@SecurityRequirement(name = "bearerAuth")
public class ProgressoController {

    private final ProgressoService progressoService;

    @GetMapping
    @PreAuthorize("hasRole('ESTUDANTE')")
    @Operation(summary = "Listar progresso do estudante autenticado")
    public ResponseEntity<List<ProgressoCasoResponse>> listarProgresso(
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(progressoService.listarProgresso(usuario));
    }

    @GetMapping("/{casoId}")
    @PreAuthorize("hasRole('ESTUDANTE')")
    @Operation(summary = "Obter progresso detalhado de um caso específico")
    public ResponseEntity<ProgressoCasoResponse> obterProgresso(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Long casoId) {
        return ResponseEntity.ok(progressoService.obterProgresso(usuario, casoId));
    }

    @GetMapping("/estudante/{usuarioId}/caso/{casoId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Consultar progresso de um estudante (administrador)")
    public ResponseEntity<ProgressoCasoResponse> obterProgressoAdmin(
            @PathVariable UUID usuarioId,
            @PathVariable Long casoId) {
        return ResponseEntity.ok(progressoService.obterProgressoAdmin(usuarioId, casoId));
    }
}
