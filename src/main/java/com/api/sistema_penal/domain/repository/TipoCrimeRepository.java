package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.TipoCrime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TipoCrimeRepository extends JpaRepository<TipoCrime, UUID> {

    List<TipoCrime> findByAtivaTrue();

    List<TipoCrime> findByCategoria(TipoCrime.Categoria categoria);

    List<TipoCrime> findByCategoriaAndAtivaTrue(TipoCrime.Categoria categoria);

    List<TipoCrime> findByCategoriaCrimeId(UUID categoriaCrimeId);

    @Query("SELECT t FROM TipoCrime t WHERE t.ativa = true AND " +
           "(LOWER(t.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "LOWER(t.palavrasChave) LIKE LOWER(CONCAT('%', :termo, '%')))")
    List<TipoCrime> buscarPorTermo(@Param("termo") String termo);

    @Query("SELECT t FROM TipoCrime t JOIN t.artigos a WHERE a.id = :artigoId")
    List<TipoCrime> findByArtigoId(@Param("artigoId") UUID artigoId);
}
