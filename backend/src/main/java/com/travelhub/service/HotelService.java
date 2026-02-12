package com.travelhub.service;

import com.travelhub.dto.HotelSearchRequest;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class HotelService {

    public List<Map<String, Object>> searchHotels(HotelSearchRequest request) {
        return getMockHotelsByCity(request.getDestination());
    }

    private List<Map<String, Object>> getMockHotelsByCity(String destination) {
        Map<String, List<Map<String, Object>>> citiesHotels = new HashMap<>();

        // PARIS
        List<Map<String, Object>> parisHotels = Arrays.asList(
                createHotel("HT001", "Hôtel Le Bristol Paris", "Paris", 5, 4.9, 450.00,
                        "112 Rue du Faubourg Saint-Honoré", "Luxe, Spa, Restaurant étoilé"),
                createHotel("HT002", "Pullman Paris Tour Eiffel", "Paris", 4, 4.7, 280.00,
                        "18 Avenue de Suffren", "Vue Tour Eiffel, Piscine, Wifi gratuit"),
                createHotel("HT003", "Ibis Budget Paris La Villette", "Paris", 2, 4.2, 85.00,
                        "31 Avenue Corentin Cariou", "Économique, Petit-déjeuner, Parking"),
                createHotel("HT004", "Novotel Paris Les Halles", "Paris", 4, 4.5, 190.00,
                        "8 Place Marguerite de Navarre", "Centre-ville, Fitness, Bar"),
                createHotel("HT005", "Hôtel Lutetia", "Paris", 5, 4.8, 650.00,
                        "45 Boulevard Raspail", "Palace, Spa Akasha, Gastronomie")
        );
        citiesHotels.put("paris", parisHotels);

        // TUNIS
        List<Map<String, Object>> tunisHotels = Arrays.asList(
                createHotel("HT101", "The Residence Tunis", "Tunis", 5, 4.8, 180.00,
                        "Les Côtes de Carthage", "Plage privée, Spa, Golf"),
                createHotel("HT102", "Movenpick Hotel du Lac Tunis", "Tunis", 5, 4.7, 150.00,
                        "Avenue Mohamed V", "Lac de Tunis, Piscine, Restaurant"),
                createHotel("HT103", "Golden Tulip El Mechtel", "Tunis", 4, 4.3, 95.00,
                        "Avenue Ouled Haffouz", "Centre-ville, Wifi, Petit-déjeuner"),
                createHotel("HT104", "Sheraton Tunis Hotel", "Tunis", 5, 4.6, 175.00,
                        "Avenue de la Ligue Arabe", "Business, Spa, Centre de conférences"),
                createHotel("HT105", "Dar El Medina", "Tunis", 4, 4.9, 120.00,
                        "64 Rue Sidi Ben Arous", "Médina, Traditionnel, Terrasse")
        );
        citiesHotels.put("tunis", tunisHotels);

        // LONDON
        List<Map<String, Object>> londonHotels = Arrays.asList(
                createHotel("HT201", "The Savoy", "London", 5, 4.9, 550.00,
                        "Strand", "Luxe historique, Thames view, Afternoon tea"),
                createHotel("HT202", "Premier Inn London Tower Bridge", "London", 3, 4.5, 150.00,
                        "159 Tower Bridge Road", "Vue pont, Petit-déjeuner, Wifi"),
                createHotel("HT203", "Hilton London Paddington", "London", 4, 4.4, 220.00,
                        "146 Praed Street", "Gare Paddington, Restaurant, Fitness"),
                createHotel("HT204", "citizenM Tower of London", "London", 4, 4.7, 180.00,
                        "40 Trinity Square", "Design moderne, Rooftop bar, Tech"),
                createHotel("HT205", "The Langham", "London", 5, 4.8, 480.00,
                        "1C Portland Place", "Heritage, Spa, Michelin star")
        );
        citiesHotels.put("london", londonHotels);

        // ROME
        List<Map<String, Object>> romeHotels = Arrays.asList(
                createHotel("HT301", "Hotel Hassler Roma", "Rome", 5, 4.9, 680.00,
                        "Piazza Trinità dei Monti 6", "Vue Spanish Steps, Michelin, Spa"),
                createHotel("HT302", "NH Collection Roma Centro", "Rome", 4, 4.6, 195.00,
                        "Via del Corso 307", "Centre historique, Rooftop, Wifi"),
                createHotel("HT303", "B&B Hotel Roma Trastevere", "Rome", 3, 4.3, 110.00,
                        "Via Portuense 102", "Trastevere, Économique, Parking"),
                createHotel("HT304", "Hotel Artemide", "Rome", 4, 4.7, 240.00,
                        "Via Nazionale 22", "Boutique hotel, Spa, Restaurant"),
                createHotel("HT305", "Rome Cavalieri Waldorf Astoria", "Rome", 5, 4.8, 550.00,
                        "Via Alberto Cadlolo 101", "Monte Mario, 3 Michelin stars, Grand spa")
        );
        citiesHotels.put("rome", romeHotels);

        String cityKey = destination.toLowerCase();
        return citiesHotels.getOrDefault(cityKey, parisHotels);
    }

    private Map<String, Object> createHotel(String id, String name, String city, int stars,
                                            double rating, double pricePerNight,
                                            String address, String amenities) {
        Map<String, Object> hotel = new HashMap<>();
        hotel.put("id", id);
        hotel.put("name", name);
        hotel.put("destination", city);
        hotel.put("stars", stars);
        hotel.put("rating", rating);
        hotel.put("pricePerNight", pricePerNight);
        hotel.put("currency", "EUR");
        hotel.put("address", address);
        hotel.put("amenities", Arrays.asList(amenities.split(", ")));
        hotel.put("reviews", (int)(Math.random() * 1000 + 500));
        hotel.put("availability", "Disponible");
        hotel.put("imageUrl", getHotelImage(name));
        return hotel;
    }

    public Map<String, Object> getHotelById(String id) {
        Map<String, Object> hotel = new HashMap<>();
        hotel.put("id", id);
        hotel.put("name", "Hôtel " + id);
        hotel.put("stars", 4);
        hotel.put("rating", 4.5);
        hotel.put("pricePerNight", 120.00);
        hotel.put("currency", "EUR");
        return hotel;
    }

    private String getHotelImage(String hotelName) {
        Map<String, String> images = new HashMap<>();

        images.put("Hôtel Le Bristol Paris", "https://images.unsplash.com/photo-1566073771259-6a8506099945");
        images.put("Pullman Paris Tour Eiffel", "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa");
        images.put("Ibis Budget Paris La Villette", "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267");
        images.put("Novotel Paris Les Halles", "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b");
        images.put("Hôtel Lutetia", "https://images.unsplash.com/photo-1590490360182-c33d57733427");

        // image par défaut si non trouvée
        return images.getOrDefault(hotelName,
                "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa");
    }

}