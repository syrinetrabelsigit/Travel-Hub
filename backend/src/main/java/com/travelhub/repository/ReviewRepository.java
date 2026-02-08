package com.travelhub.repository;

import com.travelhub.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {

    // Trouver tous les avis d'un item (vol, hôtel, activité)
    List<Review> findByItemTypeAndItemId(String itemType, String itemId);

    // Trouver tous les avis d'un utilisateur
    List<Review> findByUserId(String userId);

    // Trouver les avis approuvés pour un item
    List<Review> findByItemTypeAndItemIdAndStatus(String itemType, String itemId, String status);

    // Compter les avis par statut
    long countByStatus(String status);
}