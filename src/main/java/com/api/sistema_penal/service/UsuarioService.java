package com.api.sistema_penal.service;

import com.api.sistema_penal.api.dto.auth.RegisterRequest;
import com.api.sistema_penal.api.dto.auth.UsuarioResponse;
import com.api.sistema_penal.api.dto.usuario.AtualizarUsuarioRequest;
import com.api.sistema_penal.api.dto.usuario.UsuarioSummaryResponse;
import com.api.sistema_penal.domain.entity.Usuario;
import com.api.sistema_penal.domain.entity.Usuario.Role;
import com.api.sistema_penal.domain.repository.UsuarioRepository;
import com.api.sistema_penal.exception.BusinessException;
import com.api.sistema_penal.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public Page<UsuarioSummaryResponse> listar(Pageable pageable) {
        return usuarioRepository.findAll(pageable)
                .map(UsuarioSummaryResponse::from);
    }

    @Transactional(readOnly = true)
    public Page<UsuarioSummaryResponse> listarPorRole(Role role, Pageable pageable) {
        return usuarioRepository.findByRole(role, pageable)
                .map(UsuarioSummaryResponse::from);
    }

    @Transactional(readOnly = true)
    public Page<UsuarioSummaryResponse> buscar(String termo, Pageable pageable) {
        return usuarioRepository.buscarPorTermo(termo, pageable)
                .map(UsuarioSummaryResponse::from);
    }

    @Transactional(readOnly = true)
    public UsuarioResponse buscarPorId(UUID id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", id));
        return UsuarioResponse.from(usuario);
    }

    @Transactional
    public UsuarioResponse criar(RegisterRequest request, Role role) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email já cadastrado: " + request.email());
        }

        Usuario usuario = Usuario.builder()
                .nome(request.nome())
                .email(request.email())
                .senhaHash(passwordEncoder.encode(request.senha()))
                .role(role)
                .ativo(true)
                .build();

        return UsuarioResponse.from(usuarioRepository.save(usuario));
    }

    @Transactional
    public UsuarioResponse atualizar(UUID id, AtualizarUsuarioRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", id));

        if (request.nome() != null) {
            usuario.setNome(request.nome());
        }
        if (request.email() != null && !request.email().equals(usuario.getEmail())) {
            if (usuarioRepository.existsByEmail(request.email())) {
                throw new BusinessException("Email já em uso: " + request.email());
            }
            usuario.setEmail(request.email());
        }
        if (request.metadata() != null) {
            usuario.setMetadata(request.metadata());
        }

        return UsuarioResponse.from(usuarioRepository.save(usuario));
    }

    @Transactional
    public void alterarSenha(UUID id, String senhaAtual, String novaSenha) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", id));

        if (!passwordEncoder.matches(senhaAtual, usuario.getSenhaHash())) {
            throw new BusinessException("Senha atual incorreta");
        }

        usuario.setSenhaHash(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void resetarSenha(UUID id, String novaSenha) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", id));
        usuario.setSenhaHash(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void alterarRole(UUID id, Role novaRole) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", id));
        usuario.setRole(novaRole);
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void ativar(UUID id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", id));
        usuario.setAtivo(true);
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void desativar(UUID id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", id));
        usuario.setAtivo(false);
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void excluir(UUID id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuário", id);
        }
        usuarioRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public long contarPorRole(Role role) {
        return usuarioRepository.countByRole(role);
    }

    @Transactional(readOnly = true)
    public long contarAtivos() {
        return usuarioRepository.countByAtivoTrue();
    }
}
