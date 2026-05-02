package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.ProgressoEstudante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProgressoEstudanteRepository extends JpaRepository<ProgressoEstudante, UUID> {

    Optional<ProgressoEstudante> findByUsuarioIdAndCasoId(UUID usuarioId, Long casoId);

    List<ProgressoEstudante> findByUsuarioId(UUID usuarioId);
}
