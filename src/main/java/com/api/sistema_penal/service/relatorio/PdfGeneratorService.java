package com.api.sistema_penal.service.relatorio;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j
public class PdfGeneratorService {

    public byte[] gerarRelatorioProcessos(String titulo, String conteudo) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);
            
            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 18);
                contentStream.newLineAtOffset(50, 750);
                contentStream.showText(titulo);
                contentStream.endText();
                
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA, 10);
                contentStream.newLineAtOffset(50, 720);
                contentStream.showText("Gerado em: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
                contentStream.endText();
                
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA, 12);
                contentStream.newLineAtOffset(50, 680);
                contentStream.showText(conteudo);
                contentStream.endText();
            }
            
            document.save(baos);
            log.info("PDF gerado com sucesso");
            
        } catch (Exception e) {
            log.error("Erro ao gerar PDF: {}", e.getMessage());
        }
        
        return baos.toByteArray();
    }

    public byte[] gerarRelatorioSimples(String titulo, String[] colunas, Object[][] dados) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);
            
            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 16);
                contentStream.newLineAtOffset(50, 750);
                contentStream.showText(titulo);
                contentStream.endText();
                
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA, 10);
                contentStream.newLineAtOffset(50, 720);
                contentStream.showText("Gerado em: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
                contentStream.endText();
                
                float yPosition = 680;
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 10);
                contentStream.newLineAtOffset(50, yPosition);
                StringBuilder header = new StringBuilder();
                for (String coluna : colunas) {
                    header.append(coluna).append(" | ");
                }
                contentStream.showText(header.toString());
                contentStream.endText();
                
                yPosition -= 15;
                for (Object[] linha : dados) {
                    contentStream.beginText();
                    contentStream.setFont(PDType1Font.COURIER, 9);
                    contentStream.newLineAtOffset(50, yPosition);
                    StringBuilder row = new StringBuilder();
                    for (Object celula : linha) {
                        row.append(celula != null ? celula.toString() : "").append(" | ");
                    }
                    contentStream.showText(row.toString());
                    contentStream.endText();
                    yPosition -= 12;
                }
            }
            
            document.save(baos);
            log.info("PDF de relatório simples gerado");
            
        } catch (Exception e) {
            log.error("Erro ao gerar PDF: {}", e.getMessage());
        }
        
        return baos.toByteArray();
    }

    public byte[] gerarRelatorioPrazos(String[] colunas, Object[][] dados, String periodo) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);
            
            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 18);
                contentStream.newLineAtOffset(50, 750);
                contentStream.showText("Relatório de Prazos Processuais");
                contentStream.endText();
                
                if (periodo != null) {
                    contentStream.beginText();
                    contentStream.setFont(PDType1Font.HELVETICA, 12);
                    contentStream.newLineAtOffset(50, 720);
                    contentStream.showText("Período: " + periodo);
                    contentStream.endText();
                }
                
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA, 10);
                contentStream.newLineAtOffset(50, 695);
                contentStream.showText("Gerado em: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
                contentStream.endText();
                
                float yPosition = 660;
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 10);
                contentStream.newLineAtOffset(50, yPosition);
                StringBuilder header = new StringBuilder();
                for (String coluna : colunas) {
                    header.append(coluna).append(" | ");
                }
                contentStream.showText(header.toString());
                contentStream.endText();
                
                yPosition -= 15;
                for (Object[] linha : dados) {
                    contentStream.beginText();
                    contentStream.setFont(PDType1Font.COURIER, 9);
                    contentStream.newLineAtOffset(50, yPosition);
                    StringBuilder row = new StringBuilder();
                    for (Object celula : linha) {
                        row.append(celula != null ? celula.toString() : "").append(" | ");
                    }
                    contentStream.showText(row.toString());
                    contentStream.endText();
                    yPosition -= 12;
                }
            }
            
            document.save(baos);
            log.info("PDF de prazos gerado");
            
        } catch (Exception e) {
            log.error("Erro ao gerar PDF de prazos: {}", e.getMessage());
        }
        
        return baos.toByteArray();
    }
}
