package com.api.sistema_penal.config;

import com.api.sistema_penal.domain.entity.Artigo;
import com.api.sistema_penal.domain.entity.Lei;
import com.api.sistema_penal.domain.entity.Lei.StatusLei;
import com.api.sistema_penal.domain.repository.ArtigoRepository;
import com.api.sistema_penal.domain.repository.LeiRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Inicializador de dados jurídicos de Angola.
 * Cria leis, códigos e legislação base para teste.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class LeiDataInitializer implements CommandLineRunner {

    private final LeiRepository leiRepository;
    private final ArtigoRepository artigoRepository;

    @Override
    public void run(String... args) {
        // Verificar se já existem leis
        if (leiRepository.count() > 0) {
            log.info("Leis já existem no banco de dados, ignorando...");
            return;
        }
        
        log.info("=== CRIANDO LEGISLAÇÃO DE ANGOLA ===");
        
        // Criar Constituição
        criarConstituicao();
        
        // Criar Código Penal
        criarCodigoPenal();
        
        // Criar Código de Processo Penal
        criarCodigoProcessoPenal();
        
        // Criar Decreto-Lei sobre Estatuto dos Magistrados
        criarDecretoEstatutoMagistrados();
        
        // Criar Lei Orgânica do Ministério Público
        criarLeiOrganicaMP();
        
        // Criar Lei sobre Organização dos Tribunais
        criarLeiOrganicaTribunais();
        
        log.info("=== LEGISLAÇÃO CRIADA COM SUCESSO ===");
    }

    private void criarConstituicao() {
        // Constituição de Angola 2010
        Lei constituicao = Lei.builder()
            .tipo("CONSTITUICAO")
            .numero("1/10")
            .ano(2010)
            .titulo("Constituição da República de Angola")
            .ementa("Estabelece os princípios fundamentais, os direitos e deveres fundamentais, a organização económica, financeira e fiscal, a organização do poder político e do poder local, a organização dos tribunais e do Ministério Público")
            .conteudo("A Constituição da República de Angola estabelece os princípios fundamentais do Estado angolano, incluindo a soberania, o Estado de direito democrático, os direitos fundamentais e a organização dos poderes públicos.")
            .dataPublicacao(java.time.LocalDate.of(2010, 1, 21))
            .status(StatusLei.VIGENTE)
            .build();
        
        constituicao = leiRepository.save(constituicao);
        
        // Artigos relevantes para direito penal
        criarArtigo(constituicao, "1", " Soberania", 
            "A soberania, una e indivisível, tem por fundamento o povo, compreende o objecto do poder político e dela dimana o poder do Estado, que é exercido em conformidade com a Constituição e as leis.");
            
        criarArtigo(constituicao, "2", " Estado de direito", 
            "A República de Angola é um Estado de direito baseado na soberania da Constituição, na legalidade e na democraticidade das normas jurídicas.");
            
        criarArtigo(constituicao, "18", " Princípios fundamentais", 
            "O Estado angolano respeito e garante os direitos, liberdades e garantias fundamentais dos cidadãos, nos termos da Constituição e da lei.");
            
        criarArtigo(constituicao, "29", " Garantias dos direitos", 
            "Todos têm direito de recorrer aos tribunais efectivos para a defesa dos seus direitos e interesses legítimos, podendo, em caso de necessidade, obter tutela jurisdicional célere e efectiva.");
            
        criarArtigo(constituicao, "30", " Universalidade e igualdade", 
            "Todos os cidadãos são iguais perante a Constituição e perante a lei e gozam dos mesmos direitos e estão sujeitos aos mesmos deveres.");
            
        criarArtigo(constituicao, "35", " Direito à liberdade", 
            "A todos é garantido o direito à liberdade, à segurança e à integridade física, moral e psíquica.");
            
        criarArtigo(constituicao, "47", " Função jurisdicional", 
            "A função jurisdicional é exercida pelos tribunais, que são órgãos de soberania com competência para administrar a justiça em nome do povo.");
            
        criarArtigo(constituicao, "51", " Ministério Público", 
            "O Ministério Público é órgão de soberania, com competência para defender a legalidade, os direitos dos cidadãos e o interesse público.");
            
        log.info("Constituição de Angola criada");
    }

    private void criarCodigoPenal() {
        // O Código Penal angolano
        Lei codigoPenal = Lei.builder()
            .tipo("CODIGO")
            .numero("s/n")
            .ano(1996)
            .titulo("Código Penal de Angola")
            .ementa("Estabelece os princípios fundamentais do direito penal, define os crimes e as penas")
            .conteudo("O Código Penal de Angola define os crimes contra pessoas, património, administração pública e Estado, bem como as respetivas penas.")
            .dataPublicacao(java.time.LocalDate.of(1996, 11, 22))
            .status(StatusLei.VIGENTE)
            .build();
        
        codigoPenal = leiRepository.save(codigoPenal);
        
        // Crimes contra pessoas
        criarArtigo(codigoPenal, "1", " Homicídio simples", 
            "Quem causar a morte de outrem é punido com prisão de 8 a 16 anos.");
            
        criarArtigo(codigoPenal, "2", " Homicídio qualificado", 
            "Se a morte for precedida de acto preparatório, tortura ou outro crime, a pena é prisão de 16 a 20 anos.");
            
        criarArtigo(codigoPenal, "3", " Homicídio privilegiado", 
            "Se o agente actuar em estado de perturbação da consciência, a pena é prisão de 1 a 5 anos.");
            
        criarArtigo(codigoPenal, "4", " Infanticídio", 
            "A mãe que, durante ou após o parto, e sob a influência do estado puerperal, matar o filho é punida com prisão de 1 a 5 anos.");
            
        criarArtigo(codigoPenal, "5", " Aborto", 
            "Quem causar ou facultar o abortamento de mulher grávida, sem o seu consentimento, é punido com prisão de 2 a 8 anos.");
            
        criarArtigo(codigoPenal, "6", " Aborto consentido", 
            "A mulher que consentir no abortamento é punida com prisão até 2 anos.");
            
        criarArtigo(codigoPenal, "7", " Ofensa à integridade física", 
            "Quem causar a outrem lesão à integridade física, à saúde ou à capacidade de trabalho, é punido com prisão até 3 anos.");
            
        criarArtigo(codigoPenal, "8", " Ofensa à integridade física qualificada", 
            "Se a ofensa resultar em doença incurável, deformidade permanente ou incapacidade permanente para o trabalho, a pena é prisão de 2 a 8 anos.");
            
        criarArtigo(codigoPenal, "9", " Maus tratos", 
            "Quem causar maus tratos a menor de 14 anos ou a pessoa incapaz de resistência, é punido com prisão de 1 a 5 anos.");
            
        criarArtigo(codigoPenal, "10", " Violação", 
            "Quem, com violência ou ameaça grave, constranger outra pessoa a ter relações sexuais, é punido com prisão de 3 a 10 anos.");
            
        // Crimes contra o património
        criarArtigo(codigoPenal, "11", " Furto", 
            "Quem subtrair coisa móvel alheia, com intenção de a apropriar, é punido com prisão até 3 anos.");
            
        criarArtigo(codigoPenal, "12", " Furto qualificado", 
            "Se o furto for de valor consideravelmente elevado ou em lugar sagrado, a pena é prisão de 2 a 8 anos.");
            
        criarArtigo(codigoPenal, "13", " Roubo", 
            "Quem, com violência ou ameaça de violência, constranger alguém a entregar coisa móvel, é punido com prisão de 3 a 10 anos.");
            
        criarArtigo(codigoPenal, "14", " Roubo qualificado", 
            "Se o roubo for cometido com arma ou por duas ou mais pessoas, a pena é prisão de 5 a 12 anos.");
            
        criarArtigo(codigoPenal, "15", " Extorsão", 
            "Quem, com violência ou ameaça de violência, obrigar alguém a entregar coisa móvel ou a criar obrigação, é punido com prisão de 2 a 8 anos.");
            
        criarArtigo(codigoPenal, "16", " Burla", 
            "Quem, com artifício ou astúcia, induzir outrem em erro, proporcionando-se enriquecimento, é punido com prisão até 3 anos.");
            
        criarArtigo(codigoPenal, "17", " Burla qualificada", 
            "Se a burla for de valor consideravelmente elevado, a pena é prisão de 2 a 8 anos.");
            
        criarArtigo(codigoPenal, "18", " Dano", 
            "Quem destruir, deteriorar ou inutilizar coisa móvel ou imóvel alheia, é punido com prisão até 2 anos.");
            
        // Crimes contra a administração pública
        criarArtigo(codigoPenal, "19", " Peculato", 
            "Funcionário público que, no exercício das suas funções, apropriar-se de dinheiro ou coisa móvel, é punido com prisão de 2 a 8 anos.");
            
        criarArtigo(codigoPenal, "20", " Corrupção passiva", 
            "Funcionário público que, para si ou terceiro, aceitar ou solicitar promessa de vantagem, é punido com prisão de 1 a 8 anos.");
            
        criarArtigo(codigoPenal, "21", " Corrupção ativa", 
            "Quem, por si ou por terceiro, der ou prometer vantagem a funcionário público, é punido com prisão até 3 anos.");
            
        criarArtigo(codigoPenal, "22", " Abuso de poder", 
            "Funcionário público que, fora dos casos previstos na lei, abuse dos seus poderes, é punido com prisão até 2 anos.");
            
        criarArtigo(codigoPenal, "23", " Denúncia caluniosa", 
            "Quem, por qualquer meio, formular contra pessoa determinada accusação que sabe falsa, é punido com prisão até 3 anos.");
            
        criarArtigo(codigoPenal, "24", " Falso testemunho", 
            "Quem, como testemunha, perito ou intérprete, mentir ou ocultar a verdade, é punido com prisão até 3 anos.");
            
        // Crimes contra o Estado
        criarArtigo(codigoPenal, "25", " Traição à Pátria", 
            "Quem, com цель de敌 a unidade nacional, atent contra a independência ou a integridade do território, é punido com prisão de 15 a 24 anos.");
            
        criarArtigo(codigoPenal, "26", " Rebelião", 
            "Quem se rebelar contra as autoridades públicas, usando de violência ou ameaça, é punido com prisão de 2 a 8 anos.");
            
        criarArtigo(codigoPenal, "27", " Organização criminosa", 
            "Quem promover ou fundar grupo, organização ou associação destinados a praticar crimes, é punido com prisão de 3 a 10 anos.");
            
        criarArtigo(codigoPenal, "28", " Terrorismo", 
            "Quem, com цель de恐怖 a população, cometer acto de natureza violenta, é punido com prisão de 8 a 20 anos.");
            
        log.info("Código Penal criado com 28 artigos");
    }

    private void criarCodigoProcessoPenal() {
        Lei cpp = Lei.builder()
            .tipo("CODIGO")
            .numero("s/n")
            .ano(2001)
            .titulo("Código de Processo Penal de Angola")
            .ementa("Estabelece as normas reguladoras do processo penal")
            .conteudo("O Código de Processo Penal de Angola estabelece os procedimentos para a investigação, instrução e julgamento de crimes.")
            .dataPublicacao(java.time.LocalDate.of(2001, 8, 31))
            .status(StatusLei.VIGENTE)
            .build();
        
        cpp = leiRepository.save(cpp);
        
        criarArtigo(cpp, "1", " Órgãos de justiça penal", 
            "São órgãos de justiça penal: o Ministério Público, a Polícia de Investigação Criminal, os tribunais.");
            
        criarArtigo(cpp, "2", " Ministério Público", 
            "Ao Ministério Público compete a direção da investigação criminal e o exercício da accusação.");
            
        criarArtigo(cpp, "3", " Competência do tribunal", 
            "O tribunal é competente para o julgamento dos processos penais, garantindo o contraditório e a defesa.");
            
        criarArtigo(cpp, "4", " Fase de instrução", 
            "A instrução prepara o julgamento, cabendo ao juiz de instrução assegurar os meios de prova.");
            
        criarArtigo(cpp, "5", " Fase de julgamento", 
            "O julgamento é público, oral e contraditório, com igualdade de armas entre accusação e defesa.");
            
        criarArtigo(cpp, "6", " Meios de prova", 
            "São meios de prova: a declaração do arguido, a prova testemunhal, a prova pericial, a prova documental e a prova tecnológica.");
            
        criarArtigo(cpp, "7", " Provas ilícitas", 
            "São nulas as provas obtidas mediante violação da lei ou dos direitos fundamentais.");
            
        criarArtigo(cpp, "8", " Presunção de inocência", 
            "Todo o arguido se presume inocente até ao trânsito em julgado da sentença de condenação.");
            
        criarArtigo(cpp, "9", " Direito de defesa", 
            "O arguido tem direito a constituir advogado ou a ser assistido por defensor oficioso.");
            
        criarArtigo(cpp, "10", " Medidas de coacção", 
            "As medidas de coacção visam assegurar a presença do arguido, a tranquilidade pública e a instrução.");
            
        criarArtigo(cpp, "11", " Captura", 
            "A captura é a detenção do arguido para comparência imediata ao tribunal.");
            
        criarArtigo(cpp, "12", " Prisão preventiva", 
            "A prisão preventiva é a medida de coacção mais grave, aplicável quando as outras se mostrem insuficientes.");
            
        criarArtigo(cpp, "13", " Liberdade condicional", 
            "A liberdade condicional pode ser concedida ao condenado que evidencie bom comportamento.");
            
        criarArtigo(cpp, "14", " Recursos", 
            "Das decisões judiciais cabem recursos para os tribunais superiores.");
            
        criarArtigo(cpp, "15", " Coisa julgada", 
            "Ninguém pode ser julgado duas vezes pelos mesmos factos (princípio ne bis in idem).");
            
        log.info("Código de Processo Penal criado com 15 artigos");
    }

    private void criarDecretoEstatutoMagistrados() {
        Lei decreto = Lei.builder()
            .tipo("DECRETO_LEI")
            .numero("1/94")
            .ano(1994)
            .titulo("Decreto-Lei nº 1/94 - Estatuto dos Magistrados Judiciais")
            .ementa("Aprova o Estatuto dos Magistrados Judiciais")
            .conteudo("O Decreto-Lei estabelece o estatuto dos magistrados judiciais em Angola.")
            .dataPublicacao(java.time.LocalDate.of(1994, 1, 15))
            .status(StatusLei.VIGENTE)
            .build();
        
        decreto = leiRepository.save(decreto);
        
        criarArtigo(decreto, "1", " Conceito de magistrado", 
            "São magistrados judiciais os juízes dos tribunais de primeira e segunda instância e do Supremo Tribunal.");
            
        criarArtigo(decreto, "2", " Inamovibilidade", 
            "Os juízes não podem ser transferidos, suspensos ou removidos sem o seu consentimento, salvo sentença.");
            
        criarArtigo(decreto, "3", " Independência", 
            "Os juízes são independentes no exercício das suas funções, apenas subordinados à Constituição e à lei.");
            
        criarArtigo(decreto, "4", " Imparcialidade", 
            "O juiz deve ser imparcial, não podendo intervir em processos em que tenha interesse pessoal.");
            
        criarArtigo(decreto, "5", " Regime de incompatibilidades", 
            "O exercício de funções jurisdicionais é incompatível com qualquer outra função pública ou privada.");
            
        log.info("Decreto-Lei do Estatuto dos Magistrados criado com 5 artigos");
    }

    private void criarLeiOrganicaMP() {
        Lei lei = Lei.builder()
            .tipo("LEI")
            .numero("2/94")
            .ano(1994)
            .titulo("Lei nº 2/94 - Lei Orgânica do Ministério Público")
            .ementa("Define a organização, competência e funcionamento do Ministério Público")
            .conteudo("A Lei Orgânica do Ministério Público define a organização, competência e funcionamento do Ministério Público em Angola.")
            .dataPublicacao(java.time.LocalDate.of(1994, 2, 10))
            .status(StatusLei.VIGENTE)
            .build();
        
        lei = leiRepository.save(lei);
        
        criarArtigo(lei, "1", " Definição", 
            "O Ministério Público é órgão de soberania, autónomo, com competência para defender a legalidade democrática.");
            
        criarArtigo(lei, "2", " Funções", 
            "Compete ao Ministério Público defender a legalidade, os direitos dos cidadãos e o interesse público.");
            
        criarArtigo(lei, "3", " Direção investigação", 
            "O Ministério Público dirige a investigação criminal, podendo delegar na Polícia.");
            
        criarArtigo(lei, "4", " Acusação", 
            "Compete ao Ministério Público, em regra, o exercício da accusação nos tribunais criminais.");
            
        criarArtigo(lei, "5", " Instrução", 
            "O Ministério Público pode promover a instrução dos processos, quando não haja juiz de instrução.");
            
        criarArtigo(lei, "6", " Intervenção cível", 
            "O Ministério Público pode intervir em processos civis, quando a lei o determinar.");
            
        criarArtigo(lei, "7", " Hierarquia", 
            "O Ministério Público observa a hierarquia, cabendo ao Procurador-Geral da República a direção.");
            
        criarArtigo(lei, "8", " Estatuto", 
            "Os membros do Ministério Público gozam de inamovibilidade e independência no exercício das funções.");
            
        log.info("Lei Orgânica do Ministério Público criada com 8 artigos");
    }

    private void criarLeiOrganicaTribunais() {
        Lei lei = Lei.builder()
            .tipo("LEI")
            .numero("23/92")
            .ano(1992)
            .titulo("Lei nº 23/92 - Lei de Organização e Funcionamento dos Tribunais")
            .ementa("Define a organização, competência e funcionamento dos tribunais em Angola")
            .conteudo("A Lei de Organização e Funcionamento dos Tribunais define a estrutura e competência dos tribunais em Angola.")
            .dataPublicacao(java.time.LocalDate.of(1992, 11, 17))
            .status(StatusLei.VIGENTE)
            .build();
        
        lei = leiRepository.save(lei);
        
        criarArtigo(lei, "1", " Sistema de tribunais", 
            "O sistema de tribunais compreende os tribunais judiciais, os tribunais administrativos e fiscais.");
            
        criarArtigo(lei, "2", " Tribunais judiciais", 
            "Os tribunais judiciais são: Supremo Tribunal, Tribunais Superiores de Apelação, Tribunais de Primeira Instância.");
            
        criarArtigo(lei, "3", " Supremo Tribunal", 
            "O Supremo Tribunal é o mais alto tribunal de justiça, com competência para uniformizar a jurisprudência.");
            
        criarArtigo(lei, "4", " Tribunais provinciais", 
            "As províncias têm tribunais provinciais de primeira instância.");
            
        criarArtigo(lei, "5", " Princípios do processo", 
            "O processo judicial rege-se pelos princípios da legalidade, igualdade, celeridade e economia processual.");
            
        criarArtigo(lei, "6", " Publicidade", 
            "As audiências são públicas, salvo quando a lei exigir ou permitir o contrário.");
            
        criarArtigo(lei, "7", " Contraditório", 
            "É garantido às partes o direito de atuar contraditoriamente no processo.");
            
        criarArtigo(lei, "8", " Motivação das decisões", 
            "As decisões judiciais são sempre fundamentadas.");
            
        criarArtigo(lei, "9", " Coisa julgada", 
            "As decisões judiciais transitadas em julgado são invioláveis.");
            
        criarArtigo(lei, "10", " Recursos", 
            "Das decisões judiciais cabe recurso, nos termos da lei.");
            
        log.info("Lei Orgânica dos Tribunais criada com 10 artigos");
    }

    private void criarArtigo(Lei lei, String numero, String titulo, String conteudo) {
        Artigo artigo = Artigo.builder()
            .numero(numero)
            .titulo(titulo)
            .conteudo(conteudo)
            .lei(lei)
            .build();
        
        artigoRepository.save(artigo);
    }
}
