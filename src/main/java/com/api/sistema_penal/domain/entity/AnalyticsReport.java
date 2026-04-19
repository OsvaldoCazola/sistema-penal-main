package com.api.sistema_penal.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.validation.constraints.Size;

@Entity
@Table(name = "analytics_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsReport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "report_type", nullable = false)
    @Size(max = 100, message = "Tipo de relatório não pode exceder 100 caracteres")
    private String reportType;

    @Column(name = "report_name", nullable = false)
    @Size(min = 3, max = 200, message = "Nome do relatório deve ter entre 3 e 200 caracteres")
    private String reportName;

    @Column(columnDefinition = "TEXT")
    @Size(max = 2000, message = "Descrição não pode exceder 2000 caracteres")
    private String description;

    @Column(name = "data", columnDefinition = "TEXT")
    @Size(max = 5000000, message = "Dados do relatório não podem exceder 5MB")
    private String data;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private Usuario createdBy;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt;

    @PrePersist
    protected void onCreate() {
        generatedAt = LocalDateTime.now();
    }
}
