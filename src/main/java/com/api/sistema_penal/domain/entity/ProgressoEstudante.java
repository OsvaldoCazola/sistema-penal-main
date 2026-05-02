package com.api.sistema_penal.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "progresso_estudante",
        uniqueConstraints = @UniqueConstraint(name = "uk_progresso_usuario_caso", columnNames = {"usuario_id", "caso_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProgressoEstudante {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "caso_id")
    private CasoSimulado caso;

    @Builder.Default
    @Column(nullable = false)
    private Integer totalPerguntas = 0;

    @Builder.Default
    @Column(nullable = false)
    private Integer perguntasRespondidas = 0;

    @Builder.Default
    @Column(nullable = false)
    private Integer perguntasCorretas = 0;

    @Builder.Default
    @Column(nullable = false)
    private Integer pontuacaoObtida = 0;

    @Builder.Default
    @Column(nullable = false)
    private Integer pontuacaoMaxima = 0;

    @Builder.Default
    @Column(nullable = false)
    private Double percentualConclusao = 0.0;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.NAO_INICIADO;

    private LocalDateTime iniciadoEm;
    private LocalDateTime atualizadoEm;
    private LocalDateTime concluidoEm;

    @PrePersist
    void onCreate() {
        var agora = LocalDateTime.now();
        if (iniciadoEm == null) {
            iniciadoEm = agora;
        }
        atualizadoEm = agora;
    }

    @PreUpdate
    void onUpdate() {
        atualizadoEm = LocalDateTime.now();
    }

    public enum Status {
        NAO_INICIADO,
        EM_ANDAMENTO,
        CONCLUIDO
    }
}
