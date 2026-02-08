package com.travelhub.controller;

import com.travelhub.dto.MessageResponse;
import com.travelhub.model.FrequentTraveler;
import com.travelhub.model.UserPreferences;
import com.travelhub.service.UserPreferencesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users/preferences")
@CrossOrigin(origins = "http://localhost:3000")
public class UserPreferencesController {

    @Autowired
    private UserPreferencesService userPreferencesService;

    @GetMapping
    public ResponseEntity<?> getPreferences() {
        try {
            UserPreferences prefs = userPreferencesService.getPreferences();
            return ResponseEntity.ok(prefs);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping
    public ResponseEntity<?> updatePreferences(@RequestBody UserPreferences preferences) {
        try {
            UserPreferences updated = userPreferencesService.updatePreferences(preferences);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/frequent-travelers")
    public ResponseEntity<?> addFrequentTraveler(@RequestBody FrequentTraveler traveler) {
        try {
            UserPreferences updated = userPreferencesService.addFrequentTraveler(traveler);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/frequent-travelers/{index}")
    public ResponseEntity<?> removeFrequentTraveler(@PathVariable int index) {
        try {
            UserPreferences updated = userPreferencesService.removeFrequentTraveler(index);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}