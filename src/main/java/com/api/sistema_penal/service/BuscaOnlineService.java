package com.api.sistema_penal.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Serviço de busca jurídica online
 * Fornece resultados baseados no Código Penal de Angola como fallback
 * quando o banco local não tem dados suficientes
 */
@Slf4j
@Service
public class BuscaOnlineService {
    
    @Value("${app.busca.online.enabled:true}")
    private boolean buscaOnlineEnabled;
    
    /**
     * Busca leis online quando o banco local não tem resultados
     * Simula busca em fontes jurídicas (em produção, pode ser conectado a APIs reais)
     */
    public List<Map<String, String>> buscarLeisOnlineSimulado(String descricao, String tipoCrime) {
        log.info("Buscando leis online para: {}", descricao);
        
        if (!buscaOnlineEnabled) {
            log.info("Busca online desabilitada");
            return Collections.emptyList();
        }
        
        try {
            List<Map<String, String>> resultados = new ArrayList<>();
            
            String descricaoLower = descricao.toLowerCase();
            
            if (descricaoLower.contains("furto") || descricaoLower.contains("roubo") || 
                descricaoLower.contains("subtrair") || descricaoLower.contains("assalt")) {
                Map<String, String> conhecimento = new HashMap<>();
                conhecimento.put("titulo", "Código Penal Angolano - Furto");
                conhecimento.put("conteudo", "Artigo 203.º - Furto\n\n1. Quem, com ilegítima intenção de património para si ou para outra pessoa, subtraír ou retém coisa móvel alheia é punido com prisão de um a cinco anos.\n\n2. A pena é de prisão de dois a oito anos quando:\na) O furto for praticado em casa habitada ou sua dependência;\nb) O furto for praticado com arrombamento, escalamento ou chave falsa;\nc) O furto for praticado por duas ou mais pessoas;\nd) O valor da coisa furtada for considerável.");
                resultados.add(conhecimento);
            }
            
            if (descricaoLower.contains("homicídio") || descricaoLower.contains("matar") || 
                descricaoLower.contains("morte") || descricaoLower.contains("assassin")) {
                Map<String, String> conhecimento = new HashMap<>();
                conhecimento.put("titulo", "Código Penal Angolano - Homicídio");
                conhecimento.put("conteudo", "Artigo 185.º - Homicídio simples\n\n1. Quem, com ilegítima intenção de matar, DSLICITAMENTE tira a vida a outra pessoa é punido com prisão de doze a vinte e cinco anos.");
                resultados.add(conhecimento);
            }
            
            if (descricaoLower.contains("violência") || descricaoLower.contains("agredir") || 
                descricaoLower.contains("lesão") || descricaoLower.contains("espancar")) {
                Map<String, String> conhecimento = new HashMap<>();
                conhecimento.put("titulo", "Código Penal Angolano - Ofensa Corporal");
                conhecimento.put("conteudo", "Artigo 201.º - Ofensa corporal\n\n1. Ofender a integridade física de outra pessoa é punido com prisão até dois anos ou com multa até 120 dias.");
                resultados.add(conhecimento);
            }
            
            if (descricaoLower.contains("estupro") || descricaoLower.contains("violação") || 
                descricaoLower.contains("abuso sexual") || descricaoLower.contains("violar")) {
                Map<String, String> conhecimento = new HashMap<>();
                conhecimento.put("titulo", "Código Penal Angolano - Violação");
                conhecimento.put("conteudo", "Artigo 185.º - Violação\n\n1. Quem, mediante violência ou ameaça grave, constranger outra pessoa a ter relações sexuais é punido com prisão de dois a oito anos.");
                resultados.add(conhecimento);
            }
            
            if (descricaoLower.contains("tráfico") || descricaoLower.contains("droga") || 
                descricaoLower.contains("estupefaciente") || descricaoLower.contains("cannabis")) {
                Map<String, String> conhecimento = new HashMap<>();
                conhecimento.put("titulo", "Código Penal Angolano - Tráfico de Estupefacientes");
                conhecimento.put("conteudo", "Artigo 24.º - Tráfico de Estupefacientes\n\n1. Quem, sem autorização, cultivar, produzir, fabricar, extrair, preparar, oferecer, puser à venda, vender, distribuir, importar, exportar, trânsito ou mediar de Estupefacientes é punido com prisão de dois a doze anos.");
                resultados.add(conhecimento);
            }
            
            if (descricaoLower.contains("corrupção") || descricaoLower.contains("propina") || 
                descricaoLower.contains("suborno") || descricaoLower.contains("peita")) {
                Map<String, String> conhecimento = new HashMap<>();
                conhecimento.put("titulo", "Código Penal Angolano - Corrupção");
                conhecimento.put("conteudo", "Artigo 282.º - Corrupção passiva\n\n1. O funcionário que, por si ou por interposta pessoa, solicitar ou aceitar promessa de vantagem económica ou de outra natureza é punido com prisão de dois a oito anos.");
                resultados.add(conhecimento);
            }
            
            if (descricaoLower.contains("fraude") || descricaoLower.contains("engano") || 
                descricaoLower.contains("estelionato") || descricaoLower.contains("burla")) {
                Map<String, String> conhecimento = new HashMap<>();
                conhecimento.put("titulo", "Código Penal Angolano - Burla");
                conhecimento.put("conteudo", "Artigo 221.º - Burla\n\n1. Quem, com intenções de obtenção de enriquecimento ilícito, através de engano, induzir outra pessoa em erro, causando-lhe prejuízo patrimonial, é punido com prisão de um a cinco anos.");
                resultados.add(conhecimento);
            }
            
            // Se ainda não encontrou resultados, adicionar informação geral
            if (resultados.isEmpty()) {
                Map<String, String> conhecimento = new HashMap<>();
                conhecimento.put("titulo", "Código Penal Angolano - Introdução");
                conhecimento.put("conteudo", "O Código Penal de Angola (Lei n.º 38/20 de 11 de novembro) estabelece os crimes e suas respetivas penas no ordenamento jurídico angolano.");
                resultados.add(conhecimento);
            }
            
            log.info("Encontrados {} resultados na busca online", resultados.size());
            return resultados;
            
        } catch (Exception e) {
            log.error("Erro ao buscar leis online: {}", e.getMessage());
            return Collections.emptyList();
        }
    }
}
