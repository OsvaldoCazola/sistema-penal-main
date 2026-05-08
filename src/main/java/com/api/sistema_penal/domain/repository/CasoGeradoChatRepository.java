package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.CasoGeradoChat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CasoGeradoChatRepository extends JpaRepository<CasoGeradoChat, UUID> {

    Page<CasoGeradoChat> findByUsuarioId(UUID usuarioId, Pageable pageable);

    Page<CasoGeradoChat> findByUsuarioIdAndAtivoTrue(UUID usuarioId, Pageable pageable);

    @Query("SELECT c FROM CasoGeradoChat c WHERE c.usuarioId = :usuarioId AND c.ativo = true ORDER BY c.criadoEm DESC")
    List<CasoGeradoChat> findAtivosByUsuarioIdOrderByCriadoEmDesc(@Param("usuarioId") UUID usuarioId);

    long countByUsuarioIdAndAtivoTrue(UUID usuarioId);
}