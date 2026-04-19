package com.api.sistema_penal.service;

import com.api.sistema_penal.api.dto.processo.*;
import com.api.sistema_penal.domain.entity.Movimentacao;
import com.api.sistema_penal.domain.entity.Processo;
import com.api.sistema_penal.domain.entity.Processo.StatusProcesso;
import com.api.sistema_penal.domain.entity.Usuario;
import com.api.sistema_penal.domain.repository.*;
import com.api.sistema_penal.exception.BusinessException;
import com.api.sistema_penal.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
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
public class ProcessoService {

    private final ProcessoRepository processoRepository;
    private final MovimentacaoRepository movimentacaoRepository;

    @Transactional(readOnly = true)
    public Page<ProcessoSummaryResponse> listar(Pageable pageable, Usuario usuario) {
        // ADMIN vê tudo
        if (usuario.getRole() == Usuario.Role.ADMIN) {
            return processoRepository.findAll(pageable).map(ProcessoSummaryResponse::from);
        }
        
        // Outros usuários veem apenas processos que estão autorizados
        return Page.empty(pageable);
    }

    @Transactional(readOnly = true)
    public Page<ProcessoSummaryResponse> listarPorStatus(StatusProcesso status, Pageable pageable) {
        return processoRepository.findByStatus(status, pageable).map(ProcessoSummaryResponse::from);
    }

    @Transactional(readOnly = true)
    public Page<ProcessoSummaryResponse> listarPorTribunal(UUID tribunalId, Pageable pageable) {
        // Funcionalidade desabilitada - Tribunal removido
        return Page.empty(pageable);
    }

    /**
     * Verifica se um usuário pode acessar um processo específico
     */
    public boolean podeAcessar(Processo processo, Usuario usuario) {
        // ADMIN pode acessar tudo
        if (usuario.getRole() == Usuario.Role.ADMIN) {
            return true;
        }
        
        // Se o usuário é juiz responsável, pode acessar
        if (processo.getJuizResponsavel() != null && 
            processo.getJuizResponsavel().getId().equals(usuario.getId())) {
            return true;
        }
        
        // Se o usuário está na lista de autorizados
        if (processo.getUsuariosAutorizados() != null && 
            processo.getUsuariosAutorizados().stream().anyMatch(u -> u.getId().equals(usuario.getId()))) {
            return true;
        }
        
        // Se o processo é público
        if (processo.getNivelSigilo() == Processo.NivelSigilo.PUBLICO) {
            return true;
        }
        
        return false;
    }

    /**
     * Lança exceção se o usuário não pode acessar o processo
     */
    public void verificarAcesso(Processo processo, Usuario usuario) {
        if (!podeAcessar(processo, usuario)) {
            throw new BusinessException("Acesso negado: Você não tem permissão para acessar este processo");
        }
    }

    @Transactional(readOnly = true)
    public Page<ProcessoSummaryResponse> listarPorPeriodo(LocalDate inicio, LocalDate fim, Pageable pageable) {
        return processoRepository.findByPeriodo(inicio, fim, pageable).map(ProcessoSummaryResponse::from);
    }

    @Transactional(readOnly = true)
    public ProcessoResponse buscarPorId(UUID id, Usuario usuario) {
        Processo processo = processoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Processo", id));
        
        // Verifica se o usuário pode acessar
        verificarAcesso(processo, usuario);
        
        return ProcessoResponse.from(processo);
    }

    @Transactional(readOnly = true)
    public ProcessoResponse buscarPorNumero(String numero, Usuario usuario) {
        Processo processo = processoRepository.findByNumero(numero)
                .orElseThrow(() -> new ResourceNotFoundException("Processo número: " + numero));
        
        // Verifica se o usuário pode acessar
        verificarAcesso(processo, usuario);
        
        return ProcessoResponse.from(processo);
    }

    /**
     * Busca processo por ID sem verificação de acesso (para uso interno)
     */
    @Transactional(readOnly = true)
    public Processo buscarProcessoPorId(UUID id) {
        return processoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Processo", id));
    }

    @Transactional
    public ProcessoResponse criar(ProcessoRequest request) {
        if (processoRepository.existsByNumero(request.numero())) {
            throw new BusinessException("Processo já existe: " + request.numero());
        }

        Processo processo = Processo.builder()
                .numero(request.numero())
                .dataAbertura(request.dataAbertura())
                .dataFato(request.dataFato())
                .descricaoFatos(request.descricaoFatos())
                .localFato(request.localFato())
                .provincia(request.provincia())
                .fase(request.fase())
                .metadata(request.metadata() != null ? request.metadata() : new HashMap<>())
                .build();

        if (request.partes() != null) {
            processo.setPartes(request.partes().stream()
                    .map(p -> Processo.Parte.builder()
                            .tipo(p.tipo())
                            .nome(p.nome())
                            .documento(p.documento())
                            .tipoDocumento(p.tipoDocumento())
                            .endereco(p.endereco())
                            .telefone(p.telefone())
                            .advogadoNome(p.advogadoNome())
                            .advogadoOab(p.advogadoOab())
                            .build())
                    .collect(Collectors.toList()));
        }

        return ProcessoResponse.from(processoRepository.save(processo));
    }

    @Transactional
    public ProcessoResponse atualizar(UUID id, ProcessoRequest request) {
        Processo processo = processoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Processo", id));

        processo.setDescricaoFatos(request.descricaoFatos());
        processo.setLocalFato(request.localFato());
        processo.setProvincia(request.provincia());
        processo.setFase(request.fase());
        processo.setDataFato(request.dataFato());

        if (request.partes() != null) {
            processo.setPartes(request.partes().stream()
                    .map(p -> Processo.Parte.builder()
                            .tipo(p.tipo())
                            .nome(p.nome())
                            .documento(p.documento())
                            .tipoDocumento(p.tipoDocumento())
                            .endereco(p.endereco())
                            .telefone(p.telefone())
                            .advogadoNome(p.advogadoNome())
                            .advogadoOab(p.advogadoOab())
                            .build())
                    .collect(Collectors.toList()));
        }

        if (request.metadata() != null) {
            processo.setMetadata(request.metadata());
        }

        return ProcessoResponse.from(processoRepository.save(processo));
    }

    @Transactional
    public void alterarStatus(UUID id, StatusProcesso novoStatus) {
        Processo processo = processoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Processo", id));
        processo.setStatus(novoStatus);
        if (novoStatus == StatusProcesso.ARQUIVADO || novoStatus == StatusProcesso.TRANSITADO_JULGADO) {
            processo.setDataEncerramento(LocalDate.now());
        }
        processoRepository.save(processo);
    }

    @Transactional
    public MovimentacaoResponse adicionarMovimentacao(UUID processoId, MovimentacaoRequest request, Usuario usuario) {
        Processo processo = processoRepository.findById(processoId)
                .orElseThrow(() -> new ResourceNotFoundException("Processo", processoId));

        Movimentacao mov = Movimentacao.builder()
                .tipo(request.tipo())
                .descricao(request.descricao())
                .dataEvento(request.dataEvento())
                .usuario(usuario)
                .build();

        if (request.anexos() != null) {
            mov.setAnexos(request.anexos().stream()
                    .map(a -> Movimentacao.Anexo.builder()
                            .nome(a.nome())
                            .url(a.url())
                            .tipo(a.tipo())
                            .tamanhoBytes(a.tamanhoBytes())
                            .build())
                    .collect(Collectors.toList()));
        }

        processo.addMovimentacao(mov);
        processoRepository.save(processo);

        return MovimentacaoResponse.from(mov);
    }

    @Transactional(readOnly = true)
    public Page<MovimentacaoResponse> listarMovimentacoes(UUID processoId, Pageable pageable) {
        return movimentacaoRepository.findByProcessoIdOrderByDataEventoDesc(processoId, pageable)
                .map(MovimentacaoResponse::from);
    }

    @Transactional(readOnly = true)
    public Map<String, Long> estatisticasPorStatus() {
        return processoRepository.countGroupByStatus().stream()
                .collect(Collectors.toMap(
                        arr -> ((StatusProcesso) arr[0]).name(),
                        arr -> (Long) arr[1]
                ));
    }
}
