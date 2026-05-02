package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.PerguntaCaso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PerguntaCasoRepository extends JpaRepository<PerguntaCaso, UUID> {

    List<PerguntaCaso> findByCasoIdOrderByOrdemAsc(Long casoId);

    long countByCasoId(Long casoId);
}
