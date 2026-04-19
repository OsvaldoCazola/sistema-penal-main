package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.AnalysisHashRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AnalysisHashRecordRepository extends JpaRepository<AnalysisHashRecord, UUID> {
    
    Optional<AnalysisHashRecord> findByAnalysisId(UUID analysisId);
    
    boolean existsByAnalysisId(UUID analysisId);
}
