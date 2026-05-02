package com.api.sistema_penal.service;

import com.api.sistema_penal.api.dto.educacional.ProgressoCasoResponse;
import com.api.sistema_penal.domain.entity.CasoSimulado;
import com.api.sistema_penal.domain.entity.ProgressoEstudante;
import com.api.sistema_penal.domain.entity.Usuario;
import com.api.sistema_penal.domain.repository.ProgressoEstudanteRepository;
import com.api.sistema_penal.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgressoService {

    private final ProgressoEstudanteRepository progressoRepository;

    @Transactional(readOnly = true)
    public List<ProgressoCasoResponse> listarProgresso(Usuario usuario) {
        List<ProgressoEstudante> progressos = progressoRepository.findByUsuarioId(usuario.getId());
        return progressos.stream()
                .map(this::mapearProgresso)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProgressoCasoResponse obterProgresso(Usuario usuario, Long casoId) {
        ProgressoEstudante progresso = progressoRepository.findByUsuarioIdAndCasoId(usuario.getId(), casoId)
                .orElseThrow(() -> new ResourceNotFoundException("Progresso não encontrado para este caso"));
        return mapearProgresso(progresso);
    }

    @Transactional(readOnly = true)
    public ProgressoCasoResponse obterProgressoAdmin(UUID usuarioId, Long casoId) {
        ProgressoEstudante progresso = progressoRepository.findByUsuarioIdAndCasoId(usuarioId, casoId)
                .orElseThrow(() -> new ResourceNotFoundException("Progresso não encontrado"));
        return mapearProgresso(progresso);
    }

    private ProgressoCasoResponse mapearProgresso(ProgressoEstudante progresso) {
        CasoSimulado caso = progresso.getCaso();
        return new ProgressoCasoResponse(
                caso.getId(),
                caso.getTitulo(),
                progresso.getTotalPerguntas(),
                progresso.getPerguntasRespondidas(),
                progresso.getPerguntasCorretas(),
                progresso.getPontuacaoObtida(),
                progresso.getPontuacaoMaxima(),
                progresso.getPercentualConclusao(),
                progresso.getStatus().name(),
                progresso.getAtualizadoEm()
        );
    }
}
