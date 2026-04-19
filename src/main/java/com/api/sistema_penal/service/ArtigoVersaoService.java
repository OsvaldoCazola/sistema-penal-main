package com.api.sistema_penal.service;

import com.api.sistema_penal.api.dto.legislacao.ArtigoVersaoResponse;
import com.api.sistema_penal.api.dto.legislacao.ComparacaoArtigoResponse;
import com.api.sistema_penal.api.dto.legislacao.ComparacaoArtigoResponse.DiferencaTexto;
import com.api.sistema_penal.api.dto.legislacao.ComparacaoArtigoResponse.VersaoDetalhe;
import com.api.sistema_penal.domain.entity.Artigo;
import com.api.sistema_penal.domain.entity.ArtigoVersao;
import com.api.sistema_penal.domain.repository.ArtigoRepository;
import com.api.sistema_penal.domain.repository.ArtigoVersaoRepository;
import com.api.sistema_penal.exception.BusinessException;
import com.api.sistema_penal.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ArtigoVersaoService {

    private final ArtigoRepository artigoRepository;
    private final ArtigoVersaoRepository versaoRepository;

    @Transactional(readOnly = true)
    public List<ArtigoVersaoResponse> listarVersoes(UUID artigoId) {
        return versaoRepository.findByArtigoIdOrderByVersaoDesc(artigoId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ArtigoVersaoResponse buscarVersao(UUID artigoId, Integer versao) {
        ArtigoVersao av = versaoRepository.findByArtigoIdAndVersao(artigoId, versao)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Versão %d do artigo não encontrada", versao)));
        return toResponse(av);
    }

    @Transactional
    public ArtigoVersaoResponse criarNovaVersao(UUID artigoId, String novoConteudo, 
                                                 String motivoAlteracao, String autorAlteracao,
                                                 String leiAlteradora, LocalDate dataVigencia) {
        Artigo artigo = artigoRepository.findById(artigoId)
                .orElseThrow(() -> new ResourceNotFoundException("Artigo", artigoId));

        Integer versaoAtual = versaoRepository.findMaxVersaoByArtigoId(artigoId).orElse(0);
        
        if (versaoAtual == 0) {
            ArtigoVersao versaoOriginal = ArtigoVersao.builder()
                    .artigo(artigo)
                    .versao(1)
                    .conteudo(artigo.getConteudo())
                    .dataVigencia(artigo.getCreatedAt() != null ? artigo.getCreatedAt().toLocalDate() : LocalDate.now())
                    .dataFimVigencia(dataVigencia != null ? dataVigencia.minusDays(1) : LocalDate.now().minusDays(1))
                    .motivoAlteracao("Versão original")
                    .build();
            versaoRepository.save(versaoOriginal);
            versaoAtual = 1;
        } else {
            versaoRepository.findVersaoAtualByArtigoId(artigoId).ifPresent(v -> {
                v.setDataFimVigencia(dataVigencia != null ? dataVigencia.minusDays(1) : LocalDate.now().minusDays(1));
                versaoRepository.save(v);
            });
        }

        ArtigoVersao novaVersao = ArtigoVersao.builder()
                .artigo(artigo)
                .versao(versaoAtual + 1)
                .conteudo(novoConteudo)
                .dataVigencia(dataVigencia != null ? dataVigencia : LocalDate.now())
                .motivoAlteracao(motivoAlteracao)
                .autorAlteracao(autorAlteracao)
                .leiAlteradora(leiAlteradora)
                .build();

        artigo.setConteudo(novoConteudo);
        artigoRepository.save(artigo);

        return toResponse(versaoRepository.save(novaVersao));
    }

    @Transactional(readOnly = true)
    public ComparacaoArtigoResponse compararVersoes(UUID artigoId, Integer versaoAntiga, Integer versaoNova) {
        Artigo artigo = artigoRepository.findById(artigoId)
                .orElseThrow(() -> new ResourceNotFoundException("Artigo", artigoId));

        ArtigoVersao vAntiga = versaoRepository.findByArtigoIdAndVersao(artigoId, versaoAntiga)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Versão %d não encontrada", versaoAntiga)));

        ArtigoVersao vNova = versaoRepository.findByArtigoIdAndVersao(artigoId, versaoNova)
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Versão %d não encontrada", versaoNova)));

        if (versaoAntiga >= versaoNova) {
            throw new BusinessException("A versão antiga deve ser menor que a versão nova");
        }

        List<DiferencaTexto> diferencas = calcularDiferencas(vAntiga.getConteudo(), vNova.getConteudo());
        String resumo = gerarResumoAlteracoes(diferencas, vNova.getMotivoAlteracao());

        String leiIdentificacao = String.format("%s %s/%d",
                artigo.getLei().getTipo(),
                artigo.getLei().getNumero(),
                artigo.getLei().getAno());

        return new ComparacaoArtigoResponse(
                artigoId,
                artigo.getNumero(),
                leiIdentificacao,
                new VersaoDetalhe(
                        vAntiga.getVersao(),
                        vAntiga.getConteudo(),
                        vAntiga.getDataVigencia(),
                        vAntiga.getMotivoAlteracao()
                ),
                new VersaoDetalhe(
                        vNova.getVersao(),
                        vNova.getConteudo(),
                        vNova.getDataVigencia(),
                        vNova.getMotivoAlteracao()
                ),
                diferencas,
                resumo
        );
    }

    @Transactional(readOnly = true)
    public ComparacaoArtigoResponse compararComAtual(UUID artigoId, Integer versaoAntiga) {
        Integer versaoAtual = versaoRepository.findMaxVersaoByArtigoId(artigoId)
                .orElseThrow(() -> new BusinessException("Artigo não possui versões registradas"));
        
        if (versaoAntiga >= versaoAtual) {
            throw new BusinessException("A versão especificada já é a versão atual");
        }

        return compararVersoes(artigoId, versaoAntiga, versaoAtual);
    }

    private List<DiferencaTexto> calcularDiferencas(String textoAntigo, String textoNovo) {
        List<DiferencaTexto> diferencas = new ArrayList<>();

        String[] linhasAntigas = textoAntigo.split("\n");
        String[] linhasNovas = textoNovo.split("\n");

        int maxLinhas = Math.max(linhasAntigas.length, linhasNovas.length);

        for (int i = 0; i < maxLinhas; i++) {
            String linhaAntiga = i < linhasAntigas.length ? linhasAntigas[i].trim() : "";
            String linhaNova = i < linhasNovas.length ? linhasNovas[i].trim() : "";

            if (!linhaAntiga.equals(linhaNova)) {
                String tipo;
                if (linhaAntiga.isEmpty() && !linhaNova.isEmpty()) {
                    tipo = "ADICAO";
                } else if (!linhaAntiga.isEmpty() && linhaNova.isEmpty()) {
                    tipo = "REMOCAO";
                } else {
                    tipo = "MODIFICACAO";
                }

                diferencas.add(new DiferencaTexto(
                        tipo,
                        linhaAntiga.isEmpty() ? null : linhaAntiga,
                        linhaNova.isEmpty() ? null : linhaNova,
                        i + 1,
                        i + 1
                ));
            }
        }

        return diferencas;
    }

    private String gerarResumoAlteracoes(List<DiferencaTexto> diferencas, String motivoOriginal) {
        if (diferencas.isEmpty()) {
            return "Nenhuma alteração detectada no texto.";
        }

        long adicoes = diferencas.stream().filter(d -> "ADICAO".equals(d.tipo())).count();
        long remocoes = diferencas.stream().filter(d -> "REMOCAO".equals(d.tipo())).count();
        long modificacoes = diferencas.stream().filter(d -> "MODIFICACAO".equals(d.tipo())).count();

        StringBuilder sb = new StringBuilder();
        sb.append("Resumo das alterações: ");
        
        List<String> partes = new ArrayList<>();
        if (adicoes > 0) partes.add(adicoes + " adição(ões)");
        if (remocoes > 0) partes.add(remocoes + " remoção(ões)");
        if (modificacoes > 0) partes.add(modificacoes + " modificação(ões)");
        
        sb.append(String.join(", ", partes)).append(".");

        if (motivoOriginal != null && !motivoOriginal.isBlank()) {
            sb.append(" Motivo: ").append(motivoOriginal);
        }

        return sb.toString();
    }

    private ArtigoVersaoResponse toResponse(ArtigoVersao av) {
        return new ArtigoVersaoResponse(
                av.getId(),
                av.getArtigo().getId(),
                av.getVersao(),
                av.getConteudo(),
                av.getDataVigencia(),
                av.getDataFimVigencia(),
                av.getMotivoAlteracao(),
                av.getAutorAlteracao()
        );
    }
}
