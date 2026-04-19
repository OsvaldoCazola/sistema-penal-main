package com.api.sistema_penal.api.controller;

import com.api.sistema_penal.api.dto.auth.*;
import com.api.sistema_penal.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticação", description = "Endpoints de autenticação e gestão de tokens")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Registrar novo usuário")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authService.register(request, getClientIp(httpRequest)));
    }

    @PostMapping("/register-admin")
    @Operation(summary = "Registrar usuário admin (apenas para inicialização)")
    public ResponseEntity<AuthResponse> registerAdmin(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authService.registerAdmin(request, getClientIp(httpRequest)));
    }

    @PostMapping("/login")
    @Operation(summary = "Autenticar usuário")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest
    ) {
        return ResponseEntity.ok(authService.login(request, getClientIp(httpRequest)));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Renovar access token")
    public ResponseEntity<AuthResponse> refresh(
            @Valid @RequestBody RefreshTokenRequest request,
            HttpServletRequest httpRequest
    ) {
        return ResponseEntity.ok(authService.refresh(request, getClientIp(httpRequest)));
    }

    @PostMapping("/logout")
    @Operation(summary = "Invalidar refresh token")
    public ResponseEntity<Map<String, String>> logout(
            @Valid @RequestBody RefreshTokenRequest request,
            HttpServletRequest httpRequest
    ) {
        authService.logout(request.refreshToken(), getClientIp(httpRequest));
        return ResponseEntity.ok(Map.of("message", "Logout realizado com sucesso"));
    }

    @PostMapping("/esqueci-senha")
    @Operation(summary = "Solicitar recuperação de senha")
    public ResponseEntity<Map<String, String>> esqueciSenha(
            @RequestBody Map<String, String> request
    ) {
        String email = request.get("email");
        authService.solicitarRecuperacaoSenha(email);
        return ResponseEntity.ok(Map.of("message", "Email de recuperação enviado"));
    }

    @PostMapping("/redefinir-senha")
    @Operation(summary = "Redefinir senha com token")
    public ResponseEntity<Map<String, String>> redefinirSenha(
            @RequestBody Map<String, String> request
    ) {
        String token = request.get("token");
        String novaSenha = request.get("novaSenha");
        authService.redefinirSenha(token, novaSenha);
        return ResponseEntity.ok(Map.of("message", "Senha redefinida com sucesso"));
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
