package com.travelhub.controller;

import com.travelhub.dto.AuthResponse;
import com.travelhub.dto.LoginRequest;
import com.travelhub.dto.MessageResponse;
import com.travelhub.dto.RegisterRequest;
import com.travelhub.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(new MessageResponse("Déconnexion réussie"));
    }

    // ✅ NOUVELLE MÉTHODE : Mot de passe oublié
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");

            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new MessageResponse("L'email est requis"));
            }

            authService.sendPasswordResetEmail(email);
            return ResponseEntity.ok(new MessageResponse("Email de réinitialisation envoyé avec succès"));
        } catch (RuntimeException e) {
            // Pour des raisons de sécurité, on retourne toujours un succès même si l'email n'existe pas
            return ResponseEntity.ok(new MessageResponse("Si cet email existe, un lien de réinitialisation a été envoyé"));
        }
    }

    // ✅ NOUVELLE MÉTHODE : Réinitialiser le mot de passe
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            String newPassword = request.get("newPassword");

            if (token == null || newPassword == null) {
                return ResponseEntity.badRequest().body(new MessageResponse("Token et nouveau mot de passe requis"));
            }

            authService.resetPassword(token, newPassword);
            return ResponseEntity.ok(new MessageResponse("Mot de passe réinitialisé avec succès"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}