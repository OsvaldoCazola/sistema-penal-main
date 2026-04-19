package com.api.sistema_penal.api.dto.sentenca;

import com.api.sistema_penal.domain.entity.Sentenca;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

public record SentencaResponse(
        UUID id,
        String processoNumero,
        String tipoDecisao,
        String tipoCrimeNome,
        Integer penaMeses,
        String tipoPena,
        String regime,
        LocalDate dataSentenca,
        String ementa,
        String fundamentacao,
        String dispositivo,
        String narrativa,
        String juizNome,
        Map<String, Object> circunstancias,
        Boolean transitadoJulgado,
        LocalDateTime createdAt
) {
    public static SentencaResponse from(Sentenca s) {
        // Usa narrativa da sentença ou a descrição dos fatos do processo
        String narrativa = s.getNarrativa();
        if (narrativa == null || narrativa.isBlank()) {
            narrativa = s.getProcesso() != null ? s.getProcesso().getDescricaoFatos() : null;
        }
        return new SentencaResponse(
                s.getId(),
                s.getProcesso() != null ? s.getProcesso().getNumero() : null,
                s.getTipoDecisao().name(),
                s.getProcesso() != null ? s.getProcesso().getTipoCrime() : null,
                s.getPenaMeses(),
                s.getTipoPena(),
                s.getRegime(),
                s.getDataSentenca(),
                s.getEmenta(),
                s.getFundamentacao(),
                s.getDispositivo(),
                narrativa,
                s.getJuizNome(),
                s.getCircunstancias(),
                s.getTransitadoJulgado(),
                s.getCreatedAt()
        );
    }
}
