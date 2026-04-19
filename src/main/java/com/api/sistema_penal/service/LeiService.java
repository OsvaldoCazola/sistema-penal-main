package com.api.sistema_penal.service;

import com.api.sistema_penal.api.dto.legislacao.*;
import com.api.sistema_penal.domain.entity.*;
import com.api.sistema_penal.domain.repository.*;
import com.api.sistema_penal.exception.BusinessException;
import com.api.sistema_penal.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class LeiService {

    private final LeiRepository leiRepository;
    private final ArtigoRepository artigoRepository;
    private final ElementoJuridicoRepository elementoJuridicoRepository;
    private final PenalidadeRepository penalidadeRepository;
    private final CategoriaCrimeRepository categoriaCrimeRepository;
    private final LeiIntegridadeRepository leiIntegridadeRepository;

    @Transactional(readOnly = true)
    public Page<LeiSummaryResponse> listar(Pageable pageable) {
        return leiRepository.findAll(pageable).map(LeiSummaryResponse::from);
    }

    @Transactional(readOnly = true)
    public Page<LeiSummaryResponse> listarPorTipo(String tipo, Pageable pageable) {
        return leiRepository.findByTipo(tipo, pageable).map(LeiSummaryResponse::from);
    }

    @Transactional(readOnly = true)
    public Page<LeiSummaryResponse> listarPorAno(Integer ano, Pageable pageable) {
        return leiRepository.findByAno(ano, pageable).map(LeiSummaryResponse::from);
    }

    @Transactional(readOnly = true)
    public LeiResponse buscarPorId(UUID id) {
        Lei lei = leiRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lei", id));
        return LeiResponse.from(lei);
    }

    @Transactional(readOnly = true)
    public LeiResponse buscarPorIdentificacao(String tipo, String numero, Integer ano) {
        Lei lei = leiRepository.findByTipoAndNumeroAndAno(tipo, numero, ano)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Lei %s %s/%d não encontrada", tipo, numero, ano)));
        return LeiResponse.from(lei);
    }

    @Transactional(readOnly = true)
    public Page<LeiSummaryResponse> buscarPorTexto(String termo, Pageable pageable) {
        return leiRepository.buscarPorTexto(termo, pageable).map(LeiSummaryResponse::from);
    }

    @Transactional(readOnly = true)
    public Page<ArtigoResponse> buscarArtigosPorTexto(String termo, Pageable pageable) {
        return artigoRepository.buscarPorTexto(termo, pageable).map(ArtigoResponse::from);
    }

    @Transactional
    public LeiResponse criar(LeiRequest request) {
        if (leiRepository.existsByTipoAndNumeroAndAno(request.tipo(), request.numero(), request.ano())) {
            throw new BusinessException("Lei já cadastrada: " + request.tipo() + " " + request.numero() + "/" + request.ano());
        }

        Lei lei = Lei.builder()
                .tipo(request.tipo().toUpperCase())
                .numero(request.numero())
                .ano(request.ano())
                .titulo(request.titulo())
                .ementa(request.ementa())
                .conteudo(request.conteudo())
                .dataPublicacao(request.dataPublicacao())
                .dataVigencia(request.dataVigencia())
                .fonteUrl(request.fonteUrl())
                .metadata(request.metadata() != null ? request.metadata() : new java.util.HashMap<>())
                .build();

        if (request.artigos() != null) {
            IntStream.range(0, request.artigos().size()).forEach(i -> {
                ArtigoRequest ar = request.artigos().get(i);
                Artigo artigo = criarArtigo(ar, i);
                lei.addArtigo(artigo);
            });
        }

        Lei leiSalva = leiRepository.save(lei);
        
        // Criar registro de integridade
        criarIntegridade(leiSalva);
        
        return LeiResponse.from(leiSalva);
    }

    @Transactional
    public LeiResponse atualizar(UUID id, LeiRequest request) {
        Lei lei = leiRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lei", id));

        lei.setTitulo(request.titulo());
        lei.setEmenta(request.ementa());
        lei.setConteudo(request.conteudo());
        lei.setDataPublicacao(request.dataPublicacao());
        lei.setDataVigencia(request.dataVigencia());
        lei.setFonteUrl(request.fonteUrl());
        if (request.metadata() != null) {
            lei.setMetadata(request.metadata());
        }

        Lei leiSalva = leiRepository.save(lei);
        
        // Atualizar registro de integridade
        criarIntegridade(leiSalva);
        
        return LeiResponse.from(leiSalva);
    }

    @Transactional
    public void alterarStatus(UUID id, Lei.StatusLei novoStatus) {
        Lei lei = leiRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lei", id));
        lei.setStatus(novoStatus);
        leiRepository.save(lei);
    }

    @Transactional
    public void excluir(UUID id) {
        if (!leiRepository.existsById(id)) {
            throw new ResourceNotFoundException("Lei", id);
        }
        leiRepository.deleteById(id);
    }

    @Transactional
    public ArtigoResponse adicionarArtigo(UUID leiId, ArtigoRequest request) {
        Lei lei = leiRepository.findById(leiId)
                .orElseThrow(() -> new ResourceNotFoundException("Lei", leiId));

        int ordem = request.ordem() != null ? request.ordem() : lei.getArtigos().size();
        Artigo artigo = criarArtigo(request, ordem);
        
        // Processar elementos jurídicos
        if (request.elementosJuridicos() != null) {
            request.elementosJuridicos().forEach(ej -> {
                ElementoJuridico elemento = criarElementoJuridico(ej, artigo);
                artigo.getElementosJuridicos().add(elemento);
            });
        }
        
        // Processar penalidades
        if (request.penalidades() != null) {
            request.penalidades().forEach(p -> {
                Penalidade penalidade = criarPenalidade(p, artigo);
                artigo.getPenalidades().add(penalidade);
            });
        }
        
        lei.addArtigo(artigo);
        leiRepository.save(lei);

        // Atualizar integridade
        criarIntegridade(lei);

        return ArtigoResponse.from(artigo);
    }

    @Transactional(readOnly = true)
    public List<ArtigoResponse> listarArtigos(UUID leiId) {
        return artigoRepository.findByLeiIdOrderByOrdemAsc(leiId)
                .stream()
                .map(ArtigoResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<String> listarTipos() {
        return leiRepository.findAllTipos();
    }

    @Transactional(readOnly = true)
    public List<Integer> listarAnos() {
        return leiRepository.findAllAnos();
    }

    // Métodos para Elementos Jurídicos
    @Transactional
    public ElementoJuridicoResponse adicionarElementoJuridico(UUID artigoId, ElementoJuridicoRequest request) {
        Artigo artigo = artigoRepository.findById(artigoId)
                .orElseThrow(() -> new ResourceNotFoundException("Artigo", artigoId));
        
        ElementoJuridico elemento = criarElementoJuridico(request, artigo);
        artigo.getElementosJuridicos().add(elemento);
        artigoRepository.save(artigo);
        
        return ElementoJuridicoResponse.from(elemento);
    }

    @Transactional(readOnly = true)
    public List<ElementoJuridicoResponse> listarElementosJuridicos(UUID artigoId) {
        return elementoJuridicoRepository.findByArtigoIdOrderByOrdemAsc(artigoId)
                .stream()
                .map(ElementoJuridicoResponse::from)
                .toList();
    }

    @Transactional
    public void excluirElementoJuridico(UUID elementoId) {
        elementoJuridicoRepository.deleteById(elementoId);
    }

    // Métodos para Penalidades
    @Transactional
    public PenalidadeResponse adicionarPenalidade(UUID artigoId, PenalidadeRequest request) {
        Artigo artigo = artigoRepository.findById(artigoId)
                .orElseThrow(() -> new ResourceNotFoundException("Artigo", artigoId));
        
        Penalidade penalidade = criarPenalidade(request, artigo);
        artigo.getPenalidades().add(penalidade);
        artigoRepository.save(artigo);
        
        return PenalidadeResponse.from(penalidade);
    }

    @Transactional(readOnly = true)
    public List<PenalidadeResponse> listarPenalidades(UUID artigoId) {
        return penalidadeRepository.findByArtigoId(artigoId)
                .stream()
                .map(PenalidadeResponse::from)
                .toList();
    }

    @Transactional
    public void excluirPenalidade(UUID penalidadeId) {
        penalidadeRepository.deleteById(penalidadeId);
    }

    // Métodos para Categorias de Crime
    @Transactional
    public CategoriaCrimeResponse criarCategoria(CategoriaCrimeRequest request) {
        CategoriaCrime categoria = CategoriaCrime.builder()
                .nome(request.nome())
                .descricao(request.descricao())
                .codigo(request.codigo())
                .build();
        
        return CategoriaCrimeResponse.from(categoriaCrimeRepository.save(categoria));
    }

    @Transactional(readOnly = true)
    public List<CategoriaCrimeResponse> listarCategorias() {
        return categoriaCrimeRepository.findAll()
                .stream()
                .map(CategoriaCrimeResponse::from)
                .toList();
    }

    @Transactional
    public CategoriaCrimeResponse adicionarArtigoCategoria(UUID artigoId, UUID categoriaId) {
        Artigo artigo = artigoRepository.findById(artigoId)
                .orElseThrow(() -> new ResourceNotFoundException("Artigo", artigoId));
        
        CategoriaCrime categoria = categoriaCrimeRepository.findById(categoriaId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria", categoriaId));
        
        artigo.getCategorias().add(categoria);
        artigoRepository.save(artigo);
        
        return CategoriaCrimeResponse.from(categoria);
    }

    // Métodos para Integridade
    @Transactional(readOnly = true)
    public LeiIntegridadeResponse buscarIntegridade(UUID leiId) {
        return leiIntegridadeRepository.findByLeiId(leiId)
                .map(LeiIntegridadeResponse::from)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public List<LeiIntegridadeResponse> buscarHistoricoIntegridade(UUID leiId) {
        return leiIntegridadeRepository.buscarHistoricoPorLeiId(leiId)
                .stream()
                .map(LeiIntegridadeResponse::from)
                .toList();
    }

    @Transactional
    public LeiIntegridadeResponse verificarIntegridade(UUID leiId) {
        Lei lei = leiRepository.findById(leiId)
                .orElseThrow(() -> new ResourceNotFoundException("Lei", leiId));
        
        return criarIntegridade(lei);
    }

    // Métodos privados de criação
    private Artigo criarArtigo(ArtigoRequest request, int ordem) {
        Artigo artigo = Artigo.builder()
                .numero(request.numero())
                .titulo(request.titulo())
                .conteudo(request.conteudo())
                .tipoPenal(request.tipoPenal())
                .penaMinAnos(request.penaMinAnos())
                .penaMaxAnos(request.penaMaxAnos())
                .ordem(request.ordem() != null ? request.ordem() : ordem)
                .build();

        if (request.subdivisoes() != null) {
            artigo.setSubdivisoes(request.subdivisoes().stream()
                    .map(this::mapSubdivisao)
                    .toList());
        }

        return artigo;
    }

    private Artigo.Subdivisao mapSubdivisao(ArtigoRequest.SubdivisaoRequest sr) {
        return Artigo.Subdivisao.builder()
                .tipo(sr.tipo())
                .numero(sr.numero())
                .conteudo(sr.conteudo())
                .filhos(sr.filhos() != null ? sr.filhos().stream().map(this::mapSubdivisao).toList() : null)
                .build();
    }

    private ElementoJuridico criarElementoJuridico(ElementoJuridicoRequest request, Artigo artigo) {
        return ElementoJuridico.builder()
                .artigo(artigo)
                .tipo(request.tipo())
                .conteudo(request.conteudo())
                .ordem(request.ordem())
                .descricao(request.descricao())
                .build();
    }

    private Penalidade criarPenalidade(PenalidadeRequest request, Artigo artigo) {
        return Penalidade.builder()
                .artigo(artigo)
                .tipoPena(request.tipoPena())
                .penaMinAnos(request.penaMinAnos())
                .penaMinMeses(request.penaMinMeses())
                .penaMinDias(request.penaMinDias())
                .penaMaxAnos(request.penaMaxAnos())
                .penaMaxMeses(request.penaMaxMeses())
                .penaMaxDias(request.penaMaxDias())
                .multaMin(request.multaMin())
                .multaMax(request.multaMax())
                .descricao(request.descricao())
                .regime(request.regime())
                .flagrante(request.flagrante())
                .detencao(request.detencao())
                .reclusao(request.reclusao())
                .build();
    }

    private LeiIntegridadeResponse criarIntegridade(Lei lei) {
        String conteudo = String.format("%s|%s|%s|%s|%s",
                lei.getTipo(),
                lei.getNumero(),
                lei.getAno(),
                lei.getTitulo() != null ? lei.getTitulo() : "",
                lei.getConteudo() != null ? lei.getConteudo() : "");
        
        String hash = gerarHash(conteudo);
        
        LeiIntegridade integridade = LeiIntegridade.builder()
                .lei(lei)
                .hash(hash)
                .hashConteudo(gerarHash(lei.getConteudo() != null ? lei.getConteudo() : ""))
                .dataVerificacao(LocalDateTime.now())
                .statusVerificacao("VERIFICADO")
                .versaoLei(1)
                .build();
        
        return LeiIntegridadeResponse.from(leiIntegridadeRepository.save(integridade));
    }

    private String gerarHash(String conteudo) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(conteudo.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new BusinessException("Erro ao gerar hash de integridade");
        }
    }
}
