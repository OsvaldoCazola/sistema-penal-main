package com.api.sistema_penal.api.dto.legislacao;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record ComparacaoArtigoResponse(
        UUID artigoId,
        String numeroArtigo,
        String leiIdentificacao,
        VersaoDetalhe versaoAntiga,
        VersaoDetalhe versaoNova,
        List<DiferencaTexto> diferencas,
        String resumoAlteracoes
) {
    public record VersaoDetalhe(
            Integer versao,
            String conteudo,
            LocalDate dataVigencia,
            String motivoAlteracao
    ) {}

    public record DiferencaTexto(
            String tipo,
            String textoAntigo,
            String textoNovo,
            int linhaInicio,
            int linhaFim
    ) {}
}
