package com.travelhub.repository;

import com.travelhub.model.Cart;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends MongoRepository<Cart, String> {

    // Trouver le panier d'un utilisateur
    Optional<Cart> findByUserId(String userId);

    // Supprimer le panier d'un utilisateur
    void deleteByUserId(String userId);
}