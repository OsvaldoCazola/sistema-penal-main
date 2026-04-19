package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.ElementoJuridico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ElementoJuridicoRepository extends JpaRepository<ElementoJuridico, UUID> {

    List<ElementoJuridico> findByArtigoIdOrderByOrdemAsc(UUID artigoId);

    List<ElementoJuridico> findByArtigoIdAndTipo(UUID artigoId, ElementoJuridico.TipoElemento tipo);

    @Query("SELECT e FROM ElementoJuridico e WHERE e.artigo.id = :artigoId AND e.tipo = :tipo")
    List<ElementoJuridico> buscarPorTipo(@Param("artigoId") UUID artigoId, @Param("tipo") ElementoJuridico.TipoElemento tipo);
}
