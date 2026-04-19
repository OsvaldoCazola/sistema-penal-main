package com.api.sistema_penal.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "elementos_juridicos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ElementoJuridico {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artigo_id", nullable = false)
    private Artigo artigo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoElemento tipo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String conteudo;

    @Column(name = "ordem")
    private Integer ordem;

    @Column(name = "descricao")
    private String descricao;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum TipoElemento {
        ACAO,
        CONDICAO,
        PENA,
        QUALIFICADORA,
        CAUSA_DE_AUMENTO,
        CAUSA_DE_DIMINUICAO,
        forma,
        resultado
    }
}
