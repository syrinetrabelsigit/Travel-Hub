package com.travelhub.repository;

import com.travelhub.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    // Trouver toutes les réservations d'un utilisateur
    List<Booking> findByUserId(String userId);

    // Trouver une réservation par référence
    Optional<Booking> findByBookingReference(String bookingReference);

    // Trouver les réservations par statut
    List<Booking> findByUserIdAndStatus(String userId, String status);

    // Compter les réservations par statut
    long countByStatus(String status);
}