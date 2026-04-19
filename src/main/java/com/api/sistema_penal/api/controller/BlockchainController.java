package com.api.sistema_penal.api.controller;

import com.api.sistema_penal.api.dto.blockchain.GerarHashRequest;
import com.api.sistema_penal.api.dto.blockchain.RegistrarHashRequest;
import com.api.sistema_penal.api.dto.blockchain.RegistrarHashResponse;
import com.api.sistema_penal.api.dto.blockchain.VerificarIntegridadeResponse;
import com.api.sistema_penal.domain.entity.AnalysisHashRecord;
import com.api.sistema_penal.service.BlockchainService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/blockchain")
@RequiredArgsConstructor
@Tag(name = "Blockchain", description = "Sistema de hash para integridade de análises jurídicas")
@SecurityRequirement(name = "bearerAuth")
public class BlockchainController {

    private final BlockchainService blockchainService;

    /**
     * Registra o hash de uma análise jurídica no banco de dados
     * 
     * POST /api/blockchain/registrar
     */
    @PostMapping("/registrar")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Registrar hash de análise jurídica")
    public ResponseEntity<RegistrarHashResponse> registrarHash(
            @Valid @RequestBody RegistrarHashRequest request) {
        
        String contentType = request.getContentType() != null 
                ? request.getContentType() 
                : "analise_juridica";
        
        AnalysisHashRecord record = blockchainService.registrarHash(
                request.getAnalysisId(),
                request.getConteudo(),
                contentType
        );
        
        RegistrarHashResponse response = RegistrarHashResponse.builder()
                .id(record.getId())
                .analysisId(record.getAnalysisId())
                .hash(record.getHash())
                .contentType(record.getContentType())
                .createdAt(record.getCreatedAt())
                .mensagem("Hash registrado com sucesso!")
                .build();
        
        return ResponseEntity.ok(response);
    }

    /**
     * Verifica a integridade de uma análise comparando o hash atual com o registrado
     * 
     * POST /api/blockchain/verificar
     */
    @PostMapping("/verificar")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Verificar integridade de análise jurídica")
    public ResponseEntity<VerificarIntegridadeResponse> verificarIntegridade(
            @Valid @RequestBody RegistrarHashRequest request) {
        
        AnalysisHashRecord registro = blockchainService.getRecordByAnalysisId(request.getAnalysisId());
        
        // Se não existe registro, retorna 404 para indicar que o recurso não foi encontrado
        if (registro == null) {
            return ResponseEntity.notFound().build();
        }
        
        BlockchainService.VerificacaoIntegridadeResult result = blockchainService.verificarIntegridade(
                request.getAnalysisId(),
                request.getConteudo()
        );
        
        VerificarIntegridadeResponse response = VerificarIntegridadeResponse.builder()
                .integridade(result.isIntegridade())
                .mensagem(result.getMensagem())
                .hashRegistrado(result.getHashRegistrado())
                .hashAtual(result.getHashAtual())
                .analysisId(registro.getAnalysisId())
                .dataRegistro(registro.getCreatedAt())
                .build();
        
        return ResponseEntity.ok(response);
    }

    /**
     * Gera o hash de um conteúdo sem salvar no banco
     * 
     * POST /api/blockchain/gerar-hash
     */
    @PostMapping("/gerar-hash")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Gerar hash SHA-256 de um conteúdo")
    public ResponseEntity<String> gerarHash(@Valid @RequestBody GerarHashRequest request) {
        String hash = blockchainService.gerarHash(request.getConteudo());
        return ResponseEntity.ok(hash);
    }

    /**
     * Obtém o registro de hash para uma análise
     * 
     * GET /api/blockchain/{analysisId}
     */
    @GetMapping("/{analysisId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Obter registro de hash por ID da análise")
    public ResponseEntity<RegistrarHashResponse> getRecord(@PathVariable UUID analysisId) {
        AnalysisHashRecord record = blockchainService.getRecordByAnalysisId(analysisId);
        
        if (record == null) {
            return ResponseEntity.notFound().build();
        }
        
        RegistrarHashResponse response = RegistrarHashResponse.builder()
                .id(record.getId())
                .analysisId(record.getAnalysisId())
                .hash(record.getHash())
                .contentType(record.getContentType())
                .createdAt(record.getCreatedAt())
                .mensagem("Registro encontrado")
                .build();
        
        return ResponseEntity.ok(response);
    }
}
