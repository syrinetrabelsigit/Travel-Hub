package com.travelhub.repository;

import com.travelhub.model.UserPreferences;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserPreferencesRepository extends MongoRepository<UserPreferences, String> {

    // Trouver les préférences d'un utilisateur
    Optional<UserPreferences> findByUserId(String userId);

    // Supprimer les préférences d'un utilisateur
    void deleteByUserId(String userId);
}