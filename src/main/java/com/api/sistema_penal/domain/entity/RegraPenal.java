package com.api.sistema_penal.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Regras de aplicação de penas
 * Usado pelo Verificador de Penas para calcular a pena final
 */
@Entity
@Table(name = "regras_penal")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegraPenal {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoRegra tipo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artigo_id", nullable = false)
    private Artigo artigo;

    @Column(name = "condicao_json", columnDefinition = "TEXT")
    private String condicaoJson; // Condições para aplicação da regra

    @Column(name = "acao_json", columnDefinition = "TEXT")
    private String acaoJson; // Ação a ser tomada (aumento/diminuição de pena)

    @Column(name = "ordem_aplicacao")
    private Integer ordemAplicacao; // Ordem de aplicação das regras

    @Column(name = "ativa")
    @Builder.Default
    private Boolean ativa = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum TipoRegra {
        AUMENTO_PENA,      // Aumento de pena
        DIMINUICAO_PENA,   // Diminuição de pena
        SUBSTITUICAO,      // Substituição de pena
        ISENCAO,           // Isenção de pena
        CUMULATIVO,        // Pena cumulativa
        ESPECIAL           // Regime especial
    }
}
