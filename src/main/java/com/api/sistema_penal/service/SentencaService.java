package com.api.sistema_penal.service;

import com.api.sistema_penal.api.dto.sentenca.*;
import com.api.sistema_penal.domain.entity.Processo;
import com.api.sistema_penal.domain.entity.Sentenca;
import com.api.sistema_penal.domain.entity.Sentenca.TipoDecisao;
import com.api.sistema_penal.domain.repository.ProcessoRepository;
import com.api.sistema_penal.domain.repository.SentencaRepository;
import com.api.sistema_penal.exception.BusinessException;
import com.api.sistema_penal.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SentencaService {

    private final SentencaRepository sentencaRepository;
    private final ProcessoRepository processoRepository;

    @Transactional(readOnly = true)
    public Page<SentencaSummaryResponse> listar(Pageable pageable) {
        return sentencaRepository.findAll(pageable).map(SentencaSummaryResponse::from);
    }

    @Transactional(readOnly = true)
    public Page<SentencaSummaryResponse> listarPorTipoDecisao(TipoDecisao tipo, Pageable pageable) {
        return sentencaRepository.findByTipoDecisao(tipo, pageable).map(SentencaSummaryResponse::from);
    }

    @Transactional(readOnly = true)
    public Page<SentencaSummaryResponse> listarPorPeriodo(LocalDate inicio, LocalDate fim, Pageable pageable) {
        return sentencaRepository.findByPeriodo(inicio, fim, pageable).map(SentencaSummaryResponse::from);
    }

    @Transactional(readOnly = true)
    public Page<SentencaSummaryResponse> listarPorTipoCrime(UUID tipoCrimeId, Pageable pageable) {
        // Funcionalidade n�o dispon�vel - Processo n�o possui campo tipoCrime
        return Page.empty(pageable);
    }

    @Transactional(readOnly = true)
    public Page<SentencaSummaryResponse> buscarJurisprudencia(String termo, Pageable pageable) {
        return sentencaRepository.buscarPorTexto(termo, pageable).map(SentencaSummaryResponse::from);
    }

    @Transactional(readOnly = true)
    public SentencaResponse buscarPorId(UUID id) {
        Sentenca sentenca = sentencaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Senten�a", id));
        return SentencaResponse.from(sentenca);
    }

    @Transactional(readOnly = true)
    public SentencaResponse buscarPorProcesso(UUID processoId) {
        Sentenca sentenca = sentencaRepository.findByProcessoId(processoId)
                .orElseThrow(() -> new ResourceNotFoundException("Senten�a do processo " + processoId));
        return SentencaResponse.from(sentenca);
    }

    @Transactional
    public SentencaResponse criar(SentencaRequest request) {
        if (sentencaRepository.findByProcessoId(request.processoId()).isPresent()) {
            throw new BusinessException("Processo j� possui senten�a");
        }

        Processo processo = processoRepository.findById(request.processoId())
                .orElseThrow(() -> new ResourceNotFoundException("Processo", request.processoId()));

        Sentenca sentenca = Sentenca.builder()
                .processo(processo)
                .tipoDecisao(request.tipoDecisao())
                .penaMeses(request.penaMeses())
                .tipoPena(request.tipoPena())
                .regime(request.regime())
                .dataSentenca(request.dataSentenca())
                .ementa(request.ementa())
                .fundamentacao(request.fundamentacao())
                .dispositivo(request.dispositivo())
                .narrativa(request.narrativa())
                .juizNome(request.juizNome())
                .circunstancias(request.circunstancias() != null ? request.circunstancias() : new HashMap<>())
                .build();

        processo.setStatus(Processo.StatusProcesso.SENTENCIADO);
        processoRepository.save(processo);

        return SentencaResponse.from(sentencaRepository.save(sentenca));
    }

    @Transactional
    public SentencaResponse atualizar(UUID id, SentencaRequest request) {
        Sentenca sentenca = sentencaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Senten�a", id));

        sentenca.setTipoDecisao(request.tipoDecisao());
        sentenca.setPenaMeses(request.penaMeses());
        sentenca.setTipoPena(request.tipoPena());
        sentenca.setRegime(request.regime());
        sentenca.setDataSentenca(request.dataSentenca());
        sentenca.setEmenta(request.ementa());
        sentenca.setFundamentacao(request.fundamentacao());
        sentenca.setDispositivo(request.dispositivo());
        sentenca.setNarrativa(request.narrativa());
        sentenca.setJuizNome(request.juizNome());
        if (request.circunstancias() != null) {
            sentenca.setCircunstancias(request.circunstancias());
        }

        return SentencaResponse.from(sentencaRepository.save(sentenca));
    }

    @Transactional
    public void marcarTransitadoJulgado(UUID id) {
        Sentenca sentenca = sentencaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Senten�a", id));
        
        sentenca.setTransitadoJulgado(true);
        sentencaRepository.save(sentenca);

        Processo processo = sentenca.getProcesso();
        processo.setStatus(Processo.StatusProcesso.TRANSITADO_JULGADO);
        processo.setDataEncerramento(LocalDate.now());
        processoRepository.save(processo);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> estatisticas() {
        Map<String, Object> stats = new HashMap<>();

        Map<String, Long> porTipoDecisao = sentencaRepository.countByTipoDecisao().stream()
                .collect(Collectors.toMap(
                        arr -> ((TipoDecisao) arr[0]).name(),
                        arr -> (Long) arr[1]
                ));

        stats.put("porTipoDecisao", porTipoDecisao);
        stats.put("total", sentencaRepository.count());
        stats.put("condenacoes", porTipoDecisao.getOrDefault("CONDENACAO", 0L));
        stats.put("absolicoes", porTipoDecisao.getOrDefault("ABSOLVICAO", 0L));

        // Calcular m�dia de pena apenas para condamna��es
        Double mediaPena = sentencaRepository.mediaPenaPorTipoDecisao(TipoDecisao.CONDENACAO);
        stats.put("mediaPena", mediaPena != null ? mediaPena : 0.0);

        return stats;
    }

    @Transactional(readOnly = true)
    public Double mediaPenaPorTipoCrime(UUID tipoCrimeId) {
        // Funcionalidade n�o dispon�vel - Processo n�o possui campo tipoCrime
        return null;
    }
}

