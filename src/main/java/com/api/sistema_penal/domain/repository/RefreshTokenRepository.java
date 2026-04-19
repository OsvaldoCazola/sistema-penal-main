package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    Optional<RefreshToken> findByToken(String token);

    @Modifying
    @Query("UPDATE RefreshToken rt SET rt.revogado = true WHERE rt.usuario.id = :usuarioId")
    void revogarTodosPorUsuario(UUID usuarioId);

    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.expiraEm < CURRENT_TIMESTAMP")
    void limparExpirados();
}
