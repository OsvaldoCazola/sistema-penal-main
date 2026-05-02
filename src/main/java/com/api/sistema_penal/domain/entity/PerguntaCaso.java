package com.api.sistema_penal.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "perguntas_caso")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerguntaCaso {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "caso_id")
    private CasoSimulado caso;

    @Column(nullable = false)
    private Integer ordem;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String enunciado;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String respostaEsperada;

    @Builder.Default
    @Column(nullable = false)
    private Integer pontuacaoMaxima = 1;

    @Builder.Default
    @Column(nullable = false)
    private Boolean ativa = true;
}
