package com.api.sistema_penal.service.email;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void enviarEmail(String para, String assunto, String corpo) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(para);
            message.setSubject(assunto);
            message.setText(corpo);
            message.setFrom("noreply@sistemapenal.ao");

            mailSender.send(message);
            log.info("Email enviado com sucesso para: {}", para);
        } catch (Exception e) {
            log.error("Falha ao enviar email para {}: {}", para, e.getMessage());
        }
    }

    public void enviarEmailParaLista(List<String> destinatarios, String assunto, String corpo) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(destinatarios.toArray(new String[0]));
            message.setSubject(assunto);
            message.setText(corpo);
            message.setFrom("noreply@sistemapenal.ao");

            mailSender.send(message);
            log.info("Email enviado para {} destinatários", destinatarios.size());
        } catch (Exception e) {
            log.error("Falha ao enviar email em lote: {}", e.getMessage());
        }
    }

    public void notificarPrazoVencido(String email, String nomePrazo, String numeroProcesso, String dataVencimento) {
        String assunto = "URGENTE: Prazo Vencido - Sistema Penal";
        String corpo = String.format(
            "Prezado(a),\n\n" +
            "Informamos que o prazo \"%s\" do processo %s venceu em %s.\n\n" +
            "Por favor, tome as providências necessárias.\n\n" +
            "Atenciosamente,\n" +
            "Sistema de Gestão Penal de Angola",
            nomePrazo, numeroProcesso, dataVencimento
        );
        enviarEmail(email, assunto, corpo);
    }

    public void notificarPrazoProximo(String email, String nomePrazo, String numeroProcesso, int diasRestantes) {
        String assunto = "Aviso: Prazo Próximo do Vencimento - Sistema Penal";
        String corpo = String.format(
            "Prezado(a),\n\n" +
            "Informamos que o prazo \"%s\" do processo %s vencerá em %d dia(s).\n\n" +
            "Por favor, providencie as medidas necessárias.\n\n" +
            "Atenciosamente,\n" +
            "Sistema de Gestão Penal de Angola",
            nomePrazo, numeroProcesso, diasRestantes
        );
        enviarEmail(email, assunto, corpo);
    }

    public void notificarNovoProcesso(String email, String nomeUsuario, String numeroProcesso) {
        String assunto = "Novo Processo Atribuído - Sistema Penal";
        String corpo = String.format(
            "Prezado(a) %s,\n\n" +
            "Um novo processo (%s) foi-lhe atribuído no Sistema de Gestão Penal de Angola.\n\n" +
            "Aceda ao sistema para mais detalhes.\n\n" +
            "Atenciosamente,\n" +
            "Sistema de Gestão Penal de Angola",
            nomeUsuario, numeroProcesso
        );
        enviarEmail(email, assunto, corpo);
    }

    public void notificarNovaSentenca(String email, String nomeUsuario, String numeroProcesso) {
        String assunto = "Nova Sentença Registrada - Sistema Penal";
        String corpo = String.format(
            "Prezado(a) %s,\n\n" +
            "Uma nova sentença foi registada no processo %s.\n\n" +
            "Aceda ao sistema para consulta.\n\n" +
            "Atenciosamente,\n" +
            "Sistema de Gestão Penal de Angola",
            nomeUsuario, numeroProcesso
        );
        enviarEmail(email, assunto, corpo);
    }

    public void notificarAlteracaoLei(String email, String nomeUsuario, String tituloLei) {
        String assunto = "Alteração Legislative - Sistema Penal";
        String corpo = String.format(
            "Prezado(a) %s,\n\n" +
            "Informamos que houve uma alteração na legislação: \"%s\".\n\n" +
            "Consulte o sistema para mais detalhes.\n\n" +
            "Atenciosamente,\n" +
            "Sistema de Gestão Penal de Angola",
            nomeUsuario, tituloLei
        );
        enviarEmail(email, assunto, corpo);
    }
}
