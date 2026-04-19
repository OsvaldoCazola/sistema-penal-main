package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.Lei;
import com.api.sistema_penal.domain.entity.Lei.StatusLei;
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
public interface LeiRepository extends JpaRepository<Lei, UUID> {

    Optional<Lei> findByTipoAndNumeroAndAno(String tipo, String numero, Integer ano);

    boolean existsByTipoAndNumeroAndAno(String tipo, String numero, Integer ano);

    Page<Lei> findByStatus(StatusLei status, Pageable pageable);

    Page<Lei> findByTipo(String tipo, Pageable pageable);

    Page<Lei> findByAno(Integer ano, Pageable pageable);

    @Query("SELECT l FROM Lei l WHERE l.titulo LIKE CONCAT('%', :termo, '%') OR l.ementa LIKE CONCAT('%', :termo, '%') OR l.conteudo LIKE CONCAT('%', :termo, '%') ORDER BY l.ano DESC, l.numero")
    Page<Lei> buscarPorTexto(@Param("termo") String termo, Pageable pageable);

    @Query("SELECT l FROM Lei l WHERE l.titulo LIKE CONCAT('%', :termo, '%') OR l.ementa LIKE CONCAT('%', :termo, '%') ORDER BY l.ano DESC, l.numero")
    Page<Lei> buscarPorTituloOuEmenta(@Param("termo") String termo, Pageable pageable);

    @Query("SELECT DISTINCT l.tipo FROM Lei l ORDER BY l.tipo")
    List<String> findAllTipos();

    @Query("SELECT DISTINCT l.ano FROM Lei l ORDER BY l.ano DESC")
    List<Integer> findAllAnos();
}
