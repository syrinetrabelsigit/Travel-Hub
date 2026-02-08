package com.travelhub.service;

import com.travelhub.model.User;
import com.travelhub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.crypto.password.PasswordEncoder;
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

    public User getCurrentUser(String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (!jwtService.validateToken(token)) {
            throw new RuntimeException("Token invalide");
        }

        String email = jwtService.extractUserId(token); // email depuis JWT

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
    }


    public User getCurrentUser() {
        throw new RuntimeException(
                "getCurrentUser() sans token n'est plus autorisé. Passe le token depuis le controller."
        );
    }


    public User updateProfile(String token, User updatedUser) {
        User user = getCurrentUser(token);

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
        User user = getCurrentUser(token);

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