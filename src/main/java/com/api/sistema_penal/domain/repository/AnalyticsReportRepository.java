package com.api.sistema_penal.domain.repository;

import com.api.sistema_penal.domain.entity.AnalyticsReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AnalyticsReportRepository extends JpaRepository<AnalyticsReport, UUID> {
    
    List<AnalyticsReport> findByReportType(String reportType);
    
    List<AnalyticsReport> findByCreatedBy_Id(UUID userId);
}
