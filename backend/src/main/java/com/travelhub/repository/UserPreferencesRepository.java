package com.travelhub.repository;

import com.travelhub.model.UserPreferences;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserPreferencesRepository extends MongoRepository<UserPreferences, String> {

    /**
     * Trouver les préférences par user ID
     */
    Optional<UserPreferences> findByUserId(String userId);

    /**
     * Vérifier si des préférences existent pour un user
     */
    boolean existsByUserId(String userId);

    /**
     * Supprimer les préférences d'un user
     */
    void deleteByUserId(String userId);
}