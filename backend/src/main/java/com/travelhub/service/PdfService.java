package com.travelhub.service;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.travelhub.model.Booking;
import com.travelhub.model.CartItem;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Service
public class PdfService {

    public byte[] generateInvoice(Booking booking) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // ========== EN-TÊTE ==========
            Paragraph header = new Paragraph("TRAVELHUB")
                    .setFontSize(24)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontColor(ColorConstants.BLUE);
            document.add(header);

            Paragraph subHeader = new Paragraph("Facture de Réservation")
                    .setFontSize(16)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(subHeader);

            // ========== INFORMATIONS RÉSERVATION ==========
            document.add(new Paragraph("Référence : " + booking.getBookingReference())
                    .setBold()
                    .setFontSize(12));

            document.add(new Paragraph("Date : " +
                    booking.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")))
                    .setFontSize(10));

            document.add(new Paragraph("Statut : " + booking.getStatus().toUpperCase())
                    .setFontSize(10)
                    .setMarginBottom(20));

            // ========== TABLEAU DES ARTICLES ==========
            float[] columnWidths = {4, 1, 1, 1};
            Table table = new Table(UnitValue.createPercentArray(columnWidths));
            table.setWidth(UnitValue.createPercentValue(100));

            // En-têtes du tableau
            table.addHeaderCell(new Cell().add(new Paragraph("Article").setBold())
                    .setBackgroundColor(ColorConstants.LIGHT_GRAY));
            table.addHeaderCell(new Cell().add(new Paragraph("Type").setBold())
                    .setBackgroundColor(ColorConstants.LIGHT_GRAY));
            table.addHeaderCell(new Cell().add(new Paragraph("Qté").setBold())
                    .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                    .setTextAlignment(TextAlignment.CENTER));
            table.addHeaderCell(new Cell().add(new Paragraph("Prix").setBold())
                    .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                    .setTextAlignment(TextAlignment.RIGHT));

            // Lignes du tableau
            for (CartItem item : booking.getItems()) {
                table.addCell(new Cell().add(new Paragraph(item.getItemId())));
                table.addCell(new Cell().add(new Paragraph(item.getType())));
                table.addCell(new Cell().add(new Paragraph(String.valueOf(item.getQuantity())))
                        .setTextAlignment(TextAlignment.CENTER));
                table.addCell(new Cell().add(new Paragraph(
                                String.format("%.2f €", item.getPrice() * item.getQuantity())))
                        .setTextAlignment(TextAlignment.RIGHT));
            }

            document.add(table);
            document.add(new Paragraph("\n"));

            // ========== TOTAL ==========
            Table totalTable = new Table(new float[]{4, 1});
            totalTable.setWidth(UnitValue.createPercentValue(100));

            totalTable.addCell(new Cell().add(new Paragraph("TOTAL").setBold().setFontSize(14))
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setBorder(null));
            totalTable.addCell(new Cell().add(new Paragraph(
                            String.format("%.2f %s", booking.getTotalPrice(), booking.getCurrency()))
                            .setBold()
                            .setFontSize(14)
                            .setFontColor(ColorConstants.BLUE))
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setBorder(null));

            document.add(totalTable);
            document.add(new Paragraph("\n"));

            // ========== INFORMATIONS PAIEMENT ==========
            if (booking.getPaymentStatus() != null) {
                document.add(new Paragraph("Statut du paiement : " + booking.getPaymentStatus().toUpperCase())
                        .setFontSize(10)
                        .setItalic());
            }

            if (booking.getStripePaymentId() != null) {
                document.add(new Paragraph("ID Transaction : " + booking.getStripePaymentId())
                        .setFontSize(8)
                        .setItalic()
                        .setMarginBottom(20));
            }

            // ========== PIED DE PAGE ==========
            document.add(new Paragraph("\n\n"));
            document.add(new Paragraph("Merci d'avoir choisi TravelHub !")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setItalic()
                    .setFontSize(12));

            document.add(new Paragraph("Pour toute question : contact@travelhub.com")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(8)
                    .setFontColor(ColorConstants.GRAY));

            document.close();

            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Erreur génération PDF: " + e.getMessage());
        }
    }
}