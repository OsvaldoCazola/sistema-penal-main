package com.api.sistema_penal.scheduler;

import com.api.sistema_penal.domain.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class CleanupJob {

    private final RefreshTokenRepository refreshTokenRepository;

    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void limparTokensExpirados() {
        log.info("Iniciando limpeza de tokens expirados");
        refreshTokenRepository.limparExpirados();
        log.info("Limpeza de tokens concluída");
    }
}
