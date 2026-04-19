package com.api.sistema_penal.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "analysis_hash_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalysisHashRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "analysis_id", nullable = false)
    private UUID analysisId;

    @Column(nullable = false, length = 64)
    private String hash;

    @Column(name = "content_type")
    private String contentType;

    @Column(name = "content_summary")
    private String contentSummary;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
