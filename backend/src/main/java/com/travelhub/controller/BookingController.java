package com.travelhub.controller;

import com.travelhub.dto.MessageResponse;
import com.travelhub.model.Booking;
import com.travelhub.service.BookingService;
import com.travelhub.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private PdfService pdfService;

    @Autowired
    private BookingService bookingService;

    /**
     * GET /api/bookings - Récupérer toutes les réservations de l'utilisateur
     * Le token est automatiquement géré par JwtAuthFilter
     */
    @GetMapping
    public ResponseEntity<?> getUserBookings() {
        try {
            List<Booking> bookings = bookingService.getUserBookings();
            return ResponseEntity.ok(bookings);
        } catch (RuntimeException e) {
            System.err.println("❌ Erreur getUserBookings: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    /**
     * GET /api/bookings/{id} - Récupérer une réservation par ID
     * Le token est automatiquement géré par JwtAuthFilter
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable String id) {
        try {
            Booking booking = bookingService.getBookingById(id);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            System.err.println("❌ Erreur getBookingById: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    /**
     * GET /api/bookings/{id}/invoice - Télécharger la facture PDF
     * Le token est automatiquement géré par JwtAuthFilter
     */
    @GetMapping("/{id}/invoice")
    public ResponseEntity<?> downloadInvoice(@PathVariable String id) {
        try {
            Booking booking = bookingService.getBookingById(id);
            byte[] pdfBytes = pdfService.generateInvoice(booking);

            return ResponseEntity.ok()
                    .header("Content-Type", "application/pdf")
                    .header("Content-Disposition", "attachment; filename=facture-" + booking.getBookingReference() + ".pdf")
                    .body(pdfBytes);
        } catch (RuntimeException e) {
            System.err.println("❌ Erreur downloadInvoice: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    /**
     * POST /api/bookings - Créer une nouvelle réservation
     * Le token est automatiquement géré par JwtAuthFilter
     */
    @PostMapping
    public ResponseEntity<?> createBooking() {
        try {
            Booking booking = bookingService.createBooking();
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            System.err.println("❌ Erreur createBooking: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    /**
     * PUT /api/bookings/{id}/cancel - Annuler une réservation
     * Le token est automatiquement géré par JwtAuthFilter
     */
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable String id) {
        try {
            Booking booking = bookingService.cancelBooking(id);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            System.err.println("❌ Erreur cancelBooking: " + e.getMessage());
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    /**
     * Confirmer une réservation après paiement
     * POST /api/bookings/{id}/confirm
     */
    @PostMapping("/{id}/confirm")
    public ResponseEntity<?> confirmBooking(
            @PathVariable String id,
            @RequestBody Map<String, String> paymentInfo
    ) {
        try {
            String stripePaymentId = paymentInfo.get("stripePaymentId");
            Booking booking = bookingService.confirmBooking(id, stripePaymentId);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}