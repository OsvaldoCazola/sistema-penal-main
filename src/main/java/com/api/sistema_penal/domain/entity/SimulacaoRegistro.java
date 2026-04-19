package com.api.sistema_penal.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Registro de simulações realizadas no Simulador Penal
 * Usado para métricas e histórico na dashboard
 */
@Entity
@Table(name = "simulacoes_registro")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SimulacaoRegistro {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(name = "tipo_crime", length = 100)
    private String tipoCrime;

    @Column(name = "artigo_numero")
    private String artigoNumero;

    @Column(name = "artigo_titulo", length = 200)
    private String artigoTitulo;

    @Column(name = "probabilidade")
    private Double probabilidade;

    @Column(name = "descricao_caso", columnDefinition = "TEXT")
    private String descricaoCaso;

    @Column(name = "resultado", length = 50)
    private String resultado; // ENQUADRADO, NAO_ENQUADRADO, REQUER_ANALISE

    @Column(name = "nivel_confianca", length = 20)
    private String nivelConfianca; // ALTO, MEDIO, BAIXO

    @Column(name = "ativa")
    @Builder.Default
    private Boolean ativa = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
