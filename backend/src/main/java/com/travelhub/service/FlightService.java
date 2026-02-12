package com.travelhub.service;

import com.travelhub.dto.FlightSearchRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class FlightService {

    @Autowired
    private AmadeusService amadeusService;

    public List<Map<String, Object>> searchFlights(FlightSearchRequest request) {
        // Essayer d'utiliser Amadeus
        List<Map<String, Object>> amadeusFlights = amadeusService.searchFlights(
                request.getOrigin(),
                request.getDestination(),
                request.getDepartureDate(),
                request.getPassengers()
        );

        // Si Amadeus retourne des résultats, les utiliser
        if (!amadeusFlights.isEmpty()) {
            return amadeusFlights;
        }

        // Sinon, fallback sur mock data
        return getMockFlights(request);
    }

    // Mock data en backup
    private List<Map<String, Object>> getMockFlights(FlightSearchRequest request) {
        List<Map<String, Object>> flights = new ArrayList<>();

        Map<String, Object> flight1 = new HashMap<>();
        flight1.put("id", "FL001");
        flight1.put("airline", "Air France");
        flight1.put("origin", request.getOrigin());
        flight1.put("destination", request.getDestination());
        flight1.put("departureTime", request.getDepartureDate() + "T08:00:00");
        flight1.put("arrivalTime", request.getDepartureDate() + "T12:00:00");
        flight1.put("duration", "4h 00min");
        flight1.put("price", 250.00);
        flight1.put("currency", "EUR");
        flight1.put("cabinClass", request.getCabinClass());
        flight1.put("stops", 0);
        flights.add(flight1);
        flight1.put("airlineLogo", getAirlineLogo("Air France"));


        return flights;
    }

    private String getAirlineLogo(String airline) {
        return switch (airline) {
            case "Air France" -> "https://logo.clearbit.com/airfrance.com";
            case "Tunisair" -> "https://logo.clearbit.com/tunisair.com";
            default -> "https://via.placeholder.com/50";
        };
    }

    public Map<String, Object> getFlightById(String id) {
        Map<String, Object> flight = new HashMap<>();
        flight.put("id", id);
        flight.put("airline", "Air France");
        flight.put("origin", "TUN");
        flight.put("destination", "CDG");
        flight.put("departureTime", "2026-03-15T08:00:00");
        flight.put("arrivalTime", "2026-03-15T12:00:00");
        flight.put("duration", "4h 00min");
        flight.put("price", 250.00);
        flight.put("currency", "EUR");
        return flight;
    }
}