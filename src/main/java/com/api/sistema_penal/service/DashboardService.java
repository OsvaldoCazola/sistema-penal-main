package com.api.sistema_penal.service;

import com.api.sistema_penal.api.dto.dashboard.CrimeEstatisticasResponse;
import com.api.sistema_penal.api.dto.dashboard.CrimeEstatisticasResponse.RegiaoStat;
import com.api.sistema_penal.api.dto.dashboard.CrimeEstatisticasResponse.TipoCrimeStat;
import com.api.sistema_penal.api.dto.dashboard.DashboardResponse;
import com.api.sistema_penal.api.dto.dashboard.DashboardResponse.ResumoGeral;
import com.api.sistema_penal.api.dto.dashboard.DashboardResponse.TendenciasResponse;
import com.api.sistema_penal.api.dto.dashboard.DashboardResponse.EstatisticasModulos;
import com.api.sistema_penal.domain.entity.AnalyticsReport;
import com.api.sistema_penal.domain.entity.Processo.StatusProcesso;
import com.api.sistema_penal.domain.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

    private final ProcessoRepository processoRepository;
    private final SentencaRepository sentencaRepository;
    private final UsuarioRepository usuarioRepository;
    private final LeiRepository leiRepository;
    private final ArtigoRepository artigoRepository;
    private final SimulacaoRegistroRepository simulacaoRegistroRepository;
    private final VerificacaoRegistroRepository verificacaoRegistroRepository;
    private final AnalyticsReportRepository analyticsReportRepository;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {
        return new DashboardResponse(
                getResumoGeral(),
                getProcessosPorStatus(),
                new HashMap<>(),
                new HashMap<>(),
                new HashMap<>(),
                getSentencasEstatisticas(),
                getTendencias(),
                getEstatisticasModulos()
        );
    }

    private ResumoGeral getResumoGeral() {
        return new ResumoGeral(
                processoRepository.count(),
                processoRepository.countByStatus(StatusProcesso.EM_ANDAMENTO),
                sentencaRepository.count(),
                0L,
                0L,
                usuarioRepository.count()
        );
    }

    private Map<String, Long> getProcessosPorStatus() {
        return processoRepository.countGroupByStatus().stream()
                .collect(Collectors.toMap(
                        arr -> ((StatusProcesso) arr[0]).name(),
                        arr -> (Long) arr[1],
                        (a, b) -> a,
                        LinkedHashMap::new
                ));
    }

    private Map<String, Object> getSentencasEstatisticas() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", sentencaRepository.count());
        return stats;
    }

    private TendenciasResponse getTendencias() {
        Map<String, Long> processosUltimos30Dias = new LinkedHashMap<>();
        
        java.time.LocalDate hoje = java.time.LocalDate.now();
        for (int i = 29; i >= 0; i--) {
            java.time.LocalDate data = hoje.minusDays(i);
            String dataStr = data.toString();
            processosUltimos30Dias.put(dataStr, 0L);
        }

        return new TendenciasResponse(processosUltimos30Dias, new LinkedHashMap<>());
    }

    private EstatisticasModulos getEstatisticasModulos() {
        Map<String, Long> crimesMaisSimulados = new LinkedHashMap<>();
        Map<String, Long> artigosMaisUsados = new LinkedHashMap<>();
        Map<String, Long> artigosMaisVerificados = new LinkedHashMap<>();

        try {
            // Crimes mais simulados
            var crimesList = simulacaoRegistroRepository.countGroupByTipoCrime();
            crimesList.stream().limit(5).forEach(arr -> 
                crimesMaisSimulados.put((String) arr[0], (Long) arr[1])
            );
        } catch (Exception e) {
            log.warn("Erro ao buscar crimes mais simulados: {}", e.getMessage());
        }

        try {
            // Artigos mais usados em simulações
            var artigosList = simulacaoRegistroRepository.countGroupByArtigo();
            artigosList.stream().limit(5).forEach(arr -> 
                artigosMaisUsados.put((String) arr[0], (Long) arr[1])
            );
        } catch (Exception e) {
            log.warn("Erro ao buscar artigos mais usados: {}", e.getMessage());
        }

        try {
            // Artigos mais verificados
            var verifList = verificacaoRegistroRepository.countGroupByArtigo();
            verifList.stream().limit(5).forEach(arr -> 
                artigosMaisVerificados.put((String) arr[0], (Long) arr[1])
            );
        } catch (Exception e) {
            log.warn("Erro ao buscar artigos mais verificados: {}", e.getMessage());
        }

        return new EstatisticasModulos(
                leiRepository.count(),
                artigoRepository.count(),
                simulacaoRegistroRepository.countTotal(),
                verificacaoRegistroRepository.countTotal(),
                usuarioRepository.count(),
                crimesMaisSimulados,
                artigosMaisUsados,
                artigosMaisVerificados,
                0L // alertasPenas
        );
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getEstatisticasTipoCrime() {
        Map<String, Object> stats = new HashMap<>();
        try {
            var tipoCrimeList = processoRepository.countGroupByTipoCrime();
            tipoCrimeList.forEach(arr -> 
                stats.put((String) arr[0], (Long) arr[1])
            );
        } catch (Exception e) {
            log.warn("Erro ao buscar tipos de crime: {}", e.getMessage());
        }
        return stats;
    }

    /**
     * Retorna atividades recentes (simulações e verificações)
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getAtividadesRecentes(int page, int size) {
        Map<String, Object> result = new HashMap<>();
        
        // Simulações recentes
        var simulacoes = simulacaoRegistroRepository.findAllByOrderByCreatedAtDesc(
                org.springframework.data.domain.PageRequest.of(page, size));
        result.put("simulacoes", simulacoes.getContent());
        result.put("totalSimulacoes", simulacoes.getTotalElements());
        
        // Verificações recentes
        var verificacoes = verificacaoRegistroRepository.findAllByOrderByCreatedAtDesc(
                org.springframework.data.domain.PageRequest.of(page, size));
        result.put("verificacoes", verificacoes.getContent());
        result.put("totalVerificacoes", verificacoes.getTotalElements());
        
        return result;
    }

    /**
     * Retorna alertas do sistema
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getAlertas() {
        Map<String, Object> alertas = new HashMap<>();
        
        // Verificar simulações sem artigo selecionado
        long simulacoesSemArtigo = 0;
        try {
            var resultado = simulacaoRegistroRepository.countGroupByResultado();
            for (var arr : resultado) {
                String resultadoStr = (String) arr[0];
                Long count = (Long) arr[1];
                if ("REQUER_ANALISE".equals(resultadoStr)) {
                    simulacoesSemArtigo = count;
                }
            }
        } catch (Exception e) {
            log.warn("Erro ao buscar alertas: {}", e.getMessage());
        }
        
        alertas.put("simulacoesRequeremAnalise", simulacoesSemArtigo);
        alertas.put("mensagem", simulacoesSemArtigo > 0 ? 
                "Existem " + simulacoesSemArtigo + " simulações que requerem análise jurídica" :
                "Sem alertas pendentes");
        
        return alertas;
    }

    /**
     * Retorna crimes mais frequentes
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getCrimesMaisFrequentes(int page, int size) {
        Map<String, Object> result = new HashMap<>();
        try {
            var crimes = processoRepository.countGroupByTipoCrime();
            result.put("crimes", crimes.stream().limit(size).map(arr -> 
                Map.of("tipo", arr[0], "quantidade", arr[1])
            ).collect(Collectors.toList()));
        } catch (Exception e) {
            log.warn("Erro ao buscar crimes mais frequentes: {}", e.getMessage());
            result.put("crimes", java.util.List.of());
        }
        return result;
    }

    /**
     * Retorna artigos mais aplicados
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getArtigosMaisAplicados(int page, int size) {
        Map<String, Object> result = new HashMap<>();
        try {
            var artigos = simulacaoRegistroRepository.countGroupByArtigo();
            result.put("artigos", artigos.stream().limit(size).map(arr -> 
                Map.of("numero", arr[0], "quantidade", arr[1])
            ).collect(Collectors.toList()));
        } catch (Exception e) {
            log.warn("Erro ao buscar artigos mais aplicados: {}", e.getMessage());
            result.put("artigos", java.util.List.of());
        }
        return result;
    }

    /**
     * Retorna tempo médio de julgamento
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getTempoMedioJulgamento() {
        Map<String, Object> result = new HashMap<>();
        try {
            var processosEncerrados = processoRepository.findAllClosed();
            if (!processosEncerrados.isEmpty()) {
                long totalDias = 0;
                int count = 0;
                for (var p : processosEncerrados) {
                    if (p.getDataAbertura() != null && p.getDataEncerramento() != null) {
                        totalDias += java.time.temporal.ChronoUnit.DAYS.between(
                                p.getDataAbertura(), p.getDataEncerramento());
                        count++;
                    }
                }
                double mediaDias = count > 0 ? (double) totalDias / count : 0;
                result.put("tempoMedioDias", Math.round(mediaDias));
                result.put("tempoMedioMeses", Math.round(mediaDias / 30.0));
                result.put("totalProcessosEncerrados", count);
            } else {
                result.put("tempoMedioDias", 0);
                result.put("tempoMedioMeses", 0);
                result.put("totalProcessosEncerrados", 0);
            }
        } catch (Exception e) {
            log.warn("Erro ao calcular tempo médio: {}", e.getMessage());
            result.put("tempoMedioDias", 0);
            result.put("tempoMedioMeses", 0);
            result.put("totalProcessosEncerrados", 0);
        }
        return result;
    }

    /**
     * Gera relatório analítico completo
     */
    @Transactional
    public AnalyticsReport generateFullReport(String reportName, String description) {
        // Serializar dados para JSON
        String dadosJson = "{}";
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            Map<String, Object> dados = new HashMap<>();
            dados.put("resumo", getResumoGeral());
            dados.put("processosPorStatus", getProcessosPorStatus());
            dados.put("estatisticasModulos", getEstatisticasModulos());
            dados.put("tempoMedio", getTempoMedioJulgamento());
            dadosJson = mapper.writeValueAsString(dados);
        } catch (Exception e) {
            log.warn("Erro ao serializar dados do relatório: {}", e.getMessage());
        }

        AnalyticsReport report = AnalyticsReport.builder()
                .reportName(reportName)
                .reportType("DASHBOARD_COMPLETO")
                .description(description)
                .data(dadosJson)
                .generatedAt(java.time.LocalDateTime.now())
                .build();
        
        return analyticsReportRepository.save(report);
    }

    /**
     * Retorna estatísticas completas de crimes para gráficos
     * Inclui crimes por região e crimes mais simulados
     */
    @Transactional(readOnly = true)
    public CrimeEstatisticasResponse getCrimeEstatisticas() {
        // Crimes por região
        List<RegiaoStat> crimesPorRegiao = new ArrayList<>();
        long totalProcessos = processoRepository.count();
        
        try {
            var regiaoList = processoRepository.countGroupByProvincia();
            for (var arr : regiaoList) {
                String regiao = (String) arr[0];
                Long quantidade = (Long) arr[1];
                double percentual = totalProcessos > 0 ? (quantidade * 100.0 / totalProcessos) : 0;
                crimesPorRegiao.add(RegiaoStat.builder()
                    .regiao(regiao != null ? regiao : "Não especificado")
                    .quantidade(quantidade)
                    .percentual(Math.round(percentual * 100.0) / 100.0)
                    .build());
            }
        } catch (Exception e) {
            log.warn("Erro ao buscar crimes por região: {}", e.getMessage());
        }

        // Crimes mais simulados
        List<TipoCrimeStat> crimesMaisSimulados = new ArrayList<>();
        long totalSimulacoes = simulacaoRegistroRepository.count();
        
        try {
            var simulacaoList = simulacaoRegistroRepository.countGroupByTipoCrime();
            for (var arr : simulacaoList) {
                String tipoCrime = (String) arr[0];
                Long quantidade = (Long) arr[1];
                double percentual = totalSimulacoes > 0 ? (quantidade * 100.0 / totalSimulacoes) : 0;
                crimesMaisSimulados.add(TipoCrimeStat.builder()
                    .tipoCrime(tipoCrime != null ? tipoCrime : "Não especificado")
                    .quantidade(quantidade)
                    .percentual(Math.round(percentual * 100.0) / 100.0)
                    .build());
            }
        } catch (Exception e) {
            log.warn("Erro ao buscar crimes mais simulados: {}", e.getMessage());
        }

        return CrimeEstatisticasResponse.builder()
            .crimesPorRegiao(crimesPorRegiao)
            .crimesMaisSimulados(crimesMaisSimulados)
            .totalCrimes(totalProcessos)
            .totalSimulacoes(totalSimulacoes)
            .build();
    }
}
