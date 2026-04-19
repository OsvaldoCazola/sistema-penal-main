package com.api.sistema_penal.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Catálogo de tipos de crimes para o Simulador Penal
 * Usado para classificação e busca de crimes
 */
@Entity
@Table(name = "tipos_crime")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TipoCrime {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(name = "nome_plural", length = 100)
    private String nomePlural;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "codigo_penal", length = 50)
    private String codigoPenal;

    @Enumerated(EnumType.STRING)
    @Column(name = "categoria")
    private Categoria categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_crime_id")
    private CategoriaCrime categoriaCrime;

    @ManyToMany
    @JoinTable(
        name = "tipo_crime_artigos",
        joinColumns = @JoinColumn(name = "tipo_crime_id"),
        inverseJoinColumns = @JoinColumn(name = "artigo_id")
    )
    @Builder.Default
    private List<Artigo> artigos = new ArrayList<>();

    @Column(name = "palavras_chave")
    private String palavrasChave;

    @Column(name = "ativa")
    @Builder.Default
    private Boolean ativa = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum Categoria {
        CRIMES_CONTRA_PESSOAS,
        CRIMES_CONTRA_PATRIMONIO,
        CRIMES_CONTRA_SEXUALIDADE,
        CRIMES_CONTRA_FAMILIA,
        CRIMES_CONTRA_HONRA,
        CRIMES_CONTRA_SEGURANCA_COMUM,
        CRIMES_FISCAIS,
        CRIMES_FUNCIONAIS,
        CRIMES_CONTRA_ORDEM_PUBLICA,
        CRIMES_CONTRA_FE_PUBLICA,
        CRIMES_DE_PERIGO_COMUM,
        OUTROS
    }
}
