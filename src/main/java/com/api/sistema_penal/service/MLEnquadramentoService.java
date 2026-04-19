package com.api.sistema_penal.service;

import com.api.sistema_penal.ml.CaseFeature;
import com.api.sistema_penal.ml.RandomForest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.*;

/**
 * Serviço de Machine Learning para Enquadramento Penal
 * Implementa Random Forest para classificação de crimes
 */
@Service
@Slf4j
public class MLEnquadramentoService {
    
    private RandomForest forest;
    private boolean isTrained = false;
    
    public MLEnquadramentoService() {
        // Inicializar com 50 árvores
        this.forest = new RandomForest(50, 8, 3);
    }
    
    /**
     * Treina o modelo com dados históricos após a inicialização
     */
    @PostConstruct
    public void initialize() {
        try {
            trainModel();
            log.info("Modelo ML Random Forest inicializado com sucesso");
        } catch (Exception e) {
            log.warn("Erro ao inicializar modelo ML: {}", e.getMessage());
        }
    }
    
    /**
     * Treina o modelo com dados de exemplo baseados no Código Penal de Angola
     */
    public void trainModel() {
        List<CaseFeature> features = new ArrayList<>();
        List<String> labels = new ArrayList<>();
        
        // Dados de treinamento baseados no Código Penal de Angola
        
        // HOMICÍDIO (Alta violência, frequentemente com vítimas)
        for (int i = 0; i < 20; i++) {
            CaseFeature f = new CaseFeature();
            f.setViolenceLevel(8.0 + Math.random() * 2);
            f.setNumberOfVictims(1);
            f.setWeaponUsed(Math.random() > 0.3);
            f.setForceUsed(true);
            features.add(f);
            labels.add("HOMICIDIO");
        }
        
        // ROUBO (Violência média-alta, usa arma frequentemente)
        for (int i = 0; i < 25; i++) {
            CaseFeature f = new CaseFeature();
            f.setViolenceLevel(5.0 + Math.random() * 3);
            f.setDamageValue(10000 + Math.random() * 90000);
            f.setWeaponUsed(Math.random() > 0.4);
            f.setPublicPlace(true);
            f.setForceUsed(true);
            features.add(f);
            labels.add("ROUBO");
        }
        
        // FURTO (Sem violência, valor variable)
        for (int i = 0; i < 20; i++) {
            CaseFeature f = new CaseFeature();
            f.setViolenceLevel(0.0);
            f.setDamageValue(1000 + Math.random() * 50000);
            f.setWeaponUsed(false);
            f.setForceUsed(false);
            f.setPublicPlace(Math.random() > 0.5);
            features.add(f);
            labels.add("FURTO");
        }
        
        // LESÃO CORPORAL (Violência física sem morte)
        for (int i = 0; i < 15; i++) {
            CaseFeature f = new CaseFeature();
            f.setViolenceLevel(4.0 + Math.random() * 3);
            f.setNumberOfVictims(1);
            f.setWeaponUsed(Math.random() > 0.6);
            f.setForceUsed(true);
            features.add(f);
            labels.add("LESAO_CORPORAL");
        }
        
        // ESTELIONATO (Engano, sem violência)
        for (int i = 0; i < 15; i++) {
            CaseFeature f = new CaseFeature();
            f.setViolenceLevel(0.0);
            f.setDamageValue(5000 + Math.random() * 100000);
            f.setDeceptionUsed(true);
            f.setWeaponUsed(false);
            f.setForceUsed(false);
            features.add(f);
            labels.add("ESTELIONATO");
        }
        
        // VIOLÊNCIA DOMÉSTICA (Violência contra familiar)
        for (int i = 0; i < 10; i++) {
            CaseFeature f = new CaseFeature();
            f.setViolenceLevel(5.0 + Math.random() * 3);
            f.setNumberOfVictims(1);
            f.setWeaponUsed(Math.random() > 0.7);
            f.setForceUsed(true);
            f.setVictimRelationship(2); // Cônjuge/Familiar
            features.add(f);
            labels.add("VIOLENCIA_DOMESTICA");
        }
        
        // AMEAÇA (Sem violência física)
        for (int i = 0; i < 10; i++) {
            CaseFeature f = new CaseFeature();
            f.setViolenceLevel(1.0 + Math.random() * 2);
            f.setWeaponUsed(Math.random() > 0.8);
            features.add(f);
            labels.add("AMEACA");
        }
        
        // DANO (Dano patrimonial sem roubo)
        for (int i = 0; i < 10; i++) {
            CaseFeature f = new CaseFeature();
            f.setViolenceLevel(0.0);
            f.setDamageValue(1000 + Math.random() * 20000);
            f.setWeaponUsed(false);
            features.add(f);
            labels.add("DANO");
        }
        
        // Treinar o modelo
        forest.train(features, labels);
        isTrained = true;
        
        log.info("Modelo ML treinado com {} exemplos", features.size());
    }
    
    /**
     * Prevê o tipo de crime com base nas características do caso
     */
    public String predictCrime(String description, String tipoCrime) {
        // Criar features a partir da descrição
        CaseFeature features = CaseFeature.fromDescription(description, tipoCrime);
        
        if (!isTrained) {
            // Se não treinado, usar heurística simples
            return tipoCrime != null ? tipoCrime.toUpperCase() : "HOMICIDIO";
        }
        
        return forest.predict(features);
    }
    
    /**
     * Retorna as probabilidades para cada tipo de crime
     */
    public Map<String, Double> getCrimeProbabilities(String description, String tipoCrime) {
        CaseFeature features = CaseFeature.fromDescription(description, tipoCrime);
        
        if (!isTrained) {
            Map<String, Double> probs = new HashMap<>();
            probs.put("DESCONHECIDO", 1.0);
            return probs;
        }
        
        return forest.predictProbabilities(features);
    }
    
    /**
     * Adiciona novo exemplo de treinamento (aprendizado incremental)
     */
    public void addTrainingExample(String description, String tipoCrime, String crimeClassificado) {
        CaseFeature features = CaseFeature.fromDescription(description, tipoCrime);
        
        List<CaseFeature> singleFeature = Collections.singletonList(features);
        List<String> singleLabel = Collections.singletonList(crimeClassificado);
        
        forest.addTree(singleFeature, singleLabel);
        
        log.info("Novo exemplo adicionado ao modelo: {} -> {}", tipoCrime, crimeClassificado);
    }
    
    /**
     * Retorna a importância das características para o modelo
     */
    public Map<String, Double> getFeatureImportance() {
        if (!isTrained) {
            return Collections.emptyMap();
        }
        return forest.getFeatureImportance();
    }
    
    public boolean isTrained() {
        return isTrained;
    }
}
