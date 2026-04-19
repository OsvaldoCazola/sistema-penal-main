package com.api.sistema_penal.api.controller;

import com.api.sistema_penal.api.dto.auth.RegisterRequest;
import com.api.sistema_penal.api.dto.auth.UsuarioResponse;
import com.api.sistema_penal.api.dto.usuario.AlterarSenhaRequest;
import com.api.sistema_penal.api.dto.usuario.AtualizarUsuarioRequest;
import com.api.sistema_penal.api.dto.usuario.UsuarioSummaryResponse;
import com.api.sistema_penal.domain.entity.Usuario;
import com.api.sistema_penal.domain.entity.Usuario.Role;
import com.api.sistema_penal.domain.repository.UsuarioRepository;
import com.api.sistema_penal.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
@Tag(name = "Usuários", description = "Gestão de usuários")
@SecurityRequirement(name = "bearerAuth")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping("/me")
    @Operation(summary = "Obter dados do usuário autenticado")
    public ResponseEntity<UsuarioResponse> me(@AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow();
        return ResponseEntity.ok(UsuarioResponse.from(usuario));
    }

    @PutMapping("/me")
    @Operation(summary = "Atualizar dados do usuário autenticado")
    public ResponseEntity<UsuarioResponse> atualizarMe(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AtualizarUsuarioRequest request
    ) {
        Usuario usuario = usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow();
        return ResponseEntity.ok(usuarioService.atualizar(usuario.getId(), request));
    }

    @PostMapping("/me/alterar-senha")
    @Operation(summary = "Alterar senha do usuário autenticado")
    public ResponseEntity<Map<String, String>> alterarMinhaSenha(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AlterarSenhaRequest request
    ) {
        Usuario usuario = usuarioRepository.findByEmail(userDetails.getUsername())
                .orElseThrow();
        usuarioService.alterarSenha(usuario.getId(), request.senhaAtual(), request.novaSenha());
        return ResponseEntity.ok(Map.of("message", "Senha alterada com sucesso"));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar todos os usuários")
    public ResponseEntity<Page<UsuarioSummaryResponse>> listar(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) String busca,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        Page<UsuarioSummaryResponse> result;
        if (busca != null && !busca.isBlank()) {
            result = usuarioService.buscar(busca, pageable);
        } else if (role != null) {
            result = usuarioService.listarPorRole(role, pageable);
        } else {
            result = usuarioService.listar(pageable);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Buscar usuário por ID")
    public ResponseEntity<UsuarioResponse> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(usuarioService.buscarPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Criar novo usuário")
    public ResponseEntity<UsuarioResponse> criar(
            @Valid @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(usuarioService.criar(request, request.role()));
    }

    // Endpoint removido para garantir que admin não possa editar usuários
    // O admin pode apenas criar usuários, listar e alterar roles
    
    @PatchMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Alterar role do usuário")
    public ResponseEntity<Map<String, String>> alterarRole(
            @PathVariable UUID id,
            @RequestBody Role role
    ) {
        usuarioService.alterarRole(id, role);
        return ResponseEntity.ok(Map.of("message", "Role alterada para " + role));
    }

    @PostMapping("/{id}/resetar-senha")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Resetar senha do usuário")
    public ResponseEntity<Map<String, String>> resetarSenha(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body
    ) {
        usuarioService.resetarSenha(id, body.get("novaSenha"));
        return ResponseEntity.ok(Map.of("message", "Senha resetada com sucesso"));
    }

    @PostMapping("/{id}/ativar")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Ativar usuário")
    public ResponseEntity<Map<String, String>> ativar(@PathVariable UUID id) {
        usuarioService.ativar(id);
        return ResponseEntity.ok(Map.of("message", "Usuário ativado"));
    }

    @PostMapping("/{id}/desativar")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Desativar usuário")
    public ResponseEntity<Map<String, String>> desativar(@PathVariable UUID id) {
        usuarioService.desativar(id);
        return ResponseEntity.ok(Map.of("message", "Usuário desativado"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Excluir usuário")
    public ResponseEntity<Void> excluir(@PathVariable UUID id) {
        usuarioService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/estatisticas")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Estatísticas de usuários")
    public ResponseEntity<Map<String, Object>> estatisticas() {
        return ResponseEntity.ok(Map.of(
                "totalAtivos", usuarioService.contarAtivos(),
                "admins", usuarioService.contarPorRole(Role.ADMIN),
                "advogados", usuarioService.contarPorRole(Role.ADVOGADO)
        ));
    }
}
