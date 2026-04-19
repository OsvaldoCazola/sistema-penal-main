package com.api.sistema_penal.api.dto.sentenca;

import com.api.sistema_penal.domain.entity.Sentenca.TipoDecisao;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

public record SentencaRequest(
        @NotNull(message = "ID do processo é obrigatório")
        UUID processoId,

        @NotNull(message = "Tipo de decisão é obrigatório")
        TipoDecisao tipoDecisao,

        Integer penaMeses,

        String tipoPena,

        String regime,

        @NotNull(message = "Data da sentença é obrigatória")
        LocalDate dataSentenca,

        String ementa,

        String fundamentacao,

        String dispositivo,

        String narrativa,

        String juizNome,

        Map<String, Object> circunstancias
) {}
