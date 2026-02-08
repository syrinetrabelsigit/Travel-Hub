package com.travelhub.repository;

import com.travelhub.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    // Trouver un utilisateur par email
    Optional<User> findByEmail(String email);

    // Vérifier si un email existe
    boolean existsByEmail(String email);

    // Méthode pour compter les utilisateurs créés après une date
    long countByCreatedAtAfter(LocalDateTime date);
}