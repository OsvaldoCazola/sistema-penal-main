package com.api.sistema_penal.api.controller;

import com.api.sistema_penal.api.dto.educacional.CasoDetalheResponse;
import com.api.sistema_penal.api.dto.educacional.CasoResumoResponse;
import com.api.sistema_penal.api.dto.educacional.RespostaPerguntaResponse;
import com.api.sistema_penal.api.dto.educacional.ResponderPerguntaRequest;
import com.api.sistema_penal.domain.entity.Usuario;
import com.api.sistema_penal.service.CasoService;
import com.api.sistema_penal.service.SimuladorEducativoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/casos")
@RequiredArgsConstructor
@Tag(name = "Casos Práticos", description = "Sistema de estudo e simulação educativa")
@SecurityRequirement(name = "bearerAuth")
public class CasoSimuladoController {

    private final CasoService casoService;
    private final SimuladorEducativoService simuladorEducativoService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ESTUDANTE', 'ADMIN')")
    @Operation(summary = "Listar casos simulados disponíveis")
    public ResponseEntity<List<CasoResumoResponse>> listarCasos(
            @AuthenticationPrincipal Usuario usuario,
            @RequestParam(required = false) Integer nivel,
            @RequestParam(required = false) String categoria) {
        return ResponseEntity.ok(casoService.listarCasos(nivel, categoria, usuario));
    }

    @GetMapping("/{casoId}")
    @PreAuthorize("hasAnyRole('ESTUDANTE', 'ADMIN')")
    @Operation(summary = "Obter detalhes do caso com perguntas")
    public ResponseEntity<CasoDetalheResponse> obterCaso(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Long casoId) {
        return ResponseEntity.ok(casoService.obterCasoDetalhe(casoId, usuario));
    }

    @PostMapping("/{casoId}/perguntas/{perguntaId}/responder")
    @PreAuthorize("hasRole('ESTUDANTE')")
    @Operation(summary = "Responder uma pergunta do caso")
    public ResponseEntity<RespostaPerguntaResponse> responderPergunta(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Long casoId,
            @PathVariable UUID perguntaId,
            @Valid @RequestBody ResponderPerguntaRequest request) {
        return ResponseEntity.ok(simuladorEducativoService.responderPergunta(usuario, casoId, perguntaId, request));
    }
}
