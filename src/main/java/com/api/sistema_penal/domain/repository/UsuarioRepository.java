package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.Usuario;
import com.api.sistema_penal.domain.entity.Usuario.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {

    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);

    Page<Usuario> findByRole(Role role, Pageable pageable);

    @Query("SELECT u FROM Usuario u WHERE LOWER(u.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :termo, '%'))")
    Page<Usuario> buscarPorTermo(@Param("termo") String termo, Pageable pageable);

    long countByRole(Role role);

    long countByAtivoTrue();

    Page<Usuario> findByAtivoTrue(Pageable pageable);

    // Query que busca usuário com permissões inicializadas (evita N+1)
    @Query("SELECT u FROM Usuario u LEFT JOIN FETCH u.permissions WHERE u.id = :id")
    Optional<Usuario> findByIdWithPermissions(@Param("id") UUID id);
}
