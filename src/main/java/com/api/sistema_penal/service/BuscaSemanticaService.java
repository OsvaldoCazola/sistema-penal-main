package com.api.sistema_penal.service;

import com.api.sistema_penal.api.dto.busca.AnaliseCasoRequest;
import com.api.sistema_penal.api.dto.busca.AnaliseCasoResponse;
import com.api.sistema_penal.api.dto.busca.AnaliseCasoResponse.LeiAplicavel;
import com.api.sistema_penal.api.dto.busca.AnaliseCasoResponse.PalavraDetectada;
import com.api.sistema_penal.api.dto.busca.AnaliseCasoResponse.PalavraArtigoMapping;
import com.api.sistema_penal.api.dto.busca.BuscaSemanticaRequest;
import com.api.sistema_penal.api.dto.busca.BuscaSemanticaResponse;
import com.api.sistema_penal.api.dto.busca.BuscaSemanticaResponse.ListaResultados;
import com.api.sistema_penal.api.dto.busca.BuscaSemanticaResponse.ResultadoSimples;
import com.api.sistema_penal.domain.entity.AiExplanations;
import com.api.sistema_penal.domain.entity.CategoriaJuridica;
import com.api.sistema_penal.domain.entity.Lei;
import com.api.sistema_penal.domain.repository.AiExplanationsRepository;
import com.api.sistema_penal.domain.repository.LeiRepository;
import com.api.sistema_penal.service.OpenAIService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Serviço de busca semântica usando TF-IDF para encontrar leis e artigos relacionados
 * Pesquisa exclusivamente na base de dados local
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BuscaSemanticaService {

    private final LeiRepository leiRepository;
    private final AiExplanationsRepository aiExplanationsRepository;
    @Autowired
    private OpenAIService openAIService;

    // Dicionário de palavras-chave jurídicas em português
    // Mapeia palavras para seus tipos
    private static final Map<String, String> DICIONARIO_JURIDICO = new HashMap<>();
    
    static {
        // Tipos de crimes
        DICIONARIO_JURIDICO.put("roubo", "CRIME");
        DICIONARIO_JURIDICO.put("furto", "CRIME");
        DICIONARIO_JURIDICO.put("estelionato", "CRIME");
        DICIONARIO_JURIDICO.put("homicidio", "CRIME");
        DICIONARIO_JURIDICO.put("assassinato", "CRIME");
        DICIONARIO_JURIDICO.put("lesao", "CRIME");
        DICIONARIO_JURIDICO.put("dano", "CRIME");
        DICIONARIO_JURIDICO.put("ameaca", "CRIME");
        DICIONARIO_JURIDICO.put("calunia", "CRIME");
        DICIONARIO_JURIDICO.put("difamacao", "CRIME");
        DICIONARIO_JURIDICO.put("injuria", "CRIME");
        DICIONARIO_JURIDICO.put("violencia", "CRIME");
        DICIONARIO_JURIDICO.put("trafico", "CRIME");
        DICIONARIO_JURIDICO.put("droga", "CRIME");
        DICIONARIO_JURIDICO.put("corrupcao", "CRIME");
        DICIONARIO_JURIDICO.put("peculato", "CRIME");
        DICIONARIO_JURIDICO.put("prevaricacao", "CRIME");
        DICIONARIO_JURIDICO.put("bribery", "CRIME");
        DICIONARIO_JURIDICO.put("extorsao", "CRIME");
        DICIONARIO_JURIDICO.put("sequestro", "CRIME");
        DICIONARIO_JURIDICO.put("rapto", "CRIME");
        DICIONARIO_JURIDICO.put("estupro", "CRIME");
        DICIONARIO_JURIDICO.put("abuso", "CRIME");
        DICIONARIO_JURIDICO.put("assedio", "CRIME");
        
        // Agravantes
        DICIONARIO_JURIDICO.put("violencia", "AGRAVANTE");
        DICIONARIO_JURIDICO.put("arma", "AGRAVANTE");
        DICIONARIO_JURIDICO.put("morte", "AGRAVANTE");
        DICIONARIO_JURIDICO.put("grave", "AGRAVANTE");
        DICIONARIO_JURIDICO.put("reiteracao", "AGRAVANTE");
        DICIONARIO_JURIDICO.put("reincidencia", "AGRAVANTE");
        DICIONARIO_JURIDICO.put("motivo", "AGRAVANTE");
        DICIONARIO_JURIDICO.put("crueldade", "AGRAVANTE");
        DICIONARIO_JURIDICO.put("traicao", "AGRAVANTE");
        DICIONARIO_JURIDICO.put("fraudulento", "AGRAVANTE");
        DICIONARIO_JURIDICO.put("qualificado", "AGRAVANTE");
        DICIONARIO_JURIDICO.put("violento", "AGRAVANTE");
        
        // Atenuantes
        DICIONARIO_JURIDICO.put("primario", "ATENUANTE");
        DICIONARIO_JURIDICO.put("confissao", "ATENUANTE");
        DICIONARIO_JURIDICO.put("arrependimento", "ATENUANTE");
        DICIONARIO_JURIDICO.put("menor", "ATENUANTE");
        DICIONARIO_JURIDICO.put("idade", "ATENUANTE");
        DICIONARIO_JURIDICO.put("coacao", "ATENUANTE");
        DICIONARIO_JURIDICO.put("necessidade", "ATENUANTE");
        DICIONARIO_JURIDICO.put("defesa", "ATENUANTE");
        
        // Meios
        DICIONARIO_JURIDICO.put("arma", "MEIO");
        DICIONARIO_JURIDICO.put("veneno", "MEIO");
        DICIONARIO_JURIDICO.put("fogo", "MEIO");
        DICIONARIO_JURIDICO.put("explosivo", "MEIO");
        DICIONARIO_JURIDICO.put("violencia", "MEIO");
        DICIONARIO_JURIDICO.put("ameaca", "MEIO");
        DICIONARIO_JURIDICO.put("engano", "MEIO");
        DICIONARIO_JURIDICO.put("fraude", "MEIO");
        
        // Locais
        DICIONARIO_JURIDICO.put("domicilio", "LOCALE");
        DICIONARIO_JURIDICO.put("casa", "LOCALE");
        DICIONARIO_JURIDICO.put("rua", "LOCALE");
        DICIONARIO_JURIDICO.put("via", "LOCALE");
        DICIONARIO_JURIDICO.put("estabelecimento", "LOCALE");
        DICIONARIO_JURIDICO.put("escola", "LOCALE");
        DICIONARIO_JURIDICO.put("igreja", "LOCALE");
    }

    // Palavras irrelevantes (stop words em português)
    private static final Set<String> STOP_WORDS = new HashSet<>(Arrays.asList(
        "a", "à", "ao", "aos", "aquela", "aquelas", "aquele", "aqueles", "aquilo",
        "as", "às", "até", "com", "como", "da", "das", "de", "dela", "delas",
        "dele", "deles", "depois", "do", "dos", "e", "é", "ela", "elas", "ele",
        "eles", "em", "entre", "era", "eram", "essa", "essas", "esse", "esses",
        "esta", "está", "estão", "estas", "estava", "estavam", "este", "estes",
        "esteve", "estive", "estivemos", "estiveram", "estivesse", "estivessem",
        "eu", "foi", "fomos", "for", "fora", "foram", "fosse", "fossem", "fui",
        "há", "havia", "haviam", "isso", "isto", "já", "lhe", "lhes", "lo",
        "mais", "mas", "me", "mesmo", "meu", "meus", "minha", "minhas", "muito",
        "muitos", "na", "não", "nas", "nem", "no", "nos", "nós", "nossa",
        "nossas", "nosso", "nossos", "num", "numa", "o", "os", "ou", "para",
        "pela", "pelas", "pelo", "pelos", "por", "qual", "quando", "que", "quem",
        "são", "se", "seja", "sejam", "sem", "ser", "será", "serão", "seria",
        "seriam", "seu", "seus", "só", "somos", "sou", "sua", "suas", "também",
        "te", "tem", "tém", "tendo", "tenha", "tenham", "temos", "tenho", "ter",
        "terá", "terão", "teria", "teriam", "teu", "teus", "teve", "tinha",
        "tinham", "tive", "tivemos", "tivessem", "tu", "tua", "tuas", "um", "uma",
        "umas", "uns", "vai", "vamos", "vão", "você", "vocês", "vos", "vossa",
        "vossas", "vosso", "vossos"
    ));

    /**
     * Executa busca semântica por similaridade usando TF-IDF
     */
    public BuscaSemanticaResponse.ListaResultados buscarPorSimilaridade(BuscaSemanticaRequest request) {
        log.info("Executando busca semântica para: {}", request.termo());
        
        List<String> termosBusca = tokenizar(request.termo());
        Page<Lei> documentos = leiRepository.buscarPorTexto(request.termo(), PageRequest.of(0, 100));
        
        // Se não encontrar resultados locais, buscar todas as leis
        if (documentos.isEmpty()) {
            documentos = leiRepository.findAll(PageRequest.of(0, 100));
        }
        
        if (documentos.isEmpty()) {
            return new ListaResultados(new ArrayList<>(), 0, request.termo(), request.categoria(), request.threshold());
        }
        
        Map<String, Double> idf = calcularIDF(documentos.getContent());
        Map<String, Double> vetorBusca = calcularTFIDF(termosBusca, idf, termosBusca.size());
        
        List<Map.Entry<Lei, Double>> resultados = new ArrayList<>();
        for (Lei doc : documentos.getContent()) {
            String textoCompleto = doc.getEmenta() != null ? doc.getEmenta() : "";
            if (doc.getConteudo() != null) {
                textoCompleto += " " + doc.getConteudo();
            }
            List<String> termosDoc = tokenizar(textoCompleto);
            Map<String, Double> vetorDoc = calcularTFIDF(termosDoc, idf, termosDoc.size());
            
            double similaridade = calcularSimilaridadeCosseno(vetorBusca, vetorDoc);
            
            if (similaridade >= request.threshold()) {
                resultados.add(Map.entry(doc, similaridade));
            }
        }
        
        resultados.sort((a, b) -> Double.compare(b.getValue(), a.getValue()));
        
        List<ResultadoSimples> resultadosFinais = resultados.stream()
            .limit(request.limite())
            .map(e -> new ResultadoSimples(
                e.getKey().getId(),
                e.getKey().getTipo() + " " + e.getKey().getNumero() + "/" + e.getKey().getAno(),
                e.getKey().getEmenta(),
                null,
                e.getValue(),
                e.getKey().getTipo() + " " + e.getKey().getNumero() + "/" + e.getKey().getAno()
            ))
            .collect(Collectors.toList());
        
        return new ListaResultados(
            resultadosFinais,
            resultadosFinais.size(),
            request.termo(),
            request.categoria(),
            request.threshold()
        );
    }

    /**
     * Busca leis relacionadas a uma categoria
     */
    public BuscaSemanticaResponse.ListaResultados buscarPorCategoria(CategoriaJuridica categoria, Integer limite) {
        log.info("Buscando leis para categoria: {}", categoria);
        
        Page<Lei> documentos = leiRepository.findAll(PageRequest.of(0, limite != null ? limite : 20));
        
        List<ResultadoSimples> resultados = documentos.getContent().stream()
            .map(doc -> new ResultadoSimples(
                doc.getId(),
                doc.getTipo() + " " + doc.getNumero() + "/" + doc.getAno(),
                doc.getEmenta(),
                null,
                1.0,
                doc.getTipo() + " " + doc.getNumero() + "/" + doc.getAno()
            ))
            .collect(Collectors.toList());
        
        return new ListaResultados(
            resultados,
            resultados.size(),
            "Categoria: " + (categoria != null ? categoria.getDescricao() : "Todas"),
            categoria,
            0.0
        );
    }

    /**
     * Analisa um caso e sugere leis aplicáveis
     * Agora usa IA (Groq) para análise inteligente
     */
    public AnaliseCasoResponse analisarCaso(AnaliseCasoRequest request) {
        log.info("Analisando caso: {}", request.descricao());
        
        List<String> termos = tokenizar(request.descricao());
        
        if (request.tipoCrime() != null) {
            termos.addAll(tokenizar(request.tipoCrime()));
        }
        
        Page<Lei> documentos = leiRepository.buscarPorTexto(
            String.join(" ", termos), PageRequest.of(0, request.limite() * 2));
        
        // Se não encontrar resultados específicos, buscar todas as leis
        if (documentos.isEmpty()) {
            documentos = leiRepository.findAll(PageRequest.of(0, request.limite()));
        }
        
        // Se ainda não encontrou resultados locais, retorna resposta básica
        if (documentos.isEmpty()) {
            return AnaliseCasoResponse.builder()
                .descricaoAnalisada(request.descricao())
                .tipoCrime(request.tipoCrime())
                .categoria(null)
                .leisAplicaveis(new ArrayList<>())
                .analise("Nenhuma lei encontrada na base de dados local para o caso descrito.")
                .recomendacoes(new ArrayList<>())
                .palavrasDetectadas(new ArrayList<>())
                .mapeamentoPalavrasArtigos(new HashMap<>())
                .build();
        }
        
        // ========== ANÁLISE COM IA (Groq) ==========
        String analiseIA = null;
        if (openAIService.isConfigured()) {
            try {
                // Preparar contexto com as leis encontradas
                StringBuilder contexto = new StringBuilder();
                for (Lei lei : documentos.getContent()) {
                    contexto.append("- ").append(lei.getTipo()).append(" ").append(lei.getNumero());
                    if (lei.getAno() != null) contexto.append("/").append(lei.getAno());
                    contexto.append(": ").append(lei.getEmenta() != null ? lei.getEmenta() : "");
                    if (lei.getConteudo() != null) {
                        contexto.append(" ").append(lei.getConteudo().substring(0, 
                            Math.min(500, lei.getConteudo().length())));
                    }
                    contexto.append("\n");
                }
                
                // Prompt para análise jurídica
                String systemPrompt = """
                    Você é um assistente jurídico especializado em direito angolano.
                    Com base na descrição de um caso criminal e nas leis encontradas na base de dados,
                    faça uma análise jurídica indicando:
                    1. O tipo de crime identificado
                    2. As circunstâncias agravantes e atenuantes
                    3. As leis e artigos aplicáveis
                    4. Uma análise da possível pena base
                    
                    Responda em português de forma clara e profissional.
                    """;
                
                String userMessage = "Descrição do caso: " + request.descricao() + 
                    "\n\nTipo de crime informado: " + (request.tipoCrime() != null ? request.tipoCrime() : "não informado");
                
                analiseIA = openAIService.chat(systemPrompt, userMessage, contexto.toString());
                log.info("Análise IA gerada com sucesso");
            } catch (Exception e) {
                log.error("Erro ao gerar análise com IA: {}", e.getMessage());
            }
        } else {
            log.warn("IA não configurada - usando análise baseada em TF-IDF");
        }
        
        // ========== ANÁLISE TF-IDF (FALLBACK) ==========
        Map<String, Double> idf = calcularIDF(documentos.getContent());
        Map<String, Double> vetorBusca = calcularTFIDF(termos, idf, termos.size());
        
        List<Map.Entry<Lei, Double>> leisRelevantes = new ArrayList<>();
        for (Lei doc : documentos.getContent()) {
            String textoCompleto = doc.getEmenta() != null ? doc.getEmenta() : "";
            if (doc.getConteudo() != null) {
                textoCompleto += " " + doc.getConteudo();
            }
            List<String> termosDoc = tokenizar(textoCompleto);
            Map<String, Double> vetorDoc = calcularTFIDF(termosDoc, idf, termosDoc.size());
            double similaridade = calcularSimilaridadeCosseno(vetorBusca, vetorDoc);
            if (similaridade > 0.1) {
                leisRelevantes.add(Map.entry(doc, similaridade));
            }
        }
        
        leisRelevantes.sort((a, b) -> Double.compare(b.getValue(), a.getValue()));
        
        // Detectar palavras-chave na descrição
        List<PalavraDetectada> palavrasDetectadas = detectarPalavrasChave(termos);
        
        // Criar mapeamento palavra → artigo
        Map<String, List<PalavraArtigoMapping>> mapeamento = criarMapeamentoPalavrasArtigos(
            palavrasDetectadas, leisRelevantes);
        
        // Persistir explicações no banco
        salvarExplicacoes(request.descricao(), palavrasDetectadas, mapeamento);
        
        List<LeiAplicavel> leisAplicaveis = leisRelevantes.stream()
            .limit(request.limite())
            .map(e -> {
                // Encontrar palavras relacionadas a este artigo
                List<String> palavrasRelacionadas = new ArrayList<>();
                for (Map.Entry<String, List<PalavraArtigoMapping>> entry : mapeamento.entrySet()) {
                    for (PalavraArtigoMapping mapping : entry.getValue()) {
                        if (mapping.artigoId().equals(e.getKey().getId())) {
                            palavrasRelacionadas.add(entry.getKey());
                        }
                    }
                }
                
                // Gerar explicação específica
                String explicacao = gerarExplicacaoEspecifica(palavrasRelacionadas, e.getKey(), request.descricao());
                
                return new LeiAplicavel(
                    e.getKey().getId(),
                    e.getKey().getTipo() + " " + e.getKey().getNumero() + "/" + e.getKey().getAno(),
                    e.getKey().getTipo() + " " + e.getKey().getNumero() + "/" + e.getKey().getAno(),
                    null,
                    e.getValue(),
                    explicacao,
                    null,
                    palavrasRelacionadas
                );
            })
            .collect(Collectors.toList());
        
        // Se temos análise da IA, usamos ela; caso contrário, geramos local
        String analise = analiseIA != null ? analiseIA : gerarAnalise(request.descricao(), leisAplicaveis, palavrasDetectadas);
        List<String> recomendacoes = gerarRecomendacoes(leisAplicaveis);
        
        return AnaliseCasoResponse.builder()
            .descricaoAnalisada(request.descricao())
            .tipoCrime(request.tipoCrime())
            .categoria(null)
            .leisAplicaveis(leisAplicaveis)
            .analise(analise)
            .recomendacoes(recomendacoes)
            .palavrasDetectadas(palavrasDetectadas)
            .mapeamentoPalavrasArtigos(mapeamento)
            .build();
    }

    /**
     * Detecta palavras-chave jurídicas na descrição do caso
     */
    private List<PalavraDetectada> detectarPalavrasChave(List<String> termos) {
        List<PalavraDetectada> palavras = new ArrayList<>();
        Set<String> adicionadas = new HashSet<>();
        
        for (String termo : termos) {
            String termoLower = termo.toLowerCase();
            if (DICIONARIO_JURIDICO.containsKey(termoLower) && !adicionadas.contains(termoLower)) {
                String tipo = DICIONARIO_JURIDICO.get(termoLower);
                palavras.add(new PalavraDetectada(termoLower, tipo, 1.0));
                adicionadas.add(termoLower);
            }
        }
        
        return palavras;
    }

    /**
     * Cria mapeamento de palavras-chave para artigos
     */
    private Map<String, List<PalavraArtigoMapping>> criarMapeamentoPalavrasArtigos(
            List<PalavraDetectada> palavras, List<Map.Entry<Lei, Double>> leisRelevantes) {
        
        Map<String, List<PalavraArtigoMapping>> mapeamento = new HashMap<>();
        
        for (PalavraDetectada palavra : palavras) {
            List<PalavraArtigoMapping> mappings = new ArrayList<>();
            
            for (Map.Entry<Lei, Double> leiEntry : leisRelevantes) {
                Lei lei = leiEntry.getKey();
                String textoLei = (lei.getEmenta() != null ? lei.getEmenta() : "") + 
                                  (lei.getConteudo() != null ? " " + lei.getConteudo() : "");
                
                // Verificar se a palavra aparece no texto da lei
                if (textoLei.toLowerCase().contains(palavra.palavra())) {
                    String justificativa = gerarJustificativa(palavra, lei);
                    mappings.add(new PalavraArtigoMapping(
                        palavra.palavra(),
                        palavra.tipo(),
                        lei.getId(),
                        lei.getTipo() + " " + lei.getNumero() + "/" + lei.getAno(),
                        justificativa
                    ));
                }
            }
            
            if (!mappings.isEmpty()) {
                mapeamento.put(palavra.palavra(), mappings);
            }
        }
        
        return mapeamento;
    }

    /**
     * Gera justificativa para o mapeamento palavra → artigo
     */
    private String gerarJustificativa(PalavraDetectada palavra, Lei lei) {
        StringBuilder sb = new StringBuilder();
        
        switch (palavra.tipo()) {
            case "CRIME" -> sb.append("Palavra '").append(palavra.palavra()).append("' indica crime de ")
                               .append(palavra.palavra()).append(" previsto no artigo ")
                               .append(lei.getNumero());
            case "AGRAVANTE" -> sb.append("Palavra '").append(palavra.palavra()).append("' constitui circunstância agravante ")
                                  .append("conforme artigo ").append(lei.getNumero());
            case "ATENUANTE" -> sb.append("Palavra '").append(palavra.palavra()).append("' constitui circunstância atenuante ")
                                   .append("conforme artigo ").append(lei.getNumero());
            case "MEIO" -> sb.append("Palavra '").append(palavra.palavra()).append("' indica meio utilizado para prática do crime ")
                              .append("previsto no artigo ").append(lei.getNumero());
            case "LOCALE" -> sb.append("Palavra '").append(palavra.palavra()).append("' indica local do crime ")
                               .append("previsto no artigo ").append(lei.getNumero());
            default -> sb.append("Palavra '").append(palavra.palavra()).append("' encontrada no artigo ")
                         .append(lei.getNumero());
        }
        
        return sb.toString();
    }

    /**
     * Gera explicação específica para um artigo baseado nas palavras detectadas
     */
    private String gerarExplicacaoEspecifica(List<String> palavrasRelacionadas, Lei lei, String descricao) {
        if (palavrasRelacionadas.isEmpty()) {
            return "Esta lei é aplicável ao caso pois contém disposições relevantes para: " + descricao;
        }
        
        StringBuilder sb = new StringBuilder();
        sb.append("Esta lei é aplicável pois foram detectadas as seguintes palavras-chave: ");
        
        for (int i = 0; i < palavrasRelacionadas.size(); i++) {
            sb.append("'").append(palavrasRelacionadas.get(i)).append("'");
            if (i < palavrasRelacionadas.size() - 1) {
                sb.append(", ");
            }
        }
        
        sb.append(". A lei ").append(lei.getTipo()).append(" ").append(lei.getNumero())
          .append("/").append(lei.getAno()).append(" trata diretamente deste caso.");
        
        return sb.toString();
    }

    /**
     * Salva as explicações no banco de dados
     */
    private void salvarExplicacoes(String termoBusca, List<PalavraDetectada> palavras,
                                   Map<String, List<PalavraArtigoMapping>> mapeamento) {
        try {
            List<AiExplanations> explicacoes = new ArrayList<>();
            
            for (PalavraDetectada palavra : palavras) {
                List<PalavraArtigoMapping> mappings = mapeamento.get(palavra.palavra());
                if (mappings != null) {
                    for (PalavraArtigoMapping mapping : mappings) {
                        AiExplanations explicacao = AiExplanations.builder()
                            .termoBusca(termoBusca)
                            .palavraChave(palavra.palavra())
                            .tipoPalavra(AiExplanations.TipoPalavra.valueOf(palavra.tipo()))
                            .artigoId(mapping.artigoId())
                            .artigoTitulo(mapping.artigoTitulo())
                            .relevancia(palavra.relevancia())
                            .justificativa(mapping.justificativa())
                            .build();
                        explicacoes.add(explicacao);
                    }
                }
            }
            
            if (!explicacoes.isEmpty()) {
                aiExplanationsRepository.saveAll(explicacoes);
                log.info("Salvas {} explicações no banco de dados", explicacoes.size());
            }
        } catch (Exception e) {
            log.warn("Erro ao salvar explicações no banco: {}", e.getMessage());
        }
    }

    /**
     * Obtém todas as categorias disponíveis
     */
    public List<CategoriaJuridica> getCategorias() {
        return Arrays.asList(CategoriaJuridica.values());
    }

    /**
     * Tokeniza o texto em palavras
     */
    private List<String> tokenizar(String texto) {
        if (texto == null || texto.isEmpty()) {
            return Collections.emptyList();
        }
        
        return Arrays.stream(texto.toLowerCase()
                .replaceAll("[^a-záàâãéèêíìîóòôõúùûç\\s]", " ")
                .split("\\s+"))
            .filter(palavra -> !palavra.isEmpty() && !STOP_WORDS.contains(palavra))
            .collect(Collectors.toList());
    }

    /**
     * Calcula TF (Term Frequency) para cada termo
     */
    private Map<String, Integer> calcularTF(List<String> termos) {
        Map<String, Integer> tf = new HashMap<>();
        for (String termo : termos) {
            tf.put(termo, tf.getOrDefault(termo, 0) + 1);
        }
        return tf;
    }

    /**
     * Calcula IDF (Inverse Document Frequency) para todos os documentos
     */
    private Map<String, Double> calcularIDF(List<Lei> documentos) {
        Map<String, Double> idf = new HashMap<>();
        int N = documentos.size();
        
        if (N == 0) return idf;
        
        Map<String, Integer> df = new HashMap<>();
        for (Lei doc : documentos) {
            String texto = doc.getEmenta() != null ? doc.getEmenta() : "";
            if (doc.getConteudo() != null) {
                texto += " " + doc.getConteudo();
            }
            Set<String> termosUnicos = new HashSet<>(tokenizar(texto));
            for (String termo : termosUnicos) {
                df.put(termo, df.getOrDefault(termo, 0) + 1);
            }
        }
        
        for (Map.Entry<String, Integer> entry : df.entrySet()) {
            idf.put(entry.getKey(), Math.log((double) N / entry.getValue()) + 1);
        }
        
        return idf;
    }

    /**
     * Calcula vetor TF-IDF para um documento
     */
    private Map<String, Double> calcularTFIDF(List<String> termos, Map<String, Double> idf, int totalTermos) {
        Map<String, Double> tfidf = new HashMap<>();
        Map<String, Integer> tf = calcularTF(termos);
        
        for (Map.Entry<String, Integer> entry : tf.entrySet()) {
            String termo = entry.getKey();
            double tfValue = (double) entry.getValue() / totalTermos;
            double idfValue = idf.getOrDefault(termo, 1.0);
            tfidf.put(termo, tfValue * idfValue);
        }
        
        return tfidf;
    }

    /**
     * Calcula similaridade cosseno entre dois vetores
     */
    private double calcularSimilaridadeCosseno(Map<String, Double> v1, Map<String, Double> v2) {
        if (v1.isEmpty() || v2.isEmpty()) return 0.0;
        
        double produtoEscalar = 0.0;
        double norma1 = 0.0;
        double norma2 = 0.0;
        
        for (String termo : v1.keySet()) {
            double val1 = v1.get(termo);
            double val2 = v2.getOrDefault(termo, 0.0);
            produtoEscalar += val1 * val2;
        }
        
        for (double val : v1.values()) {
            norma1 += val * val;
        }
        norma1 = Math.sqrt(norma1);
        
        for (double val : v2.values()) {
            norma2 += val * val;
        }
        norma2 = Math.sqrt(norma2);
        
        if (norma1 == 0 || norma2 == 0) return 0.0;
        
        return produtoEscalar / (norma1 * norma2);
    }

    /**
     * Gera análise para o caso
     */
    private String gerarAnalise(String descricao, List<LeiAplicavel> leis, List<PalavraDetectada> palavrasDetectadas) {
        if (leis.isEmpty()) {
            return "Não foram encontradas leis diretamente aplicáveis ao caso descrito. Considere buscar por termos mais específicos.";
        }
        
        StringBuilder analise = new StringBuilder();
        
        // Se houver palavras detectadas, mostrar o mapeamento
        if (!palavrasDetectadas.isEmpty()) {
            analise.append("=== PALAVRAS-CHAVE DETECTADAS ===\n\n");
            
            for (PalavraDetectada palavra : palavrasDetectadas) {
                analise.append("• '").append(palavra.palavra()).append("'");
                analise.append(" (tipo: ").append(palavra.tipo()).append(")\n");
            }
            
            analise.append("\n=== LEIS APLICÁVEIS ===\n\n");
        } else {
            analise.append("Com base na descrição do caso, foram identificadas ").append(leis.size());
            analise.append(" lei(s) potencialmente aplicável(is):\n\n");
        }
        
        for (int i = 0; i < Math.min(leis.size(), 5); i++) {
            LeiAplicavel lei = leis.get(i);
            analise.append(i + 1).append(". ").append(lei.titulo());
            analise.append(" - Relevância: ").append(String.format("%.2f", lei.relevancia() * 100)).append("%");
            
            // Mostrar palavras relacionadas a este artigo
            if (lei.palavrasRelacionadas() != null && !lei.palavrasRelacionadas().isEmpty()) {
                analise.append("\n   Palavras detectadas: ");
                analise.append(String.join(", ", lei.palavrasRelacionadas()));
            }
            analise.append("\n");
        }
        
        return analise.toString();
    }

    /**
     * Gera recomendações baseadas nas leis encontradas
     */
    private List<String> gerarRecomendacoes(List<LeiAplicavel> leis) {
        List<String> recomendacoes = new ArrayList<>();
        
        if (leis.isEmpty()) {
            recomendacoes.add("Considere buscar por termos mais específicos");
            return recomendacoes;
        }
        
        recomendacoes.add("Analisar detalhadamente os artigos mencionados");
        recomendacoes.add("Verificar a jurisprudência mais recente sobre o tema");
        
        if (leis.size() >= 3) {
            recomendacoes.add("Considerar a combinação de múltiplas leis para uma análise completa");
        }
        
        return recomendacoes;
    }
}
