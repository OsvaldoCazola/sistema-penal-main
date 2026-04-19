package com.api.sistema_penal.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "artigo_versoes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArtigoVersao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artigo_id", nullable = false)
    private Artigo artigo;

    @Column(nullable = false)
    private Integer versao;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String conteudo;

    @Column(name = "data_vigencia")
    private LocalDate dataVigencia;

    @Column(name = "data_fim_vigencia")
    private LocalDate dataFimVigencia;

    @Column(name = "motivo_alteracao")
    private String motivoAlteracao;

    @Column(name = "autor_alteracao")
    private String autorAlteracao;

    @Column(name = "lei_alteradora")
    private String leiAlteradora;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
