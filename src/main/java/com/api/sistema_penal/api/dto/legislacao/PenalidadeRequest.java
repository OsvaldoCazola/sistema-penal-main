package com.api.sistema_penal.api.dto.legislacao;

import com.api.sistema_penal.domain.entity.Penalidade;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record PenalidadeRequest(
        @NotNull(message = "Tipo de pena é obrigatório")
        Penalidade.TipoPena tipoPena,

        Integer penaMinAnos,
        Integer penaMinMeses,
        Integer penaMinDias,
        Integer penaMaxAnos,
        Integer penaMaxMeses,
        Integer penaMaxDias,

        BigDecimal multaMin,
        BigDecimal multaMax,

        String descricao,
        String regime,
        Boolean flagrante,
        Boolean detencao,
        Boolean reclusao
) {}
