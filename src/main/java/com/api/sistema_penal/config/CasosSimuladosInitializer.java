package com.api.sistema_penal.config;

import com.api.sistema_penal.domain.entity.CasoSimulado;
import com.api.sistema_penal.domain.entity.PerguntaCaso;
import com.api.sistema_penal.domain.repository.CasoSimuladoRepository;
import com.api.sistema_penal.domain.repository.PerguntaCasoRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class CasosSimuladosInitializer {

    private final CasoSimuladoRepository casoRepository;
    private final PerguntaCasoRepository perguntaRepository;

    @PostConstruct
    public void init() {
        if (casoRepository.count() > 0) {
            return;
        }

        log.info("A inicializar Casos Simulados Educacionais...");

        // ---------------------- Nível 1 ----------------------
        criarCaso(
                "Furto simples em loja",
                "João, 25 anos, entrou numa loja de roupas, escondeu peças debaixo da camisa e saiu sem pagar. O segurança deteve-o duas ruas depois com os bens ainda consigo.",
                1,
                "Crimes contra o património",
                "Art. 155 do Código Penal de Angola",
                """
                        CRIME: Furto simples (Art. 155 do Código Penal Angolano).
                        ELEMENTOS: Subtração de coisa móvel alheia, dolo de apropriação, ausência de consentimento e inexistência de violência.
                        PENA BASE: Prisão de 1 a 4 anos e multa.
                        ENFOQUE PEDAGÓGICO: Diferenciar furto simples de furto qualificado e de roubo.
                        """,
                List.of(
                        new PerguntaSeed(1, "Tipificação do facto", "Qual a melhor tipificação penal para a conduta descrita?", "Furto simples previsto no Art. 155, por se tratar de subtração clandestina de coisa móvel alheia, sem violência ou qualificadoras.", 4),
                        new PerguntaSeed(2, "Elementos objetivos", "Que elementos fáticos afastam outras modalidades do crime de furto?", "Ausência de violência, inexistência de arrombamento e recuperação imediata do bem." , 3),
                        new PerguntaSeed(3, "Providências iniciais", "Quais diligências devem ser sugeridas ao Ministério Público?", "Lavrar auto de notícia, recolher imagens da loja, ouvir testemunhas e promover restituição dos bens.", 3)
                )
        );

        criarCaso(
                "Ofensas corporais leves",
                "Carlos desferiu um soco em Pedro durante discussão num bar, provocando fratura do nariz e 10 dias de incapacidade. Entregou-se no dia seguinte e pediu desculpas.",
                1,
                "Crimes contra as pessoas",
                "Art. 137 do Código Penal de Angola",
                """
                        CRIME: Ofensas corporais simples.
                        ELEMENTOS: Lesão leve (cura inferior a 30 dias), ausência de intenção de matar e inexistência de qualificadoras.
                        PENA BASE: Detenção de 1 mês a 2 anos ou multa.
                        ENFOQUE: Identificar atenuantes como confissão e reparação voluntária.
                        """,
                List.of(
                        new PerguntaSeed(1, "Classificação jurídica", "Qual a incriminação adequada para os factos narrados?", "Ofensa corporal simples (Art. 137), pois a lesão exige recuperação inferior a 30 dias.", 3),
                        new PerguntaSeed(2, "Atenuantes", "Que fatores podem atenuar a pena?", "Confissão espontânea, ausência de antecedentes e eventual reparação do dano.", 3),
                        new PerguntaSeed(3, "Medidas processuais", "Que atos investigatórios devem ser realizados?", "Obter relatório médico, ouvir testemunhas e ponderar acordo de indemnização." , 3)
                )
        );

        criarCaso(
                "Difamação em ambiente laboral",
                "Ana divulgou entre colegas que Beatriz desviava valores da empresa, sabendo ser mentira. Beatriz foi demitida e sofreu abalo reputacional.",
                1,
                "Crimes contra a honra",
                "Arts. 174.º e 175.º do Código Penal",
                """
                        CRIME: Difamação qualificada pela divulgação reiterada de facto falso perante terceiros.
                        ELEMENTOS: Imputação de facto ofensivo, conhecimento da falsidade e repercussão social.
                        CONSEQUÊNCIAS: Pena de prisão até 1 ano e multa, além de possível indemnização cível.
                        ENFOQUE: Distinguir difamação de injúria e calúnia.
                        """,
                List.of(
                        new PerguntaSeed(1, "Identificação do delito", "A conduta enquadra-se em injúria ou difamação? Por quê?", "Difamação, pois houve imputação de facto falso perante terceiros, atingindo a honra objetiva.", 4),
                        new PerguntaSeed(2, "Prova necessária", "Que provas devem ser coligidas para sustentar a incriminação?", "Mensagens, testemunhas das conversas, registos internos e histórico disciplinar." , 3),
                        new PerguntaSeed(3, "Tutela reparatória", "Que medidas podem ser adoptadas para reparar a vítima?", "Retratação, indemnização por danos morais e eventual reintegração laboral.", 3)
                )
        );

        criarCaso(
                "Dano simples em património privado",
                "Durante protesto, Luís partiu o vidro da viatura do vizinho com uma pedra. Não houve lesão corporal, apenas dano material.",
                1,
                "Crimes contra o património",
                "Art. 165.º do Código Penal",
                """
                        CRIME: Dano simples – destruição ou deterioração de coisa alheia sem autorização.
                        ELEMENTOS: Dolo em danificar bem alheio e inexistência de qualificadoras.
                        PENA BASE: Multa até 120 dias ou prisão até 1 ano.
                        ENFOQUE: Diferenciar dano simples de dano qualificado.
                        """,
                List.of(
                        new PerguntaSeed(1, "Tipificação", "Qual é o tipo penal aplicável?", "Dano simples previsto no Art. 165 do Código Penal.", 3),
                        new PerguntaSeed(2, "Prova do dolo", "Como demonstrar a intenção de Luís?", "Relatos de testemunhas, contexto do protesto e eventuais imagens do ato." , 3),
                        new PerguntaSeed(3, "Medida compensatória", "Que reparação pode ser buscada?", "Indemnização dos prejuízos e acordo civil de reparação." , 3)
                )
        );

        criarCaso(
                "Violação de domicílio",
                "Miguel entrou no apartamento de Carla sem consentimento, aguardando escondido no quarto. Foi surpreendido quando ela regressou.",
                1,
                "Crimes contra a liberdade",
                "Art. 190.º do Código Penal",
                """
                        CRIME: Violação de domicílio – entrada ou permanência em habitação alheia contra vontade do titular.
                        ELEMENTOS: Intrusão não autorizada, dolo em afrontar a tranquilidade doméstica.
                        CONSEQUÊNCIAS: Pena de multa ou prisão até 2 anos, agravada se ocorrer à noite ou com violência.
                        """,
                List.of(
                        new PerguntaSeed(1, "Configuração do delito", "Que crime foi cometido por Miguel?", "Violação de domicílio (Art. 190), por ter entrado em habitação alheia sem autorização.", 3),
                        new PerguntaSeed(2, "Direitos da vítima", "Que medidas Carla pode solicitar?", "Proteção policial, medidas de afastamento e reparação de eventuais danos." , 3),
                        new PerguntaSeed(3, "Orientação processual", "Quais diligências devem ser realizadas?", "Ouvir a vítima, recolher impressões digitais e verificar existência de ameaças anteriores.", 3)
                )
        );

        // ---------------------- Nível 2 ----------------------
        criarCaso(
                "Furto qualificado por arrombamento",
                "Marcos arrombou uma janela durante a noite e subtraiu joias avaliadas em 1.500.000 Kz. Ninguém estava em casa.",
                2,
                "Crimes contra o património",
                "Art. 155.º, n.º 4, alínea a) do Código Penal",
                """
                        CRIME: Furto qualificado – arrombamento e período noturno em residência alheia.
                        ELEMENTOS: Subtração, violação de obstáculo físico e intrusão em habitação.
                        CONSEQUÊNCIAS: Pena agravada de 1/3 ao dobro face ao furto simples.
                        """,
                List.of(
                        new PerguntaSeed(1, "Qualificadoras", "Que elementos transformam o furto em qualificado?", "Arrombamento da janela, invasão de domicílio e prática durante a noite.", 4),
                        new PerguntaSeed(2, "Prova técnica", "Que diligências periciais são relevantes?", "Perícia no local, levantamento fotográfico, impressões digitais e avaliação dos bens." , 3),
                        new PerguntaSeed(3, "Diferenciação", "Como afastar a hipótese de roubo?", "Não houve violência ou ameaça contra pessoas, logo trata-se de furto qualificado.", 3)
                )
        );

        criarCaso(
                "Homicídio por negligência",
                "Durante caça recreativa, José disparou sem confirmar o alvo e atingiu fatalmente um colega. Havia sinalização proibindo disparos naquela direção.",
                2,
                "Crimes contra as pessoas",
                "Art. 133.º do Código Penal",
                """
                        CRIME: Homicídio negligente – violação do dever objetivo de cuidado.
                        ELEMENTOS: Conduta imprudente, resultado morte, ausência de intenção.
                        CONSEQUÊNCIAS: Pena de prisão de 1 a 5 anos, eventualmente substituível.
                        """,
                List.of(
                        new PerguntaSeed(1, "Elemento subjetivo", "O comportamento de José caracteriza dolo ou culpa?", "Culpa (negligência), pois não queria o resultado e agiu sem cautela devida.", 4),
                        new PerguntaSeed(2, "Dever objetivo", "Que regras de segurança foram violadas?", "Sinalização do campo de caça, obrigação de identificar o alvo e de verificar a zona de tiro." , 3),
                        new PerguntaSeed(3, "Reparação", "Que providências complementares podem ser sugeridas?", "Assistência à família da vítima, acordo civil e participação em ações de sensibilização.", 3)
                )
        );

        criarCaso(
                "Tráfico de estupefacientes",
                "Pedro foi detido com 60g de cocaína fracionada em 40 embalagens e registos de encomendas no telemóvel. Alegou tratar-se de consumo próprio.",
                2,
                "Crimes contra a saúde pública",
                "Lei n.º 3/99 e Art. 2.º do Decreto 7/02",
                """
                        CRIME: Tráfico de drogas – posse fracionada e destinada à comercialização.
                        ELEMENTOS: Quantidade relevante, acondicionamento típico, contactos de clientes.
                        CONSEQUÊNCIAS: Pena de 5 a 15 anos, com agravantes possíveis.
                        """,
                List.of(
                        new PerguntaSeed(1, "Indicadores de tráfico", "Que indícios permitem concluir pelo tráfico?", "Fracionamento em dezenas de embalagens, registo de encomendas e ausência de instrumentos de consumo.", 4),
                        new PerguntaSeed(2, "Prova digital", "Que diligências devem ser requeridas quanto ao telemóvel?", "Perícia forense, extração de conversas e identificação de outros envolvidos." , 3),
                        new PerguntaSeed(3, "Defesa possível", "Que argumentos poderiam ser usados pela defesa?", "Dependência química ou finalidade de consumo próprio – a serem contrariados pelos indícios de venda.", 3)
                )
        );

        criarCaso(
                "Burla informática",
                "Helena enviou e-mails falsos a clientes de um banco, recolheu credenciais e transferiu valores para contas laranja.",
                2,
                "Crimes económicos",
                "Art. 214.º do Código Penal",
                """
                        CRIME: Burla informática – utilização fraudulenta de sistemas informáticos para obter vantagem patrimonial ilegítima.
                        ELEMENTOS: Engano, manipulação de dados eletrónicos e prejuízo patrimonial das vítimas.
                        CONSEQUÊNCIAS: Pena de 1 a 8 anos, agravável pelo valor elevado.
                        """,
                List.of(
                        new PerguntaSeed(1, "Estrutura típica", "Quais são os elementos do crime de burla informática?", "Uso de dados informáticos alheios, manipulação fraudulenta e obtenção de vantagem com prejuízo alheio.", 4),
                        new PerguntaSeed(2, "Prova digital", "Que diligências devem ser solicitadas?", "Perícia nos equipamentos, rastreio das contas laranja e cooperação com o banco." , 3),
                        new PerguntaSeed(3, "Responsabilização", "Além da esfera penal, que outras consequências Helena enfrentará?", "Indemnizações civis e eventual proibição de exercer funções envolvendo sistemas informáticos.", 3)
                )
        );

        criarCaso(
                "Violência doméstica reiterada",
                "António agrediu a companheira em diversas ocasiões, controlando-lhe as finanças e impedindo contactos familiares. A vítima possui fotos e mensagens ameaçadoras.",
                2,
                "Proteção da família",
                "Lei n.º 25/11",
                """
                        CRIME: Violência doméstica física e psicológica.
                        ELEMENTOS: Relação conjugal, agressões reiteradas, controlo económico e ameaças.
                        CONSEQUÊNCIAS: Pena de 2 a 8 anos, medidas de afastamento e proteção urgente.
                        """,
                List.of(
                        new PerguntaSeed(1, "Abrangência legal", "Que condutas configuram violência doméstica neste caso?", "Agressões físicas, controlo financeiro, ameaças e isolamento social.", 4),
                        new PerguntaSeed(2, "Medidas urgentes", "Que medidas protetivas devem ser solicitadas?", "Afastamento imediato, proibição de contacto e acompanhamento psicossocial." , 3),
                        new PerguntaSeed(3, "Prova", "Como instruir a ação penal?", "Laudos médicos, fotografias, mensagens ameaçadoras e depoimentos de familiares.", 3)
                )
        );

        // ---------------------- Nível 3 ----------------------
        criarCaso(
                "Homicídio qualificado por feminicídio",
                "Paulo aguardou a esposa adormecer e desferiu várias facadas letais. O crime foi motivado por ciúmes infundados.",
                3,
                "Crimes contra as pessoas",
                "Art. 121.º, n.º 2, alíneas b) e f)",
                """
                        CRIME: Homicídio qualificado/feminicídio – motivo fútil, recurso que dificultou defesa e violência baseada no género.
                        CONSEQUÊNCIAS: Pena de 20 a 30 anos.
                        ENFOQUE: Reconhecer qualificadoras cumulativas e agravantes especiais.
                        """,
                List.of(
                        new PerguntaSeed(1, "Qualificadoras", "Quais circunstâncias agravam o crime?", "Motivo fútil (ciúmes), feminicídio e meio cruel (ataque enquanto dormia).", 4),
                        new PerguntaSeed(2, "Prova técnica", "Que diligências são essenciais?", "Perícia no local, laudo cadavérico, histórico de violência doméstica e depoimentos de vizinhos." , 3),
                        new PerguntaSeed(3, "Prevenção", "Que políticas públicas podem ser apontadas?", "Reforço da rede de apoio, casas de abrigo e campanhas contra violência baseada no género.", 3)
                )
        );

        criarCaso(
                "Concurso de crimes em tentativa de roubo",
                "Roberto tentou roubar um carro com arma falsa; ao fugir, atropelou um pedestre e destruiu um poste de iluminação.",
                3,
                "Crimes contra o património e pessoas",
                "Arts. 24.º, 146.º, 157.º e 164.º",
                """
                        ANÁLISE: Tentativa de roubo, lesão corporal negligente e dano simples ao património público.
                        ENFOQUE: Aplicar concurso efetivo de infrações (Art. 77) e graduar as penas cumuladamente.
                        """,
                List.of(
                        new PerguntaSeed(1, "Qualificação dos factos", "Que crimes estão presentes?", "Tentativa de roubo, lesão corporal negligente e dano simples.", 4),
                        new PerguntaSeed(2, "Concurso", "Como se aplica o concurso de crimes?", "Concurso efetivo com soma das penas, avaliando gravidade de cada crime." , 3),
                        new PerguntaSeed(3, "Dosimetria", "Que factores considerar na sentença?", "Uso de arma falsa, ausência de antecedentes, danos ao pedestre e ao erário.", 3)
                )
        );

        criarCaso(
                "Branqueamento de capitais",
                "Uma empresa de fachada adquiriu imóveis de alto valor com fundos provenientes do tráfico internacional. As contas mostram depósitos fracionados em dólares.",
                3,
                "Crimes económicos",
                "Lei n.º 34/11",
                """
                        CRIME: Branqueamento de capitais – ocultação e dissimulação da origem ilícita de valores.
                        ELEMENTOS: Existência de crime precedente, operações fracionadas, uso de sociedades interpostas.
                        CONSEQUÊNCIAS: Pena de 3 a 12 anos e confisco dos bens.
                        """,
                List.of(
                        new PerguntaSeed(1, "Crime precedente", "Qual é o crime subjacente e por que importa?", "Tráfico internacional de drogas, pois fornece a origem ilícita necessária ao branqueamento.", 4),
                        new PerguntaSeed(2, "Estratégia probatória", "Que documentos solicitar?", "Registos bancários, contratos sociais, escrituras e relatórios da UIF." , 3),
                        new PerguntaSeed(3, "Medidas cautelares", "Que providências imediatas adotar?", "Arresto de bens, bloqueio de contas e cooperação internacional.", 3)
                )
        );

        criarCaso(
                "Corrupção passiva",
                "Funcionário público exigiu 200.000 Kz para agilizar licença comercial. A conversa foi gravada pela empresária.",
                3,
                "Crimes contra a administração pública",
                "Art. 357.º do Código Penal",
                """
                        CRIME: Corrupção passiva – solicitação de vantagem indevida por agente público.
                        ELEMENTOS: Qualidade de funcionário, solicitação da vantagem, nexo com ato de ofício.
                        CONSEQUÊNCIAS: Pena de 2 a 10 anos, perda do cargo e multa.
                        """,
                List.of(
                        new PerguntaSeed(1, "Tipificação", "Que crime praticou o funcionário?", "Corrupção passiva, por solicitar vantagem para praticar ato de ofício.", 4),
                        new PerguntaSeed(2, "Provas", "Quais elementos são decisivos?", "Gravação da conversa, depoimento da vítima e rastreio do valor." , 3),
                        new PerguntaSeed(3, "Medidas administrativas", "Que consequências disciplinares podem ocorrer?", "Processo disciplinar, suspensão preventiva e eventual demissão.", 3)
                )
        );

        criarCaso(
                "Peculato por apropriação",
                "Tesoureiro municipal apropriou-se de verbas destinadas a obras escolares, transferindo-as para conta pessoal e simulando despesas.",
                3,
                "Crimes contra a administração pública",
                "Art. 360.º do Código Penal",
                """
                        CRIME: Peculato por apropriação – agente público apropria-se de valores sob sua guarda.
                        ELEMENTOS: Qualidade de funcionário, posse legítima inicial e dolo em converter para uso próprio.
                        CONSEQUÊNCIAS: Pena de 2 a 8 anos, multa e perda do cargo.
                        """,
                List.of(
                        new PerguntaSeed(1, "Elementos do peculato", "Que requisitos caracterizam o crime?", "Agente público, posse lícita da verba e apropriação dolosa para vantagem pessoal.", 4),
                        new PerguntaSeed(2, "Prova documental", "Que documentos solicitar?", "Extratos bancários, notas de empenho, comprovativos de despesa e relatórios de auditoria." , 3),
                        new PerguntaSeed(3, "Medidas de recuperação", "Como assegurar a restituição dos valores?", "Bloqueio de contas, arresto de bens e ação civil de recuperação.", 3)
                )
        );

        log.info("Casos simulados criados: {}", casoRepository.count());
    }

    private void criarCaso(String titulo,
                           String descricao,
                           Integer nivel,
                           String categoria,
                           String artigos,
                           String gabarito,
                           List<PerguntaSeed> perguntas) {
        CasoSimulado salvo = casoRepository.save(CasoSimulado.builder()
                .titulo(titulo)
                .descricaoFacto(descricao)
                .nivel(nivel)
                .categoria(categoria)
                .artigosRelacionados(artigos)
                .gabaritoExplicacao(gabarito)
                .ativo(true)
                .build());

        perguntas.forEach(seed -> perguntaRepository.save(PerguntaCaso.builder()
                .caso(salvo)
                .ordem(seed.ordem())
                .titulo(seed.titulo())
                .enunciado(seed.enunciado())
                .respostaEsperada(seed.respostaEsperada())
                .pontuacaoMaxima(seed.pontuacaoMaxima())
                .ativa(true)
                .build()));
    }

    private record PerguntaSeed(int ordem, String titulo, String enunciado,
                                String respostaEsperada, int pontuacaoMaxima) {
    }
}
