package com.api.sistema_penal.service;

import com.api.sistema_penal.api.dto.educacional.SimuladorRequest;
import com.api.sistema_penal.domain.entity.CasoGeradoChat;
import com.api.sistema_penal.domain.entity.Usuario;
import com.api.sistema_penal.domain.repository.CasoGeradoChatRepository;
import com.api.sistema_penal.domain.repository.CategoriaCrimeRepository;
import com.api.sistema_penal.domain.entity.CategoriaCrime;
import com.api.sistema_penal.domain.repository.ResultadoSimulacaoRepository;
import com.api.sistema_penal.domain.entity.ResultadoSimulacao;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.Date;
import java.util.Locale;
import java.util.Objects;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResultadoSimulacaoService {

    private final ResultadoSimulacaoRepository resultadoSimulacaoRepository;
    private final CasoGeradoChatRepository casoGeradoChatRepository;
    private final CategoriaCrimeRepository categoriaCrimeRepository;

    /**
     * Inicia uma nova simulação, gerando um ID único para a rodada.
     * @param usuarioId ID do usuário
     * @param request Dados da simulação (tipo de crime, origem, caso opcional)
     * @return UUID da simulação
     */
    @Transactional
    public UUID iniciarSimulacao(UUID usuarioId, SimuladorRequest request) {
        // O ID da simulação é gerado aqui para garantir consistência
        // (alternativamente poderia ser gerado pelo frontend e validado aqui)
        return UUID.randomUUID();
    }

    /**
     * Processa uma resposta dada pelo usuário em uma simulação.
     * @param usuarioId ID do usuário
     * @param simulacaoId ID da simulação (rodada)
     * @param casoId ID do caso (se for do chat) ou null para aleatório
     * @param respostaResposta Dado pelo usuário (a alternativa escolhida)
     * @return Resultado do processamento
     */
    @Transactional
    public Map<String, Object> processarResposta(UUID usuarioId, UUID simulacaoId, UUID casoId, String respostaResposta) {
        // Busca o caso (se fornecido) ou seleciona um caso aleatório
        CasoGeradoChat caso = null;
        String tipoCrime = "Desconhecido";
        String origem = "ALEATORIO";

        if (casoId != null) {
            caso = casoGeradoChatRepository.findById(casoId)
                    .orElseThrow(() -> new RuntimeException("Caso não encontrado"));
            origem = "CHAT";
            // Tenta extrair tipo de crime do caso (simplificado)
            tipoCrime = extrairTipoCrimeDoCaso(caso);
        } else {
            // TODO: Implementar seleção aleatória de caso_simulado existente
            // Por enquanto, usar um caso fixo ou lanzar erro se não houver casos do chat
            List<CasoGeradoChat> casos = casoGeradoChatRepository.findAtivosByUsuarioIdOrderByCriadoEmDesc(usuarioId);
            if (!casos.isEmpty()) {
                caso = casos.get(0);
                origem = "CHAT"; // Se não houver caso específico, mas houver casos do chat, considerar como chat
                tipoCrime = extrairTipoCrimeDoCaso(caso);
            } else {
                throw new RuntimeException("Nenhum caso disponível para simulação");
            }
        }

        // Gera alternativas (1 correta + 3 incorretas)
        List<String> alternativas = gerarAlternativasParaQuiz(caso.getRespostaCorreta());
        String correta = caso.getRespostaCorreta();

        // Verifica se a resposta está correta (simplificado: comparação exata ignorando case e espaços extras)
        boolean acertou = normalizarResposta(respostaResposta).equals(normalizarResposta(correta));
        int alternativasCorretas = 1; // considerando apenas uma alternativa correta por questão
        int acertos = acertou ? 1 : 0;
        double pontuacao = acertou ? 100.0 : 0.0; // pontuação percentual para esta questão

        // Salva o resultado
        ResultadoSimulacao resultado = ResultadoSimulacao.builder()
                .usuarioId(usuarioId)
                .simulacaoId(simulacaoId)
                .casoId(caso != null ? caso.getId() : null)
                .respostasDadas(respostaResposta)
                .alternativasCorretas(alternativasCorretas)
                .acertos(acertos)
                .pontuacao(pontuacao)
                .tipoCrime(tipoCrime)
                .origem(origem)
                .build();

        ResultadoSimulacao salvo = resultadoSimulacaoRepository.save(resultado);

        // Prepara retorno para o frontend
        Map<String, Object> response = new HashMap<>();
        response.put("sucesso", true);
        response.put("acertou", acertou);
        response.put("respostaCorreta", correta);
        response.put("alternativas", alternativas);
        response.put("pontuacaoObtida", pontuacao);
        response.put("feedback", acertou ? "Correto!" : "Incorreto. A resposta correta era: " + correta);
        response.put("resultadoId", salvo.getId());
        return response;
    }

    /**
     * Obtém o resultado consolidado de uma simulação (todas as respostas da mesma rodada).
     * @param usuarioId ID do usuário
     * @param simulacaoId ID da simulação
     * @return Estatísticas da simulação
     */
    @Transactional(readOnly = true)
    public Map<String, Object> obterResultadoSimulacao(UUID usuarioId, UUID simulacaoId) {
        List<ResultadoSimulacao> resultados = resultadoSimulacaoRepository.findByUsuarioIdAndSimulacaoId(usuarioId, simulacaoId);
        
        if (resultados.isEmpty()) {
            return Map.of("sucesso", false, "mensagem", "Nenhum resultado encontrado para esta simulação");
        }

        int totalQuestoes = resultados.size();
        int totalAcertos = (int) resultados.stream().filter(r -> r.getAcertos() == 1).count();
        double pontuacaoMedia = totalQuestoes > 0 ? (totalAcertos * 100.0) / totalQuestoes : 0.0;
        
        // Agrupa por tipo de crime
        Map<String, Long> porTipoCrime = resultados.stream()
                .collect(Collectors.groupingBy(ResultadoSimulacao::getTipoCrime, Collectors.counting()));
        
        Map<String, Double> acertosPorTipoCrime = resultados.stream()
                .collect(Collectors.groupingBy(
                        ResultadoSimulacao::getTipoCrime,
                        Collectors.averagingDouble(r -> r.getAcertos() == 1 ? 1.0 : 0.0)
                ));

        List<Map<String, Object>> detalhes = resultados.stream().map(r -> {
            Map<String, Object> detalhe = new HashMap<>();
            detalhe.put("id", r.getId());
            detalhe.put("respostaDada", r.getRespostasDadas());
            detalhe.put("acertou", r.getAcertos() == 1);
            detalhe.put("tipoCrime", r.getTipoCrime());
            detalhe.put("origem", r.getOrigem());
            return detalhe;
        }).collect(Collectors.toList());

        return Map.of(
                "sucesso", true,
                "simulacaoId", simulacaoId,
                "totalQuestoes", totalQuestoes,
                "totalAcertos", totalAcertos,
                "pontuacaoMedia", pontuacaoMedia,
                "porTipoCrime", porTipoCrime,
                "acertosPorTipoCrime", acertosPorTipoCrime,
                "detalhes", detalhes
        );
    }

    /**
     * Obtém o histórico de simulações do usuário.
     * @param usuarioId ID do usuário
     * @return Lista de simulações com estatísticas básicas
     */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> obterHistoricoUsuario(UUID usuarioId) {
        // Busca todas as simulações distintas do usuário
        List<UUID> simulacaoIds = resultadoSimulacaoRepository.findDistinctSimulacaoIdsByUsuarioId(usuarioId);
        
        return simulacaoIds.stream().map(simulacaoId -> {
            List<ResultadoSimulacao> resultados = resultadoSimulacaoRepository.findByUsuarioIdAndSimulacaoId(usuarioId, simulacaoId);
            if (resultados.isEmpty()) return null;
            
            int totalQuestoes = resultados.size();
            int totalAcertos = (int) resultados.stream().filter(r -> r.getAcertos() == 1).count();
            double pontuacao = totalQuestoes > 0 ? (totalAcertos * 100.0) / totalQuestoes : 0.0;
            String primeiroTipoCrime = resultados.get(0).getTipoCrime();
            String origem = resultados.get(0).getOrigem();
            LocalDateTime ultimaTentativa = resultados.stream()
                    .max(Comparator.comparing(ResultadoSimulacao::getConcluidoEm))
                    .map(ResultadoSimulacao::getConcluidoEm)
                    .orElse(null);
            
            Map<String, Object> historico = new HashMap<>();
            historico.put("simulacaoId", simulacaoId);
            historico.put("totalQuestoes", totalQuestoes);
            historico.put("totalAcertos", totalAcertos);
            historico.put("pontuacao", pontuacao);
            historico.put("tipoCrime", primeiroTipoCrime);
            historico.put("origem", origem);
            historico.put("ultimaTentativa", ultimaTentativa);
            return historico;
        }).filter(Objects::nonNull)
          .sorted((a, b) -> {
              LocalDateTime dateA = (LocalDateTime) a.get("ultimaTentativa");
              LocalDateTime dateB = (LocalDateTime) b.get("ultimaTentativa");
              return dateB.compareTo(dateA); // mais recente primeiro
          })
          .collect(Collectors.toList());
    }

    // -------------------- Métodos auxiliares privados --------------------

    private String normalizarResposta(String resposta) {
        if (resposta == null) return "";
        return resposta.trim().toLowerCase(Locale.ROOT);
    }

    private String extrairTipoCrimeDoCaso(CasoGeradoChat caso) {
        // Tenta extrair do tema ou descrição
        String texto = (caso.getTema() != null ? caso.getTema() : "") + " " + 
                       (caso.getDescricao() != null ? caso.getDescricao() : "");
        texto = texto.toLowerCase(Locale.ROOT);
        
        // Lista simples de tipos de crime para classificação
        if (texto.contains("homicídio") || texto.contains("matança") || texto.contains("assassinato")) {
            return "Homicídio";
        } else if (texto.contains("lesão") || texto.contains("corporal")) {
            return "Lesão Corporal";
        } else if (texto.contains("estupro") || texto.contains("violência sexual") || texto.contains("importunação")) {
            return "Crime Sexual";
        } else if (texto.contains("roubo") || texto.contains("furto") || texto.contains("qualificação")) {
            return "Roubo/Furto";
        } else if (texto.contains("tráfico") || texto.contains("drogas") || texto.contains("entorpecentes")) {
            return "Tráfico de Drogas";
        } else if (texto.contains("corrupção") || texto.contains("propina") || texto.contains("lavagem")) {
            return "Crimes Contra a Administração Pública";
        } else {
            return "Outros";
        }
    }

    /**
     * Gera uma lista de alternativas para um quiz: 1 correta + 3 incorretas.
     * @param correta A resposta correta
     * @return Lista de 4 alternativas (embaralhadas)
     */
    private List<String> gerarAlternativasParaQuiz(String correta) {
        List<String> alternativas = new ArrayList<>();
        alternativas.add(correta); // a correta
        
        // Gera 3 alternativas incorretas simples (em um sistema real, seriam mais elaboradas)
        alternativas.add(generarAlternativaIncorreta(correta, 1));
        alternativas.add(generarAlternativaIncorreta(correta, 2));
        alternativas.add(generarAlternativaIncorreta(correta, 3));
        
        // Embaralha
        Collections.shuffle(alternativas);
        return alternativas;
    }

    private String generarAlternativaIncorreta(String correta, int seed) {
        // Muito simplificado: apenas embaralha palavras ou adiciona negações
        String[] palavras = correta.split("\\s+");
        if (palavras.length > 1) {
            // Embaralha as palavras
            List<String> lista = Arrays.asList(palavras);
            Collections.shuffle(lista, new Random(seed));
            return String.join(" ", lista);
        } else {
            // Se for uma palavra só, adiciona prefixo/sufixo
            switch (seed % 3) {
                case 0: return "Não " + correta;
                case 1: return correta + " attenuada";
                case 2: return "Tentativa de " + correta;
                default: return correta;
            }
        }
    }
}