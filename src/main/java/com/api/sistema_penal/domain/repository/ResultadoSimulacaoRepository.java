package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.ResultadoSimulacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ResultadoSimulacaoRepository extends JpaRepository<ResultadoSimulacao, UUID> {

    Page<ResultadoSimulacao> findByUsuarioId(UUID usuarioId, Pageable pageable);

    Page<ResultadoSimulacao> findBySimulacaoId(UUID simulacaoId, Pageable pageable);

    List<ResultadoSimulacao> findByUsuarioIdAndTipoCrime(UUID usuarioId, String tipoCrime);

    List<ResultadoSimulacao> findByUsuarioIdAndSimulacaoId(UUID usuarioId, UUID simulacaoId);

    @Query("SELECT r FROM ResultadoSimulacao r WHERE r.usuarioId = :usuarioId AND r.origem = :origem ORDER BY r.concluidoEm DESC")
    List<ResultadoSimulacao> findByUsuarioIdAndOrigemOrderByConcluidoEmDesc(
            @Param("usuarioId") UUID usuarioId,
            @Param("origem") String origem);

    long countByUsuarioIdAndSimulacaoId(UUID usuarioId, UUID simulacaoId);

    @Query("SELECT DISTINCT r.simulacaoId FROM ResultadoSimulacao r WHERE r.usuarioId = :usuarioId")
    List<UUID> findDistinctSimulacaoIdsByUsuarioId(@Param("usuarioId") UUID usuarioId);
}