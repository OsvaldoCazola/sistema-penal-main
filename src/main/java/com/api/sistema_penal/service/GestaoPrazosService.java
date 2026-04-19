package com.api.sistema_penal.service;

import com.api.sistema_penal.api.dto.prazo.PrazoRequest;
import com.api.sistema_penal.api.dto.prazo.PrazoResponse;
import com.api.sistema_penal.domain.entity.Prazo;
import com.api.sistema_penal.domain.entity.Prazo.StatusPrazo;
import com.api.sistema_penal.domain.entity.Prazo.TipoPrazo;
import com.api.sistema_penal.domain.entity.Processo;
import com.api.sistema_penal.domain.entity.Usuario;
import com.api.sistema_penal.domain.repository.PrazoRepository;
import com.api.sistema_penal.domain.repository.ProcessoRepository;
import com.api.sistema_penal.domain.repository.UsuarioRepository;
import com.api.sistema_penal.exception.BusinessException;
import com.api.sistema_penal.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GestaoPrazosService {

    private final PrazoRepository prazoRepository;
    private final ProcessoRepository processoRepository;
    private final UsuarioRepository usuarioRepository;
    private final NotificacaoService notificacaoService;

    @Transactional
    public PrazoResponse criar(PrazoRequest request, UUID usuarioId) {
        Usuario criadoPor = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        Prazo prazo = Prazo.builder()
                .nome(request.getNome())
                .descricao(request.getDescricao())
                .tipo(request.getTipo())
                .status(request.getStatus() != null ? request.getStatus() : StatusPrazo.ATIVO)
                .dataInicio(request.getDataInicio())
                .dataFim(request.getDataFim())
                .diasPrazo(calcularDiasPrazo(request.getDataInicio(), request.getDataFim()))
                .criadoPor(criadoPor)
                .observacoes(request.getObservacoes())
                .build();

        if (request.getProcessoId() != null) {
            Processo processo = processoRepository.findById(request.getProcessoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Processo não encontrado"));
            prazo.setProcesso(processo);
        }

        prazo = prazoRepository.save(prazo);
        log.info("Prazo criado: {} para processo: {}", prazo.getId(), prazo.getProcesso() != null ? prazo.getProcesso().getNumero() : "sem processo");

        return mapToResponse(prazo);
    }

    @Transactional(readOnly = true)
    public PrazoResponse buscarPorId(UUID id) {
        Prazo prazo = prazoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prazo não encontrado"));
        return mapToResponse(prazo);
    }

    @Transactional(readOnly = true)
    public Page<PrazoResponse> listar(Pageable pageable) {
        return prazoRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public List<PrazoResponse> listarPorProcesso(UUID processoId) {
        return prazoRepository.findByProcessoId(processoId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<PrazoResponse> listarPorStatus(StatusPrazo status, Pageable pageable) {
        return prazoRepository.findByStatus(status, pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public Page<PrazoResponse> listarPorTipo(TipoPrazo tipo, Pageable pageable) {
        return prazoRepository.findByTipo(tipo, pageable).map(this::mapToResponse);
    }

    @Transactional
    public PrazoResponse atualizar(UUID id, PrazoRequest request) {
        Prazo prazo = prazoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prazo não encontrado"));

        prazo.setNome(request.getNome());
        prazo.setDescricao(request.getDescricao());
        prazo.setTipo(request.getTipo());
        prazo.setDataInicio(request.getDataInicio());
        prazo.setDataFim(request.getDataFim());
        prazo.setDiasPrazo(calcularDiasPrazo(request.getDataInicio(), request.getDataFim()));
        prazo.setObservacoes(request.getObservacoes());

        if (request.getStatus() != null) {
            prazo.setStatus(request.getStatus());
            if (request.getStatus() == StatusPrazo.CUMPRIDO) {
                prazo.setDataConclusao(LocalDate.now());
            }
        }

        if (request.getProcessoId() != null) {
            Processo processo = processoRepository.findById(request.getProcessoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Processo não encontrado"));
            prazo.setProcesso(processo);
        }

        prazo = prazoRepository.save(prazo);
        log.info("Prazo atualizado: {}", prazo.getId());

        return mapToResponse(prazo);
    }

    @Transactional
    public PrazoResponse concluir(UUID id) {
        Prazo prazo = prazoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prazo não encontrado"));

        if (prazo.getStatus() == StatusPrazo.CUMPRIDO) {
            throw new BusinessException("Prazo já está cumprido");
        }

        prazo.setStatus(StatusPrazo.CUMPRIDO);
        prazo.setDataConclusao(LocalDate.now());
        prazo = prazoRepository.save(prazo);

        log.info("Prazo concluído: {}", prazo.getId());
        return mapToResponse(prazo);
    }

    @Transactional
    public PrazoResponse prorrogar(UUID id, LocalDate novaDataFim, String justificativa) {
        Prazo prazo = prazoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prazo não encontrado"));

        if (prazo.getStatus() == StatusPrazo.CUMPRIDO || prazo.getStatus() == StatusPrazo.CANCELADO) {
            throw new BusinessException("Não é possível prorrogar um prazo cumprido ou cancelado");
        }

        LocalDate dataFimAnterior = prazo.getDataFim();
        prazo.setDataFim(novaDataFim);
        prazo.setDiasPrazo(calcularDiasPrazo(prazo.getDataInicio(), novaDataFim));
        prazo.setStatus(StatusPrazo.PRORROGADO);

        String obs = prazo.getObservacoes() != null ? prazo.getObservacoes() : "";
        prazo.setObservacoes(obs + "\n[PRORROGAÇÃO] Data anterior: " + dataFimAnterior + ", Nova data: " + novaDataFim + ", Justificativa: " + justificativa);

        prazo = prazoRepository.save(prazo);
        log.info("Prazo prorrogado: {} de {} para {}", prazo.getId(), dataFimAnterior, novaDataFim);

        return mapToResponse(prazo);
    }

    @Transactional
    public void cancelar(UUID id) {
        Prazo prazo = prazoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prazo não encontrado"));

        prazo.setStatus(StatusPrazo.CANCELADO);
        prazoRepository.save(prazo);
        log.info("Prazo cancelado: {}", id);
    }

    @Transactional(readOnly = true)
    public Page<PrazoResponse> listarVencidos(Pageable pageable) {
        return prazoRepository.findPrazosVencidos(pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public List<PrazoResponse> listarAVencer(LocalDate dataLimite) {
        return prazoRepository.findPrazosAVencer(dataLimite).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<PrazoResponse> listarPorFiltros(TipoPrazo tipo, StatusPrazo status, UUID processoId, LocalDate inicio, LocalDate fim, Pageable pageable) {
        return prazoRepository.findByFilters(tipo, status, processoId, inicio, fim, pageable).map(this::mapToResponse);
    }

    @Transactional
    public void verificarPrazosVencidos() {
        List<Prazo> prazosVencidos = prazoRepository.findPrazosVencidosNaoNotificados();
        
        for (Prazo prazo : prazosVencidos) {
            prazo.setStatus(StatusPrazo.VENCIDO);
            prazo.setNotificadoVencimento(true);
            prazoRepository.save(prazo);

            if (prazo.getProcesso() != null && prazo.getProcesso().getJuizResponsavel() != null) {
                notificacaoService.criarNotificacao(
                    prazo.getProcesso().getJuizResponsavel().getId(),
                    "Prazo Vencido",
                    "O prazo '" + prazo.getNome() + "' do processo " + prazo.getProcesso().getNumero() + " venceu em " + prazo.getDataFim(),
                    "PRAZO_VENCIDO"
                );
            }
            log.info("Notificação enviada para prazo vencido: {}", prazo.getId());
        }
    }

    @Transactional
    public void notificarPrazosProximosVencimento(int diasAntecedencia) {
        LocalDate dataLimite = LocalDate.now().plusDays(diasAntecedencia);
        List<Prazo> prazos = prazoRepository.findPrazosANotificar(dataLimite);

        for (Prazo prazo : prazos) {
            if (!prazo.getNotificado()) {
                prazo.setNotificado(true);
                prazoRepository.save(prazo);

                if (prazo.getProcesso() != null && prazo.getProcesso().getJuizResponsavel() != null) {
                    long diasRestantes = ChronoUnit.DAYS.between(LocalDate.now(), prazo.getDataFim());
                    notificacaoService.criarNotificacao(
                        prazo.getProcesso().getJuizResponsavel().getId(),
                        "Prazo Próximo do Vencimento",
                        "O prazo '" + prazo.getNome() + "' do processo " + prazo.getProcesso().getNumero() + " vence em " + diasRestantes + " dias",
                        "PRAZO_PROXIMO"
                    );
                }
                log.info("Notificação de proximidade enviada para prazo: {}", prazo.getId());
            }
        }
    }

    private int calcularDiasPrazo(LocalDate inicio, LocalDate fim) {
        return (int) ChronoUnit.DAYS.between(inicio, fim);
    }

    private PrazoResponse mapToResponse(Prazo prazo) {
        PrazoResponse response = PrazoResponse.fromEntity(prazo);
        
        if (prazo.getProcesso() != null) {
            response.setProcessoInfo(prazo.getProcesso().getId(), prazo.getProcesso().getNumero());
        }
        
        if (prazo.getCriadoPor() != null) {
            response.setCriadoPorInfo(prazo.getCriadoPor().getId(), prazo.getCriadoPor().getNome());
        }
        
        return response;
    }
}
