package com.api.sistema_penal.ml;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Implementação de Árvore de Decisão para o Random Forest
 * Usada para classificação de casos penais
 */
public class DecisionTree {
    
    private Node root;
    private int maxDepth;
    private int minSamplesSplit;
    private double minInformationGain;
    private Random random;
    
    public DecisionTree() {
        this.maxDepth = 10;
        this.minSamplesSplit = 2;
        this.minInformationGain = 0.01;
        this.random = new Random();
    }
    
    public DecisionTree(int maxDepth, int minSamplesSplit) {
        this.maxDepth = maxDepth;
        this.minSamplesSplit = minSamplesSplit;
        this.minInformationGain = 0.01;
        this.random = new Random();
    }
    
    /**
     * Treina a árvore de decisão com os dados fornecidos
     */
    public void train(List<CaseFeature> features, List<String> labels) {
        this.root = buildTree(features, labels, 0);
    }
    
    /**
     * Prevê a classificação para um novo caso
     */
    public String predict(CaseFeature features) {
        return predictNode(root, features);
    }
    
    private String predictNode(Node node, CaseFeature features) {
        if (node.isLeaf()) {
            return node.getLabel();
        }
        
        double featureValue = getFeatureValue(features, node.getFeatureIndex());
        
        if (featureValue <= node.getThreshold()) {
            return predictNode(node.getLeft(), features);
        } else {
            return predictNode(node.getRight(), features);
        }
    }
    
    private double getFeatureValue(CaseFeature features, int index) {
        switch (index) {
            case 0: return features.getViolenceLevel();
            case 1: return features.getDamageValue();
            case 2: return (double) features.getNumberOfVictims();
            case 3: return features.isRecidivism() ? 1.0 : 0.0;
            case 4: return features.isPublicPlace() ? 1.0 : 0.0;
            case 5: return features.isWeaponUsed() ? 1.0 : 0.0;
            default: return 0.0;
        }
    }
    
    private Node buildTree(List<CaseFeature> features, List<String> labels, int currentDepth) {
        // Encontrar a melhor divisão
        SplitResult bestSplit = findBestSplit(features, labels);
        
        // Verificar condições de parada
        if (currentDepth >= maxDepth || 
            labels.size() < minSamplesSplit ||
            bestSplit == null ||
            bestSplit.informationGain < minInformationGain) {
            // Criar nó folha
            String majorityLabel = getMajorityLabel(labels);
            return Node.leaf(majorityLabel);
        }
        
        // Dividir os dados
        List<CaseFeature> leftFeatures = new ArrayList<>();
        List<String> leftLabels = new ArrayList<>();
        List<CaseFeature> rightFeatures = new ArrayList<>();
        List<String> rightLabels = new ArrayList<>();
        
        for (int i = 0; i < features.size(); i++) {
            double value = getFeatureValue(features.get(i), bestSplit.featureIndex);
            if (value <= bestSplit.threshold) {
                leftFeatures.add(features.get(i));
                leftLabels.add(labels.get(i));
            } else {
                rightFeatures.add(features.get(i));
                rightLabels.add(labels.get(i));
            }
        }
        
        // Criar nó interno
        Node leftChild = buildTree(leftFeatures, leftLabels, currentDepth + 1);
        Node rightChild = buildTree(rightFeatures, rightLabels, currentDepth + 1);
        
        return Node.builder()
                .featureIndex(bestSplit.featureIndex)
                .threshold(bestSplit.threshold)
                .left(leftChild)
                .right(rightChild)
                .build();
    }
    
    private SplitResult findBestSplit(List<CaseFeature> features, List<String> labels) {
        SplitResult bestSplit = null;
        double bestGain = 0.0;
        
        double currentEntropy = calculateEntropy(labels);
        
        // Testar cada característica
        for (int featureIndex = 0; featureIndex < 6; featureIndex++) {
            // Obter valores únicos para esta característica
            List<Double> values = new ArrayList<>();
            for (CaseFeature f : features) {
                values.add(getFeatureValue(f, featureIndex));
            }
            
            // Testar diferentes limiares (thresholds)
            for (double threshold : getUniqueThresholds(values)) {
                SplitResult split = evaluateSplit(features, labels, featureIndex, threshold, currentEntropy);
                
                if (split != null && split.informationGain > bestGain) {
                    bestGain = split.informationGain;
                    bestSplit = split;
                }
            }
        }
        
        return bestSplit;
    }
    
    private SplitResult evaluateSplit(List<CaseFeature> features, List<String> labels, 
                                      int featureIndex, double threshold, double parentEntropy) {
        List<String> leftLabels = new ArrayList<>();
        List<String> rightLabels = new ArrayList<>();
        
        for (int i = 0; i < features.size(); i++) {
            double value = getFeatureValue(features.get(i), featureIndex);
            if (value <= threshold) {
                leftLabels.add(labels.get(i));
            } else {
                rightLabels.add(labels.get(i));
            }
        }
        
        if (leftLabels.isEmpty() || rightLabels.isEmpty()) {
            return null;
        }
        
        double leftWeight = (double) leftLabels.size() / labels.size();
        double rightWeight = (double) rightLabels.size() / labels.size();
        
        double childEntropy = leftWeight * calculateEntropy(leftLabels) + 
                             rightWeight * calculateEntropy(rightLabels);
        
        double informationGain = parentEntropy - childEntropy;
        
        return SplitResult.builder()
                .featureIndex(featureIndex)
                .threshold(threshold)
                .informationGain(informationGain)
                .build();
    }
    
    private double calculateEntropy(List<String> labels) {
        if (labels.isEmpty()) return 0.0;
        
        java.util.Map<String, Long> counts = labels.stream()
                .collect(java.util.stream.Collectors.groupingBy(e -> e, java.util.stream.Collectors.counting()));
        
        double entropy = 0.0;
        for (long count : counts.values()) {
            double probability = (double) count / labels.size();
            entropy -= probability * (Math.log(probability) / Math.log(2));
        }
        
        return entropy;
    }
    
    private String getMajorityLabel(List<String> labels) {
        return labels.stream()
                .collect(java.util.stream.Collectors.groupingBy(e -> e, java.util.stream.Collectors.counting()))
                .entrySet().stream()
                .max(java.util.Map.Entry.comparingByValue())
                .map(java.util.Map.Entry::getKey)
                .orElse("DESCONHECIDO");
    }
    
    private List<Double> getUniqueThresholds(List<Double> values) {
        List<Double> sorted = new ArrayList<>(values);
        sorted.sort(Double::compareTo);
        
        List<Double> thresholds = new ArrayList<>();
        for (int i = 0; i < sorted.size() - 1; i++) {
            double threshold = (sorted.get(i) + sorted.get(i + 1)) / 2.0;
            thresholds.add(threshold);
        }
        
        return thresholds;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Node {
        private int featureIndex;
        private double threshold;
        private Node left;
        private Node right;
        private String label;
        
        public boolean isLeaf() {
            return label != null;
        }
        
        public static Node leaf(String label) {
            return Node.builder().label(label).build();
        }
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SplitResult {
        private int featureIndex;
        private double threshold;
        private double informationGain;
    }
}
