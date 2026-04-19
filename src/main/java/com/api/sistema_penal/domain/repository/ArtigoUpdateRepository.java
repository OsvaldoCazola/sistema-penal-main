package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.ArtigoUpdate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ArtigoUpdateRepository extends JpaRepository<ArtigoUpdate, UUID> {

    Page<ArtigoUpdate> findByStatus(ArtigoUpdate.StatusUpdate status, Pageable pageable);

    List<ArtigoUpdate> findByStatusOrderByDataDescobertaDesc(ArtigoUpdate.StatusUpdate status);

    @Query("SELECT COUNT(a) FROM ArtigoUpdate a WHERE a.status = :status")
    long countByStatus(ArtigoUpdate.StatusUpdate status);

    boolean existsByLeiIdAndNumeroArtigoAndStatusNot(UUID leiId, Integer numeroArtigo, ArtigoUpdate.StatusUpdate status);

    @Query("SELECT a FROM ArtigoUpdate a WHERE a.titulo = :titulo AND a.status = 'PENDENTE'")
    List<ArtigoUpdate> findPendingByTitulo(String titulo);
}
