package com.api.sistema_penal.api.dto.sentenca;

import com.api.sistema_penal.domain.entity.Sentenca;

import java.time.LocalDate;
import java.util.UUID;

public record SentencaSummaryResponse(
        UUID id,
        String processoNumero,
        String tipoDecisao,
        String tipoCrimeNome,
        Integer penaMeses,
        String regime,
        LocalDate dataSentenca,
        String narrativa,
        String juizNome,
        Boolean transitadoJulgado
) {
    public static SentencaSummaryResponse from(Sentenca s) {
        // Usa narrativa da sentença ou a descrição dos fatos do processo
        String narrativa = s.getNarrativa();
        if (narrativa == null || narrativa.isBlank()) {
            narrativa = s.getProcesso() != null ? s.getProcesso().getDescricaoFatos() : null;
        }
        return new SentencaSummaryResponse(
                s.getId(),
                s.getProcesso() != null ? s.getProcesso().getNumero() : null,
                s.getTipoDecisao().name(),
                s.getProcesso() != null ? s.getProcesso().getTipoCrime() : null,
                s.getPenaMeses(),
                s.getRegime(),
                s.getDataSentenca(),
                narrativa,
                s.getJuizNome(),
                s.getTransitadoJulgado()
        );
    }
}
