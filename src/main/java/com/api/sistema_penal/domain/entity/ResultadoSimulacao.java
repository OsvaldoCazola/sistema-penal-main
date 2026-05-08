package com.api.sistema_penal.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "resultado_simulacao")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResultadoSimulacao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JdbcTypeCode(SqlTypes.UUID)
    private UUID id;

    @Column(name = "usuario_id", nullable = false)
    @JdbcTypeCode(SqlTypes.UUID)
    private UUID usuarioId;

    @Column(name = "simulacao_id", nullable = false)
    @JdbcTypeCode(SqlTypes.UUID)
    private UUID simulacaoId;

    @Column(name = "caso_id")
    @JdbcTypeCode(SqlTypes.UUID)
    private UUID casoId;

    @Column(name = "respostas_dadas")
    private String respostasDadas;

    @Column(name = "alternativas_corretas")
    private Integer alternativasCorretas;

    @Column(name = "acertos")
    private Integer acertos;

    @Column(name = "pontuacao")
    private Double pontuacao;

    @Column(name = "tipo_crime", length = 100)
    private String tipoCrime;

    @Column(name = "origem", length = 20)
    private String origem;

    @Column(name = "concluido_em", nullable = false)
    private LocalDateTime concluidoEm;

    @PrePersist
    protected void onCreate() {
        concluidoEm = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        // No updated_at column, so nothing to update
    }
}