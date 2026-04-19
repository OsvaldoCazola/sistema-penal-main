package com.api.sistema_penal.api.dto.simulador;

import com.api.sistema_penal.domain.entity.Circunstancia;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CircunstanciaRequest {

    @NotNull(message = "O tipo é obrigatório")
    private Circunstancia.TipoCircunstancia tipo;

    @NotNull(message = "O nome é obrigatório")
    private String nome;

    private String descricao;

    private Integer percentualAlteracao;

    private String baseLegal;

    private UUID artigoId;
}
