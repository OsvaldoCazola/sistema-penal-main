package com.api.sistema_penal.service.relatorio;

import com.api.sistema_penal.api.dto.relatorio.RelatorioRequest;
import com.api.sistema_penal.domain.entity.Processo;
import com.api.sistema_penal.domain.entity.Prazo;
import com.api.sistema_penal.domain.entity.Prazo.StatusPrazo;
import com.api.sistema_penal.domain.entity.Processo.StatusProcesso;
import com.api.sistema_penal.domain.repository.ProcessoRepository;
import com.api.sistema_penal.domain.repository.PrazoRepository;
import com.api.sistema_penal.domain.repository.SentencaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RelatorioService {

    private final ProcessoRepository processoRepository;
    private final PrazoRepository prazoRepository;
    private final SentencaRepository sentencaRepository;
    private final PdfGeneratorService pdfGeneratorService;

    @Transactional(readOnly = true)
    public Map<String, Object> gerarEstatisticasGerais() {
        Map<String, Object> estatisticas = new HashMap<>();
        
        long totalProcessos = processoRepository.count();
        estatisticas.put("totalProcessos", totalProcessos);
        
        long processosEmAndamento = processoRepository.countByStatus(StatusProcesso.EM_ANDAMENTO);
        estatisticas.put("processosEmAndamento", processosEmAndamento);
        
        long processosEncerrados = processoRepository.countByStatus(StatusProcesso.TRANSITADO_JULGADO);
        estatisticas.put("processosEncerrados", processosEncerrados);
        
        long totalPrazos = prazoRepository.count();
        estatisticas.put("totalPrazos", totalPrazos);
        
        long prazosVencidos = prazoRepository.countByStatus(StatusPrazo.VENCIDO);
        estatisticas.put("prazosVencidos", prazosVencidos);
        
        long prazosAtivos = prazoRepository.countByStatus(StatusPrazo.ATIVO);
        estatisticas.put("prazosAtivos", prazosAtivos);
        
        List<Object[]> processosPorStatus = processoRepository.countGroupByStatus();
        Map<String, Long> porStatus = new HashMap<>();
        for (Object[] row : processosPorStatus) {
            porStatus.put(row[0].toString(), (Long) row[1]);
        }
        estatisticas.put("processosPorStatus", porStatus);
        
        List<Object[]> crimesPorTipo = processoRepository.countGroupByTipoCrime();
        estatisticas.put("crimesMaisFrequentes", crimesPorTipo);
        
        log.info("Estatísticas gerais geradas");
        return estatisticas;
    }

    @Transactional(readOnly = true)
    public byte[] gerarRelatorioProcessosPdf(LocalDate dataInicio, LocalDate dataFim, String provincia) {
        Page<Processo> processos = processoRepository.findByFilters(
                dataInicio, dataFim, provincia, null, Pageable.unpaged());
        
        String[] colunas = {"Número", "Tipo Crime", "Status", "Data Abertura", "Província"};
        Object[][] dados = processos.getContent().stream()
                .map(p -> new Object[]{
                        p.getNumero(),
                        p.getTipoCrime(),
                        p.getStatus().name(),
                        p.getDataAbertura() != null ? p.getDataAbertura().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "",
                        p.getProvincia()
                })
                .toArray(Object[][]::new);
        
        String periodo = (dataInicio != null || dataFim != null) ?
                (dataInicio != null ? dataInicio.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "") + " - " +
                (dataFim != null ? dataFim.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "") : "";
        
        return pdfGeneratorService.gerarRelatorioSimples("Relatório de Processos", colunas, dados);
    }

    @Transactional(readOnly = true)
    public byte[] gerarRelatorioPrazosPdf(LocalDate dataInicio, LocalDate dataFim) {
        List<Prazo> prazos;
        
        if (dataInicio != null && dataFim != null) {
            prazos = prazoRepository.findPrazosProximosVencimento(dataInicio, dataFim);
        } else {
            prazos = prazoRepository.findAll().stream().limit(100).collect(Collectors.toList());
        }
        
        String[] colunas = {"Nome", "Tipo", "Status", "Data Início", "Data Fim", "Processo"};
        Object[][] dados = prazos.stream()
                .map(p -> new Object[]{
                        p.getNome(),
                        p.getTipo().name(),
                        p.getStatus().name(),
                        p.getDataInicio() != null ? p.getDataInicio().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "",
                        p.getDataFim() != null ? p.getDataFim().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "",
                        p.getProcesso() != null ? p.getProcesso().getNumero() : ""
                })
                .toArray(Object[][]::new);
        
        String periodo = (dataInicio != null || dataFim != null) ?
                (dataInicio != null ? dataInicio.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "") + " - " +
                (dataFim != null ? dataFim.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "") : "Todos";
        
        return pdfGeneratorService.gerarRelatorioPrazos(colunas, dados, periodo);
    }

    @Transactional(readOnly = true)
    public String gerarRelatorioProcessosCsv(LocalDate dataInicio, LocalDate dataFim, String provincia) {
        Page<Processo> processos = processoRepository.findByFilters(
                dataInicio, dataFim, provincia, null, Pageable.unpaged());
        
        StringBuilder csv = new StringBuilder();
        csv.append("Número,Tipo Crime,Status,Data Abertura,Provínica,Data Fato,Local Fato\n");
        
        for (Processo p : processos.getContent()) {
            csv.append(String.format("%s,%s,%s,%s,%s,%s,%s\n",
                    p.getNumero(),
                    p.getTipoCrime() != null ? p.getTipoCrime() : "",
                    p.getStatus().name(),
                    p.getDataAbertura() != null ? p.getDataAbertura().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "",
                    p.getProvincia() != null ? p.getProvincia() : "",
                    p.getDataFato() != null ? p.getDataFato().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "",
                    p.getLocalFato() != null ? p.getLocalFato() : ""));
        }
        
        return csv.toString();
    }

    @Transactional(readOnly = true)
    public String gerarRelatorioPrazosCsv(LocalDate dataInicio, LocalDate dataFim) {
        List<Prazo> prazos;
        
        if (dataInicio != null && dataFim != null) {
            prazos = prazoRepository.findPrazosProximosVencimento(dataInicio, dataFim);
        } else {
            prazos = prazoRepository.findAll();
        }
        
        StringBuilder csv = new StringBuilder();
        csv.append("Nome,Tipo,Status,Data Início,Data Fim,Processo,Observações\n");
        
        for (Prazo p : prazos) {
            csv.append(String.format("%s,%s,%s,%s,%s,%s,%s\n",
                    p.getNome(),
                    p.getTipo().name(),
                    p.getStatus().name(),
                    p.getDataInicio() != null ? p.getDataInicio().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "",
                    p.getDataFim() != null ? p.getDataFim().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "",
                    p.getProcesso() != null ? p.getProcesso().getNumero() : "",
                    p.getObservacoes() != null ? p.getObservacoes().replace(",", ";") : ""));
        }
        
        return csv.toString();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> gerarEstatisticasPrazos() {
        Map<String, Object> estatisticas = new HashMap<>();
        
        long total = prazoRepository.count();
        estatisticas.put("totalPrazos", total);
        
        List<Object[]> porStatus = prazoRepository.countGroupByStatus();
        Map<String, Long> statusMap = new HashMap<>();
        for (Object[] row : porStatus) {
            statusMap.put(row[0].toString(), (Long) row[1]);
        }
        estatisticas.put("prazosPorStatus", statusMap);
        
        List<Object[]> porTipo = prazoRepository.countGroupByTipo();
        estatisticas.put("prazosPorTipo", porTipo);
        
        return estatisticas;
    }
}
