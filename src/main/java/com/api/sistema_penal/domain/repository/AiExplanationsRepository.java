package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.AiExplanations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository para persistência de explicações da IA
 */
@Repository
public interface AiExplanationsRepository extends JpaRepository<AiExplanations, UUID> {

    /**
     * Busca todas as explicações para um termo de busca específico
     */
    List<AiExplanations> findByTermoBusca(String termoBusca);

    /**
     * Busca explicações por ID do artigo
     */
    List<AiExplanations> findByArtigoId(UUID artigoId);

    /**
     * Busca explicações por palavra-chave
     */
    List<AiExplanations> findByPalavraChave(String palavraChave);

    /**
     * Busca explicações por tipo de palavra
     */
    List<AiExplanations> findByTipoPalavra(AiExplanations.TipoPalavra tipoPalavra);

    /**
     * Busca explicações por usuário
     */
    List<AiExplanations> findByUsuarioId(UUID usuarioId);

    /**
     * Deleta explicações por termo de busca
     */
    void deleteByTermoBusca(String termoBusca);
}
