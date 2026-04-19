package com.api.sistema_penal.api.dto.prazo;

import com.api.sistema_penal.domain.entity.Prazo;
import com.api.sistema_penal.domain.entity.Prazo.StatusPrazo;
import com.api.sistema_penal.domain.entity.Prazo.TipoPrazo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class PrazoRequest {

    @NotBlank(message = "Nome é obrigatório")
    private String nome;

    private String descricao;

    @NotNull(message = "Tipo é obrigatório")
    private TipoPrazo tipo;

    private StatusPrazo status;

    @NotNull(message = "Data de início é obrigatória")
    private LocalDate dataInicio;

    @NotNull(message = "Data de fim é obrigatória")
    private LocalDate dataFim;

    private Integer diasPrazo;

    private UUID processoId;

    private String observacoes;
}
