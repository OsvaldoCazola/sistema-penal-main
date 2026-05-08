package com.api.sistema_penal.api.controller;

import com.api.sistema_penal.api.dto.educacional.SimuladorRequest;
import com.api.sistema_penal.domain.entity.Usuario;
import com.api.sistema_penal.service.CasoGeradoChatService;
import com.api.sistema_penal.service.ResultadoSimulacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/simulador")
@RequiredArgsConstructor
@Tag(name = "Simulador Educacional", description = "Quiz interativo para estudo do CPA")
@SecurityRequirement(name = "bearerAuth")
public class SimuladorController {

    private final CasoGeradoChatService casoGeradoChatService;
    private final ResultadoSimulacaoService resultadoSimulacaoService;

    @GetMapping("/casos-disponiveis")
    @PreAuthorize("hasRole('ESTUDANTE')")
    @Operation(summary = "Listar casos do chat disponíveis para simulador")
    public ResponseEntity<List<Map<String, Object>>> listarCasosDisponiveis(
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(casoGeradoChatService.listarCasosParaSimulador(usuario.getId()));
    }

    @PostMapping("/iniciar")
    @PreAuthorize("hasRole('ESTUDANTE')")
    @Operation(summary = "Iniciar nova simulação")
    public ResponseEntity<Map<String, Object>> iniciarSimulacao(
            @AuthenticationPrincipal Usuario usuario,
            @RequestBody SimuladorRequest request) {
        UUID simulacaoId = resultadoSimulacaoService.iniciarSimulacao(usuario.getId(), request);
        return ResponseEntity.ok(Map.of(
                "sucesso", true,
                "simulacaoId", simulacaoId,
                "mensagem", "Simulação iniciada com sucesso"
        ));
    }

    @PostMapping("/responder")
    @PreAuthorize("hasRole('ESTUDANTE')")
    @Operation(summary = "Responder uma pergunta na simulação")
    public ResponseEntity<Map<String, Object>> responderPergunta(
            @AuthenticationPrincipal Usuario usuario,
            @RequestBody Map<String, Object> requestBody) {
        UUID simulacaoId = UUID.fromString((String) requestBody.get("simulacaoId"));
        UUID casoId = (requestBody.get("casoId") != null) ? 
                UUID.fromString((String) requestBody.get("casoId")) : null;
        String resposta = (String) requestBody.get("resposta");
        
        Map<String, Object> resultado = resultadoSimulacaoService.processarResposta(
                usuario.getId(), simulacaoId, casoId, resposta);
        
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/resultado/{simulacaoId}")
    @PreAuthorize("hasRole('ESTUDANTE')")
    @Operation(summary = "Obter resultado de uma simulação")
    public ResponseEntity<Map<String, Object>> obterResultado(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable UUID simulacaoId) {
        Map<String, Object> resultado = resultadoSimulacaoService.obterResultadoSimulacao(
                usuario.getId(), simulacaoId);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/historico")
    @PreAuthorize("hasRole('ESTUDANTE')")
    @Operation(summary = "Obter histórico de simulações do estudante")
    public ResponseEntity<List<Map<String, Object>>> obterHistorico(
            @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(resultadoSimulacaoService.obterHistoricoUsuario(usuario.getId()));
    }
}