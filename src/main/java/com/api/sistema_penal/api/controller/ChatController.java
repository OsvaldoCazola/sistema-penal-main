package com.api.sistema_penal.api.controller;

import com.api.sistema_penal.api.dto.busca.BuscaSemanticaRequest;
import com.api.sistema_penal.api.dto.busca.BuscaSemanticaResponse;
import com.api.sistema_penal.service.BuscaSemanticaService;
import com.api.sistema_penal.service.OpenAIService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
@Tag(name = "Chat IA", description = "Assistente Jurídico com IA")
@SecurityRequirement(name = "bearerAuth")
public class ChatController {

    private final OpenAIService openAIService;
    private final BuscaSemanticaService buscaSemanticaService;

    private static final String SYSTEM_PROMPT = """
        Você é um assistente jurídico especializado em legislação angolana, 
        especificamente no Código Penal de Angola e legislação complementar.
        
        Sua função é:
        1. Responder perguntas sobre leis e artigos
        2. Explicar conceitos jurídicos de forma clara
        3. Sugerir artigos aplicáveis a casos específicos
        4. Fornecer informações sobre penas e procedimentos
        
        Sempre baseie suas respostas na legislação angolana vigente.
        Se não souber a resposta precise, diga que não sabe e sugira 
        consultar um advogado ou a legislação oficial.
        
        Mantenha suas respostas concisas, profissionais e jurídico.
        """;

    @PostMapping
    @PreAuthorize("hasAnyRole('JUIZ', 'PROCURADOR', 'ADVOGADO')")
    @Operation(summary = "Enviar mensagem ao assistente jurídico")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody ChatRequest request) {
        try {
            // Busca contexto relevante na base de dados
            String contexto = null;
            if (request.buscarContexto() != null && request.buscarContexto()) {
                var resultados = buscaSemanticaService.buscarPorSimilaridade(
                    new BuscaSemanticaRequest(request.mensagem(), null, 3, 0.1)
                );
                
                if (resultados != null && resultados.resultados() != null && !resultados.resultados().isEmpty()) {
                    StringBuilder contextBuilder = new StringBuilder();
                    for (BuscaSemanticaResponse.ResultadoSimples r : resultados.resultados()) {
                        contextBuilder.append("- ").append(r.titulo()).append(": ")
                            .append(r.resumo() != null ? r.resumo() : "").append("\n");
                    }
                    contexto = contextBuilder.toString();
                }
            }

            // Chama o OpenAI
            String resposta = openAIService.chat(
                SYSTEM_PROMPT,
                request.mensagem(),
                contexto
            );

            if (resposta == null) {
                return ResponseEntity.ok(Map.of(
                    "sucesso", false,
                    "mensagem", "Desculpe, não foi possível processar sua pergunta neste momento. "
                        + "Verifique se a API key do OpenAI está configurada."
                ));
            }

            return ResponseEntity.ok(Map.of(
                "sucesso", true,
                "resposta", resposta,
                "contextoUsado", contexto != null
            ));

        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "sucesso", false,
                "mensagem", "Erro ao processar pergunta: " + e.getMessage()
            ));
        }
    }

    public record ChatRequest(
        String mensagem,
        Boolean buscarContexto
    ) {
        public ChatRequest {
            if (buscarContexto == null) {
                buscarContexto = true;
            }
        }
    }
}
