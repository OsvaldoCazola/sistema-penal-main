package com.api.sistema_penal.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "lei_integridade")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeiIntegridade {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lei_id", nullable = false)
    private Lei lei;

    @Column(nullable = false, length = 64)
    private String hash;

    @Column(name = "hash_conteudo")
    private String hashConteudo;

    @Column(name = "data_verificacao")
    private LocalDateTime dataVerificacao;

    @Column(name = "status_verificacao")
    private String statusVerificacao;

    @Column(name = "versao_lei")
    private Integer versaoLei;

    @Column(name = "observacoes")
    private String observacoes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        dataVerificacao = LocalDateTime.now();
    }
}
