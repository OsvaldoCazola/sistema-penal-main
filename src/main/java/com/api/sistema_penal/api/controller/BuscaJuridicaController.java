package com.api.sistema_penal.api.controller;

import com.api.sistema_penal.api.dto.busca.AnaliseCasoRequest;
import com.api.sistema_penal.api.dto.busca.AnaliseCasoResponse;
import com.api.sistema_penal.api.dto.busca.BuscaSemanticaRequest;
import com.api.sistema_penal.api.dto.busca.BuscaSemanticaResponse;
import com.api.sistema_penal.api.dto.busca.BuscaSemanticaResponse.ListaResultados;
import com.api.sistema_penal.domain.entity.AiExplanations;
import com.api.sistema_penal.domain.entity.CategoriaJuridica;
import com.api.sistema_penal.domain.repository.AiExplanationsRepository;
import com.api.sistema_penal.service.BuscaSemanticaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Controlador para busca semântica jurídica
 * Implementa TF-IDF para busca local sem necessidade de API externa
 */
@RestController
@RequestMapping("/busca")
@RequiredArgsConstructor
@Tag(name = "Busca Semântica Jurídica", description = "APIs para busca semântica de leis e análise de casos")
@SecurityRequirement(name = "bearerAuth")
public class BuscaJuridicaController {

    private final BuscaSemanticaService service;
    private final AiExplanationsRepository aiExplanationsRepository;

    /**
     * POST /api/busca/semantica
     * Busca por similaridade usando TF-IDF
     */
    @PostMapping("/semantica")
    @Operation(summary = "Busca semântica por similaridade", 
                description = "Busca leis e artigos similares usando TF-IDF local (sem API externa)")
    public ResponseEntity<BuscaSemanticaResponse.ListaResultados> buscarSemantica(
            @Valid @RequestBody BuscaSemanticaRequest request) {
        var resultado = service.buscarPorSimilaridade(request);
        return ResponseEntity.ok(resultado);
    }

    /**
     * POST /api/busca/relacionadas
     * Busca leis relacionadas a uma categoria
     */
    @PostMapping("/relacionadas")
    @Operation(summary = "Buscar leis relacionadas por categoria",
                description = "Lista leis e artigos de uma categoria jurídica específica")
    public ResponseEntity<BuscaSemanticaResponse.ListaResultados> buscarRelacionadas(
            @RequestParam CategoriaJuridica categoria,
            @RequestParam(defaultValue = "20") Integer limite) {
        var resultado = service.buscarPorCategoria(categoria, limite);
        return ResponseEntity.ok(resultado);
    }

    /**
     * POST /api/busca/analisar-caso
     * Analisa um caso e sugere leis aplicáveis
     */
    @PostMapping("/analisar-caso")
    @PreAuthorize("hasAnyRole('JUIZ', 'PROCURADOR', 'ADVOGADO', 'ESTUDANTE')")
    @Operation(summary = "Analisar caso jurídico",
                description = "Analisa uma descrição de caso e sugere leis aplicáveis com explicações")
    public ResponseEntity<AnaliseCasoResponse> analisarCaso(
            @Valid @RequestBody AnaliseCasoRequest request) {
        var resultado = service.analisarCaso(request);
        return ResponseEntity.ok(resultado);
    }

    /**
     * GET /api/busca/categorias
     * Lista todas as categorias disponíveis
     */
    @GetMapping("/categorias")
    @Operation(summary = "Listar categorias jurídicas",
                description = "Retorna todas as categorias de direito disponíveis")
    public ResponseEntity<List<CategoriaJuridica>> listarCategorias() {
        return ResponseEntity.ok(service.getCategorias());
    }

    /**
     * GET /api/busca/explicacoes
     * Busca explicações salvas no banco de dados
     */
    @GetMapping("/explicacoes")
    @Operation(summary = "Buscar explicações da IA",
                description = "Retorna explicações geradas pela IA para buscas anteriores")
    public ResponseEntity<List<AiExplanations>> getExplicacoes(
            @RequestParam(required = false) String termoBusca,
            @RequestParam(required = false) UUID artigoId,
            @RequestParam(required = false) UUID usuarioId,
            @RequestParam(required = false) AiExplanations.TipoPalavra tipoPalavra) {
        
        List<AiExplanations> explicacoes;
        
        if (termoBusca != null) {
            explicacoes = aiExplanationsRepository.findByTermoBusca(termoBusca);
        } else if (artigoId != null) {
            explicacoes = aiExplanationsRepository.findByArtigoId(artigoId);
        } else if (usuarioId != null) {
            explicacoes = aiExplanationsRepository.findByUsuarioId(usuarioId);
        } else if (tipoPalavra != null) {
            explicacoes = aiExplanationsRepository.findByTipoPalavra(tipoPalavra);
        } else {
            explicacoes = aiExplanationsRepository.findAll();
        }
        
        return ResponseEntity.ok(explicacoes);
    }
}
