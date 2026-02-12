package com.travelhub.service;

import com.travelhub.model.User;
import com.travelhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    // @Autowired
    // private PasswordEncoder passwordEncoder;

    public User getCurrentUser() {
        // Récupérer l'authentification depuis le contexte de sécurité
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Utilisateur non authentifié");
        }

        // Le principal contient l'email de l'utilisateur (configuré dans JwtAuthFilter)
        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }


    public User updateProfile(String token, User updatedUser) {
        User user = getCurrentUser();

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

    public void changePassword(String token, String currentPassword, String newPassword) {
        User user = getCurrentUser();

        // TEMPORAIRE (simple)
        user.setPassword(newPassword);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }
}