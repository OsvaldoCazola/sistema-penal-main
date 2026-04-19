package com.api.sistema_penal.api.controller;

import com.api.sistema_penal.api.dto.verificador.VerificarPenaRequest;
import com.api.sistema_penal.api.dto.verificador.VerificarPenaResponse;
import com.api.sistema_penal.service.VerificadorPenasService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/verificador")
@RequiredArgsConstructor
@Tag(name = "Verificador de Penas", description = "Verificação e cálculo de penas")
@SecurityRequirement(name = "bearerAuth")
public class VerificadorPenasController {

    private final VerificadorPenasService verificadorPenasService;

    /**
     * Verifica e calcula a pena com base no crime e circunstâncias
     * POST /api/verificador/calcular
     */
    @PostMapping("/calcular")
    @PreAuthorize("hasAnyRole('JUIZ', 'PROCURADOR', 'ADVOGADO')")
    @Operation(summary = "Calcular pena com base no crime e circunstâncias")
    public ResponseEntity<VerificarPenaResponse> calcularPena(
            @Valid @RequestBody VerificarPenaRequest request) {
        return ResponseEntity.ok(verificadorPenasService.verificarPena(request));
    }
}
