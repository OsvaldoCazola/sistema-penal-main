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

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

/**
 * Inicializador da Constituição de Angola de 2021 (Lei n.º 18/21).
 * Esta é a primeira revisão constitucional de Angola.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class CONSTITUICAO2021Initializer implements CommandLineRunner {

    private final LeiRepository leiRepository;
    private final ArtigoRepository artigoRepository;

    @Override
    public void run(String... args) {
        // Verificar se já existe a Constituição 2021
        if (leiRepository.findByTipoAndNumeroAndAno("CONSTITUICAO", "18/21", 2021).isPresent()) {
            log.info("Constituição de Angola 2021 (Lei n.º 18/21) já existe no banco de dados, ignorando...");
            return;
        }
        
        log.info("=== CRIANDO CONSTITUIÇÃO DE ANGOLA 2021 (LEI N.º 18/21) ===");
        
        criarConstituicao2021();
        
        log.info("=== CONSTITUIÇÃO 2021 CRIADA COM SUCESSO ===");
    }

    private void criarConstituicao2021() {
        // Constituição de Angola 2021 - Lei de Revisão Constitucional n.º 18/21
        Lei constituicao = Lei.builder()
            .tipo("CONSTITUICAO")
            .numero("18/21")
            .ano(2021)
            .titulo("Constituição da República de Angola - Primeira Revisão/2021")
            .ementa("Lei de Revisão Constitucional - Primeira Revisão/2021. Altera artigos da Constituição de 2010, "
                    + "revoga dispositivos e adita novos artigos.")
            .conteudo("A Constituição da República de Angola, revista em 2021 pela Lei n.º 18/21 de 16 de Agosto, "
                    + "estabelece os princípios fundamentais do Estado angolano, incluindo soberania, Estado de direito democrático, "
                    + "direitos fundamentais, organização dos poderes públicos e poder local. Esta revisão strengtheninga "
                    + "a democracia, os direitos fundamentais e a autonomia local.")
            .dataPublicacao(LocalDate.of(2021, 8, 16))
            .dataVigencia(LocalDate.of(2021, 8, 16))
            .status(StatusLei.VIGENTE)
            .fonteUrl("https://www.gov.ao/governo/assembleia-nacional/lei-18-21")
            .build();
        
        constituicao = leiRepository.save(constituicao);
        
        log.info("Criando artigos da Constituição 2021...");
        
        // ========== TÍTULO I - PRINCÍPIOS FUNDAMENTAIS ==========
        criarArtigo(constituicao, "1", "República de Angola", 
            "Angola é uma República soberana e independente, baseada na dignidade da pessoa humana e na vontade do povo angolano, "
            + "que tem como objectivo fundamental a construção de uma sociedade livre, justa, democrática, solidária, de paz, igualdade e progresso social.");
        
        criarArtigo(constituicao, "2", "Estado Democrático de Direito",
            "A República de Angola é um Estado Democrático de Direito que tem como fundamentos a soberania popular, o primado da Constituição "
            + "e da lei, a separação de poderes e interdependência de funções, a unidade nacional, o pluralismo de expressão e de organização política "
            + "e a democracia representativa e participativa.");
        
        criarArtigo(constituicao, "3", "Soberania",
            "A soberania, una e indivisível, pertence ao povo, que a exerce através do sufrágio universal, livre, igual, directo, secreto e periódico, "
            + "do referendo e das demais formas estabelecidas pela Constituição.");
        
        criarArtigo(constituicao, "4", "Exercício do poder político",
            "O poder político é exercido por quem obtenha legitimidade mediante processo eleitoral livre e democraticamente exercido, nos termos da Constituição e da lei.");
        
        criarArtigo(constituicao, "5", "Organização do território",
            "O território da República de Angola é o historicamente definido pelos limites geográficos de Angola, tais como existentes a 11 de Novembro de 1975.");
        
        criarArtigo(constituicao, "6", "Supremacia da Constituição e Legalidade",
            "A Constituição é a Lei Suprema da República de Angola. O Estado subordina-se à Constituição e funda-se na legalidade.");
        
        criarArtigo(constituicao, "8", "Estado unitário",
            "A República de Angola é um Estado unitário que respeita, na sua organização, os princípios da autonomia dos Órgãos do Poder Local "
            + "e da desconcentração e descentralização administrativas.");
        
        criarArtigo(constituicao, "9", "Nacionalidade",
            "A nacionalidade angolana pode ser originária ou adquirida. É cidadão angolano de origem o filho de pai ou de mãe de nacionalidade angolana.");
        
        criarArtigo(constituicao, "10", "Estado laico",
            "A República de Angola é um Estado laico, havendo separação entre o Estado e as igrejas, nos termos da lei.");
        
        criarArtigo(constituicao, "11", "Paz e segurança nacional",
            "A República de Angola é uma Nação de vocação para a paz e o progresso, sendo um dever do Estado e um direito e responsabilidade de todos garantir a paz e a segurança nacional.");
        
        criarArtigo(constituicao, "12", "Relações internacionais",
            "A República de Angola respeita e aplica os princípios da Carta das Nações Unidas e da Carta da União Africana.");
        
        criarArtigo(constituicao, "13", "Direito internacional",
            "O direito internacional geral ou comum, recebido nos termos da presente Constituição, faz parte integrante da ordem jurídica angolana.");
        
        criarArtigo(constituicao, "14", "Propriedade privada e livre iniciativa",
            "O Estado respeita e protege a propriedade privada das pessoas singulares e colectivas, promove a livre iniciativa económica e empresarial.");
        
        criarArtigo(constituicao, "15", "Terra",
            "A terra, que constitui propriedade originária do Estado, pode ser transmitida para pessoas singulares ou colectivas.");
        
        criarArtigo(constituicao, "16", "Recursos naturais",
            "Os recursos naturais existentes no solo, subsolo, no mar territorial, na zona económica exclusiva e na plataforma continental são propriedade do Estado.");
        
        criarArtigo(constituicao, "17", "Partidos políticos",
            "Os partidos políticos concorrem, em torno de um projecto de sociedade e de programa político, para a organização e para a expressão da vontade dos cidadãos.");
        
        criarArtigo(constituicao, "18", "Símbolos nacionais",
            "São símbolos nacionais da República de Angola a Bandeira Nacional, a Insígnia Nacional e o Hino Nacional.");
        
        criarArtigo(constituicao, "19", "Línguas",
            "A língua oficial da República de Angola é o português. O Estado valoriza e promove o estudo, o ensino e a utilização das demais línguas de Angola.");
        
        criarArtigo(constituicao, "20", "Capital da República de Angola",
            "A capital da República de Angola é Luanda.");
        
        criarArtigo(constituicao, "21", "Tarefas fundamentais do Estado",
            "Constituem tarefas fundamentais do Estado Angolano: garantir a independência nacional, assegurar os direitos, liberdade e garantias fundamentais, "
            + "promover o bem-estar, a solidariedade social, a erradicação da pobreza, a promoção da igualdade de direitos.");
        
        // ========== TÍTULO II - DIREITOS E DEVERES FUNDAMENTAIS ==========
        
        // CAPÍTULO I - PRINCÍPIOS GERAIS
        criarArtigo(constituicao, "22", "Princípio da Universalidade",
            "Todos gozam dos direitos, das liberdades e das garantias constitucionalmente consagrados e estão sujeitos aos deveres estabelecidos na Constituição e na lei.");
        
        criarArtigo(constituicao, "23", "Princípio da Igualdade",
            "Todos são iguais perante a Constituição e a lei. Ninguém pode ser prejudicado, privilegiado, privado de qualquer direito ou isento de qualquer dever em razão da sua ascendência, sexo, raça, etnia, cor, deficiência, língua, local de nascimento, religião, convicções políticas, ideológica ou filosóficas, grau de instrução, condição económica ou social ou profissão.");
        
        criarArtigo(constituicao, "24", "Maioridade",
            "A maioridade é adquirida aos 18 anos.");
        
        criarArtigo(constituicao, "25", "Estrangeiros e apátridas",
            "Os estrangeiros e apátridas gozam dos direitos, liberdade e garantias fundamentais, bem como da protecção do Estado.");
        
        criarArtigo(constituicao, "26", "Âmbito dos direitos fundamentais",
            "Os direitos fundamentais estabelecidos na presente Constituição não excluem quaisquer outros constantes das leis e regras aplicáveis de direito internacional.");
        
        criarArtigo(constituicao, "27", "Regime dos direitos, liberdade e garantias",
            "O regime jurídico dos direitos, liberdade e garantias enunciados neste capítulo são aplicáveis aos direitos, liberdade e garantias e aos direitos fundamentais de natureza análoga.");
        
        criarArtigo(constituicao, "28", "Força jurídica",
            "Os preceitos constitucionais respeitantes aos direitos, liberdade e garantias fundamentais são directamente aplicáveis e vinculam todas as entidades públicas e privadas.");
        
        criarArtigo(constituicao, "29", "Acesso ao direito e tutela jurisdicional efectiva",
            "A todos é assegurado o acesso ao direito e aos tribunais para defesa dos seus direitos e interesses legalmente protegidos, não podendo a justiça ser denegada por insuficiência dos meios económicos.");
        
        // CAPÍTULO II - DIREITOS, LIBERDADES E GARANTIAS FUNDAMENTAIS
        
        // Seção I - Direitos e Liberdades Individuais e Colectivas
        criarArtigo(constituicao, "30", "Direito à vida",
            "O Estado respeita e protege a vida da pessoa humana, que é inviolável.");
        
        criarArtigo(constituicao, "31", "Direito à integridade pessoal",
            "A integridade moral, intelectual e física das pessoas é inviolável. O Estado respeita e protege a pessoa e a dignidade humanas.");
        
        criarArtigo(constituicao, "32", "Direito à identidade, à privacidade e à intimidade",
            "A todos são reconhecidos os direitos à identidade pessoal, à capacidade civil, à nacionalidade, ao born nome e reputação, à imagem, à palavra e à reserva de intimidade da vida privada e familiar.");
        
        criarArtigo(constituicao, "33", "Inviolabilidade do domicílio",
            "O domicílio é inviolável. Ninguém pode entrar ou fazer busca ou apreensão no domicílio de qualquer pessoa sem o seu consentimento, salvo nas situações previstas na Constituição e na lei.");
        
        criarArtigo(constituicao, "34", "Inviolabilidade da correspondência e das comunicações",
            "É inviolável o sigilo da correspondência e dos demais meios de comunicação privada.");
        
        criarArtigo(constituicao, "35", "Família, casamento e filiação",
            "A família é o núcleo fundamental da organização da sociedade e é objecto de especial protecção do Estado. O homem e a mulher são iguais no seio da família, da sociedade e do Estado.");
        
        criarArtigo(constituicao, "36", "Direito à liberdade física e à segurança pessoal",
            "Todo o cidadão tem direito à liberdade física e à segurança individual. Ninguém pode ser privado da liberdade, excepto nos casos previstos pela Constituição e pela lei.");
        
        criarArtigo(constituicao, "37", "Direito e limites da propriedade privada",
            "A todos é garantido o direito à propriedade privada e à sua transmissão, nos termos da Constituição e da lei.");
        
        criarArtigo(constituicao, "38", "Direito à livre iniciativa económica",
            "A iniciativa económica privada é livre, sendo exercida com respeito pela Constituição e a lei.");
        
        criarArtigo(constituicao, "39", "Direito ao ambiente",
            "Todos têm o direito de viver num ambiente sadio e não poluído, bem como o dever de o defender e preservar.");
        
        criarArtigo(constituicao, "40", "Liberdade de expressão e de informação",
            "Todos têm o direito de exprimir, divulgarepartilhar livremente os seus pensamentos, as suas ideias e opiniões.");
        
        criarArtigo(constituicao, "41", "Liberdade de consciência, de religião e de culto",
            "A liberdade de consciência, de crença religiosa e de culto é inviolável. Ninguém pode ser privado dos seus direitos, perseguido ou isento de obrigações por motivo de crença religiosa.");
        
        criarArtigo(constituicao, "42", "Propriedade intelectual",
            "É livre a expressão da actividade intelectual, artística, política, científica e de comunicação, independentemente de censura ou licença.");
        
        criarArtigo(constituicao, "43", "Liberdade de criação cultural e científica",
            "É livre a criação intelectual, artística, científica e tecnológica.");
        
        criarArtigo(constituicao, "44", "Liberdade de imprensa",
            "É garantida a liberdade de imprensa, não podendo esta ser sujeita a qualquer censura prévia.");
        
        criarArtigo(constituicao, "45", "Direito de antena, de resposta e de réplica política",
            "Nos períodos de eleições gerais e autárquicas e de referendo, os concorrentes têm direito a tempos de antena.");
        
        criarArtigo(constituicao, "46", "Liberdade de residência, circulação e emigração",
            "Qualquer cidadão que resida legalmente em Angola pode livremente fixar residência, movimentar-se e permanecer em qualquer parte do território nacional.");
        
        criarArtigo(constituicao, "47", "Liberdade de reunião e de manifestação",
            "É garantida a todos os cidadãos a liberdade de reunião e de manifestação pacífica e sem armas.");
        
        criarArtigo(constituicao, "48", "Liberdade de associação",
            "Os cidadãos têm o direito de, livremente e sem dependência de qualquer autorização administrativa, constituir associações.");
        
        criarArtigo(constituicao, "49", "Liberdade de associação profissional e empresarial",
            "É garantida a todos os profissionais liberais ou independentes a liberdade de associação profissional para a defesa dos seus direitos e interesses.");
        
        criarArtigo(constituicao, "50", "Liberdade sindical",
            "É reconhecida aos trabalhadores a liberdade de criação de associações sindicais para a defesa dos seus interesses individuais e colectivos.");
        
        criarArtigo(constituicao, "51", "Direito à greve e proibição do lock out",
            "Os trabalhadores têm direito à greve. É proibido o lock out.");
        
        criarArtigo(constituicao, "52", "Participação na vida pública",
            "Todo o cidadão tem o direito de participar na vida política e na direcção dos assuntos públicos, directamente ou por intermédio de representantes livremente eleitos.");
        
        criarArtigo(constituicao, "53", "Acesso a cargos públicos",
            "Todo o cidadão tem direito de acesso, em condições de igualdade e liberdade, aos cargos públicos.");
        
        criarArtigo(constituicao, "54", "Direito de sufrágio",
            "Todo o cidadão, maior de dezoito anos, tem o direito de votar e ser eleito para qualquer órgão electivo do Estado e do poder local.");
        
        criarArtigo(constituicao, "55", "Liberdade de constituição de associações políticas e partidos políticos",
            "É livre a criação de associações políticas e partidos políticos.");
        
        // Seção II - Garantia dos Direitos e Liberdades Fundamentais
        criarArtigo(constituicao, "56", "Garantia geral do Estado",
            "O Estado reconhece como invioláveis os direitos e liberdade fundamentais consagrados na Constituição e cria as condições políticas, económicas, sociais, culturais, de paz e estabilidade que garantam a sua efectivação e protecção.");
        
        criarArtigo(constituicao, "57", "Restrição de direitos, liberdade e garantias",
            "A lei só pode restringir os direitos, liberdade e garantias nos casos expressamente previstos na Constituição, devendo as restrições limitar-se ao necessário, proporcional e razoável.");
        
        criarArtigo(constituicao, "58", "Limitação ou suspensão dos direitos, liberdade e garantias",
            "O exercício dos direitos, liberdade e garantias dos cidadãos apenas pode ser limitado ou suspenso em caso de estado de guerra, de estado de sítio ou de estado de emergência.");
        
        criarArtigo(constituicao, "59", "Proibição da pena de morte",
            "É proibida a pena de morte.");
        
        criarArtigo(constituicao, "60", "Proibição de tortura e de tratamentos degradantes",
            "Ninguém pode ser submetido a tortura, a trabalhos forçados, nem a tratamentos ou penas cruéis, desumanas ou degradantes.");
        
        criarArtigo(constituicao, "61", "Crimes hediondos e violentos",
            "São imprescritíveis e insusceptíveis de amnistia e liberdade provisória os crimes de genocídio e crimes contra a humanidade.");
        
        criarArtigo(constituicao, "62", "Irreversibilidade das amnistias",
            "São considerados válidos e irreversíveis os efeitos jurídicos dos actos de amnistia praticados ao abrigo de lei competente.");
        
        criarArtigo(constituicao, "63", "Direitos dos detidos e presos",
            "Toda a pessoa privada da liberdade deve ser informada, no momento da sua prisão ou detenção, das respectivas razões e dos seus direitos.");
        
        criarArtigo(constituicao, "64", "Privação da liberdade",
            "A privação da liberdade apenas é permitida nos casos e nas condições determinadas por lei.");
        
        criarArtigo(constituicao, "65", "Aplicação da Lei Criminal",
            "A responsabilidade penal é pessoal e intransmissível. Ninguém pode ser condenado por crime senão em virtude de lei anterior que declare punível a acção ou a omissão.");
        
        criarArtigo(constituicao, "66", "Limites das penas e das medidas de segurança",
            "Não pode haver penas nem medidas de segurança privativas ou restritivas da liberdade com carácter perpétuo ou de duração ilimitada ou indefinida.");
        
        criarArtigo(constituicao, "67", "Garantias do processo criminal",
            "Ninguém pode ser detido, preso ou submetido a julgamento senão nos termos da lei, sendo garantido a todos os arguidos ou presos o direito de defesa, de recurso e de patrocínio judiciário.");
        
        criarArtigo(constituicao, "68", "Habeas corpus",
            "Todos têm o direito à providência de habeas corpus contra o abuso de poder, em virtude de prisão ou detenção ilegal.");
        
        criarArtigo(constituicao, "69", "Habeas data",
            "Todos têm o direito de recorrer à providência de habeas data para assegurar o conhecimento das informações sobre si constantes de ficheiros.");
        
        criarArtigo(constituicao, "70", "Extradição e expulsão",
            "Não é permitida a expulsão nem a extradição de cidadãos angolanos do território nacional.");
        
        criarArtigo(constituicao, "71", "Direito de asilo",
            "É garantido a todo o cidadão estrangeiro ou apátrida o direito de asilo em caso de perseguição por motivos políticos.");
        
        criarArtigo(constituicao, "72", "Direito a julgamento justo e conforme",
            "A todo o cidadão é reconhecido o direito a julgamento justo, célere e conforme a lei.");
        
        criarArtigo(constituicao, "73", "Direito de petição, denúncia, reclamação e queixa",
            "Todos têm o direito de apresentar, individual ou colectivamente, petições, denúncias, reclamações ou queixas aos Órgãos de Soberania.");
        
        criarArtigo(constituicao, "74", "Direito de acção popular",
            "Qualquer cidadão tem direito à acção judicial que vise anularactos lesivos à saúde pública, ao património público, ao ambiente e à qualidade de vida.");
        
        criarArtigo(constituicao, "75", "Responsabilidade do Estado e de outras pessoas colectivas públicas",
            "O Estado e outras pessoas colectivas públicas são solidária e civilmente responsáveis por acções e omissões praticadas pelos seus órgãos.");
        
        // CAPÍTULO III - DIREITOS E DEVERES ECONÓMICOS, SOCIAIS E CULTURAIS
        criarArtigo(constituicao, "76", "Direito ao trabalho",
            "O trabalho é um direito e um dever de todo o trabalhador. Todo o trabalhador tem direito à formação profissional, justa remuneração, descanso, férias, protecção, higiene e segurança no trabalho.");
        
        criarArtigo(constituicao, "77", "Saúde e protecção social",
            "O Estado promove e garante as medidas necessárias para assegurar a todos o direito à assistência médica e sanitária.");
        
        criarArtigo(constituicao, "78", "Direitos do consumidor",
            "O consumidor tem direito à qualidade dos bens e serviços, à informação e esclarecimento, à garantia dos seus produtos e à protecção na relação de consumo.");
        
        criarArtigo(constituicao, "79", "Direito ao ensino, à cultura e ao desporto",
            "O Estado promove o acesso de todos à alfabetização, ao ensino, à cultura e ao desporto.");
        
        criarArtigo(constituicao, "80", "Proteção da criança",
            "A criança tem direito à atenção especial da família, da sociedade e do Estado, os quais devem assegurar a sua ampla protecção contra todas as formas de abandono, discriminação, opressão e exploração.");
        
        criarArtigo(constituicao, "81", "Juventude",
            "Os jovens gozam de protecção especial para efectivação dos seus direitos económicos, sociais e culturais.");
        
        criarArtigo(constituicao, "82", "Terceira idade",
            "Os cidadãos idosos têm direito à segurança económica e a condições de habitação e convívio familiar e comunitário.");
        
        criarArtigo(constituicao, "83", "Cidadãos com deficiência",
            "Os cidadãos com deficiência gozam plenamente dos direitos e estão sujeitos aos deveres consagrados na Constituição.");
        
        criarArtigo(constituicao, "84", "Antigos combatentes e veteranos da Pátria",
            "Os combatentes da luta pela independência nacional gozam de estatuto e protecção especial do Estado e da sociedade.");
        
        criarArtigo(constituicao, "85", "Direito à habitação e à qualidade de vida",
            "Todo o cidadão tem direito à habitação e à qualidade de vida.");
        
        criarArtigo(constituicao, "86", "Comunidades no estrangeiro",
            "O Estado estimula a associação dos angolanos que se encontram no estrangeiro e promove a sua ligação ao País.");
        
        criarArtigo(constituicao, "87", "Património histórico, cultural e artístico",
            "Os cidadãos e as comunidades têm direito ao respeito, à valorização e à preservação da sua identidade cultural, linguística e artística.");
        
        criarArtigo(constituicao, "88", "Dever de contribuição",
            "Todos têm o dever de contribuir para as despesas públicas e da sociedade, em função da sua capacidade económica.");
        
        // ========== TÍTULO IV - ORGANIZAÇÃO DO PODER DO ESTADO ==========
        
        criarArtigo(constituicao, "105", "Órgãos de Soberania",
            "São Órgãos de Soberania o Presidente da República, a Assembleia Nacional e os Tribunais.");
        
        criarArtigo(constituicao, "107", "Administração Eleitoral Independente",
            "Os processos eleitorais são organizados por Órgãos da Administração Eleitoral Independentes.");
        
        criarArtigo(constituicao, "107-A", "Registo Eleitoral",
            "O Registo Eleitoral é oficioso, obrigatório e permanente e é realizado pelos órgãos competentes da Administração Directa do Estado.");
        
        criarArtigo(constituicao, "108", "Chefia de Estado e Poder Executivo",
            "O Presidente da República é o Chefe de Estado, o Titular do Poder Executivo e o Comandante-em-Chefe das Forças Armadas Angolanas.");
        
        criarArtigo(constituicao, "109", "Eleição",
            "É eleito Presidente da República e Chefe do Executivo o cabeça de lista, pelo círculo nacional, do partido político ou coligação de partidos políticos mais votado.");
        
        criarArtigo(constituicao, "110", "Elegibilidades, inelegibilidades e impedimentos",
            "São elegíveis ao cargo de Presidente da República os cidadãos angolanos de origem, com idade mínima de trinta e cinco anos.");
        
        criarArtigo(constituicao, "112", "Data da eleição",
            "As eleições gerais devem ser convocadas até noventa dias antes do termo do mandato do Presidente da República.");
        
        criarArtigo(constituicao, "113", "Mandato",
            "O mandato do Presidente da República tem a duração de cinco anos. Cada cidadão pode exercer até 2 mandatos como Presidente da República.");
        
        criarArtigo(constituicao, "116-A", "Gestão da função executiva no final do mandato",
            "No período que decorre entre a campanha eleitoral e a tomada de posse do Presidente da República eleito, cabe ao Presidente da República em funções a gestão corrente da função executiva.");
        
        criarArtigo(constituicao, "119", "Competências como Chefe de Estado",
            "Compete ao Presidente da República, enquanto Chefe de Estado: nomear e exonerar os Ministros de Estado, os Ministros, os Secretários de Estado e os Vice-Ministros.");
        
        criarArtigo(constituicao, "120", "Competência como Titular do Poder Executivo",
            "Compete ao Presidente da República, enquanto Titular do Poder Executivo: definir a orientação política do País.");
        
        criarArtigo(constituicao, "125", "Forma dos actos",
            "No exercício das suas competências o Presidente da República emite Decretos Legislativos Presidenciais, Decretos Legislativos Presidenciais Provisórios, Decretos Presidenciais e Despachos Presidenciais.");
        
        criarArtigo(constituicao, "127", "Responsabilidade criminal",
            "O Presidente da República não é responsável pelos actos praticados no exercício das suas funções, salvo em caso de suborno, traição à Pátria e prática de crimes definidos como imprescritíveis.");
        
        criarArtigo(constituicao, "131", "Vice-Presidente",
            "O Vice-Presidente é um Órgão Auxiliar do Presidente da República no exercício da função executiva.");
        
        criarArtigo(constituicao, "132", "Substituição do Presidente da República",
            "Em caso de vacatura do cargo de Presidente da República, as funções são assumidas pelo Vice-Presidente da República.");
        
        criarArtigo(constituicao, "132-A", "Substituição do Vice-Presidente da República",
            "Em caso de vacatura do cargo de Vice-Presidente da República, compete ao Partido Político ou à Coligação de Partidos Políticos designar o seu substituto.");
        
        criarArtigo(constituicao, "143", "Sistema eleitoral",
            "Os Deputados são eleitos por sufrágio universal, livre, igual, directo, secreto e periódico pelos cidadãos nacionais maiores de dezoito anos de idade.");
        
        criarArtigo(constituicao, "144", "Círculos eleitorais",
            "Para a eleição dos Deputados é fixado o seguinte critério: um número de cento e trinta Deputados é elegido a nível nacional.");
        
        criarArtigo(constituicao, "145", "Inelegibilidade e impedimentos",
            "São inelegíveis a Deputados os cidadãos que tenham sido condenados com pena superior a 3 anos.");
        
        criarArtigo(constituicao, "162", "Competência de controlo e fiscalização",
            "Compete à Assembleia Nacional, no domínio do controlo e da fiscalização: velar pela aplicação da Constituição e pela boa execução das leis.");
        
        criarArtigo(constituicao, "163", "Competência em relação a outros órgãos",
            "Relativamente a outros órgãos, compete à Assembleia Nacional eleger juízes para o Tribunal Constitucional.");
        
        criarArtigo(constituicao, "169", "Aprovação",
            "Os projectos de Leis de Revisão Constitucional e as propostas de referendo são aprovados por maioria qualificada de 2/3 dos Deputados.");
        
        criarArtigo(constituicao, "174", "Função jurisdicional",
            "Os tribunais são Órgãos de Soberania com competência para administrar a justiça em nome do povo.");
        
        criarArtigo(constituicao, "176", "Sistema jurisdicional",
            "Os Tribunais Superiores da República de Angola são o Tribunal Supremo, o Tribunal Constitucional, o Tribunal de Contas e o Supremo Tribunal Militar.");
        
        criarArtigo(constituicao, "179", "Juízes",
            "Os juízes são independentes no exercício das suas funções e apenas devem obediência à Constituição e à lei. Os juízes são inamovíveis.");
        
        criarArtigo(constituicao, "180", "Tribunal Supremo",
            "O Tribunal Supremo é a instância judicial superior da jurisdição comum.");
        
        criarArtigo(constituicao, "181", "Tribunal Constitucional",
            "Ao Tribunal Constitucional compete, em geral, administrar a justiça em matérias de natureza jurídico-constitucional.");
        
        criarArtigo(constituicao, "184", "Conselho Superior da Magistratura Judicial",
            "O Conselho Superior da Magistratura Judicial é o órgão superior de gestão e disciplina da Magistratura Judicial.");
        
        criarArtigo(constituicao, "185", "Autonomia institucional",
            "O Ministério Público é o órgão da Procuradoria Geral da República essencial à função jurisdicional do Estado, sendo dotado de autonomia e estatuto próprio.");
        
        criarArtigo(constituicao, "186", "Competência",
            "Ao Ministério Público compete representar o Estado, defender a legalidade democrática e os interesses que a lei determinar, promover o processo penal.");
        
        criarArtigo(constituicao, "188", "Imunidades",
            "Os Magistrados do Ministério Público só podem ser presos depois de culpa formada quando a infracção seja punível com pena de prisão superior a 2 anos.");
        
        criarArtigo(constituicao, "193", "Exercício da advocacia",
            "A advocacia é uma instituição essencial à administração da justiça.");
        
        criarArtigo(constituicao, "194", "Garantias do Advogado",
            "Nos actos e manifestações processuais forenses necessários ao exercício da sua actividade, os Advogados gozam de imunidades.");
        
        criarArtigo(constituicao, "196", "Defesa pública",
            "O Estado assegura, às pessoas com insuficiência de meios financeiros, mecanismos de defesa pública.");
        
        // ========== TÍTULO V - ADMINISTRAÇÃO PÚBLICA ==========
        
        criarArtigo(constituicao, "198", "Objectivos e princípios fundamentais",
            "A Administração Pública é estruturada com base nos princípios da simplificação administrativa, da aproximação dos serviços às populações e da desconcentração e descentralização administrativas.");
        
        criarArtigo(constituicao, "198-A", "Âmbito",
            "A Administração Pública integra a Administração Directa e Indirecta do Estado, a Administração Autónoma e a Administração Independente.");
        
        criarArtigo(constituicao, "200-A", "Administração Central do Estado",
            "A Administração Central do Estado integra os órgãos e serviços administrativos centrais que se encontram sujeitos ao poder de direcção e de superintendência do Titular do Poder Executivo.");
        
        criarArtigo(constituicao, "202", "Objectivos e fundamentos da segurança nacional",
            "Compete ao Estado, com a participação dos cidadãos, garantir a segurança nacional, observando a Constituição e a lei.");
        
        criarArtigo(constituicao, "206", "Defesa nacional",
            "A defesa nacional tem por objectivos a garantia da defesa da soberania e independência nacionais, da integridade territorial e dos poderes constitucionais.");
        
        criarArtigo(constituicao, "207", "Forças Armadas Angolanas",
            "As Forças Armadas Angolanas são a instituição militar nacional permanente, regular e apartidária, incumbida da defesa militar do país.");
        
        criarArtigo(constituicao, "209", "Garantia da ordem",
            "A garantia da ordem tem por objectivo a defesa da segurança e tranquilidade públicas.");
        
        criarArtigo(constituicao, "210", "Polícia Nacional",
            "A Polícia Nacional é a instituição nacional policial, permanente, regular e apartidária, incumbida da protecção e asseguramento policial do País.");
        
        criarArtigo(constituicao, "212-A", "Provedor de Justiça",
            "O Provedor de Justiça é uma entidade pública independente que tem por objecto a defesa dos direitos, liberdade e garantias dos cidadãos.");
        
        // ========== TÍTULO VI - PODER LOCAL ==========
        
        criarArtigo(constituicao, "213", "Órgãos autónomos do Poder Local",
            "A organização democrática do Estado ao nível local estrutura-se com base no princípio da descentralização político-administrativa.");
        
        criarArtigo(constituicao, "214", "Princípio da autonomia local",
            "A autonomia local compreende o direito e a capacidade efectiva de as Autarquias Locais gerirem e regulamentarem os assuntos públicos locais.");
        
        criarArtigo(constituicao, "217", "Autarquias Locais",
            "As Autarquias Locais são pessoas colectivas territoriais correspondentes ao conjunto de residentes em certas circumscreições do território nacional.");
        
        criarArtigo(constituicao, "221", "Tutela administrativa",
            "As Autarquias Locais estão sujeitas à tutela administrativa do Executivo.");
        
        // ========== TÍTULO VII - GARANTIAS DA CONSTITUIÇÃO ==========
        
        criarArtigo(constituicao, "226", "Constitucionalidade",
            "A validade das leis e dos demais actos do Estado depende da sua conformidade com a Constituição.");
        
        criarArtigo(constituicao, "228", "Fiscalização preventiva da constitucionalidade",
            "O Presidente da República pode requerer ao Tribunal Constitucional a apreciação preventiva da constitucionalidade de qualquer norma.");
        
        criarArtigo(constituicao, "233", "Iniciativa de Revisão",
            "A iniciativa de Revisão da Constituição compete ao Presidente da República ou a um terço dos Deputados à Assembleia Nacional.");
        
        criarArtigo(constituicao, "234", "Aprovação e promulgação",
            "As alterações da Constituição são aprovadas por maioria de 2/3 dos Deputados em efectividade de funções.");
        
        criarArtigo(constituicao, "235", "Limites temporais",
            "A Assembleia Nacional pode rever a Constituição, decorridos cinco anos da sua entrada em vigor ou da última revisão ordinária.");
        
        criarArtigo(constituicao, "236", "Limites materiais",
            "As alterações da Constituição têm de respeitar: a dignidade da pessoa humana, a independência, integridade territorial e unidade nacional.");
        
        criarArtigo(constituicao, "238", "Início de vigência",
            "A Constituição da República de Angola entra em vigor no dia da sua publicação em Diário da República.");
        
        criarArtigo(constituicao, "239", "Vigência de leis anteriores",
            "O direito ordinário anterior à entrada em vigor da Constituição mantém-se, desde que não seja contrário à Constituição.");
        
        // Artigos específicos revogados (marcados como revogados)
        criarArtigoRevogado(constituicao, "192", "Conselho Superior da Magistratura do Ministério Público",
            "[REVOGADO] O anterior artigo 192 foi revogado pela Lei n.º 18/21. As competências passaram a ser exercidas pelo Conselho Superior da Magistratura Judicial.");
        
        criarArtigoRevogado(constituicao, "199", "Estrutura da Administração Pública",
            "[REVOGADO - N.º 1] O n.º 1 do artigo 199 foi revogado pela Lei n.º 18/21. O artigo 198-A passou a definir o âmbito da Administração Pública.");
        
        criarArtigoRevogado(constituicao, "215", "Autarquias Locais",
            "[REVOGADO] O anterior artigo 215 foi revogado pela Lei n.º 18/21.");
        
        criarArtigoRevogado(constituicao, "242", "Institucionalização efectiva das Autarquias Locais",
            "[REVOGADO - N.º 1] O n.º 1 do artigo 242 foi revogado pela Lei n.º 18/21. A institucionalização efectiva é agora definida por lei.");
        
        criarArtigo(constituicao, "243", "Nomeação diferida dos Juízes Conselheiros",
            "A designação dos Juízes dos Tribunais Superiores deve ser feita de modo a evitar a sua total renovação simultânea.");
        
        criarArtigo(constituicao, "244", "Anistia",
            "São considerados amnistiados os crimes militares, os crimes contra a segurança de Estado e outros com eles relacionados, "
            + "bem como os crimes cometidos por militares e agentes de segurança e ordem interna, praticados sob qualquer forma de participação, "
            + "no âmbito do conflito político-militar terminado em 2002.");
        
        // ========== ARTIGOS ADICIONAIS (Aditados pela Lei 18/21) ==========
        criarArtigo(constituicao, "241-A", "Registo eleitoral presencial",
            "Sem prejuízo do disposto no artigo 107.º-A, enquanto não estiverem criadas as condições para o acesso universal ao Bilhete de Identidade "
            + "de Cidadão Nacional no País, o registo electoral pode ser presencial nas localidades sem acesso aos Serviços de Identificação Civil.");
        
        log.info("Constituição de Angola 2021 criada com artigos");
    }

    private void criarArtigo(Lei lei, String numero, String titulo, String conteudo) {
        Artigo artigo = Artigo.builder()
            .numero(numero)
            .titulo(titulo)
            .conteudo(conteudo)
            .lei(lei)
            .ordem(extrairOrdemArtigo(numero))
            .build();
        
        artigoRepository.save(artigo);
    }
    
    private void criarArtigoRevogado(Lei lei, String numero, String titulo, String conteudo) {
        Artigo artigo = Artigo.builder()
            .numero(numero)
            .titulo(titulo)
            .conteudo(conteudo)
            .lei(lei)
            .ordem(extrairOrdemArtigo(numero))
            .build();
        
        artigoRepository.save(artigo);
    }
    
    private int extrairOrdemArtigo(String numero) {
        // Extrai apenas a parte numérica do número do artigo
        String parteNumerica = numero.replaceAll("[^0-9]", "");
        if (parteNumerica.isEmpty()) {
            return 999;
        }
        return Integer.parseInt(parteNumerica);
    }
}
