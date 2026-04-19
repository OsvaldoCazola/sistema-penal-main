package com.api.sistema_penal.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "artigos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Artigo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lei_id", nullable = false)
    private Lei lei;

    @Column(nullable = false, length = 20)
    private String numero;

    @Column(length = 200)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String conteudo;

    @Column(name = "tipo_penal")
    private String tipoPenal;

    @Column(name = "pena_min_anos")
    private Integer penaMinAnos;

    @Column(name = "pena_max_anos")
    private Integer penaMaxAnos;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    @Builder.Default
    private List<Subdivisao> subdivisoes = new ArrayList<>();

    private Integer ordem;

    @Column(name = "versao_atual")
    @Builder.Default
    private Integer versaoAtual = 1;

    @OneToMany(mappedBy = "artigo", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("versao DESC")
    @Builder.Default
    private List<ArtigoVersao> versoes = new ArrayList<>();

    @OneToMany(mappedBy = "artigo", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("ordem ASC")
    @Builder.Default
    private List<ElementoJuridico> elementosJuridicos = new ArrayList<>();

    @OneToMany(mappedBy = "artigo", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Penalidade> penalidades = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "artigo_categoria",
        joinColumns = @JoinColumn(name = "artigo_id"),
        inverseJoinColumns = @JoinColumn(name = "categoria_id")
    )
    @Builder.Default
    private List<CategoriaCrime> categorias = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Subdivisao {
        private String tipo;
        private String numero;
        private String conteudo;
        private List<Subdivisao> filhos;
    }
}
