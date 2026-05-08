package com.api.sistema_penal.service;

import com.api.sistema_penal.domain.entity.CasoGeradoChat;
import com.api.sistema_penal.domain.entity.Usuario;
import com.api.sistema_penal.domain.repository.CasoGeradoChatRepository;
import com.api.sistema_penal.domain.entity.Artigo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.HashMap;
import java.util.stream.Collectors;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CasoGeradoChatService {

    private final CasoGeradoChatRepository casoGeradoChatRepository;

    @Transactional
    public CasoGeradoChat salvarCaso(UUID usuarioId, String tema, String descricao, String perguntaQuiz, String respostaCorreta, String artigosUsados) {
        CasoGeradoChat caso = CasoGeradoChat.builder()
                .usuarioId(usuarioId)
                .tema(tema)
                .descricao(descricao)
                .perguntaQuiz(perguntaQuiz)
                .respostaCorreta(respostaCorreta)
                .artigosUsados(artigosUsados)
                .build();
        return casoGeradoChatRepository.save(caso);
    }

    @Transactional(readOnly = true)
    public List<CasoGeradoChat> listarCasosAtivosPorUsuario(UUID usuarioId) {
        return casoGeradoChatRepository.findAtivosByUsuarioIdOrderByCriadoEmDesc(usuarioId);
    }

    @Transactional(readOnly = true)
    public long contarCasosAtivosPorUsuario(UUID usuarioId) {
        return casoGeradoChatRepository.countByUsuarioIdAndAtivoTrue(usuarioId);
    }

    @Transactional
    public void desativarCaso(UUID id) {
        CasoGeradoChat caso = casoGeradoChatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Caso não encontrado"));
        caso.setAtivo(false);
        casoGeradoChatRepository.save(caso);
    }

    /**
     * Lista casos disponíveis para o simulador no formato necessário pelo frontend.
     * @param usuarioId ID do usuário
     * @return Lista de mapas com id e descrição dos casos
     */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> listarCasosParaSimulador(UUID usuarioId) {
        return listarCasosAtivosPorUsuario(usuarioId).stream()
                .map(caso -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", caso.getId());
                    map.put("descricao", caso.getDescricao());
                    map.put("tema", caso.getTema());
                    return map;
                })
                .collect(Collectors.toList());
    }
}