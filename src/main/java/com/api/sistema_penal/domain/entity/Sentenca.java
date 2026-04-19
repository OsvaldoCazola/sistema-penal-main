package com.api.sistema_penal.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "sentencas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sentenca {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "processo_id")
    private Processo processo;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_decisao", nullable = false)
    private TipoDecisao tipoDecisao;

    @Column(name = "pena_meses")
    private Integer penaMeses;

    @Column(name = "tipo_pena")
    private String tipoPena;

    private String regime;

    @Column(name = "data_sentenca", nullable = false)
    private LocalDate dataSentenca;

    @Column(columnDefinition = "TEXT")
    private String ementa;

    @Column(columnDefinition = "TEXT")
    private String fundamentacao;

    @Column(columnDefinition = "TEXT")
    private String dispositivo;

    @Column(name = "narrativa", columnDefinition = "TEXT")
    private String narrativa;

    @Column(name = "juiz_nome")
    private String juizNome;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    @Builder.Default
    private Map<String, Object> circunstancias = new HashMap<>();

    @Column(name = "transitado_julgado")
    @Builder.Default
    private Boolean transitadoJulgado = false;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    @Builder.Default
    private Map<String, Object> metadata = new HashMap<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum TipoDecisao {
        CONDENACAO,
        ABSOLVICAO,
        EXTINCAO_PUNIBILIDADE,
        DESCLASSIFICACAO,
        PRONUNCIA,
        IMPRONUNCIA
    }
}
