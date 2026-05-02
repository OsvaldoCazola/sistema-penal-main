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
@Table(name = "respostas_estudante")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RespostaEstudante {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "caso_id")
    private CasoSimulado caso;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pergunta_id")
    private PerguntaCaso pergunta;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String respostaDada;

    @Column(columnDefinition = "TEXT")
    private String feedbackProfessor;

    private Boolean correta;

    private Integer pontosObtidos;

    @Column(nullable = false)
    private LocalDateTime respondidoEm;

    @PrePersist
    void onCreate() {
        if (respondidoEm == null) {
            respondidoEm = LocalDateTime.now();
        }
    }
}
