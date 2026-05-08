package com.api.sistema_penal.service;

import com.api.sistema_penal.api.dto.busca.BuscaSemanticaRequest;
import com.api.sistema_penal.api.dto.busca.BuscaSemanticaResponse;
import com.api.sistema_penal.domain.entity.CasoGeradoChat;
import com.api.sistema_penal.domain.entity.Usuario;
import com.api.sistema_penal.domain.entity.Artigo;
import com.api.sistema_penal.domain.repository.CasoGeradoChatRepository;
import com.api.sistema_penal.domain.repository.CategoriaCrimeRepository;
import com.api.sistema_penal.domain.entity.CategoriaCrime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final OpenAIService openAIService;
    private final BuscaSemanticaService buscaSemanticaService;
    private final CasoGeradoChatRepository casoGeradoChatRepository;
    private final CategoriaCrimeRepository categoriaCrimeRepository;

    // Prompt que garante resposta baseada apenas na BD
    private static final String SYSTEM_PROMPT_BD_ONLY = """
        Você é um assistente jurídico especializado em direito penal angolano.
        
        REGRAS RIGOROSAS:
        1. RESPONDA APENAS COM INFORMAÇÕES DA BASE DE DADOS FORNECIDA NO CONTEXTO
        2. NÃO USE CONHECIMENTO EXTERNO OU DA INTERNET
        3. SE O CONTEXTO NÃO TIVER A RESPOSTA, DIGA: "Não encontrei informações suficientes na base de dados para responder com precisão. Sugiro consultar os artigos do Código Penal de Angola ou um advogado especializado."
        4. SEJA OBJETIVO E DIRETO AO PONTO
        5. SEMPRE CITE OS ARTIGOS ESPECÍFICOS DO CPA QUE FORETAMENTO SUA RESPOSTA
        6. NÃO FAÇA ESPECULAÇÕES OU INTERPRETAÇÕES ALÉM DO QUE ESTÁ ESCRITO NOS ARTIGOS
        7. SE O USUÁRIO DESCREVER UM CASO CONCRETO, DETECTE AUTOMATICAMENTE E SUGERE SALVAR COMO CASO DE ESTUDO
        
        FORMATO DE RESPOSTA QUANDO HOUVER CONTEXTO SUFICIENTE:
        - Resposta direta baseada nos artigos fornecidos
        - Citação dos artigos específicos (ex: "De acordo com o artigo 123 do CPA...")
        - Se aplicável, pergunta se deseja salvar o caso descrito para estudo posterior
        """;

    @Transactional
    public Map<String, Object> processarMensagem(String mensagem, Usuario usuario, Boolean buscarContexto) {
        try {
            String contexto = null;
            boolean contextoEncontrado = false;
            
            if (buscarContexto != null && buscarContexto) {
                var resultados = buscaSemanticaService.buscarPorSimilaridade(
                        new BuscaSemanticaRequest(mensagem, null, 5, 0.2)
                );
                
                if (resultados != null && resultados.resultados() != null && !resultados.resultados().isEmpty()) {
                    StringBuilder contextBuilder = new StringBuilder();
                    for (BuscaSemanticaResponse.ResultadoSimples r : resultados.resultados()) {
                        contextBuilder.append("- ").append(r.titulo()).append(": ")
                                .append(r.resumo() != null ? r.resumo() : "").append("\n");
                    }
                    contexto = contextBuilder.toString();
                    contextoEncontrado = true;
                }
            }

            // Se não encontrou contexto suficiente, tenta busca por palavras-chave no CPA
            if (!contextoEncontrado) {
                contexto = buscarContextoPorPalavrasChave(mensagem);
                contextoEncontrado = contexto != null && !contexto.isEmpty();
            }

            String resposta;
            if (contextoEncontrado) {
                resposta = openAIService.chat(
                        SYSTEM_PROMPT_BD_ONLY,
                        mensagem,
                        contexto
                );
                
                // Detecta se o usuário descreveu um caso concreto e salva automaticamente
                CasoGeradoChat casoDetectado = detectarESalvarCaso(mensagem, resposta, usuario);
                if (casoDetectado != null) {
                    return Map.of(
                            "sucesso", true,
                            "resposta", resposta,
                            "contextoUsado", true,
                            "casoDetectado", casoDetectado,
                            "mensagemCaso", "Detectei que você descreveu uma situação penal concreta. Deseja salvar este caso para estudar posteriormente?"
                    );
                }
            } else {
                resposta = "Não encontrei informações suficientes na base de dados para responder com precisão. " +
                        "Sugiro consultar os artigos do Código Penal de Angola ou um advogado especializado.";
            }

            return Map.of(
                    "sucesso", true,
                    "resposta", resposta,
                    "contextoUsado", contextoEncontrado
            );

        } catch (Exception e) {
            return Map.of(
                    "sucesso", false,
                    "mensagem", "Erro ao processar pergunta: " + e.getMessage()
            );
        }
    }

    private String buscarContextoPorPalavrasChave(String mensagem) {
        // Busca por palavras-chave relacionadas a crimes no CPA
        List<String> palavrasChaveCrime = Arrays.asList(
                "homicídio", "matança", "assassinato", "lesão", "corporal",
                "estupro", "violência", "sexual", "roubo", "furto", "qualificação",
                "associação", "criminosa", "tráfico", "drogas", "entorpecentes",
                "corrupção", "propina", "lavagem", "dinheiro", "falsificação",
                "documento", "estelionato", "fraude", "apropriação", "indébita"
        );

        String mensagemLower = mensagem.toLowerCase();
        boolean contemPalavraChave = palavrasChaveCrime.stream()
                .anyMatch(palavra -> mensagemLower.contains(palavra.toLowerCase()));

        if (contemPalavraChave) {
            // Busca artigos relacionados às palavras-chave encontradas
            List<CategoriaCrime> categorias = categoriaCrimeRepository.findAll();
            StringBuilder contextoBuilder = new StringBuilder();
            
            for (CategoriaCrime categoria : categorias) {
                String nomeLower = categoria.getNome().toLowerCase();
                String descricaoLower = categoria.getDescricao() != null ? 
                        categoria.getDescricao().toLowerCase() : "";
                
                if (palavrasChaveCrime.stream().anyMatch(palavra -> 
                        nomeLower.contains(palavra.toLowerCase()) || 
                        descricaoLower.contains(palavra.toLowerCase()))) {
                    
                    contextoBuilder.append("- ").append(categoria.getNome()).append(": ")
                            .append(categoria.getDescricao() != null ? categoria.getDescricao() : "").append("\n");
                    
            // Adiciona os artigos relacionados se existirem
            if (categoria.getArtigos() != null && 
                    !categoria.getArtigos().isEmpty()) {
                StringBuilder artigosStr = new StringBuilder();
                for (Artigo artigo : categoria.getArtigos()) {
                    artigosStr.append(artigo.getNumero()).append(", ");
                }
                if (artigosStr.length() > 2) {
                    artigosStr.setLength(artigosStr.length() - 2); // remove last ", "
                }
                contextoBuilder.append("  Artigos relacionados: ").append(artigosStr).append("\n");
            }
                }
            }
            
            return contextoBuilder.toString();
        }
        
        return null;
    }

    private CasoGeradoChat detectarESalvarCaso(String mensagemUsuario, String respostaIA, Usuario usuario) {
        // Critérios para detectar caso concreto:
        // 1. Mensagem contém descrição de situação com sujeito, verbo e objeto
        // 2. Resposta da IA cita artigos específicos do CPA
        // 3. Mensagem não é uma pergunta direta sobre lei (como "Qual é o artigo...?")
        
        String mensagemLower = mensagemUsuario.toLowerCase().trim();
        
        // Se for pergunta direta sobre lei, não detectar como caso
        if (mensagemLower.startsWith("qual é o artigo") || 
                mensagemLower.startsWith("que artigo") ||
                mensagemLower.startsWith("onde está escrito") ||
                mensagemLower.contains("como é punishido") ||
                mensagemLower.contains("qual a pena")) {
            return null;
        }
        
        // Detecta se a mensagem descreve uma situação (tem verbos de ação e substantivos)
        boolean descreveSituacao = mensagemLower.matches(".*\\b(ele|ela|eles|elas|o|a|os|as|um|uma|dois|duas)\\b.*\\b(fez|fez|cometeu|praticou|matou|roubou|furtou|estupró|agrediu|ameaçou|violentou|sequestrou|tomou|pegou|levou|entrou|saiu|quebrou|incendiou|falsificou|assinou|recebeu|pegou|guardou|escondeu|fugiu)\\b.*");
        
        // Detecta se a resposta cita artigos do CPA
        boolean respostaCitaArtigos = respostaIA.toLowerCase().contains("artigo") && 
                (respostaIA.toLowerCase().contains("cpa") || 
                 respostaIA.toLowerCase().contains("código penal") ||
                 respostaIA.matches(".*\\bartigo\\s+\\d+.*"));
        
        if (descreveSituacao && respostaCitaArtigos) {
            // Gera uma pergunta de quiz baseada no caso
            String perguntaQuiz = gerarPerguntaQuiz(mensagemUsuario, respostaIA);
            String respostaCorreta = extrairRespostaCorreta(respostaIA);
            
            // Salva o caso detectado
            return casoGeradoChatRepository.save(CasoGeradoChat.builder()
                    .usuarioId(usuario.getId())
                    .tema("Situação detectada no chat")
                    .descricao(mensagemUsuario)
                    .perguntaQuiz(perguntaQuiz)
                    .respostaCorreta(respostaCorreta)
                    .artigosUsados(extrairArtigosCitados(respostaIA))
                    .build());
        }
        
        return null;
    }

    private String gerarPerguntaQuiz(String mensagemUsuario, String respostaIA) {
        // Gera uma pergunta baseada na situação descrita e na resposta da IA
        return "Com base na situação descrita ('" + mensagemUsuario.substring(0, Math.min(50, mensagemUsuario.length())) + "...') e nos artigos do CPA citados, qual é a classificação correta desta ação?";
    }

    private String extrairRespostaCorreta(String respostaIA) {
        // Extrai a resposta correta da resposta da IA (simplificado)
        if (respostaIA.contains(",")) {
            return respostaIA.split(",")[0].trim();
        }
        return respostaIA.substring(0, Math.min(100, respostaIA.length()));
    }

    private String extrairArtigosCitados(String respostaIA) {
        // Extrai menções a artigos da resposta
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("artigo\\s+\\d+", java.util.regex.Pattern.CASE_INSENSITIVE);
        java.util.regex.Matcher matcher = pattern.matcher(respostaIA);
        
        List<String> artigos = new ArrayList<>();
        while (matcher.find()) {
            artigos.add(matcher.group().toUpperCase().replace("ARTIGO", "artigo"));
        }
        
        return String.join(", ", artigos);
    }

    @Transactional(readOnly = true)
    public List<CasoGeradoChat> listarCasosUsuario(UUID usuarioId) {
        return casoGeradoChatRepository.findAtivosByUsuarioIdOrderByCriadoEmDesc(usuarioId);
    }
}