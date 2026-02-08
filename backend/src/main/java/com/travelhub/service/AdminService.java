package com.travelhub.service;

import com.travelhub.model.Booking;
import com.travelhub.model.Review;
import com.travelhub.model.User;
import com.travelhub.repository.BookingRepository;
import com.travelhub.repository.ReviewRepository;
import com.travelhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    // ==================== DASHBOARD STATS ====================
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Statistiques utilisateurs
        long totalUsers = userRepository.count();
        long newUsersThisMonth = userRepository.countByCreatedAtAfter(
                LocalDateTime.now().minusMonths(1)
        );

        // Statistiques réservations
        long totalBookings = bookingRepository.count();
        long pendingBookings = bookingRepository.countByStatus("PENDING");
        long confirmedBookings = bookingRepository.countByStatus("CONFIRMED");
        long cancelledBookings = bookingRepository.countByStatus("CANCELLED");

        // Statistiques avis
        long totalReviews = reviewRepository.count();
        long pendingReviews = reviewRepository.countByStatus("PENDING");
        long approvedReviews = reviewRepository.countByStatus("APPROVED");

        // Calculer le revenu total (exemple)
        double totalRevenue = bookingRepository.findAll().stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()))
                .mapToDouble(Booking::getTotalPrice)
                .sum();

        stats.put("totalUsers", totalUsers);
        stats.put("newUsersThisMonth", newUsersThisMonth);
        stats.put("totalBookings", totalBookings);
        stats.put("pendingBookings", pendingBookings);
        stats.put("confirmedBookings", confirmedBookings);
        stats.put("cancelledBookings", cancelledBookings);
        stats.put("totalReviews", totalReviews);
        stats.put("pendingReviews", pendingReviews);
        stats.put("approvedReviews", approvedReviews);
        stats.put("totalRevenue", totalRevenue);

        return stats;
    }

    // ==================== USER MANAGEMENT ====================
    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();
        users.forEach(user -> user.setPassword(null)); // Masquer les mots de passe
        return users;
    }

    public User getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        user.setPassword(null);
        return user;
    }

    public User updateUser(String id, User updatedUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setPhone(updatedUser.getPhone());
        user.setDateOfBirth(updatedUser.getDateOfBirth());
        user.setNationality(updatedUser.getNationality());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        savedUser.setPassword(null);
        return savedUser;
    }

    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Utilisateur non trouvé");
        }
        userRepository.deleteById(id);
    }

    public User updateUserRole(String id, String role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (!role.equals("USER") && !role.equals("ADMIN")) {
            throw new RuntimeException("Rôle invalide. Utilisez USER ou ADMIN");
        }

        user.setRole(role);
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);
        savedUser.setPassword(null);
        return savedUser;
    }

    // ==================== BOOKING MANAGEMENT ====================
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));
    }

    public Booking updateBookingStatus(String id, String status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

        // Valider le statut
        if (!status.matches("PENDING|CONFIRMED|CANCELLED|COMPLETED")) {
            throw new RuntimeException("Statut invalide");
        }

        booking.setStatus(status);
        booking.setUpdatedAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    public void deleteBooking(String id) {
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Réservation non trouvée");
        }
        bookingRepository.deleteById(id);
    }

    // ==================== REVIEW MANAGEMENT ====================
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public Review getReviewById(String id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avis non trouvé"));
    }

    public Review approveReview(String id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avis non trouvé"));

        review.setStatus("APPROVED");
        review.setUpdatedAt(LocalDateTime.now());

        return reviewRepository.save(review);
    }

    public Review rejectReview(String id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Avis non trouvé"));

        review.setStatus("REJECTED");
        review.setUpdatedAt(LocalDateTime.now());

        return reviewRepository.save(review);
    }

    public void deleteReview(String id) {
        if (!reviewRepository.existsById(id)) {
            throw new RuntimeException("Avis non trouvé");
        }
        reviewRepository.deleteById(id);
    }
}
