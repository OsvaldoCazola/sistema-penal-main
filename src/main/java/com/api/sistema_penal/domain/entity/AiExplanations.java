package com.api.sistema_penal.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Entidade para armazenar explicações geradas pela IA
 * Armazena o mapeamento entre palavras-chave e artigos sugeridos
 */
@Entity
@Table(name = "ai_explanations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiExplanations {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "termo_busca", nullable = false, length = 1000)
    private String termoBusca;

    @Column(name = "artigo_id")
    private UUID artigoId;

    @Column(name = "artigo_titulo", length = 500)
    private String artigoTitulo;

    @Column(name = "palavra_chave", length = 255)
    private String palavraChave;

    @Column(name = "tipo_palavra")
    @Enumerated(EnumType.STRING)
    private TipoPalavra tipoPalavra;

    @Column(name = "relevancia")
    private Double relevancia;

    @Column(name = "justificativa", length = 2000)
    private String justificativa;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "usuario_id")
    private UUID usuarioId;

    /**
     * Tipo de palavra detectada na análise
     */
    public enum TipoPalavra {
        CRIME,       // Palavra relacionada ao tipo de crime
        AGRAVANTE,   // Circunstância agravante
        ATENUANTE,   // Circunstância atenuante
        LOCALE,      // Local do crime
        MEIO,        // Meio utilizado
        SUJEITO,     // Sujeito passivo/ativo
        OUTRO        // Outras palavras relevantes
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
