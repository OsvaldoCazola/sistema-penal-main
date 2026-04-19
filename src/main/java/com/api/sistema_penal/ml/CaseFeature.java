package com.api.sistema_penal.ml;

/**
 * Representa as características de um caso penal para o modelo de ML
 */
public class CaseFeature {
    
    private double violenceLevel;
    private double damageValue;
    private int numberOfVictims;
    private boolean recidivism;
    private boolean publicPlace;
    private boolean weaponUsed;
    private boolean forceUsed;
    private boolean deceptionUsed;
    private boolean confession;
    private boolean remorse;
    private boolean damageRepair;
    private boolean organizedCrime;
    private boolean flagrantDelict;
    private int agentAge;
    private boolean publicOfficial;
    private int victimRelationship;
    private int timeOfDay;
    
    public CaseFeature() {
        this.damageValue = 0;
        this.numberOfVictims = 0;
        this.agentAge = 25;
        this.victimRelationship = 0;
        this.timeOfDay = 12;
    }
    
    // Getters and Setters
    public double getViolenceLevel() { return violenceLevel; }
    public void setViolenceLevel(double violenceLevel) { this.violenceLevel = violenceLevel; }
    
    public double getDamageValue() { return damageValue; }
    public void setDamageValue(double damageValue) { this.damageValue = damageValue; }
    
    public int getNumberOfVictims() { return numberOfVictims; }
    public void setNumberOfVictims(int numberOfVictims) { this.numberOfVictims = numberOfVictims; }
    
    public boolean isRecidivism() { return recidivism; }
    public void setRecidivism(boolean recidivism) { this.recidivism = recidivism; }
    
    public boolean isPublicPlace() { return publicPlace; }
    public void setPublicPlace(boolean publicPlace) { this.publicPlace = publicPlace; }
    
    public boolean isWeaponUsed() { return weaponUsed; }
    public void setWeaponUsed(boolean weaponUsed) { this.weaponUsed = weaponUsed; }
    
    public boolean isForceUsed() { return forceUsed; }
    public void setForceUsed(boolean forceUsed) { this.forceUsed = forceUsed; }
    
    public boolean isDeceptionUsed() { return deceptionUsed; }
    public void setDeceptionUsed(boolean deceptionUsed) { this.deceptionUsed = deceptionUsed; }
    
    public boolean isConfession() { return confession; }
    public void setConfession(boolean confession) { this.confession = confession; }
    
    public boolean isRemorse() { return remorse; }
    public void setRemorse(boolean remorse) { this.remorse = remorse; }
    
    public boolean isDamageRepair() { return damageRepair; }
    public void setDamageRepair(boolean damageRepair) { this.damageRepair = damageRepair; }
    
    public boolean isOrganizedCrime() { return organizedCrime; }
    public void setOrganizedCrime(boolean organizedCrime) { this.organizedCrime = organizedCrime; }
    
    public boolean isFlagrantDelict() { return flagrantDelict; }
    public void setFlagrantDelict(boolean flagrantDelict) { this.flagrantDelict = flagrantDelict; }
    
    public int getAgentAge() { return agentAge; }
    public void setAgentAge(int agentAge) { this.agentAge = agentAge; }
    
    public boolean isPublicOfficial() { return publicOfficial; }
    public void setPublicOfficial(boolean publicOfficial) { this.publicOfficial = publicOfficial; }
    
    public int getVictimRelationship() { return victimRelationship; }
    public void setVictimRelationship(int victimRelationship) { this.victimRelationship = victimRelationship; }
    
    public int getTimeOfDay() { return timeOfDay; }
    public void setTimeOfDay(int timeOfDay) { this.timeOfDay = timeOfDay; }
    
    /**
     * Cria uma instância a partir de uma descrição de caso
     */
    public static CaseFeature fromDescription(String description, String tipoCrime) {
        CaseFeature feature = new CaseFeature();
        
        String desc = description.toLowerCase();
        
        // Analisar nível de violência
        if (desc.contains("matar") || desc.contains("morte") || desc.contains("homicídio")) {
            feature.setViolenceLevel(9.0);
            feature.setNumberOfVictims(1);
        } else if (desc.contains("agredir") || desc.contains("espancar") || desc.contains("lesão")) {
            feature.setViolenceLevel(7.0);
        } else if (desc.contains("ameaçar") || desc.contains("ameaça")) {
            feature.setViolenceLevel(3.0);
        } else if (desc.contains("subtrair") || desc.contains("furto")) {
            feature.setViolenceLevel(0.0);
        } else if (desc.contains("violência") || desc.contains("agressão")) {
            feature.setViolenceLevel(6.0);
        }
        
        // Analisar valor do dano
        if (desc.contains("elevado") || desc.contains("alto")) {
            feature.setDamageValue(100000);
        } else if (desc.contains("médio") || desc.contains("medio")) {
            feature.setDamageValue(50000);
        } else if (desc.contains("baixo") || desc.contains("pequeno")) {
            feature.setDamageValue(10000);
        }
        
        // Analisar outros indicadores
        feature.setRecidivism(desc.contains("reincidência") || desc.contains("reincidente"));
        feature.setPublicPlace(desc.contains("público") || desc.contains("rua") || desc.contains("local público"));
        feature.setWeaponUsed(desc.contains("arma") || desc.contains("faca") || desc.contains("revólver"));
        feature.setForceUsed(desc.contains("força") || desc.contains("violência") || desc.contains("violento"));
        feature.setDeceptionUsed(desc.contains("engano") || desc.contains("fraude") || desc.contains("mentira"));
        feature.setOrganizedCrime(desc.contains("organizado") || desc.contains("banda") || desc.contains("grupo"));
        
        return feature;
    }
    
    /**
     * Converte para array de doubles para o modelo
     */
    public double[] toArray() {
        return new double[] {
            violenceLevel,
            damageValue / 100000.0,
            (double) numberOfVictims,
            recidivism ? 1.0 : 0.0,
            publicPlace ? 1.0 : 0.0,
            weaponUsed ? 1.0 : 0.0,
            forceUsed ? 1.0 : 0.0,
            deceptionUsed ? 1.0 : 0.0,
            confession ? 1.0 : 0.0,
            remorse ? 1.0 : 0.0,
            damageRepair ? 1.0 : 0.0,
            organizedCrime ? 1.0 : 0.0,
            flagrantDelict ? 1.0 : 0.0,
            (double) agentAge / 100.0,
            publicOfficial ? 1.0 : 0.0,
            (double) victimRelationship / 2.0,
            (double) timeOfDay / 24.0
        };
    }
}
