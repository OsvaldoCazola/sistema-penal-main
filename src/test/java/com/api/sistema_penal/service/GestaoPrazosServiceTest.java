package com.api.sistema_penal.service;

import com.api.sistema_penal.api.dto.prazo.PrazoRequest;
import com.api.sistema_penal.api.dto.prazo.PrazoResponse;
import com.api.sistema_penal.domain.entity.Prazo;
import com.api.sistema_penal.domain.entity.Prazo.StatusPrazo;
import com.api.sistema_penal.domain.entity.Prazo.TipoPrazo;
import com.api.sistema_penal.domain.entity.Processo;
import com.api.sistema_penal.domain.entity.Usuario;
import com.api.sistema_penal.domain.repository.PrazoRepository;
import com.api.sistema_penal.domain.repository.ProcessoRepository;
import com.api.sistema_penal.domain.repository.UsuarioRepository;
import com.api.sistema_penal.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GestaoPrazosServiceTest {

    @Mock
    private PrazoRepository prazoRepository;

    @Mock
    private ProcessoRepository processoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private NotificacaoService notificacaoService;

    @InjectMocks
    private GestaoPrazosService gestaoPrazosService;

    private UUID usuarioId;
    private UUID prazoId;

    @BeforeEach
    void setUp() {
        usuarioId = UUID.randomUUID();
        prazoId = UUID.randomUUID();
    }

    @Test
    void testCriarPrazoComDadosValidos() {
        Usuario usuario = new Usuario();
        usuario.setId(usuarioId);
        usuario.setNome("Test User");
        
        when(usuarioRepository.findById(usuarioId)).thenReturn(Optional.of(usuario));
        when(prazoRepository.save(any(Prazo.class))).thenAnswer(invocation -> {
            Prazo p = invocation.getArgument(0);
            p.setId(UUID.randomUUID());
            return p;
        });

        PrazoRequest request = new PrazoRequest();
        request.setNome("Prazo Teste");
        request.setTipo(TipoPrazo.INVESTIGACAO);
        request.setDataInicio(LocalDate.now());
        request.setDataFim(LocalDate.now().plusDays(30));

        PrazoResponse response = gestaoPrazosService.criar(request, usuarioId);

        assertNotNull(response);
        verify(prazoRepository).save(any(Prazo.class));
    }

    @Test
    void testBuscarPrazoExistente() {
        Prazo prazo = new Prazo();
        prazo.setId(prazoId);
        prazo.setNome("Prazo Existente");
        prazo.setTipo(TipoPrazo.JULGAMENTO);
        prazo.setStatus(StatusPrazo.ATIVO);
        prazo.setDataInicio(LocalDate.now());
        prazo.setDataFim(LocalDate.now().plusDays(10));

        when(prazoRepository.findById(prazoId)).thenReturn(Optional.of(prazo));

        PrazoResponse response = gestaoPrazosService.buscarPorId(prazoId);

        assertNotNull(response);
    }

    @Test
    void testBuscarPrazoInexistente() {
        when(prazoRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, 
            () -> gestaoPrazosService.buscarPorId(UUID.randomUUID()));
    }

    @Test
    void testAtualizarPrazo() {
        Prazo prazo = new Prazo();
        prazo.setId(prazoId);
        prazo.setNome("Prazo Original");
        prazo.setTipo(TipoPrazo.INVESTIGACAO);
        prazo.setStatus(StatusPrazo.ATIVO);
        prazo.setDataInicio(LocalDate.now());
        prazo.setDataFim(LocalDate.now().plusDays(30));

        when(prazoRepository.findById(prazoId)).thenReturn(Optional.of(prazo));
        when(prazoRepository.save(any(Prazo.class))).thenReturn(prazo);

        PrazoRequest request = new PrazoRequest();
        request.setNome("Prazo Atualizado");
        request.setTipo(TipoPrazo.INSTRUCAO);
        request.setDataInicio(LocalDate.now());
        request.setDataFim(LocalDate.now().plusDays(45));

        PrazoResponse response = gestaoPrazosService.atualizar(prazoId, request);

        assertNotNull(response);
        verify(prazoRepository).save(any(Prazo.class));
    }

    @Test
    void testConcluirPrazo() {
        Prazo prazo = new Prazo();
        prazo.setId(prazoId);
        prazo.setNome("Prazo a Concluir");
        prazo.setTipo(TipoPrazo.RECURSO);
        prazo.setStatus(StatusPrazo.ATIVO);
        prazo.setDataInicio(LocalDate.now());
        prazo.setDataFim(LocalDate.now().plusDays(15));

        when(prazoRepository.findById(prazoId)).thenReturn(Optional.of(prazo));
        when(prazoRepository.save(any(Prazo.class))).thenReturn(prazo);

        PrazoResponse response = gestaoPrazosService.concluir(prazoId);

        assertNotNull(response);
        assertEquals(StatusPrazo.CUMPRIDO, prazo.getStatus());
    }

    @Test
    void testProrrogarPrazo() {
        LocalDate novaDataFim = LocalDate.now().plusDays(60);
        
        Prazo prazo = new Prazo();
        prazo.setId(prazoId);
        prazo.setNome("Prazo Original");
        prazo.setTipo(TipoPrazo.CUMPRIMENTO_PENA);
        prazo.setStatus(StatusPrazo.ATIVO);
        prazo.setDataInicio(LocalDate.now());
        prazo.setDataFim(LocalDate.now().plusDays(30));

        when(prazoRepository.findById(prazoId)).thenReturn(Optional.of(prazo));
        when(prazoRepository.save(any(Prazo.class))).thenReturn(prazo);

        PrazoResponse response = gestaoPrazosService.prorrogar(prazoId, novaDataFim, "Justificativa teste");

        assertNotNull(response);
        assertEquals(StatusPrazo.PRORROGADO, prazo.getStatus());
    }

    @Test
    void testCancelarPrazo() {
        Prazo prazo = new Prazo();
        prazo.setId(prazoId);
        prazo.setNome("Prazo a Cancelar");
        prazo.setTipo(TipoPrazo.OUTRO);
        prazo.setStatus(StatusPrazo.ATIVO);
        prazo.setDataInicio(LocalDate.now());
        prazo.setDataFim(LocalDate.now().plusDays(20));

        when(prazoRepository.findById(prazoId)).thenReturn(Optional.of(prazo));

        gestaoPrazosService.cancelar(prazoId);

        assertEquals(StatusPrazo.CANCELADO, prazo.getStatus());
        verify(prazoRepository).save(any(Prazo.class));
    }
}
