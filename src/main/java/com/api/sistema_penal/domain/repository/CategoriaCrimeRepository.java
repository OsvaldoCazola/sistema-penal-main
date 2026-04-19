package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.CategoriaCrime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoriaCrimeRepository extends JpaRepository<CategoriaCrime, UUID> {

    Optional<CategoriaCrime> findByNome(String nome);

    Optional<CategoriaCrime> findByCodigo(String codigo);

    List<CategoriaCrime> findByNomeContainingIgnoreCase(String nome);

    @Query("SELECT c FROM CategoriaCrime c WHERE c.nome LIKE %:termo% OR c.codigo LIKE %:termo%")
    List<CategoriaCrime> buscarPorTermo(String termo);
}
