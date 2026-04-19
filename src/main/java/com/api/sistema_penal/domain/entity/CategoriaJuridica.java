package com.api.sistema_penal.domain.entity;

/**
 * Categorias jurídicas disponíveis no sistema
 * Usado para classificar leis, artigos e conhecimentos jurídicos
 */
public enum CategoriaJuridica {
    CRIMES_PESSOA("Pessoa", "Crimes contra a Pessoa"),
    CRIMES_PATRIMONIO("Património", "Crimes contra o Património"),
    CRIMES_HONRA("Honra", "Crimes contra a Honra"),
    CRIMES_FAMILIA("Família", "Crimes contra a Família"),
    CRIMES_SEXUAIS("Sexuais", "Crimes Sexuais"),
    CRIMES_SAUDE("Saúde", "Crimes contra a Saúde Pública"),
    CRIMES_ECONOMICOS("Económicos", "Crimes Económicos e Financeiros"),
    CRIMES_PUBLICOS("Públicos", "Crimes contra a Administração Pública"),
    CRIMES_COMUN("Perigo Comum", "Crimes de Perigo Comum"),
    CRIMES_ORGANIZADO("Organizado", "Criminalidade Organizada"),
    CRIMES_MILITARES("Militares", "Crimes Militares"),
    LEIS_PENAIS_ESPECIAIS("Especiais", "Leis Penais Especiais");

    private final String descricao;
    private final String nomeCompleto;

    CategoriaJuridica(String descricao, String nomeCompleto) {
        this.descricao = descricao;
        this.nomeCompleto = nomeCompleto;
    }

    public String getDescricao() {
        return descricao;
    }

    public String getNomeCompleto() {
        return nomeCompleto;
    }
}
