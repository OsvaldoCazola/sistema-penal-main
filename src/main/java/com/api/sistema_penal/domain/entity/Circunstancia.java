package com.api.sistema_penal.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entidade para armazenar circunstâncias agravantes e atenuantes
 * Usado pelo Simulador Penal e Verificador de Penas
 */
@Entity
@Table(name = "circunstancias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Circunstancia {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoCircunstancia tipo;

    @Column(nullable = false, length = 200)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "percentual_alteracao")
    private Integer percentualAlteracao;

    @Column(name = "base_legal", length = 500)
    private String baseLegal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artigo_id")
    private Artigo artigo;

    @Column(name = "ativa")
    @Builder.Default
    private Boolean ativa = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum TipoCircunstancia {
        AGRAVANTE,
        ATENUANTE,
        QUALIFICADORA,
        CAUSA_DE_AUMENTO,
        CAUSA_DE_DIMINUICAO,
        PRINCIPAIS,
        ACESSORIAS
    }
}
