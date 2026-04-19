package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.Penalidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PenalidadeRepository extends JpaRepository<Penalidade, UUID> {

    List<Penalidade> findByArtigoId(UUID artigoId);

    List<Penalidade> findByArtigoIdAndTipoPena(UUID artigoId, Penalidade.TipoPena tipoPena);
}
