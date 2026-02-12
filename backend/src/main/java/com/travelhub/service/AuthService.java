package com.travelhub.service;

import com.travelhub.dto.AuthResponse;
import com.travelhub.dto.LoginRequest;
import com.travelhub.dto.RegisterRequest;
import com.travelhub.model.User;
import com.travelhub.model.PasswordResetToken;
import com.travelhub.repository.UserRepository;
import com.travelhub.repository.PasswordResetTokenRepository;
import com.travelhub.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService; // ✅ AJOUTER

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository; // ✅ AJOUTER

    public AuthResponse register(RegisterRequest request) {
        // Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email déjà utilisé");
        }

        // Créer le nouvel utilisateur
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // TEMPORAIRE : sans hashage
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setNationality(request.getNationality());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setRole("USER");

        User savedUser = userRepository.save(user);

        // Générer le token JWT
        String token = jwtUtil.generateToken(savedUser.getEmail());

        // Masquer le mot de passe avant de retourner
        savedUser.setPassword(null);

        return new AuthResponse(token, savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        // Récupérer l'utilisateur
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Vérifier le mot de passe (TEMPORAIRE : sans hashage)
        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect");
        }

        // Générer le token JWT
        String token = jwtUtil.generateToken(user.getEmail());

        // Masquer le mot de passe
        user.setPassword(null);

        return new AuthResponse(token, user);
    }

    /**
     * ✅ MÉTHODE CORRIGÉE - Envoie un vrai email
     */
    public void sendPasswordResetEmail(String email) {
        // Vérifier si l'utilisateur existe
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Supprimer les anciens tokens non utilisés de cet utilisateur
        passwordResetTokenRepository.deleteByUserIdAndUsedFalse(user.getId());

        // Générer un token de réinitialisation
        String resetToken = UUID.randomUUID().toString();

        // Sauvegarder le token dans la base de données
        PasswordResetToken passwordResetToken = new PasswordResetToken();
        passwordResetToken.setUserId(user.getId());
        passwordResetToken.setToken(resetToken);
        passwordResetToken.setExpiryDate(LocalDateTime.now().plusHours(24)); // Expire dans 24h
        passwordResetToken.setUsed(false);
        passwordResetToken.setCreatedAt(LocalDateTime.now());

        passwordResetTokenRepository.save(passwordResetToken);

        // ✅ ENVOYER L'EMAIL RÉEL via EmailService
        try {
            emailService.sendPasswordResetEmail(email, resetToken);
            System.out.println("✅ Email de réinitialisation envoyé à : " + email);
        } catch (Exception e) {
            System.err.println("❌ Erreur envoi email : " + e.getMessage());
            throw new RuntimeException("Erreur lors de l'envoi de l'email");
        }
    }

    /**
     * ✅ MÉTHODE CORRIGÉE - Réinitialise le mot de passe
     */
    public void resetPassword(String token, String newPassword) {
        // Récupérer le token de réinitialisation
        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenAndUsedFalse(token)
                .orElseThrow(() -> new RuntimeException("Token invalide ou expiré"));

        // Vérifier si le token a expiré
        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Le token a expiré");
        }

        // Récupérer l'utilisateur
        User user = userRepository.findById(resetToken.getUserId())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Mettre à jour le mot de passe
        user.setPassword(newPassword); // TEMPORAIRE : sans hashage
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        // Marquer le token comme utilisé
        resetToken.setUsed(true);
        resetToken.setUpdatedAt(LocalDateTime.now());
        passwordResetTokenRepository.save(resetToken);

        System.out.println("✅ Mot de passe réinitialisé pour : " + user.getEmail());
    }

    /**
     * ✅ NOUVELLE MÉTHODE - Vérifier si un token est valide
     */
    public boolean isResetTokenValid(String token) {
        try {
            PasswordResetToken resetToken = passwordResetTokenRepository
                    .findByTokenAndUsedFalse(token)
                    .orElse(null);

            if (resetToken == null) {
                return false;
            }

            // Vérifier si le token a expiré
            return resetToken.getExpiryDate().isAfter(LocalDateTime.now());

        } catch (Exception e) {
            return false;
        }
    }
}