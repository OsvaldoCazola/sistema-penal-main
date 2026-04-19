package com.api.sistema_penal.service;

import com.api.sistema_penal.api.dto.processo.TimelineResponse;
import com.api.sistema_penal.api.dto.processo.TimelineResponse.EtapaTimeline;
import com.api.sistema_penal.api.dto.processo.TimelineResponse.EventoTimeline;
import com.api.sistema_penal.domain.entity.Movimentacao;
import com.api.sistema_penal.domain.entity.Processo;
import com.api.sistema_penal.domain.entity.Processo.StatusProcesso;
import com.api.sistema_penal.domain.repository.ProcessoRepository;
import com.api.sistema_penal.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TimelineService {

    private final ProcessoRepository processoRepository;

    private static final List<EtapaPadrao> ETAPAS_PADRAO = List.of(
            new EtapaPadrao(1, "DENUNCIA", "Denúncia", "Apresentação da denúncia pelo Ministério Público", 
                    Set.of("DENUNCIA", "QUEIXA", "AUTO_PRISAO", "INQUERITO")),
            new EtapaPadrao(2, "CITACAO", "Citação", "Citação do réu para apresentar defesa",
                    Set.of("CITACAO", "MANDADO_CITACAO", "CARTA_PRECATORIA")),
            new EtapaPadrao(3, "DEFESA", "Defesa Prévia", "Apresentação da defesa prévia pelo acusado",
                    Set.of("DEFESA", "DEFESA_PREVIA", "CONTESTACAO", "RESPOSTA_ACUSACAO")),
            new EtapaPadrao(4, "INSTRUCAO", "Instrução", "Fase de instrução processual com produção de provas",
                    Set.of("INSTRUCAO", "AUDIENCIA_INSTRUCAO", "PROVA", "PERICIA", "TESTEMUNHA", "DEPOIMENTO")),
            new EtapaPadrao(5, "ALEGACOES", "Alegações Finais", "Apresentação das alegações finais pelas partes",
                    Set.of("ALEGACOES", "ALEGACOES_FINAIS", "MEMORIAIS")),
            new EtapaPadrao(6, "JULGAMENTO", "Julgamento", "Fase de julgamento do processo",
                    Set.of("JULGAMENTO", "AUDIENCIA_JULGAMENTO", "SESSAO_JULGAMENTO", "PLENARIO")),
            new EtapaPadrao(7, "SENTENCA", "Sentença", "Prolação da sentença pelo juiz",
                    Set.of("SENTENCA", "DECISAO", "ACORDAO")),
            new EtapaPadrao(8, "RECURSO", "Recurso", "Fase recursal após a sentença",
                    Set.of("RECURSO", "APELACAO", "AGRAVO", "EMBARGOS", "RECURSO_ESPECIAL", "RECURSO_EXTRAORDINARIO")),
            new EtapaPadrao(9, "TRANSITO", "Trânsito em Julgado", "Trânsito em julgado da decisão",
                    Set.of("TRANSITO_JULGADO", "CERTIDAO_TRANSITO", "BAIXA"))
    );

    @Transactional(readOnly = true)
    public TimelineResponse gerarTimeline(UUID processoId) {
        Processo processo = processoRepository.findById(processoId)
                .orElseThrow(() -> new ResourceNotFoundException("Processo", processoId));

        List<Movimentacao> movimentacoes = processo.getMovimentacoes().stream()
                .sorted(Comparator.comparing(Movimentacao::getDataEvento))
                .toList();

        Map<String, List<Movimentacao>> movsPorEtapa = classificarMovimentacoes(movimentacoes);
        
        List<EtapaTimeline> etapas = new ArrayList<>();
        int etapaAtualIndex = 0;
        int etapasConcluidas = 0;

        for (EtapaPadrao ep : ETAPAS_PADRAO) {
            List<Movimentacao> movsEtapa = movsPorEtapa.getOrDefault(ep.codigo, Collections.emptyList());
            
            String statusEtapa = determinarStatusEtapa(movsEtapa, processo.getStatus(), ep.ordem);
            
            LocalDateTime dataInicio = movsEtapa.isEmpty() ? null : movsEtapa.get(0).getDataEvento();
            LocalDateTime dataConclusao = null;
            Integer duracaoDias = null;

            if ("CONCLUIDA".equals(statusEtapa) && !movsEtapa.isEmpty()) {
                dataConclusao = movsEtapa.get(movsEtapa.size() - 1).getDataEvento();
                if (dataInicio != null) {
                    duracaoDias = (int) ChronoUnit.DAYS.between(dataInicio, dataConclusao);
                }
                etapasConcluidas++;
            }

            if ("EM_ANDAMENTO".equals(statusEtapa)) {
                etapaAtualIndex = ep.ordem - 1;
            }

            List<EventoTimeline> eventos = movsEtapa.stream()
                    .map(m -> new EventoTimeline(
                            m.getId(),
                            m.getTipo(),
                            m.getDescricao(),
                            m.getDataEvento(),
                            m.getUsuario() != null ? m.getUsuario().getNome() : null
                    ))
                    .toList();

            etapas.add(new EtapaTimeline(
                    ep.ordem,
                    ep.codigo,
                    ep.nome,
                    ep.descricao,
                    statusEtapa,
                    dataInicio,
                    dataConclusao,
                    duracaoDias,
                    eventos
            ));
        }

        double percentualConcluido = (double) etapasConcluidas / ETAPAS_PADRAO.size() * 100;

        return new TimelineResponse(
                processo.getId(),
                processo.getNumero(),
                processo.getStatus().name(),
                etapas,
                etapaAtualIndex,
                Math.round(percentualConcluido * 100.0) / 100.0
        );
    }

    private Map<String, List<Movimentacao>> classificarMovimentacoes(List<Movimentacao> movimentacoes) {
        Map<String, List<Movimentacao>> resultado = new HashMap<>();
        
        for (Movimentacao mov : movimentacoes) {
            String tipoNormalizado = mov.getTipo().toUpperCase().replace(" ", "_");
            
            for (EtapaPadrao ep : ETAPAS_PADRAO) {
                if (ep.tiposMovimentacao.stream().anyMatch(t -> tipoNormalizado.contains(t))) {
                    resultado.computeIfAbsent(ep.codigo, k -> new ArrayList<>()).add(mov);
                    break;
                }
            }
        }
        
        return resultado;
    }

    private String determinarStatusEtapa(List<Movimentacao> movs, StatusProcesso statusProcesso, int ordemEtapa) {
        if (movs.isEmpty()) {
            if (statusProcesso == StatusProcesso.ARQUIVADO || statusProcesso == StatusProcesso.TRANSITADO_JULGADO) {
                return "NAO_APLICAVEL";
            }
            return "PENDENTE";
        }

        boolean temConclusao = movs.stream()
                .anyMatch(m -> m.getTipo().toUpperCase().contains("CONCLUS") || 
                              m.getTipo().toUpperCase().contains("ENCERR") ||
                              m.getTipo().toUpperCase().contains("FINALIZ"));

        if (temConclusao) {
            return "CONCLUIDA";
        }

        LocalDateTime ultimaMov = movs.get(movs.size() - 1).getDataEvento();
        if (ultimaMov.isAfter(LocalDateTime.now().minusDays(30))) {
            return "EM_ANDAMENTO";
        }

        return "CONCLUIDA";
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getEstatisticasTimeline(UUID processoId) {
        TimelineResponse timeline = gerarTimeline(processoId);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEtapas", ETAPAS_PADRAO.size());
        stats.put("etapasConcluidas", timeline.etapas().stream()
                .filter(e -> "CONCLUIDA".equals(e.status())).count());
        stats.put("etapasEmAndamento", timeline.etapas().stream()
                .filter(e -> "EM_ANDAMENTO".equals(e.status())).count());
        stats.put("percentualConcluido", timeline.percentualConcluido());
        
        int totalDias = timeline.etapas().stream()
                .filter(e -> e.duracaoDias() != null)
                .mapToInt(EtapaTimeline::duracaoDias)
                .sum();
        stats.put("duracaoTotalDias", totalDias);

        Optional<EtapaTimeline> etapaMaisLonga = timeline.etapas().stream()
                .filter(e -> e.duracaoDias() != null)
                .max(Comparator.comparing(EtapaTimeline::duracaoDias));
        etapaMaisLonga.ifPresent(e -> stats.put("etapaMaisLonga", Map.of(
                "nome", e.nome(),
                "dias", e.duracaoDias()
        )));

        return stats;
    }

    private record EtapaPadrao(int ordem, String codigo, String nome, String descricao, Set<String> tiposMovimentacao) {}
}
