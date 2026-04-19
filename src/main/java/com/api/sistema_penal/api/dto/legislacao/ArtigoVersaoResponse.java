package com.api.sistema_penal.api.dto.legislacao;

import java.time.LocalDate;
import java.util.UUID;

public record ArtigoVersaoResponse(
        UUID id,
        UUID artigoId,
        Integer versao,
        String conteudo,
        LocalDate dataVigencia,
        LocalDate dataFimVigencia,
        String motivoAlteracao,
        String autorAlteracao
) {}
