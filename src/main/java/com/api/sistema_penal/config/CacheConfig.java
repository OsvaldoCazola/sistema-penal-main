package com.api.sistema_penal.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuração de cache em memória (ConcurrentMapCacheManager).
 *
 * Não requer Redis — funciona tanto em desenvolvimento (H2) como em produção.
 * Para produção com múltiplos pods, substituir por RedisCacheManager.
 *
 * Caches registados devem corresponder exactamente aos nomes usados
 * em @Cacheable, @CacheEvict e @CachePut nos Services.
 */
@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager(
            // ── Configurações do sistema ─────────────────────────
            "configuracoes",
            "configuracoes-valor",

            // ── Domínio jurídico ─────────────────────────────────
            "tipos-crime",
            "categorias-crime",
            "circunstancias",
            "regras-penais",
            "tribunais",

            // ── Legislação ────────────────────────────────────────
            "leis",
            "leis-resumo",
            "artigos",
            "artigos-lei",
            "elementos-juridicos",
            "penalidades",

            // ── Dashboard e estatísticas ─────────────────────────
            "estatisticas",
            "dashboard",

            // ── Processos e sentenças ────────────────────────────
            "processos",
            "sentencas",

            // ── Simulações ────────────────────────────────────────
            "simulacoes"
        );
    }
}
