package com.api.sistema_penal.api.dto.relatorio;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RelatorioRequest {

    private TipoRelatorio tipo;
    
    private LocalDateTime dataInicio;
    
    private LocalDateTime dataFim;
    
    private String provincia;
    
    private UUID processoId;
    
    private FormatoExportacao formato;

    public enum TipoRelatorio {
        PROCESSOS,
        PENAS,
        JURISPRUDENCIA,
        ESTATISTICAS_GERAIS,
        PRAZOS,
        MOVIMENTACOES
    }

    public enum FormatoExportacao {
        PDF,
        CSV,
        JSON,
        EXCEL
    }
}
