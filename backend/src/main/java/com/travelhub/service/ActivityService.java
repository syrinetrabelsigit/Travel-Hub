package com.travelhub.service;

import com.travelhub.dto.ActivitySearchRequest;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ActivityService {

    public List<Map<String, Object>> searchActivities(ActivitySearchRequest request) {
        // Mock data réaliste basé sur de vraies attractions touristiques
        return getMockActivitiesByCity(request.getDestination(), request.getCategory());
    }

    private List<Map<String, Object>> getMockActivitiesByCity(String destination, String category) {
        Map<String, List<Map<String, Object>>> citiesActivities = new HashMap<>();

        // PARIS
        List<Map<String, Object>> parisActivities = Arrays.asList(
                createActivity("ACT001", "Visite guidée du Musée du Louvre", "culture", "Paris", "2h30", 45.00, 4.8),
                createActivity("ACT002", "Tour Eiffel avec accès sommet", "culture", "Paris", "2h", 35.00, 4.9),
                createActivity("ACT003", "Croisière sur la Seine", "culture", "Paris", "1h30", 25.00, 4.6),
                createActivity("ACT004", "Visite de Versailles", "culture", "Paris", "Journée", 85.00, 4.7),
                createActivity("ACT005", "Dégustation de vins français", "food", "Paris", "3h", 75.00, 4.5)
        );
        citiesActivities.put("paris", parisActivities);

        // TUNIS
        List<Map<String, Object>> tunisActivities = Arrays.asList(
                createActivity("ACT101", "Visite de la Médina de Tunis", "culture", "Tunis", "3h", 30.00, 4.7),
                createActivity("ACT102", "Excursion à Sidi Bou Saïd", "culture", "Tunis", "4h", 40.00, 4.9),
                createActivity("ACT103", "Safari désert du Sahara", "adventure", "Tunis", "Journée", 120.00, 4.8),
                createActivity("ACT104", "Visite de Carthage", "culture", "Tunis", "3h", 35.00, 4.6),
                createActivity("ACT105", "Cuisine tunisienne traditionnelle", "food", "Tunis", "2h30", 50.00, 4.5)
        );
        citiesActivities.put("tunis", tunisActivities);

        // LONDRES
        List<Map<String, Object>> londonActivities = Arrays.asList(
                createActivity("ACT201", "British Museum Tour", "culture", "London", "2h", 25.00, 4.8),
                createActivity("ACT202", "Tower of London", "culture", "London", "3h", 30.00, 4.7),
                createActivity("ACT203", "Thames River Cruise", "culture", "London", "1h30", 20.00, 4.6),
                createActivity("ACT204", "Harry Potter Studio Tour", "culture", "London", "4h", 85.00, 4.9),
                createActivity("ACT205", "London Eye", "adventure", "London", "45min", 35.00, 4.7)
        );
        citiesActivities.put("london", londonActivities);

        // ROME
        List<Map<String, Object>> romeActivities = Arrays.asList(
                createActivity("ACT301", "Colosseum & Roman Forum", "culture", "Rome", "3h", 55.00, 4.9),
                createActivity("ACT302", "Vatican Museums & Sistine Chapel", "culture", "Rome", "4h", 65.00, 4.8),
                createActivity("ACT303", "Cooking Class Italian Cuisine", "food", "Rome", "3h30", 80.00, 4.7),
                createActivity("ACT304", "Trevi Fountain & Pantheon Walk", "culture", "Rome", "2h", 25.00, 4.6),
                createActivity("ACT305", "Vespa Tour of Rome", "adventure", "Rome", "3h", 95.00, 4.8)
        );
        citiesActivities.put("rome", romeActivities);

        String cityKey = destination.toLowerCase();
        List<Map<String, Object>> activities = citiesActivities.getOrDefault(cityKey, parisActivities);

        // Filtrer par catégorie si spécifiée
        if (category != null && !category.isEmpty()) {
            return activities.stream()
                    .filter(act -> category.equals(act.get("category")))
                    .toList();
        }

        return activities;
    }

    private Map<String, Object> createActivity(String id, String name, String category,
                                               String city, String duration, double price, double rating) {
        Map<String, Object> activity = new HashMap<>();
        activity.put("id", id);
        activity.put("name", name);
        activity.put("category", category);
        activity.put("destination", city);
        activity.put("duration", duration);
        activity.put("price", price);
        activity.put("currency", "EUR");
        activity.put("rating", rating);
        activity.put("reviews", (int)(Math.random() * 500 + 100));
        activity.put("included", Arrays.asList("Guide francophone", "Entrées"));

        // ✅ Ajouter l'image dans les deux champs pour compatibilité
        String imageUrl = getActivityImage(name);
        activity.put("imageUrl", imageUrl);
        activity.put("image", imageUrl); // ✅ AJOUTER CE CHAMP AUSSI

        return activity;
    }

    // ✅ NOUVELLE MÉTHODE
    private String getActivityImage(String activityName) {
        Map<String, String> images = new HashMap<>();

        // PARIS
        images.put("Visite guidée du Musée du Louvre", "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800");
        images.put("Tour Eiffel avec accès sommet", "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800");
        images.put("Croisière sur la Seine", "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800");
        images.put("Visite de Versailles", "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800");
        images.put("Dégustation de vins français", "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800");

        // TUNIS
        images.put("Visite de la Médina de Tunis", "https://images.unsplash.com/photo-1546412414-e1885259563a?w=800");
        images.put("Excursion à Sidi Bou Saïd", "https://images.unsplash.com/photo-1577647143143-c7e4d9db4b5e?w=800");
        images.put("Safari désert du Sahara", "https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?w=800");
        images.put("Visite de Carthage", "https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=800");
        images.put("Cuisine tunisienne traditionnelle", "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800");

        // LONDON
        images.put("British Museum Tour", "https://images.unsplash.com/photo-1529260830199-42c24126f198?w=800");
        images.put("Tower of London", "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800");
        images.put("Thames River Cruise", "https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800");
        images.put("Harry Potter Studio Tour", "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800");
        images.put("London Eye", "https://images.unsplash.com/photo-1543832923-44667a44c804?w=800");

        // ROME
        images.put("Colosseum & Roman Forum", "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800");
        images.put("Vatican Museums & Sistine Chapel", "https://images.unsplash.com/photo-1520768182668-ef5d00634f3c?w=800");
        images.put("Cooking Class Italian Cuisine", "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800");
        images.put("Trevi Fountain & Pantheon Walk", "https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800");
        images.put("Vespa Tour of Rome", "https://images.unsplash.com/photo-1569254343540-4e7d9c3f86c4?w=800");

        // Image par défaut
        return images.getOrDefault(activityName, "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800");
    }

    public Map<String, Object> getActivityById(String id) {
        Map<String, Object> activity = new HashMap<>();
        activity.put("id", id);
        activity.put("name", "Activité " + id);
        activity.put("price", 35.00);
        activity.put("currency", "EUR");
        activity.put("rating", 4.7);
        activity.put("duration", "3 heures");
        return activity;
    }
}