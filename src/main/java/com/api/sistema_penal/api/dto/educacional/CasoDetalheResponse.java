package com.api.sistema_penal.api.dto.educacional;

import java.util.List;

public record CasoDetalheResponse(
        Long id,
        String titulo,
        String descricaoFacto,
        Integer nivel,
        String categoria,
        String artigosRelacionados,
        boolean gabaritoDisponivel,
        String gabaritoExplicacao,
        List<PerguntaCasoResponse> perguntas
) {
}
