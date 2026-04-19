package com.api.sistema_penal.service;

import com.api.sistema_penal.api.dto.legislacao.ArtigoUpdateRequest;
import com.api.sistema_penal.api.dto.legislacao.ArtigoUpdateResponse;
import com.api.sistema_penal.domain.entity.ArtigoUpdate;
import com.api.sistema_penal.domain.entity.Lei;
import com.api.sistema_penal.domain.repository.ArtigoUpdateRepository;
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

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Serviço de monitoramento de artigos automáticos
 * Executa busca diária de novos artigos e gerencia o fluxo de aprovação
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ArticleMonitoringService {

    private final ArtigoUpdateRepository artigoUpdateRepository;
    private final LeiRepository leiRepository;
    private final NotificacaoService notificacaoService;

    @Value("${app.monitoring.enabled:true}")
    private boolean monitoringEnabled;

    /**
     * Scheduler que executa diariamente às 6:30 AM
     * Busca novos artigos de fontes legislativas
     */
    @Scheduled(cron = "0 30 6 * * ?")
    @Transactional
    public void executarMonitoramentoDiario() {
        if (!monitoringEnabled) {
            log.info("Monitoramento de artigos desabilitado");
            return;
        }

        log.info("Iniciando monitoramento de artigos diário...");

        try {
            // Buscar novos artigos (simulado - em produção, conectar a APIs reais)
            List<ArtigoUpdateRequest> novosArtigos = buscarNovosArtigos();

            for (ArtigoUpdateRequest request : novosArtigos) {
                try {
                    adicionarArtigoPendente(request);
                } catch (Exception e) {
                    log.error("Erro ao adicionar artigo {}: {}", request.titulo(), e.getMessage());
                }
            }

            log.info("Monitoramento de artigos concluído.");

            // Notificar admin se houver novos artigos pendentes
            long pendentes = artigoUpdateRepository.countByStatus(ArtigoUpdate.StatusUpdate.PENDENTE);
            if (pendentes > 0) {
                notificacaoService.notificarNovosArtigosPendente((int) pendentes);
            }

        } catch (Exception e) {
            log.error("Erro durante monitoramento de artigos: {}", e.getMessage(), e);
            notificacaoService.notificarErroMonitoramento(e.getMessage());
        }
    }

    /**
     * Simulação de busca de novos artigos
     * Em produção, conectar a APIs reais do Diário da República ou outras fontes
     */
    private List<ArtigoUpdateRequest> buscarNovosArtigos() {
        // Simulação - retorna lista vazia
        // Em produção, implementar scraping de fontes oficiais
        log.info("Buscando novos artigos (simulação)...");
        return List.of();
    }

    /**
     * Adicionar artigo pendente manualmente
     */
    @Transactional
    public ArtigoUpdateResponse adicionarArtigoPendente(ArtigoUpdateRequest request) {
        // Verificar se já existe pendente com mesmo título
        if (artigoUpdateRepository.findPendingByTitulo(request.titulo()).size() > 0) {
            log.info("Artigo '{}' já está pendente", request.titulo());
            return null;
        }

        Lei lei = null;
        if (request.leiId() != null) {
            lei = leiRepository.findById(request.leiId()).orElse(null);
        }

        ArtigoUpdate update = ArtigoUpdate.builder()
                .titulo(request.titulo())
                .conteudo(request.conteudo())
                .numeroArtigo(request.numeroArtigo())
                .nomeSecao(request.nomeSecao())
                .ordemSecao(request.ordemSecao())
                .lei(lei)
                .leiIdentificacao(request.leiIdentificacao())
                .fonteUrl(request.fonteUrl())
                .fonteOrigem(request.fonteOrigem() != null ? request.fonteOrigem() : "DIARIO_REPUBLICA")
                .status(ArtigoUpdate.StatusUpdate.PENDENTE)
                .dataDescoberta(LocalDateTime.now())
                .metadata(new HashMap<>())
                .build();

        ArtigoUpdate salvo = artigoUpdateRepository.save(update);
        log.info("Artigo pendente adicionado: {}", request.titulo());

        return ArtigoUpdateResponse.from(salvo);
    }

    /**
     * Aprovar artigo pendente - marca como aprovado para o admin criar manualmente
     * O admin deve criar o artigo manualmente após aprovação
     */
    @Transactional
    public ArtigoUpdateResponse aprobarArtigo(UUID id, String aprovadoPor) {
        ArtigoUpdate update = artigoUpdateRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Artigo pendente não encontrado"));

        if (update.getStatus() != ArtigoUpdate.StatusUpdate.PENDENTE) {
            throw new BusinessException("Este artigo já foi processado");
        }

        // Atualizar status para aprovado - o admin deve criar o artigo manualmente
        update.setStatus(ArtigoUpdate.StatusUpdate.APROVADO);
        update.setDataAprovacao(LocalDateTime.now());
        update.setAprovadoPor(aprovadoPor);

        Map<String, Object> metadata = new HashMap<>();
        metadata.put("aprovado", true);
        update.setMetadata(metadata);

        log.info("Artigo '{}' aprovado. O admin deve criar o artigo manualmente.", update.getTitulo());

        return ArtigoUpdateResponse.from(artigoUpdateRepository.save(update));
    }

    /**
     * Rejeitar artigo pendente
     */
    @Transactional
    public ArtigoUpdateResponse rejeitarArtigo(UUID id, String motivoRejeicao) {
        ArtigoUpdate update = artigoUpdateRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Artigo pendente não encontrado"));

        if (update.getStatus() != ArtigoUpdate.StatusUpdate.PENDENTE) {
            throw new BusinessException("Este artigo já foi processado");
        }

        update.setStatus(ArtigoUpdate.StatusUpdate.REJEITADO);
        update.setMotivoRejeicao(motivoRejeicao);

        return ArtigoUpdateResponse.from(artigoUpdateRepository.save(update));
    }

    /**
     * Listar artigos pendentes
     */
    @Transactional(readOnly = true)
    public Page<ArtigoUpdateResponse> listarPendentes(Pageable pageable) {
        return artigoUpdateRepository.findByStatus(ArtigoUpdate.StatusUpdate.PENDENTE, pageable)
                .map(ArtigoUpdateResponse::from);
    }

    /**
     * Listar todas as atualizações (histórico)
     */
    @Transactional(readOnly = true)
    public Page<ArtigoUpdateResponse> listarTodas(Pageable pageable) {
        return artigoUpdateRepository.findAll(pageable)
                .map(ArtigoUpdateResponse::from);
    }

    /**
     * Contar artigos pendentes
     */
    @Transactional(readOnly = true)
    public long contarPendentes() {
        return artigoUpdateRepository.countByStatus(ArtigoUpdate.StatusUpdate.PENDENTE);
    }
}
