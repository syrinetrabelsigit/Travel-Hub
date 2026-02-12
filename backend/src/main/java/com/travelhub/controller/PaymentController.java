package com.travelhub.controller;

import com.travelhub.dto.MessageResponse;
import com.travelhub.dto.PaymentConfirmRequest;
import com.travelhub.dto.PaymentIntentRequest;
import com.travelhub.service.StripeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private StripeService stripeService;

    // ✅ ENDPOINT EXISTANT (avec DTO)
    @PostMapping("/create-intent")
    public ResponseEntity<?> createPaymentIntent(@RequestBody PaymentIntentRequest request) {
        try {
            Map<String, Object> response = stripeService.createPaymentIntent(
                    request.getBookingId(),
                    request.getAmount(),
                    request.getCurrency()
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // ✅ NOUVEAU ENDPOINT (avec Map - pour le frontend)
    @PostMapping("/create-payment-intent")
    public ResponseEntity<?> createPaymentIntentV2(@RequestBody Map<String, Object> paymentInfo) {
        try {
            // Extraire les données du Map
            Long amount = ((Number) paymentInfo.get("amount")).longValue();
            String currency = (String) paymentInfo.get("currency");
            String bookingId = (String) paymentInfo.getOrDefault("bookingId", "temp");

            // Convertir Long en Double pour le service
            Double amountDouble = amount / 100.0; // Convertir centimes en euros

            // Appeler le service
            Map<String, Object> response = stripeService.createPaymentIntent(
                    bookingId,
                    amountDouble,
                    currency
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmPayment(@RequestBody PaymentConfirmRequest request) {
        try {
            Map<String, Object> response = stripeService.confirmPayment(
                    request.getBookingId(),
                    request.getPaymentIntentId()
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            stripeService.handleWebhook(payload, sigHeader);
            return ResponseEntity.ok(new MessageResponse("Webhook traité avec succès"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/refund/{bookingId}")
    public ResponseEntity<?> refundPayment(@PathVariable String bookingId) {
        try {
            Map<String, Object> response = stripeService.refundPayment(bookingId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}