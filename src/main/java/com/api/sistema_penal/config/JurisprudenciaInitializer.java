package com.api.sistema_penal.config;

import com.api.sistema_penal.domain.entity.Sentenca;
import com.api.sistema_penal.domain.entity.Sentenca.TipoDecisao;
import com.api.sistema_penal.domain.repository.SentencaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Inicializador de jurisprudencias e casos simulados para o sistema.
 * Estes casos sao usados pela IA para analise e simulacao de penas.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JurisprudenciaInitializer implements CommandLineRunner {

    private final SentencaRepository sentencaRepository;

    @Override
    public void run(String... args) {
        // Verificar se ja existem sentencas
        if (sentencaRepository.count() > 0) {
            log.info("Ja existem sentencas no banco de dados, ignorando...");
            return;
        }
        
        log.info("=== CRIANDO JURISPRUDENCIA E CASOS SIMULADOS ===");
        
        criarCasosJurisprudenciais();
        
        log.info("=== JURISPRUDENCIA CRIADA COM SUCESSO ===");
    }

    private void criarCasosJurisprudenciais() {
        
        // ========== CASO 1: ROUBO QUALIFICADO (Arma e Violencia) ==========
        Map<String, Object> circunstancias1 = new HashMap<>();
        circunstancias1.put("usoArma", true);
        circunstancias1.put("tipoArma", "arma de fogo");
        circunstancias1.put("violenciaFisica", true);
        circunstancias1.put("local", "via publica");
        circunstancias1.put("hora", "20h");
        circunstancias1.put("resistenciaVitima", true);
        circunstancias1.put("lesoesVitima", "leves");
        
        Map<String, Object> metadata1 = new HashMap<>();
        metadata1.put("crime", "Roubo");
        metadata1.put("factos", Arrays.asList("uso de arma", "violencia"));
        metadata1.put("agravantes", Arrays.asList("arma", "violencia", "via publica"));
        metadata1.put("atenuantes", new ArrayList<>());
        metadata1.put("penaMin", 8);
        metadata1.put("penaMax", 12);
        
        Sentenca caso1 = Sentenca.builder()
            .tipoDecisao(TipoDecisao.CONDENACAO)
            .penaMeses(120) // 10 anos
            .tipoPena("prisao efectiva")
            .regime("fechado")
            .dataSentenca(LocalDate.of(2024, 6, 15))
            .ementa("Caso de roubo qualificado pelo uso de arma de fogo e violencia fisica contra a vtima em via publica.")
            .fundamentacao("O tribunal considerou provados os factos, concluindo que o arguido agiu com dolo, "
                + "utilizando violencia e ameaca grave. O uso de arma de fogo e a agressao fisica aumentam a gravidade do crime, "
                + "devendo a pena ser fixada acima do mnimo legal.")
            .dispositivo("Condena o arguido na pena de 10 (dez) anos de prisao efectiva, sem suspensao.")
            .juizNome("Dr. Joao Manuel Silva")
            .circunstancias(circunstancias1)
            .metadata(metadata1)
            .transitadoJulgado(true)
            .build();
        
        sentencaRepository.save(caso1);
        log.info("Caso 1: Roubo qualificado com arma e violencia");
        
        
        // ========== CASO 2: ROUBO SIMPLES ==========
        Map<String, Object> circunstancias2 = new HashMap<>();
        circunstancias2.put("usoArma", false);
        circunstancias2.put("violenciaFisica", false);
        circunstancias2.put("ameacaVerbal", true);
        circunstancias2.put("local", "estabelecimento comercial");
        
        Map<String, Object> metadata2 = new HashMap<>();
        metadata2.put("crime", "Roubo");
        metadata2.put("factos", Arrays.asList("ameaca", "subtracao de bens"));
        metadata2.put("agravantes", Arrays.asList("estabelecimento comercial"));
        metadata2.put("atenuantes", Arrays.asList("primario"));
        metadata2.put("penaMin", 3);
        metadata2.put("penaMax", 10);
        
        Sentenca caso2 = Sentenca.builder()
            .tipoDecisao(TipoDecisao.CONDENACAO)
            .penaMeses(36) // 3 anos
            .tipoPena("prisao")
            .regime("semi-aberto")
            .dataSentenca(LocalDate.of(2023, 9, 20))
            .ementa("Caso de roubo simples com ameaca verbal em estabelecimento comercial.")
            .fundamentacao("O arguido, sem antecedentes criminais, ameaou a vtima verbalmente para entregar "
                + "os bens. No houve uso de arma nem violencia fisica.")
            .dispositivo("Condena o arguido na pena de 3 (tres) anos de prisao, com suspensao de 2 anos.")
            .juizNome("Dra. Maria Fernanda Santos")
            .circunstancias(circunstancias2)
            .metadata(metadata2)
            .transitadoJulgado(true)
            .build();
        
        sentencaRepository.save(caso2);
        log.info("Caso 2: Roubo simples");
        
        
        // ========== CASO 3: FURTO QUALIFICADO ==========
        Map<String, Object> circunstancias3 = new HashMap<>();
        circunstancias3.put("valorElevado", true);
        circunstancias3.put("local", "domicilio");
        circunstancias3.put("arrombamento", true);
        
        Map<String, Object> metadata3 = new HashMap<>();
        metadata3.put("crime", "Furto");
        metadata3.put("factos", Arrays.asList("arrombamento", "domicilio"));
        metadata3.put("agravantes", Arrays.asList("valor elevado", "domicilio"));
        metadata3.put("atenuantes", Arrays.asList("arrependimento"));
        metadata3.put("penaMin", 2);
        metadata3.put("penaMax", 8);
        
        Sentenca caso3 = Sentenca.builder()
            .tipoDecisao(TipoDecisao.CONDENACAO)
            .penaMeses(24) // 2 anos
            .tipoPena("prisao")
            .regime("aberto")
            .dataSentenca(LocalDate.of(2023, 11, 10))
            .ementa("Furto qualificado em domicilio com arrombamento.")
            .fundamentacao("O arguido invadiu a residncia da vtima, causando danos materiais.")
            .dispositivo("Condena o arguido na pena de 2 (dois) anos de prisao, suspensa.")
            .juizNome("Dr. Antonio Carlos Pinto")
            .circunstancias(circunstancias3)
            .metadata(metadata3)
            .transitadoJulgado(true)
            .build();
        
        sentencaRepository.save(caso3);
        log.info("Caso 3: Furto qualificado");
        
        
        // ========== CASO 4: HOMICIDIO SIMPLES ==========
        Map<String, Object> circunstancias4 = new HashMap<>();
        circunstancias4.put("meio", "agressao fisica");
        circunstancias4.put("motivo", "discussao");
        circunstancias4.put("circunstancia", "provocacao da vtima");
        
        Map<String, Object> metadata4 = new HashMap<>();
        metadata4.put("crime", "Homicidio");
        metadata4.put("factos", Arrays.asList("morte", "dolo"));
        metadata4.put("agravantes", new ArrayList<>());
        metadata4.put("atenuantes", Arrays.asList("estado emocional perturbado"));
        metadata4.put("penaMin", 8);
        metadata4.put("penaMax", 16);
        
        Sentenca caso4 = Sentenca.builder()
            .tipoDecisao(TipoDecisao.CONDENACAO)
            .penaMeses(96) // 8 anos
            .tipoPena("prisao efectiva")
            .regime("fechado")
            .dataSentenca(LocalDate.of(2024, 2, 28))
            .ementa("Homicidio simples por agressao fisica durante discussao.")
            .fundamentacao("O arguido actuou em estado de grande perturbacao, apos provocacao da vtima.")
            .dispositivo("Condena o arguido na pena de 8 (oito) anos de prisao.")
            .juizNome("Dr. Ricardo Jorge Mendes")
            .circunstancias(circunstancias4)
            .metadata(metadata4)
            .transitadoJulgado(true)
            .build();
        
        sentencaRepository.save(caso4);
        log.info("Caso 4: Homicidio simples");
        
        
        // ========== CASO 5: CORRUPCAO PASSIVA ==========
        Map<String, Object> circunstancias5 = new HashMap<>();
        circunstancias5.put("funcionarioPublico", true);
        circunstancias5.put("valor", 50000);
        circunstancias5.put("solicitacao", true);
        
        Map<String, Object> metadata5 = new HashMap<>();
        metadata5.put("crime", "Corrupcao passiva");
        metadata5.put("factos", Arrays.asList("solicitacao de vantagem", "funcionario publico"));
        metadata5.put("agravantes", Arrays.asList("valor elevado"));
        metadata5.put("atenuantes", Arrays.asList("colaboracao"));
        metadata5.put("penaMin", 1);
        metadata5.put("penaMax", 8);
        
        Sentenca caso5 = Sentenca.builder()
            .tipoDecisao(TipoDecisao.CONDENACAO)
            .penaMeses(48) // 4 anos
            .tipoPena("prisao")
            .regime("semi-aberto")
            .dataSentenca(LocalDate.of(2024, 1, 15))
            .ementa("Corrupcao passiva de funcionario público que solicitou vantagem indevida.")
            .fundamentacao("O funcionario público abusou das suas funcoes para solicitar vantagem.")
            .dispositivo("Condena o arguido na pena de 4 (quatro) anos de prisao, com suspensao de 2 anos.")
            .juizNome("Dra. Paula Cristina Oliveira")
            .circunstancias(circunstancias5)
            .metadata(metadata5)
            .transitadoJulgado(true)
            .build();
        
        sentencaRepository.save(caso5);
        log.info("Caso 5: Corrupcao passiva");
        
        
        // ========== CASO 6: VIOLACAO ==========
        Map<String, Object> circunstancias6 = new HashMap<>();
        circunstancias6.put("violencia", true);
        circunstancias6.put("ameaca", true);
        circunstancias6.put("relacao", "desconhecido");
        
        Map<String, Object> metadata6 = new HashMap<>();
        metadata6.put("crime", "Violacao");
        metadata6.put("factos", Arrays.asList("constrangimento", "violencia", "relacao sexual"));
        metadata6.put("agravantes", Arrays.asList("violencia", "ameaca"));
        metadata6.put("atenuantes", new ArrayList<>());
        metadata6.put("penaMin", 3);
        metadata6.put("penaMax", 10);
        
        Sentenca caso6 = Sentenca.builder()
            .tipoDecisao(TipoDecisao.CONDENACAO)
            .penaMeses(84) // 7 anos
            .tipoPena("prisao efectiva")
            .regime("fechado")
            .dataSentenca(LocalDate.of(2024, 4, 22))
            .ementa("Violacao cometida com uso de violencia e ameaca.")
            .fundamentacao("O arguido forcou a vtima a relacoes sexuais mediante violencia fisica e ameacas.")
            .dispositivo("Condena o arguido na pena de 7 (sete) anos de prisao efectiva.")
            .juizNome("Dr. Fernando Augusto Silva")
            .circunstancias(circunstancias6)
            .metadata(metadata6)
            .transitadoJulgado(true)
            .build();
        
        sentencaRepository.save(caso6);
        log.info("Caso 6: Violacao");
        
        
        // ========== CASO 7: TRAFICO DE ESTUPEFACIENTES ==========
        Map<String, Object> circunstancias7 = new HashMap<>();
        circunstancias7.put("tipoDroga", "cannabis");
        circunstancias7.put("quantidade", "2 kg");
        circunstancias7.put("venda", true);
        
        Map<String, Object> metadata7 = new HashMap<>();
        metadata7.put("crime", "Trafico de estupefacientes");
        metadata7.put("factos", Arrays.asList("posse", "venda", "droga"));
        metadata7.put("agravantes", Arrays.asList("quantidade"));
        metadata7.put("atenuantes", Arrays.asList("primario"));
        metadata7.put("penaMin", 5);
        metadata7.put("penaMax", 12);
        
        Sentenca caso7 = Sentenca.builder()
            .tipoDecisao(TipoDecisao.CONDENACAO)
            .penaMeses(60) // 5 anos
            .tipoPena("prisao efectiva")
            .regime("fechado")
            .dataSentenca(LocalDate.of(2023, 8, 5))
            .ementa("Trafico de cannabis com venda comprovada.")
            .fundamentacao("O arguido comercializava droga na via publica.")
            .dispositivo("Condena o arguido na pena de 5 (cinco) anos de prisao efectiva.")
            .juizNome("Dr. Miguel Angelo Rodrigues")
            .circunstancias(circunstancias7)
            .metadata(metadata7)
            .transitadoJulgado(true)
            .build();
        
        sentencaRepository.save(caso7);
        log.info("Caso 7: Trafico de estupefacientes");
        
        
        // ========== CASO 8: ABSOLVICAO - LEGITIMA DEFESA ==========
        Map<String, Object> circunstancias8 = new HashMap<>();
        circunstancias8.put("legitimaDefesa", true);
        circunstancias8.put("agressaoAtual", true);
        circunstancias8.put("proporcionalidade", true);
        
        Map<String, Object> metadata8 = new HashMap<>();
        metadata8.put("crime", "Ofensa a integridade fisica");
        metadata8.put("factos", Arrays.asList("agressao"));
        metadata8.put("agravantes", new ArrayList<>());
        metadata8.put("atenuantes", Arrays.asList("legitima defesa"));
        metadata8.put("penaMin", 0);
        metadata8.put("penaMax", 0);
        
        Sentenca caso8 = Sentenca.builder()
            .tipoDecisao(TipoDecisao.ABSOLVICAO)
            .penaMeses(0)
            .tipoPena("absolvicao")
            .dataSentenca(LocalDate.of(2023, 7, 12))
            .ementa("Absolvicao por legitima defesa.")
            .fundamentacao("O arguido actuou em legitima defesa propria, repelindo agressao actual e proporcional.")
            .dispositivo("Absolve o arguido de todos os crimes de que vem pronunciado.")
            .juizNome("Dra. Isabel Maria Costa")
            .circunstancias(circunstancias8)
            .metadata(metadata8)
            .transitadoJulgado(true)
            .build();
        
        sentencaRepository.save(caso8);
        log.info("Caso 8: Absolvicao - Legitima defesa");
        
        
        // ========== CASO 9: TENTATIVA DE ROUBO ==========
        Map<String, Object> circunstancias9 = new HashMap<>();
        circunstancias9.put("tentativa", true);
        circunstancias9.put("arma", false);
        circunstancias9.put("interrupcao", "policia");
        
        Map<String, Object> metadata9 = new HashMap<>();
        metadata9.put("crime", "Roubo (tentativa)");
        metadata9.put("factos", Arrays.asList("tentativa", "subtracao"));
        metadata9.put("agravantes", new ArrayList<>());
        metadata9.put("atenuantes", Arrays.asList("tentativa", "primario"));
        metadata9.put("penaMin", 1);
        metadata9.put("penaMax", 5);
        
        Sentenca caso9 = Sentenca.builder()
            .tipoDecisao(TipoDecisao.CONDENACAO)
            .penaMeses(18) // 1 ano e meio
            .tipoPena("prisao")
            .regime("aberto")
            .dataSentenca(LocalDate.of(2024, 3, 8))
            .ementa("Tentativa de roubo sem uso de arma, interrompida pela policia.")
            .fundamentacao("O arguido tentou roubar a vtima, mas foi interceptado antes de conseguir subtrair os bens.")
            .dispositivo("Condena o arguido na pena de 1 ano e 6 meses de prisao, suspensa.")
            .juizNome("Dr. Carlos Eduardo Santos")
            .circunstancias(circunstancias9)
            .metadata(metadata9)
            .transitadoJulgado(true)
            .build();
        
        sentencaRepository.save(caso9);
        log.info("Caso 9: Tentativa de roubo");
        
        
        // ========== CASO 10: PECULATO ==========
        Map<String, Object> circunstancias10 = new HashMap<>();
        circunstancias10.put("funcionarioPublico", true);
        circunstancias10.put("apropriacao", true);
        circunstancias10.put("valor", 100000);
        
        Map<String, Object> metadata10 = new HashMap<>();
        metadata10.put("crime", "Peculato");
        metadata10.put("factos", Arrays.asList("apropriaçao indevida", "funcionario público"));
        metadata10.put("agravantes", Arrays.asList("valor elevado"));
        metadata10.put("atenuantes", Arrays.asList("reparacao"));
        metadata10.put("penaMin", 2);
        metadata10.put("penaMax", 8);
        
        Sentenca caso10 = Sentenca.builder()
            .tipoDecisao(TipoDecisao.CONDENACAO)
            .penaMeses(36) // 3 anos
            .tipoPena("prisao")
            .regime("semi-aberto")
            .dataSentenca(LocalDate.of(2024, 5, 30))
            .ementa("Peculato de funcionario público que se apropriou de fundos públicos.")
            .fundamentacao("O arguido, funcionario público, apropriou-se de valores que lhe foram confiados.")
            .dispositivo("Condena o arguido na pena de 3 (tres) anos de prisao, com substituicao por trabalho.")
            .juizNome("Dr. Jorge Manuel Ferreira")
            .circunstancias(circunstancias10)
            .metadata(metadata10)
            .transitadoJulgado(true)
            .build();
        
        sentencaRepository.save(caso10);
        log.info("Caso 10: Peculato");
        
        log.info("Total de casos jurisprudenciais criados: {}", sentencaRepository.count());
    }
}
