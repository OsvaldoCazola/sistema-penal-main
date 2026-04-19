package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.SimulacaoRegistro;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SimulacaoRegistroRepository extends JpaRepository<SimulacaoRegistro, UUID> {

    Page<SimulacaoRegistro> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<SimulacaoRegistro> findByUsuarioIdOrderByCreatedAtDesc(UUID usuarioId, Pageable pageable);

    @Query("SELECT COUNT(s) FROM SimulacaoRegistro s")
    long countTotal();

    @Query("SELECT s.tipoCrime, COUNT(s) FROM SimulacaoRegistro s GROUP BY s.tipoCrime ORDER BY COUNT(s) DESC")
    List<Object[]> countGroupByTipoCrime();

    @Query("SELECT s.artigoNumero, COUNT(s) FROM SimulacaoRegistro s WHERE s.artigoNumero IS NOT NULL GROUP BY s.artigoNumero ORDER BY COUNT(s) DESC")
    List<Object[]> countGroupByArtigo();

    @Query("SELECT s.resultado, COUNT(s) FROM SimulacaoRegistro s GROUP BY s.resultado")
    List<Object[]> countGroupByResultado();
}
