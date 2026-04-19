package com.api.sistema_penal.api.dto.simulador;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * Request para o Simulador de Enquadramento Penal
 * Grande diferencial: análise de caso com explicabilidade completa
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnquadramentoRequest {

    @NotBlank(message = "A descrição do caso é obrigatória")
    private String descricaoCaso;

    @NotBlank(message = "O tipo de crime é obrigatório")
    private String tipoCrime;

    /**
     * Lista de fatos relevantes descritos pelo utilizador
     */
    private List<Fato> fatos;

    /**
     * Circunstâncias identificadas no caso
     */
    private List<String> circunstancias;

    /**
     * Elementos do crime verificados
     */
    private Map<String, Boolean> elementosVerificados;

    private Boolean flagrante;

    private String observacoes;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Fato {
        private String descricao;
        private String local;
        private String data;
        private List<String> participantes;
        private Boolean favoravel;
    }
}
