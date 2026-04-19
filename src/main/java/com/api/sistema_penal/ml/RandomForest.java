package com.api.sistema_penal.ml;

import java.util.*;

/**
 * Random Forest - Floresta Aleatória
 * Composta por múltiplas árvores de decisão para melhorar a precisão
 */
public class RandomForest {
    
    private List<DecisionTree> trees;
    private int numberOfTrees;
    private int maxDepth;
    private int minSamplesSplit;
    private Random random;
    
    public RandomForest() {
        this.numberOfTrees = 100;
        this.maxDepth = 10;
        this.minSamplesSplit = 2;
        this.random = new Random();
        this.trees = new ArrayList<>();
    }
    
    public RandomForest(int numberOfTrees, int maxDepth, int minSamplesSplit) {
        this.numberOfTrees = numberOfTrees;
        this.maxDepth = maxDepth;
        this.minSamplesSplit = minSamplesSplit;
        this.random = new Random();
        this.trees = new ArrayList<>();
    }
    
    /**
     * Treina o Random Forest com os dados fornecidos
     * Usa bootstrap sampling para criar múltiplos conjuntos de treinamento
     */
    public void train(List<CaseFeature> features, List<String> labels) {
        this.trees.clear();
        
        for (int i = 0; i < numberOfTrees; i++) {
            // Criar bootstrap sample
            List<CaseFeature> bootstrapFeatures = new ArrayList<>();
            List<String> bootstrapLabels = new ArrayList<>();
            
            for (int j = 0; j < features.size(); j++) {
                int index = random.nextInt(features.size());
                bootstrapFeatures.add(features.get(index));
                bootstrapLabels.add(labels.get(index));
            }
            
            // Treinar árvore
            DecisionTree tree = new DecisionTree(maxDepth, minSamplesSplit);
            tree.train(bootstrapFeatures, bootstrapLabels);
            trees.add(tree);
        }
    }
    
    /**
     * Prevê a classificação para um novo caso
     * Usa votação majoritária entre todas as árvores
     */
    public String predict(CaseFeature features) {
        if (trees.isEmpty()) {
            return "SEM_PREVISAO";
        }
        
        // Coletar votos de todas as árvores
        Map<String, Integer> votes = new HashMap<>();
        
        for (DecisionTree tree : trees) {
            String prediction = tree.predict(features);
            votes.put(prediction, votes.getOrDefault(prediction, 0) + 1);
        }
        
        // Retornar a classe com mais votos
        return Collections.max(votes.entrySet(), Map.Entry.comparingByValue()).getKey();
    }
    
    /**
     * Retorna a probabilidade de cada classe
     */
    public Map<String, Double> predictProbabilities(CaseFeature features) {
        if (trees.isEmpty()) {
            return Collections.emptyMap();
        }
        
        Map<String, Integer> votes = new HashMap<>();
        
        for (DecisionTree tree : trees) {
            String prediction = tree.predict(features);
            votes.put(prediction, votes.getOrDefault(prediction, 0) + 1);
        }
        
        // Calcular probabilidades
        Map<String, Double> probabilities = new HashMap<>();
        for (Map.Entry<String, Integer> entry : votes.entrySet()) {
            probabilities.put(entry.getKey(), (double) entry.getValue() / trees.size());
        }
        
        return probabilities;
    }
    
    /**
     * Adiciona uma nova árvore ao forest (aprendizado incremental)
     */
    public void addTree(List<CaseFeature> features, List<String> labels) {
        DecisionTree tree = new DecisionTree(maxDepth, minSamplesSplit);
        tree.train(features, labels);
        trees.add(tree);
    }
    
    /**
     * Retorna a importância das características
     * Baseado na frequência de uso em todas as árvores
     */
    public Map<String, Double> getFeatureImportance() {
        Map<String, Double> importance = new LinkedHashMap<>();
        
        // Características disponíveis
        String[] featureNames = {
            "violenceLevel", "damageValue", "numberOfVictims", "recidivism",
            "publicPlace", "weaponUsed", "forceUsed", "deceptionUsed",
            "confession", "remorse", "damageRepair", "organizedCrime",
            "flagrantDelict", "agentAge", "publicOfficial", "victimRelationship", "timeOfDay"
        };
        
        // Inicializar com 0
        for (String name : featureNames) {
            importance.put(name, 0.0);
        }
        
        // Calcular importância baseada nas árvores
        for (DecisionTree tree : trees) {
            // Por agora, retornar importância uniforme
            // Em uma implementação real, seria calculado baseado na estrutura das árvores
        }
        
        return importance;
    }
    
    public int getNumberOfTrees() {
        return numberOfTrees;
    }
    
    public void setNumberOfTrees(int numberOfTrees) {
        this.numberOfTrees = numberOfTrees;
    }
}
