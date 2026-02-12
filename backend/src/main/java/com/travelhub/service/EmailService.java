package com.travelhub.service;

import com.travelhub.model.Booking;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import com.travelhub.model.User;
import com.travelhub.repository.UserRepository;

import java.util.UUID;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserRepository userRepository;

    @Value("${email.from}")
    private String fromEmail;

    // ❌ SUPPRIMER CETTE LIGNE (auto-injection récursive)
    // @Autowired
    // private EmailService emailService;

    public void sendBookingConfirmation(Booking booking, String userEmail) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(userEmail);
            helper.setSubject("Confirmation de réservation - " + booking.getBookingReference());

            String htmlContent = buildBookingConfirmationEmail(booking);
            helper.setText(htmlContent, true);

            mailSender.send(message);

            System.out.println("Email envoyé à : " + userEmail);

        } catch (MessagingException e) {
            System.err.println("Erreur envoi email : " + e.getMessage());
        }
    }

    private String buildBookingConfirmationEmail(Booking booking) {
        StringBuilder html = new StringBuilder();

        html.append("<!DOCTYPE html>");
        html.append("<html><head><style>");
        html.append("body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }");
        html.append(".container { max-width: 600px; margin: 0 auto; padding: 20px; }");
        html.append(".header { background-color: #007bff; color: white; padding: 20px; text-align: center; }");
        html.append(".content { padding: 20px; background-color: #f9f9f9; }");
        html.append(".booking-info { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #007bff; }");
        html.append(".footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }");
        html.append(".total { font-size: 20px; font-weight: bold; color: #007bff; }");
        html.append("</style></head><body>");

        html.append("<div class='container'>");
        html.append("<div class='header'>");
        html.append("<h1>TravelHub</h1>");
        html.append("<h2>Confirmation de Réservation</h2>");
        html.append("</div>");

        html.append("<div class='content'>");
        html.append("<p>Bonjour,</p>");
        html.append("<p>Votre réservation a été confirmée avec succès !</p>");

        html.append("<div class='booking-info'>");
        html.append("<h3>Détails de la réservation</h3>");
        html.append("<p><strong>Référence :</strong> ").append(booking.getBookingReference()).append("</p>");
        html.append("<p><strong>Date :</strong> ").append(booking.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))).append("</p>");
        html.append("<p><strong>Statut :</strong> ").append(booking.getStatus()).append("</p>");
        html.append("<p class='total'><strong>Total :</strong> ").append(String.format("%.2f %s", booking.getTotalPrice(), booking.getCurrency())).append("</p>");
        html.append("</div>");

        html.append("<p><strong>Nombre d'articles :</strong> ").append(booking.getItems().size()).append("</p>");

        html.append("<p>Vous pouvez télécharger votre facture depuis votre compte TravelHub.</p>");
        html.append("<p>Bon voyage !</p>");

        html.append("</div>");

        html.append("<div class='footer'>");
        html.append("<p>TravelHub - Votre partenaire voyage</p>");
        html.append("<p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>");
        html.append("</div>");

        html.append("</div>");
        html.append("</body></html>");

        return html.toString();
    }

    public void sendBookingCancellation(Booking booking, String userEmail) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(userEmail);
            helper.setSubject("Annulation de réservation - " + booking.getBookingReference());

            String htmlContent = buildCancellationEmail(booking);
            helper.setText(htmlContent, true);

            mailSender.send(message);

        } catch (MessagingException e) {
            System.err.println("Erreur envoi email annulation : " + e.getMessage());
        }
    }

    private String buildCancellationEmail(Booking booking) {
        return "<!DOCTYPE html><html><body style='font-family: Arial, sans-serif;'>" +
                "<div style='max-width: 600px; margin: 0 auto; padding: 20px;'>" +
                "<h2 style='color: #dc3545;'>Annulation de Réservation</h2>" +
                "<p>Votre réservation <strong>" + booking.getBookingReference() + "</strong> a été annulée.</p>" +
                "<p>Si vous avez des questions, contactez notre support.</p>" +
                "<p>Cordialement,<br>L'équipe TravelHub</p>" +
                "</div></body></html>";
    }

    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        System.out.println("=== DÉBUT ENVOI EMAIL RESET ===");
        System.out.println("Destinataire: " + toEmail);
        System.out.println("Token: " + resetToken);
        System.out.println("From email: " + fromEmail);

        try {
            String resetUrl = "http://localhost:3000/reset-password?token=" + resetToken;

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Réinitialisation de votre mot de passe - TravelHub");

            String htmlContent = buildPasswordResetEmail(resetUrl);
            helper.setText(htmlContent, true);

            System.out.println("✅ Tentative d'envoi...");
            mailSender.send(message);
            System.out.println("✅ Email de réinitialisation envoyé avec succès à : " + toEmail);

        } catch (MessagingException e) {
            System.err.println("❌ Erreur MessagingException : " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de l'envoi de l'email");
        } catch (Exception e) {
            System.err.println("❌ Erreur inattendue : " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de l'envoi de l'email");
        }

        System.out.println("=== FIN ENVOI EMAIL RESET ===");
    }

    private String buildPasswordResetEmail(String resetUrl) {
        return "<!DOCTYPE html><html><head><style>" +
                "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                ".header { background-color: #007bff; color: white; padding: 20px; text-align: center; }" +
                ".content { padding: 20px; background-color: #f9f9f9; }" +
                ".button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }" +
                ".footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }" +
                "</style></head><body>" +
                "<div class='container'>" +
                "<div class='header'><h1>TravelHub</h1></div>" +
                "<div class='content'>" +
                "<h2>Réinitialisation de mot de passe</h2>" +
                "<p>Bonjour,</p>" +
                "<p>Vous avez demandé à réinitialiser votre mot de passe.</p>" +
                "<p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>" +
                "<p style='text-align: center;'>" +
                "<a href='" + resetUrl + "' class='button'>Réinitialiser mon mot de passe</a>" +
                "</p>" +
                "<p>Ou copiez ce lien dans votre navigateur :</p>" +
                "<p style='word-break: break-all; color: #007bff;'>" + resetUrl + "</p>" +
                "<p><strong>Ce lien est valable pendant 24 heures.</strong></p>" +
                "<p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>" +
                "<p>Cordialement,<br>L'équipe TravelHub</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>TravelHub - Votre partenaire voyage</p>" +
                "<p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>" +
                "</div>" +
                "</div></body></html>";
    }
}