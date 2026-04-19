package com.api.sistema_penal.api.dto.coerencia;

import java.time.LocalDate;
import java.util.UUID;

public record DesvioResponse(
        UUID sentencaId,
        String processoNumero,
        String tipoCrime,
        String juizNome,
        LocalDate dataSentenca,
        Integer penaAplicadaMeses,
        Double penaEsperadaMeses,
        Double desvioPercentual,
        String tipoDesvio,
        String severidade,
        String possivelJustificativa
) {}
