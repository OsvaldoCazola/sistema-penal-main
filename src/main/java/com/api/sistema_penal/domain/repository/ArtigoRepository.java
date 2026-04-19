package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.Artigo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ArtigoRepository extends JpaRepository<Artigo, UUID> {

    List<Artigo> findByLeiIdOrderByOrdemAsc(UUID leiId);

    Optional<Artigo> findByLeiIdAndNumero(UUID leiId, String numero);

    Long countByLeiId(UUID leiId);

    @Query("SELECT a FROM Artigo a WHERE a.numero LIKE CONCAT('%', :termo, '%') OR a.conteudo LIKE CONCAT('%', :termo, '%') ORDER BY a.ordem")
    Page<Artigo> buscarPorTexto(@Param("termo") String termo, Pageable pageable);

    @Query("SELECT a FROM Artigo a JOIN Lei l ON a.lei.id = l.id WHERE a.conteudo LIKE CONCAT('%', :termo, '%') ORDER BY l.ano DESC, a.ordem")
    Page<Artigo> buscarPorConteudo(@Param("termo") String termo, Pageable pageable);
}
