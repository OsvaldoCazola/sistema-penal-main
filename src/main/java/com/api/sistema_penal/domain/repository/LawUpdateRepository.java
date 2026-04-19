package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.LawUpdate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LawUpdateRepository extends JpaRepository<LawUpdate, UUID> {

    Page<LawUpdate> findByStatus(LawUpdate.StatusUpdate status, Pageable pageable);

    List<LawUpdate> findByStatusOrderByDataDescobertaDesc(LawUpdate.StatusUpdate status);

    @Query("SELECT COUNT(u) FROM LawUpdate u WHERE u.status = :status")
    long countByStatus(LawUpdate.StatusUpdate status);

    boolean existsByTipoAndNumeroAndAnoAndStatusNot(String tipo, String numero, Integer ano, LawUpdate.StatusUpdate status);

    @Query("SELECT u FROM LawUpdate u WHERE u.tipo = :tipo AND u.numero = :numero AND u.ano = :ano AND u.status = 'PENDENTE'")
    List<LawUpdate> findPendingByIdentificacao(String tipo, String numero, Integer ano);
}
