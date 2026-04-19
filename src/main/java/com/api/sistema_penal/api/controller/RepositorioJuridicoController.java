package com.api.sistema_penal.api.controller;

import com.api.sistema_penal.api.dto.simulador.CircunstanciaRequest;
import com.api.sistema_penal.api.dto.simulador.CircunstanciaResponse;
import com.api.sistema_penal.api.dto.simulador.TipoCrimeRequest;
import com.api.sistema_penal.api.dto.simulador.TipoCrimeResponse;
import com.api.sistema_penal.domain.entity.Artigo;
import com.api.sistema_penal.domain.entity.Circunstancia;
import com.api.sistema_penal.domain.entity.TipoCrime;
import com.api.sistema_penal.service.RepositorioJuridicoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/repositorio")
@RequiredArgsConstructor
@Tag(name = "Repositório Jurídico", description = "Gestão de circunstâncias e tipos de crime")
@SecurityRequirement(name = "bearerAuth")
public class RepositorioJuridicoController {

    private final RepositorioJuridicoService repositorioJuridicoService;

    // ==================== CIRCUNSTÂNCIAS ====================

    @GetMapping("/circunstancias")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Listar todas as circunstâncias")
    public ResponseEntity<List<CircunstanciaResponse>> listarCircunstancias() {
        return ResponseEntity.ok(repositorioJuridicoService.listarCircunstancias());
    }

    @GetMapping("/circunstancias/tipo/{tipo}")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Listar circunstâncias por tipo")
    public ResponseEntity<List<CircunstanciaResponse>> listarCircunstanciasPorTipo(
            @PathVariable Circunstancia.TipoCircunstancia tipo) {
        return ResponseEntity.ok(repositorioJuridicoService.listarCircunstanciasPorTipo(tipo));
    }

    @GetMapping("/circunstancias/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Buscar circunstância por ID")
    public ResponseEntity<CircunstanciaResponse> buscarCircunstancia(@PathVariable UUID id) {
        return ResponseEntity.ok(repositorioJuridicoService.buscarCircunstanciaPorId(id));
    }

    @PostMapping("/circunstancias")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Criar nova circunstância")
    public ResponseEntity<CircunstanciaResponse> criarCircunstancia(
            @Valid @RequestBody CircunstanciaRequest request) {
        return new ResponseEntity<>(
                repositorioJuridicoService.criarCircunstancia(request), 
                HttpStatus.CREATED);
    }

    @PutMapping("/circunstancias/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Atualizar circunstância")
    public ResponseEntity<CircunstanciaResponse> atualizarCircunstancia(
            @PathVariable UUID id,
            @Valid @RequestBody CircunstanciaRequest request) {
        return ResponseEntity.ok(repositorioJuridicoService.atualizarCircunstancia(id, request));
    }

    @DeleteMapping("/circunstancias/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Excluir circunstância")
    public ResponseEntity<Void> excluirCircunstancia(@PathVariable UUID id) {
        repositorioJuridicoService.excluirCircunstancia(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== TIPOS DE CRIME ====================

    @GetMapping("/tipos-crime")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Listar todos os tipos de crime")
    public ResponseEntity<List<TipoCrimeResponse>> listarTiposCrime() {
        return ResponseEntity.ok(repositorioJuridicoService.listarTiposCrime());
    }

    @GetMapping("/tipos-crime/categoria/{categoria}")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Listar tipos de crime por categoria")
    public ResponseEntity<List<TipoCrimeResponse>> listarTiposCrimePorCategoria(
            @PathVariable TipoCrime.Categoria categoria) {
        return ResponseEntity.ok(repositorioJuridicoService.listarTiposCrimePorCategoria(categoria));
    }

    @GetMapping("/tipos-crime/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Buscar tipo de crime por ID")
    public ResponseEntity<TipoCrimeResponse> buscarTipoCrime(@PathVariable UUID id) {
        return ResponseEntity.ok(repositorioJuridicoService.buscarTipoCrimePorId(id));
    }

    @GetMapping("/tipos-crime/busca")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR')")
    @Operation(summary = "Buscar tipos de crime por termo")
    public ResponseEntity<List<TipoCrimeResponse>> buscarTiposCrime(@RequestParam String termo) {
        return ResponseEntity.ok(repositorioJuridicoService.buscarTiposCrimePorTermo(termo));
    }

    @PostMapping("/tipos-crime")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Criar novo tipo de crime")
    public ResponseEntity<TipoCrimeResponse> criarTipoCrime(
            @Valid @RequestBody TipoCrimeRequest request) {
        return new ResponseEntity<>(
                repositorioJuridicoService.criarTipoCrime(request), 
                HttpStatus.CREATED);
    }

    @PutMapping("/tipos-crime/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Atualizar tipo de crime")
    public ResponseEntity<TipoCrimeResponse> atualizarTipoCrime(
            @PathVariable UUID id,
            @Valid @RequestBody TipoCrimeRequest request) {
        return ResponseEntity.ok(repositorioJuridicoService.atualizarTipoCrime(id, request));
    }

    @DeleteMapping("/tipos-crime/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Excluir tipo de crime")
    public ResponseEntity<Void> excluirTipoCrime(@PathVariable UUID id) {
        repositorioJuridicoService.excluirTipoCrime(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== ARTIGOS ====================

    @GetMapping("/artigos")
    @PreAuthorize("hasAnyRole('ADMIN', 'JUIZ', 'PROCURADOR', 'ADVOGADO', 'ESTUDANTE')")
    @Operation(summary = "Listar todos os artigos para seleção")
    public ResponseEntity<List<Artigo>> listarArtigos() {
        return ResponseEntity.ok(repositorioJuridicoService.listarTodosArtigos());
    }
}
