package com.api.sistema_penal.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "prazos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prazo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoPrazo tipo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPrazo status;

    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;

    @Column(name = "data_fim", nullable = false)
    private LocalDate dataFim;

    @Column(name = "dias_prazo")
    private Integer diasPrazo;

    @Column(name = "data_conclusao")
    private LocalDate dataConclusao;

    @Column(name = "notificado")
    @Builder.Default
    private Boolean notificado = false;

    @Column(name = "notificado_vencimento")
    @Builder.Default
    private Boolean notificadoVencimento = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processo_id")
    private Processo processo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "criado_por_id")
    private Usuario criadoPor;

    @Column(name = "observacoes", columnDefinition = "TEXT")
    private String observacoes;

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

    public enum TipoPrazo {
        INVESTIGACAO,
        INSTRUCAO,
        JULGAMENTO,
        RECURSO,
        CUMPRIMENTO_PENA,
        LIBERDADE_CONDICIONAL,
        SUSPENSAO_CONDICIONAL,
        PRISAO_PREVENTIVA,
        APRESENTACAO,
        OUTRO
    }

    public enum StatusPrazo {
        ATIVO,
        EM_ANDAMENTO,
        CUMPRIDO,
        VENCIDO,
        SUSPENSO,
        PRORROGADO,
        CANCELADO
    }
}
