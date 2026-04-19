package com.api.sistema_penal.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class OpenAIService {

    @Value("${groq.api-key:}")
    private String apiKey;

    @Value("${groq.chat.options.model:llama-3.3-70b-versatile}")
    private String model;

    @Value("${groq.chat.options.temperature:0.7}")
    private double temperature;

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    private static final String OPENAI_API_URL = "https://api.groq.com/openai/v1/chat/completions";

    public OpenAIService() {
        this.objectMapper = new ObjectMapper();
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(30))
                .build();
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isEmpty() && !apiKey.isBlank() && !apiKey.equals("sua_chave_aqui");
    }

    public String chat(String systemPrompt, String userMessage, String contexto) {
        if (!isConfigured()) {
            log.warn("Groq API key não configurada");
            return null;
        }

        try {
            String fullUserMessage = userMessage;
            if (contexto != null && !contexto.isEmpty()) {
                fullUserMessage = "Contexto relevante:\n" + contexto + "\n\nPergunta: " + userMessage;
            }

            Map<String, Object> requestBody = Map.of(
                    "model", model,
                    "temperature", temperature,
                    "max_tokens", 2000,
                    "messages", List.of(
                            Map.of("role", "system", "content", systemPrompt),
                            Map.of("role", "user", "content", fullUserMessage)
                    )
            );

            String jsonBody = objectMapper.writeValueAsString(requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(OPENAI_API_URL))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .timeout(Duration.ofSeconds(60))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode jsonResponse = objectMapper.readTree(response.body());
                return jsonResponse
                        .path("choices")
                        .path(0)
                        .path("message")
                        .path("content")
                        .asText();
            } else {
                log.error("Erro na API OpenAI: {} - {}", response.statusCode(), response.body());
                return null;
            }
        } catch (Exception e) {
            log.error("Erro ao chamar OpenAI API: {}", e.getMessage(), e);
            return null;
        }
    }
}
