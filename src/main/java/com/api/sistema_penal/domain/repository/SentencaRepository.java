package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.Sentenca;
import com.api.sistema_penal.domain.entity.Sentenca.TipoDecisao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SentencaRepository extends JpaRepository<Sentenca, UUID> {

    Optional<Sentenca> findByProcessoId(UUID processoId);

    Page<Sentenca> findByTipoDecisao(TipoDecisao tipoDecisao, Pageable pageable);

    Page<Sentenca> findByTransitadoJulgadoTrue(Pageable pageable);

    @Query(value = """
            SELECT * FROM sentencas 
            WHERE ementa LIKE CONCAT('%', :termo, '%') OR fundamentacao LIKE CONCAT('%', :termo, '%') OR dispositivo LIKE CONCAT('%', :termo, '%')
            ORDER BY data_sentenca DESC
            """, nativeQuery = true)
    Page<Sentenca> buscarPorTexto(@Param("termo") String termo, Pageable pageable);

    @Query("SELECT s FROM Sentenca s WHERE s.dataSentenca BETWEEN :inicio AND :fim")
    Page<Sentenca> findByPeriodo(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim, Pageable pageable);

    @Query("SELECT s.tipoDecisao, COUNT(s) FROM Sentenca s GROUP BY s.tipoDecisao")
    List<Object[]> countByTipoDecisao();

    List<Sentenca> findByDataSentencaBetween(LocalDate inicio, LocalDate fim);

    @Query("SELECT AVG(s.penaMeses) FROM Sentenca s WHERE s.tipoDecisao = :tipoDecisao AND s.penaMeses IS NOT NULL")
    Double mediaPenaPorTipoDecisao(@Param("tipoDecisao") TipoDecisao tipoDecisao);
}
