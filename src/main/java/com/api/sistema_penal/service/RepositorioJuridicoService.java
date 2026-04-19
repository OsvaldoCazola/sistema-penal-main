package com.api.sistema_penal.service;

import com.api.sistema_penal.api.dto.simulador.CircunstanciaRequest;
import com.api.sistema_penal.api.dto.simulador.CircunstanciaResponse;
import com.api.sistema_penal.api.dto.simulador.TipoCrimeRequest;
import com.api.sistema_penal.api.dto.simulador.TipoCrimeResponse;
import com.api.sistema_penal.domain.entity.Artigo;
import com.api.sistema_penal.domain.entity.Circunstancia;
import com.api.sistema_penal.domain.entity.RegraPenal;
import com.api.sistema_penal.domain.entity.TipoCrime;
import com.api.sistema_penal.domain.repository.ArtigoRepository;
import com.api.sistema_penal.domain.repository.CircunstanciaRepository;
import com.api.sistema_penal.domain.repository.RegraPenalRepository;
import com.api.sistema_penal.domain.repository.TipoCrimeRepository;
import com.api.sistema_penal.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RepositorioJuridicoService {

    private final CircunstanciaRepository circunstanciasRepository;
    private final TipoCrimeRepository tipoCrimeRepository;
    private final RegraPenalRepository regraPenalRepository;
    private final ArtigoRepository artigoRepository;

    // ==================== CIRCUNSTÂNCIAS ====================

    @Transactional(readOnly = true)
    public List<CircunstanciaResponse> listarCircunstancias() {
        return circunstanciasRepository.findByAtivaTrue()
                .stream()
                .map(CircunstanciaResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CircunstanciaResponse> listarCircunstanciasPorTipo(Circunstancia.TipoCircunstancia tipo) {
        return circunstanciasRepository.findByTipoAndAtivaTrue(tipo)
                .stream()
                .map(CircunstanciaResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CircunstanciaResponse buscarCircunstanciaPorId(UUID id) {
        Circunstancia circunstancia = circunstanciasRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Circunstância", id));
        return CircunstanciaResponse.from(circunstancia);
    }

    @Transactional
    public CircunstanciaResponse criarCircunstancia(CircunstanciaRequest request) {
        Circunstancia circunstancia = Circunstancia.builder()
                .tipo(request.getTipo())
                .nome(request.getNome())
                .descricao(request.getDescricao())
                .percentualAlteracao(request.getPercentualAlteracao())
                .baseLegal(request.getBaseLegal())
                .ativa(true)
                .build();

        if (request.getArtigoId() != null) {
            Artigo artigo = artigoRepository.findById(request.getArtigoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Artigo", request.getArtigoId()));
            circunstancia.setArtigo(artigo);
        }

        return CircunstanciaResponse.from(circunstanciasRepository.save(circunstancia));
    }

    @Transactional
    public CircunstanciaResponse atualizarCircunstancia(UUID id, CircunstanciaRequest request) {
        Circunstancia circunstancia = circunstanciasRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Circunstância", id));

        circunstancia.setTipo(request.getTipo());
        circunstancia.setNome(request.getNome());
        circunstancia.setDescricao(request.getDescricao());
        circunstancia.setPercentualAlteracao(request.getPercentualAlteracao());
        circunstancia.setBaseLegal(request.getBaseLegal());

        if (request.getArtigoId() != null) {
            Artigo artigo = artigoRepository.findById(request.getArtigoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Artigo", request.getArtigoId()));
            circunstancia.setArtigo(artigo);
        }

        return CircunstanciaResponse.from(circunstanciasRepository.save(circunstancia));
    }

    @Transactional
    public void excluirCircunstancia(UUID id) {
        Circunstancia circunstancia = circunstanciasRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Circunstância", id));
        circunstancia.setAtiva(false);
        circunstanciasRepository.save(circunstancia);
    }

    // ==================== TIPOS DE CRIME ====================

    @Transactional(readOnly = true)
    public List<TipoCrimeResponse> listarTiposCrime() {
        return tipoCrimeRepository.findByAtivaTrue()
                .stream()
                .map(TipoCrimeResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TipoCrimeResponse> listarTiposCrimePorCategoria(TipoCrime.Categoria categoria) {
        return tipoCrimeRepository.findByCategoriaAndAtivaTrue(categoria)
                .stream()
                .map(TipoCrimeResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TipoCrimeResponse buscarTipoCrimePorId(UUID id) {
        TipoCrime tipoCrime = tipoCrimeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de Crime", id));
        return TipoCrimeResponse.from(tipoCrime);
    }

    @Transactional(readOnly = true)
    public List<TipoCrimeResponse> buscarTiposCrimePorTermo(String termo) {
        return tipoCrimeRepository.buscarPorTermo(termo)
                .stream()
                .map(TipoCrimeResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public TipoCrimeResponse criarTipoCrime(TipoCrimeRequest request) {
        TipoCrime tipoCrime = TipoCrime.builder()
                .nome(request.getNome())
                .nomePlural(request.getNomePlural())
                .descricao(request.getDescricao())
                .codigoPenal(request.getCodigoPenal())
                .categoria(request.getCategoria())
                .palavrasChave(request.getPalavrasChave())
                .ativa(true)
                .build();

        if (request.getArtigoIds() != null && !request.getArtigoIds().isEmpty()) {
            List<Artigo> artigos = artigoRepository.findAllById(request.getArtigoIds());
            tipoCrime.getArtigos().addAll(artigos);
        }

        return TipoCrimeResponse.from(tipoCrimeRepository.save(tipoCrime));
    }

    @Transactional
    public TipoCrimeResponse atualizarTipoCrime(UUID id, TipoCrimeRequest request) {
        TipoCrime tipoCrime = tipoCrimeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de Crime", id));

        tipoCrime.setNome(request.getNome());
        tipoCrime.setNomePlural(request.getNomePlural());
        tipoCrime.setDescricao(request.getDescricao());
        tipoCrime.setCodigoPenal(request.getCodigoPenal());
        tipoCrime.setCategoria(request.getCategoria());
        tipoCrime.setPalavrasChave(request.getPalavrasChave());

        if (request.getArtigoIds() != null) {
            List<Artigo> artigos = artigoRepository.findAllById(request.getArtigoIds());
            tipoCrime.getArtigos().clear();
            tipoCrime.getArtigos().addAll(artigos);
        }

        return TipoCrimeResponse.from(tipoCrimeRepository.save(tipoCrime));
    }

    @Transactional
    public void excluirTipoCrime(UUID id) {
        TipoCrime tipoCrime = tipoCrimeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de Crime", id));
        tipoCrime.setAtiva(false);
        tipoCrimeRepository.save(tipoCrime);
    }

    // ==================== REGRAS PENAIS ====================

    @Transactional(readOnly = true)
    public List<RegraPenal> listarRegrasPenal() {
        return regraPenalRepository.findByAtivaTrue();
    }

    @Transactional(readOnly = true)
    public List<RegraPenal> buscarRegrasPorArtigo(UUID artigoId) {
        return regraPenalRepository.findByArtigoIdOrderByOrdemAplicacaoAsc(artigoId);
    }

    // ==================== ARTIGOS ====================

    @Transactional(readOnly = true)
    public List<Artigo> listarTodosArtigos() {
        return artigoRepository.findAll();
    }
}
