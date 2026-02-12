package com.travelhub.controller;

import com.travelhub.dto.MessageResponse;
import com.travelhub.model.User;
import com.travelhub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    // ==================== GET PROFILE ====================
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(
            @RequestHeader("Authorization") String authHeader
    ) {
        try {
            String token = authHeader.replace("Bearer ", "");
            User user = userService.getCurrentUser();
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // ==================== UPDATE PROFILE ====================
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody User user
    ) {
        try {
            String token = authHeader.replace("Bearer ", "");
            User updatedUser = userService.updateProfile(token, user);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // ==================== CHANGE PASSWORD ====================
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> passwords
    ) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String currentPassword = passwords.get("currentPassword");
            String newPassword = passwords.get("newPassword");

            userService.changePassword(token, currentPassword, newPassword);
            return ResponseEntity.ok(new MessageResponse("Mot de passe modifié avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
