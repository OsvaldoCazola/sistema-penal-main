package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.LeiIntegridade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LeiIntegridadeRepository extends JpaRepository<LeiIntegridade, UUID> {

    Optional<LeiIntegridade> findByLeiId(UUID leiId);

    @Query("SELECT li FROM LeiIntegridade li WHERE li.lei.id = :leiId ORDER BY li.createdAt DESC")
    List<LeiIntegridade> buscarHistoricoPorLeiId(@Param("leiId") UUID leiId);

    @Query("SELECT li FROM LeiIntegridade li WHERE li.lei.id = :leiId AND li.versaoLei = :versao")
    Optional<LeiIntegridade> buscarPorLeiIdEVersao(@Param("leiId") UUID leiId, @Param("versao") Integer versao);

    boolean existsByLeiIdAndStatusVerificacao(UUID leiId, String statusVerificacao);
}
