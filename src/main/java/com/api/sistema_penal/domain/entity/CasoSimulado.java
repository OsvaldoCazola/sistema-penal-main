package com.api.sistema_penal.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "casos_simulados")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class CasoSimulado {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;
    
    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricaoFacto;
    
    @Column(nullable = false)
    private Integer nivel;

    @Column(nullable = false)
    private String categoria;

    @Column(nullable = false)
    private String artigosRelacionados;
    
    @Column(columnDefinition = "TEXT")
    private String gabaritoExplicacao;
    
    @Builder.Default
    @Column(nullable = false)
    private Boolean ativo = true;

    @Builder.Default
    @OneToMany(mappedBy = "caso", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("ordem ASC")
    private List<PerguntaCaso> perguntas = new ArrayList<>();

    public void adicionarPergunta(PerguntaCaso pergunta) {
        perguntas.add(pergunta);
        pergunta.setCaso(this);
    }

    public void removerPergunta(PerguntaCaso pergunta) {
        perguntas.remove(pergunta);
        pergunta.setCaso(null);
    }
}
