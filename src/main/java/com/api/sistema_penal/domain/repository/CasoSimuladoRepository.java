package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.CasoSimulado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CasoSimuladoRepository extends JpaRepository<CasoSimulado, Long> {

    List<CasoSimulado> findByNivelAndAtivoTrue(Integer nivel);

    List<CasoSimulado> findByAtivoTrue();

    @Query("SELECT c FROM CasoSimulado c WHERE c.ativo = true AND LOWER(c.categoria) LIKE LOWER(CONCAT('%', :categoria, '%'))")
    List<CasoSimulado> findByCategoriaContainingIgnoreCase(@Param("categoria") String categoria);
}
