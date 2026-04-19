package com.api.sistema_penal.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "processos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Processo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String numero;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "juiz_responsavel_id")
    private Usuario juizResponsavel;

    @ManyToMany
    @JoinTable(
        name = "processo_usuarios_autorizados",
        joinColumns = @JoinColumn(name = "processo_id"),
        inverseJoinColumns = @JoinColumn(name = "usuario_id")
    )
    @Builder.Default
    private List<Usuario> usuariosAutorizados = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private NivelSigilo nivelSigilo = NivelSigilo.INTERNO;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatusProcesso status = StatusProcesso.EM_ANDAMENTO;

    private String fase;

    @Column(name = "tipo_crime", length = 100)
    private String tipoCrime;

    @Column(name = "data_abertura", nullable = false)
    private LocalDate dataAbertura;

    @Column(name = "data_fato")
    private LocalDate dataFato;

    @Column(name = "data_encerramento")
    private LocalDate dataEncerramento;

    @Column(name = "descricao_fatos", columnDefinition = "TEXT")
    private String descricaoFatos;

    @Column(name = "local_fato")
    private String localFato;

    private String provincia;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    @Builder.Default
    private List<Parte> partes = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    @Builder.Default
    private Map<String, Object> metadata = new HashMap<>();

    @OneToMany(mappedBy = "processo", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("dataEvento DESC")
    @Builder.Default
    private List<Movimentacao> movimentacoes = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void addMovimentacao(Movimentacao mov) {
        movimentacoes.add(mov);
        mov.setProcesso(this);
    }

    public enum StatusProcesso {
        EM_ANDAMENTO,
        AGUARDANDO_AUDIENCIA,
        EM_JULGAMENTO,
        SENTENCIADO,
        EM_RECURSO,
        TRANSITADO_JULGADO,
        ARQUIVADO,
        SUSPENSO
    }

    public enum NivelSigilo {
        PUBLICO,
        INTERNO,
        SIGILOSO,
        SECRETO
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Parte {
        private String tipo;
        private String nome;
        private String documento;
        private String tipoDocumento;
        private String endereco;
        private String telefone;
        private String advogadoNome;
        private String advogadoOab;
    }
}
