package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.Circunstancia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CircunstanciaRepository extends JpaRepository<Circunstancia, UUID> {

    List<Circunstancia> findByAtivaTrue();

    List<Circunstancia> findByTipo(Circunstancia.TipoCircunstancia tipo);

    List<Circunstancia> findByTipoAndAtivaTrue(Circunstancia.TipoCircunstancia tipo);

    List<Circunstancia> findByArtigoId(UUID artigoId);

    List<Circunstancia> findByArtigoIdAndTipo(UUID artigoId, Circunstancia.TipoCircunstancia tipo);
}
