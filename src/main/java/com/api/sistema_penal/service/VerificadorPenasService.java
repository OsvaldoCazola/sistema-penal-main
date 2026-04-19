package com.api.sistema_penal.service;

import com.api.sistema_penal.api.dto.verificador.VerificarPenaRequest;
import com.api.sistema_penal.api.dto.verificador.VerificarPenaResponse;
import com.api.sistema_penal.api.dto.verificador.VerificarPenaResponse.*;
import com.api.sistema_penal.domain.entity.Artigo;
import com.api.sistema_penal.domain.entity.Circunstancia;
import com.api.sistema_penal.domain.entity.Penalidade;
import com.api.sistema_penal.domain.repository.ArtigoRepository;
import com.api.sistema_penal.domain.repository.CircunstanciaRepository;
import com.api.sistema_penal.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Serviço de Verificação de Penas
 * Calcula a pena com base no artigo, circunstâncias e fatores processuais
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class VerificadorPenasService {

    private final ArtigoRepository artigoRepository;
    private final CircunstanciaRepository circunstanciasRepository;

    public VerificarPenaResponse verificarPena(VerificarPenaRequest request) {
        // 1. Buscar artigo
        Artigo artigo = artigoRepository.findById(request.getArtigoId())
                .orElseThrow(() -> new ResourceNotFoundException("Artigo", request.getArtigoId()));

        // 2. Buscar circunstâncias
        List<Circunstancia> circunstancias = new ArrayList<>();
        if (request.getCircunstanciasIds() != null && !request.getCircunstanciasIds().isEmpty()) {
            circunstancias = circunstanciasRepository.findAllById(request.getCircunstanciasIds());
            
            // Verificar se todas as circunstâncias foram encontradas
            if (circunstancias.size() != request.getCircunstanciasIds().size()) {
                log.warn("Algumas circunstâncias não foram encontradas no banco de dados. " +
                        "Solicitadas: {}, Encontradas: {}", 
                        request.getCircunstanciasIds().size(), circunstancias.size());
            }
        }

        // 3. Calcular pena base
        PenaCalculada penaBase = calcularPenaBase(artigo);

        // 4. Aplicar ajustes
        List<AjustePena> ajustes = calcularAjustes(circunstancias, request, penaBase);

        // 5. Calcular pena final
        PenaCalculada penaFinal = calcularPenaFinal(penaBase, ajustes);

        // 6. Determinar regime
        String regime = determinarRegime(penaFinal);

        // 7. Gerar justificação
        List<PassoJustificativo> justificacao = gerarJustificacao(artigo, circunstancias, ajustes, request);

        // 8. Base legal
        BaseLegal baseLegal = gerarBaseLegal(artigo);

        return VerificarPenaResponse.builder()
                .id(UUID.randomUUID())
                .artigo(ArtigoInfo.builder()
                        .id(artigo.getId())
                        .numero(artigo.getNumero())
                        .titulo(artigo.getTitulo())
                        .tipoPenal(artigo.getTipoPenal())
                        .build())
                .penaBase(penaBase)
                .ajustes(ajustes)
                .penaFinal(penaFinal)
                .regimeRecomendado(regime)
                .justificacao(justificacao)
                .baseLegal(baseLegal)
                .houveFlagrante(request.getFlagrante() != null ? request.getFlagrante() : false)
                .houveReincidencia(request.getReincidencia() != null ? request.getReincidencia() : false)
                .dataVerificacao(LocalDateTime.now())
                .build();
    }

    private PenaCalculada calcularPenaBase(Artigo artigo) {
        Integer anos = artigo.getPenaMinAnos() != null ? artigo.getPenaMinAnos() : 0;
        Integer meses = 0;
        Integer dias = 0;

        // Se não tem pena de prisão definida, buscar nas penalidades
        if (anos == 0 && artigo.getPenalidades() != null && !artigo.getPenalidades().isEmpty()) {
            Penalidade p = artigo.getPenalidades().get(0);
            anos = p.getPenaMinAnos() != null ? p.getPenaMinAnos() : 0;
            meses = p.getPenaMinMeses() != null ? p.getPenaMinMeses() : 0;
            dias = p.getPenaMinDias() != null ? p.getPenaMinDias() : 0;
        }

        // Calcular média
        Integer anosMax = artigo.getPenaMaxAnos();
        if ((anosMax == null || anosMax == 0) && artigo.getPenalidades() != null && !artigo.getPenalidades().isEmpty()) {
            anosMax = artigo.getPenalidades().get(0).getPenaMaxAnos();
        }

        Integer anosMedia = (anos + (anosMax != null ? anosMax : anos)) / 2;

        return PenaCalculada.builder()
                .anos(anosMedia > 0 ? anosMedia : 0)
                .meses(meses)
                .dias(dias)
                .descricao(anosMedia > 0 ? "Pena de prisão" : "Pena não especificada")
                .build();
    }

    private List<AjustePena> calcularAjustes(List<Circunstancia> circunstancias, 
                                              VerificarPenaRequest request,
                                              PenaCalculada penaBase) {
        List<AjustePena> ajustes = new ArrayList<>();

        // Aplicar circunstâncias
        for (Circunstancia circ : circunstancias) {
            if (circ.getPercentualAlteracao() != null) {
                ajustes.add(AjustePena.builder()
                        .tipo(circ.getTipo().name())
                        .descricao(circ.getNome())
                        .percentual(circ.getPercentualAlteracao())
                        .baseLegal(circ.getBaseLegal())
                        .aplicado(true)
                        .build());
            }
        }

        // Flagrante - redução automática
        if (Boolean.TRUE.equals(request.getFlagrante())) {
            ajustes.add(AjustePena.builder()
                    .tipo("FLAGRANTE")
                    .descricao("Flagrante delito - redução de 1/6")
                    .percentual(-16)
                    .baseLegal("Art. 83.º do Código de Processo Penal")
                    .aplicado(true)
                    .build());
        }

        // Reincidência - aumento
        if (Boolean.TRUE.equals(request.getReincidencia())) {
            ajustes.add(AjustePena.builder()
                    .tipo("REINCIDENCIA")
                    .descricao("Reincidência - aumento de pena")
                    .percentual(25)
                    .baseLegal("Art. 75.º do Código Penal")
                    .aplicado(true)
                    .build());
        }

        // Confissão - atenuante
        if (Boolean.TRUE.equals(request.getConfissao())) {
            ajustes.add(AjustePena.builder()
                    .tipo("ATENUANTE")
                    .descricao("Confissão voluntária")
                    .percentual(-20)
                    .baseLegal("Art. 71.º, n.º 2, alínea c) do Código Penal")
                    .aplicado(true)
                    .build());
        }

        // Reparação do dano - atenuante
        if (Boolean.TRUE.equals(request.getReparacaoDano())) {
            ajustes.add(AjustePena.builder()
                    .tipo("ATENUANTE")
                    .descricao("Reparação integral do dano")
                    .percentual(-25)
                    .baseLegal("Art. 71.º, n.º 2, alínea d) do Código Penal")
                    .aplicado(true)
                    .build());
        }

        return ajustes;
    }

    private PenaCalculada calcularPenaFinal(PenaCalculada penaBase, List<AjustePena> ajustes) {
        int totalPercentual = ajustes.stream()
                .filter(AjustePena::getAplicado)
                .mapToInt(AjustePena::getPercentual)
                .sum();

        // Converter anos para dias para precisão
        int penaBaseDias = (penaBase.getAnos() * 365) + (penaBase.getMeses() * 30) + penaBase.getDias();
        
        // Aplicar percentual total (pode ser negativo ou positivo)
        int penaFinalDias = penaBaseDias + (penaBaseDias * totalPercentual / 100);
        
        // Garantir que a pena não seja negativa (mínimo de 0 dias)
        penaFinalDias = Math.max(0, penaFinalDias);

        // Converter de volta
        int anos = penaFinalDias / 365;
        int diasResto = penaFinalDias % 365;
        int meses = diasResto / 30;
        int dias = diasResto % 30;

        return PenaCalculada.builder()
                .anos(anos)
                .meses(meses)
                .dias(dias)
                .descricao("Pena de prisão definitiva")
                .build();
    }

    private String determinarRegime(PenaCalculada penaFinal) {
        if (penaFinal.getAnos() <= 2) {
            return "Pena suspensa ou alternativa";
        } else if (penaFinal.getAnos() <= 5) {
            return "Regime Semiaberto";
        } else {
            return "Regime Fechado";
        }
    }

    private List<PassoJustificativo> gerarJustificacao(Artigo artigo, List<Circunstancia> circunstancias,
                                                       List<AjustePena> ajustes, VerificarPenaRequest request) {
        List<PassoJustificativo> passos = new ArrayList<>();
        int ordem = 1;

        // Passo 1: Identificação do crime
        passos.add(PassoJustificativo.builder()
                .ordem(ordem++)
                .titulo("Identificação do Crime")
                .descricao("Artigo " + artigo.getNumero() + " - " + artigo.getTitulo())
                .artigoReferencia("Art. " + artigo.getNumero() + ".º")
                .favoravel(null)
                .build());

        // Passo 2: Determinação da pena base
        passos.add(PassoJustificativo.builder()
                .ordem(ordem++)
                .titulo("Pena Base")
                .descricao("Pena de prisão de " + artigo.getPenaMinAnos() + " a " + artigo.getPenaMaxAnos() + " anos")
                .artigoReferencia("Art. " + artigo.getNumero() + ".º")
                .favoravel(null)
                .build());

        // Passo 3: Circunstâncias
        for (Circunstancia circ : circunstancias) {
            passos.add(PassoJustificativo.builder()
                    .ordem(ordem++)
                    .titulo("Circunstância: " + circ.getTipo())
                    .descricao(circ.getNome() + " - " + circ.getDescricao())
                    .artigoReferencia(circ.getBaseLegal())
                    .favoravel(circ.getTipo() == Circunstancia.TipoCircunstancia.ATENUANTE || 
                              circ.getTipo() == Circunstancia.TipoCircunstancia.CAUSA_DE_DIMINUICAO)
                    .build());
        }

        // Passo 4: Fatores processuais
        if (Boolean.TRUE.equals(request.getFlagrante())) {
            passos.add(PassoJustificativo.builder()
                    .ordem(ordem++)
                    .titulo("Flagrante Delito")
                    .descricao("Redução de 1/6 da pena")
                    .artigoReferencia("Art. 83.º CPP")
                    .favoravel(true)
                    .build());
        }

        if (Boolean.TRUE.equals(request.getConfissao())) {
            passos.add(PassoJustificativo.builder()
                    .ordem(ordem++)
                    .titulo("Confissão")
                    .descricao("AtENUANTE de confissão voluntária")
                    .artigoReferencia("Art. 71.º CP")
                    .favoravel(true)
                    .build());
        }

        // Passo 5: Conclusão
        String conclusao = "Pena final calculada com base na pena base e nos ajustes aplicados.";
        passos.add(PassoJustificativo.builder()
                .ordem(ordem)
                .titulo("Conclusão")
                .descricao(conclusao)
                .artigoReferencia(null)
                .favoravel(null)
                .build());

        return passos;
    }

    private BaseLegal gerarBaseLegal(Artigo artigo) {
        // Artigos relevantes fixos based on typical penal code structure
        List<String> artigosRelevantes = new ArrayList<>();
        artigosRelevantes.add("Art. 71.º - Critérios de determinação da pena");
        artigosRelevantes.add("Art. 72.º - Penas acessórias");
        artigosRelevantes.add("Art. 73.º - Crimes continuados");
        
        // Adicionar artigos específicos baseados no tipo penal
        if (artigo.getTipoPenal() != null) {
            String tipo = artigo.getTipoPenal().toLowerCase();
            if (tipo.contains("homicídio") || tipo.contains("homicidio")) {
                artigosRelevantes.add("Art. 123.º a 127.º - Crimes contra a vida");
            } else if (tipo.contains("roubo") || tipo.contains("furto")) {
                artigosRelevantes.add("Art. 203.º a 218.º - Crimes contra o património");
            } else if (tipo.contains("lesão") || tipo.contains("lesao")) {
                artigosRelevantes.add("Art. 143.º a 148.º - Crimes contra a integridade física");
            } else if (tipo.contains("estelionato")) {
                artigosRelevantes.add("Art. 219.º a 232.º - Crimes económico-financeiros");
            }
        }
        
        // Adicionar artigo de reincidência e flagrante
        artigosRelevantes.add("Art. 75.º - Reincidência");
        artigosRelevantes.add("Art. 83.º - Flagrante delito");
        
        return BaseLegal.builder()
                .artigoPrincipal("Art. " + artigo.getNumero() + ".º do Código Penal" + (artigo.getTitulo() != null ? " - " + artigo.getTitulo() : ""))
                .artigoAgregador("Art. 70.º a 79.º do Código Penal (Determinação da Pena)")
                .artigosRelevantes(artigosRelevantes)
                .build();
    }
}
