package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.ArtigoVersao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ArtigoVersaoRepository extends JpaRepository<ArtigoVersao, UUID> {

    List<ArtigoVersao> findByArtigoIdOrderByVersaoDesc(UUID artigoId);

    Optional<ArtigoVersao> findByArtigoIdAndVersao(UUID artigoId, Integer versao);

    @Query("SELECT MAX(av.versao) FROM ArtigoVersao av WHERE av.artigo.id = :artigoId")
    Optional<Integer> findMaxVersaoByArtigoId(UUID artigoId);

    @Query("SELECT av FROM ArtigoVersao av WHERE av.artigo.id = :artigoId AND av.dataFimVigencia IS NULL")
    Optional<ArtigoVersao> findVersaoAtualByArtigoId(UUID artigoId);

    @Query("SELECT av FROM ArtigoVersao av WHERE av.artigo.lei.id = :leiId ORDER BY av.artigo.ordem, av.versao DESC")
    List<ArtigoVersao> findAllByLeiId(UUID leiId);
}
