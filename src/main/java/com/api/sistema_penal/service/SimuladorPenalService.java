package com.api.sistema_penal.service;

import com.api.sistema_penal.api.dto.simulador.EnquadramentoRequest;
import com.api.sistema_penal.api.dto.simulador.EnquadramentoResponse;
import com.api.sistema_penal.api.dto.simulador.EnquadramentoResponse.*;
import com.api.sistema_penal.domain.entity.Artigo;
import com.api.sistema_penal.domain.entity.ElementoJuridico;
import com.api.sistema_penal.domain.entity.SimulacaoRegistro;
import com.api.sistema_penal.domain.repository.ArtigoRepository;
import com.api.sistema_penal.domain.repository.ElementoJuridicoRepository;
import com.api.sistema_penal.domain.repository.SimulacaoRegistroRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Serviço de Simulação de Enquadramento Penal
 * Grande diferencial: motor de inferência com explicabilidade completa
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SimuladorPenalService {

    private final ArtigoRepository artigoRepository;
    private final ElementoJuridicoRepository elementoJuridicoRepository;
    private final SimulacaoRegistroRepository simulacaoRegistroRepository;

    @Transactional
    public EnquadramentoResponse enquadrar(EnquadramentoRequest request) {
        log.info("Iniciando simulação de enquadramento para: {}", request.getTipoCrime());

        // 1. Analisar caso e identificar palavras-chave
        List<String> palavrasChave = identificarPalavrasChave(request);

        // 2. Buscar artigos relacionados
        List<Artigo> artigosRelevantes = buscarArtigosRelacionados(palavrasChave, request.getTipoCrime());

        // 3. Analisar elementos do crime
        List<CrimePossivel> crimesPossiveis = new ArrayList<>();

        for (Artigo artigo : artigosRelevantes) {
            CrimePossivel crime = analisarArtigo(artigo, request, palavrasChave);
            if (crime != null) {
                crimesPossiveis.add(crime);
            }
        }

        // 4. Ordenar por probabilidade
        crimesPossiveis.sort((a, b) -> Double.compare(b.getProbabilidade(), a.getProbabilidade()));

        // 5. Verificar concurso de crimes
        crimesPossiveis = verificarConcurso(crimesPossiveis, request);

        // 6. Gerar passos explicativos
        List<PassoExplicativo> passos = gerarPassosExplicativos(request, artigosRelevantes, crimesPossiveis);

        // 7. Gerar conclusão
        Conclusao conclusao = gerarConclusao(crimesPossiveis, request);

        // 8. Gerar mapa de elementos
        MapaElementos mapaElementos = gerarMapaElementos(request, artigosRelevantes);

        // 9. Advertências
        List<String> advertencias = gerarAdvertencias(crimesPossiveis, request);

        // 10. Salvar registro da simulação
        salvarSimulacao(request, crimesPossiveis, conclusao);

        return EnquadramentoResponse.builder()
                .id(UUID.randomUUID())
                .descricaoCasoOriginal(request.getDescricaoCaso())
                .crimesPossiveis(crimesPossiveis)
                .conclusao(conclusao)
                .passosExplicativos(passos)
                .mapaElementos(mapaElementos)
                .advertencias(advertencias)
                .dataAnalise(LocalDateTime.now())
                .build();
    }

    /**
     * Salva o registro da simulação no banco de dados
     */
    private void salvarSimulacao(EnquadramentoRequest request, List<CrimePossivel> crimesPossiveis, Conclusao conclusao) {
        try {
            String artigoNumero = crimesPossiveis.isEmpty() ? null : crimesPossiveis.get(0).getArtigoNumero();
            String artigoTitulo = crimesPossiveis.isEmpty() ? null : crimesPossiveis.get(0).getArtigoTitulo();
            Double probabilidade = crimesPossiveis.isEmpty() ? 0.0 : crimesPossiveis.get(0).getProbabilidade();
            
            String resultado;
            if (crimesPossiveis.isEmpty()) {
                resultado = "NAO_ENQUADRADO";
            } else if (Boolean.TRUE.equals(conclusao.getRequerAnaliseJuridica())) {
                resultado = "REQUER_ANALISE";
            } else {
                resultado = "ENQUADRADO";
            }

            SimulacaoRegistro registro = SimulacaoRegistro.builder()
                    .tipoCrime(request.getTipoCrime())
                    .artigoNumero(artigoNumero)
                    .artigoTitulo(artigoTitulo)
                    .probabilidade(probabilidade)
                    .descricaoCaso(request.getDescricaoCaso() != null ? 
                            (request.getDescricaoCaso().length() > 500 ? 
                                    request.getDescricaoCaso().substring(0, 500) : 
                                    request.getDescricaoCaso()) : null)
                    .resultado(resultado)
                    .nivelConfianca(conclusao.getNivelConfianca())
                    .ativa(true)
                    .build();

            simulacaoRegistroRepository.save(registro);
            log.info("Simulação salva com sucesso: tipoCrime={}, resultado={}", request.getTipoCrime(), resultado);
        } catch (Exception e) {
            log.warn("Erro ao salvar simulação: {}", e.getMessage());
        }
    }

    private List<String> identificarPalavrasChave(EnquadramentoRequest request) {
        Set<String> palavras = new HashSet<>();
        String texto = (request.getDescricaoCaso() + " " + request.getTipoCrime()).toLowerCase();

        // Dicionário de crimes
        Map<String, List<String>> dicionario = new HashMap<>();
        dicionario.put("furto", Arrays.asList("subtrair", "coisa", "móvel", "alheia", "intenção", "património"));
        dicionario.put("roubo", Arrays.asList("subtrair", "violência", "ameaça", "coisa", "alheia"));
        dicionario.put("homicídio", Arrays.asList("matar", "morte", "tirar", "vida", "pessoa"));
        dicionario.put("lesão", Arrays.asList("ofender", "integridade", "física", "corpo"));
        dicionario.put("violência", Arrays.asList("agredir", "espancar", "força", "física"));
        dicionario.put("estelionato", Arrays.asList("enganar", "fraude", "prejuízo", "patrimonial"));

        for (Map.Entry<String, List<String>> entry : dicionario.entrySet()) {
            if (texto.contains(entry.getKey())) {
                palavras.add(entry.getKey());
                palavras.addAll(entry.getValue());
            }
        }

        // Adicionar fatos
        if (request.getFatos() != null) {
            for (EnquadramentoRequest.Fato fato : request.getFatos()) {
                if (fato.getDescricao() != null) {
                    String[] palavrasFato = fato.getDescricao().toLowerCase().split("\\s+");
                    palavras.addAll(Arrays.asList(palavrasFato));
                }
            }
        }

        return new ArrayList<>(palavras);
    }

    private List<Artigo> buscarArtigosRelacionados(List<String> palavrasChave, String tipoCrime) {
        List<Artigo> artigos = new ArrayList<>();

        for (String palavra : palavrasChave) {
            try {
                Page<Artigo> result = artigoRepository.buscarPorTexto(palavra, PageRequest.of(0, 10));
                artigos.addAll(result.getContent());
            } catch (Exception e) {
                log.warn("Erro ao buscar artigo: {}", e.getMessage());
            }
        }

        if (artigos.isEmpty()) {
            try {
                Page<Artigo> result = artigoRepository.findAll(PageRequest.of(0, 20));
                artigos = result.getContent().stream()
                        .filter(a -> a.getTipoPenal() != null && 
                                a.getTipoPenal().toLowerCase().contains(tipoCrime.toLowerCase()))
                        .collect(Collectors.toList());
            } catch (Exception e) {
                log.warn("Erro ao buscar artigos por tipo: {}", e.getMessage());
            }
        }

        return artigos.stream().distinct().limit(10).collect(Collectors.toList());
    }

    private CrimePossivel analisarArtigo(Artigo artigo, EnquadramentoRequest request, 
                                        List<String> palavrasChave) {
        // Verificação defensiva para artigo null
        if (artigo == null) {
            log.warn("Artigo nulo recebido no método analisarArtigo");
            return null;
        }
        
        List<ElementoJuridico> elementos = elementoJuridicoRepository
                .findByArtigoIdOrderByOrdemAsc(artigo.getId());

        if (elementos.isEmpty()) {
            return criarMatchingGenerico(artigo, request, palavrasChave);
        }

        List<ElementoMatched> elementosEncontrados = new ArrayList<>();
        List<ElementoFaltante> elementosFaltantes = new ArrayList<>();
        int elementosObrigatorios = 0;
        int elementosEncontradosCount = 0;

        for (ElementoJuridico elemento : elementos) {
            boolean encontrado = verificarElemento(elemento, request, palavrasChave);

            if (elemento.getTipo() == ElementoJuridico.TipoElemento.ACAO ||
                elemento.getTipo() == ElementoJuridico.TipoElemento.forma) {
                elementosObrigatorios++;
                if (encontrado) {
                    elementosEncontradosCount++;
                    elementosEncontrados.add(ElementoMatched.builder()
                            .elemento(elemento.getTipo().name())
                            .descricao(elemento.getDescricao())
                            .fatoCorrespondente(encontrarFatoCorrespondente(elemento, request))
                            .verificado(true)
                            .artigoReferencia("Art. " + artigo.getNumero() + ".º")
                            .build());
                } else {
                    elementosFaltantes.add(ElementoFaltante.builder()
                            .elemento(elemento.getTipo().name())
                            .descricao(elemento.getDescricao())
                            .indispensavel(true)
                            .build());
                }
            }
        }

        double probabilidade = elementosObrigatorios > 0 ? 
            (elementosEncontradosCount * 100.0 / elementosObrigatorios) : 50.0;

        if (elementosObrigatorios > 0 && elementosEncontradosCount == 0) {
            return null;
        }

        String penaMin = artigo.getPenaMinAnos() != null ? artigo.getPenaMinAnos() + " anos" : "não especificada";
        String penaMax = artigo.getPenaMaxAnos() != null ? artigo.getPenaMaxAnos() + " anos" : "não especificada";

        return CrimePossivel.builder()
                .artigoId(artigo.getId())
                .artigoNumero(artigo.getNumero())
                .artigoTitulo(artigo.getTitulo())
                .tipoCrime(request.getTipoCrime())
                .probabilidade(probabilidade)
                .penaMinima(penaMin)
                .penaMaxima(penaMax)
                .tipoPenal(artigo.getTipoPenal())
                .concurso(false)
                .elementosEncontrados(elementosEncontrados)
                .elementosFaltantes(elementosFaltantes)
                .justificativa(gerarJustificativa(artigo, elementosEncontrados, elementosFaltantes))
                .build();
    }

    private CrimePossivel criarMatchingGenerico(Artigo artigo, EnquadramentoRequest request,
                                                 List<String> palavrasChave) {
        String conteudo = artigo.getConteudo() != null ? artigo.getConteudo().toLowerCase() : "";
        String descricao = request.getDescricaoCaso().toLowerCase();

        int matches = 0;
        for (String palavra : palavrasChave) {
            if (conteudo.contains(palavra)) {
                matches++;
            }
        }

        double probabilidade = Math.min(matches * 20.0, 80.0);

        if (probabilidade < 20.0) {
            return null;
        }

        return CrimePossivel.builder()
                .artigoId(artigo.getId())
                .artigoNumero(artigo.getNumero())
                .artigoTitulo(artigo.getTitulo())
                .tipoCrime(request.getTipoCrime())
                .probabilidade(probabilidade)
                .penaMinima(artigo.getPenaMinAnos() != null ? artigo.getPenaMinAnos() + " anos" : "N/A")
                .penaMaxima(artigo.getPenaMaxAnos() != null ? artigo.getPenaMaxAnos() + " anos" : "N/A")
                .tipoPenal(artigo.getTipoPenal())
                .concurso(false)
                .justificativa("Correspondência baseada em palavras-chave encontradas no texto")
                .build();
    }

    private boolean verificarElemento(ElementoJuridico elemento, EnquadramentoRequest request,
                                      List<String> palavrasChave) {
        if (elemento == null || elemento.getDescricao() == null || elemento.getDescricao().isEmpty()) {
            return false;
        }
        String textoElemento = elemento.getDescricao().toLowerCase();
        String textoCaso = request.getDescricaoCaso() != null ? request.getDescricaoCaso().toLowerCase() : "";

        for (String palavra : palavrasChave) {
            if (textoElemento.contains(palavra) && textoCaso.contains(palavra)) {
                return true;
            }
        }

        if (request.getFatos() != null) {
            for (EnquadramentoRequest.Fato fato : request.getFatos()) {
                if (fato.getDescricao() != null) {
                    String searchTerm = textoElemento.substring(0, Math.min(5, textoElemento.length()));
                    if (fato.getDescricao().toLowerCase().contains(searchTerm)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    private String encontrarFatoCorrespondente(ElementoJuridico elemento, EnquadramentoRequest request) {
        if (request.getFatos() == null || request.getFatos().isEmpty()) {
            return "Descrito na narrativa principal";
        }

        if (elemento == null || elemento.getDescricao() == null || elemento.getDescricao().isEmpty()) {
            return request.getFatos().get(0).getDescricao();
        }

        for (EnquadramentoRequest.Fato fato : request.getFatos()) {
            if (fato.getDescricao() != null && 
                elemento.getDescricao().toLowerCase().contains(fato.getDescricao().toLowerCase().substring(0, Math.min(5, fato.getDescricao().length())))) {
                return fato.getDescricao();
            }
        }

        return request.getFatos().get(0).getDescricao();
    }

    private String gerarJustificativa(Artigo artigo, List<ElementoMatched> encontrados,
                                       List<ElementoFaltante> faltantes) {
        StringBuilder sb = new StringBuilder();
        sb.append("Artigo ").append(artigo.getNumero()).append(".º - ").append(artigo.getTitulo()).append("\n");

        if (!encontrados.isEmpty()) {
            sb.append("Elementos identificados: ");
            sb.append(encontrados.stream().map(ElementoMatched::getElemento).collect(Collectors.joining(", ")));
            sb.append(".\n");
        }

        if (!faltantes.isEmpty()) {
            sb.append("Elementos não verificados: ");
            sb.append(faltantes.stream().map(ElementoFaltante::getElemento).collect(Collectors.joining(", ")));
        }

        return sb.toString();
    }

    private List<CrimePossivel> verificarConcurso(List<CrimePossivel> crimes, EnquadramentoRequest request) {
        List<CrimePossivel> concurso = crimes.stream()
                .filter(c -> c.getProbabilidade() > 50)
                .collect(Collectors.toList());

        if (concurso.size() > 1) {
            for (CrimePossivel crime : concurso) {
                crime.setConcurso(true);
                crime.setTipoConcurso("IDEAL");
            }
        }

        return crimes;
    }

    private List<PassoExplicativo> gerarPassosExplicativos(EnquadramentoRequest request,
                                                             List<Artigo> artigos,
                                                             List<CrimePossivel> crimes) {
        List<PassoExplicativo> passos = new ArrayList<>();
        int ordem = 1;

        passos.add(PassoExplicativo.builder()
                .ordem(ordem++)
                .fase("ANALISE")
                .titulo("Análise da Descrição do Caso")
                .descricao("Descrição apresentada pelo utilizador")
                .detalhes(request.getDescricaoCaso())
                .success(true)
                .build());

        List<String> palavras = identificarPalavrasChave(request);
        passos.add(PassoExplicativo.builder()
                .ordem(ordem++)
                .fase("ANALISE")
                .titulo("Identificação de Palavras-Chave")
                .descricao("Elementos relevantes identificados no texto")
                .detalhes(String.join(", ", palavras))
                .success(true)
                .build());

        passos.add(PassoExplicativo.builder()
                .ordem(ordem++)
                .fase("COMPARACAO")
                .titulo("Busca de Artigos Aplicáveis")
                .descricao("Artigos do Código Penal que correspondem aos factos")
                .detalhes("Encontrados " + artigos.size() + " artigos potencialmente aplicáveis")
                .success(artigos.size() > 0)
                .build());

        String detalhesCriminos = crimes.stream()
                .map(c -> c.getArtigoNumero() + ": " + c.getElementosEncontrados().size() + " elementos")
                .collect(Collectors.joining("; "));

        passos.add(PassoExplicativo.builder()
                .ordem(ordem++)
                .fase("AVALIACAO")
                .titulo("Análise de Elementos do Crime")
                .descricao("Verificação dos elementos constitutivos do crime")
                .detalhes(detalhesCriminos)
                .success(crimes.stream().anyMatch(c -> !c.getElementosEncontrados().isEmpty()))
                .build());

        String conclusao = crimes.isEmpty() ? 
            "Não foi possível identificar um enquadramento penal" :
            "Identificado(s) " + crimes.size() + " crime(s) possível(is)";
        
        passos.add(PassoExplicativo.builder()
                .ordem(ordem)
                .fase("CONCLUSAO")
                .titulo("Resultado do Enquadramento")
                .descricao(conclusao)
                .success(!crimes.isEmpty())
                .build());

        return passos;
    }

    private Conclusao gerarConclusao(List<CrimePossivel> crimes, EnquadramentoRequest request) {
        if (crimes.isEmpty()) {
            return Conclusao.builder()
                    .recomendacao("Revise a descrição dos factos ou consulte um advogado")
                    .artigoMaisProximo("Nenhum")
                    .nivelConfianca("Baixo")
                    .requerAnaliseJuridica(true)
                    .build();
        }

        CrimePossivel crimePrincipal = crimes.get(0);
        
        String recomendacao;
        if (crimePrincipal.getProbabilidade() > 70) {
            recomendacao = "Alta probabilidade de enquadramento no artigo " + crimePrincipal.getArtigoNumero();
        } else if (crimePrincipal.getProbabilidade() > 50) {
            recomendacao = "Probabilidade média - requer análise jurídica detalhada";
        } else {
            recomendacao = "Baixa probabilidade - recomenda-se consulta jurídica";
        }

        return Conclusao.builder()
                .recomendacao(recomendacao)
                .artigoMaisProximo("Art. " + crimePrincipal.getArtigoNumero() + ".º")
                .nivelConfianca(crimePrincipal.getProbabilidade() > 70 ? "Alto" : 
                               crimePrincipal.getProbabilidade() > 50 ? "Médio" : "Baixo")
                .requerAnaliseJuridica(crimePrincipal.getProbabilidade() < 70)
                .build();
    }

    private MapaElementos gerarMapaElementos(EnquadramentoRequest request, List<Artigo> artigos) {
        Map<String, Boolean> obrigatorios = new HashMap<>();
        Map<String, Boolean> qualificadores = new HashMap<>();

        for (Artigo artigo : artigos) {
            try {
                List<ElementoJuridico> elementos = elementoJuridicoRepository
                        .findByArtigoIdOrderByOrdemAsc(artigo.getId());
                
                for (ElementoJuridico elem : elementos) {
                    if (elem.getTipo() == ElementoJuridico.TipoElemento.ACAO ||
                        elem.getTipo() == ElementoJuridico.TipoElemento.resultado) {
                        if (elem.getDescricao() != null) {
                            obrigatorios.put(elem.getDescricao(), false);
                        }
                    } else if (elem.getTipo() == ElementoJuridico.TipoElemento.QUALIFICADORA) {
                        if (elem.getDescricao() != null) {
                            qualificadores.put(elem.getDescricao(), false);
                        }
                    }
                }
            } catch (Exception e) {
                log.warn("Erro ao buscar elementos: {}", e.getMessage());
            }
        }

        List<String> palavras = identificarPalavrasChave(request);

        return MapaElementos.builder()
                .elementosObrigatorios(obrigatorios)
                .elementosQualificadores(qualificadores)
                .palavrasChaveIdentificadas(palavras)
                .build();
    }

    private List<String> gerarAdvertencias(List<CrimePossivel> crimes, EnquadramentoRequest request) {
        List<String> advertencias = new ArrayList<>();

        if (crimes.isEmpty()) {
            advertencias.add("Não foi possível identificar um crime específico com base nos factos descritos.");
        }

        if (crimes.stream().anyMatch(c -> c.getProbabilidade() < 50)) {
            advertencias.add("Alguns crimes identificados têm baixa probabilidade - recomenda-se análise por profissional.");
        }

        if (crimes.size() > 1 && crimes.stream().allMatch(CrimePossivel::getConcurso)) {
            advertencias.add("Possível concurso de crimes identificado - requer análise jurídica especializada.");
        }

        if (Boolean.TRUE.equals(request.getFlagrante())) {
            advertencias.add("Flagrante delito pode permitir prisão preventiva.");
        }

        return advertencias;
    }
}
