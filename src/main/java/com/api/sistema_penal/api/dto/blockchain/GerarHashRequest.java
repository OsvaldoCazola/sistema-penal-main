package com.api.sistema_penal.api.dto.blockchain;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GerarHashRequest {

    @NotBlank(message = "Conteúdo é obrigatório")
    @Size(max = 100000, message = "Conteúdo excede o tamanho máximo permitido (100KB)")
    private String conteudo;
}
