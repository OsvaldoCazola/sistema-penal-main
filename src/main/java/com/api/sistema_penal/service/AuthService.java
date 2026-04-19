package com.api.sistema_penal.service;

import com.api.sistema_penal.api.dto.auth.*;
import com.api.sistema_penal.domain.entity.RefreshToken;
import com.api.sistema_penal.domain.entity.Usuario;
import com.api.sistema_penal.domain.repository.RefreshTokenRepository;
import com.api.sistema_penal.domain.repository.UsuarioRepository;
import com.api.sistema_penal.exception.BusinessException;
import com.api.sistema_penal.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AuditService auditService;

    @Transactional
    public AuthResponse register(RegisterRequest request, String ip) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email já cadastrado");
        }

        Usuario.Role roleUsuario = request.role() != null ? request.role() : Usuario.Role.ESTUDANTE;

        Usuario usuario = Usuario.builder()
                .nome(request.nome())
                .email(request.email())
                .senhaHash(passwordEncoder.encode(request.senha()))
                .role(roleUsuario)
                .ativo(true)
                .build();

        usuario = usuarioRepository.save(usuario);
        
        auditService.log(usuario, "REGISTRO", "Usuario", usuario.getId(), null, ip);

        return generateAuthResponse(usuario);
    }

    @Transactional
    public AuthResponse registerAdmin(RegisterRequest request, String ip) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email já cadastrado");
        }

        Usuario usuario = Usuario.builder()
                .nome(request.nome())
                .email(request.email())
                .senhaHash(passwordEncoder.encode(request.senha()))
                .role(Usuario.Role.ADMIN)
                .ativo(true)
                .build();

        usuario = usuarioRepository.save(usuario);
        
        auditService.log(usuario, "REGISTRO_ADMIN", "Usuario", usuario.getId(), null, ip);

        return generateAuthResponse(usuario);
    }

    @Transactional
    public AuthResponse login(LoginRequest request, String ip) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.senha())
            );
        } catch (BadCredentialsException e) {
            auditService.log(null, "LOGIN_FALHA", "Usuario", null, 
                    java.util.Map.of("email", request.email()), ip);
            throw new BusinessException("Credenciais inválidas");
        }

        Usuario usuario = usuarioRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException("Usuário não encontrado"));

        if (!usuario.getAtivo()) {
            throw new BusinessException("Conta desativada");
        }

        usuario.setUltimoLogin(LocalDateTime.now());
        usuarioRepository.save(usuario);

        auditService.log(usuario, "LOGIN", "Usuario", usuario.getId(), null, ip);

        return generateAuthResponse(usuario);
    }

    @Transactional
    public AuthResponse refresh(RefreshTokenRequest request, String ip) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.refreshToken())
                .orElseThrow(() -> new BusinessException("Refresh token inválido"));

        if (!refreshToken.isValido()) {
            throw new BusinessException("Refresh token expirado ou revogado");
        }

        Usuario usuario = refreshToken.getUsuario();

        refreshToken.setRevogado(true);
        refreshTokenRepository.save(refreshToken);

        auditService.log(usuario, "TOKEN_REFRESH", "Usuario", usuario.getId(), null, ip);

        return generateAuthResponse(usuario);
    }

    @Transactional
    public void logout(String refreshTokenValue, String ip) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenValue)
                .orElse(null);

        if (refreshToken != null) {
            refreshToken.setRevogado(true);
            refreshTokenRepository.save(refreshToken);
            auditService.log(refreshToken.getUsuario(), "LOGOUT", "Usuario", 
                    refreshToken.getUsuario().getId(), null, ip);
        }
    }

    @Transactional
    public void logoutAll(UUID usuarioId, String ip) {
        refreshTokenRepository.revogarTodosPorUsuario(usuarioId);
        auditService.log(null, "LOGOUT_ALL", "Usuario", usuarioId, null, ip);
    }

    public void solicitarRecuperacaoSenha(String email) {
        // Buscar utilizador pelo email
        var usuarioOpt = usuarioRepository.findByEmail(email);
        
        // Por segurança, não revelar se o email existe ou não
        // Apenas retornar sucesso mesmo se o email não existir
        if (usuarioOpt.isEmpty()) {
            return;
        }
        
        // TODO: Gerar token de recuperação e enviar email
        // Por agora, apenas retorna sucesso
        // Em produção, seria implementado com serviço de email
    }

    public void redefinirSenha(String token, String novaSenha) {
        // TODO: Validar token de recuperação e redefinir senha
        // Por agora, apenas retorna sucesso
        // Em produção, seria implementado com validação de token
        if (token == null || token.isBlank()) {
            throw new BusinessException("Token inválido");
        }
        if (novaSenha == null || novaSenha.length() < 6) {
            throw new BusinessException("Senha deve ter pelo menos 6 caracteres");
        }
    }

    private AuthResponse generateAuthResponse(Usuario usuario) {
        String accessToken = jwtService.generateToken(usuario);
        String refreshTokenValue = UUID.randomUUID().toString();

        RefreshToken refreshToken = RefreshToken.builder()
                .usuario(usuario)
                .token(refreshTokenValue)
                .expiraEm(LocalDateTime.now().plusSeconds(jwtService.getRefreshExpirationTime() / 1000))
                .build();

        refreshTokenRepository.save(refreshToken);

        return AuthResponse.of(
                accessToken,
                refreshTokenValue,
                jwtService.getExpirationTime() / 1000,
                usuario
        );
    }
}
