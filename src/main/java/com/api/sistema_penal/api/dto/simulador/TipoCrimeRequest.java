package com.api.sistema_penal.api.dto.simulador;

import com.api.sistema_penal.domain.entity.TipoCrime;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TipoCrimeRequest {

    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    private String nomePlural;

    private String descricao;

    private String codigoPenal;

    private TipoCrime.Categoria categoria;

    private UUID categoriaCrimeId;

    private List<UUID> artigoIds;

    private String palavrasChave;
}
