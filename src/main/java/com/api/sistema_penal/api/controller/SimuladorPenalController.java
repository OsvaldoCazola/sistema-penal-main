package com.api.sistema_penal.api.controller;

import com.api.sistema_penal.api.dto.simulador.EnquadramentoRequest;
import com.api.sistema_penal.api.dto.simulador.EnquadramentoResponse;
import com.api.sistema_penal.service.SimuladorPenalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/simulador")
@RequiredArgsConstructor
@Tag(name = "Simulador Penal", description = "Simulação de enquadramento penal")
@SecurityRequirement(name = "bearerAuth")
public class SimuladorPenalController {

    private final SimuladorPenalService simuladorPenalService;

    /**
     * Simula o enquadramento penal de um caso
     * Retorna lista de crimes possíveis com explicabilidade completa
     * POST /api/simulador/enquadrar
     */
    @PostMapping("/enquadrar")
    @PreAuthorize("hasAnyRole('JUIZ', 'PROCURADOR', 'ADVOGADO', 'ESTUDANTE')")
    @Operation(summary = "Simular enquadramento penal")
    public ResponseEntity<EnquadramentoResponse> enquadrar(
            @Valid @RequestBody EnquadramentoRequest request) {
        return ResponseEntity.ok(simuladorPenalService.enquadrar(request));
    }
}
