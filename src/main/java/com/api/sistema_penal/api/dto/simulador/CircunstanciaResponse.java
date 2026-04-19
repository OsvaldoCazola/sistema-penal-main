package com.api.sistema_penal.api.dto.simulador;

import com.api.sistema_penal.domain.entity.Circunstancia;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CircunstanciaResponse {

    private UUID id;
    private Circunstancia.TipoCircunstancia tipo;
    private String nome;
    private String descricao;
    private Integer percentualAlteracao;
    private String baseLegal;
    private UUID artigoId;
    private String artigoNumero;
    private Boolean ativa;

    public static CircunstanciaResponse from(Circunstancia circunstancia) {
        return CircunstanciaResponse.builder()
                .id(circunstancia.getId())
                .tipo(circunstancia.getTipo())
                .nome(circunstancia.getNome())
                .descricao(circunstancia.getDescricao())
                .percentualAlteracao(circunstancia.getPercentualAlteracao())
                .baseLegal(circunstancia.getBaseLegal())
                .artigoId(circunstancia.getArtigo() != null ? circunstancia.getArtigo().getId() : null)
                .artigoNumero(circunstancia.getArtigo() != null ? circunstancia.getArtigo().getNumero() : null)
                .ativa(circunstancia.getAtiva())
                .build();
    }
}
