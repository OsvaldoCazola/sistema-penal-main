package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {

    Page<AuditLog> findByUsuarioIdOrderByCreatedAtDesc(UUID usuarioId, Pageable pageable);

    Page<AuditLog> findByEntidadeAndEntidadeIdOrderByCreatedAtDesc(String entidade, UUID entidadeId, Pageable pageable);
}
