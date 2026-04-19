package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.RegraPenal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RegraPenalRepository extends JpaRepository<RegraPenal, UUID> {

    List<RegraPenal> findByAtivaTrue();

    List<RegraPenal> findByArtigoId(UUID artigoId);

    List<RegraPenal> findByArtigoIdAndAtivaTrue(UUID artigoId);

    List<RegraPenal> findByTipo(RegraPenal.TipoRegra tipo);

    List<RegraPenal> findByArtigoIdAndTipo(UUID artigoId, RegraPenal.TipoRegra tipo);

    List<RegraPenal> findByArtigoIdOrderByOrdemAplicacaoAsc(UUID artigoId);
}
