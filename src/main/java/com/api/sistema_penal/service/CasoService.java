package com.api.sistema_penal.service;

import com.api.sistema_penal.api.dto.educacional.CasoDetalheResponse;
import com.api.sistema_penal.api.dto.educacional.CasoResumoResponse;
import com.api.sistema_penal.api.dto.educacional.PerguntaCasoResponse;
import com.api.sistema_penal.domain.entity.CasoSimulado;
import com.api.sistema_penal.domain.entity.PerguntaCaso;
import com.api.sistema_penal.domain.entity.ProgressoEstudante;
import com.api.sistema_penal.domain.entity.ProgressoEstudante.Status;
import com.api.sistema_penal.domain.entity.RespostaEstudante;
import com.api.sistema_penal.domain.entity.Usuario;
import com.api.sistema_penal.domain.repository.CasoSimuladoRepository;
import com.api.sistema_penal.domain.repository.PerguntaCasoRepository;
import com.api.sistema_penal.domain.repository.ProgressoEstudanteRepository;
import com.api.sistema_penal.domain.repository.RespostaEstudanteRepository;
import com.api.sistema_penal.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CasoService {

    private final CasoSimuladoRepository casoSimuladoRepository;
    private final PerguntaCasoRepository perguntaCasoRepository;
    private final RespostaEstudanteRepository respostaEstudanteRepository;
    private final ProgressoEstudanteRepository progressoEstudanteRepository;

    @Transactional(readOnly = true)
    public List<CasoResumoResponse> listarCasos(Integer nivel, String categoria, Usuario usuario) {
        List<CasoSimulado> casos = filtrarCasos(nivel, categoria);
        Map<Long, ProgressoEstudante> progressoPorCaso = obterProgressoPorCaso(usuario);

        return casos.stream()
                .map(caso -> {
                    ProgressoEstudante progresso = progressoPorCaso.get(caso.getId());
                    int totalPerguntas = (int) perguntaCasoRepository.countByCasoId(caso.getId());
                    Double percentual = progresso != null ? progresso.getPercentualConclusao() : 0.0;
                    String status = progresso != null ? progresso.getStatus().name() : "NAO_INICIADO";
                    return new CasoResumoResponse(
                            caso.getId(),
                            caso.getTitulo(),
                            caso.getNivel(),
                            caso.getCategoria(),
                            totalPerguntas,
                            percentual,
                            status
                    );
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CasoDetalheResponse obterCasoDetalhe(Long casoId, Usuario usuario) {
        CasoSimulado caso = casoSimuladoRepository.findById(casoId)
                .orElseThrow(() -> new ResourceNotFoundException("Caso não encontrado"));

        List<PerguntaCaso> perguntas = perguntaCasoRepository.findByCasoIdOrderByOrdemAsc(casoId);
        Map<UUID, RespostaEstudante> respostasPorPergunta = respostasPorPergunta(usuario, casoId);
        ProgressoEstudante progresso = (usuario != null && usuario.getId() != null)
                ? progressoEstudanteRepository.findByUsuarioIdAndCasoId(usuario.getId(), casoId).orElse(null)
                : null;

        boolean gabaritoDisponivel = usuario != null && (usuario.getRole() == Usuario.Role.ADMIN
                || (progresso != null && progresso.getStatus() == Status.CONCLUIDO));

        List<PerguntaCasoResponse> perguntasResponse = perguntas.stream()
                .map(pergunta -> {
                    RespostaEstudante resposta = respostasPorPergunta.get(pergunta.getId());
                    return new PerguntaCasoResponse(
                            pergunta.getId(),
                            pergunta.getOrdem(),
                            pergunta.getTitulo(),
                            pergunta.getEnunciado(),
                            pergunta.getPontuacaoMaxima(),
                            resposta != null ? resposta.getRespostaDada() : null,
                            resposta != null ? resposta.getCorreta() : null,
                            resposta != null ? resposta.getPontosObtidos() : null
                    );
                })
                .collect(Collectors.toList());

        return new CasoDetalheResponse(
                caso.getId(),
                caso.getTitulo(),
                caso.getDescricaoFacto(),
                caso.getNivel(),
                caso.getCategoria(),
                caso.getArtigosRelacionados(),
                gabaritoDisponivel,
                gabaritoDisponivel ? caso.getGabaritoExplicacao() : null,
                perguntasResponse
        );
    }

    private List<CasoSimulado> filtrarCasos(Integer nivel, String categoria) {
        if (nivel != null) {
            return casoSimuladoRepository.findByNivelAndAtivoTrue(nivel);
        }
        if (StringUtils.hasText(categoria)) {
            return casoSimuladoRepository.findByCategoriaContainingIgnoreCase(categoria.trim());
        }
        return casoSimuladoRepository.findByAtivoTrue();
    }

    private Map<Long, ProgressoEstudante> obterProgressoPorCaso(Usuario usuario) {
        if (usuario == null || usuario.getId() == null) {
            return Collections.emptyMap();
        }
        return progressoEstudanteRepository.findByUsuarioId(usuario.getId()).stream()
                .collect(Collectors.toMap(
                        progresso -> progresso.getCaso().getId(),
                        progresso -> progresso,
                        (progresso1, progresso2) -> progresso2
                ));
    }

    private Map<UUID, RespostaEstudante> respostasPorPergunta(Usuario usuario, Long casoId) {
        if (usuario == null || usuario.getId() == null) {
            return Collections.emptyMap();
        }
        return respostaEstudanteRepository.findByUsuarioIdAndCasoId(usuario.getId(), casoId)
                .stream()
                .filter(resposta -> resposta.getPergunta() != null)
                .collect(Collectors.toMap(
                        resposta -> resposta.getPergunta().getId(),
                        resposta -> resposta,
                        (existente, substituta) -> substituta
                ));
    }
}
