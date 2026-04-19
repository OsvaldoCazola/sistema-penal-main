package com.api.sistema_penal.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Serviço de notificações
 * Em produção, implementaria envio de emails, push notifications, etc.
 */
@Slf4j
@Service
public class NotificacaoService {

    /**
     * Criar notificação para um usuário
     */
    public void criarNotificacao(UUID usuarioId, String titulo, String mensagem, String tipo) {
        log.info("📢 NOTIFICAÇÃO para usuário {} - {}: {}", usuarioId, titulo, mensagem);
    }

    /**
     * Notificar admin sobre novas leis pendentes
     */
    public void notificarNovasLeisPendente(int quantidade) {
        log.info("📢 NOTIFICAÇÃO: {} nova(s) lei(s) pendente(s) de aprovação!", quantidade);
        // Em produção: enviar email, push notification, etc.
    }

    /**
     * Notificar quando lei for aprovada
     */
    public void notificarLeiAprovada(String titulo) {
        log.info("📢 NOTIFICAÇÃO: Lei '{}' foi aprovada e adicionada ao sistema!", titulo);
    }

    /**
     * Notificar quando lei for rejeitada
     */
    public void notificarLeiRejeitada(String titulo, String motivo) {
        log.info("📢 NOTIFICAÇÃO: Lei '{}' foi rejeitada. Motivo: {}", titulo, motivo);
    }

    /**
     * Notificar erro no monitoramento
     */
    public void notificarErroMonitoramento(String erro) {
        log.error("📢 NOTIFICAÇÃO DE ERRO: Problema no monitoramento legislativo - {}", erro);
    }

    /**
     * Notificar admin sobre novos artigos pendentes
     */
    public void notificarNovosArtigosPendente(int quantidade) {
        log.info("📢 NOTIFICAÇÃO: {} novo(s) artigo(s) pendente(s) de aprovação!", quantidade);
        // Em produção: enviar email, push notification, etc.
    }

    /**
     * Notificar quando artigo for aprovado
     */
    public void notificarArtigoAprovado(String titulo) {
        log.info("📢 NOTIFICAÇÃO: Artigo '{}' foi aprovado e adicionado ao sistema!", titulo);
    }

    /**
     * Notificar quando artigo for rejeitado
     */
    public void notificarArtigoRejeitado(String titulo, String motivo) {
        log.info("📢 NOTIFICAÇÃO: Artigo '{}' foi rejeitado. Motivo: {}", titulo, motivo);
    }
}
