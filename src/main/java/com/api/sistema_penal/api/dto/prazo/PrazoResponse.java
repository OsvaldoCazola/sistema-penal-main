package com.api.sistema_penal.api.dto.prazo;

import com.api.sistema_penal.domain.entity.Prazo;
import com.api.sistema_penal.domain.entity.Prazo.StatusPrazo;
import com.api.sistema_penal.domain.entity.Prazo.TipoPrazo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrazoResponse {

    private UUID id;
    private String nome;
    private String descricao;
    private TipoPrazo tipo;
    private StatusPrazo status;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private Integer diasPrazo;
    private LocalDate dataConclusao;
    private Boolean notificado;
    private Boolean notificadoVencimento;
    private UUID processoId;
    private String processoNumero;
    private UUID criadoPorId;
    private String criadoPorNome;
    private String observacoes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PrazoResponse fromEntity(Prazo prazo) {
        return PrazoResponse.builder()
                .id(prazo.getId())
                .nome(prazo.getNome())
                .descricao(prazo.getDescricao())
                .tipo(prazo.getTipo())
                .status(prazo.getStatus())
                .dataInicio(prazo.getDataInicio())
                .dataFim(prazo.getDataFim())
                .diasPrazo(prazo.getDiasPrazo())
                .dataConclusao(prazo.getDataConclusao())
                .notificado(prazo.getNotificado())
                .notificadoVencimento(prazo.getNotificadoVencimento())
                .observacoes(prazo.getObservacoes())
                .createdAt(prazo.getCreatedAt())
                .updatedAt(prazo.getUpdatedAt())
                .build();
    }

    public void setProcessoInfo(UUID processoId, String processoNumero) {
        this.processoId = processoId;
        this.processoNumero = processoNumero;
    }

    public void setCriadoPorInfo(UUID criadoPorId, String criadoPorNome) {
        this.criadoPorId = criadoPorId;
        this.criadoPorNome = criadoPorNome;
    }
}
