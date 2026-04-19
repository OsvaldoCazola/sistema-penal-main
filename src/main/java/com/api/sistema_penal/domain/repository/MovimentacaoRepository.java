package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.Movimentacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MovimentacaoRepository extends JpaRepository<Movimentacao, UUID> {

    Page<Movimentacao> findByProcessoIdOrderByDataEventoDesc(UUID processoId, Pageable pageable);
}
