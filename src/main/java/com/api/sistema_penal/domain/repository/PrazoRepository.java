package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.Prazo;
import com.api.sistema_penal.domain.entity.Prazo.StatusPrazo;
import com.api.sistema_penal.domain.entity.Prazo.TipoPrazo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PrazoRepository extends JpaRepository<Prazo, UUID> {

    List<Prazo> findByProcessoId(UUID processoId);

    Page<Prazo> findByStatus(StatusPrazo status, Pageable pageable);

    Page<Prazo> findByTipo(TipoPrazo tipo, Pageable pageable);

    @Query("SELECT p FROM Prazo p WHERE p.status = :status AND p.dataFim = :dataFim")
    List<Prazo> findByStatusAndDataFim(@Param("status") StatusPrazo status, @Param("dataFim") LocalDate dataFim);

    @Query("SELECT p FROM Prazo p WHERE p.dataFim BETWEEN :inicio AND :fim AND p.status IN ('ATIVO', 'EM_ANDAMENTO')")
    List<Prazo> findPrazosProximosVencimento(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);

    @Query("SELECT p FROM Prazo p WHERE p.status = 'VENCIDO'")
    Page<Prazo> findPrazosVencidos(Pageable pageable);

    @Query("SELECT p FROM Prazo p WHERE p.status = 'VENCIDO' AND p.notificadoVencimento = false")
    List<Prazo> findPrazosVencidosNaoNotificados();

    @Query("SELECT p FROM Prazo p WHERE p.status IN ('ATIVO', 'EM_ANDAMENTO') AND p.dataFim <= :dataLimite")
    List<Prazo> findPrazosAVencer(@Param("dataLimite") LocalDate dataLimite);

    @Query("SELECT COUNT(p) FROM Prazo p WHERE p.status = :status")
    long countByStatus(@Param("status") StatusPrazo status);

    @Query("SELECT p.status, COUNT(p) FROM Prazo p GROUP BY p.status")
    List<Object[]> countGroupByStatus();

    @Query("SELECT p.tipo, COUNT(p) FROM Prazo p GROUP BY p.tipo")
    List<Object[]> countGroupByTipo();

    @Query("SELECT p FROM Prazo p WHERE p.notificado = false AND p.status IN ('ATIVO', 'EM_ANDAMENTO') AND p.dataFim <= :dataLimite")
    List<Prazo> findPrazosANotificar(@Param("dataLimite") LocalDate dataLimite);

    Optional<Prazo> findByIdAndCriadoPorId(UUID id, UUID criadoPorId);

    @Query("""
            SELECT p FROM Prazo p 
            WHERE (:tipo IS NULL OR p.tipo = :tipo)
            AND (:status IS NULL OR p.status = :status)
            AND (:processoId IS NULL OR p.processo.id = :processoId)
            AND (:inicio IS NULL OR p.dataInicio >= :inicio)
            AND (:fim IS NULL OR p.dataFim <= :fim)
            """)
    Page<Prazo> findByFilters(
            @Param("tipo") TipoPrazo tipo,
            @Param("status") StatusPrazo status,
            @Param("processoId") UUID processoId,
            @Param("inicio") LocalDate inicio,
            @Param("fim") LocalDate fim,
            Pageable pageable);
}
