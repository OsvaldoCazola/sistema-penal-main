package com.api.sistema_penal.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * Configuração centralizada do ObjectMapper para serialização JSON.
 * Configura o suporte para LocalDateTime e formatação de datas.
 * 
 * Esta configuração estende a autoconfiguração do Spring Boot usando
 * @ConditionalOnMissingBean para garantir que só será aplicada se
 * não existir outro ObjectMapper definido.
 */
@Configuration
public class JacksonConfig {

    @Bean
    @Primary
    @ConditionalOnMissingBean(ObjectMapper.class)
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        
        // Registrar módulo para suportar LocalDateTime
        mapper.registerModule(new JavaTimeModule());
        
        // Configurar serialização de datas para formato ISO-8601
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        
        return mapper;
    }
}
