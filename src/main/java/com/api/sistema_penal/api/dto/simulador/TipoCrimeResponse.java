package com.api.sistema_penal.api.dto.simulador;

import com.api.sistema_penal.domain.entity.TipoCrime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TipoCrimeResponse {

    private UUID id;
    private String nome;
    private String nomePlural;
    private String descricao;
    private String codigoPenal;
    private TipoCrime.Categoria categoria;
    private UUID categoriaCrimeId;
    private String categoriaCrimeNome;
    private List<UUID> artigoIds;
    private List<String> artigoNumeros;
    private String palavrasChave;
    private Boolean ativa;

    public static TipoCrimeResponse from(TipoCrime tipoCrime) {
        return TipoCrimeResponse.builder()
                .id(tipoCrime.getId())
                .nome(tipoCrime.getNome())
                .nomePlural(tipoCrime.getNomePlural())
                .descricao(tipoCrime.getDescricao())
                .codigoPenal(tipoCrime.getCodigoPenal())
                .categoria(tipoCrime.getCategoria())
                .categoriaCrimeId(tipoCrime.getCategoriaCrime() != null ? tipoCrime.getCategoriaCrime().getId() : null)
                .categoriaCrimeNome(tipoCrime.getCategoriaCrime() != null ? tipoCrime.getCategoriaCrime().getNome() : null)
                .artigoIds(tipoCrime.getArtigos() != null ? 
                    tipoCrime.getArtigos().stream().map(a -> a.getId()).collect(Collectors.toList()) : null)
                .artigoNumeros(tipoCrime.getArtigos() != null ? 
                    tipoCrime.getArtigos().stream().map(a -> a.getNumero()).collect(Collectors.toList()) : null)
                .palavrasChave(tipoCrime.getPalavrasChave())
                .ativa(tipoCrime.getAtiva())
                .build();
    }
}
