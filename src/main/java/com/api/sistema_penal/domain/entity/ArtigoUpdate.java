package com.api.sistema_penal.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Entidade para armazenar atualizações de artigos pendentes de aprovação
 * Usado pelo sistema de monitoramento legislativo automático para artigos específicos
 */
@Entity
@Table(name = "artigo_updates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArtigoUpdate {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String conteudo;

    @Column(name = "numero_artigo")
    private Integer numeroArtigo;

    @Column(name = "nome_secao")
    private String nomeSecao;

    @Column(name = "ordem_secao")
    private Integer ordemSecao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lei_id")
    private Lei lei;

    @Column(name = "lei_identificacao")
    private String leiIdentificacao;

    @Column(name = "fonte_url", length = 500)
    private String fonteUrl;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatusUpdate status = StatusUpdate.PENDENTE;

    @Column(name = "fonte_origem")
    @Builder.Default
    private String fonteOrigem = "DIARIO_REPUBLICA";

    @Column(name = "data_descoberta")
    @Builder.Default
    private LocalDateTime dataDescoberta = LocalDateTime.now();

    @Column(name = "data_aprovacao")
    private LocalDateTime dataAprovacao;

    @Column(name = "aprovado_por")
    private String aprovadoPor;

    @Column(name = "motivo_rejeicao")
    private String motivoRejeicao;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    @Builder.Default
    private Map<String, Object> metadata = new HashMap<>();

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum StatusUpdate {
        PENDENTE,
        APROVADO,
        REJEITADO,
        EXPIRADO
    }
}
