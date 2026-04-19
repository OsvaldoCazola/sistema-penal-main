package com.api.sistema_penal.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "permissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(name = "resource", length = 50)
    @Enumerated(EnumType.STRING)
    private Resource resource;

    @Column(name = "action", length = 20)
    @Enumerated(EnumType.STRING)
    private Action action;

    @ManyToMany(mappedBy = "permissions")
    @Builder.Default
    @JsonIgnore
    private Set<Usuario> usuarios = new HashSet<>();

    public enum Resource {
        PROCESSO,
        SENTENCA,
        LEI,
        ARTIGO,
        USUARIO,
        DASHBOARD,
        BLOCKCHAIN,
        MONITORAMENTO,
        JURISPRUDENCIA,
        BUSCA,
        RELATORIO,
        PERMISSION
    }

    public enum Action {
        CREATE,
        READ,
        UPDATE,
        DELETE,
        EXECUTE
    }
}
