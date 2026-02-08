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
        return activity;
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