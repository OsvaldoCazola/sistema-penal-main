package com.api.sistema_penal.api.controller;

import com.api.sistema_penal.domain.entity.Permission;
import com.api.sistema_penal.domain.repository.PermissionRepository;
import com.api.sistema_penal.service.PermissionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
@Tag(name = "Permissões", description = "Gestão de permissões de acesso")
@SecurityRequirement(name = "bearerAuth")
public class PermissionController {

    private final PermissionService permissionService;
    private final PermissionRepository permissionRepository;

    /**
     * Inicializa as permissões padrão do sistema
     */
    @PostMapping("/initialize")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Inicializar permissões padrão")
    public ResponseEntity<String> initializePermissions() {
        permissionService.initializeDefaultPermissions();
        return ResponseEntity.ok("Permissões padrão inicializadas com sucesso!");
    }

    /**
     * Lista todas as permissões disponíveis
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    @Operation(summary = "Listar todas as permissões")
    public ResponseEntity<List<Permission>> getAllPermissions() {
        return ResponseEntity.ok(permissionRepository.findAll());
    }

    /**
     * Obtém permissões de um usuário específico
     */
    @GetMapping("/usuario/{usuarioId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    @Operation(summary = "Obter permissões de um usuário")
    public ResponseEntity<Set<Permission>> getUsuarioPermissions(@PathVariable UUID usuarioId) {
        return ResponseEntity.ok(permissionService.getUsuarioPermissions(usuarioId));
    }

    /**
     * Adiciona permissões a um usuário
     */
    @PostMapping("/usuario/{usuarioId}/add")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Adicionar permissões a um usuário")
    public ResponseEntity<?> addPermissionsToUsuario(
            @PathVariable UUID usuarioId,
            @RequestBody(required = false) List<String> permissionNames) {
        if (permissionNames == null || permissionNames.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Lista de permissões não pode ser vazia"));
        }
        try {
            return ResponseEntity.ok(permissionService.addPermissionsToUsuario(usuarioId, permissionNames));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }

    /**
     * Remove permissões de um usuário
     */
    @PostMapping("/usuario/{usuarioId}/remove")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Remover permissões de um usuário")
    public ResponseEntity<?> removePermissionsFromUsuario(
            @PathVariable UUID usuarioId,
            @RequestBody(required = false) List<String> permissionNames) {
        if (permissionNames == null || permissionNames.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("erro", "Lista de permissões não pode ser vazia"));
        }
        try {
            return ResponseEntity.ok(permissionService.removePermissionsFromUsuario(usuarioId, permissionNames));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("erro", e.getMessage()));
        }
    }
}
