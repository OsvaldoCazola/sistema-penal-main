package com.api.sistema_penal.service;

import com.api.sistema_penal.domain.entity.AnalysisHashRecord;
import com.api.sistema_penal.domain.repository.AnalysisHashRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class BlockchainService {

    private final AnalysisHashRecordRepository analysisHashRecordRepository;

    /**
     * Gera hash SHA-256 do conteúdo fornecido
     * 
     * @param conteudo Texto da análise jurídica
     * @return Hash SHA-256 em formato hexadecimal
     * @throws IllegalStateException se o algoritmo SHA-256 não estiver disponível
     */
    public String gerarHash(String conteudo) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(conteudo.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(hashBytes);
        } catch (NoSuchAlgorithmException e) {
            // SHA-256 é garantido estar disponível em todas as implementações Java SE
            log.error("Algoritmo SHA-256 não disponível", e);
            throw new IllegalStateException("Erro crítico: algoritmo de hash não disponível", e);
        }
    }

    /**
     * Registra o hash da análise no banco de dados
     * 
     * @param analysisId ID da análise
     * @param conteudo Conteúdo da análise jurídica
     * @param contentType Tipo do conteúdo (ex: "analise_juridica", "sentenca")
     * @return Registro criado
     */
    @Transactional
    public AnalysisHashRecord registrarHash(UUID analysisId, String conteudo, String contentType) {
        // Valida parâmetros obrigatórios
        if (analysisId == null) {
            throw new IllegalArgumentException("Analysis ID não pode ser nulo");
        }
        if (conteudo == null || conteudo.isEmpty()) {
            throw new IllegalArgumentException("Conteúdo não pode ser vazio");
        }
        
        // Gera o hash primeiro
        String hash = gerarHash(conteudo);
        
        // Trunca o conteúdo com verificação de tamanho
        String contentSummary = null;
        if (conteudo != null && !conteudo.isEmpty()) {
            contentSummary = conteudo.length() > 200 
                ? conteudo.substring(0, 200) + "..." 
                : conteudo;
        }
        
        AnalysisHashRecord record = AnalysisHashRecord.builder()
                .analysisId(analysisId)
                .hash(hash)
                .contentType(contentType)
                .contentSummary(contentSummary)
                .build();
        
        try {
            return analysisHashRecordRepository.save(record);
        } catch (DataIntegrityViolationException e) {
            // Verifica se é violação de unicidade do analysisId
            log.warn("Já existe um hash registrado para o analysisId: {}", analysisId);
            throw new IllegalStateException("Já existe um hash registrado para este analysisId: " + analysisId);
        }
    }

    /**
     * Verifica a integridade da análise comparando o hash atual com o registrado
     * 
     * @param analysisId ID da análise
     * @param conteudoAtual Conteúdo atual da análise
     * @return Resultado da verificação com status
     */
    public VerificacaoIntegridadeResult verificarIntegridade(UUID analysisId, String conteudoAtual) {
        AnalysisHashRecord registro = analysisHashRecordRepository.findByAnalysisId(analysisId)
                .orElse(null);

        if (registro == null) {
            return VerificacaoIntegridadeResult.builder()
                    .integridade(false)
                    .mensagem("Registro não encontrado para o ID fornecido")
                    .build();
        }

        // Valida se conteúdo atual não é nulo ou vazio
        if (conteudoAtual == null || conteudoAtual.isEmpty()) {
            return VerificacaoIntegridadeResult.builder()
                    .integridade(false)
                    .hashRegistrado(registro.getHash())
                    .hashAtual(null)
                    .mensagem("Conteúdo atual não fornecido para verificação")
                    .build();
        }

        String hashAtual = gerarHash(conteudoAtual);
        boolean integra = hashAtual.equals(registro.getHash());

        return VerificacaoIntegridadeResult.builder()
                .integridade(integra)
                .hashRegistrado(registro.getHash())
                .hashAtual(hashAtual)
                .mensagem(integra ? "Análise íntegre - não foi alterada" : "Alerta: análise foi alterada!")
                .build();
    }

    /**
     * Obtém o registro de hash para uma análise
     */
    public AnalysisHashRecord getRecordByAnalysisId(UUID analysisId) {
        return analysisHashRecordRepository.findByAnalysisId(analysisId).orElse(null);
    }

    /**
     * Converte bytes para string hexadecimal
     */
    private String bytesToHex(byte[] bytes) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : bytes) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }

    /**
     * Classe para resultado da verificação de integridade
     */
    @lombok.Data
    @lombok.Builder
    @lombok.AllArgsConstructor
    @lombok.NoArgsConstructor
    public static class VerificacaoIntegridadeResult {
        private boolean integridade;
        private String hashRegistrado;
        private String hashAtual;
        private String mensagem;
    }
}
