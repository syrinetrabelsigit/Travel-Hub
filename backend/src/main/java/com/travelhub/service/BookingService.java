package com.travelhub.service;

import com.travelhub.model.Booking;
import com.travelhub.model.Cart;
import com.travelhub.model.User;
import com.travelhub.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private CartService cartService;

    @Autowired
    private EmailService emailService;

    public List<Booking> getUserBookings() {
        User currentUser = userService.getCurrentUser();
        return bookingRepository.findByUserId(currentUser.getId());
    }

    public Booking getBookingById(String id) {
        User currentUser = userService.getCurrentUser();

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

        // Vérifier que la réservation appartient à l'utilisateur
        if (!booking.getUserId().equals(currentUser.getId())) {
            throw new RuntimeException("Accès non autorisé");
        }

        return booking;
    }

    public Booking createBooking() {
        User currentUser = userService.getCurrentUser();
        Cart cart = cartService.getCart();

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Le panier est vide");
        }

        // Créer la réservation
        Booking booking = new Booking();
        booking.setUserId(currentUser.getId());
        booking.setBookingReference("TH" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setItems(cart.getItems());
        booking.setTotalPrice(cart.getTotalPrice());
        booking.setCurrency("EUR");
        booking.setStatus("pending");
        booking.setPaymentStatus("pending");
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());

        Booking savedBooking = bookingRepository.save(booking);

        // Envoyer email de confirmation
        System.out.println("=== DÉBUT ENVOI EMAIL ===");
        System.out.println("User email: " + currentUser.getEmail());
        System.out.println("Booking ref: " + savedBooking.getBookingReference());

        try {
            emailService.sendBookingConfirmation(savedBooking, currentUser.getEmail());
            System.out.println("Email envoyé avec succès !");
        } catch (Exception e) {
            System.err.println("Erreur envoi email: " + e.getMessage());
            e.printStackTrace();
        }

        System.out.println("=== FIN ENVOI EMAIL ===");

        // Vider le panier
        cartService.clearCart();

        return savedBooking;
    }

    public Booking cancelBooking(String id) {
        Booking booking = getBookingById(id);

        if (!"pending".equals(booking.getStatus())) {
            throw new RuntimeException("Impossible d'annuler cette réservation");
        }

        booking.setStatus("cancelled");
        booking.setUpdatedAt(LocalDateTime.now());

        Booking cancelledBooking = bookingRepository.save(booking);

        // Envoyer email d'annulation
        try {
            User user = userService.getUserById(booking.getUserId());
            emailService.sendBookingCancellation(cancelledBooking, user.getEmail());
        } catch (Exception e) {
            System.err.println("Erreur envoi email annulation: " + e.getMessage());
        }

        return cancelledBooking;
    }
}