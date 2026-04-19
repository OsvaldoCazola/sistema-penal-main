package com.api.sistema_penal.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "leis")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lei {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String tipo;

    @Column(nullable = false)
    private String numero;

    @Column(nullable = false)
    private Integer ano;

    @Column(nullable = false, length = 500)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String ementa;

    @Column(columnDefinition = "TEXT")
    private String conteudo;

    @Column(name = "data_publicacao")
    private LocalDate dataPublicacao;

    @Column(name = "data_vigencia")
    private LocalDate dataVigencia;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatusLei status = StatusLei.VIGENTE;

    @Column(name = "fonte_url", length = 500)
    private String fonteUrl;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    @Builder.Default
    private Map<String, Object> metadata = new HashMap<>();

    @OneToMany(mappedBy = "lei", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("ordem ASC")
    @Builder.Default
    private List<Artigo> artigos = new ArrayList<>();

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

    public void addArtigo(Artigo artigo) {
        artigos.add(artigo);
        artigo.setLei(this);
    }

    public enum StatusLei {
        VIGENTE,
        REVOGADA,
        PARCIALMENTE_REVOGADA,
        SUSPENSA
    }
}
