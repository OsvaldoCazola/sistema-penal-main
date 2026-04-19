package com.api.sistema_penal.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "senha_hash", nullable = false)
    private String senhaHash;

    @Column(nullable = false)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Role role = Role.ESTUDANTE;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "usuario_permissions",
            joinColumns = @JoinColumn(name = "usuario_id"),
            inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    @Builder.Default
    private Set<Permission> permissions = new HashSet<>();

    @Builder.Default
    private Boolean ativo = true;

    @Column(name = "ultimo_login")
    private LocalDateTime ultimoLogin;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    @Builder.Default
    private Map<String, Object> metadata = new HashMap<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        
        // Adiciona a role como autoridade
        if (role != null) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.name()));
        }
        
        // Inicializa permissions com proteção contra proxy Hibernate não inicializado
        Set<Permission> perms;
        try {
            // Tenta acessar para forçar inicialização se for proxy
            if (permissions == null) {
                perms = new HashSet<>();
            } else {
                perms = new HashSet<>(permissions);
            }
        } catch (org.hibernate.LazyInitializationException e) {
            // Se falhar por lazy loading, cria coleção vazia e loga warning
            perms = new HashSet<>();
        }
        
        // Adiciona cada permissão como autoridade
        for (Permission permission : perms) {
            if (permission != null && permission.getName() != null) {
                authorities.add(new SimpleGrantedAuthority("PERM_" + permission.getName().toUpperCase()));
            }
        }
        
        return authorities;
    }

    @Override
    public String getPassword() {
        return senhaHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return ativo;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return ativo;
    }

    public enum Role {
        ADMIN,
        JUIZ,
        PROCURADOR,
        ADVOGADO,
        ESTUDANTE
    }
}
