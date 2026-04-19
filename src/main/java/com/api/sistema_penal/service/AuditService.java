package com.api.sistema_penal.service;

import com.api.sistema_penal.domain.entity.AuditLog;
import com.api.sistema_penal.domain.entity.Usuario;
import com.api.sistema_penal.domain.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @Async
    public void log(Usuario usuario, String acao, String entidade, UUID entidadeId, 
                    Map<String, Object> dados, String ip) {
        AuditLog log = AuditLog.builder()
                .usuario(usuario)
                .acao(acao)
                .entidade(entidade)
                .entidadeId(entidadeId)
                .dados(dados)
                .ip(ip)
                .build();

        auditLogRepository.save(log);
    }
}
