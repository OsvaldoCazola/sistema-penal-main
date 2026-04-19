package com.api.sistema_penal.api.dto.verificador;

import com.api.sistema_penal.domain.entity.Circunstancia;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

/**
 * Request para verificação de pena
 * Entrada: crime + circunstâncias → saída: pena calculada
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerificarPenaRequest {

    @NotNull(message = "O ID do artigo é obrigatório")
    private UUID artigoId;

    @NotNull(message = "O tipo de crime é obrigatório")
    private String tipoCrime;

    private List<UUID> circunstanciasIds;

    private Boolean flagrante;

    private Boolean reincidencia;

    private Boolean confissao;

    private Boolean reparacaoDano;

    private String observacoes;
}
