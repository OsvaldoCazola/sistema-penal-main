package com.api.sistema_penal.service;

import com.api.sistema_penal.api.dto.educacional.RespostaPerguntaResponse;
import com.api.sistema_penal.api.dto.educacional.ResponderPerguntaRequest;
import com.api.sistema_penal.domain.entity.*;
import com.api.sistema_penal.domain.entity.ProgressoEstudante.Status;
import com.api.sistema_penal.domain.repository.PerguntaCasoRepository;
import com.api.sistema_penal.domain.repository.ProgressoEstudanteRepository;
import com.api.sistema_penal.domain.repository.RespostaEstudanteRepository;
import com.api.sistema_penal.exception.BusinessException;
import com.api.sistema_penal.service.OpenAIService;
import com.api.sistema_penal.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.text.Normalizer;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SimuladorEducativoService {

    private static final double LIMIAR_APROVACAO = 0.6;

    private final PerguntaCasoRepository perguntaCasoRepository;
    private final RespostaEstudanteRepository respostaEstudanteRepository;
    private final ProgressoEstudanteRepository progressoEstudanteRepository;
    private final OpenAIService openAIService;

    @Transactional
    public RespostaPerguntaResponse responderPergunta(Usuario usuario,
                                                      Long casoId,
                                                      UUID perguntaId,
                                                      ResponderPerguntaRequest request) {
        PerguntaCaso pergunta = perguntaCasoRepository.findById(perguntaId)
                .orElseThrow(() -> new ResourceNotFoundException("Pergunta não encontrada"));

        CasoSimulado caso = pergunta.getCaso();
        if (!Objects.equals(caso.getId(), casoId)) {
            throw new BusinessException("A pergunta não pertence ao caso informado");
        }

        if (!Boolean.TRUE.equals(caso.getAtivo())) {
            throw new BusinessException("Este caso não está disponível para estudo");
        }

        String respostaNormalizada = request.resposta().trim();
        if (!StringUtils.hasText(respostaNormalizada)) {
            throw new BusinessException("A resposta não pode ser vazia");
        }

        Avaliacao avaliacao = avaliarResposta(pergunta, respostaNormalizada);
        String feedbackFinal = enriquecerFeedbackComIA(pergunta, request.resposta(), avaliacao.feedback());

        RespostaEstudante respostaEntity = respostaEstudanteRepository
                .findByUsuarioIdAndPerguntaId(usuario.getId(), perguntaId)
                .orElseGet(() -> RespostaEstudante.builder()
                        .usuario(usuario)
                        .caso(caso)
                        .pergunta(pergunta)
                        .build());

        respostaEntity.setRespostaDada(respostaNormalizada);
        respostaEntity.setFeedbackProfessor(feedbackFinal);
        respostaEntity.setCorreta(avaliacao.correta());
        respostaEntity.setPontosObtidos(avaliacao.pontosObtidos());
        respostaEntity.setRespondidoEm(java.time.LocalDateTime.now());
        respostaEstudanteRepository.save(respostaEntity);

        atualizarProgresso(usuario, caso);

        return new RespostaPerguntaResponse(
                pergunta.getId(),
                respostaNormalizada,
                avaliacao.correta(),
                avaliacao.pontosObtidos(),
                pergunta.getPontuacaoMaxima(),
                feedbackFinal,
                pergunta.getRespostaEsperada()
        );
    }

    private void atualizarProgresso(Usuario usuario, CasoSimulado caso) {
        List<PerguntaCaso> perguntas = perguntaCasoRepository.findByCasoIdOrderByOrdemAsc(caso.getId());
        List<RespostaEstudante> respostas = respostaEstudanteRepository
                .findByUsuarioIdAndCasoId(usuario.getId(), caso.getId());

        int totalPerguntas = perguntas.size();
        int respondidas = respostas.size();
        int corretas = (int) respostas.stream()
                .filter(r -> Boolean.TRUE.equals(r.getCorreta()))
                .count();
        int pontosObtidos = respostas.stream()
                .map(RespostaEstudante::getPontosObtidos)
                .filter(Objects::nonNull)
                .mapToInt(Integer::intValue)
                .sum();
        int pontosMaximos = perguntas.stream()
                .map(PerguntaCaso::getPontuacaoMaxima)
                .filter(Objects::nonNull)
                .mapToInt(Integer::intValue)
                .sum();

        double percentual = totalPerguntas == 0 ? 0.0 : (respondidas * 100.0) / totalPerguntas;

        ProgressoEstudante progresso = progressoEstudanteRepository
                .findByUsuarioIdAndCasoId(usuario.getId(), caso.getId())
                .orElseGet(() -> ProgressoEstudante.builder()
                        .usuario(usuario)
                        .caso(caso)
                        .totalPerguntas(totalPerguntas)
                        .perguntasRespondidas(0)
                        .perguntasCorretas(0)
                        .pontuacaoObtida(0)
                        .pontuacaoMaxima(pontosMaximos)
                        .percentualConclusao(0.0)
                        .status(Status.NAO_INICIADO)
                        .build());

        progresso.setTotalPerguntas(totalPerguntas);
        progresso.setPerguntasRespondidas(respondidas);
        progresso.setPerguntasCorretas(corretas);
        progresso.setPontuacaoObtida(pontosObtidos);
        progresso.setPontuacaoMaxima(pontosMaximos);
        progresso.setPercentualConclusao(percentual);

        if (respondidas == 0) {
            progresso.setStatus(Status.NAO_INICIADO);
        } else if (respondidas < totalPerguntas) {
            progresso.setStatus(Status.EM_ANDAMENTO);
        } else {
            progresso.setStatus(Status.CONCLUIDO);
            if (progresso.getConcluidoEm() == null) {
                progresso.setConcluidoEm(java.time.LocalDateTime.now());
            }
        }

        progressoEstudanteRepository.save(progresso);
    }

    private Avaliacao avaliarResposta(PerguntaCaso pergunta, String respostaAluno) {
        String esperado = normalizar(pergunta.getRespostaEsperada());
        String resposta = normalizar(respostaAluno);

        if (!StringUtils.hasText(resposta)) {
            return new Avaliacao(false, 0, "A resposta não pode estar vazia. Revise o caso e tente novamente.");
        }

        Set<String> tokensEsperados = extrairTokensRelevantes(esperado);
        Set<String> tokensResposta = extrairTokensRelevantes(resposta);

        int correspondencias = (int) tokensEsperados.stream()
                .filter(tokensResposta::contains)
                .count();

        double ratio = tokensEsperados.isEmpty() ? 0.0 : correspondencias / (double) tokensEsperados.size();
        boolean correta = ratio >= LIMIAR_APROVACAO;

        int pontuacaoMaxima = Optional.ofNullable(pergunta.getPontuacaoMaxima()).orElse(1);
        int pontos = correta ? pontuacaoMaxima : Math.max(0, (int) Math.round(pontuacaoMaxima * ratio));

        String feedback;
        if (correta) {
            feedback = "Excelente! A sua resposta apresentou os elementos essenciais esperados para esta questão.";
        } else if (ratio >= 0.4) {
            String faltantes = tokensEsperados.stream()
                    .filter(token -> !tokensResposta.contains(token))
                    .limit(3)
                    .collect(Collectors.joining(", "));
            feedback = "Boa tentativa! Para atingir a resposta completa, lembre-se de abordar: " + faltantes + ".";
        } else {
            feedback = "Sugestão: revise os conceitos principais do caso e utilize o gabarito como referência para estruturar a resposta.";
        }

        return new Avaliacao(correta, Math.min(pontos, pontuacaoMaxima), feedback);
    }

    private static String normalizar(String texto) {
        if (texto == null) {
            return "";
        }
        String semAcento = Normalizer.normalize(texto, Normalizer.Form.NFD)
                .replaceAll("[^\\p{ASCII}]", "");
        return semAcento.toLowerCase(Locale.ROOT);
    }

    private static Set<String> extrairTokensRelevantes(String textoNormalizado) {
        return Arrays.stream(textoNormalizado.split("\\W+"))
                .map(String::trim)
                .filter(token -> token.length() > 3)
                .filter(token -> !STOP_WORDS.contains(token))
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private String enriquecerFeedbackComIA(PerguntaCaso pergunta, String respostaOriginal, String feedbackBase) {
        if (!openAIService.isConfigured() || !StringUtils.hasText(respostaOriginal)) {
            return feedbackBase;
        }
        try {
            String mensagemUtilizador = "Pergunta:\n" + pergunta.getEnunciado() +
                    "\n\nResposta esperada do professor:\n" + pergunta.getRespostaEsperada() +
                    "\n\nResposta do estudante:\n" + respostaOriginal.trim();

            String sugestao = openAIService.chat(PROFESSOR_SYSTEM_PROMPT, mensagemUtilizador, null);
            if (StringUtils.hasText(sugestao)) {
                return feedbackBase + "\n\nSugestão adicional do professor IA: " + sugestao.trim();
            }
        } catch (Exception e) {
            log.warn("Falha ao obter feedback de IA para a pergunta {}: {}", pergunta.getId(), e.getMessage());
        }
        return feedbackBase;
    }

    private record Avaliacao(boolean correta, int pontosObtidos, String feedback) {
    }

    private static final String PROFESSOR_SYSTEM_PROMPT = """
            Você é um professor de Direito Penal em Angola. Avalie a resposta do estudante com base no gabarito indicado.
            Forneça um feedback claro, em português de Angola, destacando:
            1. Pontos positivos ou corretos que o estudante apresentou
            2. Elementos que faltaram ou que precisam de reforço
            3. Orientações objetivas para aprofundamento
            Limite-se a um máximo de quatro frases curtas. Seja cordial e pedagógico.
            """;

    private static final Set<String> STOP_WORDS = Set.of(
            "de", "da", "do", "das", "dos",
            "para", "como", "mais", "pelo", "pela",
            "isso", "dessa", "deste", "desse", "destes",
            "com", "uma", "esse", "essa", "este", "esta",
            "sobre", "entre", "pois", "sendo", "assim",
            "caso", "crime", "tipo", "pode", "deve", "tambem",
            "ainda", "porque", "quando", "onde", "qual", "quais"
    );
}
