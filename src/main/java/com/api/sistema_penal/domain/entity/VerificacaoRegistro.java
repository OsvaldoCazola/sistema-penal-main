package com.api.sistema_penal.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Registro de verificações de penas realizadas no Verificador de Penas
 * Usado para métricas e histórico na dashboard
 */
@Entity
@Table(name = "verificacoes_registro")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificacaoRegistro {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @Column(name = "artigo_numero")
    private String artigoNumero;

    @Column(name = "tipo_crime", length = 100)
    private String tipoCrime;

    @Column(name = "pena_final", length = 100)
    private String penaFinal;

    @Column(name = "pena_base", length = 100)
    private String penaBase;

    @Column(name = "regime", length = 50)
    private String regime; // PENA_SUSPENSA, SEMIABERTO, FECHADO

    @Column(name = "num_ajustes")
    private Integer numAjustes;

    @Column(name = "alerta")
    @Builder.Default
    private Boolean alerta = false; // Se houve algum alerta (pena abaixo do mínimo, etc)

    @Column(name = "mensagem_alerta", length = 500)
    private String mensagemAlerta;

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
