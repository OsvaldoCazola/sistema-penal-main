package com.api.sistema_penal.api.controller;

import com.api.sistema_penal.api.dto.legislacao.*;
import com.api.sistema_penal.domain.entity.Lei;
import com.api.sistema_penal.service.BuscaOnlineService;
import com.api.sistema_penal.service.LeiService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/leis")
@RequiredArgsConstructor
@Tag(name = "Legislação", description = "Gestão de leis e artigos")
@SecurityRequirement(name = "bearerAuth")
public class LeiController {

    private final LeiService leiService;
    private final BuscaOnlineService buscaOnlineService;

    @GetMapping
    @Operation(summary = "Listar leis com paginação")
    public ResponseEntity<Page<LeiSummaryResponse>> listar(
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) Integer ano,
            @PageableDefault(size = 20, sort = "ano", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<LeiSummaryResponse> result;
        if (tipo != null) {
            result = leiService.listarPorTipo(tipo.toUpperCase(), pageable);
        } else if (ano != null) {
            result = leiService.listarPorAno(ano, pageable);
        } else {
            result = leiService.listar(pageable);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar lei por ID")
    public ResponseEntity<LeiResponse> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(leiService.buscarPorId(id));
    }

    @GetMapping("/identificacao")
    @Operation(summary = "Buscar lei por tipo, número e ano")
    public ResponseEntity<LeiResponse> buscarPorIdentificacao(
            @RequestParam String tipo,
            @RequestParam String numero,
            @RequestParam Integer ano
    ) {
        return ResponseEntity.ok(leiService.buscarPorIdentificacao(tipo.toUpperCase(), numero, ano));
    }

    @GetMapping("/busca")
    @Operation(summary = "Busca full-text em leis")
    public ResponseEntity<Page<LeiSummaryResponse>> buscar(
            @RequestParam String q,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return ResponseEntity.ok(leiService.buscarPorTexto(q, pageable));
    }

    @GetMapping("/artigos/busca")
    @Operation(summary = "Busca full-text em artigos")
    public ResponseEntity<Page<ArtigoResponse>> buscarArtigos(
            @RequestParam String q,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return ResponseEntity.ok(leiService.buscarArtigosPorTexto(q, pageable));
    }

    @GetMapping("/{id}/artigos")
    @Operation(summary = "Listar artigos de uma lei")
    public ResponseEntity<List<ArtigoResponse>> listarArtigos(@PathVariable UUID id) {
        return ResponseEntity.ok(leiService.listarArtigos(id));
    }

    @GetMapping("/tipos")
    @Operation(summary = "Listar tipos de leis disponíveis")
    public ResponseEntity<List<String>> listarTipos() {
        return ResponseEntity.ok(leiService.listarTipos());
    }

    @GetMapping("/anos")
    @Operation(summary = "Listar anos disponíveis")
    public ResponseEntity<List<Integer>> listarAnos() {
        return ResponseEntity.ok(leiService.listarAnos());
    }

    // Endpoint de Importação de Leis da Internet
    @GetMapping("/importar/buscar")
    @Operation(summary = "Buscar leis disponíveis para importação online")
    public ResponseEntity<List<Map<String, String>>> buscarLeisOnline(
            @RequestParam(required = false) String termo) {
        List<Map<String, String>> resultados = buscaOnlineService.buscarLeisOnlineSimulado(
            termo != null ? termo : "", null);
        return ResponseEntity.ok(resultados);
    }

    @PostMapping("/importar")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Importar lei da internet para o banco local")
    public ResponseEntity<LeiResponse> importarLei(@RequestBody LeiRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leiService.criar(request));
    }

    // Endpoints de Integridade
    @GetMapping("/{id}/integridade")
    @Operation(summary = "Buscar integridade da lei")
    public ResponseEntity<LeiIntegridadeResponse> buscarIntegridade(@PathVariable UUID id) {
        return ResponseEntity.ok(leiService.buscarIntegridade(id));
    }

    @GetMapping("/{id}/integridade/historico")
    @Operation(summary = "Buscar histórico de integridade da lei")
    public ResponseEntity<List<LeiIntegridadeResponse>> buscarHistoricoIntegridade(@PathVariable UUID id) {
        return ResponseEntity.ok(leiService.buscarHistoricoIntegridade(id));
    }

    @PostMapping("/{id}/integridade/verificar")
    @Operation(summary = "Verificar integridade da lei")
    public ResponseEntity<LeiIntegridadeResponse> verificarIntegridade(@PathVariable UUID id) {
        return ResponseEntity.ok(leiService.verificarIntegridade(id));
    }

    // Endpoints de Elementos Jurídicos
    @GetMapping("/artigos/{artigoId}/elementos")
    @Operation(summary = "Listar elementos jurídicos de um artigo")
    public ResponseEntity<List<ElementoJuridicoResponse>> listarElementosJuridicos(@PathVariable UUID artigoId) {
        return ResponseEntity.ok(leiService.listarElementosJuridicos(artigoId));
    }

    @PostMapping("/artigos/{artigoId}/elementos")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Adicionar elemento jurídico a um artigo")
    public ResponseEntity<ElementoJuridicoResponse> adicionarElementoJuridico(
            @PathVariable UUID artigoId,
            @Valid @RequestBody ElementoJuridicoRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leiService.adicionarElementoJuridico(artigoId, request));
    }

    @DeleteMapping("/elementos/{elementoId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Excluir elemento jurídico")
    public ResponseEntity<Void> excluirElementoJuridico(@PathVariable UUID elementoId) {
        leiService.excluirElementoJuridico(elementoId);
        return ResponseEntity.noContent().build();
    }

    // Endpoints de Penalidades
    @GetMapping("/artigos/{artigoId}/penalidades")
    @Operation(summary = "Listar penalidades de um artigo")
    public ResponseEntity<List<PenalidadeResponse>> listarPenalidades(@PathVariable UUID artigoId) {
        return ResponseEntity.ok(leiService.listarPenalidades(artigoId));
    }

    @PostMapping("/artigos/{artigoId}/penalidades")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Adicionar penalidade a um artigo")
    public ResponseEntity<PenalidadeResponse> adicionarPenalidade(
            @PathVariable UUID artigoId,
            @Valid @RequestBody PenalidadeRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leiService.adicionarPenalidade(artigoId, request));
    }

    @DeleteMapping("/penalidades/{penalidadeId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Excluir penalidade")
    public ResponseEntity<Void> excluirPenalidade(@PathVariable UUID penalidadeId) {
        leiService.excluirPenalidade(penalidadeId);
        return ResponseEntity.noContent().build();
    }

    // Endpoints de Categorias
    @GetMapping("/categorias")
    @Operation(summary = "Listar categorias de crime")
    public ResponseEntity<List<CategoriaCrimeResponse>> listarCategorias() {
        return ResponseEntity.ok(leiService.listarCategorias());
    }

    @PostMapping("/categorias")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Criar categoria de crime")
    public ResponseEntity<CategoriaCrimeResponse> criarCategoria(
            @Valid @RequestBody CategoriaCrimeRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leiService.criarCategoria(request));
    }

    @PostMapping("/artigos/{artigoId}/categorias/{categoriaId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Associar categoria a um artigo")
    public ResponseEntity<CategoriaCrimeResponse> adicionarArtigoCategoria(
            @PathVariable UUID artigoId,
            @PathVariable UUID categoriaId
    ) {
        return ResponseEntity.ok(leiService.adicionarArtigoCategoria(artigoId, categoriaId));
    }

    // CRUD básico de Leis
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Criar nova lei")
    public ResponseEntity<LeiResponse> criar(@Valid @RequestBody LeiRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leiService.criar(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Atualizar lei")
    public ResponseEntity<LeiResponse> atualizar(
            @PathVariable UUID id,
            @Valid @RequestBody LeiRequest request
    ) {
        return ResponseEntity.ok(leiService.atualizar(id, request));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Alterar status da lei")
    public ResponseEntity<Map<String, String>> alterarStatus(
            @PathVariable UUID id,
            @RequestParam Lei.StatusLei status
    ) {
        leiService.alterarStatus(id, status);
        return ResponseEntity.ok(Map.of("message", "Status alterado para " + status));
    }

    @PostMapping("/{id}/artigos")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Adicionar artigo à lei")
    public ResponseEntity<ArtigoResponse> adicionarArtigo(
            @PathVariable UUID id,
            @Valid @RequestBody ArtigoRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(leiService.adicionarArtigo(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Excluir lei")
    public ResponseEntity<Void> excluir(@PathVariable UUID id) {
        leiService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
