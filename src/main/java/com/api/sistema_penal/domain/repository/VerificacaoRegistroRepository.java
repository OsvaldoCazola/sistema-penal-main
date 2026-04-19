package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.VerificacaoRegistro;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VerificacaoRegistroRepository extends JpaRepository<VerificacaoRegistro, UUID> {

    Page<VerificacaoRegistro> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<VerificacaoRegistro> findByUsuarioIdOrderByCreatedAtDesc(UUID usuarioId, Pageable pageable);

    @Query("SELECT COUNT(v) FROM VerificacaoRegistro v")
    long countTotal();

    @Query("SELECT v.tipoCrime, COUNT(v) FROM VerificacaoRegistro v GROUP BY v.tipoCrime ORDER BY COUNT(v) DESC")
    List<Object[]> countGroupByTipoCrime();

    @Query("SELECT v.artigoNumero, COUNT(v) FROM VerificacaoRegistro v WHERE v.artigoNumero IS NOT NULL GROUP BY v.artigoNumero ORDER BY COUNT(v) DESC")
    List<Object[]> countGroupByArtigo();

    @Query("SELECT COUNT(v) FROM VerificacaoRegistro v WHERE v.alerta = true")
    long countAlertas();
}
