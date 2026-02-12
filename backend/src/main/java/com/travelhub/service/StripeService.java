package com.travelhub.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import com.travelhub.model.Booking;
import com.travelhub.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class StripeService {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Autowired
    private BookingRepository bookingRepository;

    public Map<String, Object> createPaymentIntent(String bookingId, Double amount, String currency) {
        // Initialiser Stripe avec la clé API
        Stripe.apiKey = stripeApiKey;

        try {
            // Convertir le montant en centimes (Stripe utilise les centimes)
            long amountInCents = (long) (amount * 100);

            // Créer le PaymentIntent
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInCents)
                    .setCurrency(currency.toLowerCase())
                    .putMetadata("bookingId", bookingId)
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            // ✅ Si bookingId existe et n'est pas "temp", mettre à jour la réservation
            if (bookingId != null && !bookingId.equals("temp")) {
                try {
                    Booking booking = bookingRepository.findById(bookingId).orElse(null);
                    if (booking != null) {
                        booking.setStripePaymentId(paymentIntent.getId());
                        booking.setPaymentStatus("pending");
                        booking.setUpdatedAt(LocalDateTime.now());
                        bookingRepository.save(booking);
                    }
                } catch (Exception e) {
                    System.err.println("Booking non trouvé (normal si créé après paiement): " + e.getMessage());
                }
            }

            // Retourner les informations
            Map<String, Object> response = new HashMap<>();
            response.put("clientSecret", paymentIntent.getClientSecret());
            response.put("paymentIntentId", paymentIntent.getId());
            response.put("amount", amount);
            response.put("currency", currency);

            return response;

        } catch (StripeException e) {
            throw new RuntimeException("Erreur Stripe: " + e.getMessage());
        }
    }

    public Map<String, Object> confirmPayment(String bookingId, String paymentIntentId) {
        Stripe.apiKey = stripeApiKey;

        try {
            // Récupérer le PaymentIntent
            PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);

            // Récupérer la réservation
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

            // Vérifier le statut du paiement
            if ("succeeded".equals(paymentIntent.getStatus())) {
                booking.setPaymentStatus("paid");
                booking.setStatus("confirmed");
                booking.setConfirmedAt(LocalDateTime.now());
                booking.setStripePaymentId(paymentIntentId); // ✅ Ajouter le payment ID
            } else if ("requires_action".equals(paymentIntent.getStatus())) {
                booking.setPaymentStatus("pending");
            } else {
                booking.setPaymentStatus("failed");
            }

            booking.setUpdatedAt(LocalDateTime.now());
            bookingRepository.save(booking);

            Map<String, Object> response = new HashMap<>();
            response.put("status", paymentIntent.getStatus());
            response.put("bookingId", bookingId);
            response.put("paymentStatus", booking.getPaymentStatus());

            return response;

        } catch (StripeException e) {
            throw new RuntimeException("Erreur Stripe: " + e.getMessage());
        }
    }

    public void handleWebhook(String payload, String sigHeader) {
        // TODO: Implémenter la vérification de signature et le traitement des webhooks
        System.out.println("Webhook reçu: " + payload);
    }

    public Map<String, Object> refundPayment(String bookingId) {
        Stripe.apiKey = stripeApiKey;

        try {
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

            if (booking.getStripePaymentId() == null) {
                throw new RuntimeException("Aucun paiement associé à cette réservation");
            }

            // Créer le remboursement
            Map<String, Object> refundParams = new HashMap<>();
            refundParams.put("payment_intent", booking.getStripePaymentId());

            com.stripe.model.Refund refund = com.stripe.model.Refund.create(refundParams);

            // Mettre à jour la réservation
            booking.setPaymentStatus("refunded");
            booking.setStatus("cancelled");
            booking.setUpdatedAt(LocalDateTime.now());
            bookingRepository.save(booking);

            Map<String, Object> response = new HashMap<>();
            response.put("refundId", refund.getId());
            response.put("status", refund.getStatus());
            response.put("bookingId", bookingId);

            return response;

        } catch (StripeException e) {
            throw new RuntimeException("Erreur Stripe: " + e.getMessage());
        }
    }
}