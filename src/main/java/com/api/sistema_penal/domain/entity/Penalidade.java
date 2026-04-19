package com.api.sistema_penal.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "penalidades")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Penalidade {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artigo_id", nullable = false)
    private Artigo artigo;

    @Column(name = "pena_min_anos")
    private Integer penaMinAnos;

    @Column(name = "pena_min_meses")
    private Integer penaMinMeses;

    @Column(name = "pena_min_dias")
    private Integer penaMinDias;

    @Column(name = "pena_max_anos")
    private Integer penaMaxAnos;

    @Column(name = "pena_max_meses")
    private Integer penaMaxMeses;

    @Column(name = "pena_max_dias")
    private Integer penaMaxDias;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_pena", nullable = false)
    private TipoPena tipoPena;

    @Column(name = "multa_min")
    private BigDecimal multaMin;

    @Column(name = "multa_max")
    private BigDecimal multaMax;

    @Column(name = "descricao")
    private String descricao;

    @Column(name = "regime")
    private String regime;

    @Column(name = "flagrante")
    private Boolean flagrante;

    @Column(name = "detencao")
    private Boolean detencao;

    @Column(name = "reclusao")
    private Boolean reclusao;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum TipoPena {
        PRIVACAO_LIBERDADE,
        MULTA,
        RESTRITIVA_DIREITOS,
        COMUNITARIA,
        ALTERNATIVA,
        DETENCAO,
        RECLUSAO
    }
}
