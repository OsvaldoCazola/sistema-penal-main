package com.api.sistema_penal.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "caso_gerado_chat")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CasoGeradoChat {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.UUID)
    private UUID id;

    @Column(name = "usuario_id", nullable = false)
    @JdbcTypeCode(SqlTypes.UUID)
    private UUID usuarioId;

    @Column(name = "tema", length = 255)
    private String tema;

    @Column(name = "descricao", nullable = false)
    private String descricao;

    @Column(name = "pergunta_quiz", nullable = false)
    private String perguntaQuiz;

    @Column(name = "resposta_correta", nullable = false)
    private String respostaCorreta;

    @Column(name = "artigos_usados")
    private String artigosUsados;

    @Column(name = "ativo", nullable = false)
    private Boolean ativo;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    protected void onCreate() {
        criadoEm = LocalDateTime.now();
        if (ativo == null) {
            ativo = true;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        // updated_at not needed as we don't have this column
    }
}