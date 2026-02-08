package com.travelhub.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class FoursquareService {

    @Value("${foursquare.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<Map<String, Object>> searchActivities(double latitude, double longitude, String category) {
        List<Map<String, Object>> activities = new ArrayList<>();

        try {
            String url = String.format(
                    "https://api.foursquare.com/v3/places/search?ll=%f,%f&categories=%s&limit=10",
                    latitude, longitude, getCategoryCode(category)
            );

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", apiKey);
            headers.set("Accept", "application/json");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    Map.class
            );

            if (response.getBody() != null && response.getBody().containsKey("results")) {
                List<Map<String, Object>> results = (List<Map<String, Object>>) response.getBody().get("results");

                for (Map<String, Object> place : results) {
                    Map<String, Object> activity = new HashMap<>();

                    activity.put("id", place.get("fsq_id"));
                    activity.put("name", place.get("name"));

                    // Catégories
                    if (place.containsKey("categories")) {
                        List<Map<String, Object>> categories = (List<Map<String, Object>>) place.get("categories");
                        if (!categories.isEmpty()) {
                            activity.put("category", categories.get(0).get("name"));
                        }
                    }

                    // Localisation
                    if (place.containsKey("location")) {
                        Map<String, Object> location = (Map<String, Object>) place.get("location");
                        activity.put("address", location.get("address"));
                        activity.put("city", location.get("locality"));
                    }

                    // Distance
                    if (place.containsKey("distance")) {
                        activity.put("distance", place.get("distance"));
                    }

                    // Prix et note (simulés pour la démo)
                    activity.put("price", 25 + (Math.random() * 75)); // 25-100€
                    activity.put("currency", "EUR");
                    activity.put("rating", 3.5 + (Math.random() * 1.5)); // 3.5-5.0
                    activity.put("duration", getRandomDuration());

                    activities.add(activity);
                }
            }

        } catch (Exception e) {
            System.err.println("Foursquare API Error: " + e.getMessage());
            e.printStackTrace();
        }

        return activities;
    }

    private String getCategoryCode(String category) {
        // Codes de catégories Foursquare
        Map<String, String> categories = new HashMap<>();
        categories.put("culture", "10000"); // Arts & Entertainment
        categories.put("food", "13000"); // Food & Drink
        categories.put("adventure", "16000"); // Outdoors & Recreation
        categories.put("nature", "16000"); // Outdoors & Recreation

        return categories.getOrDefault(category, "10000");
    }

    private String getRandomDuration() {
        String[] durations = {"1 heure", "2 heures", "3 heures", "Demi-journée", "Journée complète"};
        return durations[(int)(Math.random() * durations.length)];
    }
}