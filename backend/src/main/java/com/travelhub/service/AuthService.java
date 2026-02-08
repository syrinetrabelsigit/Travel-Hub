package com.travelhub.service;

import com.travelhub.dto.AuthResponse;
import com.travelhub.dto.LoginRequest;
import com.travelhub.dto.RegisterRequest;
import com.travelhub.model.User;
import com.travelhub.repository.UserRepository;
import com.travelhub.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    // @Autowired
    // private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // @Autowired
    // private AuthenticationManager authenticationManager;

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
}