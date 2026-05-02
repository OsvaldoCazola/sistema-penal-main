package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.RespostaEstudante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RespostaEstudanteRepository extends JpaRepository<RespostaEstudante, UUID> {

    List<RespostaEstudante> findByUsuarioId(UUID usuarioId);

    List<RespostaEstudante> findByUsuarioIdAndCasoId(UUID usuarioId, Long casoId);

    Optional<RespostaEstudante> findByUsuarioIdAndPerguntaId(UUID usuarioId, UUID perguntaId);
}
