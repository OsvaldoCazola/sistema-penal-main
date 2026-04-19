package com.api.sistema_penal.api.controller;

import com.api.sistema_penal.api.dto.legislacao.ArtigoVersaoResponse;
import com.api.sistema_penal.api.dto.legislacao.ComparacaoArtigoResponse;
import com.api.sistema_penal.service.ArtigoVersaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/artigos/{artigoId}/versoes")
@RequiredArgsConstructor
@Tag(name = "Comparador de Artigos", description = "Versionamento e comparação de alterações legislativas")
@SecurityRequirement(name = "bearerAuth")
public class ArtigoVersaoController {

    private final ArtigoVersaoService versaoService;

    @GetMapping
    @Operation(summary = "Listar versões de um artigo",
            description = "Retorna o histórico de todas as versões de um artigo, ordenado da mais recente para a mais antiga")
    public ResponseEntity<List<ArtigoVersaoResponse>> listarVersoes(@PathVariable UUID artigoId) {
        return ResponseEntity.ok(versaoService.listarVersoes(artigoId));
    }

    @GetMapping("/{versao}")
    @Operation(summary = "Buscar versão específica",
            description = "Retorna os detalhes de uma versão específica do artigo")
    public ResponseEntity<ArtigoVersaoResponse> buscarVersao(
            @PathVariable UUID artigoId,
            @PathVariable Integer versao) {
        return ResponseEntity.ok(versaoService.buscarVersao(artigoId, versao));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Registrar nova versão do artigo",
            description = "Cria uma nova versão do artigo quando houver alteração legislativa. " +
                    "A versão anterior é automaticamente encerrada.")
    public ResponseEntity<ArtigoVersaoResponse> criarVersao(
            @PathVariable UUID artigoId,
            @Valid @RequestBody NovaVersaoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                versaoService.criarNovaVersao(
                        artigoId,
                        request.novoConteudo(),
                        request.motivoAlteracao(),
                        request.autorAlteracao(),
                        request.leiAlteradora(),
                        request.dataVigencia()
                )
        );
    }

    @GetMapping("/comparar")
    @Operation(summary = "Comparar duas versões lado a lado",
            description = "Mostra as diferenças entre duas versões do artigo, destacando o que foi adicionado, " +
                    "removido ou modificado. Ideal para acompanhar alterações legislativas.")
    public ResponseEntity<ComparacaoArtigoResponse> compararVersoes(
            @PathVariable UUID artigoId,
            @RequestParam Integer versaoAntiga,
            @RequestParam Integer versaoNova) {
        return ResponseEntity.ok(versaoService.compararVersoes(artigoId, versaoAntiga, versaoNova));
    }

    @GetMapping("/{versao}/comparar-atual")
    @Operation(summary = "Comparar versão com a atual",
            description = "Compara uma versão antiga com a versão atualmente em vigor do artigo")
    public ResponseEntity<ComparacaoArtigoResponse> compararComAtual(
            @PathVariable UUID artigoId,
            @PathVariable Integer versao) {
        return ResponseEntity.ok(versaoService.compararComAtual(artigoId, versao));
    }

    public record NovaVersaoRequest(
            @NotBlank(message = "O novo conteúdo é obrigatório")
            String novoConteudo,
            String motivoAlteracao,
            String autorAlteracao,
            String leiAlteradora,
            LocalDate dataVigencia
    ) {}
}
