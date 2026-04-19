package com.api.sistema_penal.service;

import com.api.sistema_penal.api.dto.legislacao.LawUpdateRequest;
import com.api.sistema_penal.api.dto.legislacao.LawUpdateResponse;
import com.api.sistema_penal.api.dto.legislacao.LeiRequest;
import com.api.sistema_penal.api.dto.legislacao.LeiResponse;
import com.api.sistema_penal.domain.entity.LawUpdate;
import com.api.sistema_penal.domain.repository.LawUpdateRepository;
import com.api.sistema_penal.domain.repository.LeiRepository;
import com.api.sistema_penal.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

/**
 * Serviço de monitoramento legislativo automático
 * Executa busca diária de novas leis e gerencia o fluxo de aprovação
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LawMonitoringService {

    private final LawUpdateRepository lawUpdateRepository;
    private final LeiRepository leiRepository;
    private final LeiService leiService;
    private final NotificacaoService notificacaoService;

    @Value("${app.monitoring.enabled:true}")
    private boolean monitoringEnabled;

    /**
     * Scheduler que executa diariamente às 6:00 AM
     * Busca novas leis de fontes legislativas
     */
    @Scheduled(cron = "0 0 6 * * ?")
    @Transactional
    public void executarMonitoramentoDiario() {
        if (!monitoringEnabled) {
            log.info("Monitoramento legislativo desabilitado");
            return;
        }

        log.info("Iniciando monitoramento legislativo diário...");
        
        try {
            // Buscar novas leis (simulado - em produção, conectar a APIs reais)
            List<LawUpdateRequest> novasLeis = buscarNovasLeis();
            
            for (LawUpdateRequest request : novasLeis) {
                try {
                    adicionarLeiPendente(request);
                } catch (Exception e) {
                    log.error("Erro ao adicionar lei {} {}/{}: {}", 
                        request.tipo(), request.numero(), request.ano(), e.getMessage());
                }
            }
            
            log.info("Monitoramento concluído.");
            
            // Notificar admin se houver novas leis pendentes
            long pendentes = lawUpdateRepository.countByStatus(LawUpdate.StatusUpdate.PENDENTE);
            if (pendentes > 0) {
                notificacaoService.notificarNovasLeisPendente((int) pendentes);
            }
            
        } catch (Exception e) {
            log.error("Erro durante monitoramento legislativo: {}", e.getMessage(), e);
            notificacaoService.notificarErroMonitoramento(e.getMessage());
        }
    }

    /**
     * Buscar novas leis - simulado
     * Em produção, conectar a APIs do Diário da República de Angola
     */
    private List<LawUpdateRequest> buscarNovasLeis() {
        // Simulação de busca - em produção, fazer scraping ou chamar APIs reais
        log.info("Buscando novas leis de fontes legislativas...");
        
        // Exemplo: retornar lista vazia (simulado)
        // Em produção, conectar a:
        // - Diário da República Online (dre.pt)
        // - Portal do Governo de Angola
        // - outras fontes oficiais
        
        return List.of();
    }

    /**
     * Adicionar lei pendente (do monitoramento ou manual)
     */
    @Transactional
    public LawUpdateResponse adicionarLeiPendente(LawUpdateRequest request) {
        // Verificar se já existe pendente com mesma identificação
        if (lawUpdateRepository.existsByTipoAndNumeroAndAnoAndStatusNot(
                request.tipo(), request.numero(), request.ano(), LawUpdate.StatusUpdate.REJEITADO)) {
            log.info("Lei {} {}/{} já existe ou está pendente", 
                request.tipo(), request.numero(), request.ano());
            return null;
        }

        // Verificar se já existe lei aprovada
        if (leiRepository.existsByTipoAndNumeroAndAno(request.tipo(), request.numero(), request.ano())) {
            log.info("Lei {} {}/{} já está cadastrada", 
                request.tipo(), request.numero(), request.ano());
            return null;
        }

        LawUpdate update = LawUpdate.builder()
                .tipo(request.tipo().toUpperCase())
                .numero(request.numero())
                .ano(request.ano())
                .titulo(request.titulo())
                .ementa(request.ementa())
                .conteudo(request.conteudo())
                .dataPublicacao(request.dataPublicacao())
                .dataVigencia(request.dataVigencia())
                .fonteUrl(request.fonteUrl())
                .fonteOrigem(request.fonteOrigem() != null ? request.fonteOrigem() : "DIARIO_REPUBLICA")
                .status(LawUpdate.StatusUpdate.PENDENTE)
                .dataDescoberta(LocalDateTime.now())
                .build();

        LawUpdate salva = lawUpdateRepository.save(update);
        log.info("Lei pendente adicionada: {} {}/{}", request.tipo(), request.numero(), request.ano());
        
        return LawUpdateResponse.from(salva);
    }

    /**
     * Aprovar lei pendente - cria a lei no sistema
     */
    @Transactional
    public LawUpdateResponse aprovarLei(UUID id, String aprovadoPor) {
        LawUpdate update = lawUpdateRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Lei pendente não encontrada"));

        if (update.getStatus() != LawUpdate.StatusUpdate.PENDENTE) {
            throw new BusinessException("Esta lei já foi processada");
        }

        // Converter String para LocalDate
        LocalDate dataPub = parseDate(update.getDataPublicacao());
        LocalDate dataVig = parseDate(update.getDataVigencia());

        // Criar a lei
        LeiRequest leiRequest = new LeiRequest(
                update.getTipo(),
                update.getNumero(),
                update.getAno(),
                update.getTitulo(),
                update.getEmenta(),
                update.getConteudo(),
                dataPub,
                dataVig,
                update.getFonteUrl(),
                null,
                null
        );

        try {
            // Verificar se a lei já existe
            if (!leiRepository.existsByTipoAndNumeroAndAno(
                    update.getTipo(), update.getNumero(), update.getAno())) {
                leiService.criar(leiRequest);
            }
        } catch (Exception e) {
            log.error("Erro ao criar lei: {}", e.getMessage());
            throw new BusinessException("Erro ao criar lei: " + e.getMessage());
        }

        // Atualizar status
        update.setStatus(LawUpdate.StatusUpdate.APROVADO);
        update.setDataAprovacao(LocalDateTime.now());
        update.setAprovadoPor(aprovadoPor);
        
        lawUpdateRepository.save(update);
        
        log.info("Lei aprovada: {} {}/{}", update.getTipo(), update.getNumero(), update.getAno());
        
        // Notificar que lei foi aprovada
        notificacaoService.notificarLeiAprovada(update.getTitulo());
        
        return LawUpdateResponse.from(update);
    }

    /**
     * Rejeitar lei pendente
     */
    @Transactional
    public LawUpdateResponse rejeitarLei(UUID id, String motivoRejeicao) {
        LawUpdate update = lawUpdateRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Lei pendente não encontrada"));

        if (update.getStatus() != LawUpdate.StatusUpdate.PENDENTE) {
            throw new BusinessException("Esta lei já foi processada");
        }

        update.setStatus(LawUpdate.StatusUpdate.REJEITADO);
        update.setMotivoRejeicao(motivoRejeicao);
        
        lawUpdateRepository.save(update);
        
        log.info("Lei rejeitada: {} {}/{}", update.getTipo(), update.getNumero(), update.getAno());
        
        return LawUpdateResponse.from(update);
    }

    /**
     * Listar leis pendentes com paginação
     */
    @Transactional(readOnly = true)
    public Page<LawUpdateResponse> listarPendentes(Pageable pageable) {
        return lawUpdateRepository.findByStatus(LawUpdate.StatusUpdate.PENDENTE, pageable)
                .map(LawUpdateResponse::from);
    }

    /**
     * Listar todas as atualizações (histórico)
     */
    @Transactional(readOnly = true)
    public Page<LawUpdateResponse> listarTodas(Pageable pageable) {
        return lawUpdateRepository.findAll(pageable)
                .map(LawUpdateResponse::from);
    }

    /**
     * Contar leis pendentes
     */
    @Transactional(readOnly = true)
    public long contarPendentes() {
        return lawUpdateRepository.countByStatus(LawUpdate.StatusUpdate.PENDENTE);
    }

    /**
     * Forçar execução do monitoramento (manual)
     */
    @Transactional
    public String forcarMonitoramento() {
        if (!monitoringEnabled) {
            return "Monitoramento está desabilitado";
        }
        
        executarMonitoramentoDiario();
        return "Monitoramento executado com sucesso";
    }

    /**
     * Converter String para LocalDate
     */
    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.isEmpty()) {
            return null;
        }
        try {
            return LocalDate.parse(dateStr, DateTimeFormatter.ISO_DATE);
        } catch (Exception e) {
            try {
                return LocalDate.parse(dateStr);
            } catch (Exception e2) {
                return null;
            }
        }
    }
}
